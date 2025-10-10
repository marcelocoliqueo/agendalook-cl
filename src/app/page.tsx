"use client";

import { Navbar } from '@/components/marketing/Navbar';
import { Hero } from '@/components/marketing/Hero';
import { Beneficios } from '@/components/marketing/Beneficios';
import { Profesionales } from '@/components/marketing/Profesionales';
import { Testimonio } from '@/components/marketing/Testimonio';
import { Precios } from '@/components/marketing/Precios';
import { Contacto } from '@/components/marketing/Contacto';
import { Footer } from '@/components/marketing/Footer';

export default function Home() {
  return (
    <div className="antialiased text-slate-800 bg-[var(--bg)]">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Beneficios Section */}
      <Beneficios />
      
      {/* Profesionales Section */}
      <Profesionales />
      
      {/* Testimonio Section */}
      <Testimonio />
      
      {/* Precios Section */}
      <Precios />
      
      {/* Contacto Section */}
      <Contacto />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
