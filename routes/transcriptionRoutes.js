
// routes/transcriptionRoutes.js

const express = require('express');
const multer = require('multer');
const { transcribe } = require('../services/speechService');
const { translateText } = require('../services/translationService');

const router = express.Router();
const upload = multer();

router.post('/transcribe', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error('No audio file provided');
    }

    const transcription = await transcribe(req.file.buffer, req.body.sourceLanguage);
    const translation = await translateText(transcription, req.body.targetLanguage);

    res.json({ transcription, translation });
  } catch (error) {
    next(error);
  }
});

module.exports = router;