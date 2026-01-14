# Diagnóstico: Análisis de URL en Modo Canva - 13 Enero 2026

## 🔴 Problema Reportado

El usuario reporta que al hacer clic en "Analizar" en el modo Canva, la alerta de SweetAlert se queda cargando indefinidamente con el mensaje:
- "Analizando marca..."
- "Investigando identidad visual en Google"
- "Generando banners publicitarios..."

## 🔍 Análisis del Problema

### Flujo Esperado
1. Usuario ingresa URL en el input del sidebar (FlyerForm)
2. Usuario hace clic en "Analizar"
3. Se muestra alerta de SweetAlert con loading
4. Se incrementa `canvaAnalyzeTrigger` para forzar análisis
5. CanvasEditor detecta el cambio y ejecuta `handleUrlAnalysis()`
6. Se llama a Gemini API con Google Search
7. Se parsea la respuesta JSON
8. Se generan 3 imágenes (landscape, portrait, square)
9. Se cierra la alerta de SweetAlert
10. Se muestran las imágenes generadas

### Posibles Puntos de Falla

1. **useEffect no se ejecuta**
   - Dependencias incorrectas
   - Condiciones no cumplidas
   - URL vacía o inválida

2. **API Key no configurada**
   - Variable de entorno `VITE_GEMINI_API_KEY` no existe
   - API Key inválida o expirada

3. **Llamada a Gemini falla**
   - Modelo no disponible
   - Google Search tool no funciona
   - Timeout de red
   - Error de autenticación

4. **Parsing de JSON falla**
   - Respuesta no es JSON válido
   - Estructura incorrecta
   - Campos faltantes

5. **Generación de imágenes falla**
   - API de Imagen 4.0 no responde
   - Prompt inválido
   - Timeout en generación

6. **Alerta no se cierra**
   - `Swal.close()` no se ejecuta
   - Error antes de llegar al cierre
   - Excepción no capturada

## ✅ Soluciones Implementadas

### 1. Logs de Debug Completos

Agregados logs en cada paso crítico:

```typescript
// useEffect
console.log('🔍 [CanvasEditor useEffect] Verificando trigger:', {
  analyzeTrigger,
  hasUrl: !!externalUrlInput,
  urlValue: externalUrlInput,
  shouldExecute: analyzeTrigger && analyzeTrigger > 0 && externalUrlInput && externalUrlInput.trim()
});

// Inicio de análisis
console.log('🔍 [CanvasEditor] handleUrlAnalysis iniciado con URL:', urlInput);
console.log('🔍 [CanvasEditor] externalUrlInput:', externalUrlInput);
console.log('🔍 [CanvasEditor] urlInput (usado):', urlInput);

// API Key
console.log('🔑 [CanvasEditor] API Key disponible:', !!key);

// Request a Gemini
console.log('📤 [CanvasEditor] Enviando request a Gemini...');

// Respuesta recibida
console.log('📥 [CanvasEditor] Respuesta recibida, parseando...');
console.log('📊 [CanvasEditor] Datos de análisis:', analysisData);

// Parsing exitoso
console.log('✅ [CanvasEditor] Branding parseado:', branding);

// Generación de imágenes
console.log('🎨 [CanvasEditor] Generando imágenes con estilo:', selectedStyle);

// Completado
console.log('✅ [CanvasEditor] Análisis completado, cerrando alerta');

// Error
console.error('❌ [CanvasEditor] Error en análisis:', err);
```

### 2. Timeout de Seguridad (30 segundos)

```typescript
// Timeout de seguridad de 30 segundos
const timeoutId = setTimeout(() => {
  console.error('⏰ [CanvasEditor] Timeout alcanzado (30s)');
  Swal.close();
  Swal.fire({
    title: '⏱️ Tiempo agotado',
    text: 'El análisis está tomando demasiado tiempo. Por favor intenta de nuevo o verifica tu conexión.',
    icon: 'warning',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#f59e0b',
    background: '#1a1a1a',
    color: '#ffffff'
  });
  setLoadingStep(null);
}, 30000); // 30 segundos
```

