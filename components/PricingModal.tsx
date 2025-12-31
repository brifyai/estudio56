import React from 'react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  if (!isOpen) return null;

  const handleContact = (planName: string) => {
    // 1. Update the UI to show they "Selected" this plan (Demo effect)
    onSelectPlan(planName.toUpperCase());
    
    // 2. Open WhatsApp for "purchase"
    const message = `Hola Estudio 56, me interesa contratar el plan *${planName}*. ¿Me envían datos de transferencia?`;
    window.open(`https://wa.me/56912345678?text=${encodeURIComponent(message)}`, '_blank');
    
    // 3. Close modal
    onClose();
  };

  const handleFreePlan = () => {
    onSelectPlan("GRATIS");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-7xl rounded-3xl shadow-2xl overflow-hidden relative my-8 flex flex-col max-h-[90vh]">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-10 text-white/50 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center pt-12 pb-8 px-6 bg-gradient-to-b from-white/5 to-transparent">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
            Planes <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Pymes 🇨🇱</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto font-light">
            Infraestructura de diseño de nivel empresarial, accesible para todos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8 overflow-y-auto custom-scrollbar">
          
          {/* PLAN GRATIS */}
          <div className="bg-white/5 rounded-2xl border border-white/5 p-6 flex flex-col hover:border-white/20 transition-all group opacity-80 hover:opacity-100">
            <h3 className="text-lg font-bold text-white mb-1">GRATIS</h3>
            <p className="text-xs text-white/40 mb-6 font-mono">MODO PRUEBA</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$0</span>
              <span className="text-white/30 text-xs"> / siempre</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1 text-xs text-white/70">
              <li className="flex gap-2"><span>✓</span> 5 Borradores Diarios (H2O)</li>
              <li className="flex gap-2"><span>✓</span> Solo Visualización</li>
              <li className="flex gap-2 opacity-30"><span>✕</span> Generación de Video</li>
              <li className="flex gap-2 opacity-30"><span>✕</span> Descarga de Archivos</li>
            </ul>

            <button onClick={handleFreePlan} className="w-full py-3 rounded-lg border border-white/20 hover:bg-white hover:text-black transition-all text-sm font-bold">
              Probar Ahora
            </button>
          </div>

          {/* PLAN 1: BASIC */}
          <div className="bg-white/5 rounded-2xl border border-white/5 p-6 flex flex-col hover:border-white/20 transition-all group">
            <h3 className="text-lg font-bold text-white mb-1">ESTOY PARTIENDO</h3>
            <p className="text-xs text-white/40 mb-6 font-mono">EMPRENDEDORES</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$12.990</span>
              <span className="text-white/30 text-xs"> / mes</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1 text-xs text-white/70">
              <li className="flex gap-2"><span>✓</span> 50 Imágenes Finales (HD)</li>
              <li className="flex gap-2 text-yellow-400"><span>⚡</span> <b>∞ Borradores de Imagen</b></li>
              <li className="flex gap-2 opacity-50"><span>✕</span> Generación de Video</li>
              <li className="flex gap-2 opacity-50"><span>✕</span> Carga de Productos</li>
            </ul>

            <button onClick={() => handleContact("Estoy Partiendo")} className="w-full py-3 rounded-lg border border-white/20 hover:bg-white hover:text-black transition-all text-sm font-bold">
              Seleccionar
            </button>
          </div>

          {/* PLAN 2: JEFE PYME */}
          <div className="bg-white/5 rounded-2xl border border-white/5 p-6 flex flex-col hover:border-white/20 transition-all group">
            <h3 className="text-lg font-bold text-white mb-1">JEFE PYME</h3>
            <p className="text-xs text-white/40 mb-6 font-mono">VENDER EN SERIO</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$39.990</span>
              <span className="text-white/30 text-xs"> / mes</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1 text-xs text-white/80">
              <li className="flex gap-2 text-blue-400"><span>✓</span> 250 Imágenes HD</li>
              <li className="flex gap-2 text-yellow-400"><span>⚡</span> <b>∞ Borradores de Imagen</b></li>
              <li className="flex gap-2 text-white/60"><span>⚠️</span> 5 Videos HD (Limitado)</li>
              <li className="flex gap-2"><span>✓</span> <b>Carga de Productos</b></li>
            </ul>

            <button onClick={() => handleContact("Jefe Pyme")} className="w-full py-3 rounded-lg border border-white/20 hover:bg-white hover:text-black transition-all text-sm font-bold">
              Seleccionar
            </button>
          </div>

          {/* PLAN 3: AGENCIA */}
          <div className="bg-blue-900/10 rounded-2xl border border-blue-500/50 p-6 flex flex-col relative overflow-hidden group shadow-[0_0_50px_rgba(37,99,235,0.15)] transform hover:scale-[1.02] transition-all">
             <div className="absolute top-0 right-0 bg-blue-600 text-[9px] font-bold px-3 py-1 rounded-bl-lg uppercase">Mejor Valor</div>
            
            <h3 className="text-lg font-bold text-white mb-1">AGENCIA</h3>
            <p className="text-xs text-blue-300 mb-6 font-mono">DOMINIO TOTAL</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$99.990</span>
              <span className="text-white/30 text-xs"> / mes</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1 text-xs text-white/90">
              <li className="flex gap-2 text-green-400"><span>✓</span> <b>1000 Imágenes HD (4x)</b></li>
              <li className="flex gap-2 text-green-400"><span>✓</span> <b>20 Videos HD (4x)</b></li>
              <li className="flex gap-2"><span>✓</span> Licencia Comercial Extendida</li>
              <li className="flex gap-2"><span>✓</span> Soporte WhatsApp (Humano)</li>
            </ul>

            <button onClick={() => handleContact("Agencia")} className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all text-sm font-bold">
              Lo Quiero Ahora
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};