# 🚀 CONFIGURACIÓN DE ALIBABA CLOUD MODEL STUDIO

**Fecha:** 7 de Enero, 2026  
**Cambio:** Migración de Vertex AI a Alibaba Cloud Model Studio (Wanx)

---

## 📋 RESUMEN DEL CAMBIO

Se ha migrado el sistema de generación de videos de **Google Vertex AI (Veo)** a **Alibaba Cloud Model Studio (Wanx)** por las siguientes razones:

1. ✅ **Cuota disponible**: Alibaba Cloud tiene cuota activa
2. ✅ **Modelos más económicos**: wan2.2-i2v-flash (480P) para borradores
3. ✅ **Mejor calidad**: wan2.6-i2v para videos HD
4. ✅ **API más simple**: Proceso asíncrono con polling claro

---

## 🔑 CONFIGURACIÓN DE VARIABLE DE ENTORNO EN NETLIFY

### Paso 1: Acceder a Netlify Dashboard

1. Ve a https://app.netlify.com
2. Selecciona tu sitio: **estudio56**
3. Ve a **Site settings** (Configuración del sitio)

### Paso 2: Agregar Variable de Entorno

1. En el menú lateral, haz clic en **Environment variables** (Variables de entorno)
2. Haz clic en **Add a variable** (Agregar una variable)
3. Configura la variable:

```
Key (Clave):
ALIBABA_API_KEY

Value (Valor):
sk-d4d0dc3e27874fd5aeb00a4c741624f5

Scopes (Alcances):
☑ All deploys (Todos los despliegues)
☑ All branches (Todas las ramas)
```

4. Haz clic en **Create variable** (Crear variable)

### Paso 3: Redesplegar el Sitio

Después de agregar la variable de entorno, necesitas redesplegar:

1. Ve a **Deploys** (Despliegues)
2. Haz clic en **Trigger deploy** → **Deploy site**
3. Espera a que el despliegue termine (2-3 minutos)

---

## 🎬 MODELOS DISPONIBLES

### Draft (Borrador) - wan2.2-i2v-flash
- **Resolución**: 480P
- **Velocidad**: Rápido (~1-2 minutos)
- **Costo**: Económico
- **Uso**: Previsualizaciones, borradores, pruebas

### HD (Alta Definición) - wan2.6-i2v
- **Resolución**: 720P / 1080P
- **Velocidad**: Moderado (~3-5 minutos)
- **Costo**: Estándar
- **Uso**: Videos finales, producción

---

## 📊 COMPARACIÓN: VERTEX AI vs ALIBABA CLOUD

| Característica | Vertex AI (Veo) | Alibaba Cloud (Wanx) |
|----------------|-----------------|----------------------|
| **Estado de Cuota** | ❌ Agotada (429) | ✅ Disponible |
| **Modelo Draft** | veo-3.1-generate-001 | wan2.2-i2v-flash |
| **Modelo HD** | veo-3.1-generate-001 | wan2.6-i2v |
| **Resolución Draft** | 720P | 480P |
| **Resolución HD** | 1080P | 720P/1080P |
| **Tiempo Generación** | 3-5 min | 1-5 min |
| **API** | Google Cloud | Alibaba Cloud |
| **Autenticación** | Service Account | API Key |
| **Método** | :predict | Async Task |

---

## 🔧 ARCHIVOS MODIFICADOS

### 1. `netlify/functions/generate-video.ts`
**Cambios:**
- ✅ Reemplazado Google Auth por Alibaba API Key
- ✅ Cambiado endpoint a Alibaba Cloud
- ✅ Actualizada estructura de request
- ✅ Retorna `taskId` en lugar de `operationName`

### 2. `netlify/functions/check-video-operation.ts`
**Cambios:**
- ✅ Actualizado para polling de Alibaba Cloud
- ✅ Maneja estados: PENDING, RUNNING, SUCCEEDED, FAILED, UNKNOWN
- ✅ Retorna `videoUrl` cuando está completo

### 3. `services/vertexVideoService.ts`
**Cambios:**
- ✅ Renombrado a servicio de Alibaba (mantiene nombre por compatibilidad)
- ✅ Actualizada interfaz `VideoGenerationOptions`
- ✅ Agregado parámetro `imageUrl` (requerido)
- ✅ Agregado parámetro `quality: 'draft' | 'hd'`
- ✅ Actualizado polling para usar `taskId`

