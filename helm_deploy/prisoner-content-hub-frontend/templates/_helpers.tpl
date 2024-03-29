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
Create a string from a list of values joined by a comma
*/}}
{{- define "app.joinListWithComma" -}}
{{- $local := dict "first" true -}}
{{- range $k, $v := . -}}{{- if not $local.first -}},{{- end -}}{{- $v -}}{{- $_ := set $local "first" false -}}{{- end -}}
{{- end -}}
