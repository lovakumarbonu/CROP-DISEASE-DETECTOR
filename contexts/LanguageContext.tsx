import React, { createContext, useState, useContext, useMemo, FC, ReactNode } from 'react';
import { translations, languages, Language } from '../translations';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: Record<string, string>;
  currentLanguageDetails: Language;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en'); // Default language is English

  const value = useMemo(() => {
    const currentTranslations = translations[language] || translations.en;
    const currentLanguageDetails = languages.find(lang => lang.code === language) || languages[0];

    return {
      language,
      setLanguage,
      translations: currentTranslations,
      currentLanguageDetails,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
