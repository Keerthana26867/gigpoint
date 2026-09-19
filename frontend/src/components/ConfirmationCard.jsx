import React, { useState } from 'react';
import { Check, X, Edit2, Plus, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const ConfirmationCard = ({ data, onConfirm, onCancel }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [action, setAction] = useState(data.action || 'ADD');
  const [product, setProduct] = useState(data.product || '');
  const [quantity, setQuantity] = useState(data.quantity || 1);
  const [unit, setUnit] = useState(data.unit || 'pcs');

  const handleSaveAndConfirm = () => {
    onConfirm({
      ...data,
      action,
      product,
      quantity: Number(quantity),
      unit
    });
  };

  const isAdd = action === 'ADD';

  return (
    <div className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Confirm Inventory Update
        </span>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
        >
          <Edit2 className="w-3.5 h-3.5" />
          {isEditing ? 'Done Editing' : 'Edit Details'}
        </button>
      </div>

      {/* Main Confirmation Content */}
      <div className="space-y-4">
        
        {/* Action Toggle */}
        <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-700/40">
          <span className="text-xs font-semibold text-slate-400">Action:</span>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAction('ADD')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  action === 'ADD' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}
              >
                ADD STOCK
              </button>
              <button
                type="button"
                onClick={() => setAction('REMOVE')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  action === 'REMOVE' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                REMOVE STOCK
              </button>
            </div>
          ) : (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
              isAdd ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}>
              {isAdd ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {isAdd ? 'ADD STOCK' : 'REMOVE STOCK'}
            </div>
          )}
        </div>

        {/* Product Field */}
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Product Name:</span>
          {isEditing ? (
            <input
              type="text"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="bg-slate-800 text-white text-sm font-semibold rounded-lg px-2 py-1 border border-slate-600 focus:outline-none focus:border-emerald-500 text-right"
            />
          ) : (
            <span className="text-base font-extrabold text-white">{product || 'Unknown Product'}</span>
          )}
        </div>

        {/* Quantity & Unit Stepper */}
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/40 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Quantity & Unit:</span>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setQuantity(Math.max(1, Number(quantity) - 1))}
                  className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-16 bg-slate-800 text-white text-center font-bold text-sm rounded border border-slate-600 py-1"
                />
                <button
                  onClick={() => setQuantity(Number(quantity) + 1)}
                  className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-white"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="bg-slate-800 text-white text-xs font-semibold rounded px-2 py-1 border border-slate-600 ml-1"
                >
                  <option value="bags">bags</option>
                  <option value="cartons">cartons</option>
                  <option value="pcs">pcs</option>
                  <option value="kg">kg</option>
                  <option value="litres">litres</option>
                  <option value="boxes">boxes</option>
                  <option value="packets">packets</option>
                </select>
              </div>
            ) : (
              <span className="text-base font-black text-emerald-400">
                {quantity} <span className="text-xs text-slate-300 font-normal">{unit}</span>
              </span>
            )}
          </div>
        </div>

        {/* Natural Summary prompt */}
        <div className="text-center py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
          <p className="text-sm font-semibold text-emerald-300">
            "{isAdd ? 'Add' : 'Remove'} {quantity} {unit} of {product}?"
          </p>
        </div>

      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <button
          onClick={onCancel}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-sm transition"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>

        <button
          onClick={handleSaveAndConfirm}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
        >
          <Check className="w-4 h-4" />
          Confirm
        </button>
      </div>

    </div>
  );
};
