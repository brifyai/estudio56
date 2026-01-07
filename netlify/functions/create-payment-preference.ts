import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RequestBody {
  userId: string;
  planId: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  credits_per_month: number;
}

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
    // Parse request body
    const body: RequestBody = JSON.parse(event.body || '{}');
    const { userId, planId } = body;

    if (!userId || !planId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'userId and planId are required' }),
      };
    }

    console.log('📝 Creating payment preference for:', { userId, planId });

    // Get plan details from database
    const { data: plan, error: planError } = await supabase
      .from('user_plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      console.error('❌ Error fetching plan:', planError);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Plan not found' }),
      };
    }

    // Don't allow payment for free plan
    if (plan.price === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Cannot create payment for free plan' }),
      };
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('❌ Error fetching user:', userError);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // Create MercadoPago preference
    const MercadoPagoConfig = {
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    };

    const preference = {
      items: [
        {
          title: `Plan ${plan.name} - Estudio 56`,
          description: `${plan.credits_per_month} créditos mensuales`,
          quantity: 1,
          unit_price: plan.price,
          currency_id: 'CLP',
        },
      ],
      payer: {
        email: user.email,
      },
      back_urls: {
        success: `${process.env.VITE_APP_URL}/pago-exitoso`,
        failure: `${process.env.VITE_APP_URL}/pago-fallido`,
        pending: `${process.env.VITE_APP_URL}/pago-pendiente`,
      },
      auto_return: 'approved',
      external_reference: JSON.stringify({
        userId,
        planId,
        timestamp: Date.now(),
      }),
      notification_url: `${process.env.VITE_APP_URL}/.netlify/functions/mercadopago-webhook`,
      statement_descriptor: 'ESTUDIO56',
      metadata: {
        user_id: userId,
        plan_id: planId,
        plan_name: plan.name,
      },
    };

    // Call MercadoPago API
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MercadoPagoConfig.access_token}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ MercadoPago API error:', errorData);
      throw new Error('Failed to create payment preference');
    }

    const mpPreference = await response.json();

    console.log('✅ Payment preference created:', mpPreference.id);

    // Create payment record in database
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        plan_id: planId,
        mp_preference_id: mpPreference.id,
        amount: plan.price,
        currency: 'CLP',
        status: 'pending',
      });

    if (paymentError) {
      console.error('❌ Error creating payment record:', paymentError);
      // Continue anyway, webhook will handle it
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        preferenceId: mpPreference.id,
        initPoint: mpPreference.init_point,
        sandboxInitPoint: mpPreference.sandbox_init_point,
      }),
    };
  } catch (error) {
    console.error('❌ Error in create-payment-preference:', error);
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
