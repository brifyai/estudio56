import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export const PaymentFailurePage: React.FC = () => {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Failure Card */}
        <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 p-8 md:p-12 text-center">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <XCircle className="w-24 h-24 text-red-500" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pago No Completado
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-400 mb-8">
            Hubo un problema al procesar tu pago
          </p>

          {/* Reasons Box */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700 text-left">
            <h3 className="text-lg font-semibold text-white mb-4">
              Posibles causas:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span className="text-gray-300">
                  Fondos insuficientes en tu cuenta
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span className="text-gray-300">
                  Datos de pago incorrectos
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span className="text-gray-300">
                  Límite de compra excedido
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 text-xl">•</span>
                <span className="text-gray-300">
                  Problemas de conexión durante el proceso
                </span>
              </li>
            </ul>
          </div>

          {/* Help Box */}
          <div className="bg-blue-900/20 rounded-2xl p-6 mb-8 border border-blue-800/30">
            <h3 className="text-lg font-semibold text-white mb-2">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Si el problema persiste, contáctanos y te ayudaremos a resolverlo.
            </p>
            <a
              href="mailto:soporte@estudio56.cl"
              className="text-blue-400 hover:text-blue-300 underline text-sm"
            >
              soporte@estudio56.cl
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleTryAgain}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              Intentar Nuevamente
            </button>
            <button
              onClick={handleGoBack}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al Dashboard
            </button>
          </div>

          {/* Note */}
          <p className="text-sm text-gray-500 mt-6">
            No se realizó ningún cargo a tu cuenta
          </p>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Todos los pagos son procesados de forma segura por MercadoPago 🔒
          </p>
        </div>
      </div>
    </div>
  );
};
