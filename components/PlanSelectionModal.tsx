import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, Zap, Crown, Gift } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  drafts: number;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onSelectPlan: (planId: string) => void;
  isLoading?: boolean;
}

export const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
  isLoading = false
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: 'GRATIS',
      name: 'Gratis',
      price: 0,
      credits: 0,
      drafts: 3,
      features: [
        '3 Borradores/día (Imagen)',
        'Solo Visualización (Sin descarga)',
        'Sin Créditos HD',
        'Sin Generación de Video'
      ],
      icon: <Gift className="w-6 h-6" />,
      color: 'gray'
    },
    {
      id: 'ESTOY PARTIENDO',
      name: 'Estoy Partiendo',
      price: 14990,
      credits: 40,
      drafts: 200,
      features: [
        '40 Créditos HD (40 fotos o 4 videos)',
        '200 Borradores de Imagen',
        'Videos HD (Requiere 10 créditos c/u)',
        'Sin Carga de Productos'
      ],
      icon: <Sparkles className="w-6 h-6" />,
      color: 'blue',
      popular: true
    },
    {
      id: 'JEFE PYME',
      name: 'Jefe PYME',
      price: 44990,
      credits: 150,
      drafts: 750,
      features: [
        '150 Créditos HD (150 fotos o 15 videos)',
        '750 Borradores de Imagen',
        'Videos HD (Costo: 10 créditos)',
        'Carga de Productos (PNG)'
      ],
      icon: <Zap className="w-6 h-6" />,
      color: 'purple'
    },
    {
      id: 'AGENCIA',
      name: 'Agencia',
      price: 139990,
      credits: 500,
      drafts: 2500,
      features: [
        '500 Créditos HD (500 fotos o 50 videos)',
        '2.500 Borradores de Imagen',
        'Licencia Comercial',
        'Soporte Humano'
      ],
      icon: <Crown className="w-6 h-6" />,
      color: 'yellow'
    }
  ];

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      gray: {
        border: isSelected ? 'border-gray-500' : 'border-gray-700',
        bg: 'bg-gray-800',
        text: 'text-gray-400',
        button: 'bg-gray-700 hover:bg-gray-600'
      },
      blue: {
        border: isSelected ? 'border-blue-500' : 'border-gray-700',
        bg: 'bg-blue-900/20',
        text: 'text-blue-400',
        button: 'bg-blue-600 hover:bg-blue-500'
      },
      purple: {
        border: isSelected ? 'border-purple-500' : 'border-gray-700',
        bg: 'bg-purple-900/20',
        text: 'text-purple-400',
        button: 'bg-purple-600 hover:bg-purple-500'
      },
      yellow: {
        border: isSelected ? 'border-yellow-500' : 'border-gray-700',
        bg: 'bg-yellow-900/20',
        text: 'text-yellow-400',
        button: 'bg-yellow-600 hover:bg-yellow-500'
      }
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gray-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Elige tu Plan Perfecto
            </h2>
            <p className="text-gray-400">
              {currentPlan === 'GRATIS' 
                ? 'Desbloquea todo el potencial de Estudio 56'
                : 'Cambia o mejora tu plan actual'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Plans Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan;
            const isSelected = selectedPlanId === plan.id;
            const colors = getColorClasses(plan.color, isSelected);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 ${colors.border} ${colors.bg} p-6 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  isSelected ? 'ring-4 ring-offset-2 ring-offset-gray-900' : ''
                }`}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      MÁS POPULAR
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      ACTUAL
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`${colors.text} mb-4`}>
                  {plan.icon}
                </div>

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-bold text-white">Gratis</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-white">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">/mes</span>
                    </>
                  )}
                </div>

                {/* Credits & Drafts */}
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={`text-2xl font-bold ${colors.text}`}>
                        {plan.credits}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">
                        créditos HD
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-lg font-bold text-white">
                      {plan.drafts}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">
                      borradores
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isCurrentPlan) {
                      onSelectPlan(plan.id);
                    }
                  }}
                  disabled={isCurrentPlan || isLoading}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    isCurrentPlan
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : `${colors.button} text-white hover:scale-105 active:scale-95`
                  } ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Procesando...
                    </span>
                  ) : isCurrentPlan ? (
                    'Plan Actual'
                  ) : plan.price === 0 ? (
                    'Continuar Gratis'
                  ) : (
                    'Seleccionar Plan'
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-6 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              <p>✓ Cancela cuando quieras</p>
              <p>✓ Precios incluyen IVA</p>
              <p>✓ Pago seguro con MercadoPago</p>
            </div>
            {currentPlan === 'GRATIS' && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
              >
                Continuar con Plan Gratis
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
