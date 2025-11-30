import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Test translations - minimal set for testing
const resources = {
  fi: {
    translation: {
      skills: 'Osaamiset',
      skillName: 'Osaamisen nimi',
      add: 'Lisää',
      addSkill: 'Lisää osaaminen',
      delete: 'Poista',
      noSkills: 'Ei osaamisia',
      noMatch: 'Ei vastaavia osaamisia',
      searchSkills: 'Hae taitoja...',
      login: 'Kirjaudu sisään',
      logout: 'Kirjaudu ulos',
      employees: 'Työntekijät',
      fi: 'Suomi',
      en: 'English',
      errorTitle: 'Virhe',
      networkError: 'Yhteysvirhe',
      validation: {
        skillNameRequired: 'Osaamisen nimi on pakollinen',
        skillNameMinLength: 'Osaamisen nimen on oltava vähintään 1 merkki',
        skillNameMaxLength: 'Osaamisen nimi saa olla enintään 50 merkkiä',
      },
    },
  },
  en: {
    translation: {
      skills: 'Skills',
      skillName: 'Skill name',
      add: 'Add',
      addSkill: 'Add skill',
      delete: 'Delete',
      noSkills: 'No skills',
      noMatch: 'No matching skills',
      searchSkills: 'Search skills...',
      login: 'Login',
      logout: 'Logout',
      employees: 'Employees',
      fi: 'Suomi',
      en: 'English',
      errorTitle: 'Error',
      networkError: 'Network Error',
      validation: {
        skillNameRequired: 'Skill name is required',
        skillNameMinLength: 'Skill name must be at least 1 character',
        skillNameMaxLength: 'Skill name must not exceed 50 characters',
      },
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
