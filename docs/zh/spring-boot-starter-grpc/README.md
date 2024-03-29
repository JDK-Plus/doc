---
title: 使用说明
order: 10
icon: edit
date: 2022-01-07
category:
    - Grpc
    - springboot
tag:
    - Grpc
---



## 引入依赖

```xml
<dependency>
    <groupId>plus.jdk.grpc</groupId>
    <artifactId>spring-boot-starter-grpc</artifactId>
    <version>1.1.01</version>
</dependency>
```

## 需要添加的配置项

```
# 是否开启grpc server
plus.jdk.grpc.enabled=true

plus.jdk.grpc.client.enabled=true

# 指定端口
plus.jdk.grpc.port=10400

# 指定监听的服务地址
plus.jdk.grpc.address=*

# 是否支持长连接
plus.jdk.grpc.enable-keep-alive=true

# 长连接超时断开时间
plus.jdk.grpc.keep-alive-timeout=111

# NioEventLoopGroup master核心线程数
plus.jdk.grpc.master-thread-num=1

# NioEventLoopGroup worker线程数
plus.jdk.grpc.worker-thread-num=10

# 数据包最大多少字节
plus.jdk.grpc.max-inbound-message-size=100000

# 发送的请求头最大限制
plus.jdk.grpc.max-inbound-metadata-size=100000
```
## 引入后如何使用

### 添加Protobuf如下：

```proto3
syntax = "proto3";

package plus.jdk.grpc.protoc;

option java_multiple_files = true;
option java_package = "plus.jdk.grpc.broadcast.test.protoc";
option java_outer_classname = "GreeterService";
option optimize_for = CODE_SIZE;


// The greeting service definition.
service Greeter {
    // Sends a greeting
    rpc SayHello (HelloRequest) returns (HelloReply) {}

    rpc SayHelloAgain (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
    string name = 1;
}

// The response message containing the greetings
message HelloReply {
    string message = 1;
}
```


### 指定全局的 ServiceInterceptor.

你需要实现 `GrpcServiceGlobalInterceptorConfigurer`， 并将其声明为一个bean实例

```java

import org.springframework.stereotype.Component;

@Component
public class GrpcServiceGlobalInterceptorConfigurer implements GrpcServiceInterceptorConfigurer {

    private final RSACipherService rsaCipherService;

    @Override
    public void configureServerInterceptors(List<ServerInterceptor> interceptors) {
        GrpcAuthServerInterceptor grpcAuthServerInterceptor =
                new GrpcAuthServerInterceptor(rsaCipherService);
        interceptors.add(grpcAuthServerInterceptor);
    }
}
```

### 如何根据上述的Protobuf结构定义一个Grpc service

```java
package plus.jdk.grpc.test.grpc;

import io.grpc.stub.StreamObserver;
import plus.jdk.grpc.annotation.GrpcService;
import plus.jdk.grpc.test.grpc.interceptor.AuthServerInterceptor;
import plus.jdk.grpc.test.protoc.GreeterGrpc;
import plus.jdk.grpc.test.protoc.HelloReply;
import plus.jdk.grpc.test.protoc.HelloRequest;

@GrpcService(interceptors = {AuthServerInterceptor.class})
public class GreeterImplService extends GreeterGrpc.GreeterImplBase {

    @Override
    public void sayHello(HelloRequest request, StreamObserver<HelloReply> responseObserver) {
        HelloReply reply = HelloReply.newBuilder().setMessage("Hello " + request.getName()).build();
        responseObserver.onNext(reply);
        responseObserver.onCompleted();
    }

    @Override
    public void sayHelloAgain(HelloRequest request, StreamObserver<HelloReply> responseObserver) {
        HelloReply reply = HelloReply.newBuilder().setMessage("Hello again " + request.getName()).build();
        responseObserver.onNext(reply);
        responseObserver.onCompleted();
    }
}
```

### 如何调用上文中定义的GRPC服务（客户端调用）


#### 定义声明一个远端的服务器集群

```bash

# 启动客户端的配置
plus.jdk.grpc.client.enabled=true

# 指定一个默认的连接地址, 指定后 @GrpcClient 注解就默认使用该值
plus.jdk.grpc.client.default-service=MyGrpc://grpc-service-prod

# 指定服务的scheme地址
plus.jdk.grpc.client.resolvers[0].scheme=MyGrpc

# 指定服务的host地址
plus.jdk.grpc.client.resolvers[0].service-name=grpc-service-prod

# 指定远端的GRPC服务列表
plus.jdk.grpc.client.resolvers[0].hosts[0]=192.168.1.108:10202
plus.jdk.grpc.client.resolvers[0].hosts[1]=192.168.1.107:10202
```
#### 从配置配置中心（如zookeeper、etcd、redis）读取集群配置信息

