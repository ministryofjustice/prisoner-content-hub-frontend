FROM cypress/base:12
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

