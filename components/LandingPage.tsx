import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRechargePreference, redirectToCheckout, RECHARGE_CONFIG } from '../services/paymentService';
import { supabase } from '../services/supabaseService';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [processingRecharge, setProcessingRecharge] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate network request
    setTimeout(() => {
        setFormState('success');
    }, 1500);
  };

  const handleRecharge = async (rechargeType: 'INDIVIDUAL' | 'SALVATORE' | 'IMPULSO') => {
    try {
      setProcessingRecharge(rechargeType);
      
      // Get current user from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        // Redirect to login if not authenticated
        navigate('/iniciar-sesion');
        return;
      }

      // Create payment preference
      const preference = await createRechargePreference(session.user.id, rechargeType);

      // Redirect to MercadoPago
      redirectToCheckout(preference.initPoint);
    } catch (error) {
      console.error('Error al procesar recarga:', error);
      alert('Hubo un error al procesar tu recarga. Por favor intenta nuevamente.');
    } finally {
      setProcessingRecharge(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-pink-500 selection:text-white">
      
      {/* NAV */}
      <nav className="flex justify-between items-center p-6 border-b border-white/10 bg-black/50 backdrop-blur sticky top-0 z-50">
        <div className="text-xl font-bold tracking-tighter flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          <span className="text-3xl">🤡</span>
          <span className="text-green-400 uppercase">Estudio 56</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const contactSection = document.getElementById('contact-form');
              contactSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }} 
            className="bg-pink-500 text-white font-bold px-4 py-2 rounded-full hover:scale-105 transition-transform text-sm cursor-pointer"
          >
            Escríbenos
          </button>
          <button onClick={() => navigate('/iniciar-sesion')} className="bg-white text-black font-bold px-4 py-2 rounded-full hover:scale-105 transition-transform text-sm cursor-pointer">
            Entrar a la Matrix
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-20 pb-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
        
        {/* Floating Memes / Elements */}
        <div className="absolute top-10 left-10 animate-bounce delay-700 hidden md:block">
            <div className="bg-white text-black p-4 rounded-xl rotate-[-6deg] shadow-[8px_8px_0px_#ff00ff] border-2 border-black max-w-xs">
                <p className="font-comic font-bold text-sm">"Tía, yo le hago el logo en Word"</p>
                <p className="text-xs mt-2 text-gray-500">- El sobrino</p>
            </div>
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse hidden md:block">
            <div className="bg-yellow-300 text-black p-4 rounded-xl rotate-[3deg] shadow-[8px_8px_0px_#000] border-2 border-black">
                <p className="font-mono font-bold text-lg">Graphic design is my passion 🐸</p>
            </div>
        </div>

        <div className="inline-block px-4 py-1 rounded-full border border-pink-500/50 bg-pink-500/10 text-pink-400 mb-8 font-mono text-xs uppercase tracking-widest animate-pulse">
            ⚠️ Alerta de Cringe Visual
        </div>

        <h1 className="text-4xl md:text-8xl font-black leading-[1] mb-8 tracking-tighter text-center">
            ¿TU PYME SE VE <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-500">COMO EL HOY*?</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10 font-light">
            Deja de pelear con Canva. Deja de pedirle favores a tu sobrino.
            Usa Inteligencia Artificial Chilena de verdad.
        </p>

        <button
            onClick={() => navigate('/iniciar-sesion')}
            className="inline-flex items-center justify-center px-8 py-6 text-xl font-black text-black transition-all duration-200 bg-green-400 rounded-2xl hover:bg-green-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 shadow-[0_0_40px_rgba(74,222,128,0.4)] cursor-pointer"
        >
            REPARAR MI DIGNIDAD DIGITAL
        </button>

        <p className="mt-6 text-white/30 text-xs font-mono">
            *Resultados profesionales en segundos. No requiere título universitario.
        </p>
      </header>

      {/* MARQUEE */}
      <div className="bg-yellow-400 text-black py-3 overflow-hidden border-y-4 border-black rotate-[-1deg]">
        <div className="whitespace-nowrap animate-[shimmer_10s_linear_infinite] font-black text-xl uppercase flex gap-8">
            <span>🚫 No más Comic Sans</span>
            <span>🔥 IA Potenciada</span>
            <span>🇨🇱 100% Chilensis</span>
            <span>💸 Vende más</span>
            <span>⚡ Genera en segundos</span>
            <span>🚫 No más Comic Sans</span>
            <span>🔥 IA Potenciada</span>
            <span>🇨🇱 100% Chilensis</span>
        </div>
      </div>

      {/* COMPARISON SECTION */}
      <section className="py-24 px-6 bg-[#0A0A0A]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                  <h2 className="text-4xl font-bold">Expectativa vs. Realidad</h2>
                  <p className="text-white/60 text-lg">
                      Sabemos que intentas hacerlo bien, pero el Paint no apaña. 
                      Estudio 56 toma tu idea en "chilensis" y la transforma en una pieza de arte comercial digna de Nueva York (o Las Condes).
                  </p>
                  
                  <ul className="space-y-4 font-mono text-sm text-white/80">
                      <li className="flex items-center gap-3 text-red-400">
                          <span className="text-xl">❌</span> "Vendo tocomples ricos" (Texto plano)
                      </li>
                      <li className="flex items-center gap-3 text-green-400 p-2 bg-white/5 rounded-lg border border-green-500/30">
                          <span className="text-xl">✅</span> Prompt IA: "Fotografía gastronómica 8K, iluminación cinemática..."
                      </li>
                  </ul>
              </div>

              {/* MOCKUP VISUAL (ORIGINAL) */}
              <div className="relative group perspective-1000">
                  {/* The "Bad" Design (Floating behind) */}
                  <div className="absolute -left-10 top-20 w-40 h-40 bg-white p-2 shadow-xl rotate-[-12deg] z-0 border border-gray-200 flex flex-col items-center justify-center opacity-40 group-hover:opacity-10 transition-all duration-500">
                      <div className="text-4xl">🌭</div>
                      <div className="text-black font-serif text-center text-xs">Se benden Completos</div>
                      <div className="text-red-600 font-bold text-lg">$1000</div>
                  </div>

                  {/* The "Platform Mockup" (CSS Construction) */}
                  <div className="relative z-10 w-full bg-[#111] rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                       
                        {/* Mockup Header */}
                        <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                           <div className="w-2 h-2 rounded-full bg-red-500"></div>
                           <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                           <div className="w-2 h-2 rounded-full bg-green-500"></div>
                           <div className="ml-auto w-20 h-1.5 bg-white/10 rounded-full"></div>
                        </div>

                        {/* Mockup Body */}
                        <div className="flex">
                            {/* Sidebar Mockup */}
                            <div className="w-16 border-r border-white/5 p-3 flex flex-col gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/50"></div>
                                <div className="w-8 h-8 rounded-lg bg-white/5"></div>
                                <div className="w-8 h-8 rounded-lg bg-white/5"></div>
                            </div>
                            
                            {/* Main Canvas Mockup */}
                            <div className="flex-1 p-4 relative">
                                {/* The Result Image */}
                                <div className="aspect-[4/5] w-full rounded-lg overflow-hidden relative shadow-2xl">
                                   <img 
                                     src="https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=800&q=80" 
                                     className="w-full h-full object-cover"
                                     alt="Result"
                                   />
                                   {/* Floating UI Elements */}
                                   <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md rounded-lg p-3 border border-white/10 flex items-center gap-3">
                                       <div className="w-8 h-8 rounded bg-green-500 flex items-center justify-center text-xs">✨</div>
                                       <div className="flex-1">
                                           <div className="h-1.5 w-3/4 bg-white rounded-full mb-1"></div>
                                           <div className="h-1.5 w-1/2 bg-white/30 rounded-full"></div>
                                       </div>
                                       <div className="text-[10px] font-mono text-green-400">100%</div>
                                   </div>
                                   
                                   {/* Floating Tags */}
                                   <div className="absolute top-4 right-4 flex flex-col gap-2">
                                       <div className="px-2 py-1 bg-blue-500 text-white text-[9px] font-bold rounded shadow-lg uppercase tracking-wide">
                                           Generado con IA
                                       </div>
                                       <div className="px-2 py-1 bg-black/50 text-white text-[9px] font-mono rounded border border-white/20">
                                           1024 x 1792
                                       </div>
                                   </div>
                                </div>
                            </div>
                        </div>
                  </div>
              </div>
          </div>
      </section>

      {/* PRICING PLANS (Updated Grid) */}
      <section className="py-24 px-6 bg-white text-black relative">
        <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/20 to-transparent"></div>
        <div className="max-w-[1400px] mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-center mb-16 tracking-tighter uppercase">
                Planes pa' <br/> <span className="text-pink-600">todos los bolsillo</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* PLAN Gratis (NEW) */}
                <div className="border-4 border-gray-300 p-6 rounded-2xl hover:translate-y-[-10px] hover:shadow-xl transition-all bg-white flex flex-col">
                    <div className="bg-gray-200 text-black text-xs font-bold uppercase py-1 px-3 rounded-full self-start mb-4">
                        Modo Prueba
                    </div>
                    <h3 className="font-black text-2xl mb-2">GRATIS</h3>
                    <p className="text-sm font-mono mb-6 text-gray-500">Solo pa' mirar, no se toca (mucho).</p>
                    <div className="text-4xl font-black mb-6">$0 <span className="text-sm font-normal">/siempre</span></div>
                    <ul className="space-y-3 mb-8 text-xs font-bold flex-1 text-gray-600">
                        <li className="flex items-center gap-2">✔️ 3 Borradores/día (Imagen)</li>
                        <li className="flex items-center gap-2">✔️ Solo Visualización (Sin descarga)</li>
                        <li className="flex items-center gap-2 opacity-50">❌ Sin Créditos HD</li>
                        <li className="flex items-center gap-2 opacity-50">❌ Generación de Video</li>
                    </ul>
                    <button onClick={() => navigate('/iniciar-sesion')} className="w-full py-3 border-2 border-gray-300 text-gray-500 font-black uppercase hover:border-black hover:text-black transition-colors cursor-pointer">
                        Probar Ahora
                    </button>
                </div>

                {/* Plan 1: ESTOY PARTIENDO */}
                <div className="border-4 border-black p-6 rounded-2xl hover:translate-y-[-10px] hover:shadow-[10px_10px_0px_rgba(0,0,0,1)] transition-all bg-gray-100 flex flex-col">
                    <h3 className="font-black text-2xl mb-2">ESTOY PARTIENDO</h3>
                    <p className="text-sm font-mono mb-6 text-gray-600">Pa' probar si la IA es de verdad.</p>
                    <div className="text-4xl font-black mb-6">$14.990 <span className="text-sm font-normal text-gray-500">+ IVA/mes</span></div>
                    <ul className="space-y-3 mb-8 text-xs font-bold flex-1">
                        <li>✔️ <b>40 Créditos HD</b> (40 fotos o 4 videos)</li>
                        <li>✔️ <b>200 Borradores</b> de Imagen</li>
                        <li className="text-gray-500">❌ Videos HD (Requiere 10 créditos c/u)</li>
                        <li className="text-gray-500">❌ Carga de Productos</li>
                    </ul>
                    <button onClick={() => navigate('/iniciar-sesion')} className="w-full py-3 border-2 border-black font-black uppercase hover:bg-black hover:text-white transition-colors cursor-pointer">
                        Elegir este
                    </button>
                </div>

                {/* Plan 2: JEFE PYME */}
                <div className="border-4 border-black p-6 rounded-2xl hover:translate-y-[-10px] hover:shadow-[10px_10px_0px_rgba(0,0,0,0.5)] transition-all bg-white relative flex flex-col">
                    <h3 className="font-black text-2xl mb-2">JEFE PYME</h3>
                    <p className="text-sm font-mono mb-6 text-gray-600">Pa' darle corte a las redes.</p>
                    <div className="text-4xl font-black mb-6">$44.990 <span className="text-sm font-normal text-gray-500">+ IVA/mes</span></div>
                    <ul className="space-y-3 mb-8 text-xs font-bold text-gray-800 flex-1">
                        <li>✔️ <b>150 Créditos HD</b> (150 fotos o 15 videos)</li>
                        <li>✔️ <b>750 Borradores</b> de Imagen</li>
                        <li className="text-orange-500">⚠️ <b>Videos HD</b> (Costo: 10 créditos)</li>
                        <li>✔️ Carga de Productos (PNG)</li>
                    </ul>
                    <button onClick={() => navigate('/iniciar-sesion')} className="w-full py-3 border-2 border-black text-black font-black uppercase hover:bg-gray-100 transition-colors cursor-pointer">
                        LO QUIERO
                    </button>
                </div>

                {/* Plan 3: AGENCIA */}
                <div className="border-4 border-black p-6 rounded-2xl hover:translate-y-[-10px] hover:shadow-[10px_10px_0px_#ff00ff] transition-all bg-yellow-300 relative z-10 flex flex-col">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 font-mono text-[10px] font-bold uppercase rotate-2 shadow-lg w-max">
                        🔥 MEJOR VALOR
                    </div>
                    <h3 className="font-black text-2xl mb-2">AGENCIA</h3>
                    <p className="text-sm font-mono mb-6 opacity-80">Dominio total.</p>
                    <div className="text-4xl font-black mb-6">$139.990 <span className="text-sm font-normal text-gray-600">+ IVA/mes</span></div>
                    <ul className="space-y-3 mb-8 text-xs font-bold flex-1">
                        <li className="flex items-center gap-2">🚀 <b>500 Créditos HD</b> (500 fotos o 50 videos)</li>
                        <li className="flex items-center gap-2">✔️ <b>2.500 Borradores</b> de Imagen</li>
                        <li className="flex items-center gap-2">✔️ Licencia Comercial</li>
                        <li className="flex items-center gap-2">✔️ Soporte Humano</li>
                    </ul>
                    <button onClick={() => navigate('/iniciar-sesion')} className="w-full py-3 bg-black text-white font-black uppercase hover:bg-gray-800 transition-colors shadow-2xl cursor-pointer">
                        CONTRATAR AGENCIA
                    </button>
                </div>

            </div>
        </div>
      </section>

      {/* RECARGAS SECTION */}
      <section className="py-24 px-6 bg-[#0A0A0A] text-white relative">
        <div className="max-w-[1400px] mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-center mb-16 tracking-tighter uppercase">
                Recarga de <br/> <span className="text-green-400">Créditos Sueltos</span>
            </h2>
            <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">
                Para cuando se acaba el plan o para usuarios gratis. Estos créditos <b>no vencen</b>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                
                {/* INDIVIDUAL */}
                <div className="border-2 border-white/20 p-6 rounded-2xl hover:border-green-500/50 transition-all bg-white/5 flex flex-col">
                    <h3 className="font-black text-xl mb-2 text-green-400">INDIVIDUAL</h3>
                    <p className="text-sm text-white/60 mb-4">Pa' la emergencia del día.</p>
                    <div className="text-3xl font-black mb-6">$2.990 <span className="text-xs text-white/40">(IVA Incl.)</span></div>
                    <ul className="space-y-2 mb-6 text-sm flex-1">
                        <li>✔️ <b>10 Créditos HD</b></li>
                        <li>✔️ <b>5 Borradores</b> de regalo</li>
                        <li className="text-white/50 text-xs">✨ 1 Video HD o 10 Fotos HD</li>
                    </ul>
                    <button onClick={() => handleRecharge('INDIVIDUAL')} className="w-full py-3 border-2 border-green-500 text-green-400 font-black uppercase hover:bg-green-500 hover:text-black transition-colors cursor-pointer">
                        Cargar Unito
                    </button>
                </div>

                {/* SALVATORE */}
                <div className="border-2 border-white/20 p-6 rounded-2xl hover:border-blue-500/50 transition-all bg-white/5 flex flex-col relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 font-mono text-[10px] font-bold uppercase rounded-full">
                        ⭐ POPULAR
                    </div>
                    <h3 className="font-black text-xl mb-2 text-blue-400">SALVATORE</h3>
                    <p className="text-sm text-white/60 mb-4">Pa' salvar la semana.</p>
                    <div className="text-3xl font-black mb-6">$9.990 <span className="text-xs text-white/40">(IVA Incl.)</span></div>
                    <ul className="space-y-2 mb-6 text-sm flex-1">
                        <li>✔️ <b>50 Créditos HD</b></li>
                        <li>✔️ <b>25 Borradores</b> de regalo</li>
                        <li className="text-white/50 text-xs">✨ 5 Videos HD o 50 Fotos HD</li>
                    </ul>
                    <button onClick={() => handleRecharge('SALVATORE')} className="w-full py-3 border-2 border-blue-500 text-blue-400 font-black uppercase hover:bg-blue-500 hover:text-black transition-colors cursor-pointer">
                        Cargar Salvatore
                    </button>
                </div>

                {/* IMPULSO */}
                <div className="border-2 border-white/20 p-6 rounded-2xl hover:border-purple-500/50 transition-all bg-white/5 flex flex-col">
                    <h3 className="font-black text-xl mb-2 text-purple-400">IMPULSO</h3>
                    <p className="text-sm text-white/60 mb-4">Pa' meterle con todo.</p>
                    <div className="text-3xl font-black mb-6">$24.990 <span className="text-xs text-white/40">(IVA Incl.)</span></div>
                    <ul className="space-y-2 mb-6 text-sm flex-1">
                        <li>✔️ <b>150 Créditos HD</b></li>
                        <li>✔️ <b>750 Borradores</b> de regalo</li>
                        <li className="text-white/50 text-xs">✨ 15 Videos HD o 150 Fotos HD</li>
                    </ul>
                    <button onClick={() => handleRecharge('IMPULSO')} className="w-full py-3 border-2 border-purple-500 text-purple-400 font-black uppercase hover:bg-purple-500 hover:text-black transition-colors cursor-pointer">
                        Cargar Impulso
                    </button>
                </div>

            </div>

            {/* EQUIVALENCIAS */}
            <div className="mt-16 bg-white/5 rounded-2xl p-8 max-w-3xl mx-auto">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-4 text-center">
                    Resumen de Equivalencias
                </h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-white/10 rounded-xl p-4">
                        <span className="text-2xl">📸</span>
                        <p className="text-lg font-bold text-white">1 Foto HD</p>
                        <p className="text-sm text-white/60">= 1 Crédito</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <span className="text-2xl">🎬</span>
                        <p className="text-lg font-bold text-white">1 Video HD</p>
                        <p className="text-sm text-white/60">= 10 Créditos</p>
                    </div>
                </div>
                <p className="text-xs text-white/40 mt-4 text-center">
                    *Los Borradores se descuentan de tu saldo de borradores de regalo.
                </p>
            </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section id="contact-form" className="py-24 px-6 bg-pink-500 text-white relative overflow-hidden">
         {/* Decorative pattern */}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
         
         <div className="max-w-3xl mx-auto relative z-10 text-center">
            <h2 className="text-2xl md:text-6xl font-black mb-6 uppercase tracking-tighter">¿Dudas? ¿Miedo al éxito?</h2>
            <p className="text-lg font-mono mb-10 opacity-90">
                Escríbenos. Prometemos no responder con un bot (mentira, probablemente sí, pero uno simpático).
            </p>

            <form onSubmit={handleSubmit} className="bg-black p-8 rounded-3xl shadow-[15px_15px_0px_#ffffff] border-4 border-white text-left space-y-6 transform rotate-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/50">Tu Nombre</label>
                        <input 
                            required 
                            type="text" 
                            placeholder="Juan Pérez" 
                            className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:bg-white/20 transition-all font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/50">Tu Correo</label>
                        <input 
                            required 
                            type="email" 
                            placeholder="juan@pymes.cl" 
                            className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:bg-white/20 transition-all font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/50">El Cahuín (Mensaje)</label>
                    <textarea 
                        required 
                        rows={4} 
                        placeholder="Hola, quiero que mi negocio deje de verse como..." 
                        className="w-full bg-white/10 border-2 border-white/20 rounded-xl px-4 py-3 focus:border-pink-500 focus:outline-none focus:bg-white/20 transition-all font-bold resize-none"
                    ></textarea>
                </div>

                <button
                    disabled={formState !== 'idle'}
                    type="submit"
                    className="w-full bg-white text-black font-black text-xl py-4 rounded-xl hover:bg-gray-200 transition-colors uppercase tracking-tight flex items-center justify-center gap-2 cursor-pointer"
                >
                    {formState === 'idle' && (
                        <>ENVIAR MENSAJE</>
                    )}
                    {formState === 'submitting' && (
                        <><span>⏳</span> ENVIANDO...</>
                    )}
                    {formState === 'success' && (
                        <><span>✅</span> ¡RECIBIDO! (Te llamamos)</>
                    )}
                </button>

                {formState === 'success' && (
                    <p className="text-center text-xs font-mono text-green-400 mt-2 animate-pulse">
                        Tu mensaje ha sido enviado al ciberespacio.
                    </p>
                )}
            </form>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-white text-sm bg-black border-t border-white/10">
          <p>© 2026 Estudio 56. Hecho con paciencia y mucha cafeína.</p>
          <p className="mt-2 text-[10px] font-mono">No nos hacemos responsables si tus ventas explotan.</p>
          <div className="mt-4 flex justify-center gap-4 text-xs">
            <a href="/privacidad" className="hover:text-green-400 transition-colors cursor-pointer">Privacidad</a>
            <span className="text-white/40">|</span>
            <a href="/cookies" className="hover:text-green-400 transition-colors cursor-pointer">Cookies</a>
            <span className="text-white/40">|</span>
            <a href="/terminos" className="hover:text-green-400 transition-colors cursor-pointer">Términos</a>
            <span className="text-white/40">|</span>
            <a href="/condiciones" className="hover:text-green-400 transition-colors cursor-pointer">Condiciones</a>
          </div>
      </footer>
    </div>
  );
};