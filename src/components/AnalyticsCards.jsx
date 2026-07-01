import React from 'react';
import { Database, Columns, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';

export default function AnalyticsCards() {
  const METRICS = [
    {
      label: 'Total Rows',
      value: '125,430',
      desc: '+12.4% from last dataset import',
      icon: Database,
      trend: '+12.4%',
      positive: true
    },
    {
      label: 'Columns',
      value: '18',
      desc: '12 numerical, 6 categorical features',
      icon: Columns,
      trend: '18 Features',
      positive: true
    },
    {
      label: 'Missing Values',
      value: '2.4%',
      desc: '301 missing entries across 2 columns',
      icon: AlertCircle,
      trend: 'Low Risk',
      positive: true
    },
    {
      label: 'AI Insights',
      value: '37',
      desc: 'Discovered correlations & anomalies',
      icon: Sparkles,
      trend: 'Auto Generated',
      positive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      {METRICS.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className="glass-card p-4.5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 relative overflow-hidden group hover:border-[#8B5CF6]/40 transition-all shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{item.label}</span>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#8B5CF6] group-hover:bg-[#8B5CF6]/20 transition-all">
                <IconComponent size={16} />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">{item.value}</h3>
              <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
            </div>

            <div className="flex items-center gap-1.5 pt-2 border-t border-white/5 text-[11px]">
              <span className="badge badge-purple text-[10px]">{item.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
