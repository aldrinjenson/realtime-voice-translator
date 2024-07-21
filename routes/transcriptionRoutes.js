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

    const language1 = req.body.language1?.toLowerCase();
    const language2 = req.body.language2?.toLowerCase();

    let { transcription, detectedLanguage } = await transcribe(req.file.buffer, language1, language2);

    if(!transcription?.trim().length){
      res.json({
        originalText: '',
        translatedText: '',
        originalLanguage: language1,
        translatedLanguage: language2
      })
    }
    

    let targetLanguage;
    if (detectedLanguage === language1) {
      targetLanguage = language2;
    } else if (detectedLanguage === language2) {
      targetLanguage = language1;
    } else {
      throw new Error('Detected language does not match either of the specified languages');
    }

    const translation = await translateText(transcription, targetLanguage);

    res.json({ 
      originalText: transcription, 
      translatedText: translation, 
      originalLanguage: detectedLanguage, 
      translatedLanguage: targetLanguage 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;