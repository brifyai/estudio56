# Análisis de Errores en Versión Mobile - Estudio 56

## 📋 Resumen de Errores

| # | Error | Gravedad | Archivo(s) |
|---|-------|----------|------------|
| 1 | Doble Scroll / Desbordamiento | 🔴 Alta | App.tsx, src/index.css |
| 2 | Imágenes/Videos no se renderizan | 🟠 Media | FlyerDisplay.tsx |
| 3 | Botón de calendario no responde | 🟠 Media | App.tsx |
| 4 | Footer overflow con contenido legal | 🔴 Alta | App.tsx |
| 5 | Conflicto de z-index entre capas | 🟡 Baja | App.tsx |
| 6 | Falta safe-area-inset-bottom (iOS) | 🟠 Media | App.tsx, src/index.css |

---

## 🔴 Error 1: Doble Scroll / Desbordamiento

### Descripción
El contenido del panel izquierdo hace scroll de forma independiente pero el footer también participa en el scroll, creando un efecto de doble scroll o contenido cortado.

### Archivos Afectados
- [`App.tsx`](App.tsx:1218) - Contenedor `mobile-scroll-container`
- [`App.tsx`](App.tsx:1291) - Footer fuera del contenedor de scroll

### Código Problemático

```tsx
// App.tsx línea 1218
<div className="flex-1 mobile-scroll-container custom-scrollbar min-h-0">
    <FlyerForm {...props} />
    {/* Editor de texto */}
    {imageUrl && (
      <div className="p-4 border-t border-white/10">
        <TextEditorPanel {...} />
      </div>
    )}
</div>

// Footer está FUERA del contenedor de scroll (línea 1291)
<div className="flex-shrink-0 p-4 border-t border-white/5 bg-black/20 text-[10px] text-white flex flex-col md:flex-row justify-between items-center gap-2 font-mono">
    {/* Links legales */}
</div>
```

### Causa Raíz
El footer está fuera del contenedor `.mobile-scroll-container`, lo que significa que:
1. Cuando el contenido del formulario es largo, solo el formulario hace scroll
2. Pero el footer está fijo y no tiene padding-bottom adecuado
3. En pantallas pequeñas, el contenido puede quedar detrás del footer

### Solución Sugerida
Mover el footer dentro del contenedor de scroll o agregar `pb-24` al contenedor del formulario.

---

## 🔴 Error 2: Footer Overflow con Contenido Legal

### Descripción
Los enlaces de "Privacidad", "Cookies", "Términos" y "Condiciones" colisionan con las tarjetas de "Tipo de Contenido" en pantallas pequeñas.

### Archivo Afectado
[`App.tsx`](App.tsx:1291-1316)

### Código Actual
```tsx
// Footer con position relative (correcto) pero sin padding-bottom adecuado
<div className="flex-shrink-0 p-4 border-t border-white/5 bg-black/20 text-[10px] text-white flex flex-col md:flex-row justify-between items-center gap-2 font-mono">
    <div className="flex gap-2">
        <span>V2.0.0_ESTABLE</span>
    </div>
    <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 max-w-full">
        <a href="/privacidad" className="hover:text-green-400 transition-colors px-1">Privacidad</a>
        {/* Más enlaces... */}
    </div>
</div>
```

### Causa Raíz
1. El footer usa `flex-wrap` pero el `max-w-full` no es suficiente
2. Falta `pb-safe` o `padding-bottom: env(safe-area-inset-bottom)` para iOS
3. El contenedor padre tiene altura restringida y no recalcula el espacio

### Solución Sugerida
```css
/* En src/index.css */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}

.pb-24 {
  padding-bottom: 6rem;
}
```

---

## 🟠 Error 3: Imágenes/Videos no se Renderizan

### Descripción
Las imágenes y videos generados no se muestran correctamente, especialmente en mobile.

### Archivo Afectado
[`components/FlyerDisplay.tsx`](components/FlyerDisplay.tsx:1526-1551)

### Código Problemático
```tsx
// Líneas 1526-1551
{imageUrl && isVideoUrl(imageUrl) ? (
  mediaError?.type === 'video' && mediaError.url === imageUrl ? (
    renderMediaPlaceholder()
  ) : (
    <video
      src={imageUrl}
      className="w-full h-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      crossOrigin="anonymous"  // ❌ Problema con blob URLs
      onError={(e) => handleMediaError(e, 'video')}
    />
  )
) : mediaError?.type === 'image' && mediaError.url === imageUrl ? (
  renderMediaPlaceholder()
) : (
  <img
    src={imageUrl}
    alt="Generated Content"
    className="w-full h-full object-cover"
    crossOrigin="anonymous"  // ❌ Puede fallar con URLs externas
    onError={(e) => handleMediaError(e, 'image')}
  />
)
```

