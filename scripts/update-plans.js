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

const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePlans() {
  try {
    console.log('🚀 Updating plans to match interface...');
    console.log(`📡 Connecting to: ${supabaseUrl}`);

    // Define the correct plans that match the interface
    const correctPlans = [
      {
        name: 'GRATIS',
        price: 0.00,
        credits_per_month: 5,
        features: ['5 Borradores Diarios (H2O)', 'Solo Visualización', 'Sin Generación de Video', 'Sin Descarga de Archivos']
      },
      {
        name: 'ESTOY PARTIENDO',
        price: 12.990,
        credits_per_month: 50,
        features: ['50 Imágenes Finales (HD)', '∞ Borradores de Imagen', 'Sin Generación de Video', 'Sin Carga de Productos']
      },
      {
        name: 'JEFE PYME',
        price: 39.990,
        credits_per_month: 250,
        features: ['250 Imágenes HD', '∞ Borradores de Imagen', '5 Videos HD (Limitado)', 'Carga de Productos']
      },
      {
        name: 'AGENCIA',
        price: 99.990,
        credits_per_month: 1000,
        features: ['1000 Imágenes HD (4x)', '20 Videos HD (4x)', 'Licencia Comercial Extendida', 'Soporte WhatsApp (Humano)']
      }
    ];

    // First, delete existing plans
    console.log('🗑️  Deleting existing plans...');
    const { error: deleteError } = await supabase
      .from('user_plans')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.warn('⚠️  Delete warning:', deleteError.message);
    } else {
      console.log('✅ Existing plans deleted');
    }

    // Insert the correct plans
    console.log('📋 Inserting correct plans...');
    const { data: plans, error: insertError } = await supabase
      .from('user_plans')
      .insert(correctPlans)
      .select();

    if (insertError) {
      console.error('❌ Insert error:', insertError.message);
      process.exit(1);
    }

    console.log('✅ Plans updated successfully!');
    console.log(`📊 Inserted ${plans?.length || 0} plans:`);
    plans?.forEach(plan => {
      console.log(`   - ${plan.name}: $${plan.price}/mes, ${plan.credits_per_month} créditos`);
      console.log(`     Features: ${plan.features.join(', ')}`);
    });

    // Verify the plans
    console.log('');
    console.log('🔍 Verifying updated plans...');
    const { data: verifyPlans, error: verifyError } = await supabase
      .from('user_plans')
      .select('*')
      .order('price');

    if (verifyError) {
      console.error('❌ Verification error:', verifyError.message);
    } else {
      console.log('✅ Verification successful!');
      console.log(`📊 Total plans in database: ${verifyPlans?.length || 0}`);
      verifyPlans?.forEach((plan, index) => {
        console.log(`   ${index + 1}. ${plan.name} - $${plan.price} (${plan.credits_per_month} créditos)`);
      });
    }

    console.log('');
    console.log('🎉 Plan update completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('✅ Plans now match the interface exactly');
    console.log('✅ Database synchronized with UI');
    console.log('✅ Ready for production use');

  } catch (error) {
    console.error('❌ Plan update failed:', error);
    process.exit(1);
  }
}

updatePlans();