# CONFIGURACIÓN GOOGLE OAUTH 2.0 - PRODUCCIÓN

## RESUMEN DE DOMINIOS

Tu app está en producción con estos dominios:
- **Frontend**: https://www.estudio56.cl
- **Supabase**: https://supabase.estudio56.cl

## PASOS EN GOOGLE CLOUD CONSOLE

### 1. Ve a Google Cloud Console
- URL: https://console.cloud.google.com
- Proyecto: `stratega-ai-x`

### 2. Busca "OAuth 2.0 Client IDs"
- Ve a: **APIs & Services** → **Credentials**
- Busca tu cliente OAuth 2.0 (debería ser "estudio56" o similar)

### 3. Edita el Cliente OAuth

Haz clic en el cliente y actualiza:

#### **Orígenes autorizados de JavaScript**
Reemplaza todo con:
```
https://www.estudio56.cl
https://estudio56.cl
https://supabase.estudio56.cl
```

#### **URIs de redireccionamiento autorizados**
Reemplaza todo con:
```
https://supabase.estudio56.cl/auth/v1/callback
https://www.estudio56.cl/auth/v1/callback
https://estudio56.cl/auth/v1/callback
```

### 4. Guarda los cambios
Haz clic en **"Save"** o **"Update"**

## VERIFICACIÓN

Después de guardar, verifica que aparezcan exactamente estos valores:

**Orígenes autorizados:**
- ✅ https://www.estudio56.cl
- ✅ https://estudio56.cl
- ✅ https://supabase.estudio56.cl

**URIs de redireccionamiento:**
- ✅ https://supabase.estudio56.cl/auth/v1/callback
- ✅ https://www.estudio56.cl/auth/v1/callback
- ✅ https://estudio56.cl/auth/v1/callback

## PRÓXIMOS PASOS

1. ✅ Actualizar Google Cloud OAuth
2. ✅ Actualizar variables de entorno en Dockerfile
3. ✅ Deploy en Easypanel
4. ✅ Probar login en producción

## NOTAS IMPORTANTES

- **No uses localhost** - Solo dominios de producción
- **Espera 5-10 minutos** - Los cambios pueden tardar en propagarse
- **Limpia cache** - Si tienes problemas, limpia cache del navegador
- **Verifica HTTPS** - Todos los dominios deben ser HTTPS
