import { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Monitor, Layout, Palette, Type, LayoutTemplate, Hexagon, Link, Sparkles, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BrandData, ALL_ICONS } from './BrandTypes';

interface BrandPreviewProps {
  brand: BrandData;
}

export default function BrandPreview({ brand }: BrandPreviewProps) {
  const [zoom, setZoom] = useState(0.45);
  const [isExporting, setIsExporting] = useState(false);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Función para exportar el manual a PDF
  const handleExportPDF = async () => {
    console.log('📄 handleExportPDF llamado');
    console.log('📄 previewContainerRef.current:', !!previewContainerRef.current);
    console.log('📄 isExporting:', isExporting);
    
    if (!previewContainerRef.current) {
      console.error('❌ No hay referencia al contenedor');
      alert('Error: No se encontró el contenedor del manual');
      return;
    }
    
    if (isExporting) {
      console.log('⏳ Ya se está exportando...');
      return;
    }
    
    setIsExporting(true);
    console.log('📄 Iniciando exportación...');
    
    try {
      const container = previewContainerRef.current;
      const originalTransform = container.style.transform;
      
      // Resetear zoom para captura
      container.style.transform = 'scale(1)';
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Buscar todas las páginas individuales (divs con clase preview-container)
      const pages = container.querySelectorAll('.preview-container');
      console.log('📄 Páginas encontradas:', pages.length);
      
      // Crear PDF en formato Carta (Letter)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Capturar cada página por separado
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        console.log(`📄 Capturando página ${i + 1}...`);
        
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          onclone: (clonedDoc, element) => {
            // Convertir colores oklch a hex
            const allElements = element.querySelectorAll('*');
            allElements.forEach((el) => {
              const computedStyle = window.getComputedStyle(el as Element);
              const htmlEl = el as HTMLElement;
              if (computedStyle.backgroundColor.includes('oklch')) {
                htmlEl.style.backgroundColor = '#ffffff';
              }
              if (computedStyle.color.includes('oklch')) {
                htmlEl.style.color = '#000000';
              }
              if (computedStyle.borderColor.includes('oklch')) {
                htmlEl.style.borderColor = '#e5e7eb';
              }
            });
          }
        });
        
        // Agregar nueva página si no es la primera
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calcular dimensiones para ajustar al tamaño carta
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / (imgWidth / 2), pdfHeight / (imgHeight / 2));
        const destWidth = (imgWidth / 2) * ratio;
        const destHeight = (imgHeight / 2) * ratio;
        
        // Centrar en la página si es necesario
        const xOffset = (pdfWidth - destWidth) / 2;
        const yOffset = 0;
        
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, destWidth, destHeight);
      }
      
      // Restaurar zoom
      container.style.transform = originalTransform;
      
      // Descargar el PDF
      const fileName = `Manual-Marca-${brand.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('📄 Guardando PDF:', fileName);
      pdf.save(fileName);
      
      console.log('✅ PDF exportado exitosamente');
      
    } catch (error) {
      console.error('❌ Error exportando PDF:', error);
      alert('Error al exportar el PDF. Por favor intenta de nuevo. Error: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  // Detectar si es el estado por defecto (sin datos reales)
  const isEmptyState = brand.name === "Mi Marca" && brand.tagline === "Tu eslogan aquí";

  // Función para detectar si un color es claro (para ajustar fondo del logo)
  const isLightColor = (hexColor: string): boolean => {
    // Remover # si existe
    const hex = hexColor.replace('#', '');
    // Convertir a RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Calcular luminosidad (fórmula estándar)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Si luminosidad > 0.7, es un color claro
    return luminance > 0.7;
  };

  // Detectar si el logo/marca usa colores claros
  const hasLightLogo = isLightColor(brand.colors.primary) || 
    (brand.logoUrl && brand.logoUrl.toLowerCase().includes('blanco')) ||
    (brand.logoUrl && brand.logoUrl.toLowerCase().includes('white'));

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 0) return "B";
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  // Estado vacío - mostrar placeholder
  if (isEmptyState) {
    return (
      <div className="flex flex-col h-full bg-gray-950 items-center justify-center">
        <div className="text-center px-8 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
            <Sparkles className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Genera tu Manual de Marca</h3>
          <p className="text-white/50 text-sm mb-6">
            Ingresa la URL de tu página web, Instagram, Facebook o TikTok en el panel izquierdo para generar automáticamente tu manual de identidad de marca.
          </p>
          <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
            <Link size={14} />
            <span>Pega tu URL y presiona "Analizar"</span>
          </div>
        </div>
      </div>
    );
  }

  // Componente GeneratedLogo
  const GeneratedLogo = ({ className = "h-32", showText = true, forceWhiteText = true }: { className?: string, showText?: boolean, forceWhiteText?: boolean }) => {
    const IconComponent = ALL_ICONS[brand.genLogoIcon] || Hexagon;
    const isHorizontal = brand.genLogoLayout === 'horizontal';
    
    let baseSize = 32;
    if (className?.includes('h-6')) baseSize = 6;
    if (className?.includes('h-8')) baseSize = 8;
    if (className?.includes('h-12')) baseSize = 12;
    if (className?.includes('h-16')) baseSize = 16;
    if (className?.includes('h-24')) baseSize = 24;
    const iconSize = baseSize * 2;

    let containerStyle: React.CSSProperties = {
      width: `${iconSize*2}px`, height: `${iconSize*2}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.3s ease',
      transform: `rotate(${brand.genLogoRotation}deg) scale(${brand.genLogoScale})`
    };

    let primaryColor = brand.colors.primary;
    let secondaryColor = brand.colors.secondary;
    let iconColor = primaryColor;

    if (brand.genLogoShape !== 'none') {
      if (brand.genLogoShape === 'circle') containerStyle.borderRadius = '9999px';
      if (brand.genLogoShape === 'square') containerStyle.borderRadius = '0px';
      if (brand.genLogoShape === 'rounded') containerStyle.borderRadius = '16px';
      if (brand.genLogoShape === 'hexagon') containerStyle.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
      
      if (brand.genLogoStyle === 'filled') {
        containerStyle.backgroundColor = primaryColor;
        iconColor = '#ffffff';
      } else if (brand.genLogoStyle === 'outline') {
        containerStyle.border = `2px solid ${primaryColor}`;
      } else if (brand.genLogoStyle === 'duotone') {
        containerStyle.backgroundColor = secondaryColor;
        iconColor = brand.colors.accent;
      } else if (brand.genLogoStyle === 'soft') {
        containerStyle.backgroundColor = `${brand.colors.primary}20`;
      }
    }

    // Siempre usar blanco para el texto del logo
    const textColor = 'white';

    return (
      <div className={`flex items-center justify-center ${isHorizontal ? 'flex-row gap-4 text-left' : 'flex-col gap-3 text-center'}`}>
        <div style={containerStyle}>
          {brand.genLogoType === 'initials' ? (
            <span className="font-bold leading-none" style={{ fontSize: `${iconSize}px`, color: iconColor, fontFamily: brand.typography.headingFont }}>{getInitials(brand.name)}</span>
          ) : (
            <IconComponent size={iconSize} color={iconColor} strokeWidth={1.5} />
          )}
        </div>
        {showText && (
          <div className={brand.genLogoLayout === 'stacked' ? 'border-t pt-2 mt-1 border-gray-200' : ''}>
            <span className={`block font-bold leading-none ${brand.genLogoTracking} !text-white`} style={{ fontFamily: brand.typography.headingFont, color: 'white !important', textTransform: brand.genLogoTextCase as any, fontSize: isHorizontal ? `${iconSize * 0.7}px` : `${iconSize * 0.6}px` }}>{brand.name}</span>
            {brand.tagline && !isHorizontal && (<span className="block text-xs mt-1 opacity-70 !text-white" style={{ color: 'white !important' }}>{brand.tagline}</span>)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <style>{`
        @media print {
          @page { margin: 0; size: letter; }
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
          .preview-container { box-shadow: none !important; border: none !important; width: 215.9mm !important; }
        }
      `}</style>

      {/* Zoom toolbar */}
      <div className="h-12 bg-gray-900 border-b border-white/10 flex items-center justify-between px-4 no-print shrink-0 z-50">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Monitor size={14} />
          <span>Vista Previa del Manual</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Botón Exportar PDF */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('📄 Click en Exportar PDF');
              handleExportPDF();
            }}
            disabled={isExporting}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer z-50"
          >
            {isExporting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Exportar PDF</span>
              </>
            )}
          </button>
          {/* Controles de Zoom */}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button 
              type="button" 
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                console.log('🔍 Zoom out clicked, current:', zoom);
                setZoom(prevZoom => {
                  const newZoom = Math.max(0.2, prevZoom - 0.1);
                  console.log('🔍 New zoom:', newZoom);
                  return newZoom;
                });
              }} 
              className="p-1.5 hover:bg-white/20 rounded text-white/60 hover:text-white transition-colors cursor-pointer z-50"
            >
              <ZoomOut size={14}/>
            </button>
            <span className="text-xs font-mono text-white/60 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button 
              type="button" 
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                console.log('🔍 Zoom in clicked, current:', zoom);
                setZoom(prevZoom => {
                  const newZoom = Math.min(1, prevZoom + 0.1);
                  console.log('🔍 New zoom:', newZoom);
                  return newZoom;
                });
              }} 
              className="p-1.5 hover:bg-white/20 rounded text-white/60 hover:text-white transition-colors cursor-pointer z-50"
            >
              <ZoomIn size={14}/>
            </button>
          </div>
        </div>
      </div>

      {/* Document preview - wrapper con altura calculada para scroll correcto */}
      <div className="flex-1 min-h-0 overflow-auto p-6">
        <div 
          className="mx-auto"
          style={{ 
            // El contenedor tiene el tamaño visual del documento escalado
            // Formato Carta: 215.9mm x 279.4mm
            width: `calc(215.9mm * ${zoom})`,
            // Altura total: 4 páginas Carta + espacios entre páginas
            height: `calc((279.4mm * 4 + 150px) * ${zoom})`,
          }}
        >
          <div 
            ref={previewContainerRef}
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: '215.9mm',
            }}
          >
            {/* PÁGINA 1: PORTADA */}
            <div className="preview-container bg-white w-[215.9mm] shadow-2xl mb-8">
              <section className="relative h-[279.4mm] flex flex-col justify-between p-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none transform skew-x-12 translate-x-32" style={{ backgroundColor: brand.colors.primary }} />
                <div className="relative z-10 pt-20">
                  <div className={`mb-12 inline-block ${hasLightLogo ? 'bg-slate-700 p-6 rounded-xl' : ''}`}>
                    {brand.logoMode === 'upload' && brand.logoUrl ? (
                      <img src={brand.logoUrl} alt="Logo" className="h-24 object-contain" />
                    ) : (
                      <GeneratedLogo className="h-24" />
                    )}
                  </div>
                  <h1 className="text-6xl font-bold leading-tight mb-4" style={{ fontFamily: brand.typography.headingFont, color: brand.colors.secondary }}>
                    Manual de<br />Identidad
                  </h1>
                  <div className="h-2 w-32 mb-8" style={{ backgroundColor: brand.colors.accent }} />
                </div>
                <div className="relative z-10 pb-10">
                  <p className="text-sm text-slate-400 uppercase tracking-widest mb-1">Versión 1.0</p>
                  <p className="text-sm text-slate-400">{new Date().getFullYear()}</p>
                </div>
              </section>
            </div>

            {/* PÁGINA 2: ESENCIA */}
            <div className="preview-container bg-white w-[215.9mm] shadow-2xl mb-8">
              <section className="h-[279.4mm] p-16 flex flex-col">
                <div className="mb-12 flex items-center gap-4">
                  <span className="text-4xl font-bold opacity-20">01</span>
                  <h3 className="text-2xl font-bold uppercase tracking-wide" style={{ fontFamily: brand.typography.headingFont, color: brand.colors.secondary }}>Esencia</h3>
                </div>
                <div className="grid gap-12">
                  <div>
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: brand.colors.primary }}>
                      <Layout size={20} /> Introducción
                    </h4>
                    <p className="text-lg leading-relaxed text-slate-600" style={{ fontFamily: brand.typography.bodyFont }}>{brand.description}</p>
                  </div>
                <div className="p-8 bg-gray-50 rounded-xl border-l-4" style={{ borderColor: brand.colors.accent }}>
                  <h4 className="text-xl font-bold mb-2" style={{ fontFamily: brand.typography.headingFont }}>Nuestro Eslogan</h4>
                  <p className="text-3xl italic font-light text-slate-800" style={{ fontFamily: brand.typography.headingFont }}>"{brand.tagline}"</p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h5 className="uppercase tracking-wider text-xs font-bold text-slate-400 mb-3">Misión</h5>
                    <p className="text-lg font-medium text-slate-800" style={{ fontFamily: brand.typography.bodyFont }}>{brand.mission}</p>
                  </div>
                  <div className="p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h5 className="uppercase tracking-wider text-xs font-bold text-slate-400 mb-3">Visión</h5>
                    <p className="text-lg font-medium text-slate-800" style={{ fontFamily: brand.typography.bodyFont }}>{brand.vision}</p>
                  </div>
                </div>
              </div>
              </section>
            </div>

            {/* PÁGINA 3: LOGOTIPO */}
            <div className="preview-container bg-white w-[215.9mm] shadow-2xl mb-8">
              <section className="h-[279.4mm] p-16 flex flex-col">
                <div className="mb-12 flex items-center gap-4">
                  <span className="text-4xl font-bold opacity-20">02</span>
                  <h3 className="text-2xl font-bold uppercase tracking-wide" style={{ fontFamily: brand.typography.headingFont, color: brand.colors.secondary }}>Sistema Visual</h3>
                </div>

              {/* Logo */}
              <div>
                <h4 className="text-lg font-bold mb-8 flex items-center gap-2 border-b pb-2" style={{ color: brand.colors.primary, borderColor: brand.colors.primary }}>
                  <LayoutTemplate size={20} /> Logotipo
                </h4>
                
                {/* Logo principal - fondo oscuro si el logo es claro */}
                <div 
                  className={`mb-8 p-8 rounded-xl border border-dashed ${hasLightLogo ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-300'}`}
                >
                  <p className={`text-sm mb-4 text-center ${hasLightLogo ? 'text-slate-300' : 'text-gray-500'}`}>Versión Principal</p>
                  <div className="flex justify-center">
                    {brand.logoMode === 'upload' && brand.logoUrl ? (
                      <img src={brand.logoUrl} alt="Logo" className="h-24 object-contain" />
                    ) : (
                      <GeneratedLogo className="h-24" />
                    )}
                  </div>
                </div>

                {/* Variaciones de color del logo */}
                <p className="text-sm text-gray-500 mb-4">Variaciones de Color</p>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: 'Primario', bg: '#ffffff', color: brand.colors.primary },
                    { name: 'Secundario', bg: '#ffffff', color: brand.colors.secondary },
                    { name: 'Acento', bg: '#ffffff', color: brand.colors.accent },
                    { name: 'Negativo', bg: brand.colors.secondary, color: '#ffffff' },
                  ].map((variant) => (
                    <div key={variant.name} className="text-center">
                      <div 
                        className="aspect-square rounded-xl flex items-center justify-center p-4 border border-gray-200 mb-2"
                        style={{ backgroundColor: variant.bg }}
                      >
                        {brand.logoMode === 'upload' && brand.logoUrl ? (
                          <img 
                            src={brand.logoUrl} 
                            alt={`Logo ${variant.name}`} 
                            className="h-12 object-contain"
                            style={{ 
                              filter: variant.name === 'Negativo' ? 'brightness(0) invert(1)' : 'none'
                            }}
                          />
                        ) : (
                          <div style={{ color: variant.color }}>
                            <GeneratedLogo className="h-12" showText={false} />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{variant.name}</p>
                      <p className="text-[10px] font-mono text-gray-400">{variant.color}</p>
                    </div>
                  ))}
                </div>

                {/* Fondos de color */}
                <p className="text-sm text-gray-500 mt-8 mb-4">Aplicaciones sobre Fondos de Color</p>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: 'Fondo Primario', bg: brand.colors.primary, logoColor: '#ffffff' },
                    { name: 'Fondo Secundario', bg: brand.colors.secondary, logoColor: '#ffffff' },
                    { name: 'Fondo Acento', bg: brand.colors.accent, logoColor: '#ffffff' },
                    { name: 'Fondo Neutro', bg: brand.colors.neutral, logoColor: brand.colors.primary },
                  ].map((variant) => (
                    <div key={variant.name} className="text-center">
                      <div 
                        className="aspect-square rounded-xl flex items-center justify-center p-4 mb-2"
                        style={{ backgroundColor: variant.bg }}
                      >
                        {brand.logoMode === 'upload' && brand.logoUrl ? (
                          <img 
                            src={brand.logoUrl} 
                            alt={`Logo ${variant.name}`} 
                            className="h-12 object-contain"
                            style={{ 
                              filter: variant.logoColor === '#ffffff' ? 'brightness(0) invert(1)' : 'none'
                            }}
                          />
                        ) : (
                          <GeneratedLogo className="h-12" showText={false} forceWhiteText={variant.logoColor === '#ffffff'} />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{variant.name}</p>
                      <p className="text-[10px] font-mono text-gray-400">{variant.bg}</p>
                    </div>
                  ))}
                </div>
              </div>
              </section>
            </div>

            {/* PÁGINA 4: COLORES Y TIPOGRAFÍA */}
            <div className="preview-container bg-white w-[215.9mm] shadow-2xl mb-8">
              <section className="h-[279.4mm] p-16 flex flex-col">
                <div className="mb-12 flex items-center gap-4">
                  <span className="text-4xl font-bold opacity-20">03</span>
                  <h3 className="text-2xl font-bold uppercase tracking-wide" style={{ fontFamily: brand.typography.headingFont, color: brand.colors.secondary }}>Colores y Tipografía</h3>
                </div>

              {/* Colores */}
              <div className="mb-16">
                <h4 className="text-lg font-bold mb-8 flex items-center gap-2 border-b pb-2" style={{ color: brand.colors.primary, borderColor: brand.colors.primary }}>
                  <Palette size={20} /> Paleta de Colores
                </h4>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    {name: 'Primario', c: brand.colors.primary},
                    {name: 'Secundario', c: brand.colors.secondary},
                    {name: 'Acento', c: brand.colors.accent},
                    {name: 'Neutro', c: brand.colors.neutral}
                  ].map((col) => (
                    <div key={col.name} className="space-y-2">
                      <div className="aspect-video rounded-lg shadow-sm" style={{backgroundColor: col.c}}></div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{col.name}</p>
                        <p className="font-mono text-xs text-gray-500 uppercase">{col.c}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tipografía */}
              <div>
                <h4 className="text-lg font-bold mb-8 flex items-center gap-2 border-b pb-2" style={{ color: brand.colors.primary, borderColor: brand.colors.primary }}>
                  <Type size={20} /> Tipografía
                </h4>
                <div className="grid gap-8">
                  <div className="flex items-start gap-8">
                    <div className="w-24 shrink-0 text-center">
                      <p className="text-4xl font-bold mb-1">Aa</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Títulos</p>
                    </div>
                    <div>
                      <h1 className="text-2xl mb-2" style={{ fontFamily: brand.typography.headingFont }}>The quick brown fox jumps over the lazy dog.</h1>
                      <p className="text-xs text-slate-400 font-mono">Font: {brand.typography.headingFont.split(',')[0]}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-8 border-t pt-6">
                    <div className="w-24 shrink-0 text-center">
                      <p className="text-4xl font-normal mb-1">Aa</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Cuerpo</p>
                    </div>
                    <div>
                      <p className="text-base leading-relaxed mb-2 text-slate-600" style={{ fontFamily: brand.typography.bodyFont }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                      <p className="text-xs text-slate-400 font-mono">Font: {brand.typography.bodyFont.split(',')[0]}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer de página */}
              <div className="mt-auto pt-8 border-t flex justify-between text-xs text-slate-300">
                <span>{brand.name} | Manual de Marca</span>
                <span>Generado con Estudio 56</span>
              </div>
              </section>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}