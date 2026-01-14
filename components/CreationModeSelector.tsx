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
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`
                flex-1 p-3 rounded-lg transition-all cursor-pointer
                ${isSelected 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 cursor-pointer' 
                  : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white cursor-pointer'
                }
              `}
            >
              <div className="text-xs font-bold">{mode.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CreationModeSelector;
