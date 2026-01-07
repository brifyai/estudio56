// ============================================
// CÓDIGO PARA INTEGRAR EN App.tsx
// ============================================

// 1. AGREGAR ESTAS IMPORTACIONES AL INICIO
import { PlanSelectionModal } from './components/PlanSelectionModal';

// 2. AGREGAR ESTOS ESTADOS (después de los otros estados)
const [showPlanModal, setShowPlanModal] = useState(false);
const [isProcessingPayment, setIsProcessingPayment] = useState(false);

// 3. AGREGAR ESTE useEffect (para mostrar modal automáticamente)
useEffect(() => {
  // Mostrar modal de planes si el usuario tiene plan GRATIS
  if (hasKey && activePlan === 'GRATIS') {
    // Mostrar modal después de 2 segundos para no ser intrusivo
    const timer = setTimeout(() => {
      setShowPlanModal(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }
}, [hasKey, activePlan]);

// 4. AGREGAR ESTA FUNCIÓN (antes del return del componente)
const handleSelectPlan = async (planId: string) => {
  // Si selecciona plan gratis, solo cerrar modal
  if (planId === 'GRATIS') {
    setShowPlanModal(false);
    return;
  }

  try {
    setIsProcessingPayment(true);
    
    // Obtener ID del usuario actual
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

    console.log('💳 Creando preferencia de pago...', { userId: session.user.id, planId: plan.id });

    // Crear preferencia de pago en MercadoPago
    const response = await fetch('/.netlify/functions/create-payment-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.user.id,
        planId: plan.id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear preferencia de pago');
    }

    const preference = await response.json();
    console.log('✅ Preferencia creada:', preference);

    // Redirigir a MercadoPago
    window.location.href = preference.initPoint;
  } catch (error) {
    console.error('❌ Error al procesar pago:', error);
    
    // Mostrar alerta de error
    await estudioAlerts.error(
      'Error al Procesar Pago',
      error instanceof Error ? error.message : 'Hubo un problema al procesar tu pago. Por favor intenta nuevamente.'
    );
    
    setIsProcessingPayment(false);
  }
};

// 5. AGREGAR EL MODAL EN EL JSX (antes del cierre del componente Dashboard)
{/* Plan Selection Modal */}
<PlanSelectionModal
  isOpen={showPlanModal}
  onClose={() => setShowPlanModal(false)}
  currentPlan={activePlan}
  onSelectPlan={handleSelectPlan}
  isLoading={isProcessingPayment}
/>

// ============================================
// CÓDIGO PARA AGREGAR RUTAS EN App.tsx
// ============================================

// 1. AGREGAR ESTAS IMPORTACIONES
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { PaymentFailurePage } from './components/PaymentFailurePage';
import { PaymentPendingPage } from './components/PaymentPendingPage';

// 2. AGREGAR ESTAS RUTAS EN EL <Routes>
<Route path="/pago-exitoso" element={<PaymentSuccessPage />} />
<Route path="/pago-fallido" element={<PaymentFailurePage />} />
<Route path="/pago-pendiente" element={<PaymentPendingPage />} />

// ============================================
// CÓDIGO PARA ProfilePage.tsx
// ============================================

// 1. AGREGAR ESTA IMPORTACIÓN
import { SubscriptionSection } from './SubscriptionSection';

// 2. AGREGAR ESTE ESTADO
const [showPlanModal, setShowPlanModal] = useState(false);

// 3. AGREGAR ESTA SECCIÓN EN EL JSX (donde quieras mostrar la suscripción)
{/* Subscription Management */}
<div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
  <h2 className="text-2xl font-bold text-white mb-6">
    Mi Suscripción
  </h2>
  
  <SubscriptionSection
    userId={userProfile?.id || ''}
    currentPlan={userProfile?.user_plans?.name || 'GRATIS'}
    credits={userProfile?.credits || 0}
    onChangePlan={() => setShowPlanModal(true)}
  />
</div>

// 4. AGREGAR EL MODAL AL FINAL DEL COMPONENTE
{/* Plan Selection Modal */}
<PlanSelectionModal
  isOpen={showPlanModal}
  onClose={() => setShowPlanModal(false)}
  currentPlan={userProfile?.user_plans?.name || 'GRATIS'}
  onSelectPlan={handleSelectPlan}
  isLoading={false}
/>

// 5. AGREGAR LA FUNCIÓN handleSelectPlan (igual que en App.tsx)
const handleSelectPlan = async (planId: string) => {
  if (planId === 'GRATIS') {
    setShowPlanModal(false);
    return;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('No hay sesión activa');
    }

    const { data: plan, error: planError } = await supabase
      .from('user_plans')
      .select('id')
      .eq('name', planId)
      .single();

    if (planError || !plan) {
      throw new Error('Plan no encontrado');
    }

    const response = await fetch('/.netlify/functions/create-payment-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.user.id,
        planId: plan.id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear preferencia de pago');
    }

    const preference = await response.json();
    window.location.href = preference.initPoint;
  } catch (error) {
    console.error('❌ Error al procesar pago:', error);
    alert('Hubo un error al procesar tu pago. Por favor intenta nuevamente.');
  }
};

// ============================================
// EJEMPLO COMPLETO DE INTEGRACIÓN
// ============================================

/*
ESTRUCTURA FINAL:

App.tsx
├── Importaciones
│   ├── PlanSelectionModal
│   ├── PaymentSuccessPage
│   ├── PaymentFailurePage
│   └── PaymentPendingPage
├── Estados
│   ├── showPlanModal
│   └── isProcessingPayment
├── useEffect (mostrar modal automático)
├── handleSelectPlan (función)
├── JSX
│   ├── <PlanSelectionModal />
│   └── Rutas de pago
└── Routes
    ├── /pago-exitoso
    ├── /pago-fallido
    └── /pago-pendiente

ProfilePage.tsx
├── Importaciones
│   ├── SubscriptionSection
│   └── PlanSelectionModal
├── Estados
│   └── showPlanModal
├── handleSelectPlan (función)
└── JSX
    ├── <SubscriptionSection />
    └── <PlanSelectionModal />
*/

// ============================================
// NOTAS IMPORTANTES
// ============================================

/*
1. ORDEN DE IMPLEMENTACIÓN:
   a) Crear tabla en Supabase
   b) Configurar variables de entorno
   c) Configurar webhook en MercadoPago
   d) Instalar dependencias (canvas-confetti)
   e) Integrar código en App.tsx
   f) Integrar código en ProfilePage.tsx
   g) Testing

2. TESTING:
   - Usar tarjetas de prueba de MercadoPago
   - Verificar logs de Netlify Functions
   - Verificar actualización en Supabase
   - Probar flujo completo

3. PRODUCCIÓN:
   - Cambiar credenciales de TEST a PRODUCCIÓN
   - Verificar URLs de webhook
   - Probar con pago real pequeño
   - Monitorear logs

4. SOPORTE:
   - Documentar proceso para equipo
   - Crear FAQs para usuarios
   - Configurar alertas de errores
*/
