import { useTranslation as useContextTranslation } from '@/contexts/TranslationContext';

interface Translation {
    en: string;
    si: string;
    ta: string;
}

export const useTranslation = () => {
    const { language } = useContextTranslation();

    const t = (translation: Translation): string => {
        return translation[language] || translation.en;
    };

    return { t, language };
};
