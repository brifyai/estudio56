# 🎬 Guía: SweetAlert de Progreso para Videos

## 📋 Descripción

Sistema de alertas con SweetAlert2 que muestra el progreso en tiempo real durante la generación de videos (borrador y HD).

---

## ✨ Características

✅ **Alerta automática** - Aparece al iniciar generación  
✅ **Progreso en tiempo real** - Actualiza cada 5 segundos  
✅ **Mensajes dinámicos** - Según estado (en cola, procesando, etc.)  
✅ **Cierre automático** - Desaparece cuando video está listo  
✅ **Manejo de errores** - Muestra errores si falla  
✅ **No bloqueante** - Usuario puede ver el progreso  

---

## 🚀 Uso Básico

### 1. Importar

```typescript
import { showVideoProgressAlert } from './services/videoProgressAlert';
import { generateDraftVideo, upscaleVideoToHD } from './services/falAiService';
```

### 2. Generar Borrador

```typescript
const handleGenerateDraft = async () => {
  // Iniciar generación
  const result = await generateDraftVideo(prompt, {
    aspectRatio: '9:16'
  });

  // Mostrar progreso
  await showVideoProgressAlert({
    taskId: result.taskId!,
    quality: 'draft',
    onComplete: (videoUrl) => {
      // Video listo - guardar y mostrar
      setDraftVideoUrl(videoUrl);
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  });
};
```

### 3. Generar HD

```typescript
const handleGenerateHD = async () => {
  // Iniciar upscale
  const result = await upscaleVideoToHD(draftVideoUrl);

  // Mostrar progreso
  await showVideoProgressAlert({
    taskId: result.taskId!,
    quality: 'hd',
    onComplete: (videoUrl) => {
      // Video HD listo - guardar y mostrar
      setHdVideoUrl(videoUrl);
    },
    onError: (error) => {
      console.error('Error:', error);
    }
  });
};
```

---

## 📊 Estados del SweetAlert

### Durante Generación

```
┌─────────────────────────────────┐
│  🎬 Generando Borrador          │
│                                 │
│     [Spinner animado]           │
│                                 │
│  Preparando generación...       │
│  Progreso: 15% • Intento 3/24   │
└─────────────────────────────────┘
```

### Cuando Completa

```
┌─────────────────────────────────┐
│  ✅ Borrador Completado         │
│                                 │
│  Tu video borrador está listo   │
│                                 │
│  [Se cierra en 1.5 segundos]    │
└─────────────────────────────────┘
```

### Si Hay Error

```
┌─────────────────────────────────┐
│  ❌ Error                       │
│                                 │
│  Timeout: El video tardó más    │
│  de lo esperado                 │
│                                 │
│     [Botón: Entendido]          │
└─────────────────────────────────┘
```

---

## 🎨 Mensajes por Calidad

### Borrador (480p)

- **Título**: "🎬 Generando Borrador"
- **Preparando**: "Preparando generación..."
- **En cola**: "En cola de procesamiento..."
- **Procesando**: "Generando video en 480p..."
- **Casi listo**: "¡Casi listo! Finalizando..."
- **Éxito**: "✅ Borrador Completado"
- **Tiempo estimado**: 40-80 segundos

### HD (1080p)

- **Título**: "✨ Generando HD"
- **Preparando**: "Preparando upscale a 1080p..."
- **En cola**: "En cola de procesamiento..."
- **Procesando**: "Mejorando calidad a HD..."
- **Casi listo**: "¡Casi listo! Finalizando HD..."
- **Éxito**: "✅ HD Completado"
- **Tiempo estimado**: 3-6 minutos

---

## ⚙️ Configuración

### Parámetros

```typescript
interface ProgressConfig {
  taskId: string;              // ID de la tarea (de fal.ai)
  quality: 'draft' | 'hd';     // Tipo de video
  onComplete: (videoUrl: string) => void;  // Callback cuando completa
  onError?: (error: string) => void;       // Callback si hay error
}
```

### Polling

- **Intervalo**: 5 segundos
- **Timeout borrador**: 2 minutos (24 intentos)
- **Timeout HD**: 6 minutos (72 intentos)
- **Actualización**: Progreso y mensaje cada intento

---

## 🔧 Funciones Disponibles

### showVideoProgressAlert()

Muestra alerta y hace polling hasta completar.

