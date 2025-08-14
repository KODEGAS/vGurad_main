import React, { useState, useMemo, useCallback } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from '@/contexts/TranslationContext';

interface UserProfileProps {
    user: {
        displayName?: string | null;
        email?: string | null;
        photoURL?: string | null;
    };
    userProfile?: {
        displayName?: string;
        firstName?: string;
        full_name?: string;
    } | null;
    isMobile?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, userProfile, isMobile = false }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Memoize computed values for better performance
    const displayInfo = useMemo(() => {
        const getDisplayName = () => {
            if (userProfile?.displayName) return userProfile.displayName;
            if (userProfile?.full_name) return userProfile.full_name;
            if (userProfile?.firstName) return userProfile.firstName;
            if (user?.displayName) return user.displayName;
            if (user?.email) return user.email.split('@')[0];
            return 'User';
        };

        const fullName = getDisplayName();
        const firstName = fullName.split(' ')[0];
        const initials = fullName
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        return { fullName, firstName, initials };
    }, [user, userProfile]);

    const handleLogout = useCallback(async () => {
        setIsLoggingOut(true);
        try {
            await signOut(auth);
            toast.success(t('success'));
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to log out');
        } finally {
            setIsLoggingOut(false);
        }
    }, [navigate, t]);

    const handleProfileClick = useCallback(() => {
        navigate('/profile');
    }, [navigate]);

    // Mobile version renders as a simple button
    if (isMobile) {
        return (
            <div className="w-full">
                <div className="flex items-center gap-3 px-3 py-2 text-white">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={user?.photoURL || undefined}
                            alt={displayInfo.fullName}
                        />
                        <AvatarFallback className="bg-white/20 text-white">
                            {displayInfo.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            {t('welcome')}, {displayInfo.firstName}
                        </span>
                        <span className="text-xs text-white/70">{user?.email}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleProfileClick}
                        className="w-full text-white hover:bg-white/20 justify-start"
                    >
                        <User className="w-4 h-4 mr-3" />
                        {t('profile')}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-white hover:bg-white/20 justify-start"
                    >
                        <Settings className="w-4 h-4 mr-3" />
                        {t('settings')}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full text-red-300 hover:bg-red-500/20 justify-start"
                    >
                        <LogOut className="w-4 h-4 mr-3" />
                        {isLoggingOut ? t('loggingOut') : t('logout')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:bg-white/20 px-3 py-2 h-auto"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={user?.photoURL || undefined}
                            alt={displayInfo.fullName}
                        />
                        <AvatarFallback className="bg-white/20 text-white text-sm">
                            {displayInfo.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium">
                            {t('welcome')}, {displayInfo.firstName}
                        </span>
                    </div>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{displayInfo.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-red-600 focus:text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{isLoggingOut ? t('loggingOut') : t('logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
