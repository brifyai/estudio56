import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    // Get payment details from URL params
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');
    const externalReference = searchParams.get('external_reference');

    if (paymentId && status === 'approved') {
      setPaymentDetails({
        paymentId,
        status,
        externalReference
      });
    }

    setIsLoading(false);

    return () => clearInterval(interval);
  }, [searchParams]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <CheckCircle className="w-24 h-24 text-green-500 animate-bounce" />
              <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¡Pago Exitoso!
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-400 mb-8">
            Tu plan ha sido activado correctamente
          </p>

          {/* Details Box */}
          <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Estado del Pago</span>
                <span className="text-green-500 font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Aprobado
                </span>
              </div>
              
              {paymentDetails?.paymentId && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ID de Transacción</span>
                  <span className="text-white font-mono text-sm">
                    {paymentDetails.paymentId}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Recibirás un email de confirmación con los detalles de tu compra.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl p-6 mb-8 border border-blue-800/30">
            <h3 className="text-lg font-semibold text-white mb-4">
              ¿Qué sigue ahora?
            </h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  Tus créditos han sido agregados a tu cuenta
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  Ya puedes generar imágenes y videos en alta definición
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  Accede a todas las funciones premium de tu plan
                </span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            Ir al Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Support Link */}
          <p className="text-sm text-gray-500 mt-6">
            ¿Tienes algún problema?{' '}
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
            Gracias por confiar en Estudio 56 🎨
          </p>
        </div>
      </div>
    </div>
  );
};
