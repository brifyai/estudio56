# 📱 FORMATOS DE VIDEO: STORY Y CUADRADO

**Fecha:** 7 de Enero, 2026  
**Cambio:** Videos ahora se generan en formato seleccionado por usuario

---

## 🎯 FORMATOS SOPORTADOS

### 1. Story / Vertical (9:16) - DEFAULT ⭐
**Uso:** Instagram Stories, TikTok, Reels, YouTube Shorts

**Resoluciones:**
- **Draft**: 480×832 (480P vertical)
- **HD**: 720×1280 (720P vertical)

**Características:**
- ✅ Formato vertical para móviles
- ✅ Ideal para redes sociales
- ✅ Máxima visibilidad en pantallas móviles

---

### 2. Cuadrado (1:1)
**Uso:** Instagram Feed, Facebook, LinkedIn

**Resoluciones:**
- **Draft**: 832×832 (480P cuadrado)
- **HD**: 1280×1280 (720P cuadrado)

**Características:**
- ✅ Formato universal
- ✅ Compatible con todas las plataformas
- ✅ Bueno para feeds de redes sociales

---

### 3. Horizontal (16:9) - OPCIONAL
**Uso:** YouTube, Facebook Video, LinkedIn Video

**Resoluciones:**
- **Draft**: 832×480 (480P horizontal)
- **HD**: 1280×720 (720P horizontal)

**Características:**
- ✅ Formato tradicional de video
- ✅ Ideal para YouTube
- ✅ Mejor para pantallas grandes

---

## 📊 TABLA DE RESOLUCIONES

| Aspect Ratio | Draft | HD | Uso Principal |
|--------------|-------|-----|---------------|
| **9:16 (Story)** | 480×832 | 720×1280 | Stories, TikTok, Reels ⭐ |
| **1:1 (Cuadrado)** | 832×832 | 1280×1280 | Instagram Feed, Facebook |
| **16:9 (Horizontal)** | 832×480 | 1280×720 | YouTube, Facebook Video |

---

## 🔧 IMPLEMENTACIÓN

### Mapeo de Aspect Ratio a Resoluciones:

```typescript
// Draft (480P base)
if (aspectRatio === '1:1') {
  size = '832*832';      // Cuadrado
} else if (aspectRatio === '16:9') {
  size = '832*480';      // Horizontal
} else {
  size = '480*832';      // Vertical (9:16) - DEFAULT
}

// HD (720P base)
if (aspectRatio === '1:1') {
  size = '1280*1280';    // Cuadrado
} else if (aspectRatio === '16:9') {
  size = '1280*720';     // Horizontal
} else {
  size = '720*1280';     // Vertical (9:16) - DEFAULT
}
```

---

## 📱 CASOS DE USO POR PLATAFORMA

### Instagram
- **Stories**: 9:16 (vertical) ✅
- **Reels**: 9:16 (vertical) ✅
- **Feed**: 1:1 (cuadrado) ✅
- **IGTV**: 9:16 (vertical) ✅

### TikTok
- **Videos**: 9:16 (vertical) ✅

### YouTube
- **Shorts**: 9:16 (vertical) ✅
- **Videos**: 16:9 (horizontal) ✅

### Facebook
- **Stories**: 9:16 (vertical) ✅
- **Feed**: 1:1 (cuadrado) o 16:9 ✅
- **Videos**: 16:9 (horizontal) ✅

### LinkedIn
- **Feed**: 1:1 (cuadrado) ✅
- **Videos**: 16:9 (horizontal) ✅

---

## 🎬 EJEMPLOS DE GENERACIÓN

### Ejemplo 1: Story para Instagram (9:16)
```typescript
{
  prompt: "Modern gym with people exercising",
  quality: "hd",
  aspectRatio: "9:16",  // ← Vertical
  duration: 5
}

// Resultado: 720×1280 (HD vertical)
```

### Ejemplo 2: Post cuadrado para Instagram (1:1)
```typescript
{
  prompt: "Pilates studio with natural lighting",
  quality: "hd",
  aspectRatio: "1:1",   // ← Cuadrado
  duration: 5
}

// Resultado: 1280×1280 (HD cuadrado)
```