### 3. Validación de URL Antes de Analizar

```typescript
if (!urlInput) {
  console.log('❌ [CanvasEditor] No hay URL para analizar');
  Swal.close();
  Swal.fire({
    title: '⚠️ Error',
    text: 'No hay URL para analizar. Por favor ingresa una URL válida.',
    icon: 'warning',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#f59e0b',
    background: '#1a1a1a',
    color: '#ffffff'
  });
  return;
}
```

### 4. Corrección de Dependencias del useEffect

**ANTES:**
```typescript
useEffect(() => {
  if (analyzeTrigger && analyzeTrigger > 0 && externalUrlInput && externalUrlInput.trim()) {
    handleUrlAnalysis();
  }
}, [analyzeTrigger]); // ❌ Falta externalUrlInput
```

**DESPUÉS:**
```typescript
useEffect(() => {
  if (analyzeTrigger && analyzeTrigger > 0 && externalUrlInput && externalUrlInput.trim()) {
    handleUrlAnalysis();
  }
}, [analyzeTrigger, externalUrlInput]); // ✅ Dependencias correctas
```

### 5. Limpieza de Timeout

```typescript
try {
  // ... código de análisis ...
  clearTimeout(timeoutId); // ✅ Limpiar timeout si completa
  Swal.close();
} catch (err: any) {
  clearTimeout(timeoutId); // ✅ Limpiar timeout si falla
  Swal.close();
  // Mostrar error
}
```

## 🧪 Cómo Diagnosticar el Problema

### Paso 1: Abrir Consola del Navegador
1. Presiona `F12` o `Cmd+Option+I` (Mac)
2. Ve a la pestaña "Console"
3. Limpia la consola (icono 🚫)

### Paso 2: Ejecutar Análisis
1. Ingresa una URL en el input (ej: "nike.com")
2. Haz clic en "Analizar"
3. Observa los logs en la consola

### Paso 3: Interpretar los Logs

#### ✅ Caso Exitoso
```
🔍 [CanvasEditor useEffect] Verificando trigger: { analyzeTrigger: 1, hasUrl: true, ... }
✅ [CanvasEditor] Trigger detectado, ejecutando análisis: nike.com Trigger: 1
🔍 [CanvasEditor] handleUrlAnalysis iniciado con URL: nike.com
🔑 [CanvasEditor] API Key disponible: true
📤 [CanvasEditor] Enviando request a Gemini...
📥 [CanvasEditor] Respuesta recibida, parseando...
📊 [CanvasEditor] Datos de análisis: { candidates: [...] }
✅ [CanvasEditor] Branding parseado: { colors: [...], basePrompt: "..." }
🎨 [CanvasEditor] Generando imágenes con estilo: modern
✅ [CanvasEditor] Análisis completado, cerrando alerta
```

#### ❌ Caso: API Key No Configurada
```
🔍 [CanvasEditor useEffect] Verificando trigger: { analyzeTrigger: 1, hasUrl: true, ... }
✅ [CanvasEditor] Trigger detectado, ejecutando análisis: nike.com Trigger: 1
🔍 [CanvasEditor] handleUrlAnalysis iniciado con URL: nike.com
🔑 [CanvasEditor] API Key disponible: false
❌ [CanvasEditor] Error en análisis: API Key no configurada. Contacta al administrador.
```

**SOLUCIÓN**: Configurar `VITE_GEMINI_API_KEY` en Netlify

#### ❌ Caso: URL Vacía
```
🔍 [CanvasEditor useEffect] Verificando trigger: { analyzeTrigger: 1, hasUrl: false, ... }
❌ [CanvasEditor] Condiciones no cumplidas para ejecutar análisis
```

**SOLUCIÓN**: Verificar que el input de URL tenga valor

