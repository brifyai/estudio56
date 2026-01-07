-- ============================================
-- TABLA DE PAGOS - MERCADOPAGO
-- ============================================

-- Crear tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES user_plans(id),
    
    -- Información de MercadoPago
    mp_payment_id VARCHAR(255) UNIQUE,
    mp_preference_id VARCHAR(255),
    mp_status VARCHAR(50), -- approved, pending, rejected, cancelled, refunded
    
    -- Detalles del pago
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CLP',
    payment_method VARCHAR(100),
    
    -- Metadata
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    metadata JSONB, -- Información adicional de MercadoPago
    
    -- Timestamps
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_mp_payment_id ON payments(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Habilitar RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert payments" ON payments
    FOR INSERT WITH CHECK (true); -- Webhooks necesitan insertar

CREATE POLICY "System can update payments" ON payments
    FOR UPDATE USING (true); -- Webhooks necesitan actualizar

-- Comentarios
COMMENT ON TABLE payments IS 'Registro de pagos realizados por usuarios a través de MercadoPago';
COMMENT ON COLUMN payments.mp_payment_id IS 'ID del pago en MercadoPago';
COMMENT ON COLUMN payments.mp_preference_id IS 'ID de la preferencia de pago en MercadoPago';
COMMENT ON COLUMN payments.mp_status IS 'Estado del pago según MercadoPago';
COMMENT ON COLUMN payments.status IS 'Estado interno del pago';
COMMENT ON COLUMN payments.metadata IS 'Información adicional del pago en formato JSON';

-- Verificar creación
SELECT 'Tabla payments creada exitosamente' as status;
