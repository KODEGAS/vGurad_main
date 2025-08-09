import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  text = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className={cn(
          "animate-spin rounded-full border-4 border-muted",
          sizeClasses[size]
        )} />
        
        {/* Inner spinning ring */}
        <div className={cn(
          "absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary",
          sizeClasses[size]
        )} style={{ animationDuration: '1.5s' }} />
        
        {/* Center dot */}
        <div className={cn(
          "absolute inset-0 m-auto rounded-full bg-primary animate-pulse",
          size === 'sm' ? 'h-1 w-1' : size === 'md' ? 'h-2 w-2' : 'h-3 w-3'
        )} />
      </div>
      
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
};

export const PageLoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card rounded-lg p-8 shadow-card animate-scale-in">
        <LoadingSpinner size="lg" text="Loading Vguard..." />
      </div>
    </div>
  );
};

export const SectionLoadingSpinner: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <LoadingSpinner text={text} />
    </div>
  );
};