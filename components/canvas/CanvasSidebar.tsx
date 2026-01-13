import { useState } from 'react';
import { CANVAS_TEMPLATES, type CanvasTemplate } from './CanvasTemplates';

interface CanvasSidebarProps {
  onAddText: (text?: string) => void;
  onAddShape: (shapeType: 'rectangle' | 'circle' | 'triangle' | 'star' | 'line') => void;
  onAddImage: (url: string) => void;
  onChangeBackground: (color: string) => void;
  onLoadTemplate: (template: CanvasTemplate) => void;
  onLoadSavedDesign?: (canvasData: string) => void; // NEW: Cargar diseño guardado
}

const CanvasSidebar = ({
  onAddText,
  onAddShape,
  onAddImage,
  onChangeBackground,
  onLoadTemplate,
  onLoadSavedDesign
}: CanvasSidebarProps) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [hasSavedDesign, setHasSavedDesign] = useState(false);
  
  // Verificar si hay diseño guardado en localStorage
  useState(() => {
    const savedDesign = localStorage.getItem('canvas-design-last');
    setHasSavedDesign(!!savedDesign);
  });
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onAddImage(url);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Cargar diseño guardado desde localStorage
  const handleLoadSavedDesign = () => {
    const savedDesign = localStorage.getItem('canvas-design-last');
    const timestamp = localStorage.getItem('canvas-design-timestamp');
    
    if (savedDesign && onLoadSavedDesign) {
      const date = timestamp ? new Date(timestamp).toLocaleString('es-CL') : 'Desconocida';
      
      // Confirmar antes de cargar
      if (confirm(`¿Cargar diseño guardado?\n\nÚltima modificación: ${date}\n\nEsto reemplazará el diseño actual.`)) {
        onLoadSavedDesign(savedDesign);
        console.log('✅ Diseño cargado desde localStorage');
      }
    }
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-white/10 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Cargar Diseño Guardado */}
        {hasSavedDesign && onLoadSavedDesign && (
          <div>
            <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Diseño Guardado
            </h3>
            <button
              onClick={handleLoadSavedDesign}
              className="w-full p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-white text-sm transition-colors border border-green-500/30 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Cargar Diseño Anterior
            </button>
          </div>
        )}
        
        {/* Plantillas */}
        <div>
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
            Plantillas
          </h3>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-white text-sm transition-colors border border-purple-500/30"
          >
            {showTemplates ? '✕ Cerrar' : '📋 Ver Plantillas'}
          </button>
          
          {showTemplates && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {CANVAS_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onLoadTemplate(template);
                    setShowTemplates(false);
                  }}
                  className="w-full p-2 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors"
                >
                  <div className="text-white text-xs font-medium">{template.name}</div>
                  <div className="text-white/50 text-[10px] capitalize">{template.category}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Texto */}
        <div>
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Texto
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => onAddText('Título')}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-left text-sm transition-colors"
            >
              <div className="font-bold text-lg">Título</div>
              <div className="text-xs text-white/50">Texto grande</div>
            </button>
            <button
              onClick={() => onAddText('Subtítulo')}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-left text-sm transition-colors"
            >
              <div className="font-semibold">Subtítulo</div>
              <div className="text-xs text-white/50">Texto mediano</div>
            </button>
            <button
              onClick={() => onAddText('Texto')}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-left text-sm transition-colors"
            >
              <div className="text-sm">Texto</div>
              <div className="text-xs text-white/50">Texto normal</div>
            </button>
          </div>
        </div>

        {/* Formas */}
        <div>
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
            Formas
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onAddShape('rectangle')}
              className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
              title="Rectángulo"
            >
              <div className="w-8 h-6 bg-blue-500 rounded"></div>
            </button>
            <button
              onClick={() => onAddShape('circle')}
              className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
              title="Círculo"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            </button>
            <button
              onClick={() => onAddShape('triangle')}
              className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
              title="Triángulo"
            >
              <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] border-b-orange-500"></div>
            </button>
            <button
              onClick={() => onAddShape('star')}
              className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
              title="Estrella"
            >
              <svg className="w-8 h-8 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
            <button
              onClick={() => onAddShape('line')}
              className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
              title="Línea"
            >
              <div className="w-8 h-0.5 bg-indigo-500 rounded"></div>
            </button>
          </div>
        </div>

        {/* Imágenes */}
        <div>
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Imágenes
          </h3>
          <div className="space-y-2">
            <label className="block w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Subir imagen
              </div>
            </label>
          </div>
        </div>

        {/* Fondo */}
        <div>
          <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Fondo
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {['#ffffff', '#000000', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
              <button
                key={color}
                onClick={() => onChangeBackground(color)}
                className="aspect-square rounded-lg border-2 border-white/20 hover:border-white/40 transition-colors"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasSidebar;
