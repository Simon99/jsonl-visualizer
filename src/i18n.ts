import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import zhTWTranslations from './locales/zh-TW.json';
import zhCNTranslations from './locales/zh-CN.json';

// Function to determine which Chinese variant to use
const getChineseLocale = (detectedLang: string): string => {
  // Check for traditional Chinese regions
  if (detectedLang.includes('TW') || detectedLang.includes('HK') || detectedLang.includes('MO')) {
    return 'zh-TW';
  }
  // Check for simplified Chinese
  if (detectedLang.startsWith('zh')) {
    return 'zh-CN';
  }
  return detectedLang;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      'zh-TW': {
        translation: zhTWTranslations
      },
      'zh-CN': {
        translation: zhCNTranslations
      }
    },
    fallbackLng: 'en',
    debug: false,

    detection: {
      order: ['navigator', 'htmlTag', 'localStorage'],
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => {
        const lang = lng.toLowerCase();
        // Handle Chinese variants
        if (lang.startsWith('zh')) {
          return getChineseLocale(lang);
        }
        // Return English for all other languages
        if (!['en', 'zh-tw', 'zh-cn'].includes(lang)) {
          return 'en';
        }
        return lang;
      }
    },

    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;