import React from 'react';
import { CreationMode, CREATION_MODES } from '../types';

interface CreationModeSelectorProps {
  selectedMode: CreationMode;
  onModeChange: (mode: CreationMode) => void;
}

const CreationModeSelector: React.FC<CreationModeSelectorProps> = ({
  selectedMode,
  onModeChange
}) => {
  return (
    <div className="mb-4">
      <div className="flex gap-2 p-2 bg-white/5 rounded-xl border border-white/10">
        {Object.values(CREATION_MODES).map(mode => {
          const isSelected = selectedMode === mode.id;
          const isDisabled = mode.id === 'canva'; // Canva próximamente
          
          return (
            <button
              key={mode.id}
              onClick={() => !isDisabled && onModeChange(mode.id)}
              disabled={isDisabled}
              className={`
                flex-1 p-3 rounded-lg transition-all cursor-pointer
                ${isSelected 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : isDisabled
                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
                }
              `}
            >
              <div className="text-2xl mb-1">{mode.icon}</div>
              <div className="text-xs font-bold mb-0.5">{mode.name}</div>
              <div className="text-[10px] opacity-70 leading-tight">
                {mode.description}
              </div>
              {isDisabled && (
                <div className="mt-1 text-[9px] text-yellow-400">
                  Próximamente
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Descripción del modo seleccionado */}
      <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="text-[10px] text-blue-300 font-medium mb-1">
          Características del modo {CREATION_MODES[selectedMode].name}:
        </div>
        <ul className="text-[10px] text-white/60 space-y-0.5">
          {CREATION_MODES[selectedMode].features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-1">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreationModeSelector;
