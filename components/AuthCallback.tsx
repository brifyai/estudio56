import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseService';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current URL
        const url = new URL(window.location.href);
        const token_hash = url.searchParams.get('token_hash');
        const type = url.searchParams.get('type');
        
        if (token_hash && type === 'signup') {
          // Verify the token
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'signup'
          });

          if (error) {
            console.error('Error verifying OTP:', error);
            setError('Error al verificar el email: ' + error.message);
            setTimeout(() => navigate('/iniciar-sesion'), 3000);
            return;
          }

          if (data.user) {
            // Insert user data into our custom users table
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                email: data.user.email,
                plan: 'GRATIS',
                credits: 5
              });

            if (insertError) {
              console.error('Error inserting user data:', insertError);
              // Don't fail the process for this
            }

            // Redirect to dashboard
            navigate('/panel');
          }
        } else {
          // No token or wrong type, redirect to login
          navigate('/iniciar-sesion');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError('Error procesando la confirmación: ' + err.message);
        setTimeout(() => navigate('/iniciar-sesion'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Confirmando tu email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-white text-xl mb-4">Error de Confirmación</h1>
          <p className="text-white/70 mb-6">{error}</p>
          <p className="text-white/50 text-sm">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return null;
};