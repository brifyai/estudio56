import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import { getUserPayments, formatPrice, getPaymentStatusLabel, type Payment } from '../services/paymentService';

interface SubscriptionSectionProps {
  userId: string;
  currentPlan: string;
  credits: number;
  onChangePlan: () => void;
}

export const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  userId,
  currentPlan,
  credits,
  onChangePlan,
}) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllPayments, setShowAllPayments] = useState(false);

  useEffect(() => {
    loadPayments();
  }, [userId]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const data = await getUserPayments(userId);
      setPayments(data);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const displayedPayments = showAllPayments ? payments : payments.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-6 border border-blue-800/30">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Plan {currentPlan}
            </h3>
            <p className="text-gray-400">
              Tu plan actual y beneficios
            </p>
          </div>
          <button
            onClick={onChangePlan}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
          >
            Cambiar Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Créditos Disponibles</span>
            </div>
            <p className="text-3xl font-bold text-white">{credits}</p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Próxima Renovación</span>
            </div>
            <p className="text-lg font-semibold text-white">
              {currentPlan === 'GRATIS' ? 'N/A' : '1 de cada mes'}
            </p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">
          Historial de Pagos
        </h3>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando historial...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No tienes pagos registrados</p>
            <p className="text-gray-500 text-sm mt-2">
              Cuando realices tu primer pago, aparecerá aquí
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {displayedPayments.map((payment: any) => {
                const statusInfo = getPaymentStatusLabel(payment.status);
                return (
                  <div
                    key={payment.id}
                    className="bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(payment.status)}
                        <div>
                          <p className="text-white font-semibold">
                            {payment.user_plans?.name || 'Plan'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {formatDate(payment.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-white font-bold">
                          {formatPrice(payment.amount)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            statusInfo.color === 'green'
                              ? 'bg-green-900/30 text-green-400'
                              : statusInfo.color === 'red'
                              ? 'bg-red-900/30 text-red-400'
                              : statusInfo.color === 'yellow'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-gray-700 text-gray-400'
                          }`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {payment.payment_method && (
                      <div className="mt-3 pt-3 border-t border-gray-800">
                        <p className="text-gray-500 text-xs">
                          Método: {payment.payment_method}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {payments.length > 3 && (
              <button
                onClick={() => setShowAllPayments(!showAllPayments)}
                className="w-full mt-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 border border-gray-700"
              >
                {showAllPayments ? 'Ver Menos' : `Ver Todos (${payments.length})`}
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${
                    showAllPayments ? 'rotate-90' : ''
                  }`}
                />
              </button>
            )}
          </>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">
          ¿Necesitas ayuda?
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Si tienes problemas con tu suscripción o pagos, estamos aquí para ayudarte.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:soporte@estudio56.cl"
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-center transition-all"
          >
            Contactar Soporte
          </a>
          <a
            href="/terminos"
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold text-center transition-all"
          >
            Ver Términos
          </a>
        </div>
      </div>
    </div>
  );
};
