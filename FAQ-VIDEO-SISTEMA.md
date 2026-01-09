# FAQ: Sistema de Video Borrador + HD

## ❓ Preguntas Frecuentes

### 1. ¿Por qué dos pasos en vez de generar directo en HD?

**Ventajas del sistema de dos pasos:**
- ✅ Usuario ve resultado rápido (30-60s vs 5-10min)
- ✅ Puede iterar con borradores baratos antes de comprometerse
- ✅ Solo paga HD cuando está seguro del resultado
- ✅ Ahorro de ~40% en costos si genera múltiples borradores
- ✅ Mejor experiencia de usuario (feedback inmediato)

### 2. ¿Puedo generar HD directamente sin borrador?

Técnicamente sí, pero **no es recomendado** porque:
- Toma 5-10 minutos sin preview
- Cuesta más (~$0.50 vs $0.35 total con borrador)
- Usuario no puede corregir antes de gastar créditos
- Peor UX (espera larga sin feedback)

### 3. ¿El HD es idéntico al borrador?

**Casi idéntico pero mejor:**
- ✅ Misma composición y movimiento
- ✅ Misma duración y timing
- ✅ Mejor resolución (1080p vs 480p)
- ✅ Mejor calidad de imagen
- ✅ Menos artifacts y ruido

El upscaler está diseñado para **mejorar sin cambiar** el contenido.

### 4. ¿Cuánto tiempo toma cada paso?

**Tiempos típicos:**
- Borrador (480p): 30-60 segundos
- HD (1080p): 2-5 minutos
- **Total: 2.5-6 minutos**

**Factores que afectan:**
- Cola de fal.ai (más usuarios = más espera)
- Complejidad del prompt
- Duración del video
- Hora del día (peak hours = más lento)

### 5. ¿Cuánto cuesta cada paso?

**Costos estimados:**
- Borrador: ~$0.05 - $0.10
- HD: ~$0.15 - $0.25
- **Total: ~$0.20 - $0.35**

**Comparación:**
- Generar directo en HD: ~$0.50 - $0.70
- **Ahorro con sistema: ~40%**

### 6. ¿Puedo regenerar el borrador sin perder el HD?

Sí, puedes:
1. Generar múltiples borradores con diferentes prompts
2. Elegir el mejor borrador
3. Generar HD solo del borrador aprobado

**Costo:** Solo pagas cada borrador (~$0.08) hasta que apruebes uno.

### 7. ¿Qué aspect ratios están soportados?

**Soportados:**
- `9:16` - Vertical (Stories, TikTok, Reels)
- `16:9` - Horizontal (YouTube, landscape)
- `1:1` - Cuadrado (Instagram feed)

**Resoluciones:**
- Borrador: 480p (480x854, 854x480, 480x480)
- HD: 1080p (1080x1920, 1920x1080, 1080x1080)

### 8. ¿Puedo cambiar el aspect ratio entre borrador y HD?

**No**, el HD mantiene el aspect ratio del borrador porque:
- El upscaler trabaja sobre el video existente
- Cambiar aspect ratio requeriría regenerar desde cero
- Mantener ratio asegura consistencia

**Solución:** Elige el aspect ratio correcto desde el borrador.

### 9. ¿Qué pasa si el borrador no me gusta?

**Opciones:**
1. **Modificar prompt** y generar nuevo borrador
2. **Cambiar aspect ratio** y regenerar
3. **Ajustar duración** (si se implementa)
4. **Probar diferentes estilos** en el prompt

**No pierdes nada:** Solo pagaste el borrador (~$0.08).

### 10. ¿Puedo generar HD de un borrador antiguo?

**Sí**, siempre que:
- Tengas la URL del borrador guardada
- El video aún esté en el CDN de fal.ai (permanente)
- La URL sea accesible públicamente

**Recomendación:** Guarda las URLs de borradores en tu base de datos.

### 11. ¿Qué pasa si falla la generación?

**Errores comunes:**

**1. Contenido rechazado**
- Causa: Filtros de seguridad de fal.ai
- Solución: Simplificar prompt, evitar términos sensibles

**2. Timeout**
- Causa: Cola muy larga o error de red
- Solución: Reintentar después de unos minutos

**3. API Key inválida**
- Causa: Variable de entorno mal configurada
- Solución: Verificar `FAL_AI_API_KEY` en Netlify

**4. Límite de cuota**
- Causa: Plan de fal.ai agotado
- Solución: Upgrade de plan o esperar reset mensual

### 12. ¿Los videos tienen audio?

**Borrador:** No (desactivado para velocidad)
**HD:** Depende del modelo upscaler (actualmente no)

