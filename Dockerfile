# Stage: build assets
FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine AS builder

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

# Cache breaking and ensure required build / git args defined
RUN test -n "$BUILD_NUMBER" || (echo "BUILD_NUMBER not set" && false)
RUN test -n "$GIT_REF" || (echo "GIT_REF not set" && false)
RUN test -n "$GIT_BRANCH" || (echo "GIT_BRANCH not set" && false)

WORKDIR /app

COPY package*.json .allowed-scripts.mjs .npmrc ./
RUN NPM_CONFIG_AUDIT=false NPM_CONFIG_FUND=false npm run setup
ENV NODE_ENV='production'

COPY . .
RUN BUILD_NUMBER="${BUILD_NUMBER}" GIT_REF="${GIT_REF}" GIT_BRANCH="${GIT_BRANCH}" npm run record-build-info
RUN npm run build
RUN npm prune --no-audit --no-fund --omit=dev

# Stage: copy production assets and dependencies
FROM ghcr.io/ministryofjustice/hmpps-node:24-alpine-runtime

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

WORKDIR /app
ADD --chown=appuser:appgroup --chmod=644 https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem /app/global-bundle.pem

COPY --from=builder --chown=appuser:appgroup \
        /app/package.json \
        /app/package-lock.json \
        /app/server.js \
        /app/build-info.json \
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
ENV BUILD_NUMBER=${BUILD_NUMBER}
ENV GIT_REF=${GIT_REF}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV NODE_ENV='production'
USER 2000

CMD [ "npm", "start" ]
