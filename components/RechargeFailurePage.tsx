import React from 'react';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RechargeFailurePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        
        {/* Icono de fallo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold mb-4">
          Recarga <span className="text-red-400">Fallida</span>
        </h1>

        {/* Mensaje */}
        <p className="text-white/60 mb-8">
          El pago no pudo procesarse. Esto puede haber ocurrido por:
        </p>

        {/* Razones */}
        <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10 text-left">
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Tarjeta rechazada o sin fondos
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Datos de tarjeta incorrectos
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">•</span>
              Tu banco rechazó la transacción
            </li>
          </ul>
        </div>

        {/* Botones */}
        <div className="space-y-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Intentar nuevamente
          </Link>
          
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-white/30">
          ¿Necesitas ayuda? Escríbenos a soporte@estudio56.cl
        </p>
      </div>
    </div>
  );
};