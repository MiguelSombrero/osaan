import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

// Only initialize in browser environment
if (typeof window !== 'undefined') {
  i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: 'fi',
      fallbackLng: 'fi',
      interpolation: { escapeValue: false },
      backend: {
        loadPath: '/locales/{{lng}}.json',
      },
    });
} else {
  // Server-side: initialize without HttpBackend
  i18n.use(initReactI18next).init({
    lng: 'fi',
    fallbackLng: 'fi',
    interpolation: { escapeValue: false },
    resources: {
      fi: {
        translation: {},
      },
      en: {
        translation: {},
      },
    },
  });
}

export default i18n;
