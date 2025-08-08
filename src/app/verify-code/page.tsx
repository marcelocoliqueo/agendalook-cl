import { Suspense } from 'react';
import VerifyCodeClient from './verify-code.client';

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-600">Cargando...</div>}>
      <VerifyCodeClient />
    </Suspense>
  );
}


