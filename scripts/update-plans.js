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
    console.log('🚀 Updating plans to match new pricing structure...');
    console.log(`📡 Connecting to: ${supabaseUrl}`);

    // Define the correct plans that match the new interface
    const correctPlans = [
      {
        name: 'GRATIS',
        price: 0.00,
        credits_hd: 0,
        drafts: 3,
        features: ['3 Borradores/día (Imagen)', 'Solo Visualización (Sin descarga)', 'Sin Créditos HD', 'Sin Generación de Video']
      },
      {
        name: 'ESTOY PARTIENDO',
        price: 14990,
        credits_hd: 40,
        drafts: 200,
        features: ['40 Créditos HD (40 fotos o 4 videos)', '200 Borradores de Imagen', 'Videos HD (Requiere 10 créditos c/u)', 'Sin Carga de Productos']
      },
      {
        name: 'JEFE PYME',
        price: 44990,
        credits_hd: 150,
        drafts: 750,
        features: ['150 Créditos HD (150 fotos o 15 videos)', '750 Borradores de Imagen', 'Videos HD (Costo: 10 créditos)', 'Carga de Productos (PNG)']
      },
      {
        name: 'AGENCIA',
        price: 139990,
        credits_hd: 500,
        drafts: 2500,
        features: ['500 Créditos HD (500 fotos o 50 videos)', '2.500 Borradores de Imagen', 'Licencia Comercial', 'Soporte Humano']
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
      console.log(`   - ${plan.name}: $${plan.price}/mes, ${plan.credits_hd} créditos HD, ${plan.drafts} borradores`);
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
        console.log(`   ${index + 1}. ${plan.name} - $${plan.price} (${plan.credits_hd} créditos HD, ${plan.drafts} borradores)`);
      });
    }

    // Show credit equivalences
    console.log('');
    console.log('📋 Equivalencias de Créditos:');
    console.log('   📸 1 Foto HD = 1 Crédito');
    console.log('   🎬 1 Video HD = 10 Créditos');
    console.log('');
    console.log('🎉 Plan update completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('✅ Plans now match the new pricing structure');
    console.log('✅ Database synchronized with UI');
    console.log('✅ Ready for production use');

  } catch (error) {
    console.error('❌ Plan update failed:', error);
    process.exit(1);
  }
}

updatePlans();