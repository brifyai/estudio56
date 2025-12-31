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

async function verifyUserPlan() {
  try {
    console.log('🔍 VERIFICANDO PLAN DEL USUARIO');
    console.log('================================');
    console.log(`📡 Conectando a: ${supabaseUrl}`);
    console.log('');

    const userEmail = 'camiloalegriabarra@gmail.com';

    // Step 1: Get user data with plan info
    console.log('1️⃣ VERIFICANDO DATOS DEL USUARIO...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: 'Antonito26$'
    });

    if (signInError) {
      console.error('❌ Error de autenticación:', signInError.message);
      return;
    }

    console.log(`✅ Usuario autenticado: ${signInData.user.email}`);
    console.log(`🆔 ID: ${signInData.user.id}`);
    console.log('');

    // Step 2: Get detailed user data
    console.log('2️⃣ OBTENIENDO DATOS DETALLADOS...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        user_plans (
          id,
          name,
          price,
          credits_per_month,
          features
        )
      `)
      .eq('id', signInData.user.id)
      .single();

    if (userError) {
      console.error('❌ Error obteniendo datos del usuario:', userError.message);
      return;
    }

    console.log('✅ Datos del usuario obtenidos:');
    console.log(`   📧 Email: ${userData.email}`);
    console.log(`   📊 Plan ID: ${userData.plan_id}`);
    console.log(`   💰 Créditos: ${userData.credits}`);
    console.log('');

    if (userData.user_plans) {
      console.log('📋 INFORMACIÓN DEL PLAN:');
      console.log('========================');
      console.log(`📊 Nombre: ${userData.user_plans.name}`);
      console.log(`💰 Precio: $${userData.user_plans.price}/mes`);
      console.log(`🎯 Créditos: ${userData.user_plans.credits_per_month}`);
      console.log(`📝 Características:`);
      userData.user_plans.features.forEach((feature, index) => {
        console.log(`   ${index + 1}. ${feature}`);
      });
      console.log('');
    } else {
      console.log('❌ No se encontró información del plan');
    }

    // Step 3: Check if plan is AGENCIA
    const isAgencia = userData.user_plans?.name === 'AGENCIA';
    console.log('🎯 VERIFICACIÓN FINAL:');
    console.log('======================');
    if (isAgencia) {
      console.log('✅ ¡El usuario SÍ tiene el plan AGENCIA!');
      console.log('💡 Si la app no lo refleja, puede ser un problema de caché del navegador');
      console.log('🔧 Solución: Recarga la página (Ctrl+F5 o Cmd+Shift+R)');
    } else {
      console.log('❌ El usuario NO tiene el plan AGENCIA');
      console.log(`📊 Plan actual: ${userData.user_plans?.name || 'N/A'}`);
    }

    console.log('');
    console.log('🔍 DATOS COMPLETOS PARA DEBUG:');
    console.log('==============================');
    console.log(JSON.stringify(userData, null, 2));

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

verifyUserPlan();
