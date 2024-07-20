
const speech = require('@google-cloud/speech');
const { keyFilename } = require('../config/googleCloud');

const speechClient = new speech.SpeechClient({ keyFilename });

async function transcribe(audioBuffer, languageCode) {
  const audio = {
    content: audioBuffer.toString('base64'),
  };

  const config = {
    languageCode: languageCode,
  };

  const request = {
    audio: audio,
    config: config,
  };

  try {
    const [response] = await speechClient.recognize(request);
    return response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
  } catch (error) {
    console.error('Speech-to-Text API Error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

module.exports = {
  transcribe
};