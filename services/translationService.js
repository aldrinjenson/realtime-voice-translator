
// services/translationService.js

const { Translate } = require('@google-cloud/translate').v2;
const { keyFilename } = require('../config/googleCloud');

const translate = new Translate({ keyFilename });

async function translateText(text, targetLanguage) {
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error('Translation API Error:', error);
    throw new Error('Failed to translate text');
  }
}

module.exports = {
  translateText
};