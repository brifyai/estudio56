# 📋 Instrucciones: Configurar Variable en Netlify

**Objetivo**: Hacer que la app use Cloudflare Worker en lugar de Netlify Functions  
**Tiempo**: 5 minutos  
**Dificultad**: Fácil

---

## 🎯 Paso a Paso

### 1. Abrir Netlify Dashboard

**URL**: https://app.netlify.com/sites/estudio56/configuration/env

O navegar manualmente:
1. Ir a https://app.netlify.com
2. Click en tu sitio "estudio56"
3. Click en "Site configuration" (menú izquierdo)
4. Click en "Environment variables"

---

### 2. Agregar Primera Variable

**Click en "Add a variable" o "New variable"**

Llenar el formulario:
```
Key:   REACT_APP_USE_VIDEO_WORKER
Value: true
Scopes: ✓ All deploys
```

**Click en "Create variable" o "Save"**

---

### 3. Agregar Segunda Variable

**Click en "Add a variable" nuevamente**

Llenar el formulario:
```
Key:   REACT_APP_VIDEO_WORKER_URL
Value: https://estudio56-video-worker.brifyaimaster.workers.dev
Scopes: ✓ All deploys
```

**Click en "Create variable" o "Save"**

---

### 4. Verificar Variables

Deberías ver en la lista:

```
REACT_APP_USE_VIDEO_WORKER
  Production: true
  Deploy previews: true
  Branch deploys: true

REACT_APP_VIDEO_WORKER_URL
  Production: https://estudio56-video-worker.brifyaimaster.workers.dev
  Deploy previews: https://estudio56-video-worker.brifyaimaster.workers.dev
  Branch deploys: https://estudio56-video-worker.brifyaimaster.workers.dev
```

---

### 5. Trigger Redeploy

**Opción A: Automático**
- Netlify debería hacer redeploy automáticamente al cambiar variables

**Opción B: Manual (si no redeploya automáticamente)**
1. Ir a: https://app.netlify.com/sites/estudio56/deploys
2. Click en "Trigger deploy"
3. Seleccionar "Clear cache and deploy site"
4. Esperar 5-10 minutos

---

### 6. Verificar Deploy

**Ir a**: https://app.netlify.com/sites/estudio56/deploys

**Esperar a que el deploy muestre**:
- 🟢 **Published** (verde)

**Click en el deploy para ver los logs**

**Buscar en los logs**:
```
Build environment variables:
  ...
  REACT_APP_USE_VIDEO_WORKER=true
  REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker...
  ...
```

Si ves las variables, ¡está configurado correctamente! ✅

---

### 7. Probar en la App

1. **Abrir la app**: https://www.estudio56.cl

2. **Abrir consola del navegador**:
   - Chrome/Edge: F12 o Cmd+Option+I (Mac)
   - Firefox: F12 o Cmd+Option+K (Mac)
   - Safari: Cmd+Option+C (Mac)

3. **Limpiar caché** (importante):
   - Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows/Linux)
   - O abrir en ventana incógnita

4. **Ir a sección de videos**

5. **Generar un video de prueba**:
   - Prompt: "Un perro corriendo en la playa"
   - Click "Generar Video"

6. **Verificar logs en consola**:

   **✅ CORRECTO** (usando Worker):
   ```
   🚀 [Worker] Generando borrador via Cloudflare Worker...
   📝 [Worker] Prompt: Un perro corriendo en la playa
   ✅ [Worker] Respuesta recibida
   🔄 [Worker] Consultando estado via Worker
   ```

   **❌ INCORRECTO** (usando Netlify Functions):
   ```
   POST /.netlify/functions/check-video-status 500
   ❌ Error 405: Method Not Allowed
   ```

---

## ✅ Checklist Final

Marca cada item cuando lo completes:

- [ ] Abrí Netlify Dashboard
- [ ] Agregué variable `REACT_APP_USE_VIDEO_WORKER=true`
- [ ] Agregué variable `REACT_APP_VIDEO_WORKER_URL`
- [ ] Verifiqué que las variables aparecen en la lista
- [ ] Esperé a que el deploy se complete (🟢 Published)
- [ ] Verifiqué que las variables aparecen en los build logs
- [ ] Abrí la app en producción
- [ ] Limpié caché del navegador (Cmd+Shift+R)
- [ ] Generé un video de prueba
- [ ] Vi logs del Worker en consola (🚀 [Worker])
- [ ] NO vi errores 405 en consola
- [ ] El video se generó correctamente

---

## ⚠️ Troubleshooting

### Si no ves las variables en los build logs

**Problema**: Las variables no se guardaron correctamente

**Solución**:
1. Volver a https://app.netlify.com/sites/estudio56/configuration/env
2. Verificar que las variables existen
3. Si no existen, agregarlas nuevamente
4. Hacer redeploy manual

---

### Si sigues viendo errores 405

**Problema**: El navegador tiene caché antiguo

**Solución**:
1. Limpiar caché: Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows)
2. Abrir en ventana incógnita
3. Verificar que el deploy se completó (🟢 Published)
4. Esperar 1-2 minutos para que el CDN se actualice

---

### Si el Worker no responde

**Problema**: El Worker puede estar caído

**Solución**:
1. Verificar health check:
   ```bash
   curl https://estudio56-video-worker.brifyaimaster.workers.dev/health
   ```
   Debería responder: `{"status":"ok","timestamp":...}`

2. Si no responde, revisar Cloudflare Dashboard:
   https://dash.cloudflare.com

3. Como último recurso, desactivar Worker temporalmente:
   - Cambiar `REACT_APP_USE_VIDEO_WORKER=false` en Netlify
   - Redeploy
   - Usará Netlify Functions como backup

---

## 🎉 Éxito

Si completaste todos los pasos del checklist y ves logs del Worker en consola, **¡está funcionando correctamente!** 🚀

El sistema ahora usa Cloudflare Worker con:
- ⚡ 60-70% menos latencia
- 🔒 API key segura
- 🌍 Edge global (300+ ubicaciones)

---

## 📞 Próximos Pasos

Una vez que funcione:
1. Generar varios videos de prueba
2. Monitorear logs del Worker: `wrangler tail`
3. Verificar métricas en Cloudflare Dashboard
4. Documentar resultados

---

**Documentación relacionada**:
- `FIX-METHOD-NOT-ALLOWED-POLLING-9-ENERO.md` - Explicación del problema
- `QUE-HACER-AHORA-WORKER.md` - Guía completa
- `CLOUDFLARE-WORKER-VIDEO-SETUP.md` - Setup técnico
