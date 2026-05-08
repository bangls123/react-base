import * as React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800 border-transparent',
    secondary: 'bg-gray-100 text-gray-800 border-transparent',
    destructive: 'bg-red-100 text-red-800 border-transparent',
    outline: 'text-gray-800 border-gray-300',
    success: 'bg-green-100 text-green-800 border-transparent',
    warning: 'bg-yellow-100 text-yellow-800 border-transparent',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
};

export { Badge };