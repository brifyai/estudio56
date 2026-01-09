# 🎬 Sistema de Generación de Videos

**Borrador (480p) + HD (1080p) con fal.ai**

---

## 🚀 Quick Start

```typescript
import { generateDraftVideo, upscaleVideoToHD, checkVideoStatus } from './services/falAiService';

// 1. Generar borrador
const draft = await generateDraftVideo(
  "A cowboy walking through a dusty town at high noon",
  { aspectRatio: '9:16' }
);

// 2. Polling
const draftUrl = await pollUntilComplete(draft.taskId);

// 3. Generar HD
const hd = await upscaleVideoToHD(draftUrl);

// 4. Polling
const hdUrl = await pollUntilComplete(hd.taskId);
```

---

## 📋 ¿Qué es esto?

Sistema de generación de videos en **dos pasos**:

1. **BORRADOR (480p)** - Rápido (30-60s) y económico (~$0.08)
2. **HD (1080p)** - Upscale profesional (2-5min) (~$0.20)

**Total**: ~$0.28 y 2.5-6 minutos

---

## ✅ Estado Actual

| Componente | Estado |
|------------|--------|
| Backend (Netlify Functions) | ✅ Completado |
| Frontend (Services) | ✅ Completado |
| UI Components | ⏳ Pendiente |
| Documentación | ✅ Completado |

---

## 💡 ¿Por qué dos pasos?

| Ventaja | Beneficio |
|---------|-----------|
| **Velocidad** | Usuario ve resultado en 30-60s |
| **Económico** | Solo paga HD si aprueba |
| **Iteración** | Múltiples borradores baratos |
| **UX** | Feedback inmediato |
| **Calidad** | Upscaler especializado |

---

## 📐 Aspect Ratios

- `9:16` - Vertical (Stories, TikTok, Reels)
- `16:9` - Horizontal (YouTube)
- `1:1` - Cuadrado (Instagram feed)

---

## 🔧 Configuración

### 1. Variable de Entorno

```bash
# En Netlify Dashboard
FAL_AI_API_KEY=tu_key_aqui
```

### 2. Deploy

```bash
npm run build
netlify deploy --prod
```

---

## 📚 Documentación

### Inicio Rápido
- **[RESUMEN-EJECUTIVO-VIDEO-9-ENERO.md](./RESUMEN-EJECUTIVO-VIDEO-9-ENERO.md)** - Resumen de 5 minutos
- **[CHECKLIST-INTEGRACION-VIDEO.md](./CHECKLIST-INTEGRACION-VIDEO.md)** - Pasos de integración

### Técnica
- **[ESTRATEGIA-VIDEO-BORRADOR-HD.md](./ESTRATEGIA-VIDEO-BORRADOR-HD.md)** - Estrategia completa
- **[IMPLEMENTACION-VIDEO-COMPLETA-9-ENERO.md](./IMPLEMENTACION-VIDEO-COMPLETA-9-ENERO.md)** - Docs técnicas
- **[EJEMPLO-USO-VIDEO.md](./EJEMPLO-USO-VIDEO.md)** - Código de ejemplo

### Visual
- **[DIAGRAMA-FLUJO-VIDEO.md](./DIAGRAMA-FLUJO-VIDEO.md)** - Diagramas y flujos

### Soporte
- **[FAQ-VIDEO-SISTEMA.md](./FAQ-VIDEO-SISTEMA.md)** - 25 preguntas frecuentes
- **[INDICE-DOCUMENTACION-VIDEO.md](./INDICE-DOCUMENTACION-VIDEO.md)** - Índice completo

---

## 🎯 Próximos Pasos

1. Configurar `FAL_AI_API_KEY` en Netlify
2. Crear componente `VideoGenerator.tsx`
3. Implementar polling automático
4. Sistema de créditos
5. Guardar videos en Supabase

Ver [CHECKLIST-INTEGRACION-VIDEO.md](./CHECKLIST-INTEGRACION-VIDEO.md) para detalles.

---

## 💰 Costos

| Paso | Tiempo | Costo |
|------|--------|-------|
| Borrador | 30-60s | ~$0.08 |
| HD | 2-5min | ~$0.20 |
| **Total** | **2.5-6min** | **~$0.28** |

**Ahorro vs directo a HD**: ~40%

---

## 🔍 Archivos Principales

```
netlify/functions/
├── generate-video.ts          # Generación borrador + HD
└── check-video-status.ts      # Polling de estado

services/
└── falAiService.ts            # API calls frontend
    ├── generateDraftVideo()
    ├── upscaleVideoToHD()
    └── checkVideoStatus()
```

---

## 📊 Modelos Utilizados

### Borrador
- **Modelo**: `fal-ai/ltx-2-19b/text-to-video/lora`
- **Resolución**: 480p
- **Optimizado para**: Velocidad

### HD
- **Modelo**: `fal-ai/seedvr/upscale/video`
- **Resolución**: 1080p
- **Optimizado para**: Calidad

---

## ⚠️ Errores Comunes

| Error | Solución |
|-------|----------|
| API Key inválida | Verificar variable de entorno |
| Contenido rechazado | Simplificar prompt |
| Timeout | Reintentar después |
| Sin créditos | Verificar plan de fal.ai |

Ver [FAQ-VIDEO-SISTEMA.md](./FAQ-VIDEO-SISTEMA.md) para más detalles.

---

## 🧪 Testing

```bash
# Verificar API key
node scripts/test-fal-ai-config.js

# Test de generación
curl -X POST https://tu-app/.netlify/functions/generate-video \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","quality":"draft","aspectRatio":"9:16"}'
```

---

## 📈 Roadmap

### v1.0 (Actual) ✅
- Backend completo
- Frontend services
- Documentación

### v1.1 (Próximo)
- UI components
- Sistema de créditos
- Base de datos

### v1.2 (Futuro)
- Galería de videos
- Analytics
- Optimizaciones

---

## 🤝 Contribuir

1. Lee la documentación completa
2. Sigue las mejores prácticas
3. Actualiza docs si haces cambios
4. Agrega tests para nuevas features

---

## 📞 Soporte

**¿Preguntas?**
1. Revisa [FAQ-VIDEO-SISTEMA.md](./FAQ-VIDEO-SISTEMA.md)
2. Consulta [EJEMPLO-USO-VIDEO.md](./EJEMPLO-USO-VIDEO.md)
3. Lee [IMPLEMENTACION-VIDEO-COMPLETA-9-ENERO.md](./IMPLEMENTACION-VIDEO-COMPLETA-9-ENERO.md)

**¿Bugs?**
- Reporta en issue tracker
- Incluye logs y contexto

---

## 📄 Licencia

Ver LICENSE del proyecto principal.

---

## 🎉 Créditos

- **Modelos**: [fal.ai](https://fal.ai)
- **LTX-2-19B**: Lightricks
- **SeedVR**: Tencent

---

**Última actualización**: 9 de Enero 2026  
**Versión**: 1.0.0  
**Estado**: Listo para integración 🚀

---

## 🔗 Links Útiles

- [Fal.ai Docs](https://docs.fal.ai)
- [LTX-2-19B Model](https://fal.ai/models/fal-ai/ltx-2-19b/text-to-video/lora)
- [SeedVR Upscaler](https://fal.ai/models/fal-ai/seedvr/upscale/video)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

---

**¿Listo para empezar?** 👉 [CHECKLIST-INTEGRACION-VIDEO.md](./CHECKLIST-INTEGRACION-VIDEO.md)
