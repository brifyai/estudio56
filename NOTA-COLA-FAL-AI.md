# 📝 NOTA: Sistema de Cola de Fal.ai
**Fecha**: 9 de Enero 2026

---

## 🔄 CÓMO FUNCIONA LA COLA

### Priorización de Requests

Fal.ai utiliza un sistema de cola con **priorización**:

- **API requests** (nuestro caso) tienen **mayor prioridad**
- **Playground requests** tienen menor prioridad

### Comportamiento Observable

Durante períodos de **alta carga**:

```
⚠️ La posición en la cola puede cambiar mientras el request se procesa
```

**Ejemplo**:
```
Intento 1: queue_position: 5
Intento 2: queue_position: 3  ← Avanzó 2 posiciones
Intento 3: queue_position: 4  ← Retrocedió 1 posición (otros API requests entraron)
Intento 4: queue_position: 2  ← Avanzó 2 posiciones
Intento 5: queue_position: 0  ← En proceso
```

---

## 🎯 IMPLICACIONES PARA NUESTRO SISTEMA

### 1. Tiempos Variables

Los tiempos de generación pueden variar según:
- ✅ Carga del sistema de Fal.ai
- ✅ Número de requests en cola
- ✅ Prioridad de otros requests API

**Tiempos esperados**:
- **Baja carga**: 30-60 segundos
- **Carga media**: 1-2 minutos
- **Alta carga**: 2-5 minutos

### 2. Polling Adaptativo

Nuestro sistema actual:
- ✅ Polling cada 5 segundos
- ✅ Timeout de 10 minutos (120 intentos)
- ✅ Suficiente para manejar alta carga

### 3. Experiencia de Usuario

**Mensaje actual**:
```
"Generando video... X%"
```

**Consideración**: El porcentaje de progreso es estimado, no refleja la posición real en la cola.

---

## 💡 MEJORAS FUTURAS OPCIONALES

### Opción 1: Mostrar Posición en Cola

```typescript
if (status.queue_position !== undefined && status.queue_position > 0) {
  onProgress(progress, `En cola (posición ${status.queue_position})...`);
} else {
  onProgress(progress, `Generando video... ${progress.toFixed(0)}%`);
}
```

### Opción 2: Mensaje Dinámico

```typescript
let message = 'Generando video...';
if (attempts < 6) {
  message = 'Iniciando generación...';
} else if (attempts < 12) {
  message = 'En cola de procesamiento...';
} else {
  message = 'Renderizando video...';
}
onProgress(progress, message);
```

### Opción 3: Timeout Adaptativo

```typescript
// Si la posición en cola es alta, aumentar timeout
const estimatedTime = status.queue_position * 30; // 30 segundos por posición
const adjustedTimeout = Math.max(600, estimatedTime); // Mínimo 10 minutos
```

---

## 📊 DATOS DE RESPUESTA DE FAL.AI

### Durante Cola (IN_QUEUE)

```json
{
  "status": "IN_QUEUE",
  "request_id": "abc123",
  "queue_position": 5,
  "status_url": "https://queue.fal.run/fal-ai/pika/requests/abc123/status"
}
```

### Durante Procesamiento (IN_PROGRESS)

```json
{
  "status": "IN_PROGRESS",
  "request_id": "abc123",
  "queue_position": 0,
  "status_url": "https://queue.fal.run/fal-ai/pika/requests/abc123/status"
}
```

### Completado (COMPLETED)

```json
{
  "status": "COMPLETED",
  "request_id": "abc123",
  "video": {
    "url": "https://...",
    "content_type": "video/mp4",
    "file_name": "video.mp4",
    "file_size": 1234567
  }
}
```

---

## 🔍 MONITOREO

### Logs Actuales

Nuestro sistema ya registra:
```
🔄 [Fal.ai Video] Verificando estado (intento X/120)... Y%
```

### Logs Mejorados (Opcional)

Podríamos agregar:
```typescript
console.log(`🔄 [Fal.ai Video] Intento ${attempts}/${maxAttempts}`);
console.log(`📊 [Fal.ai Video] Status: ${status.status}`);
if (status.queue_position !== undefined) {
  console.log(`📍 [Fal.ai Video] Posición en cola: ${status.queue_position}`);
}
```

---

## ✅ ESTADO ACTUAL

Nuestro sistema está **correctamente configurado** para manejar:
- ✅ Variaciones en la posición de cola
- ✅ Tiempos de espera variables
- ✅ Alta carga del sistema
- ✅ Timeout suficiente (10 minutos)

**No se requieren cambios inmediatos**, pero las mejoras opcionales pueden implementarse si se desea una mejor experiencia de usuario.

---

## 📚 REFERENCIAS

- **Documentación Fal.ai**: https://fal.ai/docs
- **Queue System**: https://fal.ai/docs/queue
- **Código de polling**: `services/vertexVideoService.ts` (líneas 160-195)
- **Función de verificación**: `netlify/functions/check-video-operation.ts`

---

**Nota**: Esta información es importante para entender el comportamiento del sistema durante períodos de alta demanda.

