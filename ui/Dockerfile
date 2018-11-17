FROM node:8.12.0-alpine as builder

RUN apk add --no-cache git
RUN npm install -g bower

WORKDIR /webapp

ADD bower.json /webapp/
RUN bower install --allow-root

COPY ./ /webapp/


FROM nginx:mainline-alpine

COPY --from=builder /webapp /usr/share/nginx/html
COPY weather-station.conf /etc/nginx/conf.d/weather-station.conf