在很多情况下，为了保障服务的高可用性，我们会将集群信息存储在配置中心中统一下发，便于某个节点出现故障或扩容时快速新增节点.

你可以通过实现 `INameResolverConfigurer` 接口来实现上述功能。下文中将给出一个从redis中读取配置的示例：

```java
import io.grpc.EquivalentAddressGroup;
import org.springframework.stereotype.Component;
import plus.jdk.grpc.client.INameResolverConfigurer;
import plus.jdk.grpc.model.GrpcNameResolverModel;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Component
public class GrpcGlobalNameResolverConfigurer implements INameResolverConfigurer {

    private final RSACipherService rsaCipherService;

    private final CommonRedisService commonRedisService;

    public GrpcGlobalNameResolverConfigurer(RSACipherService rsaCipherService, CommonRedisService commonRedisService) {
        this.rsaCipherService = rsaCipherService;
        this.commonRedisService = commonRedisService;
    }

    protected String getGrpcNameResolverKeys() {
        return "GrpcNameResolverKeys";
    }

    /**
     * 该方法用于更新对应的uri下集群列表，默认每10秒执行一次
     */
    @Override
    public List<EquivalentAddressGroup> configurationName(URI targetUri) {
        GrpcNameResolverModel nameResolverModel =
                commonRedisService.hget(getGrpcNameResolverKeys(), targetUri.toString(), GrpcNameResolverModel.class);
        if (nameResolverModel == null) {
            return new ArrayList<>();
        }
        return nameResolverModel.toEquivalentAddressGroups();
    }

    /**
     * 该方法用于服务启动时集群列表的初始化
     */
    @Override
    public void configureNameResolvers(List<GrpcNameResolverModel> resolverModels) {
        commonRedisService.hScan(getGrpcNameResolverKeys(), "*", GrpcNameResolverModel.class, (result) -> {
            if (result == null || result.getData() == null) {
                return true;
            }
            resolverModels.add(result.getData());
            return true;
        });
    }
}
```

另外，你可以通过如下配置来指定集群实例列表同步周期：

```bash
# 指定每15秒刷新一次
plus.jdk.grpc.client.name-refresh-rate=15
```

#### 指定全局的`GrpcClientInterceptor`

同上文，你需要实现 `GrpcClientInterceptorConfigurer` 方法，添加对应的Interceptor

```java
import org.springframework.stereotype.Component;

@Component
public class GrpcClientInterceptorGlobalConfigurer implements GrpcClientInterceptorConfigurer {
    

    @Override
    public void configureClientInterceptors(List<ClientInterceptor> interceptors) {
        // do something
        interceptors.add(new GrpcClientRSAInterceptor(rsaCipherService));
    }
}
```

#### 编写代码执行远程调用：

```java
import io.grpc.ManagedChannelBuilder;
import org.springframework.stereotype.Component;

@Component
public class GRpcRunner implements ApplicationRunner {

    @Value("${plus.jdk.grpc.port}")
    private String grpcPort;

    @Resource
    private GrpcSubClientFactory grpcSubClientFactory;

    @GrpcClient("MyGrpc://grpc-service-prod")
    private GreeterGrpc.GreeterBlockingStub greeterBlockingStub;

    /**
     * 这里 @GrpcClient 默认使用 `plus.jdk.grpc.client.default-service` 配置项指定的值
     */
    @GrpcClient
    private GreeterGrpc.GreeterBlockingStub greeterBlockingStubDefault;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        int port = Integer.parseInt(grpcPort);
//        ManagedChannel channel = ManagedChannelBuilder.forTarget("MyGrpc://grpc-service-prod")
//                .usePlaintext().build();
//        GreeterGrpc.GreeterBlockingStub blockingStub = grpcSubClientFactory.createStub(GreeterGrpc.GreeterBlockingStub.class, channel);
        HelloRequest request = HelloRequest.newBuilder().setName("jdk-plus").build();
        HelloReply reply = greeterBlockingStub.sayHello(request);
        log.info("sayHello data:{}, receive:{}", request, reply);
        reply = blockingStub.sayHelloAgain(request);
        log.info("sayHelloAgain data:{}, receive:{}", request, reply);
        TimeUnit.SECONDS.sleep(1);
    }
}
```
