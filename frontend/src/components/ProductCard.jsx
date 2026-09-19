import React from 'react';
import { Plus, Minus, AlertCircle, CheckCircle2, AlertTriangle, Trash2, Edit } from 'lucide-react';

export const ProductCard = ({ product, onQuickAdd, onQuickRemove, onEdit, onDelete }) => {
  const isOutOfStock = product.status === 'Out of Stock';
  const isLowStock = product.status === 'Low Stock';

  const statusBadge = () => {
    if (isOutOfStock) {
      return (
        <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertCircle className="w-3 h-3" />
          Out of Stock
        </span>
      );
    }
    if (isLowStock) {
      return (
        <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertTriangle className="w-3 h-3" />
          Low Stock ({product.quantity} left)
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <CheckCircle2 className="w-3 h-3" />
        Healthy
      </span>
    );
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3 backdrop-blur-md">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-extrabold text-white text-base leading-snug">{product.name}</h4>
            <span className="text-xs text-slate-400 font-medium">{product.category || 'General'}</span>
          </div>
          {statusBadge()}
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-black text-white">{product.quantity}</span>
            <span className="text-xs text-slate-400 ml-1 font-semibold">{product.unit}</span>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Threshold</span>
            <span className="text-xs font-bold text-slate-300">{product.lowStockThreshold} {product.unit}</span>
          </div>
        </div>

        {product.price > 0 && (
          <div className="mt-1 text-xs text-slate-400">
            Price: <span className="font-bold text-emerald-400">₹{product.price}</span> / {product.unit}
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
        <div className="flex gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300"
              title="Edit product"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
              title="Delete product"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onQuickRemove(product)}
            disabled={product.quantity <= 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <Minus className="w-3.5 h-3.5" />
            Remove 1
          </button>

          <button
            onClick={() => onQuickAdd(product)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add 1
          </button>
        </div>
      </div>
    </div>
  );
};
