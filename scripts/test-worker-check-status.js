/**
 * 🧪 Test Check Status del Worker
 */

const WORKER_URL = 'https://estudio56-video-worker.brifyaimaster.workers.dev';

// Primero generar un video para obtener un taskId real
console.log('🧪 TESTING CHECK STATUS\n');
console.log('='.repeat(60));

console.log('\n📋 Paso 1: Generar video para obtener taskId');
console.log('-'.repeat(60));

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
    console.log('✅ Video generado');
    console.log('Task ID:', data.taskId);
    
    const taskId = data.taskId;
    
    // Ahora probar check-status
    console.log('\n📋 Paso 2: Consultar estado del video');
    console.log('-'.repeat(60));
    
    return fetch(`${WORKER_URL}/check-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: taskId,
        model: 'draft'
      })
    });
  })
  .then(res => {
    console.log('Status:', res.status);
    return res.text();
  })
  .then(text => {
    console.log('Response:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('\n✅ Check status funciona correctamente');
      console.log('Estado:', data.status);
    } catch (e) {
      console.log('\n❌ Worker devolvió respuesta inválida');
      console.log('Error:', e.message);
      console.log('\nPrimeros 500 caracteres:');
      console.log(text.substring(0, 500));
    }
  })
  .catch(err => {
    console.error('\n❌ Error:', err.message);
  });
