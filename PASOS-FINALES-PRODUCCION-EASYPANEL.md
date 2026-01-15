# PASOS FINALES - MIGRACIÓN A EASYPANEL EN PRODUCCIÓN

## ESTADO ACTUAL
- ✅ Servidor Express configurado en `server.js`
- ✅ Todas las rutas de API migradas de Netlify
- ✅ Variables de entorno 100% configuradas
- ✅ Dockerfile actualizado con todas las variables
- ✅ Supabase URL actualizada a `https://supabase.estudio56.cl`
- ⏳ **PENDIENTE**: Actualizar DNS en Cloudflare
- ⏳ **PENDIENTE**: Configurar Google OAuth en Google Cloud Console

---

## PASO 1: ACTUALIZAR CLOUDFLARE DNS

Tu URL de Easypanel es: **`dsb9vm.easypanel.host`**

### En Cloudflare Dashboard:

1. Ve a tu dominio `estudio56.cl`
2. Haz clic en **DNS** en el menú lateral
3. Busca y edita estos registros:

#### CNAME 1: `estudio56.cl` (raíz)
- **Nombre**: `estudio56.cl` (o solo `@`)
- **Tipo**: CNAME
- **Valor ACTUAL**: `estudio56.netlify.app`
- **Valor NUEVO**: `dsb9vm.easypanel.host`
- **Proxy**: Solo DNS (naranja)
- Haz clic en **Save**

#### CNAME 2: `www`
- **Nombre**: `www`
- **Tipo**: CNAME
- **Valor ACTUAL**: `estudio56.netlify.app`
- **Valor NUEVO**: `dsb9vm.easypanel.host`
- **Proxy**: Solo DNS (naranja)
- Haz clic en **Save**

#### A Record: `supabase` (MANTENER IGUAL)
- **Nombre**: `supabase`
- **Tipo**: A
- **Valor**: `184.174.36.17`
- **Proxy**: Solo DNS (naranja)
- ✅ NO CAMBIAR

### Resultado esperado en Cloudflare:
```
estudio56.cl    CNAME    dsb9vm.easypanel.host    Solo DNS
www             CNAME    dsb9vm.easypanel.host    Solo DNS
supabase        A        184.174.36.17            Solo DNS
```

**⏱️ Espera 5-10 minutos** para que los cambios se propaguen.

---

## PASO 2: CONFIGURAR GOOGLE OAUTH 2.0

### En Google Cloud Console:

1. Ve a: https://console.cloud.google.com
2. Selecciona proyecto: **`stratega-ai-x`**
3. Ve a: **APIs & Services** → **Credentials**
4. Busca y haz clic en tu cliente OAuth 2.0 (debería ser "estudio56" o similar)

### Actualiza estos campos:

#### **Orígenes autorizados de JavaScript**
Reemplaza TODO con:
```
https://www.estudio56.cl
https://estudio56.cl
https://supabase.estudio56.cl
```

#### **URIs de redireccionamiento autorizados**
Reemplaza TODO con:
```
https://supabase.estudio56.cl/auth/v1/callback
https://www.estudio56.cl/auth/v1/callback
https://estudio56.cl/auth/v1/callback
```

5. Haz clic en **Save** o **Update**

### Verificación:
Después de guardar, verifica que aparezcan exactamente estos valores:

**Orígenes autorizados:**
- ✅ https://www.estudio56.cl
- ✅ https://estudio56.cl
- ✅ https://supabase.estudio56.cl

**URIs de redireccionamiento:**
- ✅ https://supabase.estudio56.cl/auth/v1/callback
- ✅ https://www.estudio56.cl/auth/v1/callback
- ✅ https://estudio56.cl/auth/v1/callback

---

## PASO 3: DEPLOY EN EASYPANEL

Una vez que hayas completado los pasos 1 y 2:

1. Ve a tu panel de Easypanel
2. Selecciona tu proyecto
3. Haz clic en **Deploy** o **Rebuild**
4. Espera a que termine el build (5-10 minutos)

### Verificar que funciona:
- Abre https://www.estudio56.cl en tu navegador
- Verifica que carga correctamente
- Prueba el login con Google
- Verifica que las APIs funcionan

---

## CHECKLIST FINAL

- [ ] Actualicé CNAME `estudio56.cl` en Cloudflare a `dsb9vm.easypanel.host`
- [ ] Actualicé CNAME `www` en Cloudflare a `dsb9vm.easypanel.host`
- [ ] Verifiqué que `supabase` A record sigue siendo `184.174.36.17`
- [ ] Esperé 5-10 minutos para propagación de DNS
- [ ] Actualicé Google OAuth con los 3 orígenes autorizados
- [ ] Actualicé Google OAuth con los 3 URIs de redireccionamiento
- [ ] Hice deploy en Easypanel
- [ ] Probé que https://www.estudio56.cl carga correctamente
- [ ] Probé login con Google
- [ ] Probé que las APIs funcionan

---

## NOTAS IMPORTANTES

- **No uses localhost** - Solo dominios de producción
- **Espera 5-10 minutos** - Los cambios de DNS pueden tardar en propagarse
- **Limpia cache** - Si tienes problemas, limpia cache del navegador (Ctrl+Shift+Delete)
- **Verifica HTTPS** - Todos los dominios deben ser HTTPS
- **Si algo falla**: Revisa los logs en Easypanel → Logs
- **Google OAuth tarda** - Los cambios en Google pueden tardar 5-15 minutos en propagarse

---

## PRÓXIMOS PASOS DESPUÉS DE DEPLOY

1. Monitorear logs en Easypanel
2. Probar todas las funcionalidades:
   - Login con Google
   - Generación de imágenes (FAL AI)
   - Análisis de URLs (Vertex AI)
   - Generación de videos
   - Pagos con MercadoPago
3. Si hay errores, revisar logs y ajustar variables de entorno

