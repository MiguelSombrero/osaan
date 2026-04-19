import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fiTranslations from '../public/locales/fi.json';
import enTranslations from '../public/locales/en.json';

// Initialize once. Using static imports (not HttpBackend) ensures server and
// client always render the same translated text, preventing hydration mismatches.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'fi',
    fallbackLng: 'fi',
    interpolation: { escapeValue: false },
    resources: {
      fi: { translation: fiTranslations },
      en: { translation: enTranslations },
    },
  });
}

export default i18n;
