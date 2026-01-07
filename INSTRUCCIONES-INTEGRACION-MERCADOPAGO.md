# 🚀 Instrucciones de Integración - Sistema de Pagos MercadoPago

## 📋 Checklist de Implementación

### 1. Base de Datos ✅

```bash
# Ejecutar en Supabase SQL Editor
```

1. Ve a tu proyecto en Supabase
2. Abre el SQL Editor
3. Ejecuta el archivo: `database/create-payments-table.sql`
4. Verifica que la tabla `payments` se creó correctamente

### 2. Variables de Entorno 🔐

Agrega estas variables en Netlify:

```env
# MercadoPago Credentials
MERCADOPAGO_ACCESS_TOKEN=tu_access_token_aqui
MERCADOPAGO_PUBLIC_KEY=tu_public_key_aqui

# URLs de la aplicación
VITE_APP_URL=https://tu-app.netlify.app

# Supabase Service Role (para webhooks)
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

#### ¿Dónde obtener las credenciales de MercadoPago?

1. **Modo Test (Desarrollo):**
   - Ve a: https://www.mercadopago.cl/developers/panel/app
   - Crea una aplicación
   - Copia las credenciales de **TEST**
   - Access Token: `TEST-xxxxx`
   - Public Key: `TEST-xxxxx`

2. **Modo Producción:**
   - Usa las credenciales de **PRODUCCIÓN**
   - Access Token: `APP_USR-xxxxx`
   - Public Key: `APP_USR-xxxxx`

### 3. Configurar Webhooks en MercadoPago 🔔

1. Ve a tu aplicación en MercadoPago
2. Sección "Webhooks"
3. Agrega esta URL:
   ```
   https://tu-app.netlify.app/.netlify/functions/mercadopago-webhook
   ```
4. Selecciona eventos:
   - ✅ `payment.created`
   - ✅ `payment.updated`

### 4. Actualizar App.tsx 📝

Agrega estas importaciones al inicio de `App.tsx`:

```typescript
import { PlanSelectionModal } from './components/PlanSelectionModal';
import { createPaymentPreference, redirectToCheckout } from './services/paymentService';
```

Agrega este estado después de los otros estados:

```typescript
const [showPlanModal, setShowPlanModal] = useState(false);
const [isProcessingPayment, setIsProcessingPayment] = useState(false);
```

Agrega este useEffect para mostrar el modal automáticamente:

```typescript
// Mostrar modal de planes si el usuario tiene plan GRATIS
useEffect(() => {
  if (hasKey && activePlan === 'GRATIS') {
    // Mostrar modal después de 2 segundos
    const timer = setTimeout(() => {
      setShowPlanModal(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }
}, [hasKey, activePlan]);
```

Agrega esta función para manejar la selección de plan:

```typescript
const handleSelectPlan = async (planId: string) => {
  if (planId === 'GRATIS') {
    setShowPlanModal(false);
    return;
  }

  try {
    setIsProcessingPayment(true);
    
    // Obtener ID del usuario
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('No hay sesión activa');
    }

    // Obtener ID del plan desde la base de datos
    const { data: plan, error: planError } = await supabase
      .from('user_plans')
      .select('id')
      .eq('name', planId)
      .single();

    if (planError || !plan) {
      throw new Error('Plan no encontrado');
    }

    // Crear preferencia de pago
    const preference = await createPaymentPreference(
      session.user.id,
      plan.id
    );

    // Redirigir a MercadoPago
    redirectToCheckout(preference.initPoint);
  } catch (error) {
    console.error('Error al procesar pago:', error);
    alert('Hubo un error al procesar tu pago. Por favor intenta nuevamente.');
    setIsProcessingPayment(false);
  }
};
```

Agrega el modal antes del cierre del componente Dashboard:

```typescript
{/* Plan Selection Modal */}
<PlanSelectionModal
  isOpen={showPlanModal}
  onClose={() => setShowPlanModal(false)}
  currentPlan={activePlan}
  onSelectPlan={handleSelectPlan}
  isLoading={isProcessingPayment}
/>
```

### 5. Agregar Rutas en App.tsx 🛣️

Agrega estas importaciones:

```typescript
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { PaymentFailurePage } from './components/PaymentFailurePage';
import { PaymentPendingPage } from './components/PaymentPendingPage';
```

Agrega estas rutas en el Router:

```typescript
<Route path="/pago-exitoso" element={<PaymentSuccessPage />} />
<Route path="/pago-fallido" element={<PaymentFailurePage />} />
<Route path="/pago-pendiente" element={<PaymentPendingPage />} />
```

### 6. Instalar Dependencia de Confetti 🎉

```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

### 7. Agregar Botón en ProfilePage (Opcional) 👤

En `components/ProfilePage.tsx`, agrega un botón para cambiar de plan:

```typescript
<button
  onClick={() => setShowPlanModal(true)}
  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all"
>
  Cambiar Plan
</button>
```

### 8. Testing 🧪

#### Modo Test (Tarjetas de Prueba):

**Tarjeta Aprobada:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Fecha: Cualquier fecha futura
- Nombre: APRO

**Tarjeta Rechazada:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Fecha: Cualquier fecha futura
- Nombre: OTHE

**Tarjeta Pendiente:**
- Número: `5031 7557 3453 0604`
- CVV: `123`
- Fecha: Cualquier fecha futura
- Nombre: CONT

Más tarjetas de prueba: https://www.mercadopago.cl/developers/es/docs/checkout-api/testing

### 9. Verificar Funcionamiento ✅

1. **Registro de nuevo usuario:**
   - Debe tener plan GRATIS por defecto
   - Al iniciar sesión, debe aparecer el modal de planes

2. **Selección de plan:**
   - Click en "Seleccionar Plan"
   - Debe redirigir a MercadoPago
   - Completar pago con tarjeta de prueba

3. **Webhook:**
   - Verificar en logs de Netlify que el webhook se ejecutó
   - Verificar en Supabase que:
     - Se creó el registro en `payments`
     - Se actualizó el `plan_id` del usuario
     - Se agregaron los créditos

4. **Redirección:**
   - Debe redirigir a `/pago-exitoso`
   - Debe mostrar confetti
   - Debe mostrar detalles del pago

### 10. Monitoreo 📊

**Logs de Netlify:**
```bash
netlify functions:log mercadopago-webhook
```

**Verificar pagos en Supabase:**
```sql
SELECT * FROM payments ORDER BY created_at DESC LIMIT 10;
```

**Verificar usuarios actualizados:**
```sql
SELECT u.email, up.name as plan, u.credits 
FROM users u 
LEFT JOIN user_plans up ON u.plan_id = up.id 
ORDER BY u.updated_at DESC 
LIMIT 10;
```

### 11. Producción 🚀

Antes de ir a producción:

1. ✅ Cambiar credenciales de TEST a PRODUCCIÓN
2. ✅ Verificar URLs de webhook
3. ✅ Probar con tarjeta real (monto pequeño)
4. ✅ Verificar emails de confirmación
5. ✅ Configurar monitoreo de errores
6. ✅ Documentar proceso de soporte

### 12. Soporte al Cliente 💬

**Preguntas frecuentes:**

- **¿Cuándo se activa mi plan?**
  - Inmediatamente si pagas con tarjeta
  - Hasta 48 horas si pagas con transferencia/efectivo

- **¿Puedo cambiar de plan?**
  - Sí, desde tu perfil en cualquier momento

- **¿Cómo cancelo mi suscripción?**
  - Contacta a soporte@estudio56.cl

- **¿Los créditos se acumulan?**
  - No, se renuevan cada mes

---

## 🎯 Resultado Final

Después de seguir estos pasos, tendrás:

✅ Sistema completo de pagos con MercadoPago
✅ Modal automático para usuarios con plan gratis
✅ Procesamiento de pagos en tiempo real
✅ Actualización automática de planes y créditos
✅ Páginas de confirmación profesionales
✅ Historial de pagos en el perfil

---

## 🆘 Troubleshooting

**Problema: El webhook no se ejecuta**
- Verifica la URL en MercadoPago
- Revisa los logs de Netlify
- Asegúrate que la función esté desplegada

**Problema: El pago no actualiza el plan**
- Verifica que el webhook recibió la notificación
- Revisa los logs de la función
- Verifica que el `external_reference` tenga userId y planId

**Problema: Error al crear preferencia**
- Verifica las credenciales de MercadoPago
- Asegúrate que el plan existe en la BD
- Revisa que el precio sea mayor a 0

---

¿Necesitas ayuda? Revisa los logs o contacta al equipo de desarrollo.
