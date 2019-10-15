#!/usr/bin/env bash
image_version=`date +%Y%m%d%H%M`;
# 关闭shop_admin容器
docker stop myvue || true;
# 删除shop_admin容器
docker rm myvue || true;
# 删除shop/admin镜像
# 构建shop/admin:$image_version镜像
docker build -t myvue .
# 查看镜像列表
docker images;
# 基于shop/admin 镜像 构建一个容器 shop_admin
docker run -p 9527:80 -d --name myvue myvue
docker rmi -f  `docker images | grep '<none>' | awk '{print $3}'`
