#!/bin/bash

#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

npm install -D vuepress

npm install

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
echo 'jdk.plus' > CNAME

git config --global user.email "deploy@jdk.plus"
git config --global user.name "deploy"

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

#git push -f git@github.com:JDK-Plus/jdk-document.git master

cd -

