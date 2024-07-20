# VoiceVista: Multilingual Voice based Speech Translator 

VoiceVista is a real-time voice translation web application that allows you to speak in one language and get instant translation speech in another.

## Features

- Real-time speech-to-text conversion
- Text-to-speech output for translated text
- User-friendly interface with mobile-responsive design
- Easy language selection with searchable dropdowns

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- A Google Cloud Platform account with Speech-to-Text and Translation APIs enabled
- A valid Google Cloud service account key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/aldrinjenson/realtime-voice-translator
   cd realtime-voice-translator
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `config` folder in the root directory and add a `googleCloud.js` file with your Google Cloud credentials:
   ```javascript
   module.exports = {
     keyFilename: '/path/to/your/google-cloud-credentials.json'
   };
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open your web browser and navigate to `http://localhost:3000` (or the port you've configured).

## Usage

1. Select your source language from the first dropdown.
2. Select your target language from the second dropdown.
3. Click and hold the microphone button to start recording your voice.
4. Release the button to stop recording and wait for the translation.
5. The original text and its translation will appear on the screen.
6. Click the speaker icon next to the translated text to hear it spoken aloud.
