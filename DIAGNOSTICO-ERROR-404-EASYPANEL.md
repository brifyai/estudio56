# Diagnóstico Error 405 Easypanel - 15 Enero 2026

## 🚨 PROBLEMA CONFIRMADO

### Síntomas
- Frontend funciona: `https://www.estudio56.cl/` carga correctamente
- API devuelve HTTP 405: Todas las rutas `/api/*` fallan
- Logs muestran solo Nginx corriendo
- Node.js NO está ejecutándose

### Análisis de Logs
```
2026/01/15 19:36:01 [notice] 1#1: nginx/1.29.4
2026/01/15 19:36:01 [notice] 1#1: start worker processes
```

**FALTA**: Mensaje "✅ Servidor corriendo en puerto 3000"

### Causa Raíz
Easypanel NO ha reconstruido con el nuevo Dockerfile (commits `8c79250` y `63bcdc5`)

Los logs son del deploy anterior (19:36:01) que NO incluye:
- Instalación de Nginx
- Configuración de proxy
- Script de inicio `/start.sh`
- Node.js en background

## ✅ SOLUCIÓN

### Opción 1: Rebuild Manual en Easypanel (RECOMENDADO)
1. Ir a Easypanel → Proyecto → Servicio
2. Click en "Rebuild"
3. Esperar a que termine el build
4. Verificar logs nuevos

### Opción 2: Commit Vacío Adicional
Si el rebuild manual no funciona, hacer otro commit vacío:

```bash
git commit --allow-empty -m "force rebuild 2"
git push origin main
```

## 🔍 VERIFICACIÓN POST-REBUILD

Una vez que Easypanel reconstruya, los logs DEBEN mostrar:

```
✅ Servidor corriendo en puerto 3000
📍 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
2026/01/15 XX:XX:XX [notice] 1#1: nginx/1.29.4
```

### Pruebas Funcionales
```bash
# Health check
curl https://www.estudio56.cl/api/health
# Debe retornar: {"status":"ok","timestamp":"..."}

# Frontend
curl https://www.estudio56.cl/
# Debe retornar HTML de la app
```

## 📋 ESTADO ACTUAL

- ✅ Código correcto en GitHub (commits pusheados)
- ✅ Dockerfile con Nginx + Node.js
- ✅ nginx.conf con proxy configurado
- ✅ server.js con Express en puerto 3000
- ❌ Easypanel NO ha reconstruido
- ❌ Deploy actual usa Dockerfile antiguo

## 🎯 PRÓXIMO PASO

**ACCIÓN INMEDIATA**: Hacer rebuild manual en Easypanel

1. Abrir Easypanel
2. Ir al servicio estudio56v4
3. Click en "Rebuild" o "Redeploy"
4. Esperar 5-10 minutos
5. Verificar logs nuevos
6. Probar `/api/health`

Si el rebuild manual no está disponible o no funciona, usar Opción 2 (commit vacío adicional).
