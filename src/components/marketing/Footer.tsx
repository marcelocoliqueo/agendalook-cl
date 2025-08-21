'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-12 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-2 text-slate-700">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white font-bold">A</span>
          <span className="font-semibold">Agendalook</span>
        </div>
        <ul className="flex items-center gap-6 text-sm text-slate-600 justify-center">
          <li><Link href="#" className="hover:text-sky-600">Sobre nosotros</Link></li>
          <li><Link href="#precios" className="hover:text-sky-600">Precios</Link></li>
          <li><Link href="#" className="hover:text-sky-600">Soporte</Link></li>
          <li><Link href="#" className="hover:text-sky-600">Contacto</Link></li>
        </ul>
        <p className="text-xs text-slate-500 sm:text-right">© {new Date().getFullYear()} Agendalook. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
