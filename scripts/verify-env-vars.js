import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const functionsDir = './netlify/functions';
const requiredEnvVars = new Set();

// Leer todas las funciones y extraer process.env
fs.readdirSync(functionsDir).forEach(file => {
  if (file.endsWith('.ts')) {
    const content = fs.readFileSync(path.join(functionsDir, file), 'utf8');
    
    // Buscar process.env.VARIABLE
    const matches = content.match(/process\.env\.[A-Z_0-9]+/g);
    if (matches) {
      matches.forEach(m => {
        const varName = m.replace('process.env.', '');
        // Ignorar VITE_* que son para frontend
        if (!varName.startsWith('VITE_')) {
          requiredEnvVars.add(varName);
        }
      });
    }
  }
});

console.log('🔍 Variables de entorno requeridas en Netlify:\n');
requiredEnvVars.forEach(v => {
  console.log(`  - ${v}`);
});

console.log('\n' + '='.repeat(60));
console.log('\n📋 INSTRUCCIONES:\n');
console.log('1. Ve a https://app.netlify.com/sites/estudio56');
console.log('2. Click en "Site settings" → "Environment variables"');
console.log('3. Agrega las siguientes variables:\n');

requiredEnvVars.forEach(v => {
  console.log(`   ${v}=TU_VALOR_AQUI`);
});

console.log('\n📌 IMPORTANTE:');
console.log('- MERCADOPAGO_ACCESS_TOKEN: Tu token de acceso de MercadoPago');
console.log('- SUPABASE_SERVICE_ROLE_KEY: Tu service role key de Supabase');
console.log('- VITE_APP_URL: https://estudio56.netlify.app');