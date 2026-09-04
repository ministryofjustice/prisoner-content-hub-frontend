FROM mcr.microsoft.com/playwright:v1.62.1-jammy
WORKDIR /app

COPY .allowed-scripts.mjs .
COPY .npmrc .
COPY package.json .
COPY package-lock.json .
COPY playwright.config.ts .
COPY tsconfig.json .
ADD tests tests
ADD utils utils
ADD fixtures fixtures
ADD stepDefinition stepDefinition
ADD framework framework

ENV CI=1
RUN npm run setup
