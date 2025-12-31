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

async function createTables() {
  try {
    console.log('🚀 Creating database tables...');
    console.log(`📡 Connecting to: ${supabaseUrl}`);

    // Create user_plans table
    console.log('📋 Creating user_plans table...');
    const { error: plansError } = await supabase
      .from('user_plans')
      .insert([
        {
          name: 'GRATIS',
          price: 0.00,
          credits_per_month: 5,
          features: ['Generación básica', 'Calidad borrador']
        },
        {
          name: 'BASICO',
          price: 9.99,
          credits_per_month: 50,
          features: ['Generación ilimitada', 'Calidad HD', 'Exportación']
        },
        {
          name: 'PROFESIONAL',
          price: 19.99,
          credits_per_month: 200,
          features: ['Todo incluido', 'Videos', 'Estilos premium', 'Soporte prioritario']
        }
      ])
      .select();

    if (plansError && plansError.code !== '23505') { // 23505 = unique violation
      console.warn('⚠️  user_plans creation warning:', plansError.message);
    } else {
      console.log('✅ user_plans table created/verified!');
    }

    // Test connection by trying to query the table
    const { data: testPlans, error: testError } = await supabase
      .from('user_plans')
      .select('*');

    if (testError) {
      console.warn('⚠️  Could not query user_plans:', testError.message);
      console.log('💡 This might be normal if tables need to be created via SQL console');
    } else {
      console.log('✅ user_plans table accessible!');
      console.log(`📊 Found ${testPlans?.length || 0} plans:`);
      testPlans?.forEach(plan => {
        console.log(`   - ${plan.name}: $${plan.price}/month, ${plan.credits_per_month} credits`);
      });
    }

    console.log('');
    console.log('🎉 Table creation process completed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. If tables were not created automatically, run the SQL schema manually in Supabase SQL Editor');
    console.log('2. The schema is available in database/schema.sql');
    console.log('3. Test the application functionality');
    console.log('');
    console.log('🔗 Supabase Dashboard: https://supabase.com/dashboard');
    console.log(`📍 Project URL: ${supabaseUrl}`);

  } catch (error) {
    console.error('❌ Table creation failed:', error);
    console.log('');
    console.log('💡 Manual setup instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of database/schema.sql');
    console.log('4. Execute the SQL to create all tables');
    process.exit(1);
  }
}

createTables();