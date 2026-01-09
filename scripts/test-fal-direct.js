/**
 * 🧪 Test Directo de fal.ai API (sin Worker)
 * 
 * Este script prueba la API de fal.ai directamente para ver qué responde
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '..', '.env.local') });

const FAL_API_KEY = process.env.FAL_AI_API_KEY;

if (!FAL_API_KEY) {
  console.error('❌ FAL_AI_API_KEY no está configurada');
  console.log('Asegúrate de tener FAL_AI_API_KEY en .env.local');
  process.exit(1);
}

console.log('🧪 TEST DIRECTO DE FAL.AI API\n');
console.log('='.repeat(60));
console.log('API Key (primeros 10 chars):', FAL_API_KEY.substring(0, 10) + '...');

const FAL_BASE_URL = 'https://queue.fal.run';
const MODEL = 'fal-ai/ltx-2-19b/text-to-video/lora';

async function test() {
  try {
    // Paso 1: Generar video
    console.log('\n📋 Paso 1: Generar video');
    console.log('-'.repeat(60));
    
    const generateResponse = await fetch(`${FAL_BASE_URL}/${MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: 'A dog running on the beach',
        video_size: { width: 480, height: 854 },
        num_frames: 121,
        video_quality: 'low',
        acceleration: 'full',
        num_inference_steps: 30,
        fps: 25
      })
    });
    
    console.log('Generate Status:', generateResponse.status);
    const generateData = await generateResponse.json();
    console.log('Generate Response:', JSON.stringify(generateData, null, 2));
    
    if (!generateResponse.ok) {
      console.error('❌ Error generando video');
      return;
    }
    
    const taskId = generateData.request_id;
    const statusUrl = generateData.status_url;
    
    console.log('\n✅ Video en cola');
    console.log('Task ID:', taskId);
    console.log('Status URL:', statusUrl);
    
    // Paso 2: Esperar 3 segundos
    console.log('\n⏳ Esperando 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Paso 3: Consultar estado usando status_url
    console.log('\n📋 Paso 2: Consultar estado usando status_url');
    console.log('-'.repeat(60));
    console.log('URL:', statusUrl);
    
    const statusResponse1 = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status Response (status_url):', statusResponse1.status);
    const statusText1 = await statusResponse1.text();
    console.log('Response:', statusText1.substring(0, 500));
    
    // Paso 4: Consultar estado construyendo URL manualmente
    console.log('\n📋 Paso 3: Consultar estado construyendo URL manualmente');
    console.log('-'.repeat(60));
    
    const manualUrl = `${FAL_BASE_URL}/${MODEL}/requests/${taskId}/status`;
    console.log('URL:', manualUrl);
    
    const statusResponse2 = await fetch(manualUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status Response (manual URL):', statusResponse2.status);
    const statusText2 = await statusResponse2.text();
    console.log('Response:', statusText2.substring(0, 500));
    
    // Paso 5: Consultar estado SIN /status al final
    console.log('\n📋 Paso 4: Consultar estado SIN /status al final');
    console.log('-'.repeat(60));
    
    const noStatusUrl = `${FAL_BASE_URL}/${MODEL}/requests/${taskId}`;
    console.log('URL:', noStatusUrl);
    
    const statusResponse3 = await fetch(noStatusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status Response (sin /status):', statusResponse3.status);
    const statusText3 = await statusResponse3.text();
    console.log('Response:', statusText3.substring(0, 500));
    
    console.log('\n' + '='.repeat(60));
    console.log('FIN DEL TEST');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
