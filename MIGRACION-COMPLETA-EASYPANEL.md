# MIGRACIÓN COMPLETA A EASYPANEL - GUÍA FINAL

## ✅ CAMBIOS REALIZADOS

### 1. Servidor Express
- ✅ Creado `server.js` - servidor principal
- ✅ Creadas rutas en `server/routes/`:
  - `analyze-url.js` - Análisis de URLs con Vertex AI
  - `generate-image.js` - Generación de imágenes con FAL AI
  - `create-payment.js` - Creación de pagos con MercadoPago
  - `check-video-status.js` - Verificación de estado de videos
  - `mercadopago-webhook.js` - Webhook de MercadoPago

### 2. Actualización de Código React
- ✅ `components/canvas/CanvasEditor.tsx` - Cambio de `/.netlify/functions/analyze-brand-url-vertex` a `/api/analyze-url`
- ✅ `components/brand/BrandSidebar.tsx` - Cambio de `/.netlify/functions/analyze-brand-url` a `/api/analyze-url`
- ✅ `components/PlanSelectionModal.tsx` - Cambio de `/.netlify/functions/create-subscription` a `/api/create-payment`

### 3. Dockerfile Actualizado
- ✅ Build stage: Compila React + instala dependencias
- ✅ Production stage: Sirve frontend + backend Express en puerto 3000
- ✅ Todas las variables de entorno configuradas

### 4. Package.json Actualizado
- ✅ Agregadas dependencias: `express`, `cors`
- ✅ Nuevos scripts: `server`, `start`

## ARQUITECTURA FINAL

```
┌─────────────────────────────────────────────────────────┐
│                    EASYPANEL (Todo)                     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Express Server (Puerto 3000)            │   │
│  │                                                 │   │
│  │  ┌──────────────────────────────────────────┐  │   │
│  │  │  Frontend React (Servido estáticamente)  │  │   │
│  │  │  - Todos los componentes                 │  │   │
│  │  │  - Supabase Auth                         │  │   │
│  │  └──────────────────────────────────────────┘  │   │
│  │                                                 │   │
│  │  ┌──────────────────────────────────────────┐  │   │
│  │  │  Backend API (Express Routes)            │  │   │
│  │  │  - /api/analyze-url                      │  │   │
│  │  │  - /api/generate-image                   │  │   │
│  │  │  - /api/create-payment                   │  │   │
│  │  │  - /api/check-video-status               │  │   │
│  │  │  - /api/mercadopago-webhook              │  │   │
│  │  └──────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Supabase Self-Hosted (en Easypanel)            │   │
│  │  https://estudio56supabase.brifyai.com          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         ↓
    APIs Externas
    ├─ Vertex AI (Google)
    ├─ FAL AI
    ├─ MercadoPago
    └─ Cloudflare Worker (Videos)
```

## PASOS PARA DEPLOY EN EASYPANEL

### PASO 1: Actualizar Easypanel
1. Ve a tu proyecto en Easypanel
2. En **Deploy**, selecciona:
   - Build Method: **Dockerfile** ✓
   - File: **Dockerfile** ✓
3. Haz clic en **"Save"**
4. Espera a que termine el build (10-15 minutos)

### PASO 2: Verificar que Funciona
Una vez que el build termine:
1. Accede a tu dominio de Easypanel
2. Verifica que:
   - La app carga correctamente
   - El logo tiene texto blanco ✓
   - Los botones funcionan
   - Puedes hacer login con Supabase

### PASO 3: Probar Análisis de URLs
1. Abre tu app en Easypanel
2. Ve a modo **"Canva"**
3. Pega una URL (ej: https://www.instagram.com/tuempresa)
4. Haz clic en **"Analizar"**
5. Debe funcionar sin errores

### PASO 4: Probar Pagos
1. Ve a la sección de planes
2. Intenta crear un pago
3. Debe redirigir a MercadoPago

## VARIABLES DE ENTORNO

### En Dockerfile (Build Time)
```
VITE_GEMINI_API_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY
REACT_APP_USE_VIDEO_WORKER
REACT_APP_VIDEO_WORKER_URL
VITE_GOOGLE_VERTEX_PROJECT
VITE_GOOGLE_VERTEX_LOCATION
FAL_AI_API_KEY
MERCADOPAGO_PUBLIC_KEY
```

### En Dockerfile (Runtime)
```
NODE_ENV=production
PORT=3000
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_GOOGLE_VERTEX_PROJECT
VITE_GOOGLE_VERTEX_LOCATION
FAL_AI_API_KEY
MERCADOPAGO_ACCESS_TOKEN
SUPABASE_SERVICE_ROLE_KEY
```

## RUTAS DE API

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/analyze-url` | POST | Analizar URL con Vertex AI |
| `/api/generate-image` | POST | Generar imagen con FAL AI |
| `/api/create-payment` | POST | Crear pago con MercadoPago |
| `/api/check-video-status` | POST | Verificar estado de video |
| `/api/mercadopago-webhook` | POST | Webhook de MercadoPago |
| `/api/health` | GET | Health check |

## TROUBLESHOOTING

### Error: "Cannot find module 'express'"
**Solución**: Ejecutar `npm install` en Easypanel o esperar a que el build termine

### Error: "VITE_SUPABASE_URL is not defined"
**Solución**: Las variables están en el Dockerfile, esperar a que el build termine

### Error: "Cannot POST /api/analyze-url"
**Solución**: Verificar que el servidor Express esté corriendo (revisar logs en Easypanel)

### App no carga
**Solución**:
1. Revisar logs en Easypanel
2. Verificar que el build terminó exitosamente
3. Verificar que el puerto 3000 está disponible

## PRÓXIMOS PASOS

1. ✅ Actualizar Easypanel con nuevo Dockerfile
2. ✅ Esperar a que termine el build
3. ✅ Verificar que la app funciona
4. ✅ Probar análisis de URLs
5. ✅ Probar pagos
6. ✅ Probar generación de imágenes
7. ✅ Probar generación de videos

## NOTAS IMPORTANTES

- **No hay más Netlify Functions** - Todo está en Express
- **No hay más CORS issues** - Express maneja CORS automáticamente
- **Todo en un solo servidor** - Frontend + Backend + Supabase en Easypanel
- **Escalabilidad** - Puedes agregar más rutas fácilmente
- **Logs** - Todos los logs están en la consola de Easypanel

## CAMBIOS EN EL CÓDIGO

### Antes (Netlify)
```javascript
const response = await fetch('/.netlify/functions/analyze-brand-url-vertex', {
  method: 'POST',
  body: JSON.stringify({ url })
});
```

### Después (Express)
```javascript
const response = await fetch('/api/analyze-url', {
  method: 'POST',
  body: JSON.stringify({ url })
});
```

## VENTAJAS DE ESTA MIGRACIÓN

✅ **Costo**: Menos servicios = menos costos
✅ **Velocidad**: No hay latencia entre frontend y backend
✅ **Control**: Todo en tu servidor
✅ **Escalabilidad**: Fácil agregar nuevas rutas
✅ **Mantenimiento**: Un solo lugar para actualizar
✅ **Debugging**: Logs centralizados en Easypanel
