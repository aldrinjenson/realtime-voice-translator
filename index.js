
const express = require('express');
const multer = require('multer');
const speech = require('@google-cloud/speech');
const {Translate} = require('@google-cloud/translate').v2;
const path = require('path');

const app = express();
const upload = multer();


// Load the service account key JSON file.
const keyFilename = path.join(__dirname, 'google-cloud-credentials.json');

// Set up Google Cloud Speech client with explicit credentials
const speechClient = new speech.SpeechClient({keyFilename});

// Set up Google Cloud Translation client with explicit credentials
const translate = new Translate({keyFilename});


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const audio = {
      content: req.file.buffer.toString('base64'),
    };

    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: req.body.sourceLanguage,
    };

    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Translate the transcription
    const [translation] = await translate.translate(transcription, req.body.targetLanguage);

    res.json({ transcription, translation });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during transcription or translation' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});