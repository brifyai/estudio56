# 🚀 Configuración Completa - Estudio 56

## ✅ Estado Actual

La aplicación está ejecutándose en: **http://localhost:3000/**

### Configuraciones Completadas:
- ✅ Dependencias instaladas
- ✅ Variables de entorno configuradas
- ✅ Servicio de Supabase configurado
- ✅ Servicio de Gemini AI configurado
- ✅ Scripts de base de datos creados

## 🗄️ Configuración de Base de Datos (Supabase)

### Paso 1: Crear las Tablas
1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto: `zskunemvffyqyxtfqyzm`
3. Ve a **SQL Editor** en el menú lateral
4. Copia y pega el contenido del archivo `database/schema-simple.sql` (versión simplificada)
5. Ejecuta el SQL haciendo clic en **"Run"**

**Nota**: Si prefieres usar el esquema completo con políticas RLS, usa `database/schema.sql` en su lugar.

### Paso 2: Verificar las Tablas
Después de ejecutar el SQL, deberías ver estas tablas creadas:
- `user_plans` - Planes de suscripción
- `users` - Usuarios del sistema  
- `flyers` - Flyers generados

### Paso 3: Verificar Datos
Ejecuta esta consulta para verificar que los planes se insertaron correctamente:
```sql
SELECT * FROM user_plans;
```

Deberías ver 3 planes: GRATIS, BASICO, PROFESIONAL.

## 🔑 Credenciales Configuradas

### Gemini AI
- API Key: `AIzaSyCMXM-e632BNF3IwnKDX1qKXpj6qrpsYfM`
- Estado: ✅ Configurada

### Supabase
- URL: `https://zskunemvffyqyxtfqyzm.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5ODI0MjcsImV4cCI6MjA4MjU1ODQyN30.fnBdIUv--_UhIg_843aSAKEHSdVtRCcAKdLGawRGTaw`
- Estado: ✅ Configurada

## 🧪 Probar la Aplicación

1. **Abrir la aplicación**: http://localhost:3000/
2. **Probar generación de flyers**:
   - Escribe una descripción en español
   - Selecciona un estilo
   - Haz clic en "GENERAR ASSET"
3. **Verificar integración con Gemini**: La aplicación debería generar imágenes usando la API de Gemini

## 📁 Archivos Creados

### Configuración:
- `.env.local` - Variables de entorno para Vite
- `.env` - Variables de entorno para Node.js
- `src/vite-env.d.ts` - Tipos de TypeScript para Vite

### Servicios:
- `services/supabaseService.ts` - Cliente de Supabase
- `services/geminiService.ts` - Cliente de Gemini AI (actualizado)

### Base de Datos:
- `database/schema.sql` - Esquema completo de la base de datos
- `database/schema-simple.sql` - Esquema simplificado (recomendado)
- `scripts/setup-database.js` - Script de configuración
- `scripts/create-tables.js` - Script simplificado para crear tablas

## 🔧 Scripts Disponibles

```bash
# Configurar base de datos
node scripts/setup-database.js

# Crear tablas (método simplificado)
node scripts/create-tables.js

# Ejecutar aplicación
npm run dev
```

## 🎯 Próximos Pasos

1. **Crear las tablas en Supabase** (usando el SQL del archivo `database/schema.sql`)
2. **Probar la funcionalidad completa** de la aplicación
3. **Configurar autenticación** si es necesario
4. **Desplegar la aplicación** cuando esté lista

## 🆘 Solución de Problemas

### Error: "Could not find the table"
- **Causa**: Las tablas no existen en Supabase
- **Solución**: Ejecutar el SQL del archivo `database/schema.sql` en el SQL Editor de Supabase

### Error de conexión a Supabase
- **Verificar**: Que las credenciales en `.env.local` sean correctas
- **Verificar**: Que el proyecto de Supabase esté activo

### Error de Gemini AI
- **Verificar**: Que la API key sea válida
- **Verificar**: Que tengas créditos en tu cuenta de Google AI

## 📞 Soporte

Si encuentras problemas:
1. Revisa los logs en la terminal donde ejecutaste `npm run dev`
2. Verifica la consola del navegador (F12)
3. Confirma que las tablas estén creadas en Supabase
4. Verifica que las variables de entorno sean correctas