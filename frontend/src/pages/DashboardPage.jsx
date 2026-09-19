import React from 'react';
import { Package, AlertTriangle, AlertCircle, Activity, Mic } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { LowStockAlert } from '../components/LowStockAlert';
import { TransactionList } from '../components/TransactionList';
import { ProductCard } from '../components/ProductCard';

export const DashboardPage = ({
  stats,
  products,
  transactions,
  onOpenMic,
  onQuickAdd,
  onQuickRemove
}) => {
  const lowStockItems = stats?.lowStockItems || [];
  const recentProducts = (products || []).slice(0, 6);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner & Prominent Voice CTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
              <span>Namaste Shopkeeper 👋</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Voice-First Inventory Hub
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-lg">
              Manage stock in English or Hinglish without typing. Say <span className="text-emerald-300 font-semibold">"10 bags rice add karo"</span> or ask <span className="text-emerald-300 font-semibold">"Rice ke kitne bags hain?"</span>
            </p>
          </div>

          {/* Prominent Mic Button CTA */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <button
              onClick={onOpenMic}
              className="group relative flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 via-rose-600 to-red-500 hover:from-red-600 hover:to-rose-700 text-white font-extrabold text-base shadow-xl shadow-red-500/30 transition transform hover:scale-105 active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Mic className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div className="text-left">
                <span className="block text-xs text-red-100 font-medium">Tap & Speak</span>
                <span className="block text-sm">"10 bags rice add karo"</span>
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* Dashboard Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts ?? 0}
          subtitle="Catalog Items"
          icon={Package}
          color="emerald"
        />
        <StatCard
          title="Low Stock"
          value={stats?.lowStockCount ?? 0}
          subtitle="Needs Reordering"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Out of Stock"
          value={stats?.outOfStockCount ?? 0}
          subtitle="Zero Stock"
          icon={AlertCircle}
          color="rose"
        />
        <StatCard
          title="Movements Today"
          value={stats?.todayMovements ?? 0}
          subtitle="Stock Actions"
          icon={Activity}
          color="cyan"
        />
      </div>

      {/* Main Grid: Low Stock Alerts + Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Low Stock Alerts & Quick Products */}
        <div className="lg:col-span-2 space-y-6">
          <LowStockAlert
            items={lowStockItems}
            onQuickRestock={(item) => onQuickAdd(item, 5)}
          />

          {/* Quick Product Grid */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base">Quick Stock Adjustments</h3>
              <span className="text-xs text-slate-400 font-medium">Showing top items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickAdd={onQuickAdd}
                  onQuickRemove={onQuickRemove}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Recent Transactions Activity Feed */}
        <div className="space-y-6">
          <TransactionList transactions={transactions} />
        </div>

      </div>

    </div>
  );
};
