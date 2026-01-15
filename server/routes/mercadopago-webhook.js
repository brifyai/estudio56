import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Inicializar cliente de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

router.post('/', async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('🔔 [MercadoPago Webhook] Recibido:', type);

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Obtener detalles del pago
      const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
        }
      });

      const payment = await response.json();
      console.log('💳 [MercadoPago] Estado del pago:', payment.status);

      if (payment.status === 'approved') {
        const userId = payment.external_reference;
        
        // Actualizar estado en Supabase
        const { error } = await supabase
          .from('payments')
          .update({ 
            status: 'completed',
            mercadopago_id: paymentId,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) {
          console.error('❌ [Supabase] Error actualizando pago:', error);
        } else {
          console.log('✅ [Supabase] Pago actualizado para usuario:', userId);
        }
      }
    }

    res.json({ success: true });

  } catch (error) {
    console.error('❌ [MercadoPago Webhook] Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error procesando webhook' 
    });
  }
});

export default router;
