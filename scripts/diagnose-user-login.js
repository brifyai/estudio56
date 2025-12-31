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

async function diagnoseUserLogin() {
  try {
    console.log('🔍 DIAGNÓSTICO DE LOGIN DE USUARIO');
    console.log('===================================');
    console.log(`📡 Conectando a: ${supabaseUrl}`);
    console.log('');

    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Error de conexión:', testError.message);
      return;
    }

    console.log('✅ Conexión a Supabase: OK');
    console.log('');

    // Check if the specific user exists
    const testEmail = 'camiloalegriabarra@gmail.com';
    console.log(`🔍 Buscando usuario: ${testEmail}`);
    console.log('');

    // Try to sign in with the credentials to see what error we get
    console.log('🧪 Probando credenciales...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: 'Antonito26$'
    });

    if (signInError) {
      console.log('❌ Error de autenticación:', signInError.message);
      console.log('🔍 Código de error:', signInError.status);
      console.log('');

      // Analyze the error
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('🚨 PROBLEMA IDENTIFICADO:');
        console.log('   - Las credenciales son incorrectas');
        console.log('   - O el usuario no existe');
        console.log('   - O la contraseña es incorrecta');
      } else if (signInError.message.includes('Email not confirmed')) {
        console.log('🚨 PROBLEMA IDENTIFICADO:');
        console.log('   - El usuario existe pero no ha confirmado su email');
        console.log('   - Necesita hacer clic en el enlace de confirmación');
      } else if (signInError.message.includes('Too many requests')) {
        console.log('🚨 PROBLEMA IDENTIFICADO:');
        console.log('   - Demasiados intentos de login');
        console.log('   - Espera unos minutos antes de intentar de nuevo');
      }
    } else {
      console.log('✅ Login exitoso!');
      console.log('👤 Usuario:', signInData.user?.email);
      console.log('📅 Creado:', signInData.user?.created_at);
    }

    console.log('');
    console.log('📋 POSIBLES SOLUCIONES:');
    console.log('=======================');
    console.log('');
    console.log('1. 🔐 SI EL USUARIO NO EXISTE:');
    console.log('   - Ve a http://localhost:3000/registrarse');
    console.log('   - Registra una cuenta nueva');
    console.log('   - Confirma el email');
    console.log('');

    console.log('2. 📧 SI EL USUARIO EXISTE PERO NO CONFIRMÓ:');
    console.log('   - Revisa tu email (bandeja y spam)');
    console.log('   - Busca un email de "Confirm your signup"');
    console.log('   - Haz clic en el enlace de confirmación');
    console.log('');

    console.log('3. 🔑 SI LA CONTRASEÑA ES INCORRECTA:');
    console.log('   - Usa la opción "Olvidé mi contraseña"');
    console.log('   - O crea una cuenta nueva');
    console.log('');

    console.log('4. 🚫 SI HAY DEMASIADOS INTENTOS:');
    console.log('   - Espera 5-10 minutos');
    console.log('   - Intenta de nuevo más tarde');
    console.log('');

    // Check users table for any existing users
    console.log('👥 VERIFICANDO USUARIOS EN LA BASE DE DATOS...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.log('⚠️  No se puede acceder a la tabla users:', usersError.message);
    } else {
      console.log(`✅ Encontrados ${users?.length || 0} usuarios en la base de datos:`);
      if (users && users.length > 0) {
        users.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.email} (ID: ${user.id})`);
        });
      } else {
        console.log('   📭 No hay usuarios registrados aún');
      }
    }

    console.log('');
    console.log('🎯 RECOMENDACIÓN INMEDIATA:');
    console.log('============================');
    console.log('1. Ve a http://localhost:3000/registrarse');
    console.log('2. Registra una cuenta nueva con tu email');
    console.log('3. Revisa tu email y confirma la cuenta');
    console.log('4. Luego intenta iniciar sesión');

  } catch (error) {
    console.error('❌ Error en diagnóstico:', error.message);
  }
}

diagnoseUserLogin();
