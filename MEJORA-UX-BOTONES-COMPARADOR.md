# Mejora UX: Centrado de Botones en Comparador de Imágenes

## Cambio Realizado
Se mejoró la disposición visual de los botones en el comparador de imágenes para una mejor experiencia de usuario.

## Problema Anterior
- El botón "✕ CERRAR COMPARACIÓN (IMAGEN)" estaba posicionado en la esquina superior izquierda (`top-6 left-4 lg:left-8`)
- El botón "Genera nuevo borrador" estaba centrado en la parte superior
- Esta disposición asimétrica dificultaba la visualización y navegación

## Solución Implementada
Se centraron ambos botones verticalmente para mejorar la simetría y usabilidad:

### Botón "Genera nuevo borrador" (App.tsx)
- Ya estaba centrado: `left-1/2 -translate-x-1/2`
- Posición: `top-4`

### Botón "✕ CERRAR COMPARACIÓN" (FlyerDisplay.tsx)
- **ANTES**: `top-6 left-4 lg:left-8` (esquina superior izquierda)
- **DESPUÉS**: `top-[72px] left-1/2 -translate-x-1/2` (centrado debajo del botón de generar)

## Resultado Visual
```
┌─────────────────────────────────┐
│                                 │
│   [Genera nuevo borrador]       │  ← top-4, centrado
│                                 │
│   [✕ CERRAR COMPARACIÓN]        │  ← top-[72px], centrado
│                                 │
│     [Imagen Draft] VS [HD]      │
│                                 │
└─────────────────────────────────┘
```

## Beneficios
✅ Mejor simetría visual
✅ Botones más fáciles de encontrar
✅ Jerarquía visual clara (generar → cerrar)
✅ Experiencia de usuario más intuitiva

## Archivos Modificados
- `components/FlyerDisplay.tsx` (línea ~1714)

## Fecha
8 de enero de 2026
