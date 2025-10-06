'use client';

import Link from 'next/link';
import { ButtonHTMLAttributes } from 'react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

export function AuthButton({ 
  variant = 'primary', 
  size = 'md', 
  href, 
  children, 
  className = '',
  ...props 
}: AuthButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-sky-500',
    secondary: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-emerald-500',
    outline: 'bg-transparent border-2 border-sky-500 text-sky-600 hover:bg-sky-50 hover:border-sky-600 focus:ring-sky-500'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-xl sm:px-4 sm:py-2 sm:text-sm',
    md: 'px-4 py-2.5 text-sm rounded-2xl sm:px-6 sm:py-3 sm:text-base sm:rounded-3xl',
    lg: 'px-6 py-3 text-base rounded-2xl sm:px-8 sm:py-4 sm:text-lg sm:rounded-3xl'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

// Botones específicos para autenticación
export function LoginButton({ className = '', ...props }: Omit<AuthButtonProps, 'variant' | 'children'>) {
  return (
    <AuthButton 
      variant="outline" 
      size="md" 
      href="/login" 
      className={className}
      {...props}
    >
      <span className="hidden sm:inline">Iniciar Sesión</span>
      <span className="sm:hidden">Login</span>
    </AuthButton>
  );
}

export function RegisterButton({ className = '', ...props }: Omit<AuthButtonProps, 'variant' | 'children'>) {
  return (
    <AuthButton 
      variant="primary" 
      size="md" 
      href="/register" 
      className={className}
      {...props}
    >
      <span className="hidden sm:inline">Registrarse</span>
      <span className="sm:hidden">Registro</span>
    </AuthButton>
  );
}

// Botón CTA principal para la landing
export function CTAPrimaryButton({ className = '', ...props }: Omit<AuthButtonProps, 'variant' | 'children'>) {
  return (
    <AuthButton 
      variant="primary" 
      size="md" 
      href="/register" 
      className={`shine magnet ${className}`}
      {...props}
    >
      <span className="hidden sm:inline">Prueba 30 días gratis</span>
      <span className="sm:hidden">Prueba gratis</span>
    </AuthButton>
  );
}
