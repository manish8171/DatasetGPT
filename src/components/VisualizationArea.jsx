import React, { useState } from 'react';
import {
  LineChart as LineIcon,
  BarChart2,
  PieChart as PieIcon,
  Table as TableIcon,
  Download,
  Maximize2,
  Filter,
  Sparkles
} from 'lucide-react';

export default function VisualizationArea({ onSelectPrompt }) {
  const [chartType, setChartType] = useState('bar');
  const [aggregation, setAggregation] = useState('monthly');

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 animate-slide-up">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="text-[#8B5CF6]" size={18} />
            Data Visualization Workspace
          </h3>
          <p className="text-xs text-slate-400">Interactive chart rendering & AI visual analytics</p>
        </div>

        {/* Chart Type Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/10">
          {[
            { id: 'line', label: 'Line', icon: LineIcon },
            { id: 'bar', label: 'Bar', icon: BarChart2 },
            { id: 'pie', label: 'Pie', icon: PieIcon },
            { id: 'table', label: 'Table', icon: TableIcon }
          ].map((type) => {
            const IconComp = type.icon;
            const isSelected = chartType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'pill-active font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <IconComp size={13} />
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-slate-400 font-semibold mr-1">
            <Filter size={13} className="text-[#8B5CF6]" /> Filters:
          </span>

          <select className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white outline-none focus:border-[#8B5CF6]">
            <option value="heart.csv">Dataset: heart.csv (918 rows)</option>
            <option value="sales_data.csv">Dataset: sales_data.csv (125K rows)</option>
          </select>

          <select className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white outline-none focus:border-[#8B5CF6]">
            <option value="age">Column: Age vs Cholesteral</option>
            <option value="revenue">Column: Monthly Revenue</option>
          </select>

          <select
            value={aggregation}
            onChange={(e) => setAggregation(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white outline-none focus:border-[#8B5CF6]"
          >
            <option value="monthly">Monthly Aggregation</option>
            <option value="weekly">Weekly Aggregation</option>
            <option value="daily">Daily Raw Values</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectPrompt && onSelectPrompt('Generate line chart of monthly sales revenue')}
            className="btn-secondary text-xs py-1 px-3 flex items-center gap-1.5"
          >
            <Sparkles size={13} className="text-[#8B5CF6]" />
            AI Chart Query
          </button>
          <button className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10" title="Export Image">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* SVG Chart Visualization Graphic */}
      <div className="p-6 rounded-2xl bg-[#080A12]/80 border border-white/10 h-64 flex flex-col justify-between relative overflow-hidden group">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono font-semibold text-white">Monthly Feature Metrics Comparison</span>
          <span className="badge badge-purple text-[10px]">Active Data Pipeline</span>
        </div>

        {/* SVG Chart Drawing */}
        <div className="w-full h-40 flex items-end justify-between gap-3 pt-4 px-2">
          {[45, 65, 80, 55, 95, 70, 85, 100, 60, 75, 90, 80].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
              <div className="w-full bg-white/5 rounded-t-lg h-36 flex items-end overflow-hidden relative">
                <div
                  className="w-full bg-gradient-to-t from-[#6D28D9] to-[#8B5CF6] rounded-t-lg transition-all duration-500 group-hover/bar:brightness-125"
                  style={{ height: `${h}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-500">M{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
