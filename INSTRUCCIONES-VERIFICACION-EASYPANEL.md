# Instrucciones Verificación Easypanel - 15 Enero 2026

## 🎯 OBJETIVO

Verificar y corregir la configuración en Easypanel para que use el Dockerfile correcto.

## 📍 NAVEGACIÓN EN EASYPANEL

### 1. Acceder al Servicio

```
https://deploy.brifyai.com/
  └─ Projects
      └─ supabaseestudio56
          └─ estudio56v4 ← CLICK AQUÍ
```

### 2. Pestañas Disponibles

Una vez dentro del servicio, verás estas pestañas:

```
[Overview] [Build] [Environment] [Domains] [Mounts] [Ports] [Deploy] [Logs] [Console] [Settings]
```

---

## ✅ VERIFICACIÓN 1: Build Method

### Ubicación
```
Servicio → Pestaña [Build]
```

### Qué Verificar

Debe mostrar:
```
Builder: Dockerfile
Dockerfile Path: Dockerfile
Context: .
```

### Si Muestra Otra Cosa

Si dice:
- `Builder: Nixpacks` → CAMBIAR a Dockerfile
- `Builder: Buildpacks` → CAMBIAR a Dockerfile
- `Builder: Auto` → CAMBIAR a Dockerfile

### Cómo Cambiar

1. Click en dropdown "Builder"
2. Seleccionar "Dockerfile"
3. En "Dockerfile Path" escribir: `Dockerfile`
4. En "Context" escribir: `.`
5. Click "Save" o "Apply"

---

## ✅ VERIFICACIÓN 2: Variables de Entorno

### Ubicación
```
Servicio → Pestaña [Environment]
```

### Qué Verificar

Debe tener estas variables (mínimo):

```
CACHEBUST=2
NODE_ENV=production
PORT=3000
VITE_GEMINI_API_KEY=AIzaSyA40oZ6hUsB4PaZ1emgzDLez06P4ZNmJfw
VITE_SUPABASE_URL=https://supabase.estudio56.cl
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Si Falta CACHEBUST

1. Click "Add Variable" o "+"
2. Key: `CACHEBUST`
3. Value: `2`
4. Click "Save"

### Si CACHEBUST existe pero es 1

1. Click en la variable CACHEBUST
2. Cambiar valor a `2`
3. Click "Save"

---

## ✅ VERIFICACIÓN 3: Proxy Port

### Ubicación
```
Servicio → Pestaña [Domains]
```

### Qué Verificar

Debe mostrar:
```
Domains:
  - www.estudio56.cl
  - estudio56.cl

Proxy Port: 80
```

### Si Proxy Port es 3000

1. Click en "Proxy Port" o "Port"
2. Cambiar a `80`
3. Click "Save"

**IMPORTANTE:** El puerto debe ser 80, NO 3000. Nginx escucha en 80 y hace proxy interno a Node.js:3000.

---

## ✅ VERIFICACIÓN 4: Source

### Ubicación
```
Servicio → Pestaña [Overview] o [Source]
```

### Qué Verificar

Debe mostrar:
```
Source Type: Github
Repository: brifyai/estudio56
Branch: main
```

### Si Muestra Otra Cosa

Si dice:
- `Source Type: Docker Image` → Necesitas cambiar a Github
- `Repository: otro-repo` → Necesitas cambiar a brifyai/estudio56
- `Branch: master` → Cambiar a main

### Cómo Cambiar

Puede que necesites recrear el servicio si el source está mal configurado.

---

## 🚀 DESPUÉS DE VERIFICAR

### 1. Hacer Deploy

```
Click en botón [Deploy] (arriba a la derecha)
```

O:

```
Pestaña [Deploy] → Click "Deploy Now" o "Redeploy"
```

### 2. Monitorear Logs

```
Pestaña [Logs] → Ver output en tiempo real
```

Debe mostrar:
```
Building...
[builder] FROM node:20-alpine
[builder] WORKDIR /app
...
[builder] RUN npm run build
...
✅ Servidor corriendo en puerto 3000
📍 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
2026/01/15 XX:XX:XX [notice] 1#1: nginx/1.29.4
```

### 3. Verificar API

Abrir terminal y ejecutar:

```bash
curl https://www.estudio56.cl/api/health
```

Debe retornar:
```json
{"status":"ok","timestamp":"2026-01-15T..."}
```

---

## ❌ SI SIGUE SIN FUNCIONAR

### Opción A: Force Rebuild

1. Cambiar CACHEBUST a `3` (o siguiente número)
2. Click "Deploy" nuevamente
3. Esperar 5-10 minutos
4. Verificar logs

### Opción B: Eliminar y Recrear

Si después de 2-3 intentos sigue sin funcionar:

1. **Eliminar servicio:**
   ```
   Pestaña [Settings] → Scroll down → "Delete Service"
   ```

2. **Crear nuevo servicio:**
   ```
   Projects → supabaseestudio56 → "New Service"
   ```

3. **Configurar desde cero:**
   - Type: App
   - Source: Github
   - Repository: brifyai/estudio56
   - Branch: main
   - Builder: Dockerfile
   - Agregar variables de entorno
   - Configurar domains
   - Deploy

---

## 🔍 DIAGNÓSTICO DE LOGS

### Logs Correctos ✅

```
✅ Servidor corriendo en puerto 3000
📍 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
nginx/1.29.4
```

### Logs Incorrectos ❌

```
/docker-entrypoint.sh: Configuration complete
nginx/1.29.4
```

Si ves `/docker-entrypoint.sh`, significa que está usando el Dockerfile viejo (solo Nginx).

**Solución:** Verificar que Builder = Dockerfile y CACHEBUST actualizado.

---

## 📋 CHECKLIST COMPLETO

Antes de hacer deploy, verificar:

- [ ] Builder = Dockerfile (NO Nixpacks)
- [ ] Dockerfile Path = Dockerfile
- [ ] Context = .
- [ ] CACHEBUST = 2 (o mayor)
- [ ] NODE_ENV = production
- [ ] PORT = 3000
- [ ] Todas las variables de entorno configuradas (25 total)
- [ ] Proxy Port = 80
- [ ] Domains configurados (www.estudio56.cl, estudio56.cl)
- [ ] Source = Github, brifyai/estudio56, main

Después de deploy:

- [ ] Logs muestran "Servidor corriendo en puerto 3000"
- [ ] Logs muestran "nginx/1.29.4"
- [ ] NO aparece "/docker-entrypoint.sh"
- [ ] curl /api/health retorna {"status":"ok"}
- [ ] NO hay errores 405

---

## 🎯 RESUMEN

**Pasos críticos:**

1. **Build → Builder = Dockerfile**
2. **Environment → CACHEBUST = 2**
3. **Domains → Proxy Port = 80**
4. **Deploy**
5. **Verificar logs**

Si no funciona después de 2-3 intentos: **Eliminar y recrear servicio**.

---

## 📞 AYUDA ADICIONAL

Si después de seguir todos estos pasos sigue sin funcionar, el problema puede ser:

1. **Cache de Easypanel muy agresivo** → Solución: Eliminar y recrear
2. **Problema con conexión a GitHub** → Solución: Usar Docker Image manual
3. **Configuración de red/proxy** → Solución: Verificar en Settings del proyecto

**Plan B:** Construir imagen Docker localmente y subirla a Docker Hub.
