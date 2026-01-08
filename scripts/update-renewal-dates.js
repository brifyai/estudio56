import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

console.log(`📡 Conectando a: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateRenewalDates() {
  try {
    console.log('🚀 Actualizando fechas de renovación...\n');

    // Get all subscriptions without next_payment_date
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .is('next_payment_date', null);

    if (error) {
      console.error('❌ Error fetching subscriptions:', error);
      process.exit(1);
    }

    console.log(`📋 Encontradas ${subscriptions?.length || 0} suscripciones sin fecha de renovación\n`);

    if (subscriptions && subscriptions.length > 0) {
      for (const sub of subscriptions) {
        // Calculate next payment date (30 days from now)
        const nextPaymentDate = new Date();
        nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ next_payment_date: nextPaymentDate.toISOString() })
          .eq('id', sub.id);

        if (updateError) {
          console.error(`❌ Error actualizando suscripción ${sub.id}:`, updateError);
        } else {
          console.log(`✅ Suscripción ${sub.id}: Próxima renovación = ${nextPaymentDate.toLocaleDateString('es-CL')}`);
        }
      }
    } else {
      console.log('✅ No hay suscripciones sin fecha de renovación');
    }

    // Also update subscriptions with empty string
    const { data: emptySubscriptions, error: emptyError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('next_payment_date', '');

    if (!emptyError && emptySubscriptions && emptySubscriptions.length > 0) {
      console.log(`\n📋 Actualizando ${emptySubscriptions.length} suscripciones con fecha vacía...\n`);
      
      for (const sub of emptySubscriptions) {
        const nextPaymentDate = new Date();
        nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ next_payment_date: nextPaymentDate.toISOString() })
          .eq('id', sub.id);

        if (updateError) {
          console.error(`❌ Error actualizando suscripción ${sub.id}:`, updateError);
        } else {
          console.log(`✅ Suscripción ${sub.id}: Próxima renovación = ${nextPaymentDate.toLocaleDateString('es-CL')}`);
        }
      }
    }

    console.log('\n🎉 Proceso completado!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateRenewalDates();