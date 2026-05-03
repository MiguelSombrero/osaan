{{- define "osaan-microservice.name" -}}
{{- .Values.name | required ".Values.name is required" }}
{{- end }}

{{- define "osaan-microservice.svcName" -}}
{{- .Values.svcName | required ".Values.svcName is required" }}
{{- end }}

{{- define "osaan-microservice.configMapName" -}}
{{- printf "%s-config" .Values.name }}
{{- end }}
