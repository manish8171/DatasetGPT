import React from 'react';
import { Database, CheckCircle2, Activity, ShieldCheck, Cpu, HardDrive } from 'lucide-react';

export default function RightContextPanel() {
  const CAPABILITIES = [
    'Statistical Analysis',
    'Data Cleaning',
    'Visualization',
    'Natural Language Queries',
    'Anomaly Detection',
    'Pattern Detection'
  ];

  const ACTIVITIES = [
    { time: '2 mins ago', title: 'Dataset analyzed', desc: 'Processed 918 records in heart.csv' },
    { time: '15 mins ago', title: 'Chart generated', desc: 'Monthly revenue bar chart export' },
    { time: '1 hour ago', title: 'AI insight discovered', desc: 'Detected 0.82 Pearson correlation' }
  ];

  return (
    <aside className="w-72 h-full flex flex-col bg-[#0D101C] border-l border-white/10 p-4 space-y-5 overflow-y-auto hidden xl:block">
      {/* Current Dataset Health Card */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Dataset</span>
          <span className="badge badge-purple text-[10px]">● Active</span>
        </div>

        <div>
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <Database size={15} className="text-[#8B5CF6]" />
            sales_data.csv
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">125,430 rows · 18 columns</p>
        </div>

        {/* Dataset Health Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Dataset Health Score</span>
            <span className="text-[#8B5CF6]">92%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/10">
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] h-full rounded-full w-[92%]" />
          </div>
        </div>
      </div>

      {/* AI Capabilities Checklist */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 shadow-md">
        <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
          <Cpu size={14} className="text-[#8B5CF6]" />
          AI Capabilities
        </h4>
        <div className="space-y-2">
          {CAPABILITIES.map((cap, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 size={13} className="text-[#8B5CF6]" />
              <span>{cap}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 shadow-md">
        <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
          <Activity size={14} className="text-[#8B5CF6]" />
          Recent Activity
        </h4>
        <div className="space-y-3 border-l border-white/10 pl-3">
          {ACTIVITIES.map((act, idx) => (
            <div key={idx} className="space-y-0.5 relative">
              <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-[#8B5CF6]" />
              <p className="text-xs font-semibold text-white">{act.title}</p>
              <p className="text-[11px] text-slate-400 leading-tight">{act.desc}</p>
              <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
