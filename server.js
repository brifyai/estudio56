import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

console.log('🚀 Iniciando servidor...');
console.log('📂 __dirname:', __dirname);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos del frontend
const distPath = path.join(__dirname, 'dist');
console.log('📁 Sirviendo archivos estáticos desde:', distPath);
app.use(express.static(distPath));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    port: PORT
  });
});

// Cargar rutas de API dinámicamente con manejo de errores
async function loadRoutes() {
  try {
    const { default: analyzeUrlRouter } = await import('./server/routes/analyze-url.js');
    app.use('/api/analyze-url', analyzeUrlRouter);
    console.log('✅ Ruta /api/analyze-url cargada');
  } catch (error) {
    console.warn('⚠️  No se pudo cargar analyze-url:', error.message);
  }

  try {
    const { default: generateImageRouter } = await import('./server/routes/generate-image.js');
    app.use('/api/generate-image', generateImageRouter);
    console.log('✅ Ruta /api/generate-image cargada');
  } catch (error) {
    console.warn('⚠️  No se pudo cargar generate-image:', error.message);
  }

  try {
    const { default: createPaymentRouter } = await import('./server/routes/create-payment.js');
    app.use('/api/create-payment', createPaymentRouter);
    console.log('✅ Ruta /api/create-payment cargada');
  } catch (error) {
    console.warn('⚠️  No se pudo cargar create-payment:', error.message);
  }

  try {
    const { default: checkVideoStatusRouter } = await import('./server/routes/check-video-status.js');
    app.use('/api/check-video-status', checkVideoStatusRouter);
    console.log('✅ Ruta /api/check-video-status cargada');
  } catch (error) {
    console.warn('⚠️  No se pudo cargar check-video-status:', error.message);
  }

  try {
    const { default: mercadopagoWebhookRouter } = await import('./server/routes/mercadopago-webhook.js');
    app.use('/api/mercadopago-webhook', mercadopagoWebhookRouter);
    console.log('✅ Ruta /api/mercadopago-webhook cargada');
  } catch (error) {
    console.warn('⚠️  No se pudo cargar mercadopago-webhook:', error.message);
  }
}

// SPA fallback - servir index.html para todas las rutas no encontradas
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Error sirviendo index.html:', err);
      res.status(500).send('Error al cargar la aplicación');
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
async function startServer() {
  try {
    await loadRoutes();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('✅ Servidor corriendo en puerto', PORT);
      console.log('📍 Frontend: http://localhost:' + PORT);
      console.log('🔌 API: http://localhost:' + PORT + '/api');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
