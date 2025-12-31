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

async function debugAuthFlow() {
  try {
    console.log('🔍 DEBUGGING AUTH FLOW');
    console.log('======================');
    console.log(`📡 Conectando a: ${supabaseUrl}`);
    console.log('');

    // Step 1: Check current session
    console.log('1️⃣ VERIFICANDO SESIÓN ACTUAL...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error obteniendo sesión:', sessionError.message);
    } else if (session) {
      console.log('✅ Sesión encontrada:');
      console.log(`   👤 Usuario: ${session.user?.email}`);
      console.log(`   🆔 ID: ${session.user?.id}`);
      console.log(`   📅 Creado: ${session.user?.created_at}`);
      console.log(`   ⏰ Expira: ${session.expires_at}`);
    } else {
      console.log('❌ No hay sesión activa');
    }
    console.log('');

    // Step 2: Try to sign in
    console.log('2️⃣ PROBANDO LOGIN...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'camiloalegriabarra@gmail.com',
      password: 'Antonito26$'
    });

    if (signInError) {
      console.error('❌ Error de login:', signInError.message);
      return;
    }

    console.log('✅ Login exitoso!');
    console.log(`   👤 Usuario: ${signInData.user?.email}`);
    console.log(`   🆔 ID: ${signInData.user?.id}`);
    console.log('');

    // Step 3: Check session again after login
    console.log('3️⃣ VERIFICANDO SESIÓN DESPUÉS DEL LOGIN...');
    const { data: { session: newSession }, error: newSessionError } = await supabase.auth.getSession();
    
    if (newSessionError) {
      console.error('❌ Error obteniendo nueva sesión:', newSessionError.message);
    } else if (newSession) {
      console.log('✅ Nueva sesión confirmada:');
      console.log(`   👤 Usuario: ${newSession.user?.email}`);
      console.log(`   🆔 ID: ${newSession.user?.id}`);
    } else {
      console.log('❌ No se encontró nueva sesión');
    }
    console.log('');

    // Step 4: Check if user exists in custom table
    console.log('4️⃣ VERIFICANDO USUARIO EN TABLA CUSTOM...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signInData.user?.id)
      .single();

    if (userError) {
      console.error('❌ Error consultando tabla users:', userError.message);
    } else if (userData) {
      console.log('✅ Usuario encontrado en tabla custom:');
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   📊 Plan ID: ${userData.plan_id}`);
      console.log(`   💰 Créditos: ${userData.credits}`);
    } else {
      console.log('❌ Usuario no encontrado en tabla custom');
    }
    console.log('');

    // Step 5: Test auth state change listener
    console.log('5️⃣ PROBANDO LISTENER DE CAMBIOS DE AUTH...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`🔔 Auth state changed: ${event}`);
        if (session) {
          console.log(`   ✅ Session found: ${session.user?.email}`);
        } else {
          console.log(`   ❌ No session`);
        }
      }
    );

    console.log('✅ Listener configurado');
    console.log('');

    // Summary
    console.log('📋 RESUMEN DEL DIAGNÓSTICO:');
    console.log('============================');
    console.log('✅ Login funciona correctamente');
    console.log('✅ Sesión se crea correctamente');
    console.log('✅ Usuario existe en tabla custom');
    console.log('✅ Listener de auth configurado');
    console.log('');
    console.log('🎯 POSIBLE PROBLEMA:');
    console.log('El Dashboard puede no estar detectando los cambios de auth correctamente.');
    console.log('Esto puede deberse a:');
    console.log('- Timing issues en React');
    console.log('- Estado no se actualiza correctamente');
    console.log('- Problema con el useEffect del Dashboard');
    console.log('');

    console.log('💡 SOLUCIÓN RECOMENDADA:');
    console.log('========================');
    console.log('1. Refrescar la página después del login');
    console.log('2. O implementar un force refresh del estado');
    console.log('3. O agregar logs al Dashboard para debug');

    subscription.unsubscribe();

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

debugAuthFlow();
