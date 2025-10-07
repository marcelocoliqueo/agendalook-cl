'use client';

import { useState } from 'react';
import { useSupabaseClient } from '@/contexts/SupabaseContext';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

interface GoogleSignInButtonProps {
  mode: 'signup' | 'signin';
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function GoogleSignInButton({ 
  mode, 
  className = '', 
  onSuccess, 
  onError 
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Error with Google OAuth:', error);
        onError?.(error.message);
        return;
      }

      // El usuario será redirigido a Google, luego a /auth/callback
      // No necesitamos hacer nada más aquí
      
    } catch (error) {
      console.error('Unexpected error:', error);
      onError?.('Error inesperado al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  const buttonText = mode === 'signup' ? 'Continuar con Google' : 'Iniciar sesión con Google';

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={loading}
      className={`w-full flex items-center justify-center space-x-3 px-6 py-3 border border-gray-300 rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
      ) : (
        <>
          <FcGoogle className="w-5 h-5" />
          <span className="text-gray-700 font-medium">{buttonText}</span>
        </>
      )}
    </button>
  );
}

// Hook para manejar el callback de Google OAuth
export function useGoogleAuthCallback() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleCallback = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session after OAuth:', error);
        router.push('/login?error=oauth_error');
        return;
      }

      if (data.session?.user) {
        // Usuario autenticado exitosamente
        console.log('✅ Google OAuth successful:', data.session.user.email);
        
        // Verificar si es un usuario nuevo o existente
        const isNewUser = data.session.user.created_at === data.session.user.updated_at;
        
        if (isNewUser) {
          // Usuario nuevo - redirigir a selección de plan
          router.push('/select-plan?source=google');
        } else {
          // Usuario existente - redirigir al dashboard
          router.push('/dashboard');
        }
      } else {
        router.push('/login?error=no_session');
      }
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      router.push('/login?error=callback_error');
    }
  };

  return { handleCallback };
}
