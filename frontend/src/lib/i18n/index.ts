import { use } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { de } from './de';
import { en } from './en';

export const supportedLngs = ['en', 'de'];

export const i18n = use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en,
      de,
    },
    supportedLngs,
  });
