# Plan de Implementación - Modo Canva

## 🎯 Objetivo
Crear un editor visual tipo Canva que permita a los usuarios diseñar flyers mediante drag & drop.

## 📚 Librería Elegida: Fabric.js

### Instalación
```bash
npm install fabric
npm install @types/fabric --save-dev
```

## 🏗️ Arquitectura

### Estructura de Archivos
```
components/
├── canvas/
│   ├── CanvasEditor.tsx          # Editor principal
│   ├── CanvasToolbar.tsx         # Barra de herramientas superior
│   ├── CanvasSidebar.tsx         # Panel lateral con elementos
│   ├── CanvasLayers.tsx          # Panel de capas
│   ├── CanvasProperties.tsx      # Panel de propiedades del elemento seleccionado
│   └── elements/
│       ├── TextElement.tsx       # Elemento de texto
│       ├── ShapeElement.tsx      # Formas (rectángulo, círculo, etc)
│       ├── ImageElement.tsx      # Imágenes
│       └── IconElement.tsx       # Iconos
├── templates/
│   └── CanvasTemplates.tsx       # Plantillas prediseñadas
└── CreationModeSelector.tsx      # Ya existe
```

### Tipos y Interfaces
```typescript
// types.ts - Agregar estos tipos

export interface CanvasElement {
  id: string;
  type: 'text' | 'shape' | 'image' | 'icon';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
}

export interface TextElement extends CanvasElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  color: string;
  backgroundColor?: string;
  lineHeight: number;
}

export interface ShapeElement extends CanvasElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'line';
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface ImageElement extends CanvasElement {
  type: 'image';
  src: string;
  filters?: string[];
}

export interface CanvasDesign {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: CanvasElement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CanvasTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  design: CanvasDesign;
}
```

## 📝 Roadmap de Implementación

### Sprint 1: Setup Básico (1 semana)
- [x] Instalar Fabric.js
- [ ] Crear componente CanvasEditor básico
- [ ] Implementar canvas con dimensiones según aspect ratio
- [ ] Agregar toolbar básico
- [ ] Implementar zoom y pan

### Sprint 2: Elementos de Texto (1 semana)
- [ ] Agregar texto al canvas
- [ ] Editor de propiedades de texto (fuente, tamaño, color)
- [ ] Alineación de texto
- [ ] Texto editable con doble clic
- [ ] Estilos de texto predefinidos

### Sprint 3: Formas y Colores (1 semana)
- [ ] Agregar formas básicas (rectángulo, círculo, línea)
- [ ] Selector de colores
- [ ] Gradientes
- [ ] Bordes y sombras
- [ ] Opacidad

### Sprint 4: Imágenes (1 semana)
- [ ] Subir imágenes al canvas
- [ ] Recortar imágenes
- [ ] Filtros básicos
- [ ] Máscaras
- [ ] Integración con logos y productos existentes

### Sprint 5: Capas y Organización (3-4 días)
- [ ] Panel de capas
- [ ] Reordenar capas (z-index)
- [ ] Bloquear/desbloquear elementos
- [ ] Mostrar/ocultar elementos
- [ ] Agrupar elementos

### Sprint 6: Plantillas (3-4 días)
- [ ] Crear 10-15 plantillas base
- [ ] Selector de plantillas
- [ ] Aplicar plantilla al canvas
- [ ] Guardar diseño como plantilla

### Sprint 7: Exportación (3-4 días)
- [ ] Exportar a imagen (PNG/JPG)
- [ ] Guardar diseño en JSON
- [ ] Cargar diseño guardado
- [ ] Integración con generación de IA

### Sprint 8: UX y Pulido (1 semana)
- [ ] Atajos de teclado
- [ ] Deshacer/Rehacer
- [ ] Guías de alineación
- [ ] Snap to grid
- [ ] Responsive design
- [ ] Tutoriales interactivos

## 🎨 Funcionalidades Clave

### Toolbar (Barra Superior)
```
[Archivo] [Editar] [Ver] [Ayuda]
[Deshacer] [Rehacer] | [Zoom: 100%] | [Exportar]
```

