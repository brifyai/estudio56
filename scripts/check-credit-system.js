import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Faltan las variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCreditSystem() {
  console.log('🔍 Verificando sistema de créditos...\n');
  
  try {
    // Check if credit_transactions table exists
    console.log('1. Verificando tabla credit_transactions...');
    const { data: transactionsTable, error: tableError } = await supabase
      .from('credit_transactions')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Tabla credit_transactions NO existe:', tableError.message);
    } else {
      console.log('✅ Tabla credit_transactions existe');
    }
    
    // Check if users table has credits column
    console.log('\n2. Verificando columna credits en tabla users...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, credits, plan_id')
      .limit(1);
    
    if (usersError) {
      console.log('❌ Error accediendo a users:', usersError.message);
    } else {
      console.log('✅ Tabla users accesible');
      if (usersData && usersData.length > 0) {
        console.log('   Usuario de ejemplo:', JSON.stringify(usersData[0], null, 2));
      }
    }
    
    // Check functions with correct parameter order
    console.log('\n3. Verificando funciones RPC...');
    
    // Test can_use_credit function with correct parameter names
    try {
      const { data: canUse, error: canUseError } = await supabase
        .rpc('can_use_credit', { 
          user_uuid: '00000000-0000-0000-0000-000000000000', 
          p_credit_type: 'draft', 
          amount_needed: 1 
        });
      
      if (canUseError) {
        console.log('❌ Función can_use_credit:', canUseError.message);
      } else {
        console.log('✅ Función can_use_credit existe y responde:', canUse);
      }
    } catch (e) {
      console.log('❌ Error verificando can_use_credit:', e.message);
    }
    
    // Test deduct_credit function
    try {
      const { data: deduct, error: deductError } = await supabase
        .rpc('deduct_credit', { 
          user_uuid: '00000000-0000-0000-0000-000000000000', 
          p_credit_type: 'draft', 
          amount: 1, 
          description: null, 
          reference_id: null 
        });
      
      if (deductError) {
        console.log('❌ Función deduct_credit:', deductError.message);
      } else {
        console.log('✅ Función deduct_credit existe y responde:', deduct);
      }
    } catch (e) {
      console.log('❌ Error verificando deduct_credit:', e.message);
    }
    
    // Test add_credits function
    try {
      const { data: add, error: addError } = await supabase
        .rpc('add_credits', { 
          user_uuid: '00000000-0000-0000-0000-000000000000', 
          p_credit_type: 'draft', 
          amount: 1, 
          transaction_type: 'bonus', 
          description: null 
        });
      
      if (addError) {
        console.log('❌ Función add_credits:', addError.message);
      } else {
        console.log('✅ Función add_credits existe');
      }
    } catch (e) {
      console.log('❌ Error verificando add_credits:', e.message);
    }
    
    console.log('\n📋 RESUMEN:');
    console.log('   Si todas las funciones muestran ✅, el sistema de créditos está listo!');
    console.log('   El servidor debe estar corriendo en http://localhost:3000/');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

checkCreditSystem();