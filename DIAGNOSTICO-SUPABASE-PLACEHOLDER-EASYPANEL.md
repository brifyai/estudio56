# DIAGNÓSTICO: placeholder.supabase.co en Easypanel

## PROBLEMA

Al iniciar sesión con Google, aparece:
```
No se puede acceder a este sitio
placeholder.supabase.co
DNS_PROBE_FINISHED_NXDOMAIN
```

## CAUSA

Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` NO se están inyectando durante el build de Vite, entonces el código usa los valores fallback:

```typescript
// services/supabaseService.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
```

## VERIFICACIÓN

### 1. Verificar que las variables están en Easypanel

En Easypanel → Tu Proyecto → **Environment**, verifica que existan:

```
VITE_SUPABASE_URL=https://supabase.estudio56.cl
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
```

### 2. Verificar en Build Logs

Después del rebuild, busca en los logs:
```
RUN npm run build
```

Justo ANTES de esa línea, deberías ver las variables de entorno disponibles.

### 3. Verificar en el Navegador

1. Abre `https://www.estudio56.cl`
2. Abre DevTools (F12) → Console
3. Escribe:
```javascript
import.meta.env.VITE_SUPABASE_URL
```

**Resultado esperado**: `"https://supabase.estudio56.cl"`
**Resultado actual (problema)**: `undefined` o `"https://placeholder.supabase.co"`

---

## SOLUCIÓN 1: Rebuild Completo (RECOMENDADO)

### Paso 1: Limpiar Cache
En Easypanel:
1. Ve a tu proyecto
2. Click en **Settings**
3. Busca opción de "Clear Build Cache" o similar
4. Si no existe, continúa al Paso 2

### Paso 2: Rebuild Forzado
1. Ve a **Deployments**
2. Click en **Rebuild** (botón azul)
3. Espera 5-7 minutos (build completo)

### Paso 3: Verificar
1. Abre `https://www.estudio56.cl`
2. Abre DevTools → Console
3. Verifica: `import.meta.env.VITE_SUPABASE_URL`
4. Debe mostrar: `"https://supabase.estudio56.cl"`

---

## SOLUCIÓN 2: Agregar Variables en vite.config.ts

Si el rebuild no funciona, el problema es que Easypanel NO está exponiendo las variables al proceso de build.

### Modificar vite.config.ts

<function_calls>
<invoke name="readFile">
<parameter name="explanation">Leer vite.config.ts actual para ver cómo está configurado