### Sidebar Izquierdo (Elementos)
```
📝 Texto
  - Título
  - Subtítulo
  - Párrafo
  - Texto decorativo

🔷 Formas
  - Rectángulo
  - Círculo
  - Triángulo
  - Línea
  - Estrella

🖼️ Imágenes
  - Subir imagen
  - Desde URL
  - Galería

🎨 Fondos
  - Color sólido
  - Gradiente
  - Imagen de fondo

📐 Plantillas
  - Retail
  - Restaurante
  - Evento
  - Promoción
```

### Panel Derecho (Propiedades)
```
Cuando se selecciona un elemento:

TEXTO:
- Fuente
- Tamaño
- Color
- Alineación
- Espaciado
- Efectos

FORMA:
- Color de relleno
- Color de borde
- Grosor de borde
- Opacidad
- Sombra

IMAGEN:
- Filtros
- Recortar
- Opacidad
- Efectos
```

### Panel Inferior (Capas)
```
Capas:
[👁️] [🔒] Capa 3 - Texto "OFERTA"
[👁️] [🔒] Capa 2 - Rectángulo azul
[👁️] [🔒] Capa 1 - Fondo
```

## 💾 Persistencia de Datos

### Guardar Diseño
```typescript
interface SavedDesign {
  id: string;
  userId: string;
  name: string;
  canvasData: string; // JSON serializado de Fabric.js
  thumbnail: string; // Base64 de preview
  aspectRatio: AspectRatio;
  createdAt: Date;
  updatedAt: Date;
}

// Tabla en Supabase
CREATE TABLE canvas_designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  canvas_data JSONB NOT NULL,
  thumbnail TEXT,
  aspect_ratio VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔄 Integración con IA

### Flujo de Trabajo
1. Usuario diseña en modo Canva
2. Al hacer clic en "Generar":
   - Exportar canvas a imagen PNG
   - Usar imagen como referencia para IA
   - Opción: "Mejorar con IA" (image-to-image)
   - Opción: "Usar como base" (mantener diseño exacto)

### Código de Integración
```typescript
const handleGenerateFromCanvas = async () => {
  // 1. Exportar canvas a imagen
  const canvasImage = canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 2 // 2x para mejor calidad
  });
  
  // 2. Opción A: Usar como referencia para IA
  const result = await generateFlyerImage(
    "Mejorar este diseño manteniendo la composición",
    styleKey,
    aspectRatio,
    'draft',
    seed,
    undefined,
    false,
    false,
    undefined,
    undefined,
    canvasImage // Imagen de referencia
  );
  
  // 3. Opción B: Usar diseño exacto (sin IA)
  setImageUrl(canvasImage);
  setDraftImageUrl(canvasImage);
};
```

## 🎯 MVP (Mínimo Producto Viable)

Para lanzar rápido, el MVP debe incluir:

1. ✅ Canvas básico con dimensiones correctas
2. ✅ Agregar texto con estilos básicos
3. ✅ Agregar formas (rectángulo, círculo)
4. ✅ Cambiar colores
5. ✅ Mover y redimensionar elementos
6. ✅ 5 plantillas básicas
7. ✅ Exportar a imagen
8. ✅ Integración con generación actual

**Tiempo estimado MVP: 2-3 semanas**

## 📚 Recursos y Referencias

### Documentación
- [Fabric.js Docs](http://fabricjs.com/docs/)
- [Fabric.js Demos](http://fabricjs.com/demos/)
- [Fabric.js GitHub](https://github.com/fabricjs/fabric.js)

### Tutoriales
- [Building a Canvas Editor](https://medium.com/@fabricjs/building-a-canvas-editor-with-fabric-js-part-1-8c5e3e3e3e3e)
- [Fabric.js Tutorial](https://www.youtube.com/watch?v=AQaTbB1NkZs)

### Inspiración
- [Canva](https://www.canva.com)
- [Figma](https://www.figma.com)
- [Polotno Studio](https://studio.polotno.com/)

## 🚀 Siguiente Paso

Empezar con el MVP:
1. Instalar Fabric.js
2. Crear CanvasEditor básico
3. Implementar agregar texto
4. Implementar agregar formas
5. Exportar a imagen

¿Quieres que empiece con la implementación del MVP?