---

## 🧪 PRUEBAS RECOMENDADAS

### Prueba 1: Video Draft (480P)
```typescript
const result = await generateVideoAndWait({
  prompt: "A cat running on the grass",
  imageUrl: "https://example.com/cat.jpg",
  quality: "draft",
  aspectRatio: "9:16",
  duration: 5
});
```

**Resultado esperado:**
- ✅ Video generado en 1-2 minutos
- ✅ Resolución 480P
- ✅ URL válida por 24 horas

### Prueba 2: Video HD (720P)
```typescript
const result = await generateVideoAndWait({
  prompt: "Professional Pilates studio session",
  imageUrl: "https://example.com/pilates.jpg",
  quality: "hd",
  aspectRatio: "9:16",
  duration: 5
});
```

**Resultado esperado:**
- ✅ Video generado en 3-5 minutos
- ✅ Resolución 720P
- ✅ Mayor calidad visual

---

## ⚠️ NOTAS IMPORTANTES

### 1. URLs de Video Temporales
- ⏰ **Validez**: 24 horas
- 📥 **Acción requerida**: Descargar o guardar en storage permanente
- 🔄 **Después de 24h**: URL expira y video no es accesible

### 2. Límites de API
- 📊 **Cuota**: Verificar en Alibaba Cloud Console
- 🚦 **Rate Limiting**: Respetar límites de requests por minuto
- 💰 **Costos**: Revisar pricing en https://modelstudio.console.alibabacloud.com/

### 3. Requisitos de Imagen
- 📐 **Formatos**: JPEG, JPG, PNG, BMP, WEBP
- 📏 **Resolución**: 360-2000 píxeles (ancho y alto)
- 💾 **Tamaño**: Máximo 10 MB
- 🚫 **Alpha channels**: No soportados en PNG

### 4. Duración de Videos
- **wan2.2-i2v-flash**: Fijo 5 segundos
- **wan2.6-i2v**: 5, 10, o 15 segundos

---

## 🐛 TROUBLESHOOTING

### Error: "ALIBABA_API_KEY no está configurada"
**Causa:** Variable de entorno no configurada en Netlify  
**Solución:** Seguir Paso 2 de configuración arriba

### Error: "InvalidApiKey"
**Causa:** API Key incorrecta o inválida  
**Solución:** Verificar que la API Key sea correcta en Netlify

### Error: "Throttling.RateQuota"
**Causa:** Límite de cuota excedido  
**Solución:** Esperar o aumentar cuota en Alibaba Cloud Console

### Error: "Task status: FAILED"
**Causa:** Error en generación (imagen inválida, prompt problemático)  
**Solución:** Verificar logs en Netlify para detalles del error

### Error: "Task status: UNKNOWN"
**Causa:** Tarea expiró (>24 horas)  
**Solución:** Generar nuevo video

---

## 📝 CHECKLIST DE MIGRACIÓN

- [x] Actualizar `generate-video.ts` para Alibaba Cloud
- [x] Actualizar `check-video-operation.ts` para polling
- [x] Actualizar `vertexVideoService.ts` en frontend
- [ ] **Configurar `ALIBABA_API_KEY` en Netlify** ⚠️ PENDIENTE
- [ ] Redesplegar sitio en Netlify
- [ ] Probar generación de video draft
- [ ] Probar generación de video HD
- [ ] Verificar que URLs de video funcionan
- [ ] Implementar descarga/storage de videos (opcional)

---

## 🔗 RECURSOS

- **Alibaba Cloud Console**: https://modelstudio.console.alibabacloud.com/
- **Documentación API**: https://www.alibabacloud.com/help/en/model-studio/image-to-video-api-reference/
- **Netlify Dashboard**: https://app.netlify.com/sites/estudio56/
- **Pricing**: https://www.alibabacloud.com/help/en/model-studio/billing-and-throttling

---

**Última actualización:** 7 de Enero, 2026  
**Estado:** ✅ Código actualizado - ⚠️ Pendiente configuración en Netlify
