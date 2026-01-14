# FIX: Error "Missing Supabase environment variables" en Easypanel

## PROBLEMA
El sitio desplegado en Easypanel muestra el error:
```
index-CMfW0ion.js:1786 Uncaught Error: Missing Supabase environment variables
```

## CAUSA REAL
Vite no estaba leyendo las variables de entorno durante el build en Docker. El `vite.config.ts` usa `loadEnv()` que busca archivos `.env`, pero en Docker solo existían variables ENV que no se estaban capturando correctamente.

## SOLUCIÓN APLICADA

### Cambio en Dockerfile
Ahora el Dockerfile crea un archivo `.env` físico ANTES del build con todas las variables:

```dockerfile
# Create .env file with all variables for Vite build
RUN echo "VITE_GEMINI_API_KEY=..." > .env && \
    echo "VITE_SUPABASE_URL=..." >> .env && \
    echo "VITE_SUPABASE_ANON_KEY=..." >> .env && \
    ...
```

Esto asegura que Vite pueda leer las variables durante `npm run build`.

## PASOS PARA APLICAR

### 1. Rebuild en Easypanel
1. Ve a tu proyecto en Easypanel
2. Haz clic en "Rebuild" o "Deploy"
3. Espera a que termine el build
4. Verifica en los logs que aparezca:
   ```
   🔍 Verificando archivo .env...
   VITE_GEMINI_API_KEY=...
   VITE_SUPABASE_URL=...
   ✅ Variables configuradas en .env
   ```

### 2. Verificar el Sitio
1. Abre: `https://estudio56-estudio56.dsb9vm.easypanel.host`
2. Abre la consola del navegador (F12)
3. Verifica que NO aparezca el error de Supabase
4. El sitio debería cargar correctamente

## POR QUÉ FUNCIONA AHORA

**ANTES:**
- Variables en `ENV` de Docker
- `vite.config.ts` usa `loadEnv()` que busca archivos `.env`
- Las variables ENV no se capturaban correctamente
- El bundle JavaScript no tenía las variables

**AHORA:**
- Creamos archivo `.env` físico en Docker
- `loadEnv()` encuentra el archivo `.env`
- Las variables se inyectan correctamente en el bundle
- El código JavaScript tiene acceso a las variables

## ALTERNATIVA: Netlify
Si prefieres no usar Easypanel, Netlify ya está configurado en `www.estudio56.cl` y funciona perfectamente.

## ESTADO
- ✅ Dockerfile actualizado con creación de archivo .env
- ✅ supabaseService.ts con valores fallback
- ✅ nginx.conf configurado para SPA routing
- ⏳ Pendiente: Rebuild en Easypanel
