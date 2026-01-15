import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

console.log('🚀 [MINIMAL] Iniciando servidor...');
console.log('📂 [MINIMAL] __dirname:', __dirname);
console.log('🌍 [MINIMAL] NODE_ENV:', process.env.NODE_ENV);
console.log('🔌 [MINIMAL] PORT:', PORT);

// Middleware básico
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  console.log('✅ [MINIMAL] Health check OK');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    port: PORT,
    version: 'minimal'
  });
});

// Servir archivos estáticos
const distPath = path.join(__dirname, 'dist');
console.log('📁 [MINIMAL] Sirviendo archivos desde:', distPath);
app.use(express.static(distPath));

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  console.log('📄 [MINIMAL] Sirviendo index.html para:', req.path);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ [MINIMAL] Error sirviendo index.html:', err);
      res.status(500).send('Error al cargar la aplicación');
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ [MINIMAL] Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('✅ [MINIMAL] Servidor corriendo en puerto', PORT);
  console.log('📍 [MINIMAL] Frontend: http://localhost:' + PORT);
  console.log('🔌 [MINIMAL] API Health: http://localhost:' + PORT + '/api/health');
  console.log('⚠️  [MINIMAL] RUTAS DE API DESHABILITADAS - Solo frontend');
  console.log('');
});
