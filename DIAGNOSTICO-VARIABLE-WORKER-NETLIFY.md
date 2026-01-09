# 🔍 Diagnóstico: Variable Worker en Netlify

**Fecha**: 9 de enero de 2026  
**Problema**: Variable configurada pero app sigue usando Netlify Functions  
**Estado**: 🔍 INVESTIGANDO

---

## ✅ Lo Que Sabemos

1. ✅ Variable `REACT_APP_USE_VIDEO_WORKER` **SÍ está configurada** en Netlify
2. ✅ Variable está en `.env.local` localmente
3. ❌ App en producción **NO está usando el Worker**
4. ❌ Sigue intentando usar Netlify Functions (error 405)

---

## 🤔 Posibles Causas

### 1. El Valor No Es Exactamente "true"

La variable puede tener:
- Espacios: `" true"` o `"true "` o `" true "`
- Mayúsculas: `"True"` o `"TRUE"`
- Valor vacío: `""`
- Otro valor: `"1"`, `"yes"`, etc.

**Solución**: Verificar que el valor sea **exactamente** `true` (minúsculas, sin espacios)

### 2. Falta Redeploy Después de Configurar Variable

Netlify requiere un redeploy para que las variables nuevas tomen efecto.

**Solución**: Trigger redeploy manual

### 3. Variable No Se Incluyó en el Build

A veces Netlify no incluye variables nuevas en el build.

**Solución**: Clear cache and redeploy

---

## 🔧 Solución Paso a Paso

### Paso 1: Verificar Valor Exacto

1. Ir a: https://app.netlify.com/sites/estudio56/configuration/env
2. Click en el ícono de "ojo" 👁️ junto a `REACT_APP_USE_VIDEO_WORKER`
3. Verificar que el valor sea **exactamente**: `true`
4. Si tiene espacios o mayúsculas, editarlo:
   - Click en "Options" → "Edit"
   - Cambiar valor a: `true` (minúsculas, sin espacios)
   - Save

### Paso 2: Verificar Scope

1. En la misma página de variables
2. Verificar que `REACT_APP_USE_VIDEO_WORKER` tenga:
   - ✓ Production
   - ✓ Deploy previews
   - ✓ Branch deploys

### Paso 3: Clear Cache and Redeploy

1. Ir a: https://app.netlify.com/sites/estudio56/deploys
2. Click en "Trigger deploy"
3. Seleccionar **"Clear cache and deploy site"** (importante)
4. Esperar 5-10 minutos

### Paso 4: Verificar Build Logs

1. Click en el deploy más reciente
2. Buscar en los logs:
   ```
   Build environment variables:
     ...
     REACT_APP_USE_VIDEO_WORKER=true
     ...
   ```

3. Si **NO aparece**, la variable no se incluyó:
   - Volver al Paso 1
   - Verificar que la variable existe
   - Intentar eliminarla y crearla nuevamente

### Paso 5: Verificar en la App

1. Abrir: https://www.estudio56.cl
2. Abrir consola del navegador (F12)
3. Ejecutar:
   ```javascript
   console.log('USE_WORKER:', import.meta.env.REACT_APP_USE_VIDEO_WORKER);
   ```
4. Debería mostrar: `USE_WORKER: true`

---

## 🧪 Test Rápido

### Opción A: Verificar en Build Logs

```bash
# En los logs de Netlify, buscar:
Build environment variables:
  REACT_APP_USE_VIDEO_WORKER=true  ← Debe aparecer
```

### Opción B: Verificar en Runtime

```javascript
// En consola del navegador:
console.log(import.meta.env.REACT_APP_USE_VIDEO_WORKER);
// Debe mostrar: "true"
```

---

## ⚠️ Problema Común: Vite vs Create React App

**IMPORTANTE**: Este proyecto usa **Vite**, no Create React App.

En Vite, las variables se acceden con:
```javascript
import.meta.env.REACT_APP_USE_VIDEO_WORKER
```

NO con:
```javascript
process.env.REACT_APP_USE_VIDEO_WORKER
```

Déjame verificar el código...

---

## 🔍 Verificación del Código

Revisando `services/videoProgressAlert.ts`:

```typescript
const USE_CLOUDFLARE_WORKER = process.env.REACT_APP_USE_VIDEO_WORKER === 'true';
```

**❌ PROBLEMA ENCONTRADO**: Está usando `process.env` en lugar de `import.meta.env`

En Vite, `process.env` **NO funciona** en el cliente. Debe ser `import.meta.env`.

---

## ✅ Solución Real

Necesito actualizar el código para usar `import.meta.env` en lugar de `process.env`.

### Archivos a Modificar:

1. `services/videoProgressAlert.ts`
2. `services/falAiVideoWorkerService.ts`
3. Cualquier otro archivo que use `process.env.REACT_APP_*`

---

## 🎯 Próximos Pasos

1. ✅ Identificar todos los archivos que usan `process.env.REACT_APP_*`
2. ✅ Cambiar a `import.meta.env.REACT_APP_*`
3. ✅ Hacer commit y push
4. ⏳ Esperar redeploy de Netlify
5. ✅ Probar en producción

---

**Conclusión**: El problema es que el código usa `process.env` en lugar de `import.meta.env` para Vite.
