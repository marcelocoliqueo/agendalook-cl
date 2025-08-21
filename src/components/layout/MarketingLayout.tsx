'use client';

import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

interface MarketingLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export function MarketingLayout({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}: MarketingLayoutProps) {
  return (
    <div className="antialiased text-slate-800 bg-[var(--bg)] min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
}
