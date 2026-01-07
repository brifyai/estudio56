# Auditoría: Pérdida de Plan de Usuario

## Fecha
2026-01-07

## Usuario Afectado
- **Email:** camiloalegriabarra@gmail.com
- **ID:** 84bacd33-0622-4c8b-8c6c-fd8f6f846ba5
- **Plan anterior:** AGENCIA
- **Plan afectado:** null (sin plan)

## Causa Raíz

El script [`scripts/update-plans.js`](scripts/update-plans.js) tenía un bug crítico:

```javascript
// ❌ CÓDIGO PROBLEMÁTICO (ahora corregido)
// First, delete existing plans
const { error: deleteError } = await supabase
  .from('user_plans')
  .delete()
  .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

// Insert the correct plans
const { data: plans, error: insertError } = await supabase
  .from('user_plans')
  .insert(correctPlans)
  .select();
```

**Problema:** Al borrar y recrear los planes, se generan **nuevos UUIDs** para cada plan. Esto rompe la referencia `users.plan_id` que apuntaba al ID antiguo del plan AGENCIA.

## Solución Aplicada

1. **Inmediata:** Restaurar el plan del usuario actualizando `plan_id` al ID actual del plan AGENCIA:
   - ID del plan AGENCIA: `33333333-3333-3333-3333-333333333333`
   - Query ejecutada: `UPDATE users SET plan_id = '33333333-...' WHERE email = 'camiloalegriabarra@gmail.com'`

2. **Preventiva:** Corregir el script `update-plans.js` para actualizar en lugar de borrar/recriar:
   - Ahora usa `upsert` + `update` por nombre de plan
   - Mantiene los IDs originales de los planes
   - No rompe las referencias en `users.plan_id`

## Lecciones Aprendidas

1. **Nunca borrar datos que tienen referencias** - Siempre actualizar
2. **Usar nombres como clave de identificación** - No depender de UUIDs generados
3. **Agregar tests de integridad** - Verificar que las foreign keys no se rompan
4. **Documentar scripts de migración** - Incluir advertencias sobre efectos secundarios

## Acciones Recomendadas

- [x] Corregir script `update-plans.js`
- [ ] Agregar test de integridad en CI/CD
- [ ] Crear script de recuperación automática cuando se detecten usuarios huérfanos
- [ ] Revisar otros scripts de migración por problemas similares