#### ❌ Caso: Timeout
```
🔍 [CanvasEditor useEffect] Verificando trigger: { analyzeTrigger: 1, hasUrl: true, ... }
✅ [CanvasEditor] Trigger detectado, ejecutando análisis: nike.com Trigger: 1
🔍 [CanvasEditor] handleUrlAnalysis iniciado con URL: nike.com
🔑 [CanvasEditor] API Key disponible: true
📤 [CanvasEditor] Enviando request a Gemini...
⏰ [CanvasEditor] Timeout alcanzado (30s)
```

**SOLUCIÓN**: Verificar conexión a internet o aumentar timeout

#### ❌ Caso: Error de Parsing
```
🔍 [CanvasEditor useEffect] Verificando trigger: { analyzeTrigger: 1, hasUrl: true, ... }
✅ [CanvasEditor] Trigger detectado, ejecutando análisis: nike.com Trigger: 1
🔍 [CanvasEditor] handleUrlAnalysis iniciado con URL: nike.com
🔑 [CanvasEditor] API Key disponible: true
📤 [CanvasEditor] Enviando request a Gemini...
📥 [CanvasEditor] Respuesta recibida, parseando...
📊 [CanvasEditor] Datos de análisis: { candidates: [...] }
Error parsing JSON: SyntaxError: Unexpected token ...
❌ [CanvasEditor] Error en análisis: La IA no devolvió un formato válido. Intenta de nuevo.
```

**SOLUCIÓN**: Revisar el prompt o cambiar de modelo

### Paso 4: Verificar Network Tab
1. Ve a la pestaña "Network" en DevTools
2. Filtra por "generativelanguage.googleapis.com"
3. Verifica:
   - ¿Se hace la llamada?
   - ¿Cuál es el status code? (200 = OK, 401 = API Key inválida, 429 = Rate limit)
   - ¿Cuánto tarda? (más de 30s = timeout)

## 📊 Checklist de Verificación

- [ ] Logs aparecen en la consola
- [ ] `🔍 [CanvasEditor useEffect]` se ejecuta
- [ ] `analyzeTrigger` es mayor que 0
- [ ] `hasUrl` es `true`
- [ ] `urlValue` tiene la URL correcta
- [ ] `🔑 [CanvasEditor] API Key disponible: true`
- [ ] `📤 [CanvasEditor] Enviando request a Gemini...` aparece
- [ ] `📥 [CanvasEditor] Respuesta recibida` aparece en menos de 30s
- [ ] `✅ [CanvasEditor] Branding parseado` aparece
- [ ] `🎨 [CanvasEditor] Generando imágenes` aparece
- [ ] `✅ [CanvasEditor] Análisis completado` aparece
- [ ] La alerta de SweetAlert se cierra automáticamente
- [ ] Las imágenes se muestran en el canvas

## 🚀 Próximos Pasos

1. **Desplegar a producción** - Los cambios ya están en el repositorio
2. **Probar con URL real** - Usar una URL conocida como "nike.com"
3. **Revisar logs** - Seguir el checklist de verificación
4. **Reportar hallazgos** - Compartir los logs de la consola si hay errores
5. **Ajustar según sea necesario** - Basado en los logs, hacer ajustes adicionales

## 📝 Archivos Modificados

- `components/canvas/CanvasEditor.tsx` - Logs, timeout, validaciones
- `FIX-CANVA-ANALISIS-URL-13-ENERO.md` - Documentación del problema
- `DIAGNOSTICO-CANVA-ANALISIS-URL-13-ENERO.md` - Este archivo (guía de diagnóstico)

## 🎯 Resultado Esperado

Después de estos cambios:
- ✅ El usuario verá logs detallados en la consola
- ✅ Si algo falla, sabrá exactamente qué y por qué
- ✅ No se quedará esperando más de 30 segundos
- ✅ Recibirá mensajes de error claros y accionables
- ✅ El sistema será más fácil de debuggear y mantener
