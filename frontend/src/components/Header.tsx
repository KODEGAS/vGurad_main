import React, { useState } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { Button } from './ui/button';
import { AuthDialog } from './AuthDialog';
import { UserProfile } from './UserProfile';
import { AuthLoading } from './AuthLoading';
import { LogIn, UserPlus, Home, Menu, X } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userProfile, isLoading } = useAuthContext();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-primary to-crop-primary text-white shadow-card">
      <div className="container mx-auto px-4 py-3">
        {/* Main header content */}
        <div className="flex items-center justify-between">
          {/* Logo and main navigation */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/" className="flex items-center gap-2 md:gap-3">
              <img src="/uploads/logo.png" alt="Vguard Logo" className="h-8 md:h-10 w-auto" />
            </Link>

            {/* Desktop navigation */}
            {location.pathname !== '/' && (
              <nav className="hidden md:flex items-center gap-4">
                <Link to="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    {t('home')}
                  </Button>
                </Link>
              </nav>
            )}

            {location.pathname === '/' && (
              <nav className="hidden md:flex items-center gap-4">
                <Link to="/seed-pricing">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <span className="text-sm font-bold mr-2">Rs.</span>
                    {t('seedPricing')}
                  </Button>
                </Link>
              </nav>
            )}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSelector />
            {isLoading ? (
              <AuthLoading />
            ) : user ? (
              <UserProfile user={user} userProfile={userProfile} />
            ) : (
              <div className="flex gap-2">
                <AuthDialog>
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('login')}
                  </Button>
                </AuthDialog>
                <AuthDialog>
                  <Button variant="secondary" size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t('signUp')}
                  </Button>
                </AuthDialog>
              </div>
            )}
          </div>

          {/* Mobile menu button and language selector */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className={`text-white hover:bg-white/20 p-2 relative transition-all duration-300 ease-in-out transform ${isMobileMenuOpen ? 'rotate-180 bg-white/20' : 'hover:scale-110'
                }`}
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Menu
                  className={`w-5 h-5 absolute transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
                    }`}
                />
                <X
                  className={`w-5 h-5 absolute transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
                    }`}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile menu with animations */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
              ? 'max-h-96 opacity-100 mt-4 pt-4'
              : 'max-h-0 opacity-0 mt-0 pt-0'
            }`}
        >
          <div className="border-t border-white/20 animate-in slide-in-from-top-5 duration-300">
            <nav className="flex flex-col gap-2 mt-4">
              {/* Mobile navigation links with staggered animations */}
              {location.pathname !== '/' && (
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="animate-in slide-in-from-left-5 duration-300"
                  style={{ animationDelay: '100ms' }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-white hover:bg-white/20 justify-start transition-all duration-200 hover:translate-x-1 hover:shadow-lg backdrop-blur-sm"
                  >
                    <Home className="w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110" />
                    {t('home')}
                  </Button>
                </Link>
              )}

              {location.pathname === '/' && (
                <Link
                  to="/seed-pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="animate-in slide-in-from-left-5 duration-300"
                  style={{ animationDelay: '100ms' }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-white hover:bg-white/20 justify-start transition-all duration-200 hover:translate-x-1 hover:shadow-lg backdrop-blur-sm"
                  >
                    <span className="text-sm font-bold mr-3 transition-transform duration-200 group-hover:scale-110">Rs.</span>
                    {t('seedPricing')}
                  </Button>
                </Link>
              )}

              {/* Mobile auth buttons with enhanced animations */}
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/20">
                {isLoading ? (
                  <div className="animate-in slide-in-from-left-5 duration-300">
                    <AuthLoading isMobile={true} />
                  </div>
                ) : user ? (
                  <div className="animate-in slide-in-from-left-5 duration-300">
                    <UserProfile user={user} userProfile={userProfile} isMobile={true} />
                  </div>
                ) : (
                  <>
                    <AuthDialog>
                      <div
                        className="animate-in slide-in-from-left-5 duration-300"
                        style={{ animationDelay: '200ms' }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 justify-start transition-all duration-200 hover:translate-x-1 hover:shadow-lg backdrop-blur-sm"
                        >
                          <LogIn className="w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110" />
                          {t('login')}
                        </Button>
                      </div>
                    </AuthDialog>
                    <AuthDialog>
                      <div
                        className="animate-in slide-in-from-left-5 duration-300"
                        style={{ animationDelay: '300ms' }}
                      >
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-start transition-all duration-200 hover:translate-x-1 hover:shadow-lg"
                        >
                          <UserPlus className="w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110" />
                          {t('signUp')}
                        </Button>
                      </div>
                    </AuthDialog>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};