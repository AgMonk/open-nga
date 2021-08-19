#使用nginx镜像为基础镜像
FROM nginx
#将当前目录中的dist文件夹（即vue打包完成的文件夹）内容复制到 镜像的 /usr/share/nginx/html/ 文件夹（即nginx的静态文件根目录）
COPY ./dist/ /usr/share/nginx/html/
#将nginx.conf 文件复制到  /etc/nginx/nginx.conf 这是nginx的运行配置文件
COPY nginx.conf /etc/nginx/nginx.conf