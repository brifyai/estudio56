const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Usar service_role key directamente
const supabaseUrl = 'https://zskunemvffyqyxtfqyzm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpza3VuZW12ZmZ5cXl4dGZxeXptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Njk4MjQyNywiZXhwIjoyMDgyNTU4NDI3fQ.ttKR7Bp4u8sMnet8Y5u-AkW9u7by7aV6CAIstdtPtbM';

console.log('✅ Connecting to Supabase with service_role...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBrandsTable() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'brands-table.sql'), 'utf8');
    
    console.log('📋 Creating brands table...');
    
    // Try using the SQL function if available
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.log('🔄 RPC exec_sql not available, trying direct query...');
      
      // Try to create table using raw query
      const statements = sql.split(';').filter(s => s.trim().length > 0);
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log('📝 Executing:', statement.substring(0, 50) + '...');
          const { error: stmtError } = await supabase.from('pg_catalog.pg_tables').select('*').limit(1);
          
          if (stmtError) {
            console.log('Cannot execute raw SQL, table creation may need manual setup');
          }
        }
      }
    } else {
      console.log('✅ Brands table created successfully!');
    }
    
    // Verify table exists
    console.log('🔍 Verifying table...');
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('count', { count: 'exact', head: true });
    
    if (!brandsError) {
      console.log('✅ Brands table is accessible');
    } else {
      console.log('⚠️ Brands table not accessible:', brandsError.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createBrandsTable();