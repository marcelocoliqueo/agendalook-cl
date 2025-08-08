import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: ReactNode;
  error?: string;
  min?: string | number;
  max?: string | number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    id, 
    name, 
    type = 'text', 
    placeholder, 
    value, 
    onChange, 
    className, 
    disabled = false, 
    required = false,
    icon,
    error,
    min,
    max,
  }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          className={cn(
            'w-full border border-gray-300 rounded-lg transition-colors focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'text-gray-900 placeholder-gray-500',
            icon ? 'pl-10' : 'pl-4',
            'pr-4 py-3',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 