```typescript
await showVideoProgressAlert({
  taskId: 'request_id_123',
  quality: 'draft',
  onComplete: (videoUrl) => {
    console.log('Video listo:', videoUrl);
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});
```

### cancelVideoPolling()

Cancela el polling actual (útil si usuario cierra).

```typescript
import { cancelVideoPolling } from './services/videoProgressAlert';

// En cleanup o unmount
useEffect(() => {
  return () => {
    cancelVideoPolling();
  };
}, []);
```

---

## 📝 Ejemplo Completo

Ver archivo: `EJEMPLO-SWEETALERT-VIDEO.tsx`

```typescript
import { showVideoProgressAlert } from './services/videoProgressAlert';

const MyComponent = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      // 1. Iniciar generación
      const result = await generateDraftVideo(prompt);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // 2. Mostrar progreso (automático)
      await showVideoProgressAlert({
        taskId: result.taskId!,
        quality: 'draft',
        onComplete: (url) => {
          // 3. Video listo - mostrar
          setVideoUrl(url);
        }
      });

    } catch (error: any) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div>
      <button onClick={handleGenerate}>
        Generar Video
      </button>
      
      {videoUrl && (
        <video src={videoUrl} controls />
      )}
    </div>
  );
};
```

---

## 🎯 Flujo Completo

```
Usuario hace clic en "Generar"
        ↓
Llamar generateDraftVideo()
        ↓
Obtener taskId
        ↓
Llamar showVideoProgressAlert()
        ↓
[SweetAlert aparece]
        ↓
Polling cada 5 segundos
        ↓
Actualizar progreso en SweetAlert
        ↓
Video completado
        ↓
[SweetAlert muestra éxito 1.5s]
        ↓
[SweetAlert se cierra automáticamente]
        ↓
Callback onComplete() ejecutado
        ↓
Video listo para reproducir
```

---

## ⚠️ Manejo de Errores

### Error de Red

```typescript
// El polling continúa intentando
// No cierra el SweetAlert por errores temporales
```

### Error de Generación

```typescript
// Muestra error en SweetAlert
// Ejecuta callback onError()
Swal.fire({
  icon: 'error',
  title: '❌ Error',
  text: 'Contenido rechazado por filtros',
  confirmButtonText: 'Entendido'
});
```

### Timeout

```typescript
// Después de max intentos
Swal.fire({
  icon: 'error',
  title: '❌ Error',
  text: 'Timeout: El video tardó más de lo esperado',
  confirmButtonText: 'Entendido'
});
```

---

## 🎨 Personalización

### Cambiar Mensajes

Editar en `videoProgressAlert.ts`:

```typescript
const MESSAGES = {
  draft: {
    title: '🎬 Tu Título',
    processing: 'Tu mensaje...',
    // ...
  }
};
```

### Cambiar Tiempos

```typescript
const pollInterval = 5000;  // 5 segundos
const maxAttempts = 24;     // 2 minutos
```

### Cambiar Estilos

```typescript
Swal.fire({
  title: messages.title,
  html: `
    <div style="tu-estilo-aqui">
      <!-- Tu HTML -->
    </div>
  `,
  // ...
});
```

---

## ✅ Checklist de Integración

- [ ] Instalar SweetAlert2: `npm install sweetalert2`
- [ ] Copiar `services/videoProgressAlert.ts`
- [ ] Importar en tu componente
- [ ] Llamar `showVideoProgressAlert()` después de iniciar generación
- [ ] Implementar callbacks `onComplete` y `onError`
- [ ] Probar con borrador
- [ ] Probar con HD
- [ ] Probar manejo de errores

---

## 🐛 Troubleshooting

### SweetAlert no aparece

```typescript
// Verificar que SweetAlert2 esté instalado
import Swal from 'sweetalert2';
```

### Progreso no se actualiza

```typescript
// Verificar que taskId sea válido
console.log('TaskID:', result.taskId);
```

### Video no se muestra después

```typescript
// Verificar callback onComplete
onComplete: (videoUrl) => {
  console.log('URL recibida:', videoUrl);
  setVideoUrl(videoUrl);
}
```

---

## 📚 Referencias

- [SweetAlert2 Docs](https://sweetalert2.github.io/)
- [Ejemplo completo](./EJEMPLO-SWEETALERT-VIDEO.tsx)
- [Servicio de video](./services/falAiService.ts)

---

**¿Listo para usar?** Copia `videoProgressAlert.ts` y sigue el ejemplo 🚀
