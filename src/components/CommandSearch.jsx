import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Database, Code, FileText, X, ArrowRight } from 'lucide-react';

export default function CommandSearch({ isOpen, onClose, onSelectPrompt }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const COMMANDS = [
    { icon: Database, label: 'Search UCI Machine Learning Repository', prompt: 'search dataset for topic heart disease from UCI', cat: 'Datasets' },
    { icon: Sparkles, label: 'Run Automated EDA on heart.csv', prompt: 'Run automated EDA on downloaded heart.csv dataset', cat: 'Analysis' },
    { icon: Code, label: 'Generate Baseline Classification Model', prompt: 'Search for customer churn datasets and give me EDA python code', cat: 'Code' },
    { icon: FileText, label: 'Export Data Summary & Insights Report', prompt: 'Show revenue trend chart and monthly comparison breakdown', cat: 'Reports' }
  ];

  const filtered = COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="w-full max-w-xl bg-[#0D101C] border border-white/15 rounded-3xl shadow-2xl overflow-hidden space-y-2">
        {/* Search Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search size={18} className="text-[#8B5CF6]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search datasets, analyses, or ask DatasetGPT..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none font-sans"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>

        {/* Command List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          <p className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Quick Actions & Datasets
          </p>
          {filtered.map((cmd, idx) => {
            const IconComp = cmd.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  onSelectPrompt(cmd.prompt);
                  onClose();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-2xl hover:bg-white/5 text-xs text-white flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <IconComp size={15} className="text-[#8B5CF6]" />
                  <span>{cmd.label}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono">
                  <span>{cmd.cat}</span>
                  <ArrowRight size={12} className="group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>Navigate with <kbd className="px-1 bg-white/10 rounded">↑</kbd> <kbd className="px-1 bg-white/10 rounded">↓</kbd></span>
          <span>Press <kbd className="px-1 bg-white/10 rounded">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
