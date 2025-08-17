FROM cypress/base:18.20.3
WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY reporter-config.json .
COPY cypress.config.js .
ADD cypress cypress



ENV CI=1
RUN npm ci

# verify that Cypress has been installed correctly.
RUN npx cypress verify

