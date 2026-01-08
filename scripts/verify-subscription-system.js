import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Usar las variables de entorno directamente
const SUPABASE_URL = 'https://zskunemvffyqyxtfqyzm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_84vvQOL-JXB-abcAu95FFQ_mvzewpPK';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verifySubscriptionSystem() {
  console.log('🔍 Verificando sistema de suscripciones...\n');

  // 1. Verificar planes
  console.log('📋 PLANES:');
  const { data: plans, error: plansError } = await supabase
    .from('user_plans')
    .select('id, name, price, credits_per_month')
    .order('price');

  if (plansError) {
    console.error('❌ Error al obtener planes:', plansError.message);
  } else if (!plans || plans.length === 0) {
    console.log('⚠️ No hay planes en la tabla user_plans');
  } else {
    plans.forEach(plan => {
      console.log(`  ✅ ${plan.name}: $${plan.price} (${plan.credits_per_month} créditos/mes)`);
      console.log(`     UUID: ${plan.id}`);
    });
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // 2. Verificar suscripciones activas
  console.log('📋 SUSCRIPCIONES:');
  const { data: subscriptions, error: subsError } = await supabase
    .from('subscriptions')
    .select('*, users(email)')
    .order('created_at', { ascending: false })
    .limit(10);

  if (subsError) {
    console.error('❌ Error al obtener suscripciones:', subsError.message);
    console.log('ℹ️ La tabla subscriptions puede no existir aún');
  } else if (!subscriptions || subscriptions.length === 0) {
    console.log('⚠️ No hay suscripciones registradas');
  } else {
    subscriptions.forEach(sub => {
      console.log(`  ✅ Suscripción: ${sub.plan_id} - Estado: ${sub.status}`);
      console.log(`     Usuario: ${sub.users?.email || 'N/A'}`);
      console.log(`     MP Preapproval ID: ${sub.mp_preapproval_id?.substring(0, 20)}...`);
    });
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // 3. Verificar usuarios con planes pagados
  console.log('📋 USUARIOS CON PLANES PAGADOS:');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('email, plan_id, subscription_status, credits')
    .not('plan_id', 'eq', 'GRATIS')
    .limit(10);

  if (usersError) {
    console.error('❌ Error al obtener usuarios:', usersError.message);
  } else if (!users || users.length === 0) {
    console.log('⚠️ No hay usuarios con planes pagados');
  } else {
    users.forEach(user => {
      console.log(`  ✅ ${user.email}`);
      console.log(`     Plan: ${user.plan_id}`);
      console.log(`     Estado suscripción: ${user.subscription_status}`);
      console.log(`     Créditos: ${user.credits}`);
    });
  }

  console.log('\n✅ Verificación completada');
}

verifySubscriptionSystem().catch(console.error);