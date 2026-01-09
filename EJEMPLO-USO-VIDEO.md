# Ejemplo de Uso: Generación de Video

## 📋 Flujo Completo

```typescript
import { 
  generateDraftVideo, 
  upscaleVideoToHD, 
  checkVideoStatus 
} from './services/falAiService';

// ============================================
// PASO 1: GENERAR BORRADOR (480p)
// ============================================

async function generarBorrador() {
  const prompt = "A cowboy walking through a dusty town at high noon, camera following from behind, cinematic depth, realistic lighting, western mood, 4K film grain.";
  
  // Iniciar generación de borrador
  const result = await generateDraftVideo(prompt, {
    aspectRatio: '9:16' // vertical para stories
  });
  
  if (!result.success) {
    console.error('Error:', result.error);
    return;
  }
  
  console.log('Tarea iniciada:', result.taskId);
  
  // Polling hasta completar
  const videoUrl = await pollUntilComplete(result.taskId!);
  
  console.log('Borrador completado:', videoUrl);
  return videoUrl;
}

// ============================================
// PASO 2: UPSCALE A HD (1080p)
// ============================================

async function generarHD(borradorUrl: string) {
  // Iniciar upscale
  const result = await upscaleVideoToHD(borradorUrl);
  
  if (!result.success) {
    console.error('Error:', result.error);
    return;
  }
  
  console.log('Upscale iniciado:', result.taskId);
  
  // Polling hasta completar
  const videoUrl = await pollUntilComplete(result.taskId!);
  
  console.log('HD completado:', videoUrl);
  return videoUrl;
}

// ============================================
// HELPER: POLLING
// ============================================

async function pollUntilComplete(taskId: string): Promise<string> {
  const maxAttempts = 120; // 10 minutos máximo (5s * 120)
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const status = await checkVideoStatus(taskId);
    
    if (!status.success) {
      throw new Error(status.error || 'Error consultando estado');
    }
    
    if (status.status === 'COMPLETED') {
      return status.videoUrl!;
    }
    
    if (status.status === 'FAILED') {
      throw new Error(status.error || 'Video falló');
    }
    
    // Esperar 5 segundos antes de reintentar
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
    
    console.log(`Intento ${attempts}/${maxAttempts} - Estado: ${status.status}`);
  }
  
  throw new Error('Timeout: Video tardó más de 10 minutos');
}

// ============================================
// EJEMPLO COMPLETO CON UI
// ============================================

async function flujoCompletoConUI() {
  try {
    // Mostrar loading
    showLoading('Generando borrador 480p...');
    
    // Generar borrador
    const borradorUrl = await generarBorrador();
    
    // Mostrar borrador al usuario
    showVideo(borradorUrl, 'draft');
    
    // Preguntar si quiere HD
    const quiereHD = await confirmarHD();
    
    if (quiereHD) {
      showLoading('Generando HD 1080p...');
      
      // Generar HD
      const hdUrl = await generarHD(borradorUrl);
      
      // Mostrar HD
      showVideo(hdUrl, 'hd');
      
      // Mostrar comparación
      showComparison(borradorUrl, hdUrl);
    }
    
  } catch (error: any) {
    showError(error.message);
  }
}

// ============================================
// HELPERS DE UI (EJEMPLO)
// ============================================

function showLoading(message: string) {
  // Mostrar spinner con mensaje
  console.log('Loading:', message);
}

function showVideo(url: string, quality: 'draft' | 'hd') {
  // Mostrar video en player
  console.log(`Mostrando video ${quality}:`, url);
}

async function confirmarHD(): Promise<boolean> {
  // Mostrar modal de confirmación
  return confirm('¿Quieres generar la versión HD (1080p)?');
}

function showComparison(draftUrl: string, hdUrl: string) {
  // Mostrar comparación lado a lado
  console.log('Comparación:', { draftUrl, hdUrl });
}

function showError(message: string) {
  // Mostrar error al usuario
  console.error('Error:', message);
}
```

## 🎨 Componente React Ejemplo

