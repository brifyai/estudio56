# 🎯 Sistema de Planes y Pagos con MercadoPago - Estudio 56

## 📋 Resumen Ejecutivo

Sistema completo de monetización que permite a los usuarios:
- Ver planes disponibles al iniciar sesión (si tienen plan gratuito)
- Seleccionar y pagar planes mediante MercadoPago
- Gestionar su suscripción desde el perfil
- Recibir créditos automáticamente al confirmar el pago

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE USUARIO                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Usuario se registra → Plan GRATIS por defecto          │
│  2. Al iniciar sesión → Modal de planes aparece            │
│  3. Usuario selecciona plan → Redirige a MercadoPago       │
│  4. Usuario paga → Webhook confirma pago                    │
│  5. Sistema actualiza plan y créditos                       │
│  6. Usuario puede gestionar desde Perfil                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 💾 Base de Datos

### Tabla: `payments`

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES user_plans(id),
    
    -- Información de MercadoPago
    mp_payment_id VARCHAR(255) UNIQUE,
    mp_preference_id VARCHAR(255),
    mp_status VARCHAR(50), -- approved, pending, rejected, cancelled
    
    -- Detalles del pago
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'CLP',
    payment_method VARCHAR(100),
    
    -- Metadata
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    metadata JSONB, -- Información adicional de MP
    
    -- Timestamps
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_mp_payment_id ON payments(mp_payment_id);
CREATE INDEX idx_payments_status ON payments(status);
```

### Tabla: `subscriptions` (Opcional - para suscripciones recurrentes)

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES user_plans(id),
    
    -- Estado de suscripción
    status VARCHAR(50) DEFAULT 'active', -- active, cancelled, expired, paused
    
    -- Fechas
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    
    -- MercadoPago
    mp_subscription_id VARCHAR(255) UNIQUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

---

## 🎨 Componentes Frontend

### 1. `PlanSelectionModal.tsx` - Modal de Selección de Planes

**Características:**
- Aparece automáticamente al iniciar sesión si el usuario tiene plan GRATIS
- Muestra los 4 planes con precios y características
- Botón "Continuar Gratis" para cerrar el modal
- Botones "Seleccionar Plan" para planes pagados
- Diseño responsive y atractivo

### 2. `PlanCard.tsx` - Tarjeta Individual de Plan

**Características:**
- Muestra nombre, precio, características
- Badge "Actual" si es el plan del usuario
- Badge "Popular" para plan recomendado
- Botón de acción según estado

### 3. `PaymentSuccess.tsx` - Página de Confirmación

**Características:**
- Muestra mensaje de éxito
- Detalles del plan adquirido
- Créditos recibidos
- Botón para ir al dashboard

### 4. `SubscriptionManager.tsx` - Gestión de Suscripción

**Características:**
- Ver plan actual
- Historial de pagos
- Cambiar de plan (upgrade/downgrade)
- Cancelar suscripción

---

## ⚙️ Backend (Netlify Functions)

### 1. `create-payment-preference.ts`

**Propósito:** Crear preferencia de pago en MercadoPago

```typescript
// Entrada:
{
  userId: string,
  planId: string
}

// Salida:
{
  preferenceId: string,
  initPoint: string // URL de pago de MercadoPago
}
```

### 2. `mercadopago-webhook.ts`

**Propósito:** Recibir notificaciones de MercadoPago

```typescript
// Procesa:
- payment.created
- payment.updated

// Acciones:
- Actualizar estado del pago
- Actualizar plan del usuario
- Agregar créditos
- Enviar email de confirmación
```

### 3. `verify-payment.ts`

**Propósito:** Verificar estado de un pago

```typescript
// Entrada:
{
  paymentId: string
}

// Salida:
{
  status: string,
  approved: boolean
}
```

---

## 🔐 Variables de Entorno

```env
# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=your_access_token
MERCADOPAGO_PUBLIC_KEY=your_public_key

