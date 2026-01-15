# Fix Easypanel - Código Viejo - 15 Enero 2026

## 🚨 PROBLEMA CONFIRMADO

El deploy que hiciste usó un **Dockerfile VIEJO** que:
- ❌ Solo tiene Nginx (sin Node.js)
- ❌ No tiene servidor Express
- ❌ No tiene rutas API

**Easypanel está usando código cacheado viejo**, NO el código actualizado de GitHub.

## ✅ SOLUCIÓN: FORZAR REBUILD DESDE CERO

### Opción 1: Rebuild con --no-cache (RECOMENDADO)

Si Easypanel tiene opción de rebuild:

1. **Ir a Easypanel:**
   - URL: https://deploy.brifyai.com/
   - Proyecto: `supabaseestudio56`
   - Servicio: `estudio56v4`

2. **Buscar botón "Rebuild" o "Redeploy"**

3. **Buscar opción "--no-cache" o "Clear cache"**
   - Puede estar como checkbox
   - O como opción avanzada

4. **Hacer rebuild SIN cache**

### Opción 2: Subir ZIP Manualmente (MÁS SEGURO)

Esta opción garantiza que use el código nuevo:

1. **El ZIP ya está listo:**
   - Archivo: `estudio56-deploy.zip`
   - Contiene el Dockerfile correcto

2. **Ir a Easypanel:**
   - URL: https://deploy.brifyai.com/
   - Proyecto: `supabaseestudio56`
   - Servicio: `estudio56v4`

3. **Buscar opción de Upload:**
   - "Upload ZIP"
   - "Deploy from Archive"
   - "Manual Deploy"

4. **Subir el ZIP**
   - Seleccionar `estudio56-deploy.zip`
   - Click en "Deploy"

### Opción 3: Eliminar y Recrear Servicio

Si las opciones anteriores no funcionan:

1. **Eliminar el servicio actual:**
   - En Easypanel → Servicio → Settings
   - Buscar "Delete Service" o "Remove"
   - Confirmar eliminación

2. **Crear nuevo servicio:**
   - Click en "New Service"
   - Seleccionar "From GitHub" o "From ZIP"
   - Configurar desde cero

## 🔍 CÓMO VERIFICAR QUE FUNCIONÓ

Después del rebuild, los logs DEBEN mostrar:

```
✅ Servidor corriendo en puerto 3000
📍 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
2026/01/15 XX:XX:XX [notice] 1#1: nginx/1.29.4
```

**NO debe mostrar:**
```
FROM docker.io/library/nginx:alpine
```

## 📋 DIFERENCIAS ENTRE DOCKERFILES

### Dockerfile VIEJO (el que usó):
```dockerfile
FROM node:20-alpine as builder
# ... build ...
FROM nginx:alpine  # ❌ Solo Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
```

### Dockerfile NUEVO (el correcto):
```dockerfile
FROM node:20-alpine
RUN apk add --no-cache nginx  # ✅ Nginx + Node.js
# ... build ...
CMD ["/start.sh"]  # ✅ Inicia Node.js + Nginx
```

## ⚠️ POR QUÉ PASÓ ESTO

Easypanel tiene cache de:
1. **Código fuente** - Puede estar usando un commit viejo
2. **Capas de Docker** - Puede estar usando capas cacheadas
3. **Imagen final** - Puede estar usando la imagen vieja

**Solución:** Forzar rebuild completo sin cache.

## 🚀 PRÓXIMOS PASOS

1. **Intentar Opción 1** (rebuild con --no-cache)
2. **Si falla, usar Opción 2** (subir ZIP manualmente)
3. **Si falla, usar Opción 3** (eliminar y recrear)

## 📞 DESPUÉS DEL REBUILD

Dime:
1. ¿Qué opción usaste?
2. ¿Los logs muestran "Servidor corriendo en puerto 3000"?
3. ¿Funciona la API? → `curl https://www.estudio56.cl/api/health`
