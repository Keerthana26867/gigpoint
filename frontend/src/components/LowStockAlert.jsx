import React from 'react';
import { AlertTriangle, AlertCircle, Plus } from 'lucide-react';

export const LowStockAlert = ({ items = [], onQuickRestock }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
        <p className="text-emerald-400 text-xs font-semibold">🎉 All inventory stock levels are healthy!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-sm">Low Stock Alerts ({items.length})</h3>
        </div>
        <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Action Needed</span>
      </div>

      <div className="divide-y divide-slate-800/60 mt-2">
        {items.map((item) => {
          const isOut = item.quantity === 0;
          return (
            <div key={item.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {isOut ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <div>
                  <h5 className="font-bold text-slate-100 text-sm">{item.name}</h5>
                  <p className="text-xs text-slate-400">
                    Threshold: <span className="font-medium text-slate-300">{item.lowStockThreshold} {item.unit}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-sm font-black ${isOut ? 'text-rose-400' : 'text-amber-400'}`}>
                  {item.quantity} {item.unit}
                </span>

                {onQuickRestock && (
                  <button
                    onClick={() => onQuickRestock(item)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition"
                  >
                    <Plus className="w-3 h-3" /> Restock
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
