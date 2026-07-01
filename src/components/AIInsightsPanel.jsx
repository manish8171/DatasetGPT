import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, GitCommit, ArrowUpRight } from 'lucide-react';

export default function AIInsightsPanel({ onSelectPrompt }) {
  const INSIGHTS = [
    {
      icon: TrendingUp,
      title: 'Revenue Increased 18.4%',
      desc: 'DatasetGPT detected a significant upward trend in monthly revenue driven by Q3 repeat buyers.',
      confidence: '98% Confidence',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      prompt: 'Show revenue trend chart and monthly comparison breakdown'
    },
    {
      icon: AlertTriangle,
      title: '⚠️ High Missing Values in Customer Age',
      desc: 'Customer age feature contains 14.2% missing records across 17,810 entries.',
      confidence: 'High Severity',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      prompt: 'Clean missing customer age values using median imputation'
    },
    {
      icon: GitCommit,
      title: '✦ Strong Correlation Discovered',
      desc: 'Product category and purchase frequency show a 0.82 Pearson correlation coefficient.',
      confidence: '0.82 Pearson',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      prompt: 'Show correlation heatmap matrix for product categories'
    }
  ];

  return (
    <div className="space-y-3.5 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="text-[#8B5CF6]" size={18} />
          AI Insights & Pattern Discoveries
        </h3>
        <span className="badge badge-purple text-[10px] font-mono">37 Auto Discovered</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INSIGHTS.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div
              key={idx}
              className="glass-card p-4.5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 relative group hover:border-[#8B5CF6]/50 transition-all shadow-md"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#8B5CF6]">
                    <IconComp size={16} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.confidence}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-white group-hover:text-[#8B5CF6] transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
              </div>

              <button
                onClick={() => onSelectPrompt && onSelectPrompt(item.prompt)}
                className="w-full text-left py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-between group/btn transition-all border border-white/10"
              >
                <span>Explore Discovery</span>
                <ArrowUpRight size={14} className="text-slate-400 group-hover/btn:text-[#8B5CF6] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
