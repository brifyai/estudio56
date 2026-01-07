import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// UUID type alias
type UUID = string;

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

    console.log('📝 Creating subscription for:', { userId, planId });

    // Get plan details from database (search by name, not id)
    const { data: plan, error: planError } = await supabase
      .from('user_plans')
      .select('*')
      .eq('name', planId)
      .single();

    if (planError || !plan) {
      console.error('❌ Error fetching plan:', planError);
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Plan not found' }),
      };
    }

    // Don't allow subscription for free plan
    if (plan.price === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Cannot create subscription for free plan' }),
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

    // Create MercadoPago Preapproval (recurring subscription)
    const MercadoPagoConfig = {
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    };

    const preapprovalData = {
      payer_email: user.email,
      back_url: `${process.env.VITE_APP_URL}/panel`,
      reason: `Plan ${plan.name} - Estudio 56 (Suscripción mensual)`,
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: plan.price,
        currency_id: 'CLP',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      },
      external_reference: JSON.stringify({
        userId,
        planId,
        type: 'subscription',
        timestamp: Date.now(),
      }),
      metadata: {
        user_id: userId,
        plan_id: planId,
        plan_name: plan.name,
        credits_per_month: plan.credits_per_month,
      },
    };

    // Call MercadoPago Preapproval API
    const response = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MercadoPagoConfig.access_token}`,
      },
      body: JSON.stringify(preapprovalData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ MercadoPago API error:', errorData);
      throw new Error('Failed to create subscription: ' + JSON.stringify(errorData));
    }

    const mpPreapproval = await response.json();

    console.log('✅ Subscription created:', mpPreapproval.id);

    // Create subscription record in database
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        mp_preapproval_id: mpPreapproval.id,
        status: mpPreapproval.status,
        amount: plan.price,
        currency: 'CLP',
        next_payment_date: mpPreapproval.next_payment_date,
        start_date: mpPreapproval.start_date,
        end_date: mpPreapproval.end_date,
      });

    if (subscriptionError) {
      console.error('❌ Error creating subscription record:', subscriptionError);
      // Continue anyway
    }

    // Update user's plan to the new plan
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        plan_id: planId,
        subscription_id: mpPreapproval.id,
        subscription_status: mpPreapproval.status
      })
      .eq('id', userId);

    if (updateError) {
      console.error('❌ Error updating user plan:', updateError);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        subscriptionId: mpPreapproval.id,
        initPoint: mpPreapproval.init_point,
        sandboxInitPoint: mpPreapproval.sandbox_init_point,
        status: mpPreapproval.status,
      }),
    };
  } catch (error) {
    console.error('❌ Error in create-subscription:', error);
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