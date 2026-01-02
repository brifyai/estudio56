import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseService';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Iniciando proceso de registro...');
      console.log('📧 Email:', formData.email);
      console.log('👤 Nombre:', formData.name);
      console.log('🏢 Empresa:', formData.businessName);

      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            business_name: formData.businessName
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      console.log('📤 Respuesta de Supabase:', { data, error });

      if (error) {
        console.error('❌ Error en registro:', error);
        setError(`Error al registrar: ${error.message}`);
        return;
      }

      if (data.user) {
        console.log('✅ Usuario creado en Auth:', data.user.id);
        console.log('📧 Email confirmado:', !!data.user.email_confirmed_at);

        // Check if email confirmation is required
        if (data.user.email_confirmed_at) {
          console.log('✅ Email ya confirmado, insertando datos de usuario...');
          // Email already confirmed, insert user data
          try {
            await insertUserData(data.user.id, formData.email);
            console.log('✅ Datos de usuario insertados correctamente');
            alert('¡Registro exitoso! Redirigiendo al panel...');
            navigate('/panel');
          } catch (insertError) {
            console.error('❌ Error inserting user data:', insertError);
            setError('Error al crear el perfil de usuario. Intenta iniciar sesión.');
            navigate('/iniciar-sesion');
          }
        } else {
          // Email confirmation required
          console.log('📧 Email de confirmación enviado');
          alert(`¡Registro exitoso!
          
Revisa tu email (${formData.email}) para confirmar tu cuenta.

IMPORTANTE:
- Revisa también la carpeta de SPAM
- El email puede tardar hasta 5 minutos
- Haz clic en el enlace de confirmación

Serás redirigido al login.`);
          navigate('/iniciar-sesion');
        }
      } else {
        console.log('⚠️ No se recibió información del usuario');
        setError('Error: No se recibió información del usuario');
      }
    } catch (err: any) {
      console.error('❌ Error general en registro:', err);
      setError(`Error inesperado: ${err.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const insertUserData = async (userId: string, email: string) => {
    try {
      // First get the "GRATIS" plan ID
      const { data: plans, error: plansError } = await supabase
        .from('user_plans')
        .select('*')
        .eq('name', 'GRATIS')
        .single();

      if (plansError) {
        throw new Error('No se pudo obtener el plan GRATIS');
      }

      const { error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          plan_id: plans.id,
          credits: plans.credits_per_month
        });

      if (error) {
        console.error('Error inserting user data:', error);
        throw error;
      }
    } catch (err) {
      console.error('Error inserting user data:', err);
      throw err;
    }
  };

  const handleGoogleSignup = async () => {
    setLoadingGoogle(true);
    setError(null);

    try {
      console.log('🔄 Iniciando registro con Google...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('❌ Error con Google:', error);
        setError('Error al registrarse con Google: ' + error.message);
      }
      // Note: On success, the user will be redirected to /auth/callback
    } catch (err: any) {
      console.error('❌ Error general con Google:', err);
      setError(err.message || 'Error inesperado con Google');
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/10 blur-[120px] rounded-full animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md p-8 relative z-10 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-8">
            <button onClick={() => navigate('/')} className="absolute top-0 left-0 text-white/30 hover:text-white transition-colors text-sm">
                ← Volver
            </button>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <span className="text-2xl">🇨🇱</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Crea tu Cuenta</h1>
            <p className="text-white/40 text-sm">Únete al Estudio 56 y transforma tu Pyme.</p>
        </div>

        {/* Register Form */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/50 uppercase font-bold">Nombre</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Juan"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors placeholder-white/20 text-sm"
                        />
                    </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-mono text-white/50 uppercase font-bold">Tu Pyme</label>
                        <input
                            required
                            type="text"
                            value={formData.businessName}
                            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                            placeholder="Ej. Sushi King"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors placeholder-white/20 text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase font-bold">Email</label>
                    <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="tu@negocio.cl"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors placeholder-white/20 text-sm"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/50 uppercase font-bold">Contraseña</label>
                    <input
                        required
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••"
                        minLength={6}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500/50 transition-colors placeholder-white/20 text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.name || !formData.businessName || !formData.email || !formData.password}
                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    ) : (
                        "Registrarme Gratis"
                    )}
                </button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0e0e0e] px-2 text-white/30 font-mono">O regístrate con</span>
                </div>
            </div>

            <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loadingGoogle}
                className="w-full bg-white/5 border border-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
                {loadingGoogle ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                    <>
                        <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                        </svg>
                        <span>Continuar con Google</span>
                    </>
                )}
            </button>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-white/40 text-xs mb-2">¿Ya eres parte del estudio?</p>
                <button
                    onClick={() => navigate('/iniciar-sesion')}
                    className="text-green-400 hover:text-green-300 text-sm font-bold transition-colors"
                >
                    Iniciar Sesión →
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};