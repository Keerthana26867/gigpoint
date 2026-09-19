import React from 'react';
import { Mic } from 'lucide-react';

export const MicButton = ({ onClick, isListening, label = "Tap to Speak" }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <button
        onClick={onClick}
        className={`relative group w-24 h-24 rounded-full flex items-center justify-center transition transform active:scale-95 shadow-2xl ${
          isListening
            ? 'bg-red-500 animate-pulse-ring'
            : 'bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 shadow-red-500/40'
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" />
        <Mic className={`w-10 h-10 text-white z-10 transition ${isListening ? 'scale-110' : 'group-hover:scale-110'}`} />
      </button>
      <span className="text-sm font-semibold text-slate-300 tracking-wide">
        {isListening ? "Listening..." : label}
      </span>
    </div>
  );
};
