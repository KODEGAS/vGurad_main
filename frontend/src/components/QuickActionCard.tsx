import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'scan' | 'farmer' | 'crop';
  className?: string;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  variant = 'default',
  className = '',
}) => {
  return (
    <Card className={`hover:shadow-card transition-all duration-500 hover:scale-105 hover-glow-green group cursor-pointer animate-fade-in-up ${className}`}>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col items-center text-center space-y-3 md:space-y-4">
          <div className="bg-gradient-to-br from-crop-secondary to-accent p-3 md:p-4 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
            <Icon className="h-8 w-8 md:h-12 md:w-12 text-crop-primary transition-colors duration-300 group-hover:text-primary" />
          </div>
          <div className="transition-transform duration-300 group-hover:translateY(-2px) space-y-2">
            <h3 className="text-base md:text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary leading-tight">{title}</h3>
            <p className="text-muted-foreground text-xs md:text-sm transition-opacity duration-300 group-hover:opacity-80 leading-relaxed max-w-sm">{description}</p>
          </div>
          <Button
            onClick={onClick}
            variant={variant}
            className="w-full py-2.5 md:py-3 text-sm md:text-base font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 active:scale-95"
            size="sm"
          >
            <Icon className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            {title}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};