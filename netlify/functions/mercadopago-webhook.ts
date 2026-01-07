import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('🔔 Webhook received:', JSON.stringify(body, null, 2));

    // MercadoPago sends notifications with this structure
    const { type, data } = body;

    // We only care about payment notifications
    if (type !== 'payment') {
      console.log('ℹ️ Ignoring non-payment notification:', type);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Notification received but ignored' }),
      };
    }

    // Get payment ID from notification
    const paymentId = data?.id;
    if (!paymentId) {
      console.error('❌ No payment ID in notification');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No payment ID provided' }),
      };
    }

    console.log('💳 Processing payment:', paymentId);

    // Fetch payment details from MercadoPago
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
      }
    );

    if (!mpResponse.ok) {
      console.error('❌ Failed to fetch payment from MercadoPago');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to fetch payment details' }),
      };
    }

    const payment = await mpResponse.json();
    console.log('📄 Payment details:', JSON.stringify(payment, null, 2));

    const {
      status,
      status_detail,
      external_reference,
      transaction_amount,
      payment_method_id,
      date_approved,
      metadata,
    } = payment;

    // Parse external reference to get user and plan/recharge IDs
    let userId: string;
    let planId: string | undefined;
    let rechargeType: string | undefined;

    try {
      const reference = JSON.parse(external_reference || '{}');
      userId = reference.userId || metadata?.user_id;
      planId = reference.planId || metadata?.plan_id;
      rechargeType = reference.rechargeType || metadata?.recharge_type;
    } catch (e) {
      userId = metadata?.user_id;
      planId = metadata?.plan_id;
      rechargeType = metadata?.recharge_type;
    }

    if (!userId) {
      console.error('❌ Missing userId in payment metadata');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid payment metadata' }),
      };
    }

    console.log('👤 User:', userId, '📦 Plan:', planId, '🔋 Recharge:', rechargeType);

    // Check if this is a recharge or a plan payment
    if (rechargeType && ['INDIVIDUAL', 'SALVATORE', 'IMPULSO'].includes(rechargeType)) {
      // ========================================
      // 💰 MANEJO DE RECARGAS DE CRÉDITOS
      // ========================================
      console.log('💳 Processing credit recharge:', rechargeType);

      // Get recharge config from metadata
      let rechargeConfig = { credits_hd: 0, drafts: 0 };
      try {
        rechargeConfig = JSON.parse(metadata?.recharge_config || '{}');
      } catch (e) {
        console.warn('Could not parse recharge config from metadata');
      }

      // Update or create recharge record
      const { data: existingRecharge } = await supabase
        .from('credit_recharges')
        .select('*')
        .eq('mercadopago_preference_id', metadata?.preference_id || paymentId)
        .single();

      if (existingRecharge) {
        // Update existing recharge
        console.log('🔄 Updating existing recharge record');
        await supabase
          .from('credit_recharges')
          .update({
            status: status === 'approved' ? 'completed' : status === 'rejected' ? 'failed' : 'pending',
            payment_method: payment_method_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingRecharge.id);
      } else {
        // Create new recharge record
        console.log('➕ Creating new recharge record');
        await supabase.from('credit_recharges').insert({
          user_id: userId,
          recharge_type: rechargeType,
          credits_hd: rechargeConfig.credits_hd || 0,
          drafts: rechargeConfig.drafts || 0,
          amount: transaction_amount,
          status: status === 'approved' ? 'completed' : status === 'rejected' ? 'failed' : 'pending',
          payment_method: payment_method_id,
          mercadopago_preference_id: metadata?.preference_id,
        });
      }

      // If payment is approved, add credits to user
      if (status === 'approved') {
        console.log('✅ Recharge approved! Adding credits to user...');

        // Get current user credits
        const { data: user } = await supabase
          .from('users')
          .select('credits, drafts')
          .eq('id', userId)
          .single();

        if (user) {
          // Update user's credits and drafts (additive)
          const { error: updateError } = await supabase
            .from('users')
            .update({
              credits: (user.credits || 0) + (rechargeConfig.credits_hd || 0),
              drafts: (user.drafts || 0) + (rechargeConfig.drafts || 0),
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          if (updateError) {
            console.error('❌ Error updating user credits:', updateError);
          } else {
            console.log('✅ Credits added to user account');

            // Add credit transaction
            await supabase.from('credit_transactions').insert({
              user_id: userId,
              type: 'recharge',
              amount: rechargeConfig.credits_hd || 0,
              credit_type: 'recharge',
              description: `Recarga ${rechargeType}: ${rechargeConfig.credits_hd || 0} créditos HD`,
              reference_id: paymentId,
            });
          }
        }
      } else if (status === 'rejected') {
        console.log('❌ Recharge rejected:', status_detail);
      } else {
        console.log('⏳ Recharge pending:', status_detail);
      }
    } else if (planId) {
      // ========================================
      // 📦 MANEJO DE PLANES DE SUSCRIPCIÓN
      // ========================================
      console.log('💳 Processing plan payment:', planId);

      // Update or create payment record
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('*')
        .eq('mp_payment_id', paymentId)
        .single();

      if (existingPayment) {
        // Update existing payment
        console.log('🔄 Updating existing payment record');
        await supabase
          .from('payments')
          .update({
            mp_status: status,
            status: status === 'approved' ? 'completed' : status === 'rejected' ? 'failed' : 'pending',
            payment_method: payment_method_id,
            paid_at: date_approved,
            metadata: payment,
            updated_at: new Date().toISOString(),
          })
          .eq('mp_payment_id', paymentId);
      } else {
        // Create new payment record
        console.log('➕ Creating new payment record');
        await supabase.from('payments').insert({
          user_id: userId,
          plan_id: planId,
          mp_payment_id: paymentId,
          mp_status: status,
          amount: transaction_amount,
          currency: 'CLP',
          payment_method: payment_method_id,
          status: status === 'approved' ? 'completed' : status === 'rejected' ? 'failed' : 'pending',
          paid_at: date_approved,
          metadata: payment,
        });
      }

      // If payment is approved, update user's plan and credits
      if (status === 'approved') {
        console.log('✅ Payment approved! Updating user plan and credits...');

        // Get plan details
        const { data: plan } = await supabase
          .from('user_plans')
          .select('*')
          .eq('id', planId)
          .single();

        if (plan) {
          // Update user's plan
          const { error: updateError } = await supabase
            .from('users')
            .update({
              plan_id: planId,
              credits: plan.credits_per_month,
              last_credit_reset: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          if (updateError) {
            console.error('❌ Error updating user plan:', updateError);
          } else {
            console.log('✅ User plan updated successfully');

            // Add credit transaction
            await supabase.from('credit_transactions').insert({
              user_id: userId,
              type: 'purchase',
              amount: plan.credits_per_month,
              credit_type: 'monthly_plan',
              description: `Créditos del plan ${plan.name}`,
              reference_id: paymentId,
            });

            console.log('✅ Credits added to user account');
          }
        }
      } else if (status === 'rejected') {
        console.log('❌ Payment rejected:', status_detail);
      } else {
        console.log('⏳ Payment pending:', status_detail);
      }
    } else {
      console.warn('⚠️ Payment received but no plan or recharge type identified');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Webhook processed successfully' }),
    };
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
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
