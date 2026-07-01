import React from 'react';
import { Database, ExternalLink, MoreHorizontal, FileSpreadsheet, Sparkles } from 'lucide-react';

export default function RecentDatasetsSection({ onOpenDataset, onSelectPrompt }) {
  const DATASETS = [
    {
      name: 'sales_data.csv',
      status: 'Ready',
      statusColor: 'bg-emerald-500 text-emerald-400 border-emerald-500/40',
      statusDot: 'bg-emerald-400',
      rows: '125,430',
      cols: 18,
      lastAnalyzed: '12 minutes ago',
      source: 'Internal Storage',
      prompt: 'Show summary statistics for sales_data.csv'
    },
    {
      name: 'heart_disease_uci.csv',
      status: 'Analyzing',
      statusColor: 'bg-purple-500 text-purple-300 border-purple-500/40',
      statusDot: 'bg-purple-400 animate-pulse',
      rows: '918',
      cols: 12,
      lastAnalyzed: 'Just now',
      source: 'UCI Repository',
      prompt: 'search dataset for topic cardiovascular disease risk from UCI'
    },
    {
      name: 'customer_churn.csv',
      status: 'Processing',
      statusColor: 'bg-blue-500 text-blue-300 border-blue-500/40',
      statusDot: 'bg-blue-400 animate-ping',
      rows: '45,210',
      cols: 24,
      lastAnalyzed: '2 hours ago',
      source: 'Kaggle Engine',
      prompt: 'Search for customer churn datasets and give me baseline python code'
    }
  ];

  return (
    <div className="space-y-3.5 animate-slide-up">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Database className="text-[#8B5CF6]" size={18} />
          Recent Datasets
        </h3>
        <span className="text-xs text-slate-400 hover:text-white cursor-pointer font-medium">View All Datasets ›</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DATASETS.map((ds, idx) => (
          <div
            key={idx}
            className="glass-card p-4.5 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3 relative group hover:border-[#8B5CF6]/50 transition-all shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet size={16} className="text-[#8B5CF6]" />
                  <h4 className="font-bold text-xs text-white group-hover:text-[#8B5CF6] transition-colors truncate max-w-[140px]">
                    {ds.name}
                  </h4>
                </div>

                {/* Subtle Glowing Status Indicator */}
                <span className={`badge text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${ds.statusColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ds.statusDot}`}></span>
                  {ds.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-mono">
                {ds.rows} rows · {ds.cols} columns
              </p>
              <p className="text-[10px] text-slate-500">
                Last analyzed {ds.lastAnalyzed}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                onClick={() => onSelectPrompt && onSelectPrompt(ds.prompt)}
                className="btn-secondary text-[11px] py-1.5 px-3 rounded-full flex items-center gap-1.5 font-semibold"
              >
                <Sparkles size={12} className="text-[#8B5CF6]" />
                Open Dataset
              </button>

              <button className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                <MoreHorizontal size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
