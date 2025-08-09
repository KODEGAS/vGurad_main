import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingDotsProps {
  className?: string;
  color?: 'primary' | 'success' | 'warning';
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  className = '',
  color = 'primary'
}) => {
  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning'
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      <div 
        className={cn(
          "h-2 w-2 rounded-full animate-bounce",
          colorClasses[color]
        )}
        style={{ animationDelay: '0ms' }}
      />
      <div 
        className={cn(
          "h-2 w-2 rounded-full animate-bounce",
          colorClasses[color]
        )}
        style={{ animationDelay: '150ms' }}
      />
      <div 
        className={cn(
          "h-2 w-2 rounded-full animate-bounce",
          colorClasses[color]
        )}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
};