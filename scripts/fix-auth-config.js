import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAuthConfig() {
  try {
    console.log('🔧 Verificando configuración de autenticación...');
    console.log(`📡 Conectando a: ${supabaseUrl}`);

    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('user_plans')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Error de conexión:', testError.message);
      return;
    }

    console.log('✅ Conexión exitosa a Supabase');

    // Get auth settings
    const { data: authConfig, error: authError } = await supabase.auth.admin.getSettings();
    
    if (authError) {
      console.log('ℹ️  No se pueden obtener configuraciones de admin (requiere service role key)');
      console.log('💡 Esto es normal para claves anónimas');
    } else {
      console.log('✅ Configuración de auth obtenida');
    }

    console.log('\n🔧 SOLUCIÓN AL PROBLEMA DE EMAIL:');
    console.log('=====================================');
    console.log('El problema es que Supabase está enviando emails desde un proyecto diferente.');
    console.log('');
    console.log('📋 PASOS PARA SOLUCIONAR:');
    console.log('1. Ve a tu Dashboard de Supabase: https://supabase.com/dashboard');
    console.log(`2. Selecciona el proyecto: ${supabaseUrl.split('//')[1].split('.')[0]}`);
    console.log('3. Ve a Authentication > Settings');
    console.log('4. En "Site URL" pon: http://localhost:3000');
    console.log('5. En "Redirect URLs" agrega: http://localhost:3000/**');
    console.log('6. Guarda los cambios');
    console.log('');
    console.log('📧 CONFIGURACIÓN DE EMAIL:');
    console.log('7. Ve a Authentication > Email Templates');
    console.log('8. Verifica que el template "Confirm signup" use la URL correcta');
    console.log('9. Si persiste el problema, desactiva y reactiva la confirmación por email');
    console.log('');
    console.log('🚀 DESPUÉS DE ESTOS CAMBIOS:');
    console.log('- Registra un usuario nuevo');
    console.log('- El email debería venir del proyecto correcto');
    console.log('- El enlace debería funcionar correctamente');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixAuthConfig();