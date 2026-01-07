#!/usr/bin/env node
/**
 * Script para verificar la configuración de GCP y diagnosticar errores de generación de imágenes
 */

require('dotenv').config();

console.log('='.repeat(60));
console.log('🔍 DIAGNÓSTICO DE CONFIGURACIÓN DE GCP');
console.log('='.repeat(60));

// 1. Verificar variables de entorno
console.log('\n📋 Variables de entorno relevantes:');
console.log('-'.repeat(40));

const envVars = [
  'VITE_GEMINI_API_KEY',
  'GEMINI_API_KEY',
  'GOOGLE_APPLICATION_CREDENTIALS',
  'GCP_PROJECT_ID',
  'GOOGLE_CLOUD_PROJECT',
  'VITE_GCP_PROJECT_ID'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    if (varName.includes('API_KEY') || varName.includes('CREDENTIALS')) {
      console.log(`✅ ${varName}: [OCULTO - ${value.length} chars]`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: No configurada`);
  }
});

// 2. Verificar si las credenciales de GCP son válidas
console.log('\n🔐 Verificando credenciales de GCP:');
console.log('-'.repeat(40));

const gcpCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (gcpCredentials) {
  try {
    const credentials = JSON.parse(gcpCredentials);
    console.log('✅ GOOGLE_APPLICATION_CREDENTIALS es JSON válido');
    console.log(`   - Tipo de cuenta: ${credentials.type}`);
    console.log(`   - Email: ${credentials.client_email}`);
    console.log(`   - Project ID: ${credentials.project_id}`);
    
    // Verificar si la clave privada está presente
    if (credentials.private_key) {
      console.log('✅ Clave privada presente');
      console.log(`   - Longitud de clave: ${credentials.private_key.length} chars`);
    } else {
      console.log('❌ Clave privada NO presente');
    }
  } catch (parseError) {
    console.log('❌ GOOGLE_APPLICATION_CREDENTIALS NO es JSON válido');
    console.log(`   Error: ${parseError.message}`);
    console.log(`   Valor: ${gcpCredentials.substring(0, 100)}...`);
  }
} else {
  console.log('❌ GOOGLE_APPLICATION_CREDENTIALS no configurada');
  console.log('   Para usar Vertex AI, necesitas:');
  console.log('   1. Crear una cuenta de servicio en GCP');
  console.log('   2. Descargar el archivo JSON de credenciales');
  console.log('   3. Configurar GOOGLE_APPLICATION_CREDENTIALS en Netlify');
}

// 3. Verificar API Key de Gemini
console.log('\n🔑 Verificando API Key de Gemini:');
console.log('-'.repeat(40));

const geminiApiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (geminiApiKey) {
  console.log(`✅ GEMINI_API_KEY configurada (${geminiApiKey.length} chars)`);
  
  // Hacer una solicitud de prueba a la API de Gemini
  const https = require('https');
  
  const testRequest = JSON.stringify({
    contents: [{
      parts: [{ text: "Hello" }]
    }]
  });

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
  
  console.log('\n🧪 Probando conexión a Gemini API...');
  
  const req = https.request(geminiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(testRequest)
    }
  }, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log('✅ Gemini API accesible');
        console.log('   Respuesta: OK');
      } else {
        console.log(`❌ Gemini API respondió con código: ${res.statusCode}`);
        try {
          const errorData = JSON.parse(data);
          console.log(`   Error: ${errorData.error?.message || data}`);
        } catch (e) {
          console.log(`   Respuesta: ${data.substring(0, 200)}`);
        }
      }
    });
  });
  
  req.on('error', (error) => {
    console.log(`❌ Error conectando a Gemini API: ${error.message}`);
  });
  
  req.write(testRequest);
  req.end();
} else {
  console.log('❌ GEMINI_API_KEY no configurada');
}

// 4. Resumen de arquitectura
console.log('\n' + '='.repeat(60));
console.log('📊 ARQUITECTURA DE GENERACIÓN DE IMÁGENES');
console.log('='.repeat(60));

console.log(`
🎯 MODELOS DE IMAGEN (recomendados):
   - Draft: imagen-3.0-fast-001 (bajo costo, rápido)
   - HD: imagen-3.0-pro-001 (alta fidelidad)
   - Requieren: Vertex AI con credenciales de GCP

🔄 FALLBACK ACTUAL:
   - Si Vertex AI falla, usa Gemini API directamente
   - Modelo: gemini-2.5-flash-image o gemini-3.0-pro-image-exp

⚠️ NOTA: El error 400 indica que la estructura del request
   a gemini-2.5-flash-image es incorrecta. Se recomienda
   usar modelos de imagen (imagen-3.0-fast-001) en su lugar.
`);

// 5. Recomendaciones
console.log('='.repeat(60));
console.log('💡 RECOMENDACIONES');
console.log('='.repeat(60));

console.log(`
1. Para usar modelos de imagen (imagen-3.0-*):
   - Configurar GOOGLE_APPLICATION_CREDENTIALS en Netlify
   - Crear cuenta de servicio con rol "Vertex AI User"
   - Habilitar Vertex AI API en GCP Console

2. Para usar Gemini API como fallback:
   - Verificar que VITE_GEMINI_API_KEY esté configurada
   - La API key debe tener permisos para Gemini API

3. Para diagnosticar errores de generación:
   - Revisar logs de Netlify Functions
   - Verificar estructura del request según modelo
`);

console.log('\n✅ Diagnóstico completado\n');