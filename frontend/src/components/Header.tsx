import React from 'react';
import { LanguageSelector } from './LanguageSelector';
import { Button } from './ui/button';
import { AuthDialog } from './AuthDialog';
import { LogIn, UserPlus } from 'lucide-react';
interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}
export const Header: React.FC<HeaderProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  return <header className="bg-gradient-to-r from-primary to-crop-primary text-white p-4 shadow-card">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/uploads/logo.png" alt="Vguard Logo" className="h-10 w-auto" />
          
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={onLanguageChange} />
          
          <div className="flex gap-2">
            <AuthDialog>
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </AuthDialog>
            
            <AuthDialog>
              <Button variant="secondary" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </AuthDialog>
          </div>
        </div>
      </div>
    </header>;
};