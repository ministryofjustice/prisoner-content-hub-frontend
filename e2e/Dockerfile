FROM mcr.microsoft.com/playwright:v1.58.2-jammy
WORKDIR /app

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

