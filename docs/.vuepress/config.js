const nav = require('./config/nav.js');
const base = require('../../base.js');
const htmlModules = require('./config/htmlModules.js');

module.exports = {
    title: "JDK-PLUS",
    description: '一个基于VuePress的 知识管理&博客 主题',
    base, // '/<仓库名>/'， 默认'/'
    head: [ // 注入到页面<head> 中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]
        ['link', {rel: 'icon', href: '/img/favicon.ico'}], //favicons，资源放在public文件夹
        ['meta', {name: 'keywords', content: 'JDK-PLUS,jdk-plus,Jdk-Plus'}],
        ['meta', {name: 'theme-color', content: '#11a8cd'}], // 移动浏览器主题颜色
        [
            'script',
            {
                'data-ad-client': 'ca-pub-7828333725993554',
                async: 'async',
                src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
            },
        ], // 网站关联Google AdSense 与 html格式广告支持

        // 以下是vuepress-plugin-demo-block插件所需依赖
        // ['script', { src: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js' }], // 此文件会影响导航router-link-active样式的切换，改为在enhanceApp.js中把Vue构造函数绑定到window上
        // ['script', { src: 'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js' }],
    ],
    markdown: {
        lineNumbers: true // 代码行号
    },
    // theme: 'vdoing', // 使用依赖包主题
    theme: require.resolve('../../theme-vdoing'), // 使用本地主题
    themeConfig: { // 主题配置
        nav,
        sidebarDepth: 2, // 侧边栏显示深度，默认1，最大2（显示到h3标题）
        logo: '/img/jdk-plus.png', // 导航栏logo
        repo: 'JDK-Plus/doc', // 导航栏右侧生成Github链接
        searchMaxSuggestions: 10, // 搜索结果显示最大数
        lastUpdated: '上次更新', // 更新的时间，及前缀文字   string | boolean (取值为git提交时间)

        // docsDir: 'docs', // 编辑的文件夹
        // editLinks: true, // 编辑链接
        // editLinkText: '编辑',

        // 以下配置是Vdoing主题改动的和新增的配置
        sidebar: {mode: 'structuring', collapsable: false}, // 侧边栏  'structuring' | { mode: 'structuring', collapsable: Boolean} | 'auto' | 自定义    温馨提示：目录页数据依赖于结构化的侧边栏数据，如果你不设置为'structuring',将无法使用目录页

        categoriesBar: {
            // 分类信息
            show: false,
        },
        editLinks: true, // 启用编辑
        editLinkText: '编辑',

        blogger: {
            // 博主信息，显示在首页侧边栏
            avatar: 'https://jdk.plus/img/EB-logo.png',
            name: 'JDK-PLUS',
            slogan: '沉着、勇猛、有辨别、不自私。',
            show: false,
        },
        tagBar: {
            show: false
        },

        // sidebarOpen: false, // 初始状态是否打开侧边栏，默认true
        updateBar: { // 最近更新栏
            showToArticle: false, // 显示到文章页底部，默认true
            // moreArticle: '/archives' // “更多文章”跳转的页面，默认'/archives'
        },
        // titleBadge: false, // 文章标题前的图标是否显示，默认true
        // titleBadgeIcons: [ // 文章标题前图标的地址，默认主题内置图标
        //   '图标地址1',
        //   '图标地址2'
        // ],
        // bodyBgImg: [
        //   'https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175828.jpeg',
        //   'https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175845.jpeg',
        //   'https://cdn.jsdelivr.net/gh/xugaoyi/image_store/blog/20200507175846.jpeg'
        // ], // body背景大图，默认无。 单张图片 String || 多张图片 Array, 多张图片时每隔15秒换一张。


        // categoryText: '随笔', // 碎片化文章（_posts文件夹的文章）预设生成的分类值，默认'随笔'

        // contentBgStyle: 1,

        comment: true, // 是否自动打开评论
        category: true, // 是否打开分类功能，默认true。 如打开，会做的事情有：1. 自动生成的frontmatter包含分类字段 2.页面中显示与分类相关的信息和模块 3.自动生成分类页面（在@pages文件夹）。如关闭，则反之。
        tag: true, // 是否打开标签功能，默认true。 如打开，会做的事情有：1. 自动生成的frontmatter包含标签字段 2.页面中显示与标签相关的信息和模块 3.自动生成标签页面（在@pages文件夹）。如关闭，则反之。
        // archive: false, // 是否打开归档功能，默认true。 如打开，会做的事情有：1.自动生成归档页面（在@pages文件夹）。如关闭，则反之。

        author: { // 文章默认的作者信息，可在md文件中单独配置此信息 String | {name: String, href: String}
            name: 'JDK-PLUS', // 必需
            href: 'https://github.com/JDK-Plus' // 可选的
        },
        social: { // 社交图标，显示于博主信息栏和页脚栏
            // iconfontCssFile: '//at.alicdn.com/t/font_1678482_u4nrnp8xp6g.css', // 可选，阿里图标库在线css文件地址，对于主题没有的图标可自由添加
            icons: [
                {
                    iconClass: 'icon-youjian',
                    title: '发邮件',
                    link: 'mailto:dev@jdk.plus'
                },
                {
                    iconClass: 'icon-github',
                    title: 'GitHub',
                    link: 'https://github.com/JDK-Plus'
                }
            ]
        },
        footer: { // 页脚信息
            createYear: 2021, // 博客创建年份
            copyrightInfo: 'JDK-PLUS | dev@jdk.plus | MIT License', // 博客版权信息，支持a标签
        },
        htmlModules,
    },
    plugins: [ // 插件
        [require('./plugins/love-me'), { // 鼠标点击爱心特效
            color: '#11a8cd', // 爱心颜色，默认随机色
            excludeClassName: 'theme-vdoing-content' // 要排除元素的class, 默认空''
        }],
        [
            'vuepress-plugin-helper-live2d',
            {
                // 是否开启控制台日志打印(default: false)
                log: false,
                live2d: {
                    // 是否启用(关闭请设置为false)(default: true)
                    enable: true,
                    // 模型名称(default: hibiki)>>>取值请参考：
                    // https://github.com/JoeyBling/hexo-theme-yilia-plus/wiki/live2d%E6%A8%A1%E5%9E%8B%E5%8C%85%E5%B1%95%E7%A4%BA
                    model: 'hibiki',
                    display: {
                        position: "right", // 显示位置：left/right(default: 'right')
                        width: 135, // 模型的长度(default: 135)
                        height: 300, // 模型的高度(default: 300)
                        hOffset: 65, //  水平偏移(default: 65)
                        vOffset: 0, //  垂直偏移(default: 0)
                    },
                    mobile: {
                        show: false // 是否在移动设备上显示(default: false)
                    },
                    react: {
                        opacity: 0.8 // 模型透明度(default: 0.8)
                    }
                }
            }
        ],
        ["vuepress-plugin-sakura", {
            num: 50,  // 默认数量
            show: true, //  是否显示
            zIndex: 1,   // 层级
            img: {
                replace: false,  // false 默认图 true 换图 需要填写httpUrl地址
                httpUrl: '...'     // 绝对路径
            }
        }],

        [
            'vuepress-plugin-zooming', // 放大图片
            {
                selector: '.theme-vdoing-content img:not(.no-zoom)', // 排除class是no-zoom的图片
                options: {
                    bgColor: 'rgba(0,0,0,0.6)',
                },
            },
        ],
        [
            'vuepress-plugin-comment', // 评论
            {
                choosen: 'gitalk',
                options: {
                    clientID: 'f257f47b99a7b94d77d4',
                    clientSecret: '45ef29a3cac2e7c32cf8c0de5556a97be4676f59',
                    repo: 'doc', // GitHub 仓库
                    owner: 'JDK-PLUS', // GitHub仓库所有者
                    admin: ['Pf-G'], // 对仓库有写权限的人
                    // distractionFreeMode: true,
                    pagerDirection: 'last', // 'first'正序 | 'last'倒序
                    id: '<%- (frontmatter.permalink || frontmatter.to.path).slice(-16) %>', //  页面的唯一标识,长度不能超过50
                    title: '「评论」<%- frontmatter.title %>', // GitHub issue 的标题
                    labels: ['Gitalk', 'Comment'], // GitHub issue 的标签
                    body:
                        '页面：<%- window.location.origin + (frontmatter.to.path || window.location.pathname) %>', // GitHub issue 的内容
                },
            },
        ],

        ['thirdparty-search', { // 可以添加第三方搜索链接的搜索框（原官方搜索框的参数仍可用）
            thirdparty: [ // 可选，默认 []
                {
                    title: '在GitHub中搜索',
                    frontUrl: 'https://github.com/search?q=', // 搜索链接的前面部分
                    behindUrl: '' // 搜索链接的后面部分，可选，默认 ''
                },
                {
                    title: '在npm中搜索',
                    frontUrl: 'https://www.npmjs.com/search?q=',
                },
                {
                    title: '在Bing中搜索',
                    frontUrl: 'https://cn.bing.com/search?q='
                }
            ]
        }],

        [
            'vuepress-plugin-baidu-tongji', // 百度统计
            {
                hm: '01293bffa6c3962016c08ba685c79d78'
            }
        ],

        ['one-click-copy', { // 代码块复制按钮
            copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
            copyMessage: '复制成功', // default is 'Copy successfully and then paste it for use.'
            duration: 1000, // prompt message display time.
            showInMobile: false // whether to display on the mobile side, default: false.
        }],
        ['demo-block', { // demo演示模块 https://github.com/xiguaxigua/vuepress-plugin-demo-block
            settings: {
                // jsLib: ['http://xxx'], // 在线示例(jsfiddle, codepen)中的js依赖
                // cssLib: ['http://xxx'], // 在线示例中的css依赖
                // vue: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js', // 在线示例中的vue依赖
                jsfiddle: false, // 是否显示 jsfiddle 链接
                codepen: true, // 是否显示 codepen 链接
                horizontal: false // 是否展示为横向样式
            }
        }],
        [
            'vuepress-plugin-zooming', // 放大图片
            {
                selector: '.theme-vdoing-content img:not(.no-zoom)',
                options: {
                    bgColor: 'rgba(0,0,0,0.6)'
                },
            },
        ],
        [
            '@vuepress/last-updated', // "上次更新"时间格式
            {
                transformer: (timestamp, lang) => {
                    const dayjs = require('dayjs') // https://day.js.org/
                    return dayjs(timestamp).format('YYYY/MM/DD, HH:mm:ss')
                },
            }
        ]
    ],

    // configureWebpack: {
    //   //webpack别名 如![Image from alias](~@alias/image.png)
    //   resolve: {
    //     alias: {
    //       '@alias': 'path/to/some/dir'
    //     }
    //   }
    // }
}
