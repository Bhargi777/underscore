import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-bg-tertiary text-text-primary hover:bg-accent-primary hover:text-bg-primary border border-accent-primary':
              variant === 'default',
            'bg-accent-primary text-bg-primary hover:bg-accent-secondary':
              variant === 'primary',
            'bg-bg-secondary text-text-primary hover:bg-bg-tertiary border border-text-muted':
              variant === 'secondary',
            'hover:bg-bg-tertiary hover:text-text-primary':
              variant === 'ghost',
            'bg-status-skipped text-white hover:bg-red-600':
              variant === 'danger',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };