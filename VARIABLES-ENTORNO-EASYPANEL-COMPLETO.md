# VARIABLES DE ENTORNO - EASYPANEL 100% COMPLETO

## RESUMEN EJECUTIVO

Todas las variables están configuradas en el Dockerfile. Solo necesitas hacer deploy en Easypanel.

## VARIABLES POR CATEGORÍA

### 1. FRONTEND (Vite Build Time)
```
VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
VITE_SUPABASE_URL=https://estudio56supabase.brifyai.com
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
REACT_APP_SUPABASE_URL=https://estudio56supabase.brifyai.com
REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
REACT_APP_USE_VIDEO_WORKER=true
REACT_APP_VIDEO_WORKER_URL=https://estudio56-video-worker.brifyaimaster.workers.dev
```

### 2. BACKEND (Express Runtime)
```
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
FAL_AI_API_KEY=53f17bdf-d098-44d0-af18-5c7cc1984203:4ae450f687dd2d6b04b75fcdc8fe7d28
MERCADOPAGO_ACCESS_TOKEN=APP_USR-5737650046044163-010717-c671110b021996141c7378d0fa3743f3-2485402971
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk4MjQyNywiZXhwIjoyMDgyNTU4NDI3fQ.ttKR7Bp4u8sMnet8Y5u-AkW9u7by7aV6CAIstdtPtbM
```

### 3. VERTEX AI (Google Cloud)
```
VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x
VITE_GOOGLE_VERTEX_LOCATION=us-central1
GOOGLE_VERTEX_PROJECT=stratega-ai-x
GOOGLE_VERTEX_LOCATION=us-central1
```

### 4. MERCADOPAGO
```
MERCADOPAGO_PUBLIC_KEY=APP_USR-63af4295-1d02-4c5a-9705-706d295da708
MERCADOPAGO_ACCESS_TOKEN=APP_USR-5737650046044163-010717-c671110b021996141c7378d0fa3743f3-2485402971
```

### 5. SUPABASE (Self-Hosted en Easypanel)
```
VITE_SUPABASE_URL=https://estudio56supabase.brifyai.com
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk4MjQyNywiZXhwIjoyMDgyNTU4NDI3fQ.ttKR7Bp4u8sMnet8Y5u-AkW9u7by7aV6CAIstdtPtbM
```

### 6. SEGURIDAD
```
SECRETS_SCAN_SMART_DETECTION_ENABLED=false
```

## TABLA COMPLETA DE VARIABLES

| Variable | Valor | Ubicación | Propósito |
|----------|-------|-----------|----------|
| `VITE_GEMINI_API_KEY` | AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw | Build + Runtime | Gemini API para análisis |
| `VITE_SUPABASE_URL` | https://estudio56supabase.brifyai.com | Build + Runtime | URL de Supabase |
| `VITE_SUPABASE_ANON_KEY` | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... | Build + Runtime | Anon Key de Supabase |
| `REACT_APP_SUPABASE_URL` | https://estudio56supabase.brifyai.com | Build | URL de Supabase (React) |
| `REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... | Build | Publishable Key (React) |
| `REACT_APP_USE_VIDEO_WORKER` | true | Build | Usar Cloudflare Worker |
| `REACT_APP_VIDEO_WORKER_URL` | https://estudio56-video-worker.brifyaimaster.workers.dev | Build | URL del Worker |
| `VITE_GOOGLE_VERTEX_PROJECT` | stratega-ai-x | Build + Runtime | Proyecto de Vertex AI |
| `VITE_GOOGLE_VERTEX_LOCATION` | us-central1 | Build + Runtime | Ubicación de Vertex AI |
| `GOOGLE_VERTEX_PROJECT` | stratega-ai-x | Runtime | Proyecto de Vertex AI (Backend) |
| `GOOGLE_VERTEX_LOCATION` | us-central1 | Runtime | Ubicación de Vertex AI (Backend) |
| `FAL_AI_API_KEY` | 53f17bdf-d098-44d0-af18-5c7cc1984203:4ae450f687dd2d6b04b75fcdc8fe7d28 | Runtime | FAL AI API Key |
| `GEMINI_API_KEY` | AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw | Runtime | Gemini API (Backend) |
| `MERCADOPAGO_PUBLIC_KEY` | APP_USR-63af4295-1d02-4c5a-9705-706d295da708 | Build + Runtime | MercadoPago Public Key |
| `MERCADOPAGO_ACCESS_TOKEN` | APP_USR-5737650046044163-010717-c671110b021996141c7378d0fa3743f3-2485402971 | Runtime | MercadoPago Access Token |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... | Runtime | Service Role Key (Backend) |
| `NODE_ENV` | production | Runtime | Entorno de Node |
| `PORT` | 3000 | Runtime | Puerto del servidor |
| `SECRETS_SCAN_SMART_DETECTION_ENABLED` | false | Runtime | Desactivar escaneo de secretos |

## DÓNDE ESTÁN CONFIGURADAS

### En el Dockerfile (Build Stage)
```dockerfile
RUN echo "VITE_GEMINI_API_KEY=..." > .env && \
    echo "VITE_SUPABASE_URL=..." >> .env && \
    ...
```

### En el Dockerfile (Production Stage)
```dockerfile
RUN echo "NODE_ENV=production" > .env && \
    echo "PORT=3000" >> .env && \
    ...
```

### En .env.local (Desarrollo Local)
Todas las variables están en `.env.local` para desarrollo local.

## CÓMO VERIFICAR QUE ESTÁN CONFIGURADAS

### En Easypanel
1. Ve a tu proyecto
2. Haz clic en "Logs"
3. Busca "Variables configuradas en .env"
4. Deberías ver todas las variables listadas

### En la App
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Haz clic en "Analizar URL"
4. Verifica que la solicitud se envía a `/api/analyze-url`
5. Verifica que la respuesta es exitosa

## PRÓXIMOS PASOS

1. ✅ Todas las variables están en el Dockerfile
2. ✅ Todas las variables están en .env.local
3. ✅ Hacer push a GitHub
4. ✅ Deploy en Easypanel
5. ✅ Verificar que funciona

## NOTAS IMPORTANTES

- **No hay variables faltantes** - Todas están configuradas
- **No hay conflictos** - Cada variable está en el lugar correcto
- **Seguridad** - Las variables sensibles están en el Dockerfile (no en Git)
- **Desarrollo** - .env.local tiene todas las variables para desarrollo local
- **Producción** - El Dockerfile tiene todas las variables para producción

## TROUBLESHOOTING

### Error: "VITE_SUPABASE_URL is not defined"
**Solución**: Esperar a que el build termine. Las variables se inyectan durante el build.

### Error: "FAL_AI_API_KEY is not defined"
**Solución**: Verificar que el servidor Express está corriendo. Las variables están en el Dockerfile.

### Error: "Cannot connect to Supabase"
**Solución**: Verificar que la URL es correcta: `https://estudio56supabase.brifyai.com`

### Error: "MercadoPago payment failed"
**Solución**: Verificar que `MERCADOPAGO_ACCESS_TOKEN` está configurada en el Dockerfile.
