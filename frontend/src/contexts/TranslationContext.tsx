import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey, defaultLanguage } from '@/translations';

interface TranslationContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
    children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        // Check localStorage first
        const saved = localStorage.getItem('vguard-language');
        if (saved && Object.keys(translations).includes(saved)) {
            return saved as Language;
        }

        // Try to detect browser language
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('si')) return 'si';
        if (browserLang.startsWith('ta')) return 'ta';

        return defaultLanguage;
    });

    useEffect(() => {
        localStorage.setItem('vguard-language', language);
    }, [language]);

    const t = (key: TranslationKey): string => {
        return translations[language][key] || translations[defaultLanguage][key] || key;
    };

    const value: TranslationContextType = {
        language,
        setLanguage,
        t,
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = (): TranslationContextType => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
};
