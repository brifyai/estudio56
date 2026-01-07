import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Mail } from 'lucide-react';

export const PaymentPendingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Pending Card */}
        <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 p-8 md:p-12 text-center">
          {/* Pending Icon */}
          <div className="mb-6 flex justify-center">
            <Clock className="w-24 h-24 text-yellow-500 animate-pulse" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pago Pendiente
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-400 mb-8">
            Tu pago está siendo procesado
          </p>

          {/* Info Box */}
          <div className="bg-yellow-900/20 rounded-2xl p-6 mb-8 border border-yellow-800/30">
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-white mb-2">
                  ¿Qué significa esto?
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Algunos métodos de pago requieren tiempo adicional para ser confirmados.
                  Esto puede tomar desde unos minutos hasta 48 horas dependiendo del método elegido.
                </p>
                <p className="text-gray-300 text-sm">
                  Te enviaremos un email cuando tu pago sea confirmado y tu plan se active automáticamente.
                </p>
              </div>
            </div>
          </div>

          {/* Status Box */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Métodos de pago que pueden estar pendientes:
            </h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl">•</span>
                <span className="text-gray-300">
                  Transferencia bancaria
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl">•</span>
                <span className="text-gray-300">
                  Pago en efectivo (Servipag, etc.)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-500 text-xl">•</span>
                <span className="text-gray-300">
                  Algunos pagos con tarjeta de débito
                </span>
              </li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-900/20 rounded-2xl p-6 mb-8 border border-blue-800/30 text-left">
            <h3 className="text-lg font-semibold text-white mb-4">
              Próximos pasos:
            </h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">1.</span>
                <span className="text-gray-300">
                  Revisa tu email para instrucciones adicionales si es necesario
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">2.</span>
                <span className="text-gray-300">
                  Espera la confirmación del pago (puede tomar hasta 48 horas)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-bold">3.</span>
                <span className="text-gray-300">
                  Tu plan se activará automáticamente una vez confirmado
                </span>
              </li>
            </ol>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGoBack}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>

          {/* Support Link */}
          <p className="text-sm text-gray-500 mt-6">
            ¿Tienes dudas?{' '}
            <a
              href="mailto:soporte@estudio56.cl"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Contáctanos
            </a>
          </p>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Puedes seguir usando tu plan actual mientras tanto
          </p>
        </div>
      </div>
    </div>
  );
};
