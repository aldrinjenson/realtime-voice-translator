const recordButton = document.getElementById('micButton');
const sourceText = document.getElementById('sourceText');
const translatedText = document.getElementById('translatedText');
const language1Select = document.getElementById('language1');
const language2Select = document.getElementById('language2');
const speakerIcon = document.getElementById('speakerIcon');
const originalTextHeader = document.getElementById('originalTextHeader');
const translatedTextHeader = document.getElementById('translatedTextHeader');

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let lastTranslation = '';

recordButton.addEventListener('click', toggleRecording);
speakerIcon.addEventListener('click', () => speakTranslation(lastTranslation));

const languages = [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'ml-IN', name: 'Malayalam' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'pt-BR', name: 'Portuguese' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
];

function populateLanguageDropdowns() {
    languages.forEach(lang => {
        const option1 = new Option(lang.name, lang.code);
        const option2 = new Option(lang.name, lang.code);
        language1Select.add(option1);
        language2Select.add(option2);
    });

    // Set default values
    language1Select.value = languages[0].code;
    language2Select.value = languages[1].code;

    // Initialize Select2
    $('.select2').select2();
}

async function toggleRecording() {
    if (!isRecording) {
        await startRecording();
    } else {
        stopRecording();
    }
}

async function startRecording() {
    audioChunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
    });
    mediaRecorder.start();
    isRecording = true;
    updateMicButtonState();
}

function stopRecording() {
    mediaRecorder.stop();
    isRecording = false;
    updateMicButtonState();
    mediaRecorder.addEventListener('stop', sendAudioToServer);
}

function updateMicButtonState() {
    if (isRecording) {
        recordButton.classList.remove('btn-primary');
        recordButton.classList.add('btn-danger');
    } else {
        recordButton.classList.remove('btn-danger');
        recordButton.classList.add('btn-primary');
    }
}

async function sendAudioToServer() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('language1', language1Select.value);
    formData.append('language2', language2Select.value);

    try {
        sourceText.innerHTML = '<div class="spinner-border text-secondary" role="status"><span class="visually-hidden">Loading...</span></div>';
        translatedText.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

        const response = await axios.post('/api/transcribe', formData);
        sourceText.textContent = response.data.originalText;
        translatedText.textContent = response.data.translatedText;
        lastTranslation = response.data.translatedText;

        // Update language labels
        updateLanguageLabels(response.data.originalLanguage, response.data.translatedLanguage);

        speakTranslation(lastTranslation, response.data.translatedLanguage);
    } catch (error) {
        console.error('Error:', error);
        sourceText.textContent = 'Error occurred during transcription';
        translatedText.textContent = 'Error occurred during translation';
        lastTranslation = '';
    }
}

function updateLanguageLabels(originalLang, translatedLang) {
    const originalLangName = languages.find(lang => lang.code === originalLang)?.name || originalLang;
    const translatedLangName = languages.find(lang => lang.code === translatedLang)?.name || translatedLang;

    if (originalTextHeader) {
        originalTextHeader.textContent = `Original Text (${originalLangName})`;
    }
    if (translatedTextHeader) {
        translatedTextHeader.textContent = `Translated Text (${translatedLangName})`;
    }
}

function speakTranslation(text, lang) {
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
    }
}

// Initialize the app
populateLanguageDropdowns();
$('.select2').select2();