```tsx
import React, { useState } from 'react';
import { generateDraftVideo, upscaleVideoToHD, checkVideoStatus } from '../services/falAiService';

export const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [draftUrl, setDraftUrl] = useState<string | null>(null);
  const [hdUrl, setHdUrl] = useState<string | null>(null);

  const handleGenerateDraft = async () => {
    setLoading(true);
    setStatus('Generando borrador 480p...');
    
    try {
      // Iniciar generación
      const result = await generateDraftVideo(prompt, {
        aspectRatio: '9:16'
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Polling
      const videoUrl = await pollVideo(result.taskId!, (msg) => setStatus(msg));
      
      setDraftUrl(videoUrl);
      setStatus('Borrador completado');
      
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHD = async () => {
    if (!draftUrl) return;
    
    setLoading(true);
    setStatus('Generando HD 1080p...');
    
    try {
      // Iniciar upscale
      const result = await upscaleVideoToHD(draftUrl);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Polling
      const videoUrl = await pollVideo(result.taskId!, (msg) => setStatus(msg));
      
      setHdUrl(videoUrl);
      setStatus('HD completado');
      
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const pollVideo = async (
    taskId: string, 
    onProgress: (msg: string) => void
  ): Promise<string> => {
    const maxAttempts = 120;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const status = await checkVideoStatus(taskId);
      
      if (!status.success) {
        throw new Error(status.error);
      }
      
      if (status.status === 'COMPLETED') {
        return status.videoUrl!;
      }
      
      if (status.status === 'FAILED') {
        throw new Error(status.error || 'Video falló');
      }
      
      onProgress(`Procesando... (${attempts + 1}/${maxAttempts})`);
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }
    
    throw new Error('Timeout');
  };

  return (
    <div className="video-generator">
      <h2>Generador de Videos</h2>
      
      {/* Input de prompt */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe tu video..."
        rows={4}
        disabled={loading}
      />
      
      {/* Botón generar borrador */}
      <button 
        onClick={handleGenerateDraft}
        disabled={loading || !prompt}
      >
        Generar Borrador (480p)
      </button>
      
      {/* Estado */}
      {status && <p className="status">{status}</p>}
      
      {/* Video borrador */}
      {draftUrl && (
        <div className="draft-video">
          <h3>Borrador (480p)</h3>
          <video src={draftUrl} controls />
          
          <button 
            onClick={handleGenerateHD}
            disabled={loading}
          >
            Generar HD (1080p)
          </button>
        </div>
      )}
      
      {/* Video HD */}
      {hdUrl && (
        <div className="hd-video">
          <h3>HD (1080p)</h3>
          <video src={hdUrl} controls />
        </div>
      )}
      
      {/* Comparación */}
      {draftUrl && hdUrl && (
        <div className="comparison">
          <h3>Comparación</h3>
          <div className="side-by-side">
            <div>
              <p>Borrador (480p)</p>
              <video src={draftUrl} controls />
            </div>
            <div>
              <p>HD (1080p)</p>
              <video src={hdUrl} controls />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

## 📊 Tiempos Estimados

- **Borrador (480p)**: 30-60 segundos
- **HD (1080p)**: 2-5 minutos
- **Total**: 2.5-6 minutos para flujo completo

## 💰 Costos Estimados (Aproximados)

- **Borrador (480p)**: ~$0.05 - $0.10
- **HD Upscale**: ~$0.15 - $0.25
- **Total**: ~$0.20 - $0.35 por video completo

## ⚠️ Manejo de Errores

```typescript
try {
  const result = await generateDraftVideo(prompt);
  
  if (!result.success) {
    // Errores comunes:
    // - "API Key de Fal.ai inválida"
    // - "Límite de cuota excedido"
    // - "Contenido rechazado por filtros de seguridad"
    console.error(result.error);
  }
  
} catch (error) {
  // Errores de red, timeout, etc.
  console.error(error);
}
```

## 🎯 Mejores Prácticas

1. **Mostrar preview del borrador** antes de generar HD
2. **Permitir modificaciones** del prompt antes de HD
3. **Guardar URL del borrador** para poder regenerar HD
4. **Implementar sistema de créditos** (borrador = 1, HD = 3)
5. **Mostrar progreso** durante polling
6. **Timeout razonable** (10 minutos máximo)
7. **Retry logic** para errores temporales
8. **Cache de videos** para evitar regenerar
