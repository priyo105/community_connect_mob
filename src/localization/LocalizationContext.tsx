import React, { createContext, useContext, useState } from 'react';
import bn from './bn';
import en from './en';

type Language = 'en' | 'bn';
type TranslationKey = keyof typeof en;

interface LocalizationContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    const translations = locale === 'bn' ? bn : en;
    return translations[key] || en[key] || key;
  };

  return (
    <LocalizationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}