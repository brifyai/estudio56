import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
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
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        // Cloudflare Worker variables
        'import.meta.env.REACT_APP_USE_VIDEO_WORKER': JSON.stringify(env.REACT_APP_USE_VIDEO_WORKER),
        'import.meta.env.REACT_APP_VIDEO_WORKER_URL': JSON.stringify(env.REACT_APP_VIDEO_WORKER_URL)
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
