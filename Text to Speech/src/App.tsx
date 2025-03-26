import React, { useState, useRef } from 'react';
import { Mic, Square, Volume2, Copy, RotateCcw, Play, Download } from 'lucide-react';

function App() {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition
  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setText(transcript);
      };

      recognitionRef.current.start();
      setIsListening(true);
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Text to Speech
  const speak = () => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
      setIsSpeaking(true);
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const resetText = () => {
    setText('');
    if (synthRef.current) synthRef.current.cancel();
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    setIsSpeaking(false);
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voxscript-transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-900 mb-2">VoxScript Pro</h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Volume2 className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-semibold text-indigo-600">Advanced Voice-Text Transformation Suite</span>
          </div>
          <p className="text-gray-600">Transform speech to text and back with professional-grade accuracy</p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Type something or click the microphone to start speaking..."
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600'
              }`}
            >
              {isListening ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isListening ? 'Stop Recording' : 'Start Recording'}
            </button>

            <button
              onClick={isSpeaking ? stopSpeaking : speak}
              disabled={!text}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                text
                  ? isSpeaking
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSpeaking ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isSpeaking ? 'Stop Speaking' : 'Play Text'}
            </button>

            <button
              onClick={copyToClipboard}
              disabled={!text}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                text
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Copy className="w-5 h-5" />
              Copy Text
            </button>

            <button
              onClick={downloadText}
              disabled={!text}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                text
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="w-5 h-5" />
              Download Text
            </button>

            <button
              onClick={resetText}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-600">
          <p className="font-medium">VoxScript Pro™ - Professional Voice Processing Technology</p>
          <p className="text-sm mt-2">Powered by Enterprise-Grade Speech Recognition</p>
        </footer>
      </div>
    </div>
  );
}

export default App;