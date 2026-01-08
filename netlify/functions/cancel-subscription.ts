import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { userId } = body;

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'userId is required' }),
      };
    }

    console.log('📝 Cancelando suscripción para usuario:', userId);

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subError || !subscription) {
      console.error('❌ No se encontró suscripción:', subError);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Suscripción no encontrada' }),
      };
    }

    console.log('📋 Suscripción encontrada:', subscription.mp_preapproval_id);

    // Cancel subscription in MercadoPago
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN!;
    
    const response = await fetch(
      `https://api.mercadopago.com/preapproval/${subscription.mp_preapproval_id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: 'cancelled',
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error cancelando en MercadoPago:', errorData);
      // Continue anyway to update local status
    }

    const mpResponse = await response.json();
    console.log('✅ MercadoPago response:', mpResponse);

    // Update subscription in database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', subscription.id);

    if (updateError) {
      console.error('❌ Error actualizando suscripción:', updateError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Error actualizando suscripción' }),
      };
    }

    // Update user status - keep plan until renewal date
    const { error: userError } = await supabase
      .from('users')
      .update({
        subscription_status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (userError) {
      console.error('❌ Error actualizando usuario:', userError);
    }

    console.log('✅ Suscripción cancelada exitosamente');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Suscripción cancelada. El plan estará vigente hasta la fecha de renovación.',
        renewal_date: subscription.next_payment_date,
      }),
    };

  } catch (error) {
    console.error('❌ Error en cancel-subscription:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};