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

async function forceRefreshUserData() {
  try {
    console.log('🔄 FORZANDO ACTUALIZACIÓN DE DATOS DEL USUARIO');
    console.log('==============================================');
    console.log(`📡 Conectando a: ${supabaseUrl}`);
    console.log('');

    const userEmail = 'camiloalegriabarra@gmail.com';

    // Step 1: Sign in
    console.log('1️⃣ AUTENTICANDO USUARIO...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: 'Antonito26$'
    });

    if (signInError) {
      console.error('❌ Error de autenticación:', signInError.message);
      return;
    }

    console.log(`✅ Usuario autenticado: ${signInData.user.email}`);
    console.log('');

    // Step 2: Force update user data (to trigger any cache invalidation)
    console.log('2️⃣ FORZANDO ACTUALIZACIÓN EN BASE DE DATOS...');
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', signInData.user.id)
      .select('*, user_plans(*)')
      .single();

    if (updateError) {
      console.error('❌ Error actualizando datos:', updateError.message);
      return;
    }

    console.log('✅ Datos actualizados en base de datos');
    console.log(`📊 Plan confirmado: ${updatedUser.user_plans?.name}`);
    console.log(`💰 Créditos confirmados: ${updatedUser.credits}`);
    console.log('');

    // Step 3: Verify the data is correct
    console.log('3️⃣ VERIFICANDO DATOS FINALES...');
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select('*, user_plans(*)')
      .eq('id', signInData.user.id)
      .single();

    if (verifyError) {
      console.error('❌ Error verificando datos:', verifyError.message);
      return;
    }

    console.log('🎉 DATOS VERIFICADOS:');
    console.log('====================');
    console.log(`👤 Usuario: ${verifyUser.email}`);
    console.log(`📊 Plan: ${verifyUser.user_plans?.name}`);
    console.log(`💰 Precio: $${verifyUser.user_plans?.price}/mes`);
    console.log(`🎯 Créditos: ${verifyUser.credits}`);
    console.log(`📅 Última actualización: ${verifyUser.updated_at}`);
    console.log('');

    console.log('🔧 INSTRUCCIONES PARA EL USUARIO:');
    console.log('==================================');
    console.log('1. Recarga la página del navegador (Ctrl+F5 o Cmd+Shift+R)');
    console.log('2. O cierra y abre la aplicación nuevamente');
    console.log('3. O limpia el caché del navegador');
    console.log('');
    console.log('💡 La aplicación ahora debería mostrar:');
    console.log(`   📊 Plan: AGENCIA (no GRATIS)`);
    console.log(`   🎯 Créditos: 1000 (no 5)`);
    console.log(`   💰 Indicador amarillo (no gris)`);

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

forceRefreshUserData();
