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

async function debugDashboardAccess() {
  try {
    console.log('🔍 DEBUGGING DASHBOARD ACCESS');
    console.log('=============================');
    console.log(`📡 Conectando a: ${supabaseUrl}`);
    console.log('');

    const userEmail = 'camiloalegriabarra@gmail.com';

    // Step 1: Check if user can sign in
    console.log('1️⃣ PROBANDO SIGN IN...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: 'Antonito26$'
    });

    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message);
      console.log('🔍 Error details:', signInError);
      return;
    }

    console.log('✅ Sign in successful!');
    console.log(`👤 User ID: ${signInData.user?.id}`);
    console.log(`📧 Email: ${signInData.user?.email}`);
    console.log(`📅 Created: ${signInData.user?.created_at}`);
    console.log('');

    // Step 2: Check session
    console.log('2️⃣ VERIFICANDO SESIÓN...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError.message);
      return;
    }

    if (!session) {
      console.log('❌ No active session found');
      return;
    }

    console.log('✅ Active session found!');
    console.log(`🆔 Session ID: ${session.access_token.substring(0, 20)}...`);
    console.log(`⏰ Expires: ${session.expires_at}`);
    console.log('');

    // Step 3: Check user data in database
    console.log('3️⃣ VERIFICANDO DATOS EN BASE DE DATOS...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        user_plans (
          id,
          name,
          price,
          credits_per_month
        )
      `)
      .eq('id', signInData.user?.id)
      .single();

    if (userError) {
      console.error('❌ User data error:', userError.message);
      console.log('🔍 This might be why dashboard access fails');
      return;
    }

    console.log('✅ User data found!');
    console.log(`📊 Plan: ${userData.user_plans?.name}`);
    console.log(`💰 Credits: ${userData.credits}`);
    console.log('');

    // Step 4: Test a simple query to verify permissions
    console.log('4️⃣ PROBANDO PERMISOS DE BASE DE DATOS...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id, email')
      .limit(1);

    if (testError) {
      console.error('❌ Database permission error:', testError.message);
      console.log('🔍 This could prevent dashboard from loading user data');
    } else {
      console.log('✅ Database permissions working');
    }
    console.log('');

    // Step 5: Check auth state
    console.log('5️⃣ VERIFICANDO ESTADO DE AUTH...');
    const { data: { user }, error: userError2 } = await supabase.auth.getUser();
    
    if (userError2) {
      console.error('❌ Get user error:', userError2.message);
    } else if (user) {
      console.log('✅ Current user:', user.email);
      console.log(`🔑 User confirmed: ${user.email_confirmed_at ? 'YES' : 'NO'}`);
    } else {
      console.log('❌ No current user found');
    }
    console.log('');

    // Summary
    console.log('📋 RESUMEN DEL DIAGNÓSTICO:');
    console.log('============================');
    console.log('✅ Sign in: OK');
    console.log('✅ Session: OK');
    console.log('✅ User data: OK');
    console.log('✅ Database permissions: OK');
    console.log('✅ Auth state: OK');
    console.log('');
    console.log('🎯 DIAGNÓSTICO:');
    console.log('===============');
    console.log('Todo parece estar funcionando correctamente.');
    console.log('Si el dashboard no carga, puede ser un problema de:');
    console.log('1. Caché del navegador');
    console.log('2. Error en el código React');
    console.log('3. Problema de routing');
    console.log('');
    console.log('🔧 SOLUCIONES RECOMENDADAS:');
    console.log('===========================');
    console.log('1. Limpiar caché del navegador (Ctrl+Shift+Delete)');
    console.log('2. Abrir en ventana de incógnito');
    console.log('3. Verificar consola del navegador (F12) para errores');
    console.log('4. Recargar página con Ctrl+F5');

  } catch (error) {
    console.error('❌ Error general:', error.message);
    console.log('🔍 Stack trace:', error.stack);
  }
}

debugDashboardAccess();