**Futuro:** Se puede agregar audio en post-procesamiento.

### 13. ¿Puedo descargar los videos?

**Sí**, ambos:
- Borrador: URL pública, descargable
- HD: URL pública, descargable

**Formato:** MP4 (H.264)
**Compatibilidad:** Todos los navegadores y dispositivos

### 14. ¿Los videos expiran?

**No**, las URLs son permanentes:
- Almacenados en CDN de fal.ai
- Acceso público indefinido
- No hay límite de tiempo

**Recomendación:** Guarda las URLs en tu base de datos.

### 15. ¿Puedo compartir los videos?

**Sí**, puedes:
- Compartir URL directa
- Descargar y subir a redes sociales
- Embeber en sitios web
- Usar en presentaciones

**Licencia:** Depende de los términos de fal.ai (revisar).

### 16. ¿Cuántos videos puedo generar?

**Límites:**
- Técnico: Ninguno (API de fal.ai)
- Costo: Según tu plan de fal.ai
- Cuota: Según límites de tu cuenta

**Recomendación:** Implementar sistema de créditos en tu app.

### 17. ¿Puedo usar mis propias imágenes como referencia?

**Actualmente no** en este sistema porque:
- LTX-2-19B es text-to-video (solo prompt)
- No hay modelo image-to-video implementado

**Futuro:** Se puede agregar con modelos como:
- `fal-ai/pika/v2/turbo/image-to-video`
- `fal-ai/runway-gen3/turbo/image-to-video`

### 18. ¿Puedo controlar la duración del video?

**Actualmente fijo:**
- Borrador: 5 segundos (121 frames @ 25fps)
- HD: Misma duración que borrador

**Futuro:** Se puede parametrizar `num_frames` para duraciones variables.

### 19. ¿Qué tan buena es la calidad del HD?

**Calidad profesional:**
- Resolución: 1080p (Full HD)
- Bitrate: Alto
- Codec: H.264
- Sin artifacts visibles
- Colores vibrantes
- Movimiento fluido

**Comparación:** Similar a video stock profesional.

### 20. ¿Necesito conocimientos técnicos para usar esto?

**No**, el sistema está diseñado para:
- Interfaz simple (prompt → borrador → HD)
- Feedback visual en cada paso
- Manejo automático de errores
- Polling automático de estado

**Para desarrolladores:** API bien documentada y TypeScript types.

### 21. ¿Puedo integrar esto en mi app?

**Sí**, completamente:
- API REST via Netlify Functions
- TypeScript service con tipos
- Ejemplos de código incluidos
- Documentación completa

**Ver:** `EJEMPLO-USO-VIDEO.md` para código de integración.

### 22. ¿Funciona en mobile?

**Sí**, porque:
- Backend en Netlify (server-side)
- Videos en CDN (optimizado)
- URLs públicas (accesibles desde cualquier dispositivo)
- Formato MP4 (compatible con iOS y Android)

### 23. ¿Puedo cancelar una generación en progreso?

**Actualmente no** porque:
- Fal.ai no provee endpoint de cancelación
- Una vez en cola, se procesa hasta completar

**Workaround:** Simplemente no uses el resultado.

### 24. ¿Cómo sé si mi prompt es bueno?

**Tips para buenos prompts:**
- ✅ Descriptivo pero conciso
- ✅ Incluir estilo visual ("cinematic", "realistic")
- ✅ Especificar movimiento de cámara
- ✅ Mencionar iluminación y mood
- ❌ Evitar términos ambiguos
- ❌ No usar lenguaje sensible

**Ejemplo bueno:**
```
"A cowboy walking through a dusty town at high noon, 
camera following from behind, cinematic depth, 
realistic lighting, western mood, 4K film grain"
```

### 25. ¿Dónde puedo ver ejemplos de videos generados?

**Recursos:**
- [Fal.ai Gallery](https://fal.ai/models/fal-ai/ltx-2-19b/text-to-video/lora)
- [SeedVR Examples](https://fal.ai/models/fal-ai/seedvr/upscale/video)
- Genera tu propio borrador de prueba (~$0.08)

---

## 🆘 ¿Más preguntas?

Revisa la documentación completa:
- `ESTRATEGIA-VIDEO-BORRADOR-HD.md` - Estrategia técnica
- `EJEMPLO-USO-VIDEO.md` - Código de ejemplo
- `IMPLEMENTACION-VIDEO-COMPLETA-9-ENERO.md` - Documentación completa
- `DIAGRAMA-FLUJO-VIDEO.md` - Flujo visual