### Ejemplo 3: Video para YouTube (16:9)
```typescript
{
  prompt: "Restaurant with customers dining",
  quality: "hd",
  aspectRatio: "16:9",  // ← Horizontal
  duration: 5
}

// Resultado: 1280×720 (HD horizontal)
```

---

## 💡 RECOMENDACIONES

### Para Estudio 56:

**Formato por defecto: 9:16 (Story)**
- ✅ Más popular en redes sociales
- ✅ Mejor para móviles
- ✅ Compatible con Stories, Reels, TikTok, Shorts

**Cuándo usar 1:1 (Cuadrado):**
- Feed de Instagram
- Posts de Facebook
- LinkedIn posts
- Contenido universal

**Cuándo usar 16:9 (Horizontal):**
- Videos de YouTube (no Shorts)
- Facebook Video
- LinkedIn Video
- Presentaciones

---

## 📊 TAMAÑOS DE ARCHIVO ESTIMADOS

### Draft (480P base):
- **9:16 (480×832)**: ~1-2 MB
- **1:1 (832×832)**: ~1.5-2.5 MB
- **16:9 (832×480)**: ~1-2 MB

### HD (720P base):
- **9:16 (720×1280)**: ~2-4 MB
- **1:1 (1280×1280)**: ~3-5 MB
- **16:9 (1280×720)**: ~2-4 MB

**Todos están dentro del límite de Netlify (6 MB)** ✅

---

## 🔄 FLUJO DE USUARIO

### En la UI:

1. Usuario selecciona **Tipo de medio**: Video
2. Usuario selecciona **Aspect Ratio**: 
   - 9:16 (Story) ⭐ DEFAULT
   - 1:1 (Cuadrado)
   - 16:9 (Horizontal)
3. Usuario selecciona **Calidad**:
   - Draft (rápido, menor resolución)
   - HD (mejor calidad)
4. Sistema genera video en formato seleccionado

---

## ⚠️ LIMITACIONES DE ALIBABA CLOUD

### Resoluciones Soportadas:

**wan2.1-t2v-turbo (Draft):**
- ✅ 480×832 (9:16)
- ✅ 832×832 (1:1)
- ✅ 832×480 (16:9)

**wan2.5-t2v-preview (HD):**
- ✅ 720×1280 (9:16)
- ✅ 1280×1280 (1:1)
- ✅ 1280×720 (16:9)

**Nota:** Alibaba Cloud acepta cualquier resolución en formato `ancho*alto`, pero estas son las óptimas para cada aspect ratio.

---

## 🧪 PRUEBAS RECOMENDADAS

### Prueba 1: Story Vertical (9:16)
```
Aspect Ratio: 9:16
Quality: Draft
Resultado esperado: 480×832
Uso: Instagram Stories
```

### Prueba 2: Post Cuadrado (1:1)
```
Aspect Ratio: 1:1
Quality: HD
Resultado esperado: 1280×1280
Uso: Instagram Feed
```

### Prueba 3: Video Horizontal (16:9)
```
Aspect Ratio: 16:9
Quality: HD
Resultado esperado: 1280×720
Uso: YouTube
```

---

## 📝 LOGS ESPERADOS

### Generación Exitosa (9:16):
```
🎯 [Alibaba Video] Modelo seleccionado: wan2.5-t2v-preview
📐 [Alibaba Video] Aspect Ratio: 9:16
📐 [Alibaba Video] Resolución (size): 720*1280
⏱️ [Alibaba Video] Duración: 5 segundos
```

### Generación Exitosa (1:1):
```
🎯 [Alibaba Video] Modelo seleccionado: wan2.5-t2v-preview
📐 [Alibaba Video] Aspect Ratio: 1:1
📐 [Alibaba Video] Resolución (size): 1280*1280
⏱️ [Alibaba Video] Duración: 5 segundos
```

---

## 🎯 CONFIGURACIÓN FINAL

**Formatos implementados:**
- ✅ 9:16 (Story/Vertical) - DEFAULT
- ✅ 1:1 (Cuadrado)
- ✅ 16:9 (Horizontal)

**Calidades:**
- ✅ Draft (480P base)
- ✅ HD (720P base)

**Duración:**
- ✅ 5 segundos (configurable)

---

**Última actualización:** 7 de Enero, 2026  
**Estado:** ✅ Implementado  
**Acción requerida:** Commit, push y probar
