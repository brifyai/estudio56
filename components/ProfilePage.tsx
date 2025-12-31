import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseService';
import { creditService, CreditTransaction } from '../services/creditService';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  business_name: string;
  created_at: string;
  credits: number;
  plan_id: string;
  user_plans: {
    id: string;
    name: string;
    price: number;
    iva_percentage: number;
    iva_amount: number;
    price_with_iva: number;
    credits_per_month: number;
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

export const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [monthlyUsage, setMonthlyUsage] = useState<{ credit_type: string; total_used: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', business_name: '' });
  const [activeTab, setActiveTab] = useState<'credits' | 'payments'>('credits');

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

      // Get user data with plan information
      const { data: user, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          user_plans (
            id,
            name,
            price,
            credits_per_month,
            features
          )
        `)
        .eq('id', session.user.id)
        .single();

      if (userError) {
        console.error('❌ Error cargando usuario:', userError);
        throw new Error('Error cargando datos del usuario');
      }

      console.log('✅ Usuario cargado:', user);
      console.log('📋 Plan del usuario:', user.user_plans);

      // Fallback: if no plan via join, fetch directly
      let planData = user.user_plans;
      if (!planData && user.plan_id) {
        console.log('🔄 Consultando plan directamente...');
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
        user_plans: planData || {
          id: '',
          name: 'GRATIS',
          price: 0,
          iva_percentage: 19,
          iva_amount: 0,
          price_with_iva: 0,
          credits_per_month: 5,
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

  const getCreditUsagePercentage = () => {
    if (!userProfile) return 0;
    const totalUsed = monthlyUsage.reduce((acc, u) => acc + u.total_used, 0);
    return Math.min((totalUsed / userProfile.user_plans.credits_per_month) * 100, 100);
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

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Perfil de Cuenta</h1>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Información Personal */}
          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                👤 Información Personal
              </h2>
              
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="text-sm text-white/60">Nombre</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-blue-500/50 outline-none"
                        placeholder="Tu nombre"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-white/60">Email</label>
                      <p className="text-white/50 text-sm">{userProfile.email}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm text-white/60">Negocio</label>
                      <input
                        type="text"
                        value={editForm.business_name}
                        onChange={(e) => setEditForm({ ...editForm, business_name: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-blue-500/50 outline-none"
                        placeholder="Nombre de tu negocio"
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({ name: userProfile.name || '', business_name: userProfile.business_name || '' });
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-sm text-white/60">Nombre</label>
                      <p className="text-white font-medium">{userProfile.name || 'No definido'}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm text-white/60">Email</label>
                      <p className="text-white font-medium">{userProfile.email}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm text-white/60">Negocio</label>
                      <p className="text-white font-medium">{userProfile.business_name || 'No definido'}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm text-white/60">Miembro desde</label>
                      <p className="text-white font-medium">
                        {new Date(userProfile.created_at).toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      ✏️ Editar información
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Plan y Pagos */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                💳 Plan Contratado
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Plan Actual</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    userProfile.user_plans.name === 'GRATIS' 
                      ? 'bg-gray-500/20 text-gray-300' 
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {userProfile.user_plans.name}
                  </span>
                </div>
                
                {userProfile.user_plans.price > 0 && userProfile.user_plans.iva_amount !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Precio Neto</span>
                      <span className="text-white font-medium">${userProfile.user_plans.price.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">IVA {userProfile.user_plans.iva_percentage}%</span>
                      <span className="text-white/50 text-sm">+${userProfile.user_plans.iva_amount.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-white/80 font-medium">Total</span>
                      <span className="text-white font-bold text-lg">${userProfile.user_plans.price_with_iva.toLocaleString('es-CL')}</span>
                    </div>
                  </div>
                )}
                
                {userProfile.user_plans.features && userProfile.user_plans.features.length > 0 && (
                  <div>
                    <label className="text-sm text-white/60 block mb-2">Características</label>
                    <ul className="space-y-1">
                      {userProfile.user_plans.features.map((feature, index) => (
                        <li key={index} className="text-white/80 text-sm flex items-center gap-2">
                          <span className="text-green-400">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <button
                    onClick={() => window.location.href = '/panel'}
                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Cambiar Plan
                  </button>
                  <button
                    onClick={() => window.location.href = '/panel'}
                    className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    ← Volver al Panel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Créditos y Transacciones */}
          <div className="space-y-6">
            {/* Contador de Créditos */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                💰 Control de Créditos
              </h2>
              
              {/* Main Credit Display */}
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">Créditos Disponibles</span>
                  <span className="text-3xl font-bold text-blue-400">{userProfile.credits}</span>
                </div>
                
                {/* Monthly Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Uso Mensual</span>
                    <span className="text-white">
                      {monthlyUsage.reduce((acc, u) => acc + u.total_used, 0)} / {userProfile.user_plans.credits_per_month}
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        getCreditUsagePercentage() > 90 
                          ? 'bg-red-500' 
                          : getCreditUsagePercentage() > 70 
                            ? 'bg-yellow-500' 
                            : 'bg-blue-500'
                      }`}
                      style={{ width: `${getCreditUsagePercentage()}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Usage by Type */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white/80">Uso por Categoría</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-white/70 text-sm">📝 Borradores</span>
                    <span className="text-white font-medium">{getUsageByType('draft')}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-white/70 text-sm">🖼️ Imágenes Finales</span>
                    <span className="text-white font-medium">{getUsageByType('final_image')}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-white/70 text-sm">🎬 Videos</span>
                    <span className="text-white font-medium">{getUsageByType('video')}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-white/70 text-sm">📦 Subir Productos</span>
                    <span className="text-white font-medium">{getUsageByType('product_upload')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button 
                  onClick={() => window.location.href = '/panel'}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Obtener más créditos
                </button>
              </div>
            </div>

            {/* Transacciones de Créditos */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  📊 Transacciones de Créditos
                </h2>
                <button
                  onClick={loadUserProfile}
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  🔄 Actualizar
                </button>
              </div>
              
              {creditTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-white/50 text-4xl mb-2">📋</div>
                  <p className="text-white/70">No hay transacciones</p>
                  <p className="text-white/50 text-sm mt-2">Usa tus créditos para ver el historial</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {creditTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{creditService.getTransactionIcon(transaction.type)}</span>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {creditService.getCreditTypeName(transaction.credit_type)}
                          </p>
                          <p className="text-white/60 text-xs">
                            {new Date(transaction.created_at).toLocaleDateString('es-CL', {
                              year: 'numeric',
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
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                💳 Historial de Pagos
              </h2>
              
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-white/50 text-4xl mb-2">📋</div>
                  <p className="text-white/70">No hay pagos registrados</p>
                  {userProfile.user_plans.name === 'GRATIS' && (
                    <p className="text-white/50 text-sm mt-2">Upgrade tu plan para ver el historial</p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium text-sm">{payment.description || 'Pago de plan'}</p>
                        <p className="text-white/60 text-xs">
                          {new Date(payment.created_at).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">${payment.amount.toLocaleString('es-CL')}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
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

        {/* Acciones */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-4">
            {/* Botón eliminado - solo queda el espacio */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;