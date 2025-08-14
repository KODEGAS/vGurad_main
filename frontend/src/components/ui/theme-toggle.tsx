import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
    className?: string;
    variant?: 'default' | 'outline' | 'ghost' | 'menu';
    size?: 'sm' | 'default' | 'lg';
    showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    className,
    variant = 'ghost',
    size = 'default',
    showLabel = false
}) => {
    const { theme, toggleTheme } = useTheme();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
    };

    if (variant === 'menu') {
        return (
            <div
                className={cn("flex items-center gap-3 cursor-pointer hover:bg-accent rounded-md p-2", className)}
                onClick={handleClick}
            >
                <div className="w-5 h-5 flex items-center justify-center">
                    {theme === 'dark' ? (
                        <Sun className="h-4 w-4" />
                    ) : (
                        <Moon className="h-4 w-4" />
                    )}
                </div>
                <span className="text-sm">
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
            </div>
        );
    }

    return (
        <Button
            variant={variant}
            size={size}
            onClick={handleClick}
            className={cn("relative", className)}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <div className="flex items-center gap-2">
                <div className="relative w-4 h-4">
                    <Sun className={cn(
                        "h-4 w-4 transition-all duration-300 absolute",
                        theme === 'dark'
                            ? "scale-0 rotate-90 opacity-0"
                            : "scale-100 rotate-0 opacity-100"
                    )} />
                    <Moon className={cn(
                        "h-4 w-4 transition-all duration-300 absolute",
                        theme === 'dark'
                            ? "scale-100 rotate-0 opacity-100"
                            : "scale-0 -rotate-90 opacity-0"
                    )} />
                </div>
                {showLabel && (
                    <span className="text-sm">
                        {theme === 'dark' ? 'Light' : 'Dark'}
                    </span>
                )}
            </div>
        </Button>
    );
};
