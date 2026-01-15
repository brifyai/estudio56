import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

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
