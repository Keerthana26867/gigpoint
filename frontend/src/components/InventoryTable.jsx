import React from 'react';
import { ProductCard } from './ProductCard';
import { Plus, Minus, Edit, Trash2, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

export const InventoryTable = ({ products, onQuickAdd, onQuickRemove, onEdit, onDelete }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-12 text-center">
        <p className="text-slate-400 text-sm font-medium">No products found matching criteria.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Mobile Card Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onQuickAdd={onQuickAdd}
            onQuickRemove={onQuickRemove}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4 font-bold">Product</th>
              <th className="py-3.5 px-4 font-bold">Category</th>
              <th className="py-3.5 px-4 font-bold">Current Stock</th>
              <th className="py-3.5 px-4 font-bold">Threshold</th>
              <th className="py-3.5 px-4 font-bold">Unit Price</th>
              <th className="py-3.5 px-4 font-bold">Status</th>
              <th className="py-3.5 px-4 font-bold text-right">Stock Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {products.map((p) => {
              const isOut = p.status === 'Out of Stock';
              const isLow = p.status === 'Low Stock';

              return (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-extrabold text-white">{p.name}</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-400">{p.category || 'General'}</td>
                  <td className="py-3.5 px-4 font-black text-base text-white">
                    {p.quantity} <span className="text-xs font-normal text-slate-400">{p.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-400">{p.lowStockThreshold} {p.unit}</td>
                  <td className="py-3.5 px-4 text-xs font-bold text-emerald-400">
                    {p.price > 0 ? `₹${p.price}` : '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    {isOut ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        <AlertCircle className="w-3 h-3" /> Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Healthy
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onQuickRemove(p)}
                        disabled={p.quantity <= 0}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Remove 1 unit"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onQuickAdd(p)}
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                        title="Add 1 unit"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onEdit(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 ml-2"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDelete(p.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
