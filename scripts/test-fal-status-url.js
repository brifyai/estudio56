/**
 * 🧪 Test: Ver qué statusUrl devuelve fal.ai
 */

const WORKER_URL = 'https://estudio56-video-worker.brifyaimaster.workers.dev';

console.log('🧪 TESTING FAL.AI STATUS URL\n');
console.log('='.repeat(60));

// Generar video y ver qué statusUrl devuelve
fetch(`${WORKER_URL}/generate-draft`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'A dog running on the beach',
    aspectRatio: '9:16'
  })
})
  .then(res => res.json())
  .then(data => {
    console.log('\n📋 Respuesta de generate-draft:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\n🔍 Analizando statusUrl:');
    console.log('statusUrl:', data.statusUrl);
    console.log('taskId:', data.taskId);
    
    // Probar el statusUrl directamente
    console.log('\n🧪 Probando statusUrl directamente...');
    
    // Esperar 2 segundos antes de consultar
    setTimeout(() => {
      fetch(data.statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Key ${process.env.FAL_AI_API_KEY || 'MISSING'}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          console.log('\n📊 Respuesta de statusUrl:');
          console.log('Status:', res.status);
          console.log('Status Text:', res.statusText);
          return res.text();
        })
        .then(text => {
          console.log('Body:', text.substring(0, 500));
          
          if (text.includes('405')) {
            console.log('\n❌ ERROR 405: Method Not Allowed');
            console.log('Esto significa que el endpoint no acepta GET');
            console.log('Probablemente necesitamos usar la API de fal.ai de otra forma');
          }
        })
        .catch(err => console.error('Error:', err.message));
    }, 2000);
  })
  .catch(err => console.error('Error:', err.message));
