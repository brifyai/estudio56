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
      // Crear un contenedor temporal con zoom 1 para la captura
      const container = previewContainerRef.current;
      const originalTransform = container.style.transform;
      console.log('📄 Transform original:', originalTransform);
      
      container.style.transform = 'scale(1)';
      
      // Esperar un frame para que se aplique el estilo
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('📄 Capturando con html2canvas...');
      
      // Capturar el contenedor del manual
      // Nota: ignoreElements para evitar problemas con colores oklch de Tailwind
      const canvas = await html2canvas(container, {
        scale: 2, // Alta resolución
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        // Ignorar errores de parsing de colores (oklch no soportado)
        onclone: (clonedDoc) => {
          // Convertir colores oklch a hex en el documento clonado
          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const computedStyle = window.getComputedStyle(el as Element);
            const htmlEl = el as HTMLElement;
            
            // Reemplazar colores problemáticos con fallbacks
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
      
      console.log('📄 Canvas capturado:', canvas.width, 'x', canvas.height);
      
      // Restaurar el zoom original
      container.style.transform = originalTransform;
      
      // Crear PDF en formato A4
      console.log('📄 Creando PDF...');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular dimensiones manteniendo proporción
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // El contenido es largo (3 páginas), dividir en páginas
      const pageHeightPx = (pdfHeight / pdfWidth) * imgWidth;
      const totalPages = Math.ceil(imgHeight / pageHeightPx);
      
      console.log('📄 Total páginas:', totalPages);
      
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        // Calcular la porción de la imagen para esta página
        const sourceY = page * pageHeightPx;
        const sourceHeight = Math.min(pageHeightPx, imgHeight - sourceY);
        
        // Crear canvas temporal para esta página
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        const ctx = pageCanvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, sourceY, imgWidth, sourceHeight,
            0, 0, imgWidth, sourceHeight
          );
          
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
          const destHeight = (sourceHeight / imgWidth) * pdfWidth;
          
          pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, destHeight);
        }
      }
      
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
  const GeneratedLogo = ({ className = "h-32", showText = true, forceWhiteText = false }: { className?: string, showText?: boolean, forceWhiteText?: boolean }) => {
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

    const textColor = forceWhiteText ? 'white' : secondaryColor;

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
            <span className={`block font-bold leading-none ${brand.genLogoTracking}`} style={{ fontFamily: brand.typography.headingFont, color: textColor, textTransform: brand.genLogoTextCase as any, fontSize: isHorizontal ? `${iconSize * 0.7}px` : `${iconSize * 0.6}px` }}>{brand.name}</span>
            {brand.tagline && !isHorizontal && (<span className="block text-xs mt-1 opacity-70" style={{ color: textColor }}>{brand.tagline}</span>)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
          .preview-container { box-shadow: none !important; border: none !important; width: 210mm !important; }
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
            width: `calc(210mm * ${zoom})`,
            // Altura total: 3 páginas A4 (portada + esencia + sistema visual) + footer
            height: `calc((297mm * 3 + 100px) * ${zoom})`,
          }}
        >
          <div 
            ref={previewContainerRef}
            style={{ 
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: '210mm',
            }}
          >
            <div className="preview-container bg-white w-[210mm] shadow-2xl">
            
            {/* PORTADA */}
            <section className="relative h-[297mm] flex flex-col justify-between p-16 overflow-hidden">
              <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none transform skew-x-12 translate-x-32" style={{ backgroundColor: brand.colors.primary }} />
              <div className="relative z-10 pt-20">
                <div className="mb-12">
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

            {/* ESENCIA */}
            <section className="min-h-[297mm] p-16 flex flex-col border-t">
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

            {/* SISTEMA VISUAL */}
            <section className="min-h-[297mm] p-16 flex flex-col border-t">
              <div className="mb-12 flex items-center gap-4">
                <span className="text-4xl font-bold opacity-20">02</span>
                <h3 className="text-2xl font-bold uppercase tracking-wide" style={{ fontFamily: brand.typography.headingFont, color: brand.colors.secondary }}>Sistema Visual</h3>
              </div>

              {/* Logo */}
              <div className="mb-16">
                <h4 className="text-lg font-bold mb-8 flex items-center gap-2 border-b pb-2" style={{ color: brand.colors.primary, borderColor: brand.colors.primary }}>
                  <LayoutTemplate size={20} /> Logotipo
                </h4>
                <div className="grid grid-cols-2 gap-8 items-center bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300">
                  <div className="flex justify-center border-r border-gray-200 pr-8">
                    {brand.logoMode === 'upload' && brand.logoUrl ? (
                      <img src={brand.logoUrl} alt="Logo" className="h-32 object-contain" />
                    ) : (
                      <GeneratedLogo className="h-32" />
                    )}
                  </div>
                  <div className="pl-4">
                    <p className="text-sm text-gray-500 mb-2">Variante en negativo</p>
                    <div className="bg-slate-800 p-6 rounded-lg flex justify-center">
                      {brand.logoMode === 'upload' && brand.logoUrl ? (
                        <img src={brand.logoUrl} alt="Logo" className="h-16 object-contain brightness-200 grayscale" />
                      ) : (
                        <GeneratedLogo className="h-16" forceWhiteText={true} />
                      )}
                    </div>
                  </div>
                </div>
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
            </section>

            {/* Footer */}
            <div className="p-8 border-t flex justify-between text-xs text-slate-300">
              <span>{brand.name} | Manual de Marca</span>
              <span>Generado con Estudio 56</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}