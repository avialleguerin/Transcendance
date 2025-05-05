# FROM owasp/modsecurity-crs:4.13.0-nginx-202504070504
FROM owasp/modsecurity:nginx
# FROM nginx:1.28

RUN apt-get update && \
		apt-get install -y \
			libmodsecurity3 \
		&& rm -rf /var/lib/apt/lists/*

# 3) Créer les dossiers « template » et ModSecurity
RUN mkdir -p \
      /etc/nginx/templates/conf.d \
      /etc/nginx/templates/modsecurity.d \
      /etc/modsecurity.d/rules

RUN mkdir -p /etc/nginx/includes \
			&& cp /etc/nginx/templates/includes/proxy_backend.conf.template /etc/nginx/includes/proxy_backend.conf \
			&& cp /etc/nginx/templates/includes/location_common.conf.template /etc/nginx/includes/location_common.conf

# 3.5) desactiver le script chiant
RUN rm /docker-entrypoint.d/90-copy-modsecurity-config.sh

# 4) Copier tes fichiers « template » Nginx
# COPY Nginx/conf.d/default.conf /etc/nginx/templates/conf.d/default.conf.template
# COPY Nginx/modsecurity/modsecurity.conf /etc/nginx/templates/modsecurity.d/modsecurity.conf.template
# COPY Nginx/modsecurity/crs-setup.conf /etc/nginx/templates/modsecurity.d/crs-setup.conf.template
# COPY Nginx/modsecurity/rules/ /etc/nginx/templates/modsecurity.d/rules/.template


# 5) Copier ta config ModSecurity (ta structure)
COPY Nginx/conf.d/default.conf						/etc/nginx/conf.d/default.conf
COPY Nginx/modsecurity/modsecurity.conf		/etc/modsecurity.d/modsecurity.conf
COPY Nginx/modsecurity/crs-setup.conf			/etc/modsecurity.d/crs-setup.conf
COPY Nginx/modsecurity/rules/							/etc/modsecurity.d/rules/

# 6) Copier ton nginx.conf principal (avec load_module & include templates)
COPY Nginx/nginx.conf											/etc/nginx/nginx.conf

# 7) On laisse optionnellement envsubst actif ou non
ENV NGINX_ENVSUBST_TEMPLATE_DIR=off

CMD ["nginx", "-g", "daemon off;"]
