import React from 'react';
import { useEffect, useState } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { Button } from './ui/button';
import { AuthDialog } from './AuthDialog';
import { LogIn, UserPlus, LogOut, TrendingUp } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { auth } from '../firebase';
import { useNavigate  , Link} from 'react-router-dom';
import { useTranslation } from '@/contexts/TranslationContext';

interface UserProfile {
  email: string;
  role: 'admin' | 'proUser' | 'user';
}

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setProfileLoading(true);
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await fetch('https://vgurad-backend.onrender.com/api/user-profile', {
            headers: {
              'Authorization': `Bearer ${idToken}`,
            },
          });
          if (response.ok) {
            const profile = await response.json();
            setUserProfile(profile);
          } else {
            setUserProfile(null);
          }
        } catch (e) {
          setUserProfile(null);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setUserProfile(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
  };

  return (
    <header className="bg-gradient-to-r from-primary to-crop-primary text-white p-2 md:p-4 shadow-card">
      <div className="container mx-auto flex items-center justify-between max-w-full px-2 md:px-0">
        <div className="flex-shrink-0">
          <img src="/uploads/logo.png" alt="Vguard Logo" className="h-6 md:h-10 w-auto" />
        </div>
        
        <div className="flex items-center gap-1 md:gap-3">
          <Link to="/market-prices" className="hidden lg:block">
            <Button variant="ghost" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs md:text-sm px-2 md:px-4">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Market Prices</span>
              <span className="md:hidden">Prices</span>
            </Button>
          </Link>
          
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
          
          {/* Show Admin button only if userProfile.role === 'admin' */}
          {userProfile && userProfile.role === 'admin' && !profileLoading && (
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs md:text-sm px-2 md:px-4 hidden lg:block"
              onClick={() => navigate('/admin')}
            >
              Admin
            </Button>
          )}
          
          <div className="flex gap-1 md:gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-1 md:gap-2 cursor-pointer">
                    <Avatar className="h-7 w-7 md:h-10 md:w-10">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                      <AvatarFallback className="bg-green-100 text-green-800 text-xs md:text-sm">
                        {user.displayName ? user.displayName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem disabled className="text-xs md:text-sm">
                    {user.email}
                  </DropdownMenuItem>
                  {/* Mobile-only menu items */}
                  <DropdownMenuItem className="lg:hidden" onClick={() => navigate('/market-prices')}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Market Prices
                  </DropdownMenuItem>
                  <DropdownMenuItem className="md:hidden">
                    <LanguageSelector />
                  </DropdownMenuItem>
                  {userProfile && userProfile.role === 'admin' && (
                    <DropdownMenuItem className="lg:hidden" onClick={() => navigate('/admin')}>
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('signOut') || 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs px-2 md:px-4" 
                  onClick={() => setLoginOpen(true)}
                >
                  <LogIn className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="hidden sm:inline">{t('login')}</span>
                  <span className="sm:hidden">Login</span>
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="text-xs px-2 md:px-4"
                  onClick={() => setSignupOpen(true)}
                >
                  <UserPlus className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  <span className="hidden sm:inline">{t('signUp')}</span>
                  <span className="sm:hidden">Sign Up</span>
                </Button>
                {loginOpen && <AuthDialog open={loginOpen} onOpenChange={setLoginOpen} />}
                {signupOpen && <AuthDialog open={signupOpen} onOpenChange={setSignupOpen} />}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};