{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "prisoner-content-hub-frontend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "prisoner-content-hub-frontend.fullname" -}}
{{ if .Values.fullnameOverride -}}
{{ .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else -}}
{{ .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "prisoner-content-hub-frontend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "prisoner-content-hub-frontend.labels" -}}
chart: {{ include "prisoner-content-hub-frontend.chart" . }}
{{ include "prisoner-content-hub-frontend.selectorLabels" . }}
heritage: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "prisoner-content-hub-frontend.selectorLabels" -}}
app: {{ include "prisoner-content-hub-frontend.name" . }}
release: {{ .Release.Name }}
tier: {{ .Values.tier }}
{{- end }}

{{/*
Create internal Kubernetes hostname
*/}}
{{- define "prisoner-content-hub-frontend.internalHost" -}}
{{- printf "http://%s.%s.svc.cluster.local" (include "prisoner-content-hub-frontend.fullname" .) .Release.Namespace }}
{{- end }}

{{/*
Create internal ES Kubernetes hostname
*/}}
{{- define "prisoner-content-hub-frontend.elasticsearchServiceHost" -}}
{{- printf "http://%s.%s.svc.cluster.local:9200" .Values.application.config.elasticsearchServiceName .Release.Namespace }}
{{- end }}

{{/*
Create a feedback URL
*/}}
{{- define "prisoner-content-hub-frontend.feedbackUrl" -}}
{{- printf "http://%s.%s.svc.cluster.local:9200%s" .Values.application.config.feedbackServiceName .Release.Namespace .Values.application.config.feedbackEndpoint }}
{{- end }}

{{/*
Create external Kubernetes hostname
*/}}
{{- define "prisoner-content-hub-frontend.externalHost" -}}
{{- $protocol := "http" }}
{{- if .Values.ingress.tlsEnabled }}
{{- $protocol = "https" }}
{{- end }}
{{- printf "%s://%s" $protocol .Values.ingress.hostName }}
{{- end }}
