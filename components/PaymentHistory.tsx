import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseService';

interface Payment {
  id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  plan_id: string | null;
  created_at: string;
  paid_at: string | null;
  user_plans?: {
    name: string;
  };
}

interface CreditRecharge {
  id: string;
  recharge_type: string;
  credits_hd: number;
  drafts: number;
  amount: number;
  status: string;
  payment_method: string | null;
  created_at: string;
}

interface Subscription {
  id: string;
  plan_id: string;
  mp_preapproval_id: string;
  status: string;
  amount: number;
  next_payment_date: string | null;
  start_date: string | null;
  created_at: string;
  updated_at: string;
  user_plans?: {
    name: string;
  };
}

type TabType = 'all' | 'plans' | 'recharges' | 'subscriptions';

export const PaymentHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [recharges, setRecharges] = useState<CreditRecharge[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setError('Debes iniciar sesión para ver tu historial de pagos');
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      // Fetch payments (plan purchases)
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          user_plans:plan_id (name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Error fetching payments:', paymentsError);
      } else {
        setPayments(paymentsData || []);
      }

      // Fetch credit recharges
      const { data: rechargesData, error: rechargesError } = await supabase
        .from('credit_recharges')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (rechargesError) {
        console.error('Error fetching recharges:', rechargesError);
      } else {
        setRecharges(rechargesData || []);
      }

      // Fetch subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          user_plans:plan_id (name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (subscriptionsError) {
        console.error('Error fetching subscriptions:', subscriptionsError);
      } else {
        setSubscriptions(subscriptionsData || []);
      }

    } catch (err) {
      console.error('Error fetching payment history:', err);
      setError('Error al cargar el historial de pagos');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      completed: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Completado' },
      approved: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Aprobado' },
      pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Pendiente' },
      failed: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Fallido' },
      rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Rechazado' },
      cancelled: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Cancelado' },
      paused: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'Pausado' },
      authorized: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Autorizado' },
    };

    const config = statusConfig[status.toLowerCase()] || { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: status };
    
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getRechargeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'INDIVIDUAL': 'Créditos Individuales',
      'SALVATORE': 'Pack Salvatore',
      'IMPULSO': 'Impulso de Créditos'
    };
    return labels[type] || type;
  };

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return '-';
    const labels: Record<string, string> = {
      'credit_card': 'Tarjeta de Crédito',
      'debit_card': 'Tarjeta de Débito',
      'bank_transfer': 'Transferencia Bancaria',
      'webpay': 'Webpay',
      'mercadopago': 'MercadoPago'
    };
    return labels[method.toLowerCase()] || method;
  };

  const allItems = [
    ...payments.map(p => ({ type: 'plan' as const, data: p })),
    ...recharges.map(r => ({ type: 'recharge' as const, data: r })),
    ...subscriptions.map(s => ({ type: 'subscription' as const, data: s }))
  ].sort((a, b) => {
    const dateA = new Date(a.type === 'plan' ? (a.data as Payment).created_at : 
                         a.type === 'recharge' ? (a.data as CreditRecharge).created_at : 
                         (a.data as Subscription).created_at);
    const dateB = new Date(b.type === 'plan' ? (b.data as Payment).created_at : 
                         b.type === 'recharge' ? (b.data as CreditRecharge).created_at : 
                         (b.data as Subscription).created_at);
    return dateB.getTime() - dateA.getTime();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Cargando historial de pagos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-xl mb-2">Error</h2>
          <p className="text-white/70">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold">💳 Historial de Pagos</h1>
            <p className="text-white/50 text-sm">Tus pagos, recargas y suscripciones</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'Todo', count: allItems.length },
            { key: 'plans', label: 'Planes', count: payments.length },
            { key: 'recharges', label: 'Recargas', count: recharges.length },
            { key: 'subscriptions', label: 'Suscripciones', count: subscriptions.length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            {allItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-medium mb-2">Sin movimientos</h3>
                <p className="text-white/50">Aún no tienes pagos registrados</p>
              </div>
            ) : (
              allItems.map((item, index) => {
                if (item.type === 'plan') {
                  const payment = item.data as Payment;
                  return (
                    <div key={payment.id} className="glass-panel rounded-xl p-4 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl">
                            📦
                          </div>
                          <div>
                            <h4 className="font-medium">
                              Plan {payment.user_plans?.name || 'Desconocido'}
                            </h4>
                            <p className="text-white/50 text-sm">
                              {formatDate(payment.created_at)}
                            </p>
                            <p className="text-white/50 text-sm">
                              Método: {getPaymentMethodLabel(payment.payment_method)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">
                            {formatCurrency(payment.amount)}
                          </p>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    </div>
                  );
                } else if (item.type === 'recharge') {
                  const recharge = item.data as CreditRecharge;
                  return (
                    <div key={recharge.id} className="glass-panel rounded-xl p-4 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-xl">
                            ⚡
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {getRechargeTypeLabel(recharge.recharge_type)}
                            </h4>
                            <p className="text-white/50 text-sm">
                              {formatDate(recharge.created_at)}
                            </p>
                            <p className="text-white/70 text-sm">
                              +{recharge.credits_hd} créditos HD
                              {recharge.drafts > 0 && ` +${recharge.drafts} borradores`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">
                            {formatCurrency(recharge.amount)}
                          </p>
                          {getStatusBadge(recharge.status)}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const subscription = item.data as Subscription;
                  return (
                    <div key={subscription.id} className="glass-panel rounded-xl p-4 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-xl">
                            🔄
                          </div>
                          <div>
                            <h4 className="font-medium">
                              Suscripción {subscription.user_plans?.name || 'Desconocido'}
                            </h4>
                            <p className="text-white/50 text-sm">
                              {formatDate(subscription.created_at)}
                            </p>
                            {subscription.next_payment_date && (
                              <p className="text-white/50 text-sm">
                                Próximo cobro: {formatDate(subscription.next_payment_date)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">
                            {formatCurrency(subscription.amount)}/mes
                          </p>
                          {getStatusBadge(subscription.status)}
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            )}
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium mb-2">Sin compras de planes</h3>
                <p className="text-white/50">Aún no has comprado ningún plan</p>
              </div>
            ) : (
              payments.map(payment => (
                <div key={payment.id} className="glass-panel rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl">
                        📦
                      </div>
                      <div>
                        <h4 className="font-medium">
                          Plan {payment.user_plans?.name || 'Desconocido'}
                        </h4>
                        <p className="text-white/50 text-sm">
                          {formatDate(payment.created_at)}
                        </p>
                        <p className="text-white/50 text-sm">
                          Método: {getPaymentMethodLabel(payment.payment_method)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">
                        {formatCurrency(payment.amount)}
                      </p>
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'recharges' && (
          <div className="space-y-4">
            {recharges.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-24 h-24 mx-auto mb-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-xl font-medium mb-2">Sin recargas</h3>
                <p className="text-white/50">Aún no has recargado créditos</p>
              </div>
            ) : (
              recharges.map(recharge => (
                <div key={recharge.id} className="glass-panel rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-xl">
                        ⚡
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {getRechargeTypeLabel(recharge.recharge_type)}
                        </h4>
                        <p className="text-white/50 text-sm">
                          {formatDate(recharge.created_at)}
                        </p>
                        <p className="text-white/70 text-sm">
                          +{recharge.credits_hd} créditos HD
                          {recharge.drafts > 0 && ` +${recharge.drafts} borradores`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">
                        {formatCurrency(recharge.amount)}
                      </p>
                      {getStatusBadge(recharge.status)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            {subscriptions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔄</div>
                <h3 className="text-xl font-medium mb-2">Sin suscripciones activas</h3>
                <p className="text-white/50">Aún no tienes suscripciones recurrentes</p>
              </div>
            ) : (
              subscriptions.map(subscription => (
                <div key={subscription.id} className="glass-panel rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-xl">
                        🔄
                      </div>
                      <div>
                        <h4 className="font-medium">
                          Suscripción {subscription.user_plans?.name || 'Desconocido'}
                        </h4>
                        <p className="text-white/50 text-sm">
                          Inicio: {formatDate(subscription.created_at)}
                        </p>
                        {subscription.next_payment_date && (
                          <p className="text-white/50 text-sm">
                            Próximo cobro: {formatDate(subscription.next_payment_date)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">
                        {formatCurrency(subscription.amount)}/mes
                      </p>
                      {getStatusBadge(subscription.status)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;