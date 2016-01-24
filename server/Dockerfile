FROM ubuntu:trusty

RUN apt-get update
RUN apt-get install -y git nodejs npm

RUN npm install -g bower

ADD . /data
WORKDIR /data

CMD "./build.sh"
EXPOSE 3636
CMD ["nodejs", "index.js"]
