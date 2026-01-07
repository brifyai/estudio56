import React, { useEffect } from 'react';
import { CheckCircle, ArrowLeft, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';

export const RechargeSuccessPage: React.FC = () => {
  useEffect(() => {
    // Celebrar con confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b'],
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        
        {/* Icono de éxito */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold mb-4">
          ¡Recarga <span className="text-green-400">Exitosa!</span> 🎉
        </h1>

        {/* Mensaje */}
        <p className="text-white/60 mb-8">
          Tus créditos han sido agregados a tu cuenta. Ya puedes usarlos para generar imágenes y videos.
        </p>

        {/* Detalles */}
        <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">Pago aprobado</span>
          </div>
          <p className="text-sm text-white/40">
            El pago se procesó correctamente. Recibirás un comprobante por email.
          </p>
        </div>

        {/* Botones */}
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="block w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-all"
          >
            Ir al Dashboard
          </Link>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-white/30">
          ¿Dudas? Escríbenos a soporte@estudio56.cl
        </p>
      </div>
    </div>
  );
};