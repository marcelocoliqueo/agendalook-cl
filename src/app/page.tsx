"use client";

import { Navigation } from '@/components/layout/Navigation';
import { Hero } from '@/components/marketing/Hero';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation variant="landing" />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Placeholder para otras secciones */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Landing en construcción
          </h2>
          <p className="text-xl text-gray-600">
            Las demás secciones se están implementando. Por ahora, disfruta del Hero section.
          </p>
        </div>
      </section>
    </div>
  );
}
