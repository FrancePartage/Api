FROM node:12.19.0-alpine3.9 AS nestjs

EXPOSE 3333
EXPOSE 5555

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf
RUN npm install -g @nestjs/cli

RUN npm install

COPY . .

COPY docker/nodejs/docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint

ENTRYPOINT ["/usr/local/bin/docker-entrypoint"]