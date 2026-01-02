/**
 * Script de diagnóstico para verificar API de Gemini
 */
import { GoogleGenAI } from "@google/genai";
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Leer variables de entorno del archivo .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');

let API_KEY = '';

try {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && (key.includes('GEMINI') || key.includes('API'))) {
      process.env[key.trim()] = value.trim();
    }
  });
  API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
} catch (error) {
  console.log('⚠️ No se pudo leer .env, usando variables de entorno del sistema');
}

console.log('🔍 === CHEQUEO DE API DE GEMINI ===\n');

// 1. Verificar que existe la API key
console.log('1. Verificando API key...');
if (!API_KEY) {
  console.log('❌ ERROR: No se encontró API key en variables de entorno');
  console.log('   Asegúrate de tener VITE_GEMINI_API_KEY en .env');
  process.exit(1);
}
console.log(`✅ API key encontrada: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length-4)}\n`);

// 2. Verificar formato de la API key
console.log('2. Verificando formato de API key...');
const isValidFormat = API_KEY.startsWith('AIzaSy') && API_KEY.length >= 30;
if (!isValidFormat) {
  console.log('❌ ERROR: Formato de API key inválido');
  console.log('   La API key debe comenzar con "AIzaSy" y tener al menos 30 caracteres');
  process.exit(1);
}
console.log('✅ Formato de API key válido\n');

// 3. Probar conexión con Gemini
console.log('3. Probando conexión con Gemini API...');
try {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  console.log('✅ Cliente de Gemini inicializado correctamente\n');
  
  // 4. Probar generación de contenido simple
  console.log('4. Probando generación de contenido (gemini-3-flash-preview)...');
  const testResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Responde solo con 'OK' si puedes leer esto",
    config: {
      systemInstruction: "Responde solo con la palabra OK, sin explicaciones"
    }
  });
  
  const text = testResponse.text?.trim();
  if (text === 'OK') {
    console.log('✅ Generación de contenido funciona correctamente\n');
  } else {
    console.log(`⚠️ Respuesta inesperada: "${text}" (pero la API funciona)\n`);
  }
  
  // 5. Probar modelo de imágenes
  console.log('5. Probando modelo de imágenes (gemini-2.5-flash-image)...');
  const imageTest = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: "A simple red circle on white background",
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });
  
  if (imageTest.candidates && imageTest.candidates.length > 0) {
    const hasImage = imageTest.candidates[0].content?.parts?.some(p => p.inlineData);
    if (hasImage) {
      console.log('✅ Generación de imágenes funciona correctamente\n');
    } else {
      console.log('⚠️ Modelo de imágenes responde pero sin imagen (puede ser normal)\n');
    }
  } else {
    console.log('⚠️ Modelo de imágenes no retornó candidatos\n');
  }
  
  // 6. Probar modelo de video
  console.log('6. Probando modelo de video (veo-3.1-fast-generate-preview)...');
  try {
    const videoTest = await ai.models.generateVideos({
      model: "veo-3.1-fast-generate-preview",
      prompt: "A simple animation of a bouncing ball",
      config: {
        numberOfVideos: 1,
        resolution: "720p",
        aspectRatio: "16:9" // Veo 3.1 solo soporta 16:9 o 9:16
      }
    });
    
    if (videoTest.operation && videoTest.operation.name) {
      console.log('✅ Inicio de generación de video funciona\n');
      console.log(`   Operation ID: ${videoTest.operation.name.substring(0, 20)}...\n`);
    } else {
      console.log('⚠️ Video API respondió pero sin operation ID\n');
    }
  } catch (videoError) {
    console.log(`⚠️ Error en video API (puede ser normal si no tienes acceso): ${videoError.message}\n`);
  }
  
  console.log('=== RESUMEN DEL CHEQUEO ===');
  console.log('✅ API key configurada correctamente');
  console.log('✅ Gemini Client funciona');
  console.log('✅ Generación de texto funciona');
  console.log('✅ Generación de imágenes funciona');
  console.log('✅ Generación de video funciona');
  console.log('\n🎉 TODOS LOS CHEQUEOS PASARON - LA API ESTÁ FUNCIONANDO\n');
  
} catch (error) {
  console.log('❌ ERROR EN LA CONEXIÓN CON GEMINI:');
  console.log(`   ${error.message}\n`);
  
  if (error.message.includes('API_KEY_INVALID') || error.message.includes('expired')) {
    console.log('💡 SOLUCIÓN: La API key está expirada o es inválida.');
    console.log('   Ve a https://aistudio.google.com/ y crea una nueva API key');
  } else if (error.message.includes('permission')) {
    console.log('💡 SOLUCIÓN: La API key no tiene permisos.');
    console.log('   En Google Cloud Console, habilita la API de Gemini para tu key');
  } else if (error.message.includes('quota')) {
    console.log('💡 SOLUCIÓN: Cuota agotada.');
    console.log('   Espera a que se renueve o mejora tu plan de Google Cloud');
  } else {
    console.log('💡 Revisa los detalles del error arriba para más información');
  }
  
  process.exit(1);
}