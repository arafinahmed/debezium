{{/*
Expand the name of the chart.
*/}}
{{- define "debezium.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{/*
Create a default fullname using the release name and the chart name.
*/}}
{{- define "debezium.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else }}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "debezium.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "debezium.labels.connect" -}}
helm.sh/chart: {{ include "debezium.chart" . }}
{{ include "debezium.selectorLabels.connect" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}


{{/*
Selector labels
*/}}
{{- define "debezium.selectorLabels.connect" -}}
app.kubernetes.io/name: {{ include "debezium.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/app: connect
{{- end }}

{{- define "debezium.selectorLabels.ui" -}}
app.kubernetes.io/name: {{ include "debezium.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/app: ui
{{- end }}
