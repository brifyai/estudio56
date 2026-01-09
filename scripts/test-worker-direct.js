/**
 * 🧪 Test Directo del Cloudflare Worker
 */

const WORKER_URL = 'https://estudio56-video-worker.brifyaimaster.workers.dev';

console.log('🧪 TESTING CLOUDFLARE WORKER\n');
console.log('='.repeat(60));

// Test 1: Health Check
console.log('\n📋 Test 1: Health Check');
console.log('-'.repeat(60));

fetch(`${WORKER_URL}/health`)
  .then(res => res.json())
  .then(data => {
    console.log('✅ Health check OK:', data);
    
    // Test 2: Generate Draft (esto debería fallar si API key está mal)
    console.log('\n📋 Test 2: Generate Draft Video');
    console.log('-'.repeat(60));
    
    return fetch(`${WORKER_URL}/generate-draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'A dog running on the beach',
        aspectRatio: '9:16'
      })
    });
  })
  .then(res => {
    console.log('Status:', res.status);
    return res.text(); // Usar text() en lugar de json() para ver el error real
  })
  .then(text => {
    console.log('Response:', text);
    
    try {
      const data = JSON.parse(text);
      console.log('\n✅ Worker responde correctamente');
      console.log('Task ID:', data.taskId);
    } catch (e) {
      console.log('\n❌ Worker devolvió HTML en lugar de JSON');
      console.log('Esto indica un error 401 de fal.ai');
      console.log('\nPrimeros 200 caracteres de la respuesta:');
      console.log(text.substring(0, 200));
    }
  })
  .catch(err => {
    console.error('\n❌ Error:', err.message);
  });
