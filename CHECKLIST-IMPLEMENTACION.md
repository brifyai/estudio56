# ✅ Checklist de Implementación - Sistema de Pagos MercadoPago

## 📋 Guía Paso a Paso

Sigue este checklist en orden para implementar el sistema completo de pagos.

---

## 🎯 FASE 1: Preparación (15 minutos)

### 1.1 Obtener Credenciales de MercadoPago
- [ ] Ir a https://www.mercadopago.cl/developers/panel/app
- [ ] Crear una aplicación (si no existe)
- [ ] Copiar **Access Token de TEST**: `TEST-xxxxx`
- [ ] Copiar **Public Key de TEST**: `TEST-xxxxx`
- [ ] Guardar credenciales en lugar seguro

### 1.2 Preparar Supabase
- [ ] Abrir proyecto en Supabase
- [ ] Ir a SQL Editor
- [ ] Tener listo el archivo `database/create-payments-table.sql`

### 1.3 Instalar Dependencias
```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```
- [ ] Ejecutar comando
- [ ] Verificar que se instaló correctamente

---

## 💾 FASE 2: Base de Datos (5 minutos)

### 2.1 Crear Tabla de Pagos
- [ ] Abrir Supabase SQL Editor
- [ ] Copiar contenido de `database/create-payments-table.sql`
- [ ] Ejecutar script
- [ ] Verificar mensaje: "Tabla payments creada exitosamente"

### 2.2 Verificar Tabla
```sql
SELECT * FROM payments LIMIT 1;
```
- [ ] Ejecutar query
- [ ] Debe retornar 0 filas (tabla vacía pero existente)

### 2.3 Verificar RLS
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'payments';
```
- [ ] Ejecutar query
- [ ] `rowsecurity` debe ser `true`

---

## 🔐 FASE 3: Variables de Entorno (10 minutos)

### 3.1 En Netlify
- [ ] Ir a tu sitio en Netlify
- [ ] Site settings → Environment variables
- [ ] Agregar las siguientes variables:

```env
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxx
MERCADOPAGO_PUBLIC_KEY=TEST-xxxxx
VITE_APP_URL=https://tu-app.netlify.app
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 3.2 Obtener Service Role Key
- [ ] Ir a Supabase → Settings → API
- [ ] Copiar "service_role" key (⚠️ NUNCA expongas esta key en frontend)
- [ ] Agregar a Netlify como `SUPABASE_SERVICE_ROLE_KEY`

### 3.3 Verificar Variables
- [ ] Todas las variables están agregadas
- [ ] No hay espacios extra
- [ ] URLs no tienen "/" al final

---

## 🔔 FASE 4: Configurar Webhook (5 minutos)

### 4.1 En MercadoPago
- [ ] Ir a tu aplicación en MercadoPago
- [ ] Sección "Webhooks" o "Notificaciones"
- [ ] Click en "Agregar webhook"

### 4.2 Configurar URL
```
https://tu-app.netlify.app/.netlify/functions/mercadopago-webhook
```
- [ ] Pegar URL (reemplazar con tu dominio)
- [ ] Seleccionar eventos:
  - [ ] `payment.created`
  - [ ] `payment.updated`
- [ ] Guardar

### 4.3 Verificar Webhook
- [ ] Estado debe ser "Activo"
- [ ] URL debe estar correcta
- [ ] Eventos seleccionados correctamente

---

## 💻 FASE 5: Integración Frontend (30 minutos)

### 5.1 Actualizar App.tsx

#### Importaciones
```typescript
import { PlanSelectionModal } from './components/PlanSelectionModal';
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { PaymentFailurePage } from './components/PaymentFailurePage';
import { PaymentPendingPage } from './components/PaymentPendingPage';
```
- [ ] Agregar importaciones al inicio

#### Estados
```typescript
const [showPlanModal, setShowPlanModal] = useState(false);
const [isProcessingPayment, setIsProcessingPayment] = useState(false);
```
- [ ] Agregar después de otros estados

#### useEffect
- [ ] Copiar código de `CODIGO-INTEGRACION-APP.tsx`
- [ ] Agregar useEffect para mostrar modal automático
- [ ] Verificar que depende de `hasKey` y `activePlan`

#### Función handleSelectPlan
- [ ] Copiar función completa de `CODIGO-INTEGRACION-APP.tsx`
- [ ] Agregar antes del return del componente

#### Modal en JSX
```typescript
<PlanSelectionModal
  isOpen={showPlanModal}
  onClose={() => setShowPlanModal(false)}
  currentPlan={activePlan}
  onSelectPlan={handleSelectPlan}
  isLoading={isProcessingPayment}
/>
```
- [ ] Agregar antes del cierre del componente Dashboard

#### Rutas
```typescript
<Route path="/pago-exitoso" element={<PaymentSuccessPage />} />
<Route path="/pago-fallido" element={<PaymentFailurePage />} />
<Route path="/pago-pendiente" element={<PaymentPendingPage />} />
```
- [ ] Agregar en el `<Routes>` del Router

