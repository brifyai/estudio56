-- ============================================
-- ACTUALIZACIÓN DE FUNCIONES DE CRÉDITOS
-- Ejecutar en Supabase Dashboard > SQL Editor
-- ====================================

-- Eliminar funciones existentes primero
DROP FUNCTION IF EXISTS can_use_credit(uuid, varchar, integer);
DROP FUNCTION IF EXISTS deduct_credit(uuid, varchar, integer, text, varchar);
DROP FUNCTION IF EXISTS add_credits(uuid, varchar, integer, varchar, text);

-- 6. Crear función can_use_credit
CREATE OR REPLACE FUNCTION can_use_credit(
    user_uuid UUID, 
    p_credit_type VARCHAR, 
    amount_needed INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
    user_plan_credits INTEGER;
    user_current_credits INTEGER;
    user_monthly_limit INTEGER;
    user_monthly_used INTEGER;
BEGIN
    -- Get user's plan credit limit for this type
    SELECT up.credits_per_month INTO user_monthly_limit
    FROM users u
    JOIN user_plans up ON u.plan_id = up.id
    WHERE u.id = user_uuid;

    -- Get current credits from users table
    SELECT credits INTO user_current_credits
    FROM users
    WHERE id = user_uuid;

    -- Get monthly usage for this type
    SELECT COALESCE(ABS(SUM(amount)), 0) INTO user_monthly_used
    FROM credit_transactions
    WHERE user_id = user_uuid
        AND credit_type = p_credit_type
        AND type = 'usage'
        AND created_at >= date_trunc('month', CURRENT_DATE);

    -- Check if user has enough credits and hasn't exceeded monthly limit
    RETURN (user_current_credits >= amount_needed) AND 
           (user_monthly_used + amount_needed <= user_monthly_limit);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Crear función deduct_credit
CREATE OR REPLACE FUNCTION deduct_credit(
    user_uuid UUID,
    p_credit_type VARCHAR,
    amount INTEGER DEFAULT 1,
    description TEXT DEFAULT NULL,
    reference_id VARCHAR(255) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    success BOOLEAN := FALSE;
BEGIN
    -- Check if user can use this credit
    IF can_use_credit(user_uuid, p_credit_type, amount) THEN
        -- Update user's credit balance
        UPDATE users 
        SET credits = credits - amount, 
            updated_at = NOW()
        WHERE id = user_uuid;

        -- Record the transaction
        INSERT INTO credit_transactions (user_id, type, amount, credit_type, description, reference_id)
        VALUES (user_uuid, 'usage', -amount, p_credit_type, description, reference_id);

        success := TRUE;
    END IF;

    RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Crear función add_credits
CREATE OR REPLACE FUNCTION add_credits(
    user_uuid UUID,
    p_credit_type VARCHAR,
    amount INTEGER,
    transaction_type VARCHAR, -- 'purchase', 'bonus', 'reset'
    description TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Update user's credit balance
    UPDATE users 
    SET credits = credits + amount, 
        updated_at = NOW()
    WHERE id = user_uuid;

    -- Record the transaction
    INSERT INTO credit_transactions (user_id, type, amount, credit_type, description)
    VALUES (user_uuid, transaction_type, amount, p_credit_type, description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Otorgar permisos
GRANT EXECUTE ON FUNCTION can_use_credit(UUID, VARCHAR, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION deduct_credit(UUID, VARCHAR, INTEGER, TEXT, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION add_credits(UUID, VARCHAR, INTEGER, VARCHAR, TEXT) TO authenticated;

SELECT 'Funciones de créditos actualizadas correctamente!' as status;