-- =====================================================
-- FUNCIONES RPC SEGURAS PARA GESTIÓN DE CRÉDITOS
-- =====================================================
-- Ejecutar este script en el SQL Editor de Supabase

-- =====================================================
-- PARTE 1: FUNCIONES RPC
-- =====================================================

-- Función para verificar si puede usar créditos
DROP FUNCTION IF EXISTS can_use_credit(UUID, TEXT, INTEGER);
CREATE OR REPLACE FUNCTION can_use_credit(
  p_user_id UUID,
  p_credit_type TEXT,
  p_amount_needed INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_credits INTEGER;
BEGIN
  SELECT credits INTO v_current_credits
  FROM users
  WHERE id = p_user_id;

  IF v_current_credits IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN v_current_credits >= p_amount_needed;
END;
$$;

-- Función para deducir créditos
DROP FUNCTION IF EXISTS deduct_credit(UUID, TEXT, INTEGER, TEXT, UUID);
CREATE OR REPLACE FUNCTION deduct_credit(
  p_user_id UUID,
  p_credit_type TEXT,
  p_amount INTEGER,
  p_description TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_credits INTEGER;
  v_new_credits INTEGER;
BEGIN
  SELECT credits INTO v_current_credits
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current_credits IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  IF v_current_credits < p_amount THEN
    RAISE EXCEPTION 'Créditos insuficientes';
  END IF;

  v_new_credits := v_current_credits - p_amount;
  
  UPDATE users
  SET credits = v_new_credits,
      updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO credit_transactions (
    user_id, type, amount, credit_type, description, reference_id
  ) VALUES (
    p_user_id, 'usage', -p_amount, p_credit_type, p_description, p_reference_id
  );

  RETURN TRUE;
END;
$$;

-- Función para agregar créditos
DROP FUNCTION IF EXISTS add_credits(UUID, TEXT, INTEGER, TEXT, TEXT);
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_credit_type TEXT,
  p_amount INTEGER,
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_credits INTEGER;
BEGIN
  SELECT credits INTO v_current_credits
  FROM users
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current_credits IS NULL THEN
    RAISE EXCEPTION 'Usuario no encontrado';
  END IF;

  UPDATE users
  SET credits = v_current_credits + p_amount,
      updated_at = NOW()
  WHERE id = p_user_id;

  INSERT INTO credit_transactions (
    user_id, type, amount, credit_type, description
  ) VALUES (
    p_user_id, p_transaction_type, p_amount, p_credit_type, p_description
  );
END;
$$;

-- Función para obtener uso mensual
DROP FUNCTION IF EXISTS get_monthly_credit_usage(UUID);
CREATE OR REPLACE FUNCTION get_monthly_credit_usage(p_user_id UUID)
RETURNS TABLE (credit_type TEXT, total_used INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ct.credit_type,
    SUM(ABS(ct.amount))::INTEGER AS total_used
  FROM credit_transactions ct
  WHERE ct.user_id = p_user_id
    AND ct.type = 'usage'
    AND ct.created_at >= date_trunc('month', NOW())
  GROUP BY ct.credit_type;
END;
$$;

-- =====================================================
-- PARTE 2: ELIMINAR POLÍTICA VULNERABLE
-- =====================================================

DROP POLICY IF EXISTS "Users can update own data" ON users;

-- =====================================================
-- PARTE 3: CREAR VISTA DE RESUMEN DE CRÉDITOS
-- =====================================================

DROP VIEW IF EXISTS credit_summary;
CREATE VIEW credit_summary AS
SELECT 
  u.id AS user_id,
  u.credits AS current_credits,
  COALESCE(up.credits_per_month, 5) AS monthly_limit,
  COALESCE(up.credits_per_month, 5) - u.credits AS remaining_this_month,
  u.last_credit_reset
FROM users u
LEFT JOIN user_plans up ON u.plan_id = up.id;

-- Verificación
SELECT 'Sistema de créditos seguro implementado' AS status;