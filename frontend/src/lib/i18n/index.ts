import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { en } from './en';
import { de } from './de';

export const supportedLngs = ['en', 'de'];

export const i18n = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
      format: (value, format) => {
        if (format === 'lowercase') {
          return value.toLowerCase();
        }

        return value;
      },
    },
    resources: {
      en,
      de,
    },
    supportedLngs,
  });
