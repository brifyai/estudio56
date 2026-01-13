import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { AspectRatio } from '../../types';
import CanvasToolbar from './CanvasToolbar';
import CanvasSidebar from './CanvasSidebar';
import CanvasProperties from './CanvasProperties';
import { type CanvasTemplate } from './CanvasTemplates';

interface CanvasEditorProps {
  aspectRatio: AspectRatio;
  onExport: (imageDataUrl: string) => void;
  onSave?: (canvasData: string) => void;
}

const CanvasEditor = ({
  aspectRatio,
  onExport,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Calcular dimensiones según aspect ratio
  const getDimensions = () => {
    switch (aspectRatio) {
      case '9:16':
        return { width: 450, height: 800 };
      case '1:1':
        return { width: 600, height: 600 };
      case '4:5':
        return { width: 480, height: 600 };
      case '16:9':
        return { width: 800, height: 450 };
      default:
        return { width: 450, height: 800 };
    }
  };

  const dimensions = getDimensions();

  // Inicializar canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true
    });

    fabricCanvasRef.current = canvas;

    // Event listeners
    canvas.on('selection:created', (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:updated', (e: any) => {
      setSelectedObject(e.selected?.[0] || null);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    canvas.on('object:modified', () => {
      saveHistory();
    });

    // Guardar estado inicial
    saveHistory();

    return () => {
      canvas.dispose();
    };
  }, [aspectRatio]);

  // Guardar en historial
  const saveHistory = () => {
    if (!fabricCanvasRef.current) return;
    
    const json = JSON.stringify(fabricCanvasRef.current.toJSON());
    setHistory(prev => [...prev.slice(0, historyStep + 1), json]);
    setHistoryStep(prev => prev + 1);
  };

  // Deshacer
  const undo = () => {
    if (historyStep > 0 && fabricCanvasRef.current) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      fabricCanvasRef.current.loadFromJSON(history[newStep], () => {
        fabricCanvasRef.current?.renderAll();
      });
    }
  };

  // Rehacer
  const redo = () => {
    if (historyStep < history.length - 1 && fabricCanvasRef.current) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      fabricCanvasRef.current.loadFromJSON(history[newStep], () => {
        fabricCanvasRef.current?.renderAll();
      });
    }
  };

  // Agregar texto
  const addText = (text: string = 'Texto') => {
    if (!fabricCanvasRef.current) return;

    const textObj = new fabric.IText(text, {
      left: dimensions.width / 2,
      top: dimensions.height / 2,
      fontSize: 40,
      fontFamily: 'Arial',
      fill: '#000000',
      originX: 'center',
      originY: 'center'
    });

    fabricCanvasRef.current.add(textObj);
    fabricCanvasRef.current.setActiveObject(textObj);
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Agregar forma
  const addShape = (shapeType: 'rectangle' | 'circle' | 'triangle' | 'star' | 'line') => {
    if (!fabricCanvasRef.current) return;

    let shape: fabric.Object;
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    switch (shapeType) {
      case 'rectangle':
        shape = new fabric.Rect({
          left: centerX - 50,
          top: centerY - 50,
          width: 100,
          height: 100,
          fill: '#3b82f6',
          stroke: '#1e40af',
          strokeWidth: 2
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: centerX - 50,
          top: centerY - 50,
          radius: 50,
          fill: '#10b981',
          stroke: '#059669',
          strokeWidth: 2
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          left: centerX - 50,
          top: centerY - 50,
          width: 100,
          height: 100,
          fill: '#f59e0b',
          stroke: '#d97706',
          strokeWidth: 2
        });
        break;
      case 'star':
        // Crear estrella de 5 puntas
        const points = [];
        const spikes = 5;
        const outerRadius = 50;
        const innerRadius = 25;
        
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI * i) / spikes;
          points.push({
            x: centerX + radius * Math.sin(angle),
            y: centerY - radius * Math.cos(angle)
          });
        }
        
        shape = new fabric.Polygon(points, {
          fill: '#ec4899',
          stroke: '#be185d',
          strokeWidth: 2
        });
        break;
      case 'line':
        shape = new fabric.Line([centerX - 50, centerY, centerX + 50, centerY], {
          stroke: '#6366f1',
          strokeWidth: 4,
          strokeLineCap: 'round'
        });
        break;
    }

    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.setActiveObject(shape);
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Agregar imagen
  const addImage = (url: string) => {
    if (!fabricCanvasRef.current) return;

    fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then((img: any) => {
      img.scaleToWidth(200);
      img.set({
        left: dimensions.width / 2,
        top: dimensions.height / 2,
        originX: 'center',
        originY: 'center'
      });

      fabricCanvasRef.current?.add(img);
      fabricCanvasRef.current?.setActiveObject(img);
      fabricCanvasRef.current?.renderAll();
      saveHistory();
    });
  };

  // Eliminar objeto seleccionado
  const deleteSelected = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;

    fabricCanvasRef.current.remove(selectedObject);
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Cambiar color de fondo
  const changeBackgroundColor = (color: string) => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current.backgroundColor = color;
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Cargar plantilla
  const loadTemplate = (template: CanvasTemplate) => {
    if (!fabricCanvasRef.current) return;

    // Limpiar canvas
    fabricCanvasRef.current.clear();
    
    // Cargar diseño de la plantilla
    fabricCanvasRef.current.loadFromJSON(template.design, () => {
      fabricCanvasRef.current?.renderAll();
      saveHistory();
    });
  };

  // Exportar a imagen
  const handleExport = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    onExport(dataURL);
  };

  // Guardar diseño
  const handleSave = () => {
    if (!fabricCanvasRef.current || !onSave) return;

    const json = JSON.stringify(fabricCanvasRef.current.toJSON());
    onSave(json);
  };

  // Zoom
  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(3, zoom + delta));
    setZoom(newZoom);
    fabricCanvasRef.current?.setZoom(newZoom);
    fabricCanvasRef.current?.renderAll();
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Toolbar */}
      <CanvasToolbar
        onUndo={undo}
        onRedo={redo}
        canUndo={historyStep > 0}
        canRedo={historyStep < history.length - 1}
        zoom={zoom}
        onZoomIn={() => handleZoom(0.1)}
        onZoomOut={() => handleZoom(-0.1)}
        onExport={handleExport}
        onSave={handleSave}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <CanvasSidebar
          onAddText={addText}
          onAddShape={addShape}
          onAddImage={addImage}
          onChangeBackground={changeBackgroundColor}
          onLoadTemplate={loadTemplate}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center bg-gray-800 overflow-auto p-4">
          <div className="relative" style={{ transform: `scale(${zoom})` }}>
            <canvas ref={canvasRef} className="shadow-2xl" />
          </div>
        </div>

        {/* Properties Panel */}
        {selectedObject && (
          <CanvasProperties
            selectedObject={selectedObject}
            onDelete={deleteSelected}
            onUpdate={() => {
              fabricCanvasRef.current?.renderAll();
              saveHistory();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CanvasEditor;
