/**
 * 🎯 Script para listar modelos de Imagen disponibles en Vertex AI
 * 
 * Uso: node scripts/list-available-imagen-models.js
 * 
 * Requiere: GOOGLE_SERVICE_ACCOUNT_KEY en .env o variable de entorno
 */

import { GoogleAuth } from 'google-auth-library';
import https from 'https';

async function listImagenModels() {
  console.log('🎯 Buscando modelos de Imagen disponibles en Vertex AI...\n');

  const keyData = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  
  if (!keyData) {
    console.error('❌ Error: GOOGLE_SERVICE_ACCOUNT_KEY no encontrada en variables de entorno');
    console.log('💡 Ejecuta con: GOOGLE_SERVICE_ACCOUNT_KEY="$(cat path/to/key.json)" node scripts/list-available-imagen-models.js');
    process.exit(1);
  }

  try {
    const serviceAccount = JSON.parse(keyData);
    const privateKey = serviceAccount.private_key.replace(/\\n/g, '\n').trim();

    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: privateKey,
      },
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();
    
    console.log(`✅ Autenticado como: ${serviceAccount.client_email}`);
    console.log(`📁 Proyecto: ${serviceAccount.project_id}\n`);

    // Lista de modelos de imagen a verificar
    const modelsToCheck = [
      'imagen-3-0-fast-generate',
      'imagen-3-0-generate-002',
      'imagen-3-0-pro-generate',
      'imagen-3-0-capability-001',
      'imagen-4-0-fast-generate-001',
      'imagen-4-0-generate-001',
      'imagen-4-0-ultra-generate-001'
    ];

    const projectId = serviceAccount.project_id;
    const location = 'us-central1';

    console.log('🔍 Verificando disponibilidad de modelos...\n');

    const results = await Promise.all(
      modelsToCheck.map(async (modelEndpoint) => {
        const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelEndpoint}`;
        
        return new Promise((resolve) => {
          const req = https.get(url, {
            headers: {
              'Authorization': `Bearer ${token.token}`,
              'Content-Type': 'application/json'
            }
          }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              if (res.statusCode === 200) {
                resolve({ model: modelEndpoint, available: true, data: JSON.parse(data) });
              } else {
                resolve({ model: modelEndpoint, available: false, status: res.statusCode });
              }
            });
          });
          
          req.on('error', (e) => {
            resolve({ model: modelEndpoint, available: false, error: e.message });
          });
          
          req.setTimeout(5000, () => {
            req.destroy();
            resolve({ model: modelEndpoint, available: false, error: 'Timeout' });
          });
        });
      })
    );

    // Mostrar resultados
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📋 MODELOS DE IMAGEN DISPONIBLES');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const available = results.filter(r => r.available);
    const unavailable = results.filter(r => !r.available);

    if (available.length > 0) {
      console.log('✅ MODELOS DISPONIBLES:');
      console.log('─'.repeat(60));
      available.forEach(r => {
        console.log(`  • ${r.model}`);
        if (r.data?.name) {
          console.log(`    Name: ${r.data.name}`);
        }
        if (r.data?.versionId) {
          console.log(`    Version: ${r.data.versionId}`);
        }
      });
      console.log('');
    }

    if (unavailable.length > 0) {
      console.log('❌ MODELOS NO DISPONIBLES:');
      console.log('─'.repeat(60));
      unavailable.forEach(r => {
        console.log(`  • ${r.model} (${r.error || 'Status: ' + r.status})`);
      });
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📊 Resumen: ${available.length} disponibles, ${unavailable.length} no disponibles`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    if (available.length > 0) {
      console.log('💡 Para usar un modelo disponible, actualiza:');
      console.log('   - netlify/functions/generate-image.ts (modelMap)');
      console.log('   - src/constants/aiModels.ts (MODELS.DRAFT_ENGINE / MODELS.HD_ENGINE)');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listImagenModels();