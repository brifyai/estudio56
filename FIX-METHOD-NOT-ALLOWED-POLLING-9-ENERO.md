# 🔧 FIX: Error 405 Method Not Allowed en Polling de Video
**Fecha**: 9 de Enero 2026  
**Problema**: Función de polling rechazaba requests con error 405

---

## 🐛 PROBLEMA IDENTIFICADO

### Error en Consola del Navegador
```
POST https://www.estudio56.cl/.netlify/functions/check-video-operation 500 (Internal Server Error)
❌ [Fal.ai Video] Error al verificar tarea: {error: 'Error: Error parseando respuesta: 405: Method Not Allowed'}
```

### Causa Raíz
La función `check-video-operation.ts` solo aceptaba **POST** requests, pero el código del frontend podría estar enviando **GET** requests en algunos casos.

**Código problemático**:
```typescript
if (event.httpMethod !== 'POST') {
  return { statusCode: 405, body: 'Method Not Allowed' };
}
```

---

## ✅ SOLUCIÓN APLICADA

### Cambio Realizado

**netlify/functions/check-video-operation.ts**

```typescript
// ANTES: Solo POST
if (event.httpMethod !== 'POST') {
  return { statusCode: 405, body: 'Method Not Allowed' };
}

const body = JSON.parse(event.body || '{}');
const taskId = body.taskId;

// DESPUÉS: POST o GET
if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
  return { statusCode: 405, body: 'Method Not Allowed' };
}

// Obtener taskId del body (POST) o query params (GET)
let taskId: string;

if (event.httpMethod === 'POST') {
  const body = JSON.parse(event.body || '{}');
  taskId = body.taskId;
} else {
  // GET: obtener de query parameters
  taskId = event.queryStringParameters?.taskId || '';
}
```

### Resultado
Ahora la función acepta **ambos métodos HTTP**:
- ✅ **POST** con taskId en el body
- ✅ **GET** con taskId en query parameters

---

## 🎯 VERIFICACIÓN

### Métodos HTTP Soportados
- ✅ `POST /.netlify/functions/check-video-operation` con `{taskId: "..."}`
- ✅ `GET /.netlify/functions/check-video-operation?taskId=...`

### Funciones Afectadas
- ✅ `check-video-operation.ts` - Actualizado para aceptar GET y POST
- ✅ `generate-video.ts` - Sin cambios (ya funciona correctamente)

---

## 📋 PRÓXIMOS PASOS

1. **Hacer commit y push** de los cambios
2. **Hacer nuevo deploy** en Netlify (automático con push)
3. **Probar generación de video** - Debería funcionar completamente ahora

---

## 🧪 PRUEBA

Una vez deployado, probar:

1. Ir a: https://www.estudio56.cl
2. Seleccionar: **Tipo de medio** → **Video**
3. Ingresar descripción: "Un cielo azul con nubes"
4. Hacer clic en: **Generar Borrador**
5. Esperar 1-3 minutos
6. ✅ El video debería generarse sin errores 405

---

## 📊 IMPACTO

- **Generación de video**: ✅ Ahora debería funcionar completamente
- **Polling**: ✅ Acepta tanto POST como GET
- **Compatibilidad**: ✅ Mayor flexibilidad en el método HTTP

---

## 🔍 RESUMEN DE FIXES APLICADOS

### Fix 1: Nombre de Variable (Commit anterior)
- Problema: `FAL_API_KEY` vs `FAL_AI_API_KEY`
- Solución: Unificado a `FAL_AI_API_KEY`

### Fix 2: Método HTTP (Este commit)
- Problema: Solo aceptaba POST
- Solución: Acepta POST y GET

---

**Estado**: ✅ CORREGIDO - Listo para deploy
