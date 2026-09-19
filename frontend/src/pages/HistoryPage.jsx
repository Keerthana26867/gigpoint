import React from 'react';
import { History } from 'lucide-react';
import { TransactionList } from '../components/TransactionList';

export const HistoryPage = ({ transactions = [] }) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white">Stock Movement Audit History</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Full audit log of all voice and manual stock additions and removals.
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-white">{transactions.length}</span>
          <span className="block text-xs text-slate-400 font-semibold">Total Logs</span>
        </div>
      </div>

      <TransactionList transactions={transactions} />

    </div>
  );
};
