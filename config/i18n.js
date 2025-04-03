const i18n = require('i18n');

// Set up i18n configuration
i18n.configure({
  locales: ['en', 'fr'],  // Add the languages you need
  directory: __dirname + '/locales',  // Path to translations folder
  defaultLocale: 'en',  // Set default locale
  objectNotation: true, // Allow nested translations
});

module.exports = i18n;
