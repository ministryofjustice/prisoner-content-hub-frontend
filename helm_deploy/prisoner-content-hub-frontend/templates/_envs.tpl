{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
    - name: HUB_API_ENDPOINT
      valueFrom:
        configMapKeyRef:
          name: {{ .Values.application.contentConfigMapName }}
          key: internalUrl

    - name: ELASTICSEARCH_ENDPOINT
      valueFrom:
        secretKeyRef:
          name: {{ .Values.application.openSearchSecretName }}
          key: proxy_url

    - name: FEEDBACK_ENDPOINT
      value: {{ .Values.application.config.feedbackEndpoint }}

    - name: NPR_STREAM
      valueFrom:
        configMapKeyRef:
          name: {{ .Values.application.nprConfigMapName }}
          key: externalUrl

    - name: ANALYTICS_ENDPOINT
      value: "https://www.google-analytics.com/collect"

    - name: ANALYTICS_SITE_ID
      value: {{ .Values.application.config.analyticsSiteId }}

    - name: GOOGLE_TAG_MANAGER_SITE_ID
      value: {{ .Values.application.config.googleTagManagerSiteId }}

    - name: SENTRY_DSN
      value: {{ .Values.application.sentry_dsn }}

    - name: SENTRY_ENVIRONMENT
      value: {{ .Values.application.sentry_environment }}

    - name: SENTRY_RELEASE
      value: {{ .Values.application.sentry_release }}

    - name: APPINSIGHTS_INSTRUMENTATIONKEY
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: appInsightsSecret

    - name: CACHE_SECRET
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: cacheSecret

    - name: REDIS_HOST
      valueFrom:
        secretKeyRef:
          name: frontend-redis
          key: primary_endpoint_address

    - name: REDIS_AUTH_TOKEN
      valueFrom:
        secretKeyRef:
          name: frontend-redis
          key: auth_token

    - name: REDIS_TLS_ENABLED
      value: {{ .Values.application.config.REDIS_TLS_ENABLED }}
      value: "true"

    - name: SINGLE_HOST_NAME
      value: {{ .Values.ingress.host }}

    - name: FEEDBACK_DATABASE_NAME
      valueFrom:
        secretKeyRef:
          name: prisoner-feedback-rds
          key: database_name

    - name: FEEDBACK_DATABASE_USERNAME
      valueFrom:
        secretKeyRef:
          name: prisoner-feedback-rds
          key: database_username

    - name: FEEDBACK_DATABASE_PASSWORD
      valueFrom:
        secretKeyRef:
          name: prisoner-feedback-rds
          key: database_password

    - name: FEEDBACK_DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: prisoner-feedback-rds
          key: rds_instance_address
{{- end -}}
