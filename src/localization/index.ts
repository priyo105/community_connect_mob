import bn from './bn';
import en from './en';

type Language = 'en' | 'bn';
type TranslationKey = keyof typeof en;

let currentLang: Language = 'en';

export const setLanguage = (lang: Language) => {
  currentLang = lang;
};

export const getLanguage = () => currentLang;

export const t = (key: TranslationKey): string => {
  const translations = currentLang === 'bn' ? bn : en;
  return translations[key] || en[key] || key;
};