### Causa Raíz
1. `crossOrigin="anonymous"` no funciona con URLs `blob:` 
2. Las URLs de blob son locales y no necesitan CORS
3. El estado `mediaError` puede persistir incorrectamente entre generaciones

### Solución Sugerida
```tsx
// No aplicar crossOrigin a blob URLs
const needsCors = imageUrl && !imageUrl.startsWith('blob:');

<img
  src={imageUrl}
  crossOrigin={needsCors ? "anonymous" : undefined}
/>
```

---

## 🟠 Error 4: Botón de Calendario No Responde

### Descripción
Al hacer clic en el botón del calendario en mobile, no se abre el panel.

### Archivo Afectado
[`App.tsx`](App.tsx:1202-1213)

### Código Actual
```tsx
// Botón del calendario
<button
  onClick={(e) => {
    e.stopPropagation();
    setShowCalendar(!showCalendar);
  }}
  className="flex items-center justify-center h-9 w-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all hover:border-white/30 active:scale-95 cursor-pointer touch-manipulation z-[60] relative min-h-[44px] min-w-[44px]"
  title="Ver calendario"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
</button>
```

### Panel del Calendario
```tsx
// Línea 1394
<aside className={`${showCalendar ? 'w-[280px] md:w-[280px]' : 'w-0'} flex-shrink-0 flex flex-col z-50 h-full py-2 pr-2 md:py-4 md:pr-4 transition-all duration-300 ${showCalendar ? 'visible' : 'invisible'}`}>
```

### Causa Raíz
1. El panel usa `w-0 invisible` cuando está cerrado, lo que puede causar problemas de renderizado
2. El `z-index` del panel es `50` pero el botón es `z-[60]` - esto está bien pero puede haber otros elementos con z-index mayor
3. La clase `invisible` puede estar interfiriendo con eventos de click

### Solución Sugerida
```tsx
// Usar opacity en lugar de visibility para transiciones suaves
<aside className={`${showCalendar ? 'w-[280px] opacity-100' : 'w-0 opacity-0 pointer-events-none'} flex-shrink-0 flex flex-col z-50 h-full py-2 pr-2 transition-all duration-300`}>
```

---

## 🟡 Error 5: Conflicto de Z-Index

### Descripción
El texto de versión V2.0.0_ESTABLE y los enlaces legales aparecen sobrepuestos a otros elementos.

### Z-Index Actual en App.tsx

| Elemento | z-index | Línea |
|----------|---------|-------|
| Background ambience | z-0 | 1157 |
| Left panel aside | z-20 | 1163 |
| Header del panel | z-20 | 1167 |
| Calendar button | z-[60] | 1207 |
| Main content | z-10 | 1321 |
| Calendar panel | z-50 | 1394 |
| Mobile menu | (no visible) | - |
| Bottom action bar (FlyerDisplay) | z-50 | 1691 |

### Causa Raíz
1. El footer no tiene z-index definido, lo que significa que usa el stacking context del padre
2. El `glass-panel` del aside puede tener su propio stacking context
3. Los elementos con `position: fixed` o `position: absolute` pueden crear nuevos contextos de apilamiento

### Solución Sugerida
```css
/* En src/index.css */
.footer-legal {
  z-index: 10;
  position: relative;
}

.calendar-button {
  z-index: 70; /* Mayor que el panel del calendario */
}
```

---

## 🟠 Error 6: Falta Safe Area (iOS)

### Descripción
El contenido queda debajo de la barra de herramientas inferior de Chrome/iOS en dispositivos móviles.

### Archivo Afectado
[`src/index.css`](src/index.css:1-21)

### Código Actual
```css
html, body {
  height: 100%;
  width: 100%;
  overflow: hidden;
  overscroll-behavior: none;
  touch-action: manipulation;
  /* ❌ Falta safe-area */
}
```

### Causa Raíz
1. No se define `padding-bottom: env(safe-area-inset-bottom)` para iOS
2. Los elementos interactivos pueden quedar detrás de la barra de navegación del navegador

### Solución Sugerida
```css
/* En src/index.css */
html, body {
  /* ...existing styles... */
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.mobile-scroll-container {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
```

---

## 📝 Checklist de Correcciones

- [ ] Mover footer dentro del contenedor de scroll O agregar `pb-24` al formulario
- [ ] Agregar `padding-bottom: env(safe-area-inset-bottom)` en CSS
- [ ] Quitar `crossOrigin="anonymous"` de URLs blob
- [ ] Cambiar `invisible` por `opacity-0 pointer-events-none` en panel calendario
- [ ] Agregar z-index explícito al footer: `z-10 relative`
- [ ] Verificar que el panel de calendario tenga `pointer-events-auto` cuando está abierto

---

## 🔧 Archivos a Modificar

1. `src/index.css` - Agregar utilidades de safe-area y corregir scroll
2. `App.tsx` - Corregir estructura de scroll, footer y panel calendario
3. `components/FlyerDisplay.tsx` - Corregir renderizado de media con CORS