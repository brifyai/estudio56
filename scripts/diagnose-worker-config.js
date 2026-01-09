/**
 * 🔍 Diagnóstico: Configuración del Worker
 * 
 * Este script verifica por qué la app no está usando el Worker
 */

console.log('🔍 DIAGNÓSTICO DE CONFIGURACIÓN DEL WORKER\n');
console.log('='.repeat(60));

// 1. Verificar variables de entorno
console.log('\n📋 VARIABLES DE ENTORNO:');
console.log('-'.repeat(60));
console.log('REACT_APP_USE_VIDEO_WORKER:', process.env.REACT_APP_USE_VIDEO_WORKER);
console.log('Tipo:', typeof process.env.REACT_APP_USE_VIDEO_WORKER);
console.log('Es "true"?:', process.env.REACT_APP_USE_VIDEO_WORKER === 'true');
console.log('');
console.log('REACT_APP_VIDEO_WORKER_URL:', process.env.REACT_APP_VIDEO_WORKER_URL);

// 2. Verificar qué servicio se usaría
console.log('\n🎯 DECISIÓN DE SERVICIO:');
console.log('-'.repeat(60));
const USE_WORKER = process.env.REACT_APP_USE_VIDEO_WORKER === 'true';
console.log('USE_WORKER:', USE_WORKER);
console.log('Servicio a usar:', USE_WORKER ? '✅ Cloudflare Worker' : '❌ Netlify Functions');

// 3. Verificar URL del Worker
console.log('\n🌐 URL DEL WORKER:');
console.log('-'.repeat(60));
const WORKER_URL = process.env.REACT_APP_VIDEO_WORKER_URL || 'https://estudio56-video-worker.brifyaimaster.workers.dev';
console.log('URL:', WORKER_URL);

// 4. Test de conectividad al Worker
console.log('\n🧪 TEST DE CONECTIVIDAD:');
console.log('-'.repeat(60));
console.log('Probando health check del Worker...');

fetch(`${WORKER_URL}/health`)
  .then(res => res.json())
  .then(data => {
    console.log('✅ Worker responde:', data);
    console.log('\n🎉 RESULTADO: Worker está operacional');
  })
  .catch(err => {
    console.error('❌ Worker NO responde:', err.message);
    console.log('\n⚠️ PROBLEMA: Worker no está accesible');
  })
  .finally(() => {
    console.log('\n' + '='.repeat(60));
    console.log('FIN DEL DIAGNÓSTICO');
  });
