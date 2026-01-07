# Implementación de Generación de Videos con Vertex AI

## 📋 Resumen

Se implementó la generación real de videos usando los modelos Veo de Google Cloud Vertex AI, reemplazando el sistema anterior que solo generaba imágenes estáticas.

## 🎬 Modelos de Video Implementados

### Draft (Rápido y Económico) - RECOMENDADO
- **Modelo**: `veo-3.1-fast-generate-preview`
- **Velocidad**: Muy rápida (~15-30 segundos)
- **Calidad**: Buena para previsualizaciones
- **Duración**: 6 segundos
- **Costo**: Más económico (~$0.05 USD por video)

### HD (Alta Calidad)
- **Modelo**: `veo-2.0-generate-preview`
- **Velocidad**: Lenta (~2-5 minutos)
- **Calidad**: Alta calidad cinematográfica
- **Duración**: 6 segundos
- **Costo**: ~$0.30 USD por video

## 🏗️ Arquitectura Implementada

### 1. Funciones de Netlify

#### `generate-video.ts`
- Inicia la generación de video en Vertex AI
- Retorna un `operationName` para hacer polling
- Timeout: 60 segundos

#### `check-video-operation.ts`
- Verifica el estado de una operación de video
- Retorna el progreso y el video cuando está completo
- Permite polling desde el frontend

### 2. Servicio Frontend

#### `vertexVideoService.ts`
Proporciona tres funciones principales:

```typescript
// Iniciar generación
generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult>

// Verificar estado
checkVideoOperation(operationName: string): Promise<VideoGenerationResult>

// Generar y esperar (con polling automático)
generateVideoAndWait(options, onProgress?): Promise<string>
```

### 3. Integración en App.tsx

El flujo de generación ahora:

1. Usuario selecciona "Video" como tipo de contenido
2. Usuario hace clic en "GENERAR VIDEO"
3. Se llama a `generateVideoAndWait()` con el prompt
4. Se muestra progreso en tiempo real
5. Cuando está listo, se muestra el video
6. Si falla, se genera una imagen estática como fallback

## 🔧 Configuración Requerida

### Variables de Entorno en Netlify

Asegúrate de tener configurada:

```
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

### Habilitar API en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Selecciona tu proyecto `stratega-ai-x`
3. Ve a "APIs & Services" > "Library"
4. Busca y habilita:
   - **Vertex AI API**
   - **Generative AI API**
5. Ve a "Model Garden" y habilita:
   - **Veo 2.0 Flash**
   - **Veo 2.0 Generate**

## 📊 Flujo de Usuario

```
Usuario selecciona Video
    ↓
Ingresa descripción del negocio
    ↓
Clic en "GENERAR VIDEO"
    ↓
[Backend] Inicia generación en Vertex AI
    ↓
[Frontend] Polling cada 5 segundos
    ↓
Muestra progreso: "GENERANDO_VIDEO 45%"
    ↓
Video completo → Se muestra en pantalla
```

## 🎯 Aspectos Ratios Soportados

- `9:16` - Stories de Instagram/TikTok (vertical)
- `16:9` - YouTube/Reels horizontal
- `1:1` - Posts cuadrados de Instagram

## ⚠️ Manejo de Errores

Si la generación de video falla:

1. Se captura el error
2. Se genera una imagen estática como fallback
3. Se muestra advertencia al usuario: "No se pudo generar el video. Se generó una imagen estática."
4. El usuario puede intentar de nuevo

## 💰 Costos Estimados

- **Draft (veo-3.1-fast)**: ~$0.05 USD por video ⭐ MÁS ECONÓMICO
- **HD (veo-2.0-generate)**: ~$0.30 USD por video

## 🚀 Próximos Pasos

1. **Monitorear**: Verificar que los videos se generen correctamente en producción
2. **Optimizar**: Ajustar prompts para mejor calidad de video
3. **Caché**: Implementar caché de videos generados
4. **Edición**: Agregar capacidad de editar videos generados

## 📝 Notas Técnicas

- Los videos se generan de forma asíncrona (operaciones de larga duración)
- El polling se hace cada 5 segundos con timeout de 5 minutos
- Los videos se retornan como URLs de Google Cloud Storage
- El formato de salida es MP4 con codec H.264

## 🔍 Debugging

Para verificar que funciona:

1. Abre la consola del navegador
2. Busca logs que empiecen con `🎬 [VertexVideo]`
3. Verifica que aparezca: "Video generado: [URL]"

Si hay errores:
- Verifica que las APIs estén habilitadas en Google Cloud
- Verifica que `GOOGLE_SERVICE_ACCOUNT_KEY` esté configurada
- Revisa los logs de Netlify Functions
