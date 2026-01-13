interface CanvasToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExport: () => void;
  onSave?: () => void;
  onToggleLayers?: () => void; // NEW: Toggle panel de capas
  showLayers?: boolean; // NEW: Estado del panel de capas
}

const CanvasToolbar = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  onExport,
  onSave,
  onToggleLayers,
  showLayers
}) => {
  return (
    <div className="h-14 bg-gray-950 border-b border-white/10 flex items-center justify-between px-4">
      {/* Left: Undo/Redo */}
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Deshacer (Ctrl+Z)"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Rehacer (Ctrl+Y)"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </button>
      </div>

      {/* Center: Zoom */}
      <div className="flex items-center gap-2">
        <button
          onClick={onZoomOut}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Alejar"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
        <span className="text-white text-sm font-mono min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={onZoomIn}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title="Acercar"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </button>
      </div>

      {/* Right: Export/Save */}
      <div className="flex items-center gap-2">
        {onToggleLayers && (
          <button
            onClick={onToggleLayers}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              showLayers
                ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/30'
                : 'bg-white/5 hover:bg-white/10 text-white/60 border-white/10'
            }`}
            title={showLayers ? 'Ocultar capas' : 'Mostrar capas'}
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Capas
          </button>
        )}
        {onSave && (
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm font-medium transition-colors border border-blue-500/30"
          >
            💾 Guardar
          </button>
        )}
        <button
          onClick={onExport}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ⬇️ Exportar
        </button>
      </div>
    </div>
  );
};

export default CanvasToolbar;
