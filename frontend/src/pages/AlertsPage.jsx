import React from 'react';
import { AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const AlertsPage = ({ products = [], onQuickAdd, onQuickRemove }) => {
  const lowStockItems = products.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock');
  const outOfStockItems = products.filter((p) => p.status === 'Out of Stock');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white">Low Stock & Reorder Center</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Items that are below their low stock threshold or completely out of stock.
          </p>
        </div>

        <div className="text-right">
          <span className="text-3xl font-black text-amber-400">{lowStockItems.length}</span>
          <span className="block text-xs text-slate-400 font-semibold">Action Required</span>
        </div>
      </div>

      {outOfStockItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" /> Out of Stock Items ({outOfStockItems.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {outOfStockItems.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickAdd={onQuickAdd}
                onQuickRemove={onQuickRemove}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" /> All Reorder Recommendations ({lowStockItems.length})
        </h3>

        {lowStockItems.length === 0 ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
            <p className="text-emerald-400 text-sm font-semibold">🎉 All inventory stock levels are healthy!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lowStockItems.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickAdd={onQuickAdd}
                onQuickRemove={onQuickRemove}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
