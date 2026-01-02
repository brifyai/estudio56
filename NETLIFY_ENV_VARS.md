# Variables de Entorno para Netlify

Para desplegar la aplicación en Netlify, debes configurar las siguientes variables de entorno en tu sitio de Netlify:

## Configuración en Netlify

Ve a: **Site Settings** → **Environment variables**

Agrega las siguientes variables:

## Supabase
| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://TU_PROYECTO.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `TU_ANON_KEY` |

## Google Gemini API
| Variable | Valor |
|----------|-------|
| `VITE_GEMINI_API_KEY` | `TU_GEMINI_API_KEY` |

## Compatibilidad con React Create App
| Variable | Valor |
|----------|-------|
| `REACT_APP_SUPABASE_URL` | `https://TU_PROYECTO.supabase.co` |
| `REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | `TU_ANON_KEY` |
| `GEMINI_API_KEY` | `TU_GEMINI_API_KEY` |

## Notas

1. **Orden de prioridad:** El código usa `import.meta.env.VITE_*` (Vite) primero, y si no existe, usa `process.env.REACT_APP_*` (compatibilidad con Create React App).

2. **Build command:** `npm run build`

3. **Publish directory:** `dist`

4. **Node version:** 18 o superior (configurar en Netlify)

5. **Importante:** Las claves reales están en el archivo `.env` local. NO expongas estas claves públicamente. Netlify las maneja de forma segura a través de las variables de entorno.