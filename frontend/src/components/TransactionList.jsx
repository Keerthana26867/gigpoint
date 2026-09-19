import React from 'react';
import { ArrowUpRight, ArrowDownRight, Mic, ShieldCheck } from 'lucide-react';

export const TransactionList = ({ transactions = [] }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
        No stock movements recorded yet. Try speaking a voice command!
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-xl">
      <h3 className="font-bold text-white text-sm pb-3 border-b border-slate-800 mb-3">
        Recent Activity Feed
      </h3>

      <div className="space-y-3">
        {transactions.map((tx) => {
          const isAdd = tx.action === 'ADD';
          const timeFormatted = new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={tx.id || tx._id} className="p-3 bg-slate-800/40 hover:bg-slate-800/80 rounded-xl border border-slate-700/40 flex items-center justify-between transition">
              
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isAdd ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}>
                  {isAdd ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{tx.productName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-semibold flex items-center gap-1">
                      {tx.source === 'VOICE' ? <Mic className="w-2.5 h-2.5 text-red-400" /> : <ShieldCheck className="w-2.5 h-2.5 text-cyan-400" />}
                      {tx.source}
                    </span>
                  </div>

                  {tx.transcript && (
                    <p className="text-xs text-slate-400 italic mt-0.5">
                      "{tx.transcript}"
                    </p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className={`text-sm font-black ${isAdd ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isAdd ? '+' : '-'}{tx.quantity} {tx.unit}
                </span>
                <span className="text-[11px] text-slate-400 block font-medium mt-0.5">
                  {timeFormatted}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
