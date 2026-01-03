# 📹 GUÍA: CÓMO DESCARGAR VIDEOS CON TEXTO Y LOGO

## Problema
Cuando generas un video y agregas texto y logo, estos no se incluyen en el video descargado.

## Solución
El sistema ahora incluye **procesamiento de video con FFmpeg.wasm** que "quema" (burn-in) el texto y logo directamente en el video.

---

## 📋 Pasos para Descargar Video con Overlays

### 1. Genera tu Video Normal
1. Ingresa la descripción de tu negocio
2. Selecciona "Video" como tipo de contenido
3. Clic en "GENERAR VIDEO"
4. Espera a que el video se genere (puede tomar 30-120 segundos)

### 2. Agrega Texto y Logo
1. Una vez generado el video, verás el preview
2. **Texto**: Escribe tu texto en el campo de texto
3. **Logo**: Sube tu logo en la sección "Tu Marca"
4. Ajusta la posición arrastrando los elementos

### 3. Descarga con Overlays (IMPORTANTE)
1. Clic en el botón **DESCARGAR** en la barra inferior
2. **ESPERA** a que termine el procesamiento:
   - Verás una pantalla de progreso azul
   - Dice "Procesando Video..."
   - Puede tomar 10-30 segundos adicionales
3. **NO cierres la pestaña** mientras procesa
4. El video con texto y logo se descargará automáticamente

---

## ⚠️ Requisitos del Navegador

### Navegadores Soportados
- ✅ **Chrome** (versión 90+)
- ✅ **Edge** (versión 90+)
- ✅ **Opera** (versión 76+)
- ✅ **Firefox** (versión 115+ con configuración especial)

### Navegadores NO Soportados
- ❌ Safari (no soporta SharedArrayBuffer)
- ❌ Navegadores móviles antiguos

### Verificar tu Navegador
Abre la consola del navegador (F12) y escribe:
```javascript
console.log(window.crossOriginIsolated);
```
Debe mostrar: `true`

---

## 🔧 Solución de Problemas

### Problema: "Tu navegador no soporta SharedArrayBuffer"

**Solución:**
1. Usa Chrome o Edge
2. Verifica que los headers COOP/COEP estén activos en Netlify
3. Verifica que `netlify.toml` tenga:
   ```toml
   [[headers]]
     for = "/*"
     [headers.values]
       Cross-Origin-Opener-Policy = "same-origin"
       Cross-Origin-Embedder-Policy = "credentialless"
   ```

### Problema: El texto no aparece en el video

**Causas posibles:**
1. La fuente no se cargó correctamente
2. El texto está vacío
3. Error en el procesamiento

**Solución:**
1. Verifica que el texto no esté vacío
2. Intenta con un texto más corto
3. Recarga la página e intenta de nuevo

### Problema: El logo no aparece

**Solución:**
1. Verifica que el logo sea una imagen válida (PNG, JPG)
2. Verifica que el logo no sea muy grande (> 5MB)
3. Intenta con un logo más simple

### Problema: "Error de memoria"

**Solución:**
1. Cierra otras pestañas del navegador
2. Usa Chrome en lugar de otros navegadores
3. Intenta con un video más corto

---

## 📊 Tiempos Estimados

| Operación | Tiempo |
|-----------|--------|
| Generar video base (Draft) | 30-60 segundos |
| Generar video HD | 60-120 segundos |
| Procesar overlays (FFmpeg) | 10-30 segundos |
| **Total con overlays** | **40-150 segundos** |

---

## 🎯 Mejores Prácticas

### Para Texto
- ✅ Usa texto corto (máximo 6-8 palabras)
- ✅ Evita caracteres especiales
- ✅ Usa colores contrastantes (blanco sobre oscuro)

### Para Logo
- ✅ Usa logo PNG con fondo transparente
- ✅ Logo simple (no muy detallado)
- ✅ Tamaño moderado (200-500px)

### Para Videos
- ✅ Videos cortos (5-8 segundos)
- ✅ Evita fondos muy complejos
- ✅ Elige el estilo correcto para tu industria

---

## 🔄 Si los Overlays No Funcionan

Si después de esperar el procesamiento el video descargado no tiene overlays:

### Opción 1: Descargar Original
1. El sistema ofrecerá descargar el video original como fallback
2. Descárgalo y úsalo sin overlays

### Opción 2: Reportar el Problema
1. Toma un screenshot del error
2. Anota:
   - Navegador usado
   - Texto que intentaste agregar
   - Si el logo era PNG/JPG
3. Reporta el error para investigación

---

## 📱 Compatibilidad Mobile

⚠️ **El procesamiento de video con FFmpeg NO funciona en móviles**

**Solución para móviles:**
1. Genera el video en desktop
2. Usa herramientas externas para agregar overlays
3. O contacta soporte para asistencia

---

## 🆘 Preguntas Frecuentes

**P: ¿Puedo agregar múltiples textos?**
R: No, actualmente solo se soporta un texto principal.

**P: ¿Puedo posicionar el texto libremente?**
R: Sí, el texto se posiciona verticalmente (Y) y se centra horizontalmente.

**P: ¿El logo se puede redimensionar?**
R: Sí, el logo se escala automáticamente a 200px de ancho.

**P: ¿Se pierde calidad al procesar?**
R: Mínima pérdida. FFmpeg usa codec H.264 con CRF 23.

**P: ¿Puedo cancelar el procesamiento?**
R: Sí, cerrando la pestaña o recargando la página.

---

## 📞 Soporte

Si tienes problemas persistentes:
1. Verifica los requisitos del navegador
2. Usa Chrome o Edge
3. Contacta soporte con detalles del error

---

**Última actualización**: 2026-01-03
**Versión**: 2.0