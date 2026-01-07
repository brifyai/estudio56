# 📋 INSTRUCCIONES: CONFIGURAR VARIABLE EN NETLIFY

**Tiempo estimado:** 5 minutos  
**Dificultad:** Fácil

---

## 🎯 OBJETIVO

Configurar la API Key de Alibaba Cloud como variable de entorno en Netlify para que las funciones de generación de video funcionen correctamente.

---

## 📝 PASO A PASO

### PASO 1: Acceder a Netlify

1. Abre tu navegador
2. Ve a: **https://app.netlify.com**
3. Inicia sesión con tu cuenta
4. Busca y selecciona el sitio: **estudio56**

---

### PASO 2: Ir a Variables de Entorno

1. En el menú lateral izquierdo, haz clic en **"Site settings"** (Configuración del sitio)
2. En el menú de configuración, busca la sección **"Environment variables"**
3. Haz clic en **"Environment variables"**

**URL directa:**
```
https://app.netlify.com/sites/estudio56/settings/env
```

---

### PASO 3: Agregar Nueva Variable

1. Haz clic en el botón **"Add a variable"** (Agregar una variable)
2. Se abrirá un formulario con los siguientes campos:

---

### PASO 4: Completar el Formulario

**Campo 1: Key (Clave)**
```
ALIBABA_API_KEY
```
⚠️ **Importante:** Escribe exactamente como se muestra (mayúsculas, sin espacios)

**Campo 2: Value (Valor)**
```
sk-d4d0dc3e27874fd5aeb00a4c741624f5
```
⚠️ **Importante:** Copia y pega exactamente como se muestra

**Campo 3: Scopes (Alcances)**
- ☑ Marca la casilla **"All deploys"** (Todos los despliegues)
- ☑ Marca la casilla **"All branches"** (Todas las ramas)

---

### PASO 5: Guardar Variable

1. Haz clic en el botón **"Create variable"** (Crear variable)
2. Verás un mensaje de confirmación
3. La variable aparecerá en la lista de variables de entorno

---

### PASO 6: Redesplegar el Sitio

**¿Por qué?** Las variables de entorno solo se aplican en nuevos despliegues.

1. En el menú lateral, haz clic en **"Deploys"** (Despliegues)
2. Haz clic en el botón **"Trigger deploy"** (Activar despliegue)
3. Selecciona **"Deploy site"** (Desplegar sitio)
4. Espera 2-3 minutos mientras se despliega

**URL directa:**
```
https://app.netlify.com/sites/estudio56/deploys
```

---

### PASO 7: Verificar Despliegue

1. Espera a que el estado cambie a **"Published"** (Publicado)
2. Verás un mensaje verde: **"Site is live"** (Sitio en vivo)
3. El sitio ahora tiene acceso a la variable `ALIBABA_API_KEY`

---

## ✅ VERIFICACIÓN

### Cómo saber si funcionó:

1. **Ir al sitio:** https://estudio56.netlify.app
2. **Intentar generar un video:**
   - Generar una imagen primero
   - Hacer clic en "Generar Video"
   - Esperar 1-5 minutos

3. **Resultado esperado:**
   - ✅ Video se genera correctamente
   - ✅ No hay error de "ALIBABA_API_KEY no configurada"

4. **Si hay error:**
   - Ver logs en: https://app.netlify.com/sites/estudio56/logs
   - Verificar que la variable esté configurada correctamente

---

## 🔍 VERIFICAR VARIABLE CONFIGURADA

Para confirmar que la variable está configurada:

1. Ve a: https://app.netlify.com/sites/estudio56/settings/env
2. Deberías ver en la lista:
   ```
   ALIBABA_API_KEY
   Value: sk-d4d0dc3e27874fd5aeb00a4c741624f5
   Scopes: All deploys, All branches
   ```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema 1: No veo el botón "Add a variable"
**Solución:** Verifica que tienes permisos de administrador en el sitio

### Problema 2: La variable no aparece después de crearla
**Solución:** Recarga la página (F5)

### Problema 3: El video no se genera después de configurar
**Solución:** 
1. Verifica que redespliegaste el sitio
2. Espera 2-3 minutos después del despliegue
3. Limpia caché del navegador (Ctrl+Shift+R)

### Problema 4: Error "InvalidApiKey"
**Solución:** 
1. Verifica que copiaste la API Key correctamente
2. No debe tener espacios al inicio o final
3. Debe empezar con "sk-"

---

## 📞 AYUDA ADICIONAL

Si después de seguir estos pasos aún tienes problemas:

1. **Ver logs de Netlify:**
   - https://app.netlify.com/sites/estudio56/logs
   - Buscar errores relacionados con "ALIBABA_API_KEY"

2. **Ver logs de funciones:**
   - https://app.netlify.com/sites/estudio56/functions
   - Buscar "generate-video" y "check-video-operation"

3. **Verificar en consola del navegador:**
   - Abrir DevTools (F12)
   - Ver errores en la pestaña "Console"

---

## 📊 RESUMEN VISUAL

```
┌─────────────────────────────────────────┐
│  1. Netlify Dashboard                   │
│     ↓                                   │
│  2. Site Settings                       │
│     ↓                                   │
│  3. Environment Variables               │
│     ↓                                   │
│  4. Add a variable                      │
│     ↓                                   │
│  5. Key: ALIBABA_API_KEY                │
│     Value: sk-d4d0dc3e27874fd5...       │
│     Scopes: ☑ All deploys, All branches│
│     ↓                                   │
│  6. Create variable                     │
│     ↓                                   │
│  7. Trigger deploy → Deploy site        │
│     ↓                                   │
│  8. Wait 2-3 minutes                    │
│     ↓                                   │
│  9. ✅ LISTO!                           │
└─────────────────────────────────────────┘
```

---

## ⏱️ TIEMPO TOTAL

- Configurar variable: **1 minuto**
- Redesplegar sitio: **2-3 minutos**
- **Total: ~5 minutos**

---

**¡Listo!** Una vez completados estos pasos, el sistema de generación de videos con Alibaba Cloud estará funcionando correctamente.
