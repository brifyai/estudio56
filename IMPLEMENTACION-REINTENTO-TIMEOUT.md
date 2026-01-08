# Implementación: Sistema de Reintento en Timeout

## Problema Original
Cuando ocurría un timeout (300s o 600s), el usuario veía un error genérico y perdía todo su trabajo:
- Descripción ingresada
- Configuración de texto y logo
- Posición de elementos
- Créditos gastados sin resultado

## Solución Implementada: Opción 3 - Notificación + Botón de Reintentar

### Características
✅ **No pierde datos**: El usuario mantiene toda su configuración
✅ **Control al usuario**: Decide si reintentar o cancelar
✅ **Transparente**: Explica qué está pasando
✅ **Amigable**: Interfaz clara y profesional
✅ **Sin bucles**: Usuario controla cuándo reintentar

## Cambios Realizados

### Archivo: `App.tsx`
**Función modificada**: `handleError`

### Antes:
```typescript
const handleError = (error: any) => {
  if (error.message && (error.message.includes('permission denied') || error.message.includes('403'))) {
    setStatus({ isLoading: false, step: 'error', message: 'Error de autenticación' });
    setHasKey(false);
    alert('Tu sesión expiró. Conecta nuevamente.');
  } else {
    setStatus({ isLoading: false, step: 'error', message: 'Error del sistema' });
    alert('Error al generar. Intenta de nuevo.');
  }
};
```

### Después:
```typescript
const handleError = (error: any) => {
  // 🔄 MANEJO ESPECIAL PARA TIMEOUTS - Opción de reintentar
  if (error.message && error.message.includes('Timeout')) {
    setStatus({ isLoading: false, step: 'error', message: 'Timeout de generación' });
    
    Swal.fire({
      icon: 'warning',
      title: '⏱️ La generación está tardando más de lo normal',
      html: `
        <div class="space-y-3 text-left">
          <p>El servidor está procesando tu imagen pero está tardando más de lo esperado.</p>
          <p class="text-xs">Esto puede ocurrir cuando hay alta demanda en los servidores de IA.</p>
          <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-3">
            <p class="text-sm font-medium">💡 ¿Qué quieres hacer?</p>
            <ul class="text-xs mt-2 space-y-1 list-disc list-inside">
              <li><strong>Reintentar:</strong> Volver a generar la imagen (recomendado)</li>
              <li><strong>Cancelar:</strong> Volver al formulario</li>
            </ul>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '🔄 Reintentar generación',
      cancelButtonText: '❌ Cancelar',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('🔄 Usuario eligió reintentar generación después de timeout');
        handleGenerate(); // Reintentar SIN perder datos
      } else {
        console.log('❌ Usuario canceló después de timeout');
      }
    });
    
    return;
  }
  
  // Manejo de otros errores...
};
```

## Flujo de Usuario

### Escenario 1: Usuario Reintenta
```
1. Usuario genera imagen
2. Timeout después de 10 minutos
3. Aparece modal: "La generación está tardando..."
4. Usuario hace clic en "🔄 Reintentar generación"
5. Se vuelve a generar CON los mismos datos
6. ✅ Éxito o puede reintentar nuevamente
```

### Escenario 2: Usuario Cancela
```
1. Usuario genera imagen
2. Timeout después de 10 minutos
3. Aparece modal: "La generación está tardando..."
4. Usuario hace clic en "❌ Cancelar"
5. Vuelve al formulario con todos sus datos intactos
6. Puede modificar y generar cuando quiera
```

## Beneficios

### Para el Usuario
✅ **No pierde trabajo**: Toda la configuración se mantiene
✅ **Control total**: Decide cuándo reintentar
✅ **Información clara**: Sabe qué está pasando
✅ **Sin frustración**: No tiene que empezar de cero

### Para el Sistema
✅ **Mejor UX**: Experiencia profesional y amigable
✅ **Menos soporte**: Usuarios entienden qué hacer
✅ **Más conversiones**: Usuarios no abandonan por frustración
✅ **Datos preservados**: No se pierde información valiosa

## Casos de Uso Cubiertos

### 1. Generación de Borrador (Draft)
- Timeout → Modal → Reintentar → Genera nuevo borrador

### 2. Generación HD
- Timeout → Modal → Reintentar → Genera HD de nuevo

### 3. Variaciones de Realidad
- Timeout → Modal → Reintentar → Genera variación

### 4. Videos
- Timeout → Modal → Reintentar → Genera video

## Interfaz del Modal

### Elementos Visuales
- **Icono**: ⚠️ Warning (amarillo)
- **Título**: "⏱️ La generación está tardando más de lo normal"
- **Descripción**: Explica qué está pasando
- **Contexto**: "Esto puede ocurrir cuando hay alta demanda"
- **Opciones claras**: Reintentar vs Cancelar
- **Estilo**: Consistente con el diseño de Estudio 56

### Colores
- Background: `#111827` (gris oscuro)
- Texto: `#ffffff` (blanco)
- Botón Reintentar: `#3b82f6` (azul)
- Botón Cancelar: `#ef4444` (rojo)
- Info box: `bg-blue-500/10` con borde `border-blue-500/30`

## Timeouts Actuales

### Generación de Imágenes
- **Timeout**: 600s (10 minutos)
- **Ubicación**: `services/geminiService.ts` línea 1517

### Polling fal.ai
- **Intentos**: 90 intentos × 2s = 180s (3 minutos)
- **Ubicación**: `services/falAiService.ts` línea 192

## Mejoras Futuras Posibles

### Opción A: Reintentos Automáticos
```typescript
// Reintentar automáticamente 2 veces antes de mostrar modal
let retryCount = 0;
const maxRetries = 2;

while (retryCount < maxRetries) {
  try {
    return await generateImage();
  } catch (error) {
    if (error.message.includes('Timeout') && retryCount < maxRetries - 1) {
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 5000));
      continue;
    }
    throw error;
  }
}
```

### Opción B: Sistema de Cola
```typescript
// Guardar en cola y notificar cuando esté listo
if (timeout) {
  await saveToQueue({ userId, prompt, config });
  showNotification('Tu imagen se está procesando. Te notificaremos cuando esté lista.');
}
```

### Opción C: Estimación de Tiempo
```typescript
// Mostrar tiempo estimado basado en carga del servidor
const estimatedTime = await getServerLoad();
showProgress(`Tiempo estimado: ${estimatedTime}s`);
```

## Testing

### Casos a Probar
1. ✅ Timeout en generación de borrador → Modal aparece
2. ✅ Timeout en generación HD → Modal aparece
3. ✅ Usuario hace clic en "Reintentar" → Genera de nuevo
4. ✅ Usuario hace clic en "Cancelar" → Vuelve al formulario
5. ✅ Datos se mantienen después de timeout
6. ✅ Build exitoso sin errores

## Archivos Modificados
- `App.tsx` (función `handleError`, líneas ~1774-1830)

## Fecha
8 de enero de 2026

## Notas Adicionales
- El modal usa SweetAlert2 con el estilo de Estudio 56
- No se bloquea el click fuera del modal (`allowOutsideClick: false`)
- No se puede cerrar con ESC (`allowEscapeKey: false`)
- El usuario DEBE elegir una opción (Reintentar o Cancelar)
