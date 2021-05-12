FROM node:14-alpine

RUN apk add --no-cache git \
  python \
  make

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_DATE

# Create app directory
WORKDIR /home/node/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN CYPRESS_INSTALL_BINARY=0  npm ci --no-audit npm install

# Bundle app source
COPY . /home/node/app

# Add curl
RUN apk add --update \
  curl \
  && rm -rf /var/cache/apk/*

# Generate styles
RUN ./node_modules/node-sass/bin/node-sass $@ \
  /home/node/app/assets/sass/style.scss \
  /home/node/app/assets/stylesheets/application.css

ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV GIT_REF=${GIT_REF}
ENV GIT_DATE=${GIT_DATE}

RUN apk del git

EXPOSE 3000
RUN chown -R 1000:1000 /home/node/app

USER 1000
CMD [ "npm", "start" ]
