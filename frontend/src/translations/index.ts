import { translations as en } from './en';
import { translations as si } from './si';
import { translations as ta } from './ta';

export const translations = {
  en,
  si,
  ta,
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof en;

export const languages = [
  { code: 'en' as const, name: 'English', flag: '🇬🇧' },
  { code: 'si' as const, name: 'සිංහල', flag: '🇱🇰' },
  { code: 'ta' as const, name: 'தமிழ்', flag: '🇱🇰' },
];

export const defaultLanguage: Language = 'en';
