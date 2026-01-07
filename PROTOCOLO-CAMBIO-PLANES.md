# Protocolo de Cambio de Planes

## Resumen

Este documento describe el protocolo completo para cuando un usuario cambia de plan (upgrade o downgrade).

## Flujo Actual

### 1. Upgrade (Cambio a plan más caro)

**Escenario:** Usuario cambia de FREE → PAGADO o de un plan a otro más caro.

**Flujo:**
```
1. Usuario selecciona nuevo plan en PricingModal
2. Frontend llama a create-subscription.ts
3. Se crea preferencia de pago en MercadoPago
4. Usuario es redirigido a pagar en MercadoPago
5. Webhook (mercadopago-subscription-webhook.ts) recibe notificación
6. Si pago = approved:
   - Se actualiza users.plan_id al nuevo plan
   - Se resetean créditos (credits = credits_per_month del plan)
   - Se registra last_credit_reset = ahora
```

**Código relevante:** [`mercadopago-webhook.ts`](netlify/functions/mercadopago-webhook.ts:254-288)

### 2. Downgrade (Cambio a plan más barato)

**Escenario:** Usuario cambia de AGENCIA → JEFE PYME o cancela suscripción.

**Flujo:**
```
1. Usuario cancela en MercadoPago o selecciona plan más barato
2. Webhook recibe notificación de status = 'cancelled'
3. Se actualiza users.plan_id a 'GRATIS'
4. Usuario pierde acceso a features del plan anterior
```

**Código relevante:** [`mercadopago-subscription-webhook.ts`](netlify/functions/mercadopago-subscription-webhook.ts:120-131)

## Problemas Identificados

### ❌ No hay prorrateo
- Si el usuario cambia a mitad de mes, pierde los créditos no usados del plan anterior
- No se calcula un crédito proporcional

### ❌ No hay período de gracia
- El cambio es inmediato
- Si el pago falla, se baja inmediatamente a FREE

### ❌ No hay confirmación de downgrade
- El usuario puede bajar de plan sin confirmación
- No hay período de prueba del nuevo plan

## Mejoras Recomendadas

### 1. Prorrateo de créditos
```typescript
// Al hacer upgrade:
const creditsUsed = usuario.credits_per_month - usuario.credits;
const creditsToTransfer = Math.min(creditsUsed, newPlan.credits_per_month);
const newCredits = newPlan.credits_per_month + creditsToTransfer;
```

### 2. Período de gracia
- Mantener acceso al plan anterior por X días
- Permitir volver atrás sin perder datos

### 3. Confirmación de downgrade
- Mostrar resumen de lo que perderá
- Opción de "mantener plan actual"

### 4. Historial de cambios
- Registrar cada cambio de plan en tabla `plan_changes`
- Incluir: usuario, plan_anterior, plan_nuevo, fecha, razón

## Estados de Suscripción

| Status MP | Acción |
|-----------|--------|
| `authorized` | Usuario tiene acceso normal |
| `pending` | Esperando primer pago |
| `cancelled` | Bajar a plan FREE inmediatamente |
| `paused` | Mantener acceso pero sin renovación |
| `paused` | Mantener acceso pero sin renovación |

## Tablas Involucradas

- `users` - plan_id, credits, subscription_status
- `subscriptions` - Historial de suscripciones
- `payments` - Historial de pagos
- `user_plans` - Definición de planes (NO borrar esta tabla)

## Scripts de Mantención

**NUNCA ejecutar:**
- `scripts/update-plans.js` con delete/insert (ya corregido)
- Cualquier script que modifique IDs de planes

**Sí ejecutar:**
- `scripts/migrate-plans.js` - Solo agrega columnas, no toca datos
- `scripts/change-user-plan.js` - Para cambios manuales controlados