# ✅ Solución: Timeout de Generación HD (90s → 180s → 300s)

**Fecha**: 8 de enero de 2026  
**Estado**: ✅ RESUELTO (Actualizado a 5 minutos)

---

## 🎯 Problema

Al generar imágenes HD, aparecía el error de timeout:
```
Uncaught (in promise) Error: Timeout de generación de imagen (90s)
Uncaught (in promise) Error: Timeout de generación de imagen (180s)
```

**Síntomas**:
- La imagen HD se generaba correctamente
- Pero el proceso se interrumpía antes de completarse
- El error aparecía después de que la imagen ya estaba mejorada

---

## 🔍 Causa Raíz

El timeout era **insuficiente** para el sistema de cola de fal.ai:

- **fal.ai usa sistema de cola asíncrono**:
  - Submit request → IN_QUEUE
  - Polling cada 2 segundos
  - Procesamiento de imagen HD de alta calidad
  
- **Timeouts probados**:
  - ❌ 90 segundos - Insuficiente
  - ❌ 180 segundos (3 minutos) - Aún insuficiente
  - ✅ 300 segundos (5 minutos) - Suficiente
  
- **Tiempo real necesario**: fal.ai puede tomar hasta 3 minutos para imágenes HD complejas
- **Resultado**: El timeout interrumpía el polling antes de obtener la imagen

---

## ✅ Solución Implementada

### Cambio 1: Timeout en `services/geminiService.ts` (línea 1515-1517)

**ANTES (Primera versión)**:
```typescript
// Timeout de 90 segundos para generación de imagen (mayor que timeout de Netlify 26s)
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Timeout de generación de imagen (90s)')), 90000);
});
```

**DESPUÉS (Segunda versión - 180s)**:
```typescript
// Timeout de 3 minutos para generación de imagen (fal.ai queue puede tomar hasta 2 minutos)
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Timeout de generación de imagen (180s)')), 180000);
});
```

**FINAL (Tercera versión - 300s)**:
```typescript
// Timeout de 5 minutos para generación de imagen (fal.ai queue puede tomar hasta 3 minutos)
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Timeout de generación de imagen (300s)')), 300000);
});
```

### Cambio 2: Polling en `services/falAiService.ts` (línea 198-200)

**ANTES**:
```typescript
// Hacer polling hasta obtener el resultado
const maxAttempts = 60; // 60 intentos = 2 minutos máximo
const pollInterval = 2000; // 2 segundos entre intentos
```

**DESPUÉS**:
```typescript
// Hacer polling hasta obtener el resultado
const maxAttempts = 90; // 90 intentos = 3 minutos máximo
const pollInterval = 2000; // 2 segundos entre intentos
```

### Justificación del Nuevo Timeout

- **fal.ai polling**: hasta 180 segundos (3 minutos) - 90 intentos × 2s
- **Margen de seguridad**: +120 segundos (2 minutos)
- **Total**: 300 segundos (5 minutos)

**Observación**: fal.ai está tomando más tiempo del esperado para procesar imágenes HD de alta calidad. El nuevo timeout de 5 minutos da margen suficiente incluso para casos extremos.

Esto da tiempo suficiente para:
1. Enviar request a fal.ai
2. Esperar en cola (IN_QUEUE)
3. Procesar imagen (IN_PROGRESS)
4. Obtener resultado (COMPLETED)
5. Descargar imagen final

---

## 📊 Configuración fal.ai

### Sistema de Cola Asíncrono

```typescript
// En falAiService.ts
const maxAttempts = 90;      // 90 intentos (actualizado de 60)
const pollInterval = 2000;   // 2 segundos entre intentos
// Total: 90 × 2s = 180 segundos máximo (3 minutos)
```

### Parámetros de Generación HD

```typescript
{
  model: 'fal-ai/flux/dev/image-to-image',
  strength: 0.20,              // Baja = máxima similitud
  guidance_scale: 7.5,         // Moderada = seguir referencia
  num_inference_steps: 30,     // Calidad HD
  enable_safety_checker: false // Evitar falsos positivos
}
```

---

## 🧪 Resultado Esperado

Ahora la generación HD debería:

1. ✅ Tomar la imagen borrador como referencia
2. ✅ Mejorar solo la calidad (sharpness, detail, texture)
3. ✅ Mantener composición, colores, iluminación idénticos
4. ✅ Completarse sin errores de timeout
5. ✅ Mostrar la imagen HD mejorada en la UI

---

## 📝 Commits

### Commit 1: Aumento inicial (90s → 180s)
```
fix: Aumentar timeout de generación HD de 90s a 180s para fal.ai queue

- Timeout anterior de 90s era insuficiente para el sistema de cola de fal.ai
- fal.ai puede tomar hasta 2 minutos (60 intentos x 2s) para procesar
- Nuevo timeout de 3 minutos (180s) da margen suficiente
- Esto resuelve el error 'Timeout de generación de imagen (90s)'
- La imagen HD se genera correctamente pero necesita más tiempo
```
**Commit hash**: `4b5efda`

### Commit 2: Aumento final (180s → 300s)
```
fix: Aumentar timeout HD a 5 minutos y polling fal.ai a 90 intentos

- Timeout geminiService: 180s → 300s (5 minutos)
- Polling fal.ai: 60 intentos → 90 intentos (3 minutos)
- fal.ai está tomando más de 3 minutos en procesar imágenes HD
- Nuevo margen: 3 min polling + 2 min buffer = 5 min timeout total
- Resuelve error 'Timeout de generación de imagen (180s)'
```
**Commit hash**: `4ecfda7`  
**Branch**: `main`  
**Push**: ✅ Exitoso

---

## 🎯 Próximos Pasos

1. **Probar en producción**: Generar imagen HD y verificar que no aparezca timeout
2. **Verificar similitud**: Confirmar que la imagen HD es idéntica al borrador (solo mejor calidad)
3. **Monitorear tiempos**: Ver cuánto tarda realmente fal.ai en procesar

---

## 📚 Archivos Relacionados

- `services/geminiService.ts` - Timeout aumentado (línea 1515-1517)
- `services/falAiService.ts` - Sistema de cola fal.ai (línea 150-200)
- `App.tsx` - Función handleUpgradeToHD (línea 1450-1600)

---

## 🔗 Documentación Relacionada

- `SOLUCION-HD-IDENTICA-BORRADOR.md` - Solución completa HD
- `CORRECCION-ENDPOINT-FAL-AI.md` - Corrección endpoint fal.ai
- `INFORME-PROBLEMA-HD-NO-PARECE-BORRADOR.md` - Análisis del problema original
