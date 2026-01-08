# Modelos fal.ai para Image-to-Image

## Modelos disponibles (según docs.fal.ai)

### Stable Diffusion XL img2img
```
fal-ai/stable-diffusion-xl-1.0/img2img
```

### Stable Diffusion 1.5 img2img
```
fal-ai/stable-diffusion-v1-5/img2img
```

### Flux Schnell (más rápido)
```
fal-ai/flux/schnell
```

### Flux Dev (mejor calidad)
```
fal-ai/flux/dev
```

## Ejemplo de uso según la documentación

```javascript
const response = await fetch('https://api.fal.ai/v1/fal-ai/stable-diffusion-xl-1.0/img2img', {
  method: 'POST',
  headers: {
    'Authorization': 'Key TU_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'your prompt here',
    image: 'base64_or_url', // La imagen de referencia
    strength: 0.1, // 0-1, menor = más similar
    guidance_scale: 7.5,
    num_inference_steps: 25,
  })
});
```

## Verificar modelos disponibles

1. Ir a https://fal.ai/models
2. Buscar "img2img" o "stable diffusion"
3. Copiar el ID exacto del modelo

## Problemas comunes

### 404 Not Found
- El modelo no existe o el nombre está mal escrito
- Verificar en https://fal.ai/models

### 401 Unauthorized
- API key inválida o no configurada
- Verificar que la variable de entorno esté correcta

### 400 Bad Request
- Parámetros inválidos
- Verificar que strength esté entre 0 y 1
- Verificar dimensiones de imagen