import { useState, useEffect } from 'react';

interface CanvasPropertiesProps {
  selectedObject: any;
  onDelete: () => void;
  onUpdate: () => void;
}

const CanvasProperties = ({
  selectedObject,
  onDelete,
  onUpdate
}: CanvasPropertiesProps) => {
  const [opacity, setOpacity] = useState(100);
  const [fill, setFill] = useState('#000000');
  const [fontSize, setFontSize] = useState(40);
  const [fontFamily, setFontFamily] = useState('Arial');

  useEffect(() => {
    if (selectedObject) {
      setOpacity(Math.round((selectedObject.opacity || 1) * 100));
      if (selectedObject.fill) {
        setFill(selectedObject.fill);
      }
      if (selectedObject.fontSize) {
        setFontSize(selectedObject.fontSize);
      }
      if (selectedObject.fontFamily) {
        setFontFamily(selectedObject.fontFamily);
      }
    }
  }, [selectedObject]);

  const handleOpacityChange = (value: number) => {
    setOpacity(value);
    if (selectedObject) {
      selectedObject.set('opacity', value / 100);
      onUpdate();
    }
  };

  const handleFillChange = (color: string) => {
    setFill(color);
    if (selectedObject) {
      selectedObject.set('fill', color);
      onUpdate();
    }
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    if (selectedObject && selectedObject.type === 'i-text') {
      selectedObject.set('fontSize', size);
      onUpdate();
    }
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    if (selectedObject && selectedObject.type === 'i-text') {
      selectedObject.set('fontFamily', family);
      onUpdate();
    }
  };

  if (!selectedObject) return null;

  const isText = selectedObject.type === 'i-text' || selectedObject.type === 'text';
  const isShape = selectedObject.type === 'rect' || selectedObject.type === 'circle' || selectedObject.type === 'triangle';

  return (
    <div className="w-64 bg-gray-900 border-l border-white/10 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-white text-sm font-bold">Propiedades</h3>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
            title="Eliminar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Opacidad */}
        <div>
          <label className="text-white text-xs font-medium mb-2 block">
            Opacidad: {opacity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => handleOpacityChange(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Color (para texto y formas) */}
        {(isText || isShape) && (
          <div>
            <label className="text-white text-xs font-medium mb-2 block">
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fill}
                onChange={(e) => handleFillChange(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={fill}
                onChange={(e) => handleFillChange(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 text-white text-sm rounded px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* Propiedades de texto */}
        {isText && (
          <>
            <div>
              <label className="text-white text-xs font-medium mb-2 block">
                Tamaño: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="120"
                value={fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-white text-xs font-medium mb-2 block">
                Fuente
              </label>
              <select
                value={fontFamily}
                onChange={(e) => handleFontFamilyChange(e.target.value)}
                className="w-full bg-black/40 border border-white/10 text-white text-sm rounded px-3 py-2"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Impact">Impact</option>
              </select>
            </div>
          </>
        )}

        {/* Posición */}
        <div>
          <label className="text-white text-xs font-medium mb-2 block">
            Posición
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-white/50">X:</span>
              <span className="text-white ml-2">{Math.round(selectedObject.left || 0)}</span>
            </div>
            <div>
              <span className="text-white/50">Y:</span>
              <span className="text-white ml-2">{Math.round(selectedObject.top || 0)}</span>
            </div>
          </div>
        </div>

        {/* Tamaño */}
        <div>
          <label className="text-white text-xs font-medium mb-2 block">
            Tamaño
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-white/50">W:</span>
              <span className="text-white ml-2">{Math.round(selectedObject.width * (selectedObject.scaleX || 1))}</span>
            </div>
            <div>
              <span className="text-white/50">H:</span>
              <span className="text-white ml-2">{Math.round(selectedObject.height * (selectedObject.scaleY || 1))}</span>
            </div>
          </div>
        </div>

        {/* Rotación */}
        <div>
          <label className="text-white text-xs font-medium mb-2 block">
            Rotación: {Math.round(selectedObject.angle || 0)}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={selectedObject.angle || 0}
            onChange={(e) => {
              selectedObject.set('angle', Number(e.target.value));
              onUpdate();
            }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasProperties;
