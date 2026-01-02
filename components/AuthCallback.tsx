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
        const provider_token = url.searchParams.get('provider_token');

        console.log('🔐 Auth callback params:', { token_hash, type, hasProviderToken: !!provider_token });

        // Handle email confirmation (OTP)
        if (token_hash && type === 'signup') {
          console.log('📧 Processing email confirmation...');
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'signup'
          });

          if (error) {
            console.error('❌ Error verifying OTP:', error);
            setError('Error al verificar el email: ' + error.message);
            setTimeout(() => navigate('/iniciar-sesion'), 3000);
            return;
          }

          if (data.user) {
            console.log('✅ Email confirmed for:', data.user.email);
            await ensureUserData(data.user.id, data.user.email);
            navigate('/panel');
            return;
          }
        }

        // Handle OAuth callback (Google, etc.)
        // For OAuth, Supabase exchanges the code for a session automatically
        // We just need to verify the session and ensure user data exists
        console.log('🔄 Checking session for OAuth...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          setError('Error de sesión: ' + sessionError.message);
          setTimeout(() => navigate('/iniciar-sesion'), 3000);
          return;
        }

        if (session?.user) {
          console.log('✅ OAuth session established for:', session.user.email);
          console.log('🔍 User ID:', session.user.id);
          console.log('🔍 Provider:', session.user.app_metadata?.provider);

          // Ensure user data exists in our users table
          await ensureUserData(session.user.id, session.user.email);

          // Redirect to dashboard
          navigate('/panel');
        } else {
          // No session, redirect to login
          console.log('❌ No session found');
          navigate('/iniciar-sesion');
        }
      } catch (err: any) {
        console.error('❌ Auth callback error:', err);
        setError('Error procesando la confirmación: ' + err.message);
        setTimeout(() => navigate('/iniciar-sesion'), 3000);
      } finally {
        setLoading(false);
      }
    };

    // Function to ensure user data exists in our custom users table
    const ensureUserData = async (userId: string, email: string | undefined) => {
      if (!email) {
        console.warn('⚠️ No email in user data');
        return;
      }

      try {
        // Check if user already exists
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('id')
          .eq('id', userId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('❌ Error checking existing user:', fetchError);
          return;
        }

        if (existingUser) {
          console.log('✅ User already exists in database');
          return;
        }

        // Get the "GRATIS" plan ID
        const { data: plans, error: plansError } = await supabase
          .from('user_plans')
          .select('*')
          .eq('name', 'GRATIS')
          .single();

        if (plansError) {
          console.error('❌ Error fetching plan:', plansError);
          // Try with default values
          await supabase.from('users').insert({
            id: userId,
            email: email,
            plan: 'GRATIS',
            credits: 5
          });
          return;
        }

        // Insert new user
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email: email,
            plan_id: plans.id,
            credits: plans.credits_per_month
          });

        if (insertError) {
          console.error('❌ Error inserting user data:', insertError);
          // Don't fail - user can still use the app
        } else {
          console.log('✅ User data created successfully');
        }
      } catch (err) {
        console.error('❌ Exception in ensureUserData:', err);
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