import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { planId, email, userId } = req.body;
    
    if (!planId || !email) {
      return res.status(400).json({ error: 'planId and email are required' });
    }

    console.log('💳 [Create Payment] Creando preferencia de pago para:', email);

    const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN no configurada');
    }

    // Mapeo de planes
    const plans = {
      'starter': { title: 'Plan Starter', price: 9.99, description: 'Acceso básico' },
      'pro': { title: 'Plan Pro', price: 29.99, description: 'Acceso profesional' },
      'enterprise': { title: 'Plan Enterprise', price: 99.99, description: 'Acceso empresarial' }
    };

    const plan = plans[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Plan no válido' });
    }

    // Crear preferencia en MercadoPago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          title: plan.title,
          description: plan.description,
          quantity: 1,
          unit_price: plan.price,
          currency_id: 'CLP'
        }],
        payer: {
          email
        },
        back_urls: {
          success: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/payment-success`,
          failure: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/payment-failure`,
          pending: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/payment-pending`
        },
        notification_url: `${process.env.VITE_APP_URL || 'http://localhost:3000'}/api/mercadopago-webhook`,
        external_reference: userId || email,
        auto_return: 'approved'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [MercadoPago] Error:', errorText);
      throw new Error(`MercadoPago error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [Create Payment] Preferencia creada:', data.id);

    res.json({
      success: true,
      preferenceId: data.id,
      initPoint: data.init_point
    });

  } catch (error) {
    console.error('❌ [Create Payment] Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error al crear pago' 
    });
  }
});

export default router;
