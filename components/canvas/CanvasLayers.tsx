import { useState, useEffect } from 'react';
import * as fabric from 'fabric';

interface CanvasLayersProps {
  canvas: fabric.Canvas | null;
  onUpdate: () => void;
}

interface LayerInfo {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  locked: boolean;
  index: number;
}

const CanvasLayers = ({ canvas, onUpdate }: CanvasLayersProps) => {
  const [layers, setLayers] = useState<LayerInfo[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Actualizar lista de capas cuando cambia el canvas
  useEffect(() => {
    if (!canvas) return;

    const updateLayers = () => {
      const objects = canvas.getObjects();
      const layerList: LayerInfo[] = objects.map((obj, index) => {
        const type = obj.type || 'object';
        let name = type.charAt(0).toUpperCase() + type.slice(1);
        
        // Nombres más descriptivos según el tipo
        if (type === 'i-text' || type === 'text') {
          const textObj = obj as fabric.IText;
          name = `Texto: ${textObj.text?.substring(0, 20) || 'Sin texto'}`;
        } else if (type === 'rect') {
          name = 'Rectángulo';
        } else if (type === 'circle') {
          name = 'Círculo';
        } else if (type === 'triangle') {
          name = 'Triángulo';
        } else if (type === 'polygon') {
          name = 'Estrella';
        } else if (type === 'line') {
          name = 'Línea';
        } else if (type === 'image') {
          name = 'Imagen';
        }

        return {
          id: (obj as any).data?.id || `layer-${index}`,
          name,
          type,
          visible: obj.visible !== false,
          locked: obj.selectable === false,
          index
        };
      }).reverse(); // Invertir para mostrar las capas superiores primero

      setLayers(layerList);
    };

    updateLayers();

    // Escuchar eventos del canvas
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    canvas.on('selection:created', (e: any) => {
      const obj = e.selected?.[0];
      if (obj) {
        const index = canvas.getObjects().indexOf(obj);
        setSelectedLayerId(`layer-${index}`);
      }
    });
    canvas.on('selection:cleared', () => {
      setSelectedLayerId(null);
    });

    return () => {
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
    };
  }, [canvas]);

  // Seleccionar capa
  const selectLayer = (layerId: string) => {
    if (!canvas) return;
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const objects = canvas.getObjects();
    const realIndex = objects.length - 1 - layer.index;
    const obj = objects[realIndex];
    
    if (obj) {
      canvas.setActiveObject(obj);
      canvas.renderAll();
      setSelectedLayerId(layerId);
    }
  };

  // Toggle visibilidad
  const toggleVisibility = (layerId: string) => {
    if (!canvas) return;
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const objects = canvas.getObjects();
    const realIndex = objects.length - 1 - layer.index;
    const obj = objects[realIndex];
    
    if (obj) {
      obj.visible = !obj.visible;
      canvas.renderAll();
      onUpdate();
    }
  };

  // Toggle bloqueo
  const toggleLock = (layerId: string) => {
    if (!canvas) return;
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const objects = canvas.getObjects();
    const realIndex = objects.length - 1 - layer.index;
    const obj = objects[realIndex];
    
    if (obj) {
      obj.selectable = !obj.selectable;
      obj.evented = !obj.evented;
      canvas.renderAll();
      onUpdate();
    }
  };

  // Eliminar capa
  const deleteLayer = (layerId: string) => {
    if (!canvas) return;
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const objects = canvas.getObjects();
    const realIndex = objects.length - 1 - layer.index;
    const obj = objects[realIndex];
    
    if (obj && confirm(`¿Eliminar capa "${layer.name}"?`)) {
      canvas.remove(obj);
      canvas.renderAll();
      onUpdate();
    }
  };

  // Mover capa arriba
  const moveLayerUp = (layerId: string) => {
    if (!canvas) return;
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const objects = canvas.getObjects();
    const realIndex = objects.length - 1 - layer.index;
    const obj = objects[realIndex];
    
    if (obj && realIndex < objects.length - 1) {
      canvas.bringObjectForward(obj);
      canvas.renderAll();
      onUpdate();
    }
  };

  // Mover capa abajo
  const moveLayerDown = (layerId: string) => {
    if (!canvas) return;
    
    const layer = layers.find(l => l.id === layerId);
    if (!layer) return;

    const objects = canvas.getObjects();
    const realIndex = objects.length - 1 - layer.index;
    const obj = objects[realIndex];
    
    if (obj && realIndex > 0) {
      canvas.sendObjectBackwards(obj);
      canvas.renderAll();
      onUpdate();
    }
  };

  return (
    <div className="w-64 bg-gray-900 border-l border-white/10 overflow-y-auto">
      <div className="p-4">
        <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Capas ({layers.length})
        </h3>

        {layers.length === 0 ? (
          <div className="text-white/50 text-xs text-center py-8">
            No hay capas aún
          </div>
        ) : (
          <div className="space-y-1">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={`group p-2 rounded-lg transition-colors cursor-pointer ${
                  selectedLayerId === layer.id
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-transparent'
                }`}
                onClick={() => selectLayer(layer.id)}
              >
                <div className="flex items-center gap-2">
                  {/* Visibilidad */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(layer.id);
                    }}
                    className="text-white/60 hover:text-white transition-colors"
                    title={layer.visible ? 'Ocultar' : 'Mostrar'}
                  >
                    {layer.visible ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>

                  {/* Bloqueo */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLock(layer.id);
                    }}
                    className="text-white/60 hover:text-white transition-colors"
                    title={layer.locked ? 'Desbloquear' : 'Bloquear'}
                  >
                    {layer.locked ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>

                  {/* Nombre */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-medium truncate">
                      {layer.name}
                    </div>
                  </div>

                  {/* Controles (visible al hover) */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Mover arriba */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayerUp(layer.id);
                      }}
                      className="text-white/60 hover:text-white transition-colors"
                      title="Mover arriba"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>

                    {/* Mover abajo */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayerDown(layer.id);
                      }}
                      className="text-white/60 hover:text-white transition-colors"
                      title="Mover abajo"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer.id);
                      }}
                      className="text-red-400/60 hover:text-red-400 transition-colors"
                      title="Eliminar"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CanvasLayers;
