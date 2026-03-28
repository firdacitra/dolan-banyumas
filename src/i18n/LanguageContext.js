// src/i18n/LanguageContext.js
import React, { createContext, useContext, useState } from 'react';
import translations from './translations';

// Buat context
const LanguageContext = createContext();

// Provider component — bungkus ini di App.js
export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('id'); // default: Indonesia

  // Fungsi terjemahan
  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations['id']?.[key] || key;
  };

  const changeLanguage = (langCode) => {
    if (langCode === 'id' || langCode === 'en') {
      setCurrentLanguage(langCode);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook untuk pakai di komponen mana saja
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage harus digunakan di dalam LanguageProvider');
  }
  return context;
};

export default LanguageContext;