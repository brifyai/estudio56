import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

// Crear .env desde variables de entorno de Easypanel
const envContent = `
NODE_ENV=${process.env.NODE_ENV || 'production'}
PORT=${process.env.PORT || '3000'}
VITE_GEMINI_API_KEY=${process.env.VITE_GEMINI_API_KEY || ''}
VITE_SUPABASE_URL=${process.env.VITE_SUPABASE_URL || ''}
VITE_SUPABASE_ANON_KEY=${process.env.VITE_SUPABASE_ANON_KEY || ''}
REACT_APP_SUPABASE_URL=${process.env.REACT_APP_SUPABASE_URL || ''}
REACT_APP_USE_VIDEO_WORKER=${process.env.REACT_APP_USE_VIDEO_WORKER || ''}
REACT_APP_VIDEO_WORKER_URL=${process.env.REACT_APP_VIDEO_WORKER_URL || ''}
VITE_GOOGLE_VERTEX_PROJECT=${process.env.VITE_GOOGLE_VERTEX_PROJECT || ''}
VITE_GOOGLE_VERTEX_LOCATION=${process.env.VITE_GOOGLE_VERTEX_LOCATION || ''}
FAL_AI_API_KEY=${process.env.FAL_AI_API_KEY || ''}
GEMINI_API_KEY=${process.env.GEMINI_API_KEY || ''}
GOOGLE_VERTEX_PROJECT=${process.env.GOOGLE_VERTEX_PROJECT || ''}
GOOGLE_VERTEX_LOCATION=${process.env.GOOGLE_VERTEX_LOCATION || ''}
MERCADOPAGO_ACCESS_TOKEN=${process.env.MERCADOPAGO_ACCESS_TOKEN || ''}
MERCADOPAGO_PUBLIC_KEY=${process.env.MERCADOPAGO_PUBLIC_KEY || ''}
SUPABASE_SERVICE_ROLE_KEY=${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}
SECRETS_SCAN_SMART_DETECTION_ENABLED=${process.env.SECRETS_SCAN_SMART_DETECTION_ENABLED || ''}
`.trim();

fs.writeFileSync('.env', envContent);

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Importar rutas de API
import analyzeUrlRouter from './server/routes/analyze-url.js';
import generateImageRouter from './server/routes/generate-image.js';
import createPaymentRouter from './server/routes/create-payment.js';
import checkVideoStatusRouter from './server/routes/check-video-status.js';
import mercadopagoWebhookRouter from './server/routes/mercadopago-webhook.js';

// Registrar rutas de API
app.use('/api/analyze-url', analyzeUrlRouter);
app.use('/api/generate-image', generateImageRouter);
app.use('/api/create-payment', createPaymentRouter);
app.use('/api/check-video-status', checkVideoStatusRouter);
app.use('/api/mercadopago-webhook', mercadopagoWebhookRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA fallback - servir index.html para todas las rutas no encontradas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});
