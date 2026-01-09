#!/usr/bin/env node

/**
 * 🔍 Script de Diagnóstico: Configuración de Fal.ai
 * 
 * Este script verifica que la configuración de Fal.ai esté correcta
 * y puede hacer una prueba básica de la API (opcional).
 * 
 * Uso:
 *   node scripts/test-fal-ai-config.js
 */

const https = require('https');

console.log('🔍 DIAGNÓSTICO DE CONFIGURACIÓN FAL.AI');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Verificar variable de entorno
console.log('1️⃣ Verificando variable de entorno FAL_API_KEY...');
const apiKey = process.env.FAL_API_KEY;

if (!apiKey) {
  console.error('❌ ERROR: FAL_API_KEY no está configurada');
  console.log('\n📝 SOLUCIÓN:');
  console.log('   1. Obtener API Key de: https://fal.ai/dashboard');
  console.log('   2. Configurar en Netlify: Site settings → Environment variables');
  console.log('   3. Agregar: FAL_API_KEY = fal_...');
  console.log('   4. Hacer un nuevo deploy\n');
  process.exit(1);
}

console.log('✅ FAL_API_KEY está configurada');
console.log(`   Formato: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
console.log(`   Longitud: ${apiKey.length} caracteres\n`);

// 2. Verificar formato de la API Key
console.log('2️⃣ Verificando formato de la API Key...');
if (!apiKey.startsWith('fal_')) {
  console.warn('⚠️ ADVERTENCIA: La API Key no empieza con "fal_"');
  console.log('   Esto podría indicar un formato incorrecto\n');
} else {
  console.log('✅ Formato de API Key correcto\n');
}

// 3. Verificar conectividad con Fal.ai (opcional)
console.log('3️⃣ Verificando conectividad con Fal.ai...');
console.log('   (Esto puede tardar unos segundos)\n');

const testEndpoint = 'https://queue.fal.run/fal-ai/pika/v2/turbo/text-to-video';

const postData = JSON.stringify({
  prompt: 'A simple test video of a blue sky',
  aspect_ratio: '9:16',
  resolution: '720p',
  duration: 5
});

const options = {
  method: 'POST',
  headers: {
    'Authorization': `Key ${apiKey}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(testEndpoint, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`   Status Code: ${res.statusCode}`);
    
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('✅ Conexión exitosa con Fal.ai');
      console.log('✅ API Key es válida\n');
      
      try {
        const response = JSON.parse(data);
        if (response.request_id) {
          console.log(`   Request ID generado: ${response.request_id}`);
          console.log('   ✅ La generación de video debería funcionar correctamente\n');
        }
      } catch (e) {
        console.log('   Respuesta:', data.substring(0, 200));
      }
      
      console.log('═══════════════════════════════════════════════════════════════');
      console.log('✅ DIAGNÓSTICO COMPLETADO: TODO ESTÁ CORRECTO');
      console.log('═══════════════════════════════════════════════════════════════\n');
      
    } else if (res.statusCode === 401) {
      console.error('❌ ERROR: API Key inválida (401 Unauthorized)');
      console.log('\n📝 SOLUCIÓN:');
      console.log('   1. Verificar que la API Key sea correcta');
      console.log('   2. Obtener una nueva de: https://fal.ai/dashboard');
      console.log('   3. Actualizar en Netlify: Site settings → Environment variables\n');
      
    } else if (res.statusCode === 429) {
      console.error('❌ ERROR: Límite de cuota excedido (429 Too Many Requests)');
      console.log('\n📝 SOLUCIÓN:');
      console.log('   1. Verificar el plan de Fal.ai');
      console.log('   2. Esperar a que se renueve la cuota');
      console.log('   3. O actualizar el plan en: https://fal.ai/dashboard\n');
      
    } else {
      console.error(`❌ ERROR: Respuesta inesperada (${res.statusCode})`);
      console.log('   Respuesta:', data.substring(0, 500));
      console.log('\n📝 SOLUCIÓN:');
      console.log('   1. Revisar logs de Netlify Functions');
      console.log('   2. Verificar documentación de Fal.ai');
      console.log('   3. Contactar soporte si el problema persiste\n');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ ERROR DE CONEXIÓN:', error.message);
  console.log('\n📝 POSIBLES CAUSAS:');
  console.log('   1. Sin conexión a internet');
  console.log('   2. Firewall bloqueando la conexión');
  console.log('   3. Fal.ai está temporalmente inaccesible\n');
});

req.write(postData);
req.end();
