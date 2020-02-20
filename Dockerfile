FROM nginx:1.17.2-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY nginx/SSL.crt /etc/ssl/
COPY nginx/SSL.key /etc/ssl/
COPY build/. /var/www/html

