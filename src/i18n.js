import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en.json';
import translationES from './locales/es.json';
import translationHI from './locales/hi.json';

const resources = {
    en: {
        translation: translationEN
    },
    es: {
        translation: translationES
    },
    hi: {
        translation: translationHI
    }
};

// Get saved language from localStorage or use default
const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLanguage, // Use saved language or default
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React already does escaping
        }
    });

// Listen for language changes and save to localStorage
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('selectedLanguage', lng);
});

export default i18n;
