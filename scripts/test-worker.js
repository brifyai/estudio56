/**
 * Script para probar el Cloudflare Worker directamente
 */

const WORKER_URL = 'https://estudio56-video-worker.brifyaimaster.workers.dev';

async function testWorker() {
  console.log('🧪 Testing Cloudflare Worker...\n');
  
  // 1. Health Check
  console.log('1️⃣ Health Check...');
  try {
    const healthResponse = await fetch(`${WORKER_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return;
  }
  
  console.log('\n');
  
  // 2. Generate Draft Video
  console.log('2️⃣ Generating draft video...');
  try {
    const generateResponse = await fetch(`${WORKER_URL}/generate-draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'A beautiful sunset over the ocean with waves',
        aspectRatio: '9:16'
      }),
    });
    
    console.log('Status:', generateResponse.status);
    const generateData = await generateResponse.json();
    console.log('Response:', JSON.stringify(generateData, null, 2));
    
    if (!generateResponse.ok) {
      console.error('❌ Generation failed');
      return;
    }
    
    console.log('✅ Task ID:', generateData.taskId);
    
    // 3. Check Status
    console.log('\n3️⃣ Checking status...');
    const statusResponse = await fetch(`${WORKER_URL}/check-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId: generateData.taskId,
        model: 'draft'
      }),
    });
    
    const statusData = await statusResponse.json();
    console.log('Status Response:', JSON.stringify(statusData, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWorker();
