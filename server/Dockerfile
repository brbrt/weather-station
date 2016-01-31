FROM ubuntu:trusty

RUN apt-get update
RUN apt-get install -y git nodejs npm

RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g bower

ADD package.json /tmp/npm/package.json
RUN cd /tmp/npm && npm install
RUN mkdir -p /webapp && cp -a /tmp/npm/node_modules /webapp

ADD public/bower.json /tmp/bower/bower.json
RUN cd /tmp/bower && bower install --allow-root
RUN cp -a /tmp/bower /webapp/public

ADD . /webapp
WORKDIR /webapp

EXPOSE 3636
CMD ["node", "index.js", "--storagePath", "/weatherdata", "--measurement:obsoleteTimeout", "120"]
