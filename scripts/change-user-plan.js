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

async function changeUserPlan() {
  try {
    console.log('🔄 CAMBIANDO PLAN DE USUARIO');
    console.log('============================');
    console.log(`📡 Conectando a: ${supabaseUrl}`);
    console.log('');

    const userEmail = 'camiloalegriabarra@gmail.com';
    const newPlanName = 'AGENCIA';

    // Step 1: Get all available plans
    console.log('1️⃣ VERIFICANDO PLANES DISPONIBLES...');
    const { data: plans, error: plansError } = await supabase
      .from('user_plans')
      .select('*')
      .order('price', { ascending: true });

    if (plansError) {
      console.error('❌ Error obteniendo planes:', plansError.message);
      return;
    }

    console.log('✅ Planes disponibles:');
    plans.forEach(plan => {
      console.log(`   📊 ${plan.name}: $${plan.price}/mes - ${plan.credits_per_month} créditos`);
    });
    console.log('');

    // Step 2: Find the target plan
    const targetPlan = plans.find(plan => plan.name.toUpperCase() === newPlanName.toUpperCase());
    
    if (!targetPlan) {
      console.error(`❌ Plan "${newPlanName}" no encontrado`);
      console.log('💡 Planes disponibles:', plans.map(p => p.name).join(', '));
      return;
    }

    console.log(`✅ Plan objetivo encontrado: ${targetPlan.name}`);
    console.log(`💰 Precio: $${targetPlan.price}/mes`);
    console.log(`🎯 Créditos: ${targetPlan.credits_per_month}`);
    console.log('');

    // Step 3: Get user info
    console.log('2️⃣ OBTENIENDO INFORMACIÓN DEL USUARIO...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: 'Antonito26$'
    });

    if (signInError) {
      console.error('❌ Error de autenticación:', signInError.message);
      return;
    }

    if (!signInData.user) {
      console.error('❌ No se pudo obtener información del usuario');
      return;
    }

    console.log(`✅ Usuario autenticado: ${signInData.user.email}`);
    console.log(`🆔 ID: ${signInData.user.id}`);
    console.log('');

    // Step 4: Check current user data
    console.log('3️⃣ VERIFICANDO DATOS ACTUALES DEL USUARIO...');
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('*, user_plans(*)')
      .eq('id', signInData.user.id)
      .single();

    if (userError) {
      console.error('❌ Error obteniendo datos del usuario:', userError.message);
      return;
    }

    console.log(`📊 Plan actual: ${currentUser.user_plans?.name || 'N/A'}`);
    console.log(`💰 Créditos actuales: ${currentUser.credits}`);
    console.log('');

    // Step 5: Update user plan
    console.log('4️⃣ ACTUALIZANDO PLAN DEL USUARIO...');
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        plan_id: targetPlan.id,
        credits: targetPlan.credits_per_month
      })
      .eq('id', signInData.user.id)
      .select('*, user_plans(*)')
      .single();

    if (updateError) {
      console.error('❌ Error actualizando plan:', updateError.message);
      return;
    }

    console.log('✅ Plan actualizado exitosamente!');
    console.log(`📊 Nuevo plan: ${updatedUser.user_plans.name}`);
    console.log(`💰 Nuevos créditos: ${updatedUser.credits}`);
    console.log('');

    // Step 6: Verify the change
    console.log('5️⃣ VERIFICANDO CAMBIO...');
    const { data: verifyUser, error: verifyError } = await supabase
      .from('users')
      .select('*, user_plans(*)')
      .eq('id', signInData.user.id)
      .single();

    if (verifyError) {
      console.error('❌ Error verificando cambio:', verifyError.message);
      return;
    }

    console.log('🎉 CAMBIO COMPLETADO EXITOSAMENTE:');
    console.log('==================================');
    console.log(`👤 Usuario: ${verifyUser.email}`);
    console.log(`📊 Plan: ${verifyUser.user_plans.name}`);
    console.log(`💰 Precio: $${verifyUser.user_plans.price}/mes`);
    console.log(`🎯 Créditos: ${verifyUser.credits}`);
    console.log(`📅 Actualizado: ${verifyUser.updated_at}`);
    console.log('');

    console.log('✨ ¡El usuario ahora tiene acceso al plan AGENCIA!');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

changeUserPlan();
