import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import Swal from 'sweetalert2';
import { AspectRatio } from '../../types';
import CanvasToolbar from './CanvasToolbar';
import CanvasSidebar from './CanvasSidebar';
import CanvasProperties from './CanvasProperties';
import CanvasLayers from './CanvasLayers';
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
  const [showLayers, setShowLayers] = useState(true); // NEW: Mostrar/ocultar panel de capas

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

    // Mostrar opciones de exportación con SweetAlert2
    Swal.fire({
      title: 'Exportar Diseño',
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-white mb-2">Formato:</label>
            <select id="export-format" class="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2">
              <option value="png">PNG (Recomendado)</option>
              <option value="jpg">JPG</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-white mb-2">Calidad:</label>
            <select id="export-quality" class="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2">
              <option value="1">Normal (1x)</option>
              <option value="2" selected>Alta (2x)</option>
              <option value="3">Muy Alta (3x)</option>
            </select>
          </div>
        </div>
      `,
      background: '#1f2937',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonText: 'Exportar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      preConfirm: () => {
        const format = (document.getElementById('export-format') as HTMLSelectElement).value;
        const quality = parseInt((document.getElementById('export-quality') as HTMLSelectElement).value);
        return { format, quality };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { format, quality } = result.value;
        
        const dataURL = fabricCanvasRef.current!.toDataURL({
          format: format,
          quality: format === 'jpg' ? 0.9 : 1,
          multiplier: quality
        });

        onExport(dataURL);
        
        // Mostrar confirmación
        Swal.fire({
          title: '¡Exportado!',
          text: `Diseño exportado en ${format.toUpperCase()} (${quality}x)`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#ffffff'
        });
      }
    });
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
        onToggleLayers={() => setShowLayers(!showLayers)}
        showLayers={showLayers}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <CanvasSidebar
          onAddText={addText}
          onAddShape={addShape}
          onAddImage={addImage}
          onChangeBackground={changeBackgroundColor}
          onLoadTemplate={loadTemplate}
          onLoadSavedDesign={(canvasData) => {
            if (!fabricCanvasRef.current) return;
            
            try {
              fabricCanvasRef.current.loadFromJSON(canvasData, () => {
                fabricCanvasRef.current?.renderAll();
                saveHistory();
                console.log('✅ Diseño cargado correctamente');
              });
            } catch (error) {
              console.error('❌ Error cargando diseño:', error);
              alert('Error al cargar el diseño guardado');
            }
          }}
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
        
        {/* Layers Panel */}
        {showLayers && (
          <CanvasLayers
            canvas={fabricCanvasRef.current}
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
