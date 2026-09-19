import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';

export const AddProductModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState('bags');
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [price, setPrice] = useState(100);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || 'Groceries');
      setQuantity(initialData.quantity || 0);
      setUnit(initialData.unit || 'pcs');
      setLowStockThreshold(initialData.lowStockThreshold || 5);
      setPrice(initialData.price || 0);
    } else {
      setName('');
      setCategory('Groceries');
      setQuantity(10);
      setUnit('bags');
      setLowStockThreshold(5);
      setPrice(100);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      category,
      quantity: Number(quantity),
      unit,
      lowStockThreshold: Number(lowStockThreshold),
      price: Number(price)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="font-extrabold text-white text-lg">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Basmati Rice"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Grains">Grains</option>
                <option value="Groceries">Groceries</option>
                <option value="Snacks">Snacks</option>
                <option value="Oil & Ghee">Oil & Ghee</option>
                <option value="Beverages">Beverages</option>
                <option value="Pulses">Pulses</option>
                <option value="Personal Care">Personal Care</option>
                <option value="Spices">Spices</option>
                <option value="Household">Household</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Trade Unit *</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="bags">bags</option>
                <option value="cartons">cartons</option>
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="litres">litres</option>
                <option value="boxes">boxes</option>
                <option value="packets">packets</option>
                <option value="bottles">bottles</option>
                <option value="dozens">dozens</option>
                <option value="quintals">quintals</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Initial Qty</label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Low Alert Limit</label>
              <input
                type="number"
                min="0"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Price (₹)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              {initialData ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {initialData ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
