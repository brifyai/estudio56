# 🔧 FIX CRÍTICO: URL de Polling Incorrecta en Fal.ai
**Fecha**: 9 de Enero 2026  
**Problema**: Video llega al 100% pero se ve negro - URL de polling incorrecta

---

## 🐛 PROBLEMA IDENTIFICADO

### Logs de Netlify (Última Ejecución)
```
Jan 9, 12:48:30 AM: c4cd12e5 INFO   📊 [Fal.ai Video] Status URL: https://queue.fal.run/fal-ai/pika/requests/ef015779-9bea-4f59-9d35-0f0b5b00492b/status
```

### Análisis del Problema

**URL que Fal.ai devuelve** (correcta):
```
https://queue.fal.run/fal-ai/pika/requests/{id}/status
```

**URL que el código está construyendo** (incorrecta - en fallback):
```
https://queue.fal.run/fal-ai/pika/v2/turbo/text-to-video/requests/{id}/status
```

**Causa Raíz**: 
El código tiene un fallback que construye la URL manualmente cuando `statusUrl` no está disponible, pero esa URL construida es **incorrecta** porque incluye el path completo del modelo (`/v2/turbo/text-to-video`).

**Código problemático** (línea 48 de `check-video-operation.ts`):
```typescript
const url = statusUrl || `https://queue.fal.run/fal-ai/pika/requests/${taskId}/status`;
```

Este fallback es correcto, PERO el problema es que `statusUrl` podría no estar llegando correctamente desde el frontend.

---

## 🔍 ANÁLISIS DEL FLUJO

### 1. Backend devuelve statusUrl ✅
**netlify/functions/generate-video.ts** (líneas 153-157):
```typescript
return {
  statusCode: 202,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    taskId: data.request_id,
    statusUrl: data.status_url,  // ✅ Se devuelve correctamente
    status: 'IN_QUEUE'
  }),
};
```

### 2. Frontend recibe statusUrl ❓
**services/vertexVideoService.ts** (líneas 155-157):
```typescript
// Guardar statusUrl para usarlo en el polling
const statusUrl = (result as any).statusUrl;
console.log('📊 [Fal.ai Video] Status URL para polling:', statusUrl);
```

**PROBLEMA POTENCIAL**: `result` es el objeto parseado de la respuesta, pero necesitamos verificar que `statusUrl` esté en la estructura correcta.

### 3. Frontend pasa statusUrl al polling ✅
**services/vertexVideoService.ts** (línea 179):
```typescript
const status = await checkVideoTask(result.taskId, statusUrl);
```

### 4. Polling usa statusUrl ✅
**netlify/functions/check-video-operation.ts** (líneas 34, 48):
```typescript
statusUrl = body.statusUrl; // URL completa proporcionada por Fal.ai
const url = statusUrl || `https://queue.fal.run/fal-ai/pika/requests/${taskId}/status`;
```

---

## 🎯 CAUSA RAÍZ IDENTIFICADA

El problema está en **cómo se extrae `statusUrl` del resultado** en `vertexVideoService.ts`.

**Código actual** (línea 156):
```typescript
const statusUrl = (result as any).statusUrl;
```

**Problema**: `result` es el objeto devuelto por `generateVideo()`, que tiene esta estructura:
```typescript
{
  taskId: string,
  status: 'processing',
  requestId?: string
}
```

Pero `statusUrl` NO está en el tipo `VideoGenerationResult`, por lo que TypeScript lo ignora y queda `undefined`.

---

## ✅ SOLUCIÓN

### Paso 1: Actualizar el tipo VideoGenerationResult

**services/vertexVideoService.ts** (líneas 13-23):

```typescript
export interface VideoGenerationResult {
  videoUrl?: string;
  taskId?: string;
  statusUrl?: string;  // ⬅️ AGREGAR ESTA LÍNEA
  status: 'processing' | 'complete' | 'error' | 'failed' | 'expired';
  error?: string;
  requestId?: string;
  submitTime?: string;
  endTime?: string;
  originalPrompt?: string;
  actualPrompt?: string;
}
```

### Paso 2: Devolver statusUrl en generateVideo

**services/vertexVideoService.ts** (líneas 50-56):

```typescript
// Si es 202, la tarea está en proceso
if (response.status === 202) {
  console.log('🔄 [Fal.ai Video] Video en proceso. Task ID:', data.taskId);
  return {
    taskId: data.taskId,
    statusUrl: data.statusUrl,  // ⬅️ AGREGAR ESTA LÍNEA
    status: 'processing',
    requestId: data.requestId
  };
}
```

### Paso 3: Verificar que se pasa correctamente

**services/vertexVideoService.ts** (líneas 155-157):

```typescript
// Guardar statusUrl para usarlo en el polling
const statusUrl = result.statusUrl;  // ⬅️ CAMBIAR de (result as any) a result
console.log('📊 [Fal.ai Video] Status URL para polling:', statusUrl);
```

---

## 🧪 VERIFICACIÓN

Después de aplicar el fix, los logs deberían mostrar:

```
📊 [Fal.ai Video] Status URL para polling: https://queue.fal.run/fal-ai/pika/requests/{id}/status
🌐 [Fal.ai Poll] URL de consulta: https://queue.fal.run/fal-ai/pika/requests/{id}/status
```

Y NO:
```
📊 [Fal.ai Video] Status URL para polling: undefined
🌐 [Fal.ai Poll] URL de consulta: https://queue.fal.run/fal-ai/pika/v2/turbo/text-to-video/requests/{id}/status
```

---

## 📋 ARCHIVOS A MODIFICAR

1. ✅ `services/vertexVideoService.ts`
   - Agregar `statusUrl?: string` al tipo `VideoGenerationResult`
   - Devolver `statusUrl` en el objeto de respuesta
   - Cambiar `(result as any).statusUrl` a `result.statusUrl`

---

## 🎯 IMPACTO ESPERADO

- ✅ La URL de polling será la correcta proporcionada por Fal.ai
- ✅ El polling funcionará sin errores 405
- ✅ El video se generará y descargará correctamente
- ✅ No más videos negros o fallback a imagen estática

---

**Estado**: 🔧 LISTO PARA APLICAR FIX

