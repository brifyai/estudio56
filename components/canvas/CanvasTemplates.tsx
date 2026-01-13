import { AspectRatio } from '../../types';

export interface CanvasTemplate {
  id: string;
  name: string;
  category: 'retail' | 'restaurant' | 'event' | 'promotion' | 'service';
  thumbnail: string;
  aspectRatio: AspectRatio;
  design: any; // JSON de Fabric.js
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: 'retail-sale',
    name: 'Oferta Retail',
    category: 'retail',
    thumbnail: '',
    aspectRatio: '1:1',
    design: {
      version: '5.3.0',
      objects: [
        // Fondo
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 600,
          height: 600,
          fill: '#3b82f6',
          selectable: false
        },
        // Círculo decorativo
        {
          type: 'circle',
          left: 450,
          top: 50,
          radius: 80,
          fill: '#60a5fa',
          opacity: 0.5
        },
        // Título
        {
          type: 'i-text',
          left: 300,
          top: 200,
          text: 'OFERTA',
          fontSize: 72,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        },
        // Subtítulo
        {
          type: 'i-text',
          left: 300,
          top: 280,
          text: '50% OFF',
          fontSize: 96,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#fbbf24',
          originX: 'center',
          originY: 'center'
        },
        // Descripción
        {
          type: 'i-text',
          left: 300,
          top: 380,
          text: 'En productos seleccionados',
          fontSize: 24,
          fontFamily: 'Arial',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        }
      ]
    }
  },
  {
    id: 'restaurant-menu',
    name: 'Menú Restaurante',
    category: 'restaurant',
    thumbnail: '',
    aspectRatio: '1:1',
    design: {
      version: '5.3.0',
      objects: [
        // Fondo
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 600,
          height: 600,
          fill: '#1f2937',
          selectable: false
        },
        // Rectángulo superior
        {
          type: 'rect',
          left: 50,
          top: 50,
          width: 500,
          height: 150,
          fill: '#f59e0b',
          rx: 10,
          ry: 10
        },
        // Título
        {
          type: 'i-text',
          left: 300,
          top: 125,
          text: 'MENÚ DEL DÍA',
          fontSize: 48,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        },
        // Plato 1
        {
          type: 'i-text',
          left: 100,
          top: 280,
          text: '🍝 Pasta Carbonara',
          fontSize: 28,
          fontFamily: 'Arial',
          fill: '#ffffff'
        },
        // Plato 2
        {
          type: 'i-text',
          left: 100,
          top: 340,
          text: '🥗 Ensalada César',
          fontSize: 28,
          fontFamily: 'Arial',
          fill: '#ffffff'
        },
        // Plato 3
        {
          type: 'i-text',
          left: 100,
          top: 400,
          text: '🍰 Postre del día',
          fontSize: 28,
          fontFamily: 'Arial',
          fill: '#ffffff'
        },
        // Precio
        {
          type: 'i-text',
          left: 300,
          top: 500,
          text: '$12.990',
          fontSize: 56,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#10b981',
          originX: 'center',
          originY: 'center'
        }
      ]
    }
  },
  {
    id: 'event-party',
    name: 'Evento/Fiesta',
    category: 'event',
    thumbnail: '',
    aspectRatio: '9:16',
    design: {
      version: '5.3.0',
      objects: [
        // Fondo
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 450,
          height: 800,
          fill: '#7c3aed',
          selectable: false
        },
        // Estrella decorativa 1
        {
          type: 'polygon',
          left: 80,
          top: 100,
          points: [
            { x: 0, y: -50 },
            { x: 15, y: -15 },
            { x: 50, y: -10 },
            { x: 20, y: 15 },
            { x: 30, y: 50 },
            { x: 0, y: 25 },
            { x: -30, y: 50 },
            { x: -20, y: 15 },
            { x: -50, y: -10 },
            { x: -15, y: -15 }
          ],
          fill: '#fbbf24',
          opacity: 0.8
        },
        // Título
        {
          type: 'i-text',
          left: 225,
          top: 300,
          text: 'GRAN',
          fontSize: 64,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        },
        {
          type: 'i-text',
          left: 225,
          top: 380,
          text: 'FIESTA',
          fontSize: 72,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#fbbf24',
          originX: 'center',
          originY: 'center'
        },
        // Fecha
        {
          type: 'i-text',
          left: 225,
          top: 500,
          text: 'Sábado 20 de Enero',
          fontSize: 28,
          fontFamily: 'Arial',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        },
        // Hora
        {
          type: 'i-text',
          left: 225,
          top: 550,
          text: '22:00 hrs',
          fontSize: 32,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        }
      ]
    }
  },
  {
    id: 'promo-flash',
    name: 'Promoción Flash',
    category: 'promotion',
    thumbnail: '',
    aspectRatio: '1:1',
    design: {
      version: '5.3.0',
      objects: [
        // Fondo
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 600,
          height: 600,
          fill: '#ef4444',
          selectable: false
        },
        // Círculo amarillo
        {
          type: 'circle',
          left: 250,
          top: 150,
          radius: 120,
          fill: '#fbbf24',
          stroke: '#ffffff',
          strokeWidth: 8
        },
        // Texto dentro del círculo
        {
          type: 'i-text',
          left: 300,
          top: 230,
          text: '70%',
          fontSize: 72,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        },
        {
          type: 'i-text',
          left: 300,
          top: 290,
          text: 'OFF',
          fontSize: 48,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        },
        // Título
        {
          type: 'i-text',
          left: 300,
          top: 450,
          text: 'FLASH SALE',
          fontSize: 56,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        },
        // Subtítulo
        {
          type: 'i-text',
          left: 300,
          top: 520,
          text: 'Solo por 24 horas',
          fontSize: 24,
          fontFamily: 'Arial',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        }
      ]
    }
  },
  {
    id: 'service-clean',
    name: 'Servicio Limpio',
    category: 'service',
    thumbnail: '',
    aspectRatio: '1:1',
    design: {
      version: '5.3.0',
      objects: [
        // Fondo
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 600,
          height: 600,
          fill: '#ffffff',
          selectable: false
        },
        // Rectángulo superior
        {
          type: 'rect',
          left: 0,
          top: 0,
          width: 600,
          height: 200,
          fill: '#10b981',
          selectable: false
        },
        // Título
        {
          type: 'i-text',
          left: 300,
          top: 100,
          text: 'SERVICIOS',
          fontSize: 48,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        },
        // Servicio 1
        {
          type: 'i-text',
          left: 100,
          top: 280,
          text: '✓ Instalación profesional',
          fontSize: 28,
          fontFamily: 'Arial',
          fill: '#1f2937'
        },
        // Servicio 2
        {
          type: 'i-text',
          left: 100,
          top: 340,
          text: '✓ Garantía extendida',
          fontSize: 28,
          fontFamily: 'Arial',
          fill: '#1f2937'
        },
        // Servicio 3
        {
          type: 'i-text',
          left: 100,
          top: 400,
          text: '✓ Soporte 24/7',
          fontSize: 28,
          fontFamily: 'Arial',
          fill: '#1f2937'
        },
        // CTA
        {
          type: 'rect',
          left: 150,
          top: 500,
          width: 300,
          height: 60,
          fill: '#10b981',
          rx: 30,
          ry: 30
        },
        {
          type: 'i-text',
          left: 300,
          top: 530,
          text: 'Contáctanos',
          fontSize: 28,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#ffffff',
          originX: 'center',
          originY: 'center'
        }
      ]
    }
  }
];

export const getTemplatesByCategory = (category: string) => {
  return CANVAS_TEMPLATES.filter(t => t.category === category);
};

export const getTemplateById = (id: string) => {
  return CANVAS_TEMPLATES.find(t => t.id === id);
};
