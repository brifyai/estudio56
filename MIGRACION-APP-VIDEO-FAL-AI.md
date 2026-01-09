# 🔧 Migración: App.tsx a Sistema de Video fal.ai

**Problema**: App.tsx está usando `vertexVideoService` (antiguo) que devuelve imágenes  
**Solución**: Migrar a `falAiService` con `videoProgressAlert`

---

## 🐛 Error Actual

```
❌ Error cargando video: data:image/jpeg;base64,/9j/4AAQ...
```

**Causa**: `generateVideoAndWait` de Vertex AI está devolviendo una imagen en lugar de un video.

---

## ✅ Solución

Reemplazar el código de generación de video en `App.tsx` con el nuevo sistema.

### Código Actual (INCORRECTO)

```typescript
// App.tsx línea ~1367
const { generateVideoAndWait } = await import('./services/vertexVideoService');

const videoUrl = await generateVideoAndWait(
  {
    prompt: videoPrompt,
    aspectRatio: '9:16'
  },
  'draft'
);
```

### Código Nuevo (CORRECTO)

```typescript
// App.tsx - Importar al inicio del archivo
import { showVideoProgressAlert } from './services/videoProgressAlert';
import { generateDraftVideo } from './services/falAiService';
import Swal from 'sweetalert2';

// Dentro de la función de generación de video
try {
  // 1. Iniciar generación
  const result = await generateDraftVideo(videoPrompt, {
    aspectRatio: '9:16'
  });

  if (!result.success || !result.taskId) {
    throw new Error(result.error || 'Error iniciando generación');
  }

  // 2. Mostrar progreso con SweetAlert
  await showVideoProgressAlert({
    taskId: result.taskId,
    quality: 'draft',
    onComplete: (videoUrl) => {
      // 3. Video listo - actualizar estado
      console.log('✅ Video completado:', videoUrl);
      setVideoUrl(videoUrl); // o como guardes el video en tu estado
      setIsGeneratingVideo(false);
    },
    onError: (error) => {
      console.error('❌ Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error
      });
      setIsGeneratingVideo(false);
    }
  });

} catch (error: any) {
  console.error('❌ Error:', error);
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: error.message || 'Error generando video'
  });
  setIsGeneratingVideo(false);
}
```

---

## 📝 Pasos de Migración

### 1. Agregar Imports

Al inicio de `App.tsx`:

```typescript
import { showVideoProgressAlert } from './services/videoProgressAlert';
import { generateDraftVideo, upscaleVideoToHD } from './services/falAiService';
import Swal from 'sweetalert2';
```

### 2. Reemplazar Función de Generación

Buscar en App.tsx (línea ~1367):

```typescript
// ANTES ❌
const { generateVideoAndWait } = await import('./services/vertexVideoService');
const videoUrl = await generateVideoAndWait(...);
```

Reemplazar con:

```typescript
// AHORA ✅
const result = await generateDraftVideo(videoPrompt, {
  aspectRatio: '9:16'
});

await showVideoProgressAlert({
  taskId: result.taskId!,
  quality: 'draft',
  onComplete: (videoUrl) => {
    // Guardar video
    setDraftVideoUrl(videoUrl);
  }
});
```

### 3. Actualizar Estado

Asegúrate de tener un estado para el video:

```typescript
const [draftVideoUrl, setDraftVideoUrl] = useState<string | null>(null);
const [hdVideoUrl, setHdVideoUrl] = useState<string | null>(null);
```

### 4. Agregar Botón para HD

Después de mostrar el borrador:

```typescript
{draftVideoUrl && (
  <div>
    <video src={draftVideoUrl} controls />
    <button onClick={handleGenerateHD}>
      Generar HD (1080p)
    </button>
  </div>
)}
```

### 5. Función para Generar HD

```typescript
const handleGenerateHD = async () => {
  try {
    const result = await upscaleVideoToHD(draftVideoUrl!);
    
    if (!result.success || !result.taskId) {
      throw new Error(result.error);
    }

    await showVideoProgressAlert({
      taskId: result.taskId,
      quality: 'hd',
      onComplete: (videoUrl) => {
        setHdVideoUrl(videoUrl);
      },
      onError: (error) => {
        Swal.fire('Error', error, 'error');
      }
    });

  } catch (error: any) {
    Swal.fire('Error', error.message, 'error');
  }
};
```

---

## 🔍 Verificar Cambios

### Antes de la migración:
- [ ] Identificar línea donde se llama `generateVideoAndWait`
- [ ] Identificar dónde se guarda el `videoUrl`
- [ ] Identificar estado de loading

### Después de la migración:
- [ ] Imports agregados
- [ ] Función reemplazada
- [ ] SweetAlert se muestra
- [ ] Video se carga correctamente
- [ ] No hay errores en consola

---

## 🧪 Testing

1. **Generar borrador**:
   - Click en botón de generar video
   - Debe aparecer SweetAlert con progreso
   - Progreso debe avanzar (0% → 90%)
   - Video debe aparecer cuando completa

2. **Verificar video**:
   - Video debe ser reproducible
   - Debe ser formato MP4
   - Debe tener 5 segundos de duración
   - Debe ser 480p (borrador)

3. **Generar HD**:
   - Click en botón "Generar HD"
   - Debe aparecer SweetAlert con progreso
   - Video HD debe aparecer cuando completa
   - Debe ser 1080p

---

## ⚠️ Errores Comunes

### Error: "taskId is undefined"

**Causa**: `result.taskId` no existe  
**Solución**: Verificar que `generateDraftVideo` retorne `taskId`

```typescript
if (!result.success || !result.taskId) {
  throw new Error(result.error || 'No se obtuvo taskId');
}
```

### Error: "data:image/jpeg..."

**Causa**: Todavía está usando `vertexVideoService`  
**Solución**: Asegurarse de importar de `falAiService`

```typescript
// CORRECTO ✅
import { generateDraftVideo } from './services/falAiService';

// INCORRECTO ❌
import { generateVideoAndWait } from './services/vertexVideoService';
```

### SweetAlert no aparece

**Causa**: SweetAlert2 no instalado  
**Solución**: 

```bash
npm install sweetalert2
```

---

## 📦 Dependencias

Asegurarse de tener instalado:

```bash
npm install sweetalert2
```

---

## 🎯 Resultado Esperado

Después de la migración:

1. ✅ Click en "Generar Video"
2. ✅ SweetAlert aparece con progreso
3. ✅ Progreso avanza de 0% a 100%
4. ✅ Video aparece cuando completa
5. ✅ Video es reproducible (MP4, 5s, 480p)
6. ✅ Botón "Generar HD" disponible
7. ✅ HD se genera correctamente (1080p)

---

## 📞 Soporte

Si tienes problemas:

1. Verificar logs en consola
2. Verificar que `FAL_AI_API_KEY` esté configurada
3. Verificar que imports sean correctos
4. Revisar `GUIA-SWEETALERT-VIDEO-PROGRESO.md`

---

**Siguiente paso**: Aplicar cambios en App.tsx según esta guía 🚀
