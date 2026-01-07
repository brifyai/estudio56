-- ============================================
-- TABLE: credit_recharges
-- Para tracking de compras de créditos sueltos
-- ============================================

CREATE TABLE IF NOT EXISTS credit_recharges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    recharge_type VARCHAR(50) NOT NULL CHECK (recharge_type IN ('INDIVIDUAL', 'SALVATORE', 'IMPULSO')),
    credits_hd INTEGER NOT NULL DEFAULT 0,
    drafts INTEGER NOT NULL DEFAULT 0,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    mercadopago_preference_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_credit_recharges_user_id ON credit_recharges(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_recharges_created_at ON credit_recharges(created_at);
CREATE INDEX IF NOT EXISTS idx_credit_recharges_status ON credit_recharges(status);

-- Enable RLS
ALTER TABLE credit_recharges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own recharges" ON credit_recharges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own recharges" ON credit_recharges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_credit_recharges_updated_at ON credit_recharges;
CREATE TRIGGER update_credit_recharges_updated_at
    BEFORE UPDATE ON credit_recharges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default recharge types as reference data
-- Note: This is just for reference, actual recharges are tracked per user