# FROM owasp/modsecurity-crs:4.13.0-nginx-202504070504
FROM owasp/modsecurity:nginx
# FROM nginx:1.28

RUN apt-get update && \
    apt-get install -y \
      libmodsecurity3

# Créer la structure de dossiers
RUN mkdir -p /etc/nginx/modsecurity/rules

RUN rm -f /etc/nginx/conf.d/*

# Copier les fichiers de configuration
COPY Nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY Nginx/modsecurity/modsecurity.conf /etc/nginx/modsecurity/modsecurity.conf
COPY Nginx/modsecurity/crs-setup.conf /etc/nginx/modsecurity/crs-setup.conf
COPY Nginx/modsecurity/rules/ /etc/nginx/modsecurity/rules/

RUN chmod 444 /etc/nginx/conf.d/default.conf
RUN cat /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
