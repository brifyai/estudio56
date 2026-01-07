import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function checkPlans() {
  console.log('🔍 Verificando planes en Supabase...\n');
  
  const { data, error } = await supabase
    .from('user_plans')
    .select('id, name, price, credits_per_month')
    .order('price');

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('⚠️ No hay planes en la tabla user_plans');
    return;
  }

  console.log('✅ Planes encontrados:\n');
  data.forEach(plan => {
    console.log(`  - ${plan.name}: $${plan.price} (${plan.credits_per_month} créditos)`);
    console.log(`    UUID: ${plan.id}`);
  });
}

checkPlans();