### 5.2 Actualizar ProfilePage.tsx

#### Importaciones
```typescript
import { SubscriptionSection } from './SubscriptionSection';
import { PlanSelectionModal } from './PlanSelectionModal';
```
- [ ] Agregar importaciones

#### Estado
```typescript
const [showPlanModal, setShowPlanModal] = useState(false);
```
- [ ] Agregar estado

#### Función handleSelectPlan
- [ ] Copiar de `CODIGO-INTEGRACION-APP.tsx`
- [ ] Agregar en el componente

#### Sección de Suscripción
```typescript
<SubscriptionSection
  userId={userProfile?.id || ''}
  currentPlan={userProfile?.user_plans?.name || 'GRATIS'}
  credits={userProfile?.credits || 0}
  onChangePlan={() => setShowPlanModal(true)}
/>
```
- [ ] Agregar donde quieras mostrar la suscripción

#### Modal
```typescript
<PlanSelectionModal
  isOpen={showPlanModal}
  onClose={() => setShowPlanModal(false)}
  currentPlan={userProfile?.user_plans?.name || 'GRATIS'}
  onSelectPlan={handleSelectPlan}
  isLoading={false}
/>
```
- [ ] Agregar al final del componente

---

## 🚀 FASE 6: Deploy (5 minutos)

### 6.1 Commit y Push
```bash
git add .
git commit -m "feat: Implementar sistema de pagos con MercadoPago"
git push origin main
```
- [ ] Ejecutar comandos
- [ ] Verificar que se subió correctamente

### 6.2 Verificar Deploy en Netlify
- [ ] Ir a Netlify
- [ ] Ver que el deploy se completó
- [ ] Verificar que no hay errores
- [ ] Verificar que las funciones se desplegaron:
  - [ ] `create-payment-preference`
  - [ ] `mercadopago-webhook`

---

## 🧪 FASE 7: Testing (30 minutos)

### 7.1 Test: Usuario Nuevo
- [ ] Registrar nuevo usuario
- [ ] Verificar que tiene plan GRATIS en BD
- [ ] Iniciar sesión
- [ ] Verificar que aparece modal de planes (después de 2 seg)
- [ ] Cerrar modal → debe cerrar correctamente
- [ ] Recargar página → modal debe aparecer de nuevo

### 7.2 Test: Selección de Plan
- [ ] Abrir modal de planes
- [ ] Click en "Estoy Partiendo"
- [ ] Debe mostrar loading
- [ ] Debe redirigir a MercadoPago
- [ ] Verificar que la URL es de MercadoPago

### 7.3 Test: Pago Aprobado
**Usar tarjeta de prueba:**
```
Número: 5031 7557 3453 0604
CVV: 123
Fecha: 12/25
Nombre: APRO
```
- [ ] Completar formulario de pago
- [ ] Click en "Pagar"
- [ ] Debe redirigir a `/pago-exitoso`
- [ ] Debe mostrar confetti 🎉
- [ ] Debe mostrar ID de transacción
- [ ] Click en "Ir al Dashboard"

### 7.4 Test: Verificar Actualización en BD

**Verificar pago:**
```sql
SELECT * FROM payments 
WHERE user_id = 'tu_user_id' 
ORDER BY created_at DESC 
LIMIT 1;
```
- [ ] Ejecutar query
- [ ] Debe existir registro
- [ ] `status` debe ser 'completed'
- [ ] `mp_status` debe ser 'approved'

**Verificar usuario:**
```sql
SELECT u.email, up.name as plan, u.credits 
FROM users u 
LEFT JOIN user_plans up ON u.plan_id = up.id 
WHERE u.id = 'tu_user_id';
```
- [ ] Ejecutar query
- [ ] `plan` debe ser el plan seleccionado
- [ ] `credits` debe ser los créditos del plan

**Verificar transacción de créditos:**
```sql
SELECT * FROM credit_transactions 
WHERE user_id = 'tu_user_id' 
AND type = 'purchase' 
ORDER BY created_at DESC 
LIMIT 1;
```
- [ ] Ejecutar query
- [ ] Debe existir registro
- [ ] `amount` debe ser los créditos del plan

### 7.5 Test: Pago Rechazado
**Usar tarjeta de prueba:**
```
Número: 5031 7557 3453 0604
CVV: 123
Fecha: 12/25
Nombre: OTHE
```
- [ ] Completar formulario
- [ ] Click en "Pagar"
- [ ] Debe redirigir a `/pago-fallido`
- [ ] Debe mostrar mensaje de error
- [ ] Click en "Intentar Nuevamente"
- [ ] Debe volver al dashboard

