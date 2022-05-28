FROM nginx:latest AS runner

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=converter /converter/assets/ /usr/share/nginx/html