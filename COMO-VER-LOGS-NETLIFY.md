# 🔍 Cómo Ver Logs de Netlify Functions

## Acceso Rápido a Logs

### Opción 1: Logs en Tiempo Real (Recomendado)

1. Ve a: https://app.netlify.com/sites/estudio56/functions
2. Busca la función `generate-video`
3. Haz clic en ella
4. Verás los logs en tiempo real

### Opción 2: Logs del Despliegue

1. Ve a: https://app.netlify.com/sites/estudio56/deploys
2. Haz clic en el último despliegue
3. Haz clic en "Function logs"

## 🎬 Logs Esperados para Video

### Si funciona correctamente:

```
🎬 [DEBUG] FUNCIÓN DE VIDEO INICIADA
🎬 [DEBUG] HTTP Method: POST
📝 [DEBUG] Prompt recibido (primeros 100 chars): Professional photo...
🎯 [DEBUG] Modelo: veo-3.1-fast-generate-preview
📐 [DEBUG] AspectRatio: 9:16
🔑 [DEBUG] GOOGLE_SERVICE_ACCOUNT_KEY existe: true
📧 [DEBUG] Service account email: xxx@xxx.iam.gserviceaccount.com
🔐 [DEBUG] Private key parseada correctamente
⏳ [DEBUG] Obteniendo token de acceso...
✅ [DEBUG] Token obtenido: ya29.xxx...
🏢 [DEBUG] Project ID: stratega-ai-x
🎯 [DEBUG] Vertex Model: veo-3.1-fast-generate-preview
📝 [DEBUG] Prompt limpio (primeros 100 chars): ...
🌐 [DEBUG] URL de Vertex AI: https://us-central1-aiplatform.googleapis.com/v1/...
⏳ [DEBUG] Enviando petición a Vertex AI...
✅ [DEBUG] Respuesta de Vertex AI recibida. Status: 200
📄 [DEBUG] Respuesta raw (primeros 500 chars): {"name":"projects/..."}
📊 [DEBUG] Respuesta keys: ['name', 'metadata']
🔄 [DEBUG] Operación de video iniciada: projects/.../operations/...
```

### Si hay error:

```
❌ [DEBUG] Error HTTP de Google: 400
❌ [DEBUG] Error details: {"error":{"code":400,"message":"..."}}
```

## 🐛 Errores Comunes

### Error 404: Modelo no encontrado

```json
{
  "error": {
    "code": 404,
    "message": "Publisher Model `projects/.../models/veo-3.1-fast-generate-preview` not found."
  }
}
```

**Solución**: El modelo no está habilitado en Google Cloud
1. Ve a https://console.cloud.google.com/vertex-ai/model-garden
2. Busca "Veo 3.1 Fast"
3. Haz clic en "Enable"

### Error 400: Request inválido

```json
{
  "error": {
    "code": 400,
    "message": "Invalid request..."
  }
}
```

**Solución**: La estructura del request no es correcta
- Verifica que el modelo soporte el método `:generateVideos`
- Verifica los parámetros del request body

### Error 403: Permisos insuficientes

```json
{
  "error": {
    "code": 403,
    "message": "Permission denied..."
  }
}
```

**Solución**: La service account no tiene permisos
1. Ve a https://console.cloud.google.com/iam-admin/iam
2. Busca tu service account
3. Agrega el rol: "Vertex AI User"

### Error 500: Error interno

```
❌ [DEBUG] Error fatal: Error: ...
```

**Solución**: Revisa los logs completos para ver el stack trace

## 📊 Verificar Estado del Modelo

Para verificar que el modelo está disponible:

```bash
# Usando gcloud CLI
gcloud ai models list \
  --region=us-central1 \
  --filter="displayName:veo"
```

O ve a:
https://console.cloud.google.com/vertex-ai/publishers/google/model-garden

## 🔧 Debugging Paso a Paso

1. **Verifica que el despliegue terminó**
   - https://app.netlify.com/sites/estudio56/deploys
   - Estado debe ser "Published"

2. **Prueba generar un video**
   - Ve a https://estudio56.netlify.app/panel
   - Selecciona "Video"
   - Ingresa descripción
   - Haz clic en "GENERAR VIDEO"

3. **Abre la consola del navegador** (F12)
   - Busca logs que empiecen con `🎬 [VertexVideo]`
   - Si hay error, copia el mensaje completo

4. **Ve a los logs de Netlify**
   - https://app.netlify.com/sites/estudio56/functions/generate-video
   - Busca el timestamp de tu prueba
   - Copia todos los logs

5. **Analiza el error**
   - Si es 404: Modelo no habilitado
   - Si es 400: Request inválido
   - Si es 403: Permisos insuficientes
   - Si es 500: Error en el código

## 📝 Información Útil para Reportar Errores

Si necesitas ayuda, incluye:

1. **Logs de Netlify Functions** (completos)
2. **Logs de la consola del navegador**
3. **Modelo que intentaste usar**: veo-3.1-fast-generate-preview
4. **Prompt que usaste**
5. **Aspect ratio**: 9:16, 16:9, o 1:1
6. **Timestamp** de cuando ocurrió el error

## 🎯 Próximos Pasos

Una vez que veas los logs, sabremos exactamente qué está fallando y podremos corregirlo.
