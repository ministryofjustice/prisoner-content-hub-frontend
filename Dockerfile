# First stage
FROM node:16.13-bullseye-slim as builder

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_DATE

RUN apt-get update && \
    apt-get upgrade -y

WORKDIR /app

COPY . .

RUN npm ci --no-audit --production && \
    npm run build && \
    export BUILD_NUMBER=${BUILD_NUMBER:-1_0_0} && \
    export GIT_REF=${GIT_REF:-dummy} && \
    export GIT_DATE="${GIT_DATE:-dummy}" && \
    npm run record-build-info

# Second stage
FROM node:16.13-bullseye-slim
LABEL maintainer="HMPPS Digital Studio <info@digital.justice.gov.uk>"

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

RUN addgroup --gid 2000 --system appgroup && \
    adduser --uid 2000 --system appuser --gid 2000

RUN mkdir /app && chown appuser:appgroup /app

WORKDIR /app

COPY --from=builder --chown=appuser:appgroup /app /app

ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV GIT_REF=${GIT_REF}
ENV GIT_DATE=${GIT_DATE}
ENV PORT=3000

EXPOSE 3000
USER 2000
CMD [ "npm", "start" ]
