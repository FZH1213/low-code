FROM nginx:1.18
ADD dist.tar  /home/project/html/
COPY nginx.conf /etc/nginx/nginx.conf
