import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface MPNotification {
  id: number;
  live_mode: boolean;
  type: string;
  api_version: number;
  action: string;
  data: {
    id: string;
  };
}

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
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
    // Get the notification from MercadoPago
    const notification: MPNotification = JSON.parse(event.body || '{}');

    console.log('📨 Received MercadoPago notification:', notification);

    // Handle different notification types
    if (notification.type === 'subscription' || notification.action === 'payment_recurring') {
      const preapprovalId = notification.data.id;

      console.log('📝 Processing subscription notification:', preapprovalId);

      // Get MercadoPago access token
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN!;

      // Fetch subscription details from MercadoPago
      const response = await fetch(
        `https://api.mercadopago.com/preapproval/${preapprovalId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error('❌ Error fetching subscription from MercadoPago');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Failed to fetch subscription' }),
        };
      }

      const subscription = await response.json();

      console.log('📋 Subscription details:', subscription);

      // Update subscription in database
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          next_payment_date: subscription.next_payment_date,
          last_updated: new Date().toISOString(),
        })
        .eq('mp_preapproval_id', preapprovalId);

      if (updateError) {
        console.error('❌ Error updating subscription:', updateError);
      }

      // Update user subscription status
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('user_id')
        .eq('mp_preapproval_id', preapprovalId)
        .single();

      if (subData) {
        await supabase
          .from('users')
          .update({
            subscription_status: subscription.status,
          })
          .eq('id', subData.user_id);
      }

      // Handle different subscription statuses
      switch (subscription.status) {
        case 'authorized':
          console.log('✅ Subscription authorized - user has access');
          break;
        case 'pending':
          console.log('⏳ Subscription pending - waiting for payment');
          break;
        case 'cancelled':
          console.log('❌ Subscription cancelled');
          // Downgrade user to free plan
          if (subData) {
            await supabase
              .from('users')
              .update({
                plan_id: 'GRATIS',
                subscription_status: 'cancelled',
              })
              .eq('id', subData.user_id);
          }
          break;
        case 'paused':
          console.log('⏸️ Subscription paused');
          break;
        default:
          console.log('📌 Unknown subscription status:', subscription.status);
      }
    }

    // Handle payment notifications
    if (notification.type === 'payment') {
      const paymentId = notification.data.id;

      console.log('💰 Processing payment notification:', paymentId);

      // Get payment details from MercadoPago
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN!;
      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error('❌ Error fetching payment from MercadoPago');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Failed to fetch payment' }),
        };
      }

      const payment = await response.json();

      console.log('📋 Payment details:', {
        id: payment.id,
        status: payment.status,
        amount: payment.transaction_amount,
      });

      // Update payment status in database
      const { error: paymentUpdateError } = await supabase
        .from('payments')
        .update({
          mp_payment_id: payment.id,
          mp_status: payment.status,
          payment_method: payment.payment_method?.id,
          status: payment.status === 'approved' ? 'completed' : payment.status,
          paid_at: payment.date_approved,
        })
        .eq('mp_preference_id', payment.preference_id);

      if (paymentUpdateError) {
        console.error('❌ Error updating payment:', paymentUpdateError);
      }

      // If payment approved, update user's plan
      if (payment.status === 'approved') {
        const externalRef = JSON.parse(payment.external_reference || '{}');
        if (externalRef.userId && externalRef.planId) {
          await supabase
            .from('users')
            .update({
              plan_id: externalRef.planId,
            })
            .eq('id', externalRef.userId);
        }
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true }),
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