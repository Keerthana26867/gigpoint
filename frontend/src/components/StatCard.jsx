import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'emerald' }) => {
  const colorStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  return (
    <div className={`p-4 rounded-2xl border backdrop-blur-md ${colorStyles[color] || colorStyles.emerald} transition hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{title}</p>
          <h3 className="text-2xl font-black text-white mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};
