# STAGE 1 - DOWNLOAD/CONVERT ASSETS
FROM node:17 AS converter

COPY . /converter/

WORKDIR /converter/

RUN ["yarn", "install"]

RUN ["yarn", "start"]

# STAGE 2 - SERVE ASSETS
FROM nginx:latest AS runner

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=converter /converter/assets/ /usr/share/nginx/html