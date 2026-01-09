# 🔧 Fix: Exports de falAiVideoWorkerService

**Fecha**: 9 de enero de 2026  
**Problema**: Build de Netlify fallaba con error de exports no encontrados  
**Estado**: ✅ RESUELTO

---

## 🐛 Problema

### Error en Netlify Build
```
error during build:
App.tsx (52:9): "generateDraftVideo" is not exported by "services/falAiVideoWorkerService.ts"
```

### Causa Raíz
El archivo `falAiVideoWorkerService.ts` tenía exports usando **alias** al final del archivo:

```typescript
// ❌ ANTES - Alias que Vite/Rollup no podía resolver
export const generateDraftVideoViaWorker = async (...) => { ... }
export const upscaleVideoToHDViaWorker = async (...) => { ... }
export const checkVideoStatusViaWorker = async (...) => { ... }

// Al final del archivo
export const generateDraftVideo = generateDraftVideoViaWorker;
export const upscaleVideoToHD = upscaleVideoToHDViaWorker;
export const checkVideoStatus = checkVideoStatusViaWorker;
```

Vite/Rollup no podía resolver estos alias correctamente durante el build.

---

## ✅ Solución

### 1. Renombrar Funciones Directamente
Cambié los nombres de las funciones para que coincidan con los exports esperados:

```typescript
// ✅ DESPUÉS - Exports directos
export const generateDraftVideo = async (...) => { ... }
export const upscaleVideoToHD = async (...) => { ... }
export const checkVideoStatus = async (...) => { ... }
```

### 2. Actualizar videoProgressAlert.ts
El archivo `videoProgressAlert.ts` también importaba con el nombre antiguo:

```typescript
// ❌ ANTES
import { checkVideoStatusViaWorker } from './falAiVideoWorkerService';

// ✅ DESPUÉS
import { checkVideoStatus as checkVideoStatusViaWorker } from './falAiVideoWorkerService';
```

---

## 📝 Archivos Modificados

### 1. `services/falAiVideoWorkerService.ts`
- Renombrado `generateDraftVideoViaWorker` → `generateDraftVideo`
- Renombrado `upscaleVideoToHDViaWorker` → `upscaleVideoToHD`
- Renombrado `checkVideoStatusViaWorker` → `checkVideoStatus`
- Eliminados exports de alias al final del archivo

### 2. `services/videoProgressAlert.ts`
- Actualizado import para usar alias: `checkVideoStatus as checkVideoStatusViaWorker`

### 3. `scripts/test-worker.js`
- Agregado script de diagnóstico para testing del Worker

---

## ✅ Verificación

### Build Local Exitoso
```bash
npm run build
# ✓ built in 2.14s
```

### Git Push Exitoso
```bash
git add -A
git commit -m "fix: Corregir exports de falAiVideoWorkerService para build de Netlify"
git push origin main
# ✅ Pushed successfully
```

### Netlify Deploy
El próximo deploy de Netlify debería completarse sin errores.

---

## 🎯 Estado Final

### Cloudflare Worker
- ✅ Deployado: `https://estudio56-video-worker.brifyaimaster.workers.dev`
- ✅ Secret `FAL_AI_API_KEY` configurado
- ✅ Health check funcionando

### React App
- ✅ Imports correctos en `App.tsx`
- ✅ Imports correctos en `videoProgressAlert.ts`
- ✅ Build exitoso localmente
- ⏳ Esperando deploy de Netlify

### Variables de Entorno
```bash
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.brifyaimaster.workers.dev
```

---

## 🚀 Próximos Pasos

1. ⏳ **Esperar deploy de Netlify** - Debería completarse automáticamente
2. ⏳ **Probar generación de video** - Desde la app en producción
3. ⏳ **Validar logs del Worker** - Verificar que las requests lleguen correctamente
4. ⏳ **Medir latencia** - Comparar con Netlify Functions

---

## 📚 Lecciones Aprendidas

### Problema con Alias de Exports
Vite/Rollup tiene problemas resolviendo exports que son alias de otras funciones en el mismo archivo. Es mejor usar exports directos.

### Solución Simple
```typescript
// ❌ NO HACER
export const funcA = async () => { ... }
export const funcB = funcA; // Alias problemático

// ✅ HACER
export const funcB = async () => { ... } // Export directo
```

### Testing Local
Siempre ejecutar `npm run build` localmente antes de pushear para detectar errores de build.

---

## 🔗 Documentación Relacionada

- `ESTADO-FINAL-WORKER-9-ENERO.md` - Estado completo del Worker
- `CLOUDFLARE-WORKER-VIDEO-SETUP.md` - Setup completo
- `QUICK-START-WORKER.md` - Guía rápida
- `VERIFICACION-WORKER-COMPLETA.md` - Checklist de verificación

---

**Commit**: `824e089` - fix: Corregir exports de falAiVideoWorkerService para build de Netlify  
**Archivos**: 3 modificados (falAiVideoWorkerService.ts, videoProgressAlert.ts, test-worker.js)
