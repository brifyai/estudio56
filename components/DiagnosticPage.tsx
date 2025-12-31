import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseService';

export const DiagnosticPage: React.FC = () => {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState<string>('Checking...');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Diagnostic: Checking authentication...');
        
        // Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          setAuthStatus('Session Error');
          setLoading(false);
          return;
        }

        if (!session) {
          console.log('❌ No session found');
          setAuthStatus('No Session - Please Login');
          setLoading(false);
          return;
        }

        console.log('✅ Session found:', session.user?.email);
        setAuthStatus(`Authenticated: ${session.user?.email}`);

        // Check user data
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('*, user_plans(*)')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('❌ User data error:', userError);
          setUserData({ error: userError.message });
        } else {
          console.log('✅ User data:', user);
          setUserData(user);
        }

        setLoading(false);
      } catch (error) {
        console.error('❌ Diagnostic error:', error);
        setAuthStatus('Error occurred');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleGoToDashboard = () => {
    console.log('🚀 Navigating to dashboard...');
    navigate('/panel');
  };

  const handleGoToLogin = () => {
    console.log('🔐 Navigating to login...');
    navigate('/iniciar-sesion');
  };

  const handleForceLogin = async () => {
    try {
      console.log('🔑 Force login attempt...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'camiloalegriabarra@gmail.com',
        password: 'Antonito26$'
      });

      if (error) {
        console.error('❌ Force login failed:', error);
        alert(`Login failed: ${error.message}`);
      } else {
        console.log('✅ Force login successful');
        alert('Login successful! Redirecting to dashboard...');
        navigate('/panel');
      }
    } catch (error) {
      console.error('❌ Force login error:', error);
      alert('Force login error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#030303] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Running diagnostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#030303] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔧 Dashboard Diagnostic</h1>
        
        {/* Auth Status */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Authentication Status</h2>
          <p className={`text-lg ${authStatus.includes('Error') ? 'text-red-400' : authStatus.includes('Authenticated') ? 'text-green-400' : 'text-yellow-400'}`}>
            {authStatus}
          </p>
        </div>

        {/* User Data */}
        {userData && (
          <div className="bg-gray-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">User Data</h2>
            {userData.error ? (
              <div className="text-red-400">
                <p>Error loading user data: {userData.error}</p>
              </div>
            ) : (
              <div>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Plan:</strong> {userData.user_plans?.name || 'N/A'}</p>
                <p><strong>Credits:</strong> {userData.credits}</p>
                <p><strong>Plan Price:</strong> ${userData.user_plans?.price}/month</p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🚀 Go to Dashboard
            </button>
            
            <button
              onClick={handleGoToLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🔐 Go to Login
            </button>
            
            <button
              onClick={handleForceLogin}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              🔑 Force Login (camiloalegriabarra@gmail.com)
            </button>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Debug Information</h2>
          <div className="text-sm text-gray-300">
            <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>URL:</strong> {window.location.href}</p>
            <p><strong>Path:</strong> {window.location.pathname}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
