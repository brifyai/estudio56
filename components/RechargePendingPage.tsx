import React from 'react';
import { Clock, ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RechargePendingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        
        {/* Icono de pendiente */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center animate-pulse">
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold mb-4">
          Recarga <span className="text-yellow-400">Pendiente</span>
        </h1>

        {/* Mensaje */}
        <p className="text-white/60 mb-8">
          Tu pago está siendo procesado. Esto puede tomar algunos minutos dependiendo del método de pago.
        </p>

        {/* Información */}
        <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 text-left">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-white/70">
              <p className="mb-2">
                <strong className="text-white">Métodos de pago que requieren confirmación:</strong>
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Transferencia bancaria</li>
                <li>• Efectivo en puntos de pago</li>
                <li>• Otros métodos offline</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="bg-blue-500/10 rounded-2xl p-4 mb-8 border border-blue-500/30 text-left">
          <p className="text-sm text-blue-300">
            📧 Te enviaremos un email cuando tu pago sea confirmado y tus créditos sean agregados.
          </p>
        </div>

        {/* Botones */}
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
          >
            Volver al Dashboard
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