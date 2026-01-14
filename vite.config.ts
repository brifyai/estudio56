import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load from .env files (local dev) or process.env (Docker)
    const env = loadEnv(mode, '.', '');
    
    // Helper to get env var from either source
    const getEnv = (key: string) => env[key] || process.env[key] || '';
    
    return {
      server: {
        port: 3000,
        host: 'localhost',
        hmr: false, // DESACTIVAR completamente HMR para evitar errores WebSocket
        strictPort: true,
        // Headers requeridos para FFmpeg.wasm (SharedArrayBuffer)
        headers: {
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Embedder-Policy': 'require-corp',
        },
      },
      plugins: [react()],
      define: {
        // Legacy process.env variables
        'process.env.API_KEY': JSON.stringify(getEnv('GEMINI_API_KEY') || getEnv('VITE_GEMINI_API_KEY')),
        'process.env.GEMINI_API_KEY': JSON.stringify(getEnv('GEMINI_API_KEY') || getEnv('VITE_GEMINI_API_KEY')),
        
        // Supabase variables (CRITICAL for Docker build)
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(getEnv('VITE_SUPABASE_URL')),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(getEnv('VITE_SUPABASE_ANON_KEY')),
        
        // Cloudflare Worker variables
        'import.meta.env.REACT_APP_USE_VIDEO_WORKER': JSON.stringify(getEnv('REACT_APP_USE_VIDEO_WORKER')),
        'import.meta.env.REACT_APP_VIDEO_WORKER_URL': JSON.stringify(getEnv('REACT_APP_VIDEO_WORKER_URL')),
        
        // Fallback REACT_APP_ variables
        'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(getEnv('REACT_APP_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL')),
        'process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY': JSON.stringify(getEnv('REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY') || getEnv('VITE_SUPABASE_ANON_KEY'))
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Optimización para FFmpeg.wasm
      optimizeDeps: {
        exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
      },
    };
  });
