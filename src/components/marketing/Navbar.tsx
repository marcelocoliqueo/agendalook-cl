'use client';

import Link from 'next/link';
import { LoginButton, RegisterButton } from '@/components/ui/AuthButtons';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-slate-200 bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white font-bold shadow-sm">A</span>
          <span>Agendalook</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="#beneficios" className="hover:text-sky-600 transition-colors duration-200">Beneficios</Link>
          <Link href="#profesionales" className="hover:text-sky-600 transition-colors duration-200">Profesionales</Link>
          <Link href="#precios" className="hover:text-sky-600 transition-colors duration-200">Precios</Link>
          <Link href="#contacto" className="hover:text-sky-600 transition-colors duration-200">Demo</Link>
        </nav>
        <div className="flex items-center gap-3">
          <LoginButton />
          <RegisterButton />
        </div>
      </div>
    </header>
  );
}
