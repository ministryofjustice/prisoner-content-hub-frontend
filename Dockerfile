# First stage
FROM node:24-alpine AS builder

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_DATE

RUN apk update && \
    apk upgrade -y

WORKDIR /app

# Cache breaking and ensure required build / git args defined
RUN test -n "$BUILD_NUMBER" || (echo "BUILD_NUMBER not set" && false)
RUN test -n "$GIT_REF" || (echo "GIT_REF not set" && false)

# Define env variables for runtime health / info
ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV GIT_REF=${GIT_REF}
ENV GIT_DATE=${GIT_DATE}

COPY . .

RUN npm run setup --no-audit --ignore-scripts && \
    npm run build && \
    export BUILD_NUMBER=${BUILD_NUMBER:-1_0_0} && \
    export GIT_REF=${GIT_REF:-dummy} && \
    export GIT_DATE="${GIT_DATE:-dummy}" && \
    npm run record-build-info && \
    npm prune --no-audit --omit=dev

# Second stage
FROM node:24-alpine
LABEL maintainer="HMPPS Digital Studio <info@digital.justice.gov.uk>"

RUN apk update && \
    apk upgrade -y && \
    apk autoremove -y && \
    rm -rf /var/lib/apk/lists/*

RUN addgroup --gid 2000 --system appgroup && \
    adduser --uid 2000 --system appuser --gid 2000

RUN mkdir /app && chown appuser:appgroup /app

WORKDIR /app
ADD --chown=appuser:appgroup --chmod=644 https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem /app/global-bundle.pem

COPY --from=builder --chown=appuser:appgroup \
        /app/package.json \
        /app/package-lock.json \
        /app/server.js \
        ./

COPY --from=builder --chown=appuser:appgroup \
        /app/server ./server

COPY --from=builder --chown=appuser:appgroup \
        /app/node_modules ./node_modules

COPY --from=builder --chown=appuser:appgroup \
        /app/utils ./utils

COPY --from=builder --chown=appuser:appgroup \
        /app/assets ./assets

ENV PORT=3000

EXPOSE 3000
USER 2000
CMD [ "npm", "start" ]
