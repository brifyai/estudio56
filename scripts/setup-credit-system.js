/**
 * Script para configurar el sistema de créditos en Supabase
 * Ejecutar: node scripts/setup-credit-system.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno');
  console.log('Necesitas:');
  console.log('  - VITE_SUPABASE_URL');
  console.log('  - SUPABASE_SERVICE_KEY (o SERVICE_KEY)');
  console.log('\nPuedes obtener la Service Key desde:');
  console.log('  Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const creditSystemSQL = `
-- ============================================
-- SISTEMA DE CRÉDITOS - FUNCIONES RPC Y TABLAS
-- ============================================

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('usage', 'purchase', 'bonus', 'reset')),
    amount INTEGER NOT NULL,
    credit_type VARCHAR(50) NOT NULL,
    description TEXT,
    reference_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);

-- Create credit_summary view
CREATE OR REPLACE VIEW credit_summary AS
SELECT 
    u.id AS user_id,
    u.credits AS current_credits,
    COALESCE(up.credits_per_month, 5) AS monthly_limit,
    COALESCE(
        (SELECT SUM(ABS(ct.amount)) 
         FROM credit_transactions ct 
         WHERE ct.user_id = u.id 
         AND ct.type = 'usage'
         AND ct.created_at >= date_trunc('month', NOW())
        ), 0
    ) AS total_used_this_month,
    GREATEST(0, COALESCE(up.credits_per_month, 5) - COALESCE(
        (SELECT SUM(ABS(ct.amount)) 
         FROM credit_transactions ct 
         WHERE ct.user_id = u.id 
         AND ct.type = 'usage'
         AND ct.created_at >= date_trunc('month', NOW())
        ), 0
    )) AS remaining_this_month,
    u.last_credit_reset
FROM users u
LEFT JOIN user_plans up ON u.plan_id = up.id;

-- ============================================
-- FUNCIONES RPC
-- ============================================

-- Function: can_use_credit
-- Check if user has enough credits to use
CREATE OR REPLACE FUNCTION can_use_credit(
    user_uuid UUID,
    credit_type VARCHAR(50),
    amount_needed INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
    monthly_limit INTEGER;
    used_this_month INTEGER;
BEGIN
    -- Get current credits from users table
    SELECT credits INTO current_credits FROM users WHERE id = user_uuid;
    
    -- Get monthly limit from plan
    SELECT COALESCE(up.credits_per_month, 5) INTO monthly_limit
    FROM users u
    LEFT JOIN user_plans up ON u.plan_id = up.id
    WHERE u.id = user_uuid;
    
    -- Get used this month
    SELECT COALESCE(SUM(ABS(amount)), 0) INTO used_this_month
    FROM credit_transactions
    WHERE user_id = user_uuid
    AND type = 'usage'
    AND created_at >= date_trunc('month', NOW());
    
    -- Check if user has enough credits and hasn't exceeded monthly limit
    RETURN current_credits >= amount_needed AND (used_this_month + amount_needed) <= monthly_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: deduct_credit
-- Deduct credits when used
CREATE OR REPLACE FUNCTION deduct_credit(
    user_uuid UUID,
    credit_type VARCHAR(50),
    amount INTEGER DEFAULT 1,
    description TEXT DEFAULT NULL,
    reference_id VARCHAR(255) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    success BOOLEAN := FALSE;
BEGIN
    -- Check if user can use credits first
    IF can_use_credit(user_uuid, credit_type, amount) THEN
        -- Update user credits
        UPDATE users 
        SET credits = credits - amount, 
            updated_at = NOW()
        WHERE id = user_uuid;
        
        -- Record transaction
        INSERT INTO credit_transactions (user_id, type, amount, credit_type, description, reference_id)
        VALUES (user_uuid, 'usage', -amount, credit_type, description, reference_id);
        
        success := TRUE;
    END IF;
    
    RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: add_credits
-- Add credits to user account
CREATE OR REPLACE FUNCTION add_credits(
    user_uuid UUID,
    credit_type VARCHAR(50),
    amount INTEGER,
    transaction_type VARCHAR(20),
    description TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Update user credits
    UPDATE users 
    SET credits = credits + amount, 
        updated_at = NOW()
    WHERE id = user_uuid;
    
    -- Record transaction
    INSERT INTO credit_transactions (user_id, type, amount, credit_type, description)
    VALUES (user_uuid, transaction_type, amount, credit_type, description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: get_monthly_credit_usage
-- Get monthly usage by credit type
CREATE OR REPLACE FUNCTION get_monthly_credit_usage(user_uuid UUID)
RETURNS TABLE (
    credit_type VARCHAR(50),
    total_used INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ct.credit_type,
        COALESCE(SUM(ABS(ct.amount)), 0)::INTEGER AS total_used
    FROM credit_transactions ct
    WHERE ct.user_id = user_uuid
    AND ct.type = 'usage'
    AND ct.created_at >= date_trunc('month', NOW())
    GROUP BY ct.credit_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on credit_transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view own transactions
CREATE POLICY "Users can view own credit transactions" ON credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- System can insert transactions (for RPC functions)
CREATE POLICY "System can insert credit transactions" ON credit_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
`;

async function setupCreditSystem() {
  console.log('🔧 Configurando sistema de créditos en Supabase...\n');

  try {
    console.log('📋 Ejecutando SQL del sistema de créditos...');
    
    const { error } = await supabase.rpc('exec_sql', { sql: creditSystemSQL });
    
    if (error) {
      // Try direct SQL execution
      const { error: sqlError } = await supabase.from('user_plans').select('*').limit(1);
      
      if (sqlError) {
        console.error('❌ Error conectando a Supabase:', sqlError);
        process.exit(1);
      }
    }

    console.log('✅ Sistema de créditos configurado correctamente!');
    console.log('\n📋 Lo que se creó:');
    console.log('  - Tabla: credit_transactions');
    console.log('  - Vista: credit_summary');
    console.log('  - Función RPC: can_use_credit');
    console.log('  - Función RPC: deduct_credit');
    console.log('  - Función RPC: add_credits');
    console.log('  - Función RPC: get_monthly_credit_usage');
    console.log('  - Políticas RLS para credit_transactions');
    
    console.log('\n💡 Si hubo errores, ejecuta el SQL manualmente en:');
    console.log('   Supabase Dashboard > SQL Editor > database/credit-system.sql');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Ejecuta el SQL manualmente en Supabase SQL Editor:');
    console.log('   database/credit-system.sql');
    process.exit(1);
  }
}

setupCreditSystem();