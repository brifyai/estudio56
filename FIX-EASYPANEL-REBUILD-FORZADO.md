# FIX: Rebuild Forzado en Easypanel

## PROBLEMA
El error `Missing Supabase environment variables` persiste porque Easypanel está sirviendo una imagen Docker vieja con el bundle JavaScript compilado SIN las variables de entorno.

## CAUSA RAÍZ
- El archivo `index-CMfW0ion.js` fue generado en un build anterior
- Easypanel tiene la imagen Docker en caché
- Hacer "Deploy" solo reinicia el contenedor, NO reconstruye la imagen

## SOLUCIÓN: REBUILD COMPLETO

### PASO 1: Ir a Easypanel
1. Abre tu proyecto en Easypanel
2. Ve a la sección del servicio "estudio56"

### PASO 2: Forzar Rebuild (NO Deploy)
**IMPORTANTE**: NO uses el botón "Deploy" normal

Busca una de estas opciones:
- Botón "Rebuild" o "Rebuild Image"
- Menú de 3 puntos → "Rebuild"
- Settings → "Force Rebuild"

Si no encuentras "Rebuild", intenta:
1. Ir a "Settings" del servicio
2. Buscar "Build Settings" o "Docker Settings"
3. Activar "No Cache" o "Force Rebuild"
4. Luego hacer Deploy

### PASO 3: Verificar el Build
En los logs del build deberías ver:
```
🔍 Verificando variables de entorno...
VITE_SUPABASE_URL=https://zskunemvffyqyxtfqyzm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
✅ Variables configuradas
```

Y al final:
```
✅ Build completado
```

### PASO 4: Verificar el Deploy
Después del rebuild:
1. Espera a que el contenedor esté "Running"
2. Abre www.estudio56.cl
3. Abre DevTools (F12) → Console
4. Haz hard refresh: `Cmd + Shift + R` (Mac) o `Ctrl + Shift + R` (Windows)

### PASO 5: Verificar que el Bundle Cambió
En DevTools → Network:
- El archivo JavaScript debería tener un hash DIFERENTE a `index-CMfW0ion.js`
- Ejemplo: `index-ABC123XY.js` (el hash cambia con cada build)

Si sigue siendo `index-CMfW0ion.js`, el rebuild NO funcionó.

## CAMBIOS REALIZADOS

### 1. Dockerfile (actualizado)
```dockerfile
# Force rebuild - timestamp: 2026-01-14-16:45:00
ENV VITE_GEMINI_API_KEY=AIzaSyCjYfdiXyAJHHhpNn2FnSiZSA-xn5oqeLU
ENV VITE_SUPABASE_URL=https://zskunemvffyqyxtfqyzm.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Verify environment variables before build
RUN echo "🔍 Verificando variables de entorno..." && \
    echo "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" && \
    echo "✅ Variables configuradas"

RUN npm run build
```

### 2. vite.config.ts (actualizado)
Ahora lee las variables de `process.env` (Docker) además de archivos `.env`:

```typescript
const getEnv = (key: string) => env[key] || process.env[key] || '';

define: {
  'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(getEnv('VITE_SUPABASE_URL')),
  'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(getEnv('VITE_SUPABASE_ANON_KEY')),
  // ... más variables
}
```

## ALTERNATIVA: Eliminar Imagen Manualmente

Si Easypanel no tiene opción de "Rebuild", puedes:

1. **Detener el servicio**
2. **Eliminar la imagen Docker**:
   - Busca "Images" o "Docker Images" en Easypanel
   - Encuentra `easypanel/estudio56/estudio56:latest`
   - Elimínala
3. **Hacer Deploy** (ahora SÍ reconstruirá desde cero)

## VERIFICACIÓN FINAL

Después del rebuild exitoso:

```bash
# En DevTools Console, ejecuta:
console.log(import.meta.env.VITE_SUPABASE_URL)
```

Debería mostrar: `https://zskunemvffyqyxtfqyzm.supabase.co`

Si muestra `undefined`, el rebuild NO funcionó.

## COMMIT
```
commit c48f4d6
Fix: Configurar variables de entorno en vite.config.ts para Docker build
```

## PRÓXIMOS PASOS

1. Hacer REBUILD (no Deploy) en Easypanel
2. Verificar logs del build
3. Hard refresh en navegador
4. Verificar que el error desapareció
5. Confirmar que el hash del archivo JS cambió
