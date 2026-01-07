# 🚀 MIGRACIÓN A ALIBABA CLOUD - RESUMEN EJECUTIVO

**Fecha:** 7 de Enero, 2026  
**Estado:** ✅ Código actualizado - ⚠️ Requiere configuración en Netlify

---

## ✅ CAMBIOS COMPLETADOS

### Archivos Actualizados

1. **`netlify/functions/generate-video.ts`**
   - Migrado de Vertex AI a Alibaba Cloud Model Studio
   - Usa API Key en lugar de Service Account
   - Endpoint: `https://dashscope-intl.aliyuncs.com/api/v1`
   - Retorna `taskId` para polling

2. **`netlify/functions/check-video-operation.ts`**
   - Actualizado para polling de tareas de Alibaba Cloud
   - Maneja estados: PENDING, RUNNING, SUCCEEDED, FAILED, UNKNOWN
   - Endpoint: `https://dashscope-intl.aliyuncs.com/api/v1/tasks/{taskId}`

3. **`services/vertexVideoService.ts`**
   - Actualizado para usar Alibaba Cloud
   - Nueva interfaz con `imageUrl` y `quality`
   - Polling cada 5 segundos (máximo 10 minutos)

---

## 🎬 MODELOS CONFIGURADOS

### Draft (Borrador)
- **Modelo**: `wan2.2-i2v-flash`
- **Resolución**: 480P
- **Duración**: 5 segundos (fijo)
- **Uso**: Previsualizaciones rápidas

### HD (Alta Definición)
- **Modelo**: `wan2.6-i2v`
- **Resolución**: 720P / 1080P
- **Duración**: 5, 10, o 15 segundos
- **Uso**: Videos finales

---

## ⚠️ ACCIÓN REQUERIDA: CONFIGURAR NETLIFY

### 🔑 Variable de Entorno Requerida

**Debes configurar esta variable en Netlify:**

```
Nombre: ALIBABA_API_KEY
Valor: sk-d4d0dc3e27874fd5aeb00a4c741624f5
```

### 📋 Pasos para Configurar

1. **Ir a Netlify Dashboard**
   - URL: https://app.netlify.com/sites/estudio56/settings/env

2. **Agregar Variable**
   - Clic en "Add a variable"
   - Key: `ALIBABA_API_KEY`
   - Value: `sk-d4d0dc3e27874fd5aeb00a4c741624f5`
   - Scopes: ☑ All deploys, ☑ All branches

3. **Redesplegar**
   - Ir a "Deploys"
   - Clic en "Trigger deploy" → "Deploy site"
   - Esperar 2-3 minutos

---

## 🔄 DIFERENCIAS CLAVE

| Aspecto | Antes (Vertex AI) | Ahora (Alibaba Cloud) |
|---------|-------------------|----------------------|
| **Autenticación** | Service Account JSON | API Key simple |
| **Endpoint** | Google Cloud | Alibaba Cloud |
| **Método** | :predict | Async Task + Polling |
| **Identificador** | operationName | taskId |
| **Cuota** | ❌ Agotada | ✅ Disponible |
| **Input** | Solo prompt | Prompt + imagen |

---

## 📊 FLUJO DE GENERACIÓN

### Antes (Vertex AI)
```
1. POST /generate-video → operationName
2. Poll operationName → video
```

### Ahora (Alibaba Cloud)
```
1. POST /generate-video → taskId
2. Poll taskId → video URL (válida 24h)
```

---

## 🧪 CÓMO PROBAR

### En el Frontend (App.tsx)

El código existente debería funcionar con cambios mínimos:

```typescript
// Antes
const result = await generateVideoAndWait({
  prompt: "A cat running",
  aspectRatio: "9:16"
});

// Ahora (requiere imagen)
const result = await generateVideoAndWait({
  prompt: "A cat running",
  imageUrl: draftImageUrl,  // ← Imagen requerida
  quality: "draft",          // ← 'draft' o 'hd'
  aspectRatio: "9:16"
});
```

---

## ⚠️ IMPORTANTE: URLs TEMPORALES

Las URLs de video de Alibaba Cloud **expiran en 24 horas**.

**Opciones:**
1. ✅ Descargar video inmediatamente
2. ✅ Guardar en storage permanente (Supabase Storage)
3. ⚠️ Regenerar si expira

---

## 🐛 ERRORES COMUNES

### "ALIBABA_API_KEY no está configurada"
→ Configurar variable en Netlify (ver arriba)

### "InvalidApiKey"
→ Verificar que API Key sea correcta

### "Throttling.RateQuota"
→ Límite de cuota excedido, esperar o aumentar cuota

---

## 📝 PRÓXIMOS PASOS

1. [ ] **Configurar `ALIBABA_API_KEY` en Netlify** (CRÍTICO)
2. [ ] Redesplegar sitio
3. [ ] Probar generación de video draft
4. [ ] Probar generación de video HD
5. [ ] Verificar que videos se generan correctamente
6. [ ] (Opcional) Implementar descarga automática de videos

---

## 📞 SOPORTE

Si tienes problemas:

1. **Verificar logs en Netlify**
   - https://app.netlify.com/sites/estudio56/logs

2. **Verificar cuota en Alibaba Cloud**
   - https://modelstudio.console.alibabacloud.com/

3. **Revisar documentación**
   - Ver `CONFIGURACION-ALIBABA-CLOUD.md`

---

**Estado Final:** ✅ Código listo - ⚠️ Requiere configuración de variable de entorno en Netlify
