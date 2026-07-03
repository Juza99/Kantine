import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import nl from './locales/nl.json'
import en from './locales/en.json'

export const defaultNS = 'translation'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      nl: { translation: nl },
      en: { translation: en },
    },
    fallbackLng: 'nl',
    supportedLngs: ['nl', 'en'],
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
    // Dutch is the default language regardless of browser/OS locale — only an
    // explicit choice via the language toggle (persisted to localStorage)
    // should switch to English.
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'de-kantine-language',
    },
  })

export default i18n
