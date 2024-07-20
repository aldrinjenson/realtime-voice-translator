const recordButton = document.getElementById('micButton');
const sourceText = document.getElementById('sourceText');
const translatedText = document.getElementById('translatedText');
const sourceLanguageSelect = document.getElementById('sourceLanguage');
const targetLanguageSelect = document.getElementById('targetLanguage');

let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let lastTranslation = '';

recordButton.addEventListener('click', toggleRecording);
speakerIcon.addEventListener('click', () => speakTranslation(lastTranslation));


const languages = [
    { code: 'en-US', name: 'English' },
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
        const sourceOption = new Option(lang.name, lang.code);
        const targetOption = new Option(lang.name, lang.code.split('-')[0]);
        sourceLanguageSelect.add(sourceOption);
        targetLanguageSelect.add(targetOption);
    });

    // Set default values
    sourceLanguageSelect.value = 'en-US';
    targetLanguageSelect.value = 'hi';

    // Initialize Select2
    $('.select2').select2();
}

recordButton.addEventListener('click', toggleRecording);

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
        recordButton.classList.remove('btn-secondary');
        recordButton.classList.add('btn-danger');
    } else {
        recordButton.classList.remove('btn-danger');
        recordButton.classList.add('btn-secondary');
    }
}

async function sendAudioToServer() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('sourceLanguage', sourceLanguageSelect.value);
    formData.append('targetLanguage', targetLanguageSelect.value);

    try {
        const response = await axios.post('/api/transcribe', formData);
        sourceText.textContent = response.data.transcription;
        translatedText.textContent = response.data.translation;
        speakTranslation(response.data.translation);
    } catch (error) {
        console.error('Error:', error);
        sourceText.textContent = 'Error occurred during transcription';
        translatedText.textContent = 'Error occurred during translation';
    }
}

function speakTranslation(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLanguageSelect.value;
    window.speechSynthesis.speak(utterance);
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
    formData.append('sourceLanguage', sourceLanguageSelect.value);
    formData.append('targetLanguage', targetLanguageSelect.value);

    try {
        sourceText.innerHTML = '<div class="spinner-border text-secondary" role="status"><span class="visually-hidden">Loading...</span></div>';
        translatedText.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

        const response = await axios.post('/api/transcribe', formData);
        sourceText.textContent = response.data.transcription;
        translatedText.textContent = response.data.translation;
        lastTranslation = response.data.translation;
        speakTranslation(lastTranslation);
    } catch (error) {
        console.error('Error:', error);
        sourceText.textContent = 'Error occurred during transcription';
        translatedText.textContent = 'Error occurred during translation';
        lastTranslation = '';
    }
}

function speakTranslation(text) {
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLanguageSelect.value;
        window.speechSynthesis.speak(utterance);
    }
}


// Initialize the app
populateLanguageDropdowns();
$('.select2').select2({
    // theme: 'bootstrap-5',
    // width: '100%'
});