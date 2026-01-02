import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseService';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // Force page reload to ensure auth state is properly updated
        window.location.href = '/panel';
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Error con Google');
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[120px] rounded-full animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md p-8 relative z-10 animate-fade-in">
        
        {/* Header */}
        <div className="text-center mb-10">
            <button onClick={() => navigate('/')} className="absolute top-0 left-0 text-white/30 hover:text-white transition-colors text-sm">
                ← Volver
            </button>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <span className="text-2xl">🇨🇱</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Bienvenido al Estudio</h1>
            <p className="text-white/40 text-sm">Ingresa a la plataforma de generación.</p>
        </div>

        {/* Login Form */}
        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
            {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-mono text-white/50 uppercase">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@empresa.cl"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder-white/20"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-mono text-white/50 uppercase">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder-white/20"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !email || !password}
                    className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    ) : (
                        "Iniciar Sesión"
                    )}
                </button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0e0e0e] px-2 text-white/30 font-mono">O conecta con</span>
                </div>
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
                <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                <span>Continuar con Google</span>
            </button>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-white/40 text-xs mb-2">¿Aún no tienes cuenta?</p>
                <button
                    onClick={() => navigate('/registrarse')}
                    className="text-blue-400 hover:text-blue-300 text-sm font-bold transition-colors"
                >
                    Crear cuenta nueva →
                </button>
            </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-center text-white/20 text-xs">
            Protegido por reCAPTCHA y Política de Privacidad de Estudio 56.
          </p>
          <div className="flex justify-center gap-3 text-[10px]">
            <a href="/privacidad" className="text-white/40 hover:text-white transition-colors">Privacidad</a>
            <span className="text-white/20">|</span>
            <a href="/cookies" className="text-white/40 hover:text-white transition-colors">Cookies</a>
            <span className="text-white/20">|</span>
            <a href="/terminos" className="text-white/40 hover:text-white transition-colors">Términos</a>
            <span className="text-white/20">|</span>
            <a href="/condiciones" className="text-white/40 hover:text-white transition-colors">Condiciones</a>
          </div>
        </div>

      </div>
    </div>
  );
};