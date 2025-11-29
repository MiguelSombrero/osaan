import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Test translations - minimal set for testing
const resources = {
  fi: {
    translation: {
      skills: 'Taidot',
      skillName: 'Taito',
      addSkill: 'Lisää taito',
      delete: 'Poista',
      noSkills: 'Ei taitoja',
      noMatch: 'Ei hakutuloksia',
      searchSkills: 'Hae taitoja...',
      login: 'Kirjaudu',
      logout: 'Kirjaudu ulos',
      employees: 'Työntekijät',
      fi: 'Suomi',
      en: 'English',
      errorTitle: 'Virhe',
      networkError: 'Yhteysvirhe',
    },
  },
  en: {
    translation: {
      skills: 'Skills',
      skillName: 'Skill Name',
      addSkill: 'Add Skill',
      delete: 'Delete',
      noSkills: 'No skills',
      noMatch: 'No results found',
      searchSkills: 'Search skills...',
      login: 'Login',
      logout: 'Logout',
      employees: 'Employees',
      fi: 'Suomi',
      en: 'English',
      errorTitle: 'Error',
      networkError: 'Network Error',
    },
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
