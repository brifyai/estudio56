# ESTADO DEPLOY EASYPANEL - 15 ENERO 2026

## CAMBIOS REALIZADOS

### 1. Dockerfile Ultra-Simple
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production
COPY . .
RUN npm run build
RUN ls -la /app/dist || echo "WARNING: dist folder not found"
EXPOSE 80
CMD ["node", "server.js"]
```

**CAMBIOS CLAVE**:
- ❌ Eliminado Nginx completamente
- ✅ Node.js escucha directamente en puerto 80
- ✅ Solo dependencias de producción
- ✅ Verificación de carpeta `dist/`

### 2. server.js
```javascript
const PORT = process.env.PORT || 80;
```

**CAMBIO**: Puerto por defecto cambiado de 3000 a 80

---

## VERIFICAR EN EASYPANEL

### 1. Configuración de Dominio
- **Proxy Port**: DEBE ser `80` (no 3000)
- Ruta: `Settings → Domains → [tu dominio] → Proxy Port`

### 2. Variables de Entorno
Verificar que estas variables estén configuradas:
```
PORT=80
NODE_ENV=production
VITE_SUPABASE_URL=https://supabase.estudio56.cl
SUPABASE_SERVICE_ROLE_KEY=[tu key]
MERCADOPAGO_ACCESS_TOKEN=[tu token]
VITE_GOOGLE_VERTEX_PROJECT=stratega-ai-x
VITE_GOOGLE_VERTEX_LOCATION=us-central1
```

### 3. Rebuild
1. Ir a `Deployments`
2. Click en `Rebuild` (botón azul)
3. Esperar a que el build termine (✅ verde)
4. Verificar que el contenedor esté corriendo (status: Running)

### 4. Verificar Logs (si aparecen)
Buscar estos mensajes:
```
🚀 Iniciando servidor...
✅ Ruta /api/analyze-url cargada
✅ Ruta /api/generate-image cargada
✅ Servidor corriendo en puerto 80
```

---

## DIAGNÓSTICO SI SIGUE FALLANDO

### Error 503 = Node.js crashea al iniciar

**POSIBLES CAUSAS**:

1. **Carpeta dist/ no existe**
   - Solución: Verificar en build logs que `npm run build` termine exitosamente
   - Buscar: "RUN npm run build" en logs

2. **Dependencias faltantes**
   - Solución: Verificar que `google-auth-library` y `@supabase/supabase-js` estén en `dependencies` (no en `devDependencies`)
   - Ya verificado ✅

3. **Error al importar rutas**
   - Solución: Crear versión mínima de `server.js` sin rutas (solo health check)

4. **Puerto 80 bloqueado**
   - Solución: Cambiar a puerto 8080 en Dockerfile y server.js

---

## PRÓXIMOS PASOS SI FALLA

### Opción A: Server.js Mínimo (sin rutas) ✅ CREADO
**Archivo**: `server-minimal.js`

Para usar esta versión:
1. Cambiar Dockerfile: `CMD ["node", "server-minimal.js"]`
2. Commit y push
3. Rebuild en Easypanel

Esta versión:
- ✅ NO carga rutas de API (evita errores de importación)
- ✅ Solo sirve frontend estático
- ✅ Health check en `/api/health`
- ✅ Logs detallados con prefijo [MINIMAL]

**IMPORTANTE**: Con esta versión el frontend cargará pero las funciones de backend NO funcionarán (análisis de URL, pagos, etc). Es solo para DIAGNÓSTICO.

### Opción B: Cambiar a Puerto 8080
Si puerto 80 está bloqueado:
- Dockerfile: `EXPOSE 8080`
- server.js: `const PORT = 80;` → `const PORT = 8080;`
- Easypanel: Proxy Port = 8080

### Opción C: Usar Docker Compose
Si Easypanel soporta docker-compose.yml, crear configuración con healthcheck.

---

## COMMIT ACTUAL
```
commit 185a347
fix: Dockerfile ultra-simple sin Nginx, Node.js en puerto 80
```

**PUSHEADO A**: `main` branch en GitHub
**ESPERANDO**: Rebuild automático en Easypanel
