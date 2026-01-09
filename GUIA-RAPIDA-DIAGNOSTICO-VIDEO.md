# 🚀 Guía Rápida: Diagnóstico de Video Fal.ai

**Problema**: Videos no se generan, aparece imagen estática en su lugar

---

## ⚡ SOLUCIÓN RÁPIDA (5 minutos)

### Paso 1: Verificar API Key en Netlify

1. Ir a: https://app.netlify.com
2. Seleccionar: **estudio56.cl**
3. Ir a: **Site settings** → **Environment variables**
4. Buscar: **FAL_API_KEY**

**¿Existe la variable?**
- ❌ **NO** → Ir al Paso 2
- ✅ **SÍ** → Ir al Paso 3

---

### Paso 2: Configurar API Key (si no existe)

1. **Obtener API Key de Fal.ai**:
   - Ir a: https://fal.ai/dashboard
   - Crear cuenta o iniciar sesión
   - Ir a: **API Keys** (menú lateral)
   - Hacer clic en: **Create new key**
   - Copiar la key (formato: `fal_...`)

2. **Agregar en Netlify**:
   - En Netlify: **Site settings** → **Environment variables**
   - Hacer clic en: **Add a variable**
   - **Key**: `FAL_API_KEY`
   - **Value**: `fal_...` (pegar tu API key)
   - **Scopes**: ✅ Production, ✅ Deploy Previews
   - Hacer clic en: **Create variable**

3. **Hacer nuevo deploy**:
   - Ir a: **Deploys** (menú superior)
   - Hacer clic en: **Trigger deploy** → **Deploy site**
   - Esperar 2-3 minutos
   - ✅ **Probar nuevamente la generación de video**

---

### Paso 3: Ver Logs de Netlify (si la key existe)

1. En Netlify, ir a: **Functions** (menú lateral)
2. Buscar: **generate-video**
3. Ver los logs más recientes
4. Buscar mensajes que empiecen con:
   - `🎬 [Fal.ai Video]`
   - `❌ [Fal.ai Video]`

**Errores comunes**:

| Error en Logs | Causa | Solución |
|---------------|-------|----------|
| `API Key de Fal.ai inválida` | Key incorrecta | Obtener nueva key y actualizar |
| `Límite de cuota excedido` | Sin créditos en Fal.ai | Verificar plan en fal.ai/dashboard |
| `Timeout: Fal.ai tardó más de 120 segundos` | Conexión lenta | Reintentar, problema temporal |
| `El contenido fue rechazado por filtros` | Prompt sensible | Usar descripción más simple |

---

## 🔍 DIAGNÓSTICO AVANZADO

### Opción A: Script de Diagnóstico Automático

```bash
# Ejecutar en terminal local (requiere FAL_API_KEY configurada localmente)
FAL_API_KEY="tu_key_aqui" node scripts/test-fal-ai-config.js
```

Este script verifica:
- ✅ Variable de entorno configurada
- ✅ Formato de API Key correcto
- ✅ Conectividad con Fal.ai
- ✅ Validez de la API Key

### Opción B: Verificar en Consola del Navegador

1. Abrir la aplicación: https://www.estudio56.cl
2. Abrir consola del navegador: **F12** o **Cmd+Option+I** (Mac)
3. Ir a la pestaña: **Console**
4. Intentar generar un video
5. Buscar mensajes de error:
   ```
   ❌ Error generando video: [mensaje]
   ⚠️ Fallback: Generando imagen estática
   ```
6. Copiar el mensaje completo de error

---

## 📊 VERIFICACIÓN FINAL

Después de configurar la API Key, verificar que:

1. ✅ Variable `FAL_API_KEY` existe en Netlify
2. ✅ Variable tiene un valor (no está vacía)
3. ✅ Variable está habilitada para Production y Deploy Previews
4. ✅ Se hizo un nuevo deploy después de agregar la variable
5. ✅ El deploy se completó exitosamente (sin errores)

**Probar generación de video**:
1. Ir a la aplicación
2. Seleccionar: **Tipo de medio** → **Video**
3. Ingresar una descripción simple: "Un cielo azul con nubes"
4. Hacer clic en: **Generar Borrador**
5. Esperar 1-3 minutos
6. ✅ Debería generarse un video (no una imagen)

---

## 🆘 SI EL PROBLEMA PERSISTE

Compartir la siguiente información:

1. **Logs de Netlify Functions** (generate-video)
   - Últimas 5-10 líneas de logs
   - Especialmente mensajes con `❌`

2. **Error de consola del navegador**
   - Mensaje completo que dice `❌ Error generando video:`

3. **Confirmación de configuración**
   - ✅ FAL_API_KEY existe en Netlify
   - ✅ Se hizo un nuevo deploy
   - ✅ Deploy se completó sin errores

---

## 📚 DOCUMENTOS RELACIONADOS

- **Diagnóstico completo**: `DIAGNOSTICO-VIDEO-FAL-AI-9-ENERO.md`
- **Análisis de implementación**: `ANALISIS-GENERACION-VIDEO-FAL-AI.md`
- **Migración a Fal.ai**: `MIGRACION-FAL-AI-PIKA-V2-TURBO.md`
- **Código de generación**: `netlify/functions/generate-video.ts`

---

**Última actualización**: 9 de Enero 2026
