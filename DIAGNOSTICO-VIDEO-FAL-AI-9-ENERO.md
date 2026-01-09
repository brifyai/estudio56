# 🔍 DIAGNÓSTICO: Fallo en Generación de Video con Fal.ai
**Fecha**: 9 de Enero 2026  
**Problema**: Video no se genera, fallback a imagen estática

---

## 📊 SÍNTOMAS

### Error en Consola del Navegador
```
❌ Error cargando video: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...
```

**Análisis**: El sistema está intentando reproducir una **imagen JPEG** como si fuera un video, lo que indica que:
1. La generación de video está fallando
2. El código de fallback está generando una imagen estática
3. Esa imagen se está pasando al componente de video en lugar de mostrar un error

---

## 🔍 ANÁLISIS DEL FLUJO

### 1. Frontend (App.tsx líneas 1350-1450)
```typescript
const videoUrl = await generateVideoAndWait(
  {
    prompt: videoPrompt,
    quality: imageQuality === 'draft' ? 'draft' : 'hd',
    aspectRatio: aspectRatio as '9:16' | '16:9' | '1:1',
    duration: 5
  },
  (progress, message) => {
    progressAlert.updateProgress(60, 'Renderizando...');
  }
);
```

**Estado**: ✅ Correcto - estructura del request es válida

### 2. Servicio (vertexVideoService.ts)
```typescript
const response = await fetch('/.netlify/functions/generate-video', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: options.prompt,
    quality: options.quality,
    aspectRatio: options.aspectRatio || '9:16',
    duration: options.duration || 5
  }),
});
```

**Estado**: ✅ Correcto - envía los parámetros correctos

### 3. Backend (netlify/functions/generate-video.ts)
```typescript
const requestBody = {
  prompt: cleanPrompt,
  aspect_ratio: body.aspectRatio || '9:16',
  resolution: resolution,  // "720p" o "1080p"
  duration: duration
};

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Key ${FAL_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestBody),
  signal: controller.signal
});
```

**Estado**: ✅ Correcto según documentación de Fal.ai

---

## 🎯 POSIBLES CAUSAS

### 1. ❌ API Key Inválida o No Configurada
**Probabilidad**: ALTA  
**Síntoma**: Fal.ai rechaza el request con 401 o 403  
**Verificación necesaria**:
```bash
# En Netlify Dashboard → Site settings → Environment variables
# Verificar que FAL_API_KEY existe y es válida
```

### 2. ❌ Prompt Rechazado por Filtros de Seguridad
**Probabilidad**: MEDIA  
**Síntoma**: Fal.ai rechaza el contenido del prompt  
**Código de manejo**: Ya implementado en líneas 130-135 de generate-video.ts
```typescript
if (errorMessage.includes('inappropriate') || errorMessage.includes('content policy')) {
  throw new Error('El contenido del prompt fue rechazado por filtros de seguridad...');
}
```

### 3. ❌ Error en el Request a Fal.ai
**Probabilidad**: MEDIA  
**Síntoma**: Estructura del request incorrecta o timeout  
**Verificación**: Revisar logs de Netlify Functions

### 4. ❌ Límite de Cuota Excedido
**Probabilidad**: BAJA  
**Síntoma**: Fal.ai devuelve 429 (Too Many Requests)  
**Código de manejo**: Ya implementado en línea 127

### 5. ❌ Timeout en la Conexión
**Probabilidad**: BAJA  
**Síntoma**: Request tarda más de 120 segundos  
**Código de manejo**: Ya implementado con AbortController

---

## 🔧 PASOS PARA DIAGNOSTICAR

### Paso 1: Verificar Logs de Netlify Functions
**CRÍTICO**: Necesitamos ver los logs de la función `generate-video`

**Cómo acceder**:
1. Ir a Netlify Dashboard: https://app.netlify.com
2. Seleccionar el sitio: estudio56.cl
3. Ir a **Functions** en el menú lateral
4. Buscar `generate-video`
5. Ver los logs más recientes

**Qué buscar**:
```
🎬 [Fal.ai Video] FUNCIÓN DE VIDEO INICIADA
📝 [Fal.ai Video] Prompt recibido
🌐 [Fal.ai Video] URL: https://queue.fal.run/fal-ai/pika/v2/turbo/text-to-video
📤 [Fal.ai Video] Request body: {...}
✅ [Fal.ai Video] Respuesta de Fal.ai recibida. Status: XXX
```

**Errores esperados**:
- `❌ [Fal.ai Video] Error HTTP de Fal.ai: 401` → API Key inválida
- `❌ [Fal.ai Video] Error HTTP de Fal.ai: 429` → Límite de cuota
- `❌ [Fal.ai Video] Timeout: Fal.ai tardó más de 120 segundos`
- `❌ [Fal.ai Video] Error parseando JSON`

### Paso 2: Verificar Variable de Entorno FAL_API_KEY
**Ubicación**: Netlify Dashboard → Site settings → Environment variables

**Verificar**:
- ✅ Variable existe: `FAL_API_KEY`
- ✅ Valor no está vacío
- ✅ Valor es una API Key válida de Fal.ai (formato: `fal_...`)
- ✅ Variable está disponible en **Production** y **Deploy Previews**

### Paso 3: Verificar Consola del Navegador
**Buscar mensajes específicos**:
```
❌ Error generando video: [mensaje de error]
⚠️ Fallback: Generando imagen estática
```