### 7.6 Test: Pago Pendiente
**Usar tarjeta de prueba:**
```
Número: 5031 7557 3453 0604
CVV: 123
Fecha: 12/25
Nombre: CONT
```
- [ ] Completar formulario
- [ ] Click en "Pagar"
- [ ] Debe redirigir a `/pago-pendiente`
- [ ] Debe mostrar mensaje de pendiente
- [ ] Click en "Volver al Dashboard"

### 7.7 Test: Historial de Pagos
- [ ] Ir a Perfil
- [ ] Verificar sección "Mi Suscripción"
- [ ] Debe mostrar plan actual
- [ ] Debe mostrar créditos disponibles
- [ ] Debe mostrar historial de pagos
- [ ] Verificar que aparece el pago de prueba

### 7.8 Test: Cambiar Plan desde Perfil
- [ ] En Perfil, click en "Cambiar Plan"
- [ ] Debe abrir modal de planes
- [ ] Seleccionar otro plan
- [ ] Debe funcionar igual que desde dashboard

---

## 📊 FASE 8: Verificar Logs (10 minutos)

### 8.1 Logs de Netlify Functions
```bash
netlify functions:log create-payment-preference
```
- [ ] Ejecutar comando
- [ ] Verificar que hay logs
- [ ] No debe haber errores

```bash
netlify functions:log mercadopago-webhook
```
- [ ] Ejecutar comando
- [ ] Verificar que recibió notificación
- [ ] Verificar que procesó correctamente

### 8.2 Logs en MercadoPago
- [ ] Ir a tu aplicación en MercadoPago
- [ ] Sección "Webhooks"
- [ ] Ver historial de notificaciones
- [ ] Verificar que se enviaron
- [ ] Verificar respuesta 200 OK

---

## 🎯 FASE 9: Producción (Cuando estés listo)

### 9.1 Cambiar a Credenciales de Producción
- [ ] Obtener Access Token de PRODUCCIÓN
- [ ] Obtener Public Key de PRODUCCIÓN
- [ ] Actualizar en Netlify:
  - [ ] `MERCADOPAGO_ACCESS_TOKEN`
  - [ ] `MERCADOPAGO_PUBLIC_KEY`

### 9.2 Actualizar Webhook
- [ ] Verificar URL de webhook en producción
- [ ] Debe apuntar a dominio de producción
- [ ] Verificar que está activo

### 9.3 Test en Producción
- [ ] Hacer pago de prueba con tarjeta real
- [ ] Usar monto pequeño (ej: plan más barato)
- [ ] Verificar que todo funciona
- [ ] Verificar actualización en BD

### 9.4 Monitoreo
- [ ] Configurar alertas de errores
- [ ] Monitorear logs regularmente
- [ ] Revisar pagos diariamente

---

## ✅ CHECKLIST FINAL

### Funcionalidad
- [ ] Usuario nuevo tiene plan GRATIS
- [ ] Modal aparece automáticamente
- [ ] Puede seleccionar plan
- [ ] Redirige a MercadoPago
- [ ] Pago aprobado actualiza plan
- [ ] Pago aprobado agrega créditos
- [ ] Redirige a página correcta según resultado
- [ ] Historial de pagos funciona
- [ ] Puede cambiar plan desde perfil

### Base de Datos
- [ ] Tabla `payments` creada
- [ ] RLS configurado
- [ ] Índices creados
- [ ] Políticas funcionando

### Backend
- [ ] Función `create-payment-preference` desplegada
- [ ] Función `mercadopago-webhook` desplegada
- [ ] Variables de entorno configuradas
- [ ] Webhook configurado en MercadoPago

### Frontend
- [ ] Modal de planes funciona
- [ ] Páginas de confirmación funcionan
- [ ] Sección de suscripción funciona
- [ ] Animaciones funcionan (confetti)

### Testing
- [ ] Pago aprobado testeado
- [ ] Pago rechazado testeado
- [ ] Pago pendiente testeado
- [ ] Actualización de BD verificada
- [ ] Logs verificados

---

## 🎉 ¡COMPLETADO!

Si todos los checkboxes están marcados, tu sistema de pagos está funcionando correctamente.

### Próximos Pasos:
1. Monitorear conversiones
2. Recopilar feedback de usuarios
3. Optimizar flujo según métricas
4. Considerar agregar más planes
5. Implementar emails de confirmación

---

## 🆘 ¿Problemas?

Si algo no funciona, revisa:
1. Logs de Netlify Functions
2. Logs de MercadoPago
3. Consola del navegador
4. Base de datos en Supabase

**Documentación de referencia:**
- `PLAN-MERCADOPAGO-DISENO.md` - Diseño completo
- `INSTRUCCIONES-INTEGRACION-MERCADOPAGO.md` - Guía detallada
- `CODIGO-INTEGRACION-APP.tsx` - Código de ejemplo
- `SISTEMA-PAGOS-COMPLETADO.md` - Resumen completo

---

**¡Éxito con tu implementación! 🚀**
