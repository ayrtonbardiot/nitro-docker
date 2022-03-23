FROM node:17

COPY . /client/

WORKDIR /client/

RUN [ "npm", "i", "--legacy-peer-deps" ]

ENTRYPOINT [ "npm", "start" ]