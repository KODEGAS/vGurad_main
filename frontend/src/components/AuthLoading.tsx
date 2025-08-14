import React from 'react';
import { Skeleton } from './ui/skeleton';

interface AuthLoadingProps {
  isMobile?: boolean;
}

export const AuthLoading: React.FC<AuthLoadingProps> = ({ isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="w-full px-3 py-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24 bg-white/20" />
            <Skeleton className="h-3 w-32 bg-white/20" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
      <div className="hidden md:flex flex-col gap-1">
        <Skeleton className="h-4 w-20 bg-white/20" />
      </div>
    </div>
  );
};
