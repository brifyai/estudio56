import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseService';
import { creditService, CreditTransaction } from '../services/creditService';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  business_name: string;
  created_at: string;
  credits: number;      // Créditos HD disponibles del usuario
  drafts: number;       // Borradores de imágenes disponibles del usuario
  drafts_video: number; // Borradores de videos disponibles del usuario
  plan_id: string;
  user_plans: {
    id: string;
    name: string;
    price: number;
    iva_percentage: number;
    iva_amount: number;
    price_with_iva: number;
    credits_hd: number; // Créditos HD incluidos en el plan (límite mensual)
    drafts: number;     // Borradores de imágenes incluidos en el plan (límite mensual)
    drafts_video: number; // Borradores de videos incluidos en el plan (límite mensual)
    features: string[];
  };
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
}

interface Subscription {
  id: string;
  status: string;
  next_payment_date: string | null;
  created_at: string;
}

export const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [monthlyUsage, setMonthlyUsage] = useState<{ credit_type: string; total_used: number }[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', business_name: '' });
  const [activeTab, setActiveTab] = useState<'credits' | 'payments'>('credits');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        throw new Error('No hay sesión activa');
      }

      console.log('👤 Cargando perfil para usuario:', session.user.id);

      // Get user data
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('❌ Error cargando usuario:', userError);
        throw new Error('Error cargando datos del usuario');
      }

      console.log('✅ Usuario cargado:', user);
      
      // Fetch plan directly using plan_id
      let planData = null;
      if (user.plan_id) {
        console.log('🔄 Consultando plan directamente con ID:', user.plan_id);
        const { data: plan } = await supabase
          .from('user_plans')
          .select('*')
          .eq('id', user.plan_id)
          .single();
        planData = plan;
        console.log('📋 Plan directo:', planData);
      }

      setUserProfile({
        ...user,
        drafts_video: user.drafts_video || 0,
        user_plans: planData || {
          id: '',
          name: 'GRATIS',
          price: 0,
          iva_percentage: 19,
          iva_amount: 0,
          price_with_iva: 0,
          credits_hd: 0,
          drafts: 3,
          drafts_video: 0,
          features: []
        }
      });

      setEditForm({
        name: user.name || '',
        business_name: user.business_name || ''
      });

      // Load payment history
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!paymentError && paymentData) {
        setPayments(paymentData);
      }

      // Load credit transactions
      const transactions = await creditService.getTransactionHistory(20);
      setCreditTransactions(transactions);

      // Load monthly usage
      const usage = await creditService.getMonthlyUsage();
      setMonthlyUsage(usage);

      // Load subscription for renewal date
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (subData) {
        setSubscription(subData);
      }

    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!userProfile) return;

      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: editForm.name,
          business_name: editForm.business_name,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile.id);

      if (updateError) {
        throw new Error('Error actualizando perfil');
      }

      setUserProfile({
        ...userProfile,
        name: editForm.name,
        business_name: editForm.business_name
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCancelPlan = async () => {
    if (!userProfile) return;
    
    try {
      setIsCancelling(true);
      
      const response = await fetch('/.netlify/functions/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userProfile.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cancelar suscripción');
      }

      // Update local state
      setSubscription((prev) => prev ? { ...prev, status: 'cancelled' } : null);
      setShowCancelModal(false);
      
      alert('✅ Plan cancelado exitosamente\n\nTu plan estará vigente hasta la fecha de renovación.');
      
    } catch (error: any) {
      console.error('Error cancelando plan:', error);
      alert(error.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const getUsageByType = (type: string) => {
    const usage = monthlyUsage.find(u => u.credit_type === type);
    return usage?.total_used || 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-white text-xl mb-4">Error</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = '/panel'}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white/50 text-6xl mb-4">👤</div>
          <h1 className="text-white text-xl mb-4">Perfil no encontrado</h1>
          <button
            onClick={() => window.location.href = '/panel'}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  // Modal de confirmación para cancelar plan
  if (showCancelModal) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">¿Cancelar tu plan?</h2>
            <p className="text-white/70 mb-6">
              Tu plan estará vigente hasta la fecha de renovación ({subscription?.next_payment_date
                ? new Date(subscription.next_payment_date).toLocaleDateString('es-CL', {
                    day: 'numeric',
                    month: 'long'
                  })
                : 'próxima fecha'}).
              Después de esa fecha perderás los beneficios de tu plan.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleCancelPlan}
                disabled={isCancelling}
                className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white py-3 rounded-xl transition-colors font-medium"
              >
                {isCancelling ? 'Cancelando...' : 'Sí, cancelar mi plan'}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-colors"
              >
                No, mantener mi plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Perfil de Cuenta</h1>
              <p className="text-white/50 text-sm mt-1">Gestiona tu información y suscripción</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Content - Full width */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Row - Profile & Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Información Personal */}
          <div className="lg:col-span-2 bg-white/5 rounded-3xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">👤</span>
                Información Personal
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditing ? (
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Nombre</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500/50 outline-none"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Negocio</label>
                      <input
                        type="text"
                        value={editForm.business_name}
                        onChange={(e) => setEditForm({ ...editForm, business_name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500/50 outline-none"
                        placeholder="Nombre de tu negocio"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-white/60 mb-2 block">Email</label>
                    <p className="text-white/50 text-lg bg-black/20 rounded-xl p-4">{userProfile.email}</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({ name: userProfile.name || '', business_name: userProfile.business_name || '' });
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-white/5 rounded-2xl p-5">
                    <label className="text-sm text-white/60 mb-2 block">Nombre</label>
                    <p className="text-white text-lg font-medium">{userProfile.name || 'No definido'}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5">
                    <label className="text-sm text-white/60 mb-2 block">Negocio</label>
                    <p className="text-white text-lg font-medium">{userProfile.business_name || 'No definido'}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5">
                    <label className="text-sm text-white/60 mb-2 block">Email</label>
                    <p className="text-white text-lg font-medium">{userProfile.email}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-5">
                    <label className="text-sm text-white/60 mb-2 block">Miembro desde</label>
                    <p className="text-white text-lg font-medium">
                      {new Date(userProfile.created_at).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Plan Contratado */}
          <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-3xl p-8 border border-yellow-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h2 className="text-xl font-bold flex items-center gap-3 mb-6 relative z-10">
              <span className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center text-2xl">💎</span>
              Tu Plan
            </h2>
            
            <div className="space-y-6 relative z-10">
              <div className="text-center">
                <span className={`inline-block px-6 py-2 rounded-full text-lg font-bold ${
                  userProfile.user_plans.name === 'GRATIS'
                    ? 'bg-gray-500/30 text-gray-300'
                    : 'bg-yellow-500/30 text-yellow-300'
                }`}>
                  {userProfile.user_plans.name}
                </span>
              </div>
              
              {userProfile.user_plans.price > 0 && (
                <div className="bg-black/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">NETO mensual</span>
                    <span className="text-white font-medium">${(userProfile.user_plans.price || 0).toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">IVA ({userProfile.user_plans.iva_percentage || 19}%)</span>
                    <span className="text-white/50 text-sm">+${(userProfile.user_plans.iva_amount || 0).toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-white font-bold">TOTAL mensual</span>
                    <span className="text-white font-bold text-xl">${(userProfile.user_plans.price_with_iva || 0).toLocaleString('es-CL')}</span>
                  </div>
                </div>
              )}
              
              {/* Fecha de Renovación */}
              {userProfile.user_plans.price > 0 ? (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <p className="text-white/60 text-sm">Próxima renovación</p>
                      <p className="text-white font-bold">
                        {subscription?.next_payment_date
                          ? new Date(subscription.next_payment_date).toLocaleDateString('es-CL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-2xl p-4">
                  <p className="text-white/60 text-sm">Plan gratuito</p>
                  <p className="text-white/80">Sin renovación automática</p>
                </div>
              )}
              
              <div className="space-y-2">
                {userProfile.user_plans.features && userProfile.user_plans.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/80 text-sm">
                    <span className="text-green-400">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className="pt-4 space-y-3">
                <button
                  onClick={() => window.location.href = '/panel'}
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded-xl transition-colors font-medium"
                >
                  Cambiar Plan
                </button>
                
                {/* Botón Cancelar Plan - solo para planes de pago */}
                {userProfile.user_plans.price > 0 && subscription?.status !== 'cancelled' && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 rounded-xl transition-colors"
                  >
                    Cancelar Plan
                  </button>
                )}
                
                {/* Mensaje si el plan está cancelado */}
                {subscription?.status === 'cancelled' && (
                  <div className="w-full bg-yellow-500/20 text-yellow-300 py-3 rounded-xl text-center text-sm">
                    Plan cancelado - Vigente hasta {subscription.next_payment_date
                      ? new Date(subscription.next_payment_date).toLocaleDateString('es-CL', {
                          day: 'numeric',
                          month: 'short'
                        })
                      : 'próxima fecha'}
                  </div>
                )}
                
                <button
                  onClick={() => window.location.href = '/panel'}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl transition-colors"
                >
                  Volver al Panel →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row - Credits & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Control de Créditos - col-span-2 */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-3xl p-8 border border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
              <span className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">💰</span>
              Control de Créditos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Borradores de Imágenes */}
              <div className="bg-black/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60">Borradores de Imágenes</span>
                  <span className="text-5xl font-bold text-green-400">{userProfile.drafts}</span>
                </div>
                
                {/* Monthly Progress Borradores */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Usado este mes</span>
                    <span className="text-white">
                      {getUsageByType('draft')} / {userProfile.user_plans.drafts || 0}
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (getUsageByType('draft') / (userProfile.user_plans.drafts || 1)) > 90
                          ? 'bg-red-500'
                          : (getUsageByType('draft') / (userProfile.user_plans.drafts || 1)) > 70
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((getUsageByType('draft') / (userProfile.user_plans.drafts || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40 text-right">
                    Imágenes rápidas con marca de agua
                  </p>
                </div>
              </div>
              
              {/* Borradores de Videos */}
              <div className="bg-black/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60">Borradores de Videos</span>
                  <span className="text-5xl font-bold text-orange-400">{userProfile.drafts_video}</span>
                </div>
                
                {/* Monthly Progress Videos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Videos este mes</span>
                    <span className="text-white">
                      {getUsageByType('video')} / {userProfile.user_plans.drafts_video || 0}
                    </span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (getUsageByType('video') / (userProfile.user_plans.drafts_video || 1)) > 90
                          ? 'bg-red-500'
                          : (getUsageByType('video') / (userProfile.user_plans.drafts_video || 1)) > 70
                            ? 'bg-yellow-500'
                            : 'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min((getUsageByType('video') / (userProfile.user_plans.drafts_video || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40 text-right">
                    Videos HD (límite separado)
                  </p>
                </div>
              </div>
            </div>
            
            {/* Uso por Categoría */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-semibold text-white/80">Uso por Categoría</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white/70 flex items-center gap-2">
                    <span className="text-lg">📝</span> Borradores
                  </span>
                  <span className="text-white font-bold">{getUsageByType('draft')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white/70 flex items-center gap-2">
                    <span className="text-lg">🖼️</span> Imágenes HD
                  </span>
                  <span className="text-white font-bold">{getUsageByType('final_image')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white/70 flex items-center gap-2">
                    <span className="text-lg">🎬</span> Videos HD
                  </span>
                  <span className="text-white font-bold">{getUsageByType('video')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-white/70 flex items-center gap-2">
                    <span className="text-lg">📦</span> Productos
                  </span>
                  <span className="text-white font-bold">{getUsageByType('product_upload')}</span>
                </div>
              </div>
              
              <button
                onClick={() => window.location.href = '/panel'}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl transition-colors font-medium mt-4"
              >
                Obtener más créditos
              </button>
            </div>
          </div>

          {/* Estadísticas de Consumo */}
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
              <span className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">📊</span>
              Estadísticas
            </h2>
            
            {/* Resumen de Créditos */}
            <div className="bg-black/30 rounded-2xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-white/80 mb-3">Resumen</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Créditos HD</span>
                  <span className="text-blue-400 font-bold">{userProfile.credits}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Borradores</span>
                  <span className="text-green-400 font-bold">{userProfile.drafts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Videos</span>
                  <span className="text-orange-400 font-bold">{userProfile.drafts_video}</span>
                </div>
              </div>
            </div>
            
            {/* Progreso general */}
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Progreso mes</span>
                <span className="text-white font-bold">
                  {Math.round(
                    ((getUsageByType('draft') + getUsageByType('final_image') + getUsageByType('video') + getUsageByType('product_upload')) /
                    ((userProfile.user_plans.credits_hd || 1) + (userProfile.user_plans.drafts || 0))) * 100
                  )}%
                </span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      ((getUsageByType('draft') + getUsageByType('final_image') + getUsageByType('video') + getUsageByType('product_upload')) /
                      ((userProfile.user_plans.credits_hd || 1) + (userProfile.user_plans.drafts || 0))) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Transacciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Transacciones Recientes */}
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">📊</span>
                Transacciones
              </h2>
              <button
                onClick={loadUserProfile}
                className="text-white/50 hover:text-white transition-colors"
                title="Actualizar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            {creditTransactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-white/50 text-4xl mb-3">📋</div>
                <p className="text-white/70">Sin transacciones</p>
                <p className="text-white/50 text-sm mt-2">Usa tus créditos para ver actividad</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {creditTransactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{creditService.getTransactionIcon(transaction.type)}</span>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {creditService.getCreditTypeName(transaction.credit_type)}
                        </p>
                        <p className="text-white/50 text-xs">
                          {new Date(transaction.created_at).toLocaleDateString('es-CL', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </p>
                      <span className="text-xs text-white/50 capitalize">{transaction.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historial de Pagos */}
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">💳</span>
                Historial de Pagos
              </h2>
            </div>
            
            {payments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-white/50 text-4xl mb-3">📋</div>
                <p className="text-white/70">No hay pagos registrados</p>
                {userProfile.user_plans.name === 'GRATIS' && (
                  <p className="text-white/50 text-sm mt-2">Upgrade tu plan para ver el historial</p>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-white font-medium text-sm">{payment.description || 'Pago de plan'}</p>
                      <p className="text-white/50 text-xs">
                        {new Date(payment.created_at).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-bold">${payment.amount.toLocaleString('es-CL')}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        payment.status === 'completed'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;