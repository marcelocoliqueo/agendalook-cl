'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export function Footer() {
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
    <footer className="py-12 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-8 items-center">
        <div className="flex items-center">
          <img 
            src="/favicon.jpeg" 
            alt="Agendalook" 
            className="h-8 w-8 object-contain"
          />
        </div>
        <ul className="flex items-center gap-6 text-sm text-slate-600 justify-center">
          <li><Link href="#" className="hover:text-sky-600">Sobre nosotros</Link></li>
          <li><button onClick={() => handleNavClick("#precios")} className="hover:text-sky-600 cursor-pointer">Precios</button></li>
          <li><Link href="#" className="hover:text-sky-600">Soporte</Link></li>
          <li><Link href="#" className="hover:text-sky-600">Contacto</Link></li>
        </ul>
        <p className="text-xs text-slate-500 sm:text-right">© {new Date().getFullYear()} Agendalook. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
