'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LoginButton, RegisterButton } from '@/components/ui/AuthButtons';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (hash: string) => {
    if (pathname === "/") {
      // Si ya estamos en la página principal, hacer scroll suave
      const section = document.querySelector(hash);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Si estamos en otra página, redirigir y luego hacer scroll
      router.push(`/${hash}`);
      setTimeout(() => {
        const section = document.querySelector(hash);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 400);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-slate-200 bg-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center p-2">
          <img 
            src="/logo-main.png" 
            alt="Agendalook" 
            className="h-8 w-auto sm:h-10 sm:w-auto object-contain"
          />
        </Link>
        
        {/* Navegación desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <button 
            onClick={() => handleNavClick("#beneficios")} 
            className="hover:text-sky-600 transition-colors duration-200 cursor-pointer"
          >
            Beneficios
          </button>
          <button 
            onClick={() => handleNavClick("#profesionales")} 
            className="hover:text-sky-600 transition-colors duration-200 cursor-pointer"
          >
            Profesionales
          </button>
          <button 
            onClick={() => handleNavClick("#precios")} 
            className="hover:text-sky-600 transition-colors duration-200 cursor-pointer"
          >
            Precios
          </button>
          <button 
            onClick={() => handleNavClick("#contacto")} 
            className="hover:text-sky-600 transition-colors duration-200 cursor-pointer"
          >
            Demo
          </button>
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
