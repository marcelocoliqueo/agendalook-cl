'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Clock, Users, Gift } from 'lucide-react';

export function WaitlistBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Próximamente disponible</span>
            </div>
            <div className="hidden sm:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>1,247 esperando</span>
              </div>
              <div className="flex items-center space-x-1">
                <Gift className="w-4 h-4" />
                <span>50% descuento early bird</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/waitlist')}
              className="bg-white text-sky-600 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-sky-50 transition-colors"
            >
              Únete a la lista
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
