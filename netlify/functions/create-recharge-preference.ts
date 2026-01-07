import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RequestBody {
  userId: string;
  rechargeType: 'INDIVIDUAL' | 'SALVATORE' | 'IMPULSO';
}

interface RechargeConfig {
  id: string;
  name: string;
  price: number;
  creditsHD: number;
  drafts: number;
}

// Configuración de recargas (debe coincidir con types.ts)
const RECHARGE_CONFIGS: Record<string, RechargeConfig> = {
  INDIVIDUAL: {
    id: 'INDIVIDUAL',
    name: 'Individual',
    price: 2990,
    creditsHD: 10,
    drafts: 5,
  },
  SALVATORE: {
    id: 'SALVATORE',
    name: 'Salvatore',
    price: 9990,
    creditsHD: 50,
    drafts: 25,
  },
  IMPULSO: {
    id: 'IMPULSO',
    name: 'Impulso',
    price: 24990,
    creditsHD: 150,
    drafts: 750,
  },
};

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
    const { userId, rechargeType } = body;

    if (!userId || !rechargeType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'userId and rechargeType are required' }),
      };
    }

    // Validar tipo de recarga
    const rechargeConfig = RECHARGE_CONFIGS[rechargeType];
    if (!rechargeConfig) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid recharge type' }),
      };
    }

    console.log('📝 Creating recharge preference for:', { userId, rechargeType });

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
          title: `Recarga ${rechargeConfig.name} - Estudio 56`,
          description: `${rechargeConfig.creditsHD} Créditos HD + ${rechargeConfig.drafts} Borradores`,
          quantity: 1,
          unit_price: rechargeConfig.price,
          currency_id: 'CLP',
        },
      ],
      payer: {
        email: user.email,
      },
      back_urls: {
        success: `${process.env.VITE_APP_URL}/recarga-exitosa`,
        failure: `${process.env.VITE_APP_URL}/recarga-fallida`,
        pending: `${process.env.VITE_APP_URL}/recarga-pendiente`,
      },
      auto_return: 'approved',
      external_reference: JSON.stringify({
        userId,
        rechargeType,
        timestamp: Date.now(),
      }),
      notification_url: `${process.env.VITE_APP_URL}/.netlify/functions/mercadopago-webhook`,
      statement_descriptor: 'ESTUDIO56',
      metadata: {
        user_id: userId,
        recharge_type: rechargeType,
        recharge_config: JSON.stringify(rechargeConfig),
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
      throw new Error('Failed to create recharge preference');
    }

    const mpPreference = await response.json();

    console.log('✅ Recharge preference created:', mpPreference.id);

    // Create recharge record in database
    const { error: rechargeError } = await supabase
      .from('credit_recharges')
      .insert({
        user_id: userId,
        recharge_type: rechargeType,
        credits_hd: rechargeConfig.creditsHD,
        drafts: rechargeConfig.drafts,
        amount: rechargeConfig.price,
        status: 'pending',
        mercadopago_preference_id: mpPreference.id,
      });

    if (rechargeError) {
      console.error('❌ Error creating recharge record:', rechargeError);
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
    console.error('❌ Error in create-recharge-preference:', error);
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