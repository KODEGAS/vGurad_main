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
    <header className="bg-gradient-to-r from-primary to-crop-primary text-white p-4 shadow-card">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex flex-col items-center gap-3">
          <img src="/uploads/logo.png" alt="Vguard Logo" className="h-10 w-auto" />
        </div>
        
        <div className="flex items-center gap-3">
            <Link to="/market-prices">
            <Button variant="ghost" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <TrendingUp className="w-4 h-4 mr-2" />
              Market Prices
            </Button>
          </Link>
          <LanguageSelector />
          {/* Show Admin button only if userProfile.role === 'admin' */}
          {userProfile && userProfile.role === 'admin' && !profileLoading && (
            <Button
              variant="ghost"
              size="lg"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => navigate('/admin')}
            >
              Admin Panel
            </Button>
          )}
          <div className="flex gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar>
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                      <AvatarFallback className="bg-green-100 text-green-800">
                        {user.displayName ? user.displayName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('signOut') || 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => setLoginOpen(true)}>
                  <LogIn className="w-4 h-4 mr-2" />
                  {t('login')}
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setSignupOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('signUp')}
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