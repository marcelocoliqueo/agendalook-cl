'use client';

import Link from 'next/link';
import { LoginButton, RegisterButton } from '@/components/ui/AuthButtons';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-slate-200 bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-extrabold text-lg sm:text-xl tracking-tight">
          <img 
            src="/logo-compact.png" 
            alt="Agendalook" 
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
          />
          <span className="hidden sm:inline">Agendalook</span>
          <span className="sm:hidden">Agenda</span>
        </Link>
        
        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="#beneficios" className="hover:text-sky-600 transition-colors duration-200">Beneficios</Link>
          <Link href="#profesionales" className="hover:text-sky-600 transition-colors duration-200">Profesionales</Link>
          <Link href="#precios" className="hover:text-sky-600 transition-colors duration-200">Precios</Link>
          <Link href="#contacto" className="hover:text-sky-600 transition-colors duration-200">Demo</Link>
        </nav>
        
        {/* Botones de autenticación */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LoginButton size="sm" />
          <RegisterButton size="sm" />
        </div>
      </div>
    </header>
  );
}
