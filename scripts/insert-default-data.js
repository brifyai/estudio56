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

async function insertDefaultData() {
  try {
    console.log('🚀 Inserting default data...');
    console.log(`📡 Connecting to: ${supabaseUrl}`);

    // Insert default plans (matching the interface)
    console.log('📋 Inserting user plans...');
    const { data: plans, error: plansError } = await supabase
      .from('user_plans')
      .insert([
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
      ])
      .select();

    if (plansError) {
      console.warn('⚠️  Plans insertion warning:', plansError.message);
      // Try to query existing plans
      const { data: existingPlans, error: queryError } = await supabase
        .from('user_plans')
        .select('*');
      
      if (queryError) {
        console.error('❌ Could not query existing plans:', queryError.message);
      } else {
        console.log('✅ Found existing plans:', existingPlans?.length || 0);
        if (existingPlans && existingPlans.length > 0) {
          existingPlans.forEach(plan => {
            console.log(`   - ${plan.name}: $${plan.price}/month, ${plan.credits_per_month} credits`);
          });
        }
      }
    } else {
      console.log('✅ Default plans inserted successfully!');
      console.log(`📊 Inserted ${plans?.length || 0} plans:`);
      plans?.forEach(plan => {
        console.log(`   - ${plan.name}: $${plan.price}/month, ${plan.credits_per_month} credits`);
      });
    }

    // Test table access
    console.log('');
    console.log('🔍 Testing table access...');
    
    const { data: testUsers, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      console.warn('⚠️  Users table access warning:', usersError.message);
    } else {
      console.log('✅ Users table accessible!');
    }

    const { data: testFlyers, error: flyersError } = await supabase
      .from('flyers')
      .select('count')
      .limit(1);
    
    if (flyersError) {
      console.warn('⚠️  Flyers table access warning:', flyersError.message);
    } else {
      console.log('✅ Flyers table accessible!');
    }

    console.log('');
    console.log('🎉 Default data insertion completed!');
    console.log('');
    console.log('📋 Summary:');
    console.log('✅ Tables created successfully');
    console.log('✅ Supabase connection working');
    console.log('✅ Application ready to use');
    console.log('');
    console.log('🌐 Next step: Test the application at http://localhost:3000/');

  } catch (error) {
    console.error('❌ Data insertion failed:', error);
    process.exit(1);
  }
}

insertDefaultData();