'use client';

import { useEffect } from 'react';
import { useGoogleAuthCallback } from '@/components/auth/GoogleSignInButton';

export default function AuthCallbackPage() {
  const { handleCallback } = useGoogleAuthCallback();

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          Completando tu registro...
        </h2>
        <p className="text-slate-600">
          Te estamos redirigiendo a tu cuenta
        </p>
      </div>
    </div>
  );
}
