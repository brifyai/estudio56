-- ============================================
-- SISTEMA DE CRÉDITOS PARA ESTUDIO 56
-- ============================================

-- 1. Create credit_transactions table to track all credit movements
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'usage', 'purchase', 'bonus', 'reset'
    amount INTEGER NOT NULL, -- Negative for usage, positive for purchase/bonus
    credit_type VARCHAR(50) NOT NULL, -- 'draft', 'final_image', 'video', 'product_upload'
    description TEXT,
    reference_id VARCHAR(255), -- Reference to generated content (flyer_id, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for credit transactions
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(type);

-- 3. Enable RLS for credit_transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies for credit_transactions
CREATE POLICY "Users can view own credit transactions" ON credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own credit transactions" ON credit_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Create function to get current month credit usage
CREATE OR REPLACE FUNCTION get_monthly_credit_usage(user_uuid UUID)
RETURNS TABLE (credit_type VARCHAR, total_used INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ct.credit_type,
        ABS(SUM(ct.amount))::INTEGER as total_used
    FROM credit_transactions ct
    WHERE ct.user_id = user_uuid
        AND ct.type = 'usage'
        AND ct.created_at >= date_trunc('month', CURRENT_DATE)
    GROUP BY ct.credit_type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create function to check if user can use credit
CREATE OR REPLACE FUNCTION can_use_credit(
    user_uuid UUID, 
    credit_type VARCHAR, 
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
        AND credit_type = credit_type
        AND type = 'usage'
        AND created_at >= date_trunc('month', CURRENT_DATE);

    -- Check if user has enough credits and hasn't exceeded monthly limit
    RETURN (user_current_credits >= amount_needed) AND 
           (user_monthly_used + amount_needed <= user_monthly_limit);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create function to deduct credits when used
CREATE OR REPLACE FUNCTION deduct_credit(
    user_uuid UUID,
    credit_type VARCHAR,
    amount INTEGER DEFAULT 1,
    description TEXT DEFAULT NULL,
    reference_id VARCHAR(255) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    success BOOLEAN := FALSE;
BEGIN
    -- Check if user can use this credit
    IF can_use_credit(user_uuid, credit_type, amount) THEN
        -- Update user's credit balance
        UPDATE users 
        SET credits = credits - amount, 
            updated_at = NOW()
        WHERE id = user_uuid;

        -- Record the transaction
        INSERT INTO credit_transactions (user_id, type, amount, credit_type, description, reference_id)
        VALUES (user_uuid, 'usage', -amount, credit_type, description, reference_id);

        success := TRUE;
    END IF;

    RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create function to add credits (for purchases, bonuses, resets)
CREATE OR REPLACE FUNCTION add_credits(
    user_uuid UUID,
    credit_type VARCHAR,
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
    VALUES (user_uuid, transaction_type, amount, credit_type, description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create function to reset monthly credits (run via cron or manually)
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS VOID AS $$
DECLARE
    user_record RECORD;
    plan_credits INTEGER;
BEGIN
    FOR user_record IN 
        SELECT u.id, up.credits_per_month 
        FROM users u
        JOIN user_plans up ON u.plan_id = up.id
        WHERE up.credits_per_month > 0
    LOOP
        -- Add credits back to user's balance
        UPDATE users 
        SET credits = user_record.credits_per_month,
            last_credit_reset = CURRENT_DATE,
            updated_at = NOW()
        WHERE id = user_record.id;

        -- Record the reset
        INSERT INTO credit_transactions (user_id, type, amount, credit_type, description)
        VALUES (
            user_record.id, 
            'reset', 
            user_record.credits_per_month, 
            'all',
            'Reset mensual de créditos'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create view for credit summary
CREATE OR REPLACE VIEW credit_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.credits as current_credits,
    up.name as plan_name,
    up.credits_per_month as monthly_limit,
    COALESCE(SUM(CASE WHEN ct.type = 'usage' THEN ABS(ct.amount) ELSE 0 END), 0) as total_used_this_month,
    up.credits_per_month - COALESCE(SUM(CASE WHEN ct.type = 'usage' AND ct.created_at >= date_trunc('month', CURRENT_DATE) THEN ABS(ct.amount) ELSE 0 END), 0) as remaining_this_month,
    u.last_credit_reset
FROM users u
LEFT JOIN user_plans up ON u.plan_id = up.id
LEFT JOIN credit_transactions ct ON u.id = ct.user_id AND ct.created_at >= date_trunc('month', CURRENT_DATE)
GROUP BY u.id, u.email, u.credits, up.name, up.credits_per_month, u.last_credit_reset;

-- 11. Grant execute on functions
GRANT EXECUTE ON FUNCTION get_monthly_credit_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION can_use_credit(UUID, VARCHAR, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION deduct_credit(UUID, VARCHAR, INTEGER, TEXT, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION add_credits(UUID, VARCHAR, INTEGER, VARCHAR, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION reset_monthly_credits() TO authenticated;

-- 12. Verify the setup
SELECT 'Credit system created successfully!' as status;