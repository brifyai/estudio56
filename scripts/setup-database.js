import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Available variables:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));
  console.log('Please check your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');
    console.log(`📡 Connecting to: ${supabaseUrl}`);
    
    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('user_plans')
      .select('count')
      .limit(1);
    
    if (testError && testError.code !== 'PGRST116') { // PGRST116 = table doesn't exist
      console.error('❌ Connection test failed:', testError);
      process.exit(1);
    }
    
    console.log('✅ Connection successful!');
    
    // Read the SQL schema
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath);
      process.exit(1);
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Schema loaded, size:', schema.length, 'characters');
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔧 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        if (error && error.code !== '42P07') { // 42P07 = already exists
          console.warn(`⚠️  Statement ${i + 1} warning:`, error.message);
        }
      } catch (err) {
        console.warn(`⚠️  Statement ${i + 1} failed:`, err.message);
      }
    }
    
    console.log('✅ Database setup completed!');
    
    // Verify tables were created
    const { data: plans, error: plansError } = await supabase
      .from('user_plans')
      .select('*');
    
    if (plansError) {
      console.warn('⚠️  Could not verify user_plans table:', plansError.message);
    } else {
      console.log('✅ user_plans table verified! Plans found:', plans?.length || 0);
      if (plans && plans.length > 0) {
        plans.forEach(plan => {
          console.log(`   - ${plan.name}: $${plan.price}/month, ${plan.credits_per_month} credits`);
        });
      }
    }
    
    // Test other tables
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (usersError) {
      console.warn('⚠️  Could not verify users table:', usersError.message);
    } else {
      console.log('✅ users table verified!');
    }
    
    const { data: flyers, error: flyersError } = await supabase
      .from('flyers')
      .select('count')
      .limit(1);
    
    if (flyersError) {
      console.warn('⚠️  Could not verify flyers table:', flyersError.message);
    } else {
      console.log('✅ flyers table verified!');
    }
    
    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Check your Supabase dashboard to verify tables were created');
    console.log('2. Test the application functionality');
    console.log('3. Configure authentication if needed');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();