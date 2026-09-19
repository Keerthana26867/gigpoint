import React from 'react';
import { Mic, Package, AlertTriangle, History, RefreshCw, Volume2 } from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenMic, onReseed, isReseeding, backendOnline }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Volume2 className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">VoiceStock</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                AI MVP
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{backendOnline ? 'MongoDB Atlas Connected' : 'Offline Mode'}</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'inventory'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Inventory Catalog
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'alerts'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            Alerts
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            History
          </button>
        </nav>

        {/* Quick Actions & Seed Demo Data */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReseed}
            disabled={isReseeding}
            title="Reset demo data to initial state"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReseeding ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          <button
            onClick={onOpenMic}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold text-sm shadow-lg shadow-red-500/25 transition transform active:scale-95"
          >
            <Mic className="w-4 h-4 animate-bounce" />
            <span>Speak</span>
          </button>
        </div>

      </div>

      {/* Mobile Navigation Tab Bar */}
      <div className="md:hidden flex justify-around mt-3 pt-2 border-t border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'dashboard' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          <Package className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'inventory' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          <Package className="w-4 h-4" />
          Catalog
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'alerts' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          <AlertTriangle className="w-4 h-4" />
          Alerts
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'history' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          <History className="w-4 h-4" />
          History
        </button>
      </div>
    </header>
  );
};
