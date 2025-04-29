# FROM owasp/modsecurity-crs:4.13.0-nginx-202504070504
# FROM nginx:1.28.0

FROM nginx:1.28

RUN apt-get update && \
    apt-get install -y \
      libmodsecurity3

    


# COPY Nginx/nginx.conf /etc/nginx/nginx.conf

COPY Nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
