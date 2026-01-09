# 🔧 Fix: Error 405 Method Not Allowed en Polling de Video

**Fecha**: 9 de enero de 2026  
**Problema**: Error 405 al consultar estado del video  
**Causa**: Variable de entorno faltante en Netlify  
**Estado**: ⚠️ REQUIERE ACCIÓN

---

## 🐛 Problema

### Error en Consola
```
❌ [fal.ai Video] Error HTTP 500:
{error: 'Error: Error parseando respuesta: 405: Method Not Allowed'}

POST https://www.estudio56.cl/.netlify/functions/check-video-status 500
```

### Causa Raíz
La app está intentando usar **Netlify Functions** en lugar del **Cloudflare Worker** porque la variable de entorno `REACT_APP_USE_VIDEO_WORKER` **NO está configurada en Netlify**.

### Flujo Actual (Incorrecto)
```
React App
  ↓
videoProgressAlert.ts detecta: USE_CLOUDFLARE_WORKER = false (por defecto)
  ↓
Usa falAiService (Netlify Functions)
  ↓
POST /.netlify/functions/check-video-status
  ↓
❌ Error 405: Method Not Allowed
```

### Flujo Esperado (Correcto)
```
React App
  ↓
videoProgressAlert.ts detecta: USE_CLOUDFLARE_WORKER = true
  ↓
Usa falAiVideoWorkerService (Cloudflare Worker)
  ↓
POST https://estudio56-video-worker.brifyaimaster.workers.dev/check-status
  ↓
✅ Respuesta exitosa
```

---

## ✅ Solución

### Paso 1: Agregar Variable en Netlify

1. **Ir a Netlify Dashboard**
   - URL: https://app.netlify.com/sites/estudio56/configuration/env

2. **Agregar Nueva Variable**
   - Click en "Add a variable" o "New variable"
   - Key: `REACT_APP_USE_VIDEO_WORKER`
   - Value: `true`
   - Scope: "All deploys" (todos los deploys)

3. **Guardar**
   - Click en "Save"

### Paso 2: Agregar URL del Worker (si no existe)

También necesitas la URL del Worker:

1. **En el mismo panel de variables**
   - Key: `REACT_APP_VIDEO_WORKER_URL`
   - Value: `https://estudio56-video-worker.brifyaimaster.workers.dev`
   - Scope: "All deploys"

2. **Guardar**

### Paso 3: Trigger Redeploy

Netlify debería hacer redeploy automáticamente, pero si no:

1. Ir a: https://app.netlify.com/sites/estudio56/deploys
2. Click en "Trigger deploy" → "Clear cache and deploy site"

---

## 📸 Captura de Pantalla de Referencia

Las variables deberían verse así en Netlify:

```
Environment Variables:
┌─────────────────────────────────┬──────────────────────────────────────────────────┐
│ Key                             │ Value                                            │
├─────────────────────────────────┼──────────────────────────────────────────────────┤
│ REACT_APP_USE_VIDEO_WORKER      │ true                                             │
│ REACT_APP_VIDEO_WORKER_URL      │ https://estudio56-video-worker.brifyaimaster...  │
│ FAL_AI_API_KEY                  │ ********************************                 │
│ ...                             │ ...                                              │
└─────────────────────────────────┴──────────────────────────────────────────────────┘
```

---

## 🧪 Verificación

### Después del Redeploy

1. **Abrir la app en producción**
   - URL: https://www.estudio56.cl

2. **Abrir consola del navegador**
   - F12 o Cmd+Option+I

3. **Generar un video**
   - Ir a sección de videos
   - Ingresar prompt
   - Click "Generar Video"

4. **Verificar logs**
   Deberías ver:
   ```
   🚀 [Worker] Generando borrador via Cloudflare Worker...
   ✅ [Worker] Respuesta recibida
   🔄 [Worker] Consultando estado via Worker
   ```

   **NO deberías ver**:
   ```
   ❌ Error 405: Method Not Allowed
   POST /.netlify/functions/check-video-status
   ```

---

## 🔍 Diagnóstico Adicional

### Verificar Variable en Build Logs

Después del redeploy, revisar los logs de build en Netlify:

```
Build environment variables:
  REACT_APP_USE_VIDEO_WORKER=true
  REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker...
```

Si no aparece, la variable no está configurada correctamente.

### Verificar en Runtime

En la consola del navegador, ejecutar:
```javascript
console.log('USE_WORKER:', process.env.REACT_APP_USE_VIDEO_WORKER);
```

Debería mostrar: `USE_WORKER: true`

---

## ⚠️ Notas Importantes

### Variables con Prefijo REACT_APP_

En React/Vite, las variables de entorno **DEBEN** tener el prefijo `REACT_APP_` para estar disponibles en el cliente.

### Redeploy Necesario

Cambiar variables de entorno **requiere un redeploy** para que tomen efecto. No basta con guardarlas.

### Caché del Navegador

Si después del redeploy sigue fallando:
1. Limpiar caché del navegador (Cmd+Shift+R o Ctrl+Shift+R)
2. Abrir en ventana incógnita
3. Verificar que el deploy se completó correctamente

---

## 🎯 Checklist de Verificación

- [ ] Variable `REACT_APP_USE_VIDEO_WORKER=true` agregada en Netlify
- [ ] Variable `REACT_APP_VIDEO_WORKER_URL` agregada en Netlify
- [ ] Redeploy completado exitosamente
- [ ] Build logs muestran las variables
- [ ] Consola del navegador muestra logs del Worker
- [ ] No hay errores 405 en consola
- [ ] Video se genera correctamente

---

## 🔗 Enlaces Útiles

### Netlify Dashboard
- Variables: https://app.netlify.com/sites/estudio56/configuration/env
- Deploys: https://app.netlify.com/sites/estudio56/deploys
- Build logs: Click en el deploy más reciente

### Cloudflare Worker
- Dashboard: https://dash.cloudflare.com
- Worker URL: https://estudio56-video-worker.brifyaimaster.workers.dev
- Health check: https://estudio56-video-worker.brifyaimaster.workers.dev/health

---

## 📚 Documentación Relacionada

- `QUE-HACER-AHORA-WORKER.md` - Guía de próximos pasos
- `CLOUDFLARE-WORKER-VIDEO-SETUP.md` - Setup completo
- `ESTADO-FINAL-WORKER-9-ENERO.md` - Estado del Worker

---

## 🚀 Resumen

**Problema**: Error 405 porque usa Netlify Functions en lugar de Worker  
**Causa**: Variable `REACT_APP_USE_VIDEO_WORKER` no configurada  
**Solución**: Agregar variable en Netlify y hacer redeploy  
**Tiempo**: 5 minutos  

Una vez configurada la variable, el sistema usará el Cloudflare Worker y los errores 405 desaparecerán.
