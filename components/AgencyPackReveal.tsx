import React, { useState, useEffect } from 'react';
import { PackDualResult } from '../services/geminiService';
import { getArtDirectionById } from '../src/constants/artDirectionIndex';

interface AgencyPackRevealProps {
  result: PackDualResult;
  onClose: () => void;
  onDownloadImage: () => void;
  onDownloadVideo: () => void;
}

export const AgencyPackReveal: React.FC<AgencyPackRevealProps> = ({
  result,
  onClose,
  onDownloadImage,
  onDownloadVideo
}) => {
  if (!result.success || !result.imageUrl || !result.videoUrl) {
    return null;
  }

  const artDirectionInfo = result.artDirection;
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  // Efecto para transición suave del video
  useEffect(() => {
    if (result.videoUrl) {
      const timer = setTimeout(() => {
        setVideoLoaded(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [result.videoUrl]);
  
  // Generar contexto de valor dinámico basado en el rubro
  const getValueContext = (rubro: string): string => {
    const contexts: Record<string, string> = {
      'Sushi': 'Aplicada Dirección de Arte "Gourmet Nikkei" con iluminación cinemática y movimiento Orbit Scan',
      'Restaurante': 'Aplicada Dirección de Arte "Food Editorial" con backlighting dorado y vapor dramático',
      'Gimnasio': 'Aplicada Dirección de Arte "Athletic Power" con rim lighting y energía de alto impacto',
      'Hotel': 'Aplicada Dirección de Arte "Hospitality Luxury" con composición aspiracional y luz dorada',
      'Moda': 'Aplicada Dirección de Arte "Fashion Editorial" con iluminación de estudio y composición de pasarela',
      'Belleza': 'Aplicada Dirección de Arte "Beauty Editorial" con textura de piel flawless y bokeh suave',
      'Barbería': 'Aplicada Dirección de Arte "Classic Grooming" con iluminación vintage y textura de cuero',
      'Cafetería': 'Aplicada Dirección de Arte "Coffee Culture" con tonos cálidos y vapor de espresso',
      'Fitness': 'Aplicada Dirección de Arte "High Energy" con sudor en haz de luz y textura gritty',
      'Joyas': 'Aplicada Dirección de Arte "Luxury Macro" con rim lighting dramático en bordes metálicos',
      'Mascotas': 'Aplicada Dirección de Arte "Pet Care" con iluminación suave y momento feliz espontáneo',
      'Viajes': 'Aplicada Dirección de Arte "Wanderlust" con colores tropicales y gradiente de atardecer',
      'Eventos': 'Aplicada Dirección de Arte "Elegant Celebration" con bokeh romántico y detalles florales',
      'Tecnología': 'Aplicada Dirección de Arte "Tech Innovation" con neón y superficies minimalistas',
      'Inmobiliaria': 'Aplicada Dirección de Arte "Luxury Living" con wide-angle y luz dorada exterior',
      'Automotriz': 'Aplicada Dirección de Arte "Automotive Premium" con reflejos glossy y rim lighting',
      'Música': 'Aplicada Dirección de Arte "Live Energy" con efectos de escenario y láser dramático',
      'Deportes': 'Aplicada Dirección de Arte "Action Freeze" con momento congelado y luz de estadio',
      'Hogar': 'Aplicada Dirección de Arte "Interior Design" con simetría perfecta y atmósfera acogedora',
      'Salud': 'Aplicada Dirección de Arte "Clinical Trust" con iluminación shadowless y paleta blanca-cian',
      'Educación': 'Aplicada Dirección de Arte "Modern Learning" con luz natural y ambiente profesional',
      'Servicios Financieros': 'Aplicada Dirección de Arte "Corporate Trust" con paleta navy y entorno ejecutivo',
      'Construcción': 'Aplicada Dirección de Arte "Professional Builder" con acción dramática de trabajadores',
      'Limpieza': 'Aplicada Dirección de Arte "Sparkle Fresh" con superficies relucientes y paleta menta',
      'Arte': 'Aplicada Dirección de Arte "Gallery Minimal" con iluminación dramática y composición abstracta',
      'Comida Rápida': 'Aplicada Dirección de Arte "Appetite Appeal" con colores saturados y vapor tentador',
      'Perfumería': 'Aplicada Dirección de Arte "Fragrance Luxury" con efectos de vidrio y partículas flotantes',
      'Óptica': 'Aplicada Dirección de Arte "Vision Care" con reflejos sharp y simetría clínica',
      'Decoración': 'Aplicada Dirección de Arte "Design Magazine" con soft shadows y composición simétrica',
      'Muebles': 'Aplicada Dirección de Arte "Furniture Catalog" con enfoque en texturas de madera y tela',
      'Iluminación': 'Aplicada Dirección de Arte "Light & Shadow" con juego de contrastes y filamento enfocado',
      'Electrodomésticos': 'Aplicada Dirección de Arte "Modern Kitchen" con reflejos de acero y ambiente brillante',
      'Fotografía': 'Aplicada Dirección de Arte "Vintage Lens" con warmth y grano artístico',
      'Audio': 'Aplicada Dirección de Arte "Sound Visual" con ondas visuales y textura mate',
      'Relojes': 'Aplicada Dirección de Arte "Watchmaker Precision" con enfoque en mecanismos y fondo de mahogany',
      'Bebidas': 'Aplicada Dirección de Arte "Premium Pour" con condensación y backlighting dramático',
      'Vegetariano': 'Aplicada Dirección de Arte "Fresh Organic" con colores vibrantes y luz natural',
      'Heladería': 'Aplicada Dirección de Arte "Creamy Delight" con efecto cold vapor y colores pasteles',
      'Panadería': 'Aplicada Dirección de Arte "Artisan Gold" con corteza dorada y luz cálida de bakery',
      'Pastelería': 'Aplicada Dirección de Arte "Elegant Sweet" con detalles de betún y colores pastel',
      'Carnicería': 'Aplicada Dirección de Arte "Fresh Cuts" con display limpio y iluminación brillante',
      'Verdulería': 'Aplicada Dirección de Arte "Market Fresh" con gotas de agua y colores vibrantes',
      'Tienda de Ropa': 'Aplicada Dirección de Arte "Fashion Retail" con display limpio y detalles de prenda',
      'Zapatería': 'Aplicada Dirección de Arte "Footwear Detail" con enfoque en textura de cuero',
      'Regalería': 'Aplicada Dirección de Arte "Gift Presentation" con creatividad y detalles emocionales',
      'Florería': 'Aplicada Dirección de Arte "Fresh Bloom" con pétalos vibrantes y detalles de gotas',
      'Mueblería': 'Aplicada Dirección de Arte "Home Living" con setting de habitación y enfoque en madera',
      'Salón de Belleza': 'Aplicada Dirección de Arte "Glamour Beauty" con piel flawless y luz difusa',
      'Crossfit': 'Aplicada Dirección de Arte "High Intensity" con levantamiento pesado y energía intensa',
      'Piscina': 'Aplicada Dirección de Arte "Tropical Resort" con agua cristalina y reflejos solares',
      'Veterinaria': 'Aplicada Dirección de Arte "Pet Care Trust" con momento feliz y luz suave',
      'Estudio Jurídico': 'Aplicada Dirección de Arte "Corporate Professional" con entorno ejecutivo',
      'Servicios Profesionales': 'Aplicada Dirección de Arte "Executive Trust" con reunión profesional',
      'Accesorios Tech': 'Aplicada Dirección de Arte "Cyber Clean" con superficies matte y RGB sutil',
      'Smartphones': 'Aplicada Dirección de Arte "Tech Future" con reflejos glossy y neón',
      'Computación': 'Aplicada Dirección de Arte "Productivity Deep" con sombras profundas y keyboard glow',
      'Gaming': 'Aplicada Dirección de Arte "RGB Energy" con efectos glitch y fondo industrial',
      'Bolsos': 'Aplicada Dirección de Arte "Luxury Flat" con enfoque en grano de cuero y hardware',
      'Moda Mujer': 'Aplicada Dirección de Arte "Editorial Soft" con luz día natural y pose elegante',
      'Moda Hombre': 'Aplicada Dirección de Arte "Urban Street" con sombras duras y textura gritty',
      'Retail General': 'Aplicada Dirección de Arte "Commercial Clean" con iluminación de estudio y alto contraste',
    };
    
    for (const [key, value] of Object.entries(contexts)) {
      if (rubro.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }
    
    return `Aplicada Dirección de Arte "${rubro}" con iluminación profesional y composición de agencia`;
  };

  const valueContext = artDirectionInfo ? getValueContext(artDirectionInfo.rubro) : '';

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl max-w-7xl w-full overflow-hidden shadow-2xl border border-gray-700 animate-fade-in">
          
          {/* Header del Kit de Agencia */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 px-6 py-4 border-b border-amber-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="text-4xl filter drop-shadow-lg">🏆</span>
                  <div className="absolute -inset-2 bg-amber-500/20 blur-lg rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    Tu Kit de Agencia está listo
                  </h2>
                  {artDirectionInfo && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                        ✓ {artDirectionInfo.rubro}
                      </span>
                      <span className="text-amber-400/80 text-sm">
                        {valueContext}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contenido Dividido con Transiciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            
            {/* Imagen - Carga Instantánea con Fade-in */}
            <div className="relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
              <img
                src={result.imageUrl}
                alt="Imagen Story Art"
                className="w-full h-[500px] object-cover animate-fade-in-up"
                style={{ animationDelay: '0ms' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500" />
              
              <div className="absolute top-4 left-4">
                <span className="bg-amber-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  IMAGEN HD
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white text-sm font-medium bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full inline-flex items-center gap-2 mb-2">
                  <span>📸</span> Imagen Estática
                </span>
                <button
                  onClick={onDownloadImage}
                  className="block w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-center py-2.5 rounded-lg transition-colors shadow-lg"
                >
                  Descargar Imagen
                </button>
              </div>
            </div>

            {/* Video - Transición Suave */}
            <div className="relative group overflow-hidden">
              <div className={`relative w-full h-[500px] transition-all duration-1000 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
                <video
                  src={result.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  onLoadedData={() => setShowVideo(true)}
                />
              </div>
              
              {!showVideo && (
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                    <p className="text-gray-400 text-sm">Preparando tu video...</p>
                    <p className="text-orange-500 text-xs mt-1">Cinematografía profesional</p>
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-500" />
              
              <div className="absolute top-4 left-4">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all duration-500 ${showVideo ? 'bg-orange-500 text-black' : 'bg-gray-700 text-gray-400'}`}>
                  <span className={`w-2 h-2 rounded-full transition-all duration-500 ${showVideo ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                  {showVideo ? 'VIDEO HD' : 'CARGANDO...'}
                </span>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ${showVideo ? 'translate-y-4 group-hover:translate-y-0' : 'opacity-0'}`}>
                <span className="text-white text-sm font-medium bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full inline-flex items-center gap-2 mb-2">
                  <span>🎬</span> Video Motion
                </span>
                <button
                  onClick={onDownloadVideo}
                  className="block w-full bg-orange-500 hover:bg-orange-400 text-black font-semibold text-center py-2.5 rounded-lg transition-colors shadow-lg"
                >
                  Descargar Video
                </button>
              </div>
            </div>

          </div>

          {/* Footer con Info del Rubro */}
          <div className="bg-gray-900/80 px-6 py-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {artDirectionInfo && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">Rubro:</span>
                      <span className="text-white font-medium">{artDirectionInfo.rubro}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">ID:</span>
                      <span className="text-amber-400 font-mono">#{artDirectionInfo.id}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm">Pack Dual</span>
                <span className="text-amber-500">✨</span>
                <span className="text-gray-400 text-xs">Estudio 56 Agency</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AgencyPackReveal;