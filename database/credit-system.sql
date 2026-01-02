-- ============================================
-- SISTEMA DE CRÉDITOS - LIMPIEZA Y CREACIÓN
-- Ejecute este script en Supabase SQL Editor
-- ============================================

-- 0. Eliminar funciones existentes (para recrear con nuevos parámetros)
DROP FUNCTION IF EXISTS can_use_credit(uuid, varchar, integer);
DROP FUNCTION IF EXISTS deduct_credit(uuid, varchar, integer, text, varchar);
DROP FUNCTION IF EXISTS add_credits(uuid, varchar, integer, varchar, text);
DROP FUNCTION IF EXISTS get_monthly_credit_usage(uuid);

-- 1. Crear tabla credit_transactions (solo si no existe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_name = 'credit_transactions') THEN
        CREATE TABLE credit_transactions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            type VARCHAR(20) NOT NULL CHECK (type IN ('usage', 'purchase', 'bonus', 'reset')),
            amount INTEGER NOT NULL,
            credit_type VARCHAR(50) NOT NULL,
            description TEXT,
            reference_id VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        RAISE NOTICE 'Tabla credit_transactions creada';
    ELSE
        RAISE NOTICE 'Tabla credit_transactions ya existe';
    END IF;
END $$;

-- 2. Crear índices
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);

-- 3. Crear vista credit_summary (solo si no existe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.views 
                   WHERE table_name = 'credit_summary') THEN
        CREATE VIEW credit_summary AS
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
        RAISE NOTICE 'Vista credit_summary creada';
    ELSE
        RAISE NOTICE 'Vista credit_summary ya existe';
    END IF;
END $$;

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
    SELECT credits INTO current_credits FROM users WHERE id = user_uuid;
    
    SELECT COALESCE(up.credits_per_month, 5) INTO monthly_limit
    FROM users u
    LEFT JOIN user_plans up ON u.plan_id = up.id
    WHERE u.id = user_uuid;
    
    SELECT COALESCE(SUM(ABS(amount)), 0) INTO used_this_month
    FROM credit_transactions
    WHERE user_id = user_uuid
    AND type = 'usage'
    AND created_at >= date_trunc('month', NOW());
    
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
    IF can_use_credit(user_uuid, credit_type, amount) THEN
        UPDATE users 
        SET credits = credits - amount, 
            updated_at = NOW()
        WHERE id = user_uuid;
        
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
    UPDATE users 
    SET credits = credits + amount, 
        updated_at = NOW()
    WHERE id = user_uuid;
    
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

-- Enable RLS on credit_transactions (only if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policy WHERE polrelid = 'credit_transactions'::regclass::oid) THEN
        ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view own credit transactions" ON credit_transactions
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "System can insert credit transactions" ON credit_transactions
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        RAISE NOTICE 'RLS policies created for credit_transactions';
    ELSE
        RAISE NOTICE 'RLS policies already exist for credit_transactions';
    END IF;
END $$;

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT 'Funciones RPC' as status, count(*) as count FROM information_schema.routines 
WHERE routine_name IN ('can_use_credit', 'deduct_credit', 'add_credits', 'get_monthly_credit_usage')
AND routine_schema = 'public';