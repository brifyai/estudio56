/**
 * 🎨 StoryArtStyleSelector - Selector de Estilos Visuales Únicos para Story Art
 * 
 * Este componente permite a los usuarios seleccionar entre 7 estilos visuales únicos
 * que diferencian Story Art de las imágenes normales.
 */

import React from 'react';
import { StoryArtStyleId, StoryArtStyle } from '../types';
import { STORY_ART_STYLES, STORY_ART_CATEGORIES, getStoryArtStyle } from '../constants/storyArtStyles';

interface StoryArtStyleSelectorProps {
  /** Estilo actualmente seleccionado */
  selectedStyle: StoryArtStyleId | null;
  /** Callback cuando se selecciona un estilo */
  onStyleSelect: (styleId: StoryArtStyleId) => void;
  /** Rubro actual (para sugerir estilos relevantes) */
  currentIndustry?: string;
  /** Si el selector está deshabilitado */
  disabled?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Obtiene el estilo recomendado basado en el rubro
 */
const getRecommendedStyle = (industry: string): StoryArtStyleId => {
  const industryLower = industry.toLowerCase();
  
  if (industryLower.includes('belleza') || industryLower.includes('moda') || industryLower.includes('spa')) {
    return 'vogue_negative';
  }
  if (industryLower.includes('gaming') || industryLower.includes('tech') || industryLower.includes('entretencion')) {
    return 'neon_kinetic';
  }
  if (industryLower.includes('gastronom') || industryLower.includes('joyas') || industryLower.includes('retail')) {
    return 'macro_essence';
  }
  if (industryLower.includes('fitness') || industryLower.includes('deporte') || industryLower.includes('salud')) {
    return 'cinematic_frame';
  }
  if (industryLower.includes('evento') || industryLower.includes('fiesta') || industryLower.includes('niños')) {
    return 'collage_dynamic';
  }
  if (industryLower.includes('lujo') || industryLower.includes('premium') || industryLower.includes('inmobili')) {
    return 'marble_sculpture';
  }
  
  return 'cinematic_frame'; // Default
};

export const StoryArtStyleSelector: React.FC<StoryArtStyleSelectorProps> = ({
  selectedStyle,
  onStyleSelect,
  currentIndustry,
  disabled = false,
  className = ''
}) => {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>('documental');
  const [previewStyle, setPreviewStyle] = React.useState<StoryArtStyleId | null>(null);

  // Obtener estilo recomendado si no hay selección
  const recommendedStyle = currentIndustry ? getRecommendedStyle(currentIndustry) : null;
  const displayStyle = selectedStyle || recommendedStyle || 'cinematic_frame';
  const previewData = getStoryArtStyle(displayStyle);

  const handleStyleClick = (styleId: StoryArtStyleId) => {
    if (!disabled) {
      onStyleSelect(styleId);
      setPreviewStyle(styleId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, styleId: StoryArtStyleId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStyleClick(styleId);
    }
  };

  return (
    <div className={`story-art-style-selector ${className}`}>
      {/* Header con preview del estilo seleccionado */}
      <div className="style-selector-header">
        <h3 className="style-selector-title">
          🎨 Estilo Visual Story Art
        </h3>
        <p className="style-selector-subtitle">
          Elige un estilo visual único para diferenciar tu Story Art
        </p>
        
        {/* Preview del estilo activo */}
        {previewData && (
          <div 
            className="style-preview-card"
            style={{ borderLeftColor: previewData.color }}
          >
            <div className="style-preview-icon">{previewData.icon}</div>
            <div className="style-preview-info">
              <span className="style-preview-name">{previewData.name}</span>
              <span className="style-preview-category">{previewData.category}</span>
            </div>
            <span className="style-preview-badge">
              {selectedStyle ? 'Seleccionado' : 'Recomendado'}
            </span>
          </div>
        )}
      </div>

      {/* Categorías expandibles */}
      <div className="style-categories">
        {Object.entries(STORY_ART_CATEGORIES).map(([key, category]) => {
          const styles = category.styles.map(id => STORY_ART_STYLES[id]).filter(Boolean);
          const isExpanded = expandedCategory === key;
          const hasActiveStyle = styles.some(s => s.id === selectedStyle);

          return (
            <div 
              key={key} 
              className={`style-category ${isExpanded ? 'expanded' : ''} ${hasActiveStyle ? 'has-active' : ''}`}
            >
              <button
                className="category-header"
                onClick={() => setExpandedCategory(isExpanded ? null : key)}
                disabled={disabled}
                aria-expanded={isExpanded}
              >
                <span className="category-label">{category.label}</span>
                <span className="category-count">{styles.length}</span>
                <span className={`category-arrow ${isExpanded ? 'rotated' : ''}`}>
                  ▼
                </span>
                {hasActiveStyle && <span className="active-indicator">●</span>}
              </button>

              {isExpanded && (
                <div className="category-styles">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      className={`style-option ${selectedStyle === style.id ? 'selected' : ''}`}
                      onClick={() => handleStyleClick(style.id)}
                      onKeyDown={(e) => handleKeyDown(e, style.id)}
                      disabled={disabled}
                      style={{ '--style-color': style.color } as React.CSSProperties}
                      title={style.description}
                    >
                      <span className="style-option-icon">{style.icon}</span>
                      <div className="style-option-info">
                        <span className="style-option-name">{style.name}</span>
                        <span className="style-option-desc">{style.description}</span>
                      </div>
                      {selectedStyle === style.id && (
                        <span className="style-check">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Estilos grid para selección rápida */}
      <div className="style-quick-select">
        <h4>Selección Rápida</h4>
        <div className="style-grid">
          {Object.values(STORY_ART_STYLES).map((style) => (
            <button
              key={style.id}
              className={`style-grid-item ${selectedStyle === style.id ? 'selected' : ''}`}
              onClick={() => handleStyleClick(style.id)}
              style={{ 
                borderColor: selectedStyle === style.id ? style.color : 'transparent',
                backgroundColor: selectedStyle === style.id ? `${style.color}15` : 'transparent'
              }}
              title={`${style.name}: ${style.description}`}
            >
              <span className="style-grid-icon">{style.icon}</span>
              <span className="style-grid-name">{style.name}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .story-art-style-selector {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 16px;
          color: white;
        }

        .style-selector-header {
          margin-bottom: 16px;
        }

        .style-selector-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #fff;
        }

        .style-selector-subtitle {
          font-size: 12px;
          color: #888;
          margin: 0 0 12px 0;
        }

        .style-preview-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          border-radius: 8px;
          border-left: 4px solid;
          margin-bottom: 8px;
        }

        .style-preview-icon {
          font-size: 24px;
        }

        .style-preview-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .style-preview-name {
          font-weight: 600;
          font-size: 14px;
        }

        .style-preview-category {
          font-size: 11px;
          color: #888;
          text-transform: capitalize;
        }

        .style-preview-badge {
          font-size: 10px;
          padding: 4px 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #4ade80;
        }

        .style-categories {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .style-category {
          border-radius: 8px;
          overflow: hidden;
          background: rgba(255,255,255,0.05);
        }

        .style-category.has-active {
          background: rgba(255,255,255,0.08);
        }

        .category-header {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
        }

        .category-header:hover:not(:disabled) {
          background: rgba(255,255,255,0.1);
        }

        .category-header:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .category-label {
          flex: 1;
          text-align: left;
          font-weight: 500;
        }

        .category-count {
          font-size: 12px;
          color: #888;
          background: rgba(255,255,255,0.1);
          padding: 2px 8px;
          border-radius: 10px;
        }

        .category-arrow {
          font-size: 10px;
          color: #888;
          transition: transform 0.2s;
        }

        .category-arrow.rotated {
          transform: rotate(180deg);
        }

        .active-indicator {
          color: #4ade80;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .category-styles {
          padding: 0 12px 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .style-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          color: white;
          text-align: left;
        }

        .style-option:hover:not(:disabled) {
          background: rgba(255,255,255,0.1);
          border-color: var(--style-color);
        }

        .style-option.selected {
          background: rgba(255,255,255,0.1);
          border-color: var(--style-color);
        }

        .style-option:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .style-option-icon {
          font-size: 20px;
        }

        .style-option-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .style-option-name {
          font-weight: 500;
          font-size: 13px;
        }

        .style-option-desc {
          font-size: 11px;
          color: #888;
        }

        .style-check {
          color: #4ade80;
          font-weight: bold;
        }

        .selected-style-details {
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .selected-style-details h4 {
          margin: 0 0 8px 0;
          font-size: 13px;
          color: #888;
        }

        .selected-style-details p {
          margin: 0 0 8px 0;
          font-size: 14px;
        }

        .style-technical-preview {
          padding: 8px;
          background: rgba(0,0,0,0.3);
          border-radius: 4px;
          overflow: hidden;
        }

        .style-technical-preview code {
          font-size: 10px;
          color: #888;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: block;
        }

        .style-quick-select h4 {
          font-size: 12px;
          color: #888;
          margin: 0 0 8px 0;
        }

        .style-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 8px;
        }

        .style-grid-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px;
          background: rgba(255,255,255,0.05);
          border: 2px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: white;
        }

        .style-grid-item:hover {
          background: rgba(255,255,255,0.1);
        }

        .style-grid-item.selected {
          transform: scale(1.05);
        }

        .style-grid-icon {
          font-size: 20px;
        }

        .style-grid-name {
          font-size: 9px;
          text-align: center;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default StoryArtStyleSelector;