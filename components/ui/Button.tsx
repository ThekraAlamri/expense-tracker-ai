import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-500': variant === 'primary',
            'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300': variant === 'secondary',
            'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400': variant === 'danger',
          },
          {
            'text-xs px-2.5 py-1.5': size === 'sm',
            'text-sm px-4 py-2': size === 'md',
            'text-base px-5 py-2.5': size === 'lg',
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
export default Button;
