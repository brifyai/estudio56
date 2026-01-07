import { supabase } from './supabaseService';

export interface PaymentPreference {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  plan_id: string;
  mp_payment_id: string | null;
  mp_preference_id: string | null;
  mp_status: string | null;
  amount: number;
  currency: string;
  payment_method: string | null;
  status: string;
  metadata: any;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Crear preferencia de pago en MercadoPago
 */
export async function createPaymentPreference(
  userId: string,
  planId: string
): Promise<PaymentPreference> {
  try {
    console.log('💳 Creating payment preference...', { userId, planId });

    const response = await fetch('/.netlify/functions/create-payment-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, planId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment preference');
    }

    const data = await response.json();
    console.log('✅ Payment preference created:', data);

    return data;
  } catch (error) {
    console.error('❌ Error creating payment preference:', error);
    throw error;
  }
}

/**
 * Obtener historial de pagos del usuario
 */
export async function getUserPayments(userId: string): Promise<Payment[]> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        user_plans (
          name,
          price,
          credits_per_month
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('❌ Error fetching user payments:', error);
    throw error;
  }
}

/**
 * Obtener detalles de un pago específico
 */
export async function getPaymentById(paymentId: string): Promise<Payment | null> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('❌ Error fetching payment:', error);
    return null;
  }
}

/**
 * Verificar estado de un pago en MercadoPago
 */
export async function verifyPaymentStatus(paymentId: string): Promise<any> {
  try {
    const response = await fetch('/.netlify/functions/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentId }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify payment status');
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    throw error;
  }
}

/**
 * Formatear precio en CLP
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Obtener estado del pago en español
 */
export function getPaymentStatusLabel(status: string): {
  label: string;
  color: string;
} {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'yellow' },
    completed: { label: 'Completado', color: 'green' },
    failed: { label: 'Fallido', color: 'red' },
    refunded: { label: 'Reembolsado', color: 'gray' },
    approved: { label: 'Aprobado', color: 'green' },
    rejected: { label: 'Rechazado', color: 'red' },
    cancelled: { label: 'Cancelado', color: 'gray' },
  };

  return statusMap[status] || { label: status, color: 'gray' };
}

/**
 * Redirigir a checkout de MercadoPago
 */
export function redirectToCheckout(initPoint: string) {
  window.location.href = initPoint;
}

export default {
  createPaymentPreference,
  getUserPayments,
  getPaymentById,
  verifyPaymentStatus,
  formatPrice,
  getPaymentStatusLabel,
  redirectToCheckout,
};
