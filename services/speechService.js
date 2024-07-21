const speech = require('@google-cloud/speech');
const { keyFilename } = require('../config/googleCloud');

const speechClient = new speech.SpeechClient({ keyFilename });

async function transcribe(audioBuffer, sourceLanguage, targetLanguage) {
  const audio = {
    content: audioBuffer.toString('base64'),
  };

  const config = {
    languageCode: sourceLanguage,
    alternativeLanguageCodes: [targetLanguage, sourceLanguage],
    enableAutomaticPunctuation: true,
    enableLanguageIdentification: true,
  };

  const request = {
    audio: audio,
    config: config,
  };

  try {
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    const detectedLanguage = response.results[0]?.languageCode || 'unknown';
    return { transcription, detectedLanguage };
  } catch (error) {
    console.error('Speech-to-Text API Error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

module.exports = {
  transcribe
};