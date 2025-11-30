import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fiTranslations from '../../public/locales/fi.json';
import enTranslations from '../../public/locales/en.json';

const resources = {
  fi: {
    translation: fiTranslations,
  },
  en: {
    translation: enTranslations,
  },
};

// Create a separate i18n instance for tests
const testI18n = i18n.createInstance();

testI18n.use(initReactI18next).init({
  resources,
  lng: 'fi',
  fallbackLng: 'fi',
  interpolation: { escapeValue: false },
  // No backend needed for tests - inline resources
});

export default testI18n;
