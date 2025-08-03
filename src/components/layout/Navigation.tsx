'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, ChevronDown } from 'lucide-react';

interface NavigationProps {
  variant?: 'landing' | 'dashboard';
  userName?: string;
  onLogout?: () => void;
}

export function Navigation({ variant = 'landing', userName, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-coral-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-playfair font-bold text-gray-800">
                Agendalook
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {variant === 'landing' ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-primary-500 to-coral-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
                >
                  Crear cuenta
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-gray-600">
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-coral-500"></span>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-coral-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {userName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden lg:block">{userName || 'Usuario'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Configuración
                      </Link>
                      <button 
                        onClick={onLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {variant === 'landing' ? (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 text-primary-600 hover:text-primary-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Crear cuenta
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard/settings"
                    className="block px-3 py-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Configuración
                  </Link>
                  <button
                    onClick={() => {
                      onLogout?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 