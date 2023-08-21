/* eslint-disable */
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { de } from './de';
import { en } from './en';

export const supportedLngs = ['en', 'de'];

export const i18n = i18next
  .use(initReactI18next)
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

i18next.services.formatter?.add('lowercase', value => value.toLowerCase());
i18next.services.formatter?.add('uppercase', value => value.toUpperCase());
i18next.services.formatter?.add(
  'capitalize',
  value => value.charAt(0).toUpperCase() + value.slice(1),
);
