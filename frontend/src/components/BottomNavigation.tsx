import { Home, Scan, Calendar, ShoppingCart, User } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [    
    { id: 'home', icon: Home, label: 'Home', color: 'text-primary' },
    { id: 'scan', icon: Scan, label: 'Scan', color: 'text-success' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', color: 'text-crop-primary' },
    { id: 'marketplace', icon: ShoppingCart, label: 'Market', color: 'text-warning' },
    { id: 'profile', icon: User, label: 'Profile', color: 'text-accent-foreground' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-border z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 transition-all duration-200 ${
                  isActive 
                    ? `${tab.color} bg-primary/10 scale-105` 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'animate-bounce' : ''}`} />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-current mt-1 animate-pulse" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};