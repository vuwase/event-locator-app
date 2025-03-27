const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en', // Default language
    preload: ['en', 'fr'], // Load supported languages
    backend: {
      loadPath: './locales/{{lng}}/translation.json', // Adjust path if needed
    }
  });

module.exports = i18next;
// Compare this snippet from i18n.js: