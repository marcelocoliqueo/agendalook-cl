import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'spinner',
  className,
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const spinnerClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex space-x-1">
          <div className={cn('bg-lavender-500 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '0ms' }}></div>
          <div className={cn('bg-lavender-500 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '150ms' }}></div>
          <div className={cn('bg-lavender-500 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '300ms' }}></div>
        </div>
        {text && <span className="ml-3 text-gray-600">{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className={cn('bg-lavender-500 rounded-full animate-pulse', sizeClasses[size])}></div>
        {text && <span className="ml-3 text-gray-600">{text}</span>}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-lavender-500', spinnerClasses[size])} />
      {text && <span className="ml-3 text-gray-600">{text}</span>}
    </div>
  );
}

// Componente para pantalla completa de carga
export function FullPageLoader({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{text}</p>
      </div>
    </div>
  );
}

// Componente para carga en botones
export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <LoadingSpinner 
      size={size} 
      className="inline-flex"
    />
  );
} 