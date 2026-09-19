import React, { useState } from 'react';
import { Mic, X, CheckCircle2, AlertCircle, Sparkles, Send } from 'lucide-react';
import { VOICE_STATES } from '../hooks/useVoice';
import { ConfirmationCard } from './ConfirmationCard';

export const VoiceModal = ({
  isOpen,
  onClose,
  voiceState,
  transcript,
  setTranscript,
  confirmationData,
  queryResult,
  errorMessage,
  successMessage,
  startListening,
  stopListeningAndProcess,
  confirmMutation,
  resetVoice,
  language,
  setLanguage
}) => {
  const [manualInput, setManualInput] = useState('');

  if (!isOpen) return null;

  const handlePresetClick = (presetText) => {
    setTranscript(presetText);
    stopListeningAndProcess(presetText);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim()) {
      setTranscript(manualInput);
      stopListeningAndProcess(manualInput);
      setManualInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col items-center text-center">
        
        {/* Top Header */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white text-base">Voice Assistant</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 text-xs font-semibold text-slate-300 rounded-lg px-2.5 py-1 border border-slate-700"
            >
              <option value="en-IN">Hinglish / EN (India)</option>
              <option value="hi-IN">Hindi (हिंदी)</option>
              <option value="te-IN">Telugu (తెలుగు)</option>
            </select>

            <button
              onClick={() => {
                resetVoice();
                onClose();
              }}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STATE 1: LISTENING */}
        {voiceState === VOICE_STATES.LISTENING && (
          <div className="flex flex-col items-center py-6 space-y-6 w-full">
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-red-500/20 animate-pulse-ring">
              <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-xl shadow-red-500/50">
                <Mic className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>

            {/* Audio Wave Visualizer Bars */}
            <div className="flex items-center justify-center gap-1.5 h-10">
              <span className="w-1.5 bg-red-500 rounded-full wave-bar-1" />
              <span className="w-1.5 bg-red-500 rounded-full wave-bar-2" />
              <span className="w-1.5 bg-red-500 rounded-full wave-bar-3" />
              <span className="w-1.5 bg-red-500 rounded-full wave-bar-4" />
              <span className="w-1.5 bg-red-500 rounded-full wave-bar-5" />
            </div>

            <p className="text-xs font-semibold text-red-400 tracking-widest uppercase">Listening...</p>

            {/* Live Transcript Display */}
            <div className="w-full bg-slate-950/60 p-4 rounded-2xl border border-slate-800 min-h-[70px] flex items-center justify-center">
              <p className="text-lg font-medium text-slate-100 italic">
                {transcript ? `"${transcript}"` : "Speak now... (e.g., '10 bags rice add karo')"}
              </p>
            </div>

            <button
              onClick={() => stopListeningAndProcess()}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg transition"
            >
              Done Speaking
            </button>
          </div>
        )}

        {/* STATE 2: PROCESSING */}
        {voiceState === VOICE_STATES.PROCESSING && (
          <div className="flex flex-col items-center py-10 space-y-4">
            <div className="w-14 h-14 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
            <p className="text-base font-semibold text-slate-200">AI is processing your request...</p>
            {transcript && <p className="text-xs text-slate-400 italic">"{transcript}"</p>}
          </div>
        )}

        {/* STATE 3: CONFIRMATION */}
        {voiceState === VOICE_STATES.CONFIRMATION && confirmationData && (
          <ConfirmationCard
            data={confirmationData}
            onConfirm={(updatedData) => confirmMutation(updatedData)}
            onCancel={resetVoice}
          />
        )}

        {/* STATE 4: SUCCESS */}
        {voiceState === VOICE_STATES.SUCCESS && (
          <div className="flex flex-col items-center py-6 space-y-4 w-full">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-white">Success!</h3>
            <p className="text-sm font-medium text-slate-300 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 max-w-sm">
              {successMessage || queryResult || "Operation completed successfully."}
            </p>

            <button
              onClick={resetVoice}
              className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition"
            >
              Speak Another Command
            </button>
          </div>
        )}

        {/* STATE 5: ERROR */}
        {voiceState === VOICE_STATES.ERROR && (
          <div className="flex flex-col items-center py-6 space-y-4 w-full">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-white">Notice</h3>
            <p className="text-sm text-rose-300 bg-rose-950/40 p-3.5 rounded-xl border border-rose-500/30 max-w-sm">
              {errorMessage}
            </p>

            <button
              onClick={startListening}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-sm shadow-lg transition"
            >
              Try Speaking Again
            </button>
          </div>
        )}

        {/* STATE 6: IDLE */}
        {voiceState === VOICE_STATES.IDLE && (
          <div className="flex flex-col items-center py-4 space-y-6 w-full">
            <button
              onClick={startListening}
              className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 flex items-center justify-center shadow-xl shadow-red-500/30 transition transform hover:scale-105 active:scale-95 group"
            >
              <Mic className="w-10 h-10 text-white group-hover:scale-110 transition" />
            </button>
            
            <p className="text-sm font-semibold text-slate-300">
              Tap Microphone to Speak
            </p>

            {/* Quick Demo Presets */}
            <div className="w-full pt-4 border-t border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Quick Demo Presets
              </p>

              <div className="grid grid-cols-2 gap-2 text-left">
                <button
                  onClick={() => handlePresetClick("10 bags rice add karo")}
                  className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 text-xs font-medium text-slate-200 transition"
                >
                  <span className="text-emerald-400 font-bold">Add:</span> "10 bags rice add karo"
                </button>
                <button
                  onClick={() => handlePresetClick("5 carton biscuits hata do")}
                  className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 text-xs font-medium text-slate-200 transition"
                >
                  <span className="text-rose-400 font-bold">Remove:</span> "5 carton biscuits hata do"
                </button>
                <button
                  onClick={() => handlePresetClick("Rice ke kitne bags hain?")}
                  className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 text-xs font-medium text-slate-200 transition"
                >
                  <span className="text-cyan-400 font-bold">Query:</span> "Rice ke kitne bags hain?"
                </button>
                <button
                  onClick={() => handlePresetClick("Which products are low?")}
                  className="p-2.5 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 text-xs font-medium text-slate-200 transition"
                >
                  <span className="text-amber-400 font-bold">Alert:</span> "Which products are low?"
                </button>
              </div>
            </div>

            {/* Manual Text Fallback */}
            <form onSubmit={handleManualSubmit} className="w-full flex gap-2 pt-3">
              <input
                type="text"
                placeholder="Or type voice command..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
