import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Languages } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { languages } from '@/translations';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const selectedLang = languages.find(lang => lang.code === language);

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-44 h-11 bg-white border-2 border-primary/20 hover:border-primary/40 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-primary">
            <Languages className="h-5 w-5" />
            <span className="text-lg">{selectedLang?.flag}</span>
          </div>
          <span className="font-medium text-gray-700">{selectedLang?.name}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border-2 border-primary/20 shadow-xl rounded-lg">
        {languages.map((lang) => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            className="hover:bg-primary/10 focus:bg-primary/10 cursor-pointer py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};