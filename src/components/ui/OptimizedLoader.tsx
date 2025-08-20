import { LoadingSpinner } from './LoadingSpinner';

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  );
}

// Skeleton para servicios
export function ServicesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}

// Skeleton para disponibilidad
export function AvailabilitySkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Skeleton className="h-4 w-4 mr-3" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton para reservas
export function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Loader optimizado que muestra skeleton mientras carga
export function OptimizedLoader({ 
  type = 'spinner',
  children,
  isLoading,
  skeleton
}: {
  type?: 'spinner' | 'skeleton';
  children: React.ReactNode;
  isLoading: boolean;
  skeleton?: React.ReactNode;
}) {
  if (isLoading) {
    if (type === 'skeleton' && skeleton) {
      return <>{skeleton}</>;
    }
    return <LoadingSpinner size="lg" />;
  }
  
  return <>{children}</>;
} 