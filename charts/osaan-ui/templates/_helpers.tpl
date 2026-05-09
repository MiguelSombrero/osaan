{{- define "osaan-ui.name" -}}
{{- .Values.name | required ".Values.name is required" }}
{{- end }}

{{- define "osaan-ui.svcName" -}}
{{- .Values.svcName | required ".Values.svcName is required" }}
{{- end }}

{{- define "osaan-ui.configMapName" -}}
{{- printf "%s-config" .Values.name }}
{{- end }}
