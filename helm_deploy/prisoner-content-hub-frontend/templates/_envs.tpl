{{/* vim: set filetype=mustache: */}}
{{/*
Environment variables for web and worker containers
*/}}
{{- define "deployment.envs" }}
env:
    - name: HMPPS_AUTH_CLIENT_ID
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: hmppsAuthClientId

    - name: HMPPS_AUTH_CLIENT_SECRET
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: hmppsAuthClientSecret

    - name: HMPPS_AUTH_BASE_URL
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: hmppsAuthBaseUrl

    - name: PRISON_API_BASE_URL
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: prisonApiBaseUrl

    - name: PRISONER_CONTACT_REGISTRY_BASE_URL
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: prisonerContactRegistryApiBaseUrl

    - name: INCENTIVES_API_BASE_URL
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: incentivesApiBaseUrl

    - name: ADJUDICATIONS_API_BASE_URL
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: adjudicationsApiBaseUrl

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

    - name: ENABLE_MOCK_AUTH
      value: {{ .Values.application.config.mockAuthEnabled | quote }}

    - name: CACHE_SECRET
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: cacheSecret

    - name: AZURE_AD_CLIENT_ID
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: azureAdClientId

    - name: AZURE_AD_CLIENT_SECRET
      valueFrom:
        secretKeyRef:
          name: {{ include "prisoner-content-hub-frontend.fullname" . }}
          key: azureAdClientSecret

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
{{- end -}}