# URLs
VITE_APP_URL=https://estudio56.netlify.app
VITE_SUCCESS_URL=https://estudio56.netlify.app/pago-exitoso
VITE_FAILURE_URL=https://estudio56.netlify.app/pago-fallido
VITE_PENDING_URL=https://estudio56.netlify.app/pago-pendiente
```

---

## 📱 Flujo de Usuario Detallado

### Escenario 1: Usuario Nuevo (Plan Gratis)

```
1. Usuario se registra
   ↓
2. Se crea con plan_id = "GRATIS"
   ↓
3. Usuario inicia sesión
   ↓
4. App detecta plan GRATIS
   ↓
5. Modal de planes aparece automáticamente
   ↓
6. Usuario puede:
   a) Cerrar modal → Continúa con plan gratis
   b) Seleccionar plan → Va a paso 7
   ↓
7. Click en "Seleccionar Plan"
   ↓
8. Llamada a create-payment-preference
   ↓
9. Redirige a MercadoPago
   ↓
10. Usuario paga
    ↓
11. MercadoPago envía webhook
    ↓
12. Sistema actualiza plan y créditos
    ↓
13. Usuario redirigido a página de éxito
```

### Escenario 2: Usuario Existente (Upgrade)

```
1. Usuario con plan activo
   ↓
2. Va a Perfil → Sección "Mi Plan"
   ↓
3. Click en "Cambiar Plan"
   ↓
4. Modal de planes aparece
   ↓
5. Selecciona nuevo plan
   ↓
6. Proceso de pago (igual que arriba)
```

---

## 💰 Precios de los Planes (CLP)

| Plan | Precio Mensual | Créditos | Características |
|------|----------------|----------|-----------------|
| GRATIS | $0 | 5/día | Borradores con marca de agua |
| ESTOY PARTIENDO | $12.990 | 50/mes | 50 Imágenes HD |
| JEFE PYME | $39.990 | 250/mes | 250 Imágenes + 5 Videos |
| AGENCIA | $99.990 | 1000/mes | 1000 Imágenes + 20 Videos + Soporte |

---

## 🎯 Próximos Pasos de Implementación

1. ✅ Crear tabla `payments` en Supabase
2. ✅ Crear componente `PlanSelectionModal`
3. ✅ Crear función `create-payment-preference`
4. ✅ Crear función `mercadopago-webhook`
5. ✅ Integrar modal en `App.tsx`
6. ✅ Crear página de confirmación
7. ✅ Agregar gestión de suscripción en `ProfilePage`
8. ✅ Testing completo del flujo

---

## 🔒 Seguridad

- ✅ Validar webhook signature de MercadoPago
- ✅ Verificar que el pago pertenece al usuario correcto
- ✅ Usar RLS en Supabase para proteger datos
- ✅ No exponer access token en frontend
- ✅ Validar montos en backend

---

## 📊 Métricas a Trackear

- Conversión de gratis a pago
- Plan más popular
- Tasa de abandono en checkout
- Tiempo promedio hasta primer pago
- Upgrades vs downgrades

---

## 🎨 Diseño Visual

### Colores del Modal
- Fondo: `#111827` (gray-900)
- Tarjetas: `#1f2937` (gray-800)
- Bordes: `#374151` (gray-700)
- Texto: `#ffffff` (white)
- Acento: `#3b82f6` (blue-500)
- Éxito: `#10b981` (green-500)

### Animaciones
- Fade in del modal
- Hover effects en tarjetas
- Loading states en botones
- Confetti al confirmar pago exitoso

---

## 📝 Notas Importantes

1. **MercadoPago Chile:** Usar `CLP` como moneda
2. **IVA:** Los precios ya incluyen IVA (19%)
3. **Webhooks:** Configurar en panel de MercadoPago
4. **Testing:** Usar credenciales de prueba primero
5. **Emails:** Considerar enviar confirmación por email

---

## 🚀 Listo para Implementar

Este diseño está listo para ser implementado. ¿Quieres que empiece con algún componente específico?
