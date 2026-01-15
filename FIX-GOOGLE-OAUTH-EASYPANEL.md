# FIX GOOGLE OAUTH - EASYPANEL

## PROBLEMA IDENTIFICADO

Las URIs de Google OAuth están configuradas solo para:
- `http://localhost:3000`
- `https://estudio56.cl`
- `https://www.estudio56.cl`

**FALTA**: El dominio de Easypanel donde está desplegada la app.

---

## SOLUCIÓN

### 1. Identificar el Dominio de Easypanel

En Easypanel, ve a:
1. `Settings → Domains`
2. Copia el dominio principal (ejemplo: `estudio56v4.easypanel.host`)

### 2. Agregar URIs en Google Cloud Console

Ve a: https://console.cloud.google.com/apis/credentials

#### Orígenes autorizados de JavaScript
Agregar:
```
https://[TU-DOMINIO-EASYPANEL]
```

Ejemplo:
```
https://estudio56v4.easypanel.host
```

#### URIs de redireccionamiento autorizados
Agregar:
```
https://[TU-DOMINIO-EASYPANEL]/auth/v1/callback
```

Ejemplo:
```
https://estudio56v4.easypanel.host/auth/v1/callback
```

---

## CONFIGURACIÓN COMPLETA RECOMENDADA

### Orígenes autorizados de JavaScript
```
http://localhost:3000
https://estudio56.cl
https://www.estudio56.cl
https://[TU-DOMINIO-EASYPANEL]
```

### URIs de redireccionamiento autorizados
```
https://www.estudio56.cl/auth/v1/callback
https://estudio56.cl/auth/v1/callback
https://[TU-DOMINIO-EASYPANEL]/auth/v1/callback
```

---

## VERIFICACIÓN

Después de agregar las URIs:

1. Espera 5 minutos (propagación de Google)
2. Abre `https://[TU-DOMINIO-EASYPANEL]`
3. Intenta hacer login con Google
4. Debe funcionar sin errores

---

## NOTA IMPORTANTE

Si estás usando un dominio personalizado en Easypanel (como `app.estudio56.cl`), debes agregar ESE dominio, no el dominio por defecto de Easypanel.

**Dominio correcto = El que ves en la barra de direcciones del navegador**
