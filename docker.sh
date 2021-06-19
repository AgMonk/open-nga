#!/bin/bash
# 项目名称
name='open-nga'
# 对外端口
port=11451
imgName=${name}-image:latest
docker container stop ${name}
docker container rm ${name}
docker image rm ${imgName}
docker build -t ${imgName} .
docker run -d -p ${port}:80 --name ${name} ${imgName}

rm -rf dist