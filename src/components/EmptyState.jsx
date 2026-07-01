import React from 'react';
import { Sparkles, Database, Code, Search, FileSpreadsheet, ArrowRight, Brain, Cpu } from 'lucide-react';
import RecentDatasetsSection from './RecentDatasetsSection';
import AnalyticsCards from './AnalyticsCards';
import AIInsightsPanel from './AIInsightsPanel';
import VisualizationArea from './VisualizationArea';

export default function EmptyState({ onSelectPrompt }) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 animate-slide-up">
      {/* Top Greeting */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-2 relative overflow-hidden bg-gradient-to-r from-[#8B5CF6]/10 via-transparent to-transparent shadow-xl">
        <div className="flex items-center gap-2">
          <span className="badge badge-purple text-[10px]">DatasetGPT AI Laboratory</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Good evening, <span className="text-[#8B5CF6]">Manish</span>
        </h1>
        <p className="text-sm font-semibold text-slate-200">Explore your data with AI</p>
        <p className="text-xs text-slate-400 max-w-lg">
          Upload a dataset, ask questions, discover patterns, and generate automated insights.
        </p>
      </div>

      {/* Recent Datasets Card Section with Subtle Status Indicators */}
      <RecentDatasetsSection onSelectPrompt={onSelectPrompt} />

      {/* Analytics Metric Cards Grid */}
      <AnalyticsCards />

      {/* AI Insights Discoveries Section */}
      <AIInsightsPanel onSelectPrompt={onSelectPrompt} />

      {/* Data Visualization Workspace */}
      <VisualizationArea onSelectPrompt={onSelectPrompt} />
    </div>
  );
}
