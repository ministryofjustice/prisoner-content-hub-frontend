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

    - name: HUB_API_ENDPOINT
      valueFrom:
        configMapKeyRef:
          name: {{ .Values.application.contentConfigMapName }}
          key: internalUrl

    - name: ELASTICSEARCH_ENDPOINT
      value: {{ include "prisoner-content-hub-frontend.elasticsearchServiceHost" . }}

    - name: ELASTICSEARCH_INDEX_NAME
      value: "content_index"

    - name: DRUPAL_DATABASE_NAME
      valueFrom:
        secretKeyRef:
          name: {{ .Values.application.dbSecretName }}
          key: database_name

    - name: FEEDBACK_URL
      value: {{ include "prisoner-content-hub-frontend.feedbackUrl" . }}

    - name: NPR_STREAM
      valueFrom:
        configMapKeyRef:
          name: {{ .Values.application.nprConfigMapName }}
          key: externalUrl

    - name: ANALYTICS_ENDPOINT
      value: "https://www.google-analytics.com/collect"

    - name: ANALYTICS_SITE_ID
      value: {{ .Values.application.config.analyticsSiteId }}

    - name: SENTRY_DSN
      value: {{ .Values.application.sentry_dsn }}

    - name: SENTRY_ENVIRONMENT
      value: {{ .Values.application.sentry_environment }}

    - name: SENTRY_RELEASE
      value: {{ .Values.application.sentry_release }}

    - name: ENABLE_MOCK_AUTH
      value: {{ .Values.application.config.mockAuthEnabled | quote }}

    - name: HOTJAR_ID
      value: {{ .Values.hotJarId | quote }}

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

{{- end -}}
