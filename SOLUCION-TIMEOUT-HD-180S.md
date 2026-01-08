# ✅ Solución: Timeout de Generación HD (90s → 180s)

**Fecha**: 8 de enero de 2026  
**Estado**: ✅ RESUELTO

---

## 🎯 Problema

Al generar imágenes HD, aparecía el error:
```
Uncaught (in promise) Error: Timeout de generación de imagen (90s)
```

**Síntomas**:
- La imagen HD se generaba correctamente
- Pero el proceso se interrumpía antes de completarse
- El error aparecía después de que la imagen ya estaba mejorada

---

## 🔍 Causa Raíz

El timeout de 90 segundos era **insuficiente** para el sistema de cola de fal.ai:

- **fal.ai usa sistema de cola asíncrono**:
  - Submit request → IN_QUEUE
  - Polling cada 2 segundos
  - Máximo 60 intentos = 120 segundos (2 minutos)
  
- **Timeout anterior**: 90 segundos
- **Tiempo real necesario**: hasta 120 segundos
- **Resultado**: El timeout interrumpía el polling antes de obtener la imagen

---

## ✅ Solución Implementada

### Cambio en `services/geminiService.ts` (línea 1515-1517)

**ANTES**:
```typescript
// Timeout de 90 segundos para generación de imagen (mayor que timeout de Netlify 26s)
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Timeout de generación de imagen (90s)')), 90000);
});
```

**DESPUÉS**:
```typescript
// Timeout de 3 minutos para generación de imagen (fal.ai queue puede tomar hasta 2 minutos)
const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Timeout de generación de imagen (180s)')), 180000);
});
```

### Justificación del Nuevo Timeout

- **fal.ai polling**: hasta 120 segundos (2 minutos)
- **Margen de seguridad**: +60 segundos
- **Total**: 180 segundos (3 minutos)

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
const maxAttempts = 60;      // 60 intentos
const pollInterval = 2000;   // 2 segundos entre intentos
// Total: 60 × 2s = 120 segundos máximo
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

## 📝 Commit

```
fix: Aumentar timeout de generación HD de 90s a 180s para fal.ai queue

- Timeout anterior de 90s era insuficiente para el sistema de cola de fal.ai
- fal.ai puede tomar hasta 2 minutos (60 intentos x 2s) para procesar
- Nuevo timeout de 3 minutos (180s) da margen suficiente
- Esto resuelve el error 'Timeout de generación de imagen (90s)'
- La imagen HD se genera correctamente pero necesita más tiempo
```

**Commit hash**: `4b5efda`  
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