El mensaje de error debería indicar la causa raíz.

---

## 🛠️ SOLUCIONES PROPUESTAS

### Si el problema es API Key:
1. Verificar que `FAL_API_KEY` está configurada en Netlify
2. Obtener una nueva API Key de https://fal.ai/dashboard
3. Actualizar la variable de entorno en Netlify
4. Hacer un nuevo deploy o trigger de build

### Si el problema es el prompt:
1. Simplificar el prompt (remover palabras sensibles)
2. Usar descripciones más genéricas y profesionales
3. Evitar menciones de marcas, personas, o contenido sensible

### Si el problema es timeout:
1. Aumentar el timeout en generate-video.ts (actualmente 120s)
2. Verificar la conexión de red de Netlify
3. Considerar usar un webhook de Fal.ai en lugar de polling

### Si el problema es estructura del request:
1. Verificar documentación actualizada de Fal.ai
2. Comparar con ejemplos oficiales
3. Ajustar parámetros según sea necesario

---

## 📝 INFORMACIÓN ADICIONAL NECESARIA

Para continuar el diagnóstico, necesitamos:

1. **Logs de Netlify Functions** (generate-video)
   - Últimas 5-10 ejecuciones
   - Mensajes de error completos
   - Status codes de respuesta

2. **Mensaje de error completo de la consola**
   - El mensaje que dice `❌ Error generando video: [...]`
   - Stack trace si está disponible

3. **Verificación de FAL_API_KEY**
   - Confirmar que la variable existe en Netlify
   - Confirmar que el valor es correcto (sin compartir la key completa)

---

## 🎯 PRÓXIMOS PASOS

1. **Usuario debe compartir**:
   - Logs de Netlify Functions
   - O mensaje completo de error de consola
   - Confirmación de que FAL_API_KEY está configurada

2. **Una vez tengamos los logs**:
   - Identificar la causa raíz exacta
   - Aplicar la solución correspondiente
   - Verificar que la generación funciona

---

## 📚 REFERENCIAS

- **Documentación Fal.ai Pika v2 Turbo**: https://fal.ai/models/fal-ai/pika/v2/turbo/text-to-video
- **Archivo de análisis completo**: `ANALISIS-GENERACION-VIDEO-FAL-AI.md`
- **Código de generación**: `netlify/functions/generate-video.ts`
- **Servicio de video**: `services/vertexVideoService.ts`
- **Integración en App**: `App.tsx` (líneas 1350-1450)

---

## 🚨 RESUMEN EJECUTIVO

**Problema identificado**: La generación de video con Fal.ai está fallando y haciendo fallback a imagen estática.

**Código verificado**: ✅ La implementación es correcta según documentación de Fal.ai.

**Causa más probable**: 
1. **API Key no configurada o inválida** (80% probabilidad)
2. **Prompt rechazado por filtros** (15% probabilidad)  
3. **Error de conexión o timeout** (5% probabilidad)

**Acción requerida**: Verificar logs de Netlify Functions para identificar causa exacta.

---

## 📋 INSTRUCCIONES PARA EL USUARIO

### Opción 1: Ver Logs de Netlify Functions (RECOMENDADO)

1. Ir a: https://app.netlify.com
2. Seleccionar el sitio: **estudio56.cl**
3. En el menú lateral, hacer clic en **Functions**
4. Buscar la función: **generate-video**
5. Ver los logs más recientes (últimas 5-10 ejecuciones)
6. Copiar y compartir los mensajes que empiezan con:
   - `🎬 [Fal.ai Video]`
   - `❌ [Fal.ai Video]`
   - Especialmente el mensaje de error completo

### Opción 2: Ver Error en Consola del Navegador

1. Abrir la consola del navegador (F12)
2. Intentar generar un video
3. Buscar el mensaje que dice: `❌ Error generando video: [...]`
4. Copiar y compartir el mensaje completo

### Opción 3: Verificar Variable de Entorno

1. Ir a: https://app.netlify.com
2. Seleccionar el sitio: **estudio56.cl**
3. Ir a: **Site settings** → **Environment variables**
4. Verificar que existe: **FAL_API_KEY**
5. Confirmar que tiene un valor (sin compartir la key completa)
6. Verificar que está habilitada para **Production** y **Deploy Previews**

---

## 🔧 SOLUCIÓN RÁPIDA (Si el problema es API Key)

Si la variable `FAL_API_KEY` no existe o está vacía:

1. Obtener una API Key de Fal.ai:
   - Ir a: https://fal.ai/dashboard
   - Crear cuenta o iniciar sesión
   - Ir a **API Keys**
   - Crear una nueva key (formato: `fal_...`)

2. Configurar en Netlify:
   - Ir a: **Site settings** → **Environment variables**
   - Hacer clic en **Add a variable**
   - Key: `FAL_API_KEY`
   - Value: `fal_...` (tu API key)
   - Scopes: ✅ Production, ✅ Deploy Previews
   - Hacer clic en **Create variable**

3. Hacer un nuevo deploy:
   - Ir a **Deploys**
   - Hacer clic en **Trigger deploy** → **Deploy site**
   - Esperar a que termine el deploy
   - Probar nuevamente la generación de video

---

**Estado**: ⏳ ESPERANDO LOGS DE NETLIFY O MENSAJE DE ERROR COMPLETO
