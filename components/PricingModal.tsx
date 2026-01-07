import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, Crown, Gift } from 'lucide-react';
import { supabase } from '../services/supabaseService';
import { getEquivalencesWithDescription } from '../services/creditEquivalenceService';
import { createRechargePreference, redirectToCheckout, RECHARGE_CONFIG } from '../services/paymentService';
import { CreditEquivalence } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: string) => void;
}

interface RechargePlan {
  id: string;
  name: string;
  price: number;
  credits: number;
  drafts: number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const [equivalences, setEquivalences] = useState<CreditEquivalence[]>([]);
  const [loadingEquivalences, setLoadingEquivalences] = useState(true);
  const [processingRecharge, setProcessingRecharge] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadEquivalences();
    }
  }, [isOpen]);

  const loadEquivalences = async () => {
    try {
      const data = await getEquivalencesWithDescription();
      setEquivalences(data);
    } catch (error) {
      console.error('Error cargando equivalencias:', error);
    } finally {
      setLoadingEquivalences(false);
    }
  };

  if (!isOpen) return null;

  const handleRecharge = async (rechargeId: string) => {
    try {
      setProcessingRecharge(rechargeId);
      
      // Get current user from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert('Debes iniciar sesión para realizar una recarga');
        return;
      }

      // Create payment preference
      const preference = await createRechargePreference(
        session.user.id,
        rechargeId as 'INDIVIDUAL' | 'SALVATORE' | 'IMPULSO'
      );

      // Redirect to MercadoPago
      redirectToCheckout(preference.initPoint);
    } catch (error) {
      console.error('Error al procesar recarga:', error);
      alert('Hubo un error al procesar tu recarga. Por favor intenta nuevamente.');
    } finally {
      setProcessingRecharge(null);
    }
  };

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

  const rechargePlans: RechargePlan[] = [
    {
      id: 'INDIVIDUAL',
      name: 'INDIVIDUAL',
      price: 2990,
      credits: 10,
      drafts: 5,
      description: "Pa' la emergencia del día",
      icon: <Sparkles className="w-6 h-6" />,
      color: 'green'
    },
    {
      id: 'SALVATORE',
      name: 'SALVATORE',
      price: 9990,
      credits: 50,
      drafts: 25,
      description: "Pa' salvar la semana",
      icon: <Zap className="w-6 h-6" />,
      color: 'blue'
    },
    {
      id: 'IMPULSO',
      name: 'IMPULSO',
      price: 24990,
      credits: 150,
      drafts: 750,
      description: "Pa' meterle con todo",
      icon: <Crown className="w-6 h-6" />,
      color: 'purple'
    }
  ];

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
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
          <p className="text-white/40 text-lg max-w-2xl mx-auto font-light mb-8">
            Infraestructura de diseño de nivel empresarial, accesible para todos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8 overflow-y-auto custom-scrollbar">
          
          {/* PLAN Gratis */}
          <div className="bg-white/5 rounded-2xl border border-white/5 p-6 flex flex-col hover:border-white/20 transition-all group opacity-80 hover:opacity-100">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-bold text-white">GRATIS</h3>
            </div>
            <p className="text-xs text-white/40 mb-6 font-mono">MODO PRUEBA</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$0</span>
              <span className="text-white/30 text-xs"> / siempre</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1 text-xs text-white/70">
              <li className="flex gap-2"><span>✓</span> 3 Borradores/día (Imagen)</li>
              <li className="flex gap-2"><span>✓</span> Solo Visualización</li>
              <li className="flex gap-2 opacity-30"><span>✕</span> Sin Créditos HD</li>
              <li className="flex gap-2 opacity-30"><span>✕</span> Generación de Video</li>
            </ul>

            <button onClick={handleFreePlan} className="w-full py-3 rounded-lg border border-white/20 hover:bg-white hover:text-black transition-all text-sm font-bold">
              Probar Ahora
            </button>
          </div>

          {/* PLAN 1: ESTOY PARTIENDO */}
          <div className="bg-white/5 rounded-2xl border border-white/5 p-6 flex flex-col hover:border-white/20 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">ESTOY PARTIENDO</h3>
            </div>
            <p className="text-xs text-blue-300 mb-6 font-mono">PA' PROBAR SI LA IA ES DE VERDAD</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$14.990</span>
              <span className="text-white/30 text-xs"> + IVA/mes</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1 text-xs text-white/80">
              <li className="flex gap-2 text-blue-400"><span>✓</span> <b>40 Créditos HD</b></li>
              <li className="flex gap-2"><span>✓</span> <b>200 Borradores</b> de Imagen</li>
              <li className="flex gap-2 opacity-50"><span>✕</span> Videos HD (10 créditos c/u)</li>
              <li className="flex gap-2 opacity-50"><span>✕</span> Carga de Productos</li>
            </ul>

            <button onClick={() => handleContact("Estoy Partiendo")} className="w-full py-3 rounded-lg border border-white/20 hover:bg-white hover:text-black transition-all text-sm font-bold">
              Elegir este
            </button>
          </div>

          {/* PLAN 2: JEFE PYME */}
          <div className="bg-white/5 rounded-2xl border border-white/5 p-6 flex flex-col hover:border-white/20 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">JEFE PYME</h3>
            </div>
            <p className="text-xs text-purple-300 mb-6 font-mono">PA' DARLE CORTE A LAS REDES</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$44.990</span>
              <span className="text-white/30 text-xs"> + IVA/mes</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1 text-xs text-white/80">
              <li className="flex gap-2 text-purple-400"><span>✓</span> <b>150 Créditos HD</b></li>
              <li className="flex gap-2"><span>✓</span> <b>750 Borradores</b> de Imagen</li>
              <li className="flex gap-2 text-orange-400"><span>⚠️</span> Videos HD (10 créditos)</li>
              <li className="flex gap-2"><span>✓</span> Carga de Productos (PNG)</li>
            </ul>

            <button onClick={() => handleContact("Jefe Pyme")} className="w-full py-3 rounded-lg border border-white/20 hover:bg-white hover:text-black transition-all text-sm font-bold">
              LO QUIERO
            </button>
          </div>

          {/* PLAN 3: AGENCIA */}
          <div className="bg-yellow-900/10 rounded-2xl border border-yellow-500/50 p-6 flex flex-col relative overflow-hidden group shadow-[0_0_50px_rgba(234,179,8,0.15)] transform hover:scale-[1.02] transition-all">
             <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[9px] font-bold px-3 py-1 rounded-bl-lg uppercase">🔥 Mejor Valor</div>
             
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">AGENCIA</h3>
            </div>
            <p className="text-xs text-yellow-300 mb-6 font-mono">DOMINIO TOTAL</p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">$139.990</span>
              <span className="text-white/30 text-xs"> + IVA/mes</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1 text-xs text-white/90">
              <li className="flex gap-2 text-yellow-400"><span>✓</span> <b>500 Créditos HD</b></li>
              <li className="flex gap-2 text-yellow-400"><span>✓</span> <b>2.500 Borradores</b></li>
              <li className="flex gap-2"><span>✓</span> Licencia Comercial</li>
              <li className="flex gap-2"><span>✓</span> Soporte Humano</li>
            </ul>

            <button onClick={() => handleContact("Agencia")} className="w-full py-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all text-sm font-bold">
              CONTRATAR AGENCIA
            </button>
          </div>

        </div>

        {/* RECARGAS SECTION */}
        <div className="border-t border-white/10 p-8 bg-[#0A0A0A]">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Recarga de <span className="text-green-400">Créditos Sueltos</span>
          </h3>
          <p className="text-white/60 text-center mb-6 text-sm">
            Para cuando se acaba el plan. Estos créditos <b>no vencen</b>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {rechargePlans.map((plan) => (
              <div key={plan.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-green-500/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${plan.color === 'green' ? 'text-green-400' : plan.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
                    {plan.icon}
                  </div>
                  <h4 className="font-bold text-white">{plan.name}</h4>
                </div>
                <p className="text-xs text-white/50 mb-2">{plan.description}</p>
                <div className="text-2xl font-black text-white mb-3">
                  {formatPrice(plan.price)}
                  <span className="text-xs font-normal text-white/40"> (IVA Incl.)</span>
                </div>
                <ul className="space-y-1 text-xs text-white/70 mb-4">
                  <li>✓ <b>{plan.credits}</b> Créditos HD</li>
                  <li>✓ <b>{plan.drafts}</b> Borradores de regalo</li>
                </ul>
                <button
                  onClick={() => handleRecharge(plan.id)}
                  disabled={processingRecharge === plan.id}
                  className="w-full py-2 rounded-lg border border-white/20 hover:bg-white hover:text-black transition-all text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingRecharge === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </span>
                  ) : (
                    `Cargar ${plan.name}`
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* EQUIVALENCIAS */}
          <div className="mt-8 bg-white/5 rounded-xl p-6 max-w-2xl mx-auto">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4 text-center">
              Resumen de Equivalencias
            </h4>
            {loadingEquivalences ? (
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-3 animate-pulse">
                  <span className="text-2xl">📸</span>
                  <p className="text-lg font-bold text-white">Cargando...</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 animate-pulse">
                  <span className="text-2xl">🎬</span>
                  <p className="text-lg font-bold text-white">Cargando...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-center">
                {equivalences.map((eq) => (
                  <div key={eq.id} className="bg-white/10 rounded-lg p-3">
                    {eq.media_type === 'photo_hd' ? (
                      <>
                        <span className="text-2xl">📸</span>
                        <p className="text-lg font-bold text-white">1 Foto HD</p>
                        <p className="text-sm text-white/60">= {eq.credits_required} Crédito{eq.credits_required !== 1 ? 's' : ''}</p>
                      </>
                    ) : eq.media_type === 'video_hd' ? (
                      <>
                        <span className="text-2xl">🎬</span>
                        <p className="text-lg font-bold text-white">1 Video HD</p>
                        <p className="text-sm text-white/60">= {eq.credits_required} Créditos</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-bold text-white">{eq.description}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-white/40 mt-3 text-center">
              *Los Borradores se descuentan de tu saldo de borradores de regalo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};