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
    <Card className={`hover:shadow-card transition-all duration-500 hover:scale-105 hover-glow-green group cursor-pointer ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-gradient-to-br from-crop-secondary to-accent p-4 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-12 w-12 text-crop-primary transition-colors duration-300 group-hover:text-primary" />
          </div>
          <div className="transition-transform duration-300 group-hover:translateY(-2px)">
            <h3 className="text-lg font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">{title}</h3>
            <p className="text-muted-foreground text-sm mb-4 transition-opacity duration-300 group-hover:opacity-80">{description}</p>
          </div>
          <Button 
            onClick={onClick} 
            variant={variant}
            className="w-full py-3 text-base font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            {title}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};