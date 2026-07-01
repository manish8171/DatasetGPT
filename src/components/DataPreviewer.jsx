import React, { useState } from 'react';
import { X, Table, BarChart2, AlertCircle, FileText, ChevronLeft, ChevronRight, Hash, Download } from 'lucide-react';

export default function DataPreviewer({ profileData, onClose }) {
  const [activeTab, setActiveTab] = useState('table'); // 'table', 'columns', 'stats'
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  if (!profileData) return null;

  const { filename, rows, columns_count, columns, sample_data, summary_stats, missing_values } = profileData;

  const totalPages = Math.ceil((sample_data?.length || 0) / rowsPerPage);
  const paginatedData = sample_data ? sample_data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage) : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fadeIn">
      <div className="glass-panel w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden border border-white/20 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10 border border-white/20 text-white">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {filename}
                <span className="badge badge-kaggle text-xs">{columns_count} columns</span>
                <span className="badge badge-gemini text-xs">{rows} preview rows</span>
              </h3>
              <p className="text-xs text-slate-400">Interactive Exploratory Data Analysis & Profile</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {profileData.file_path && (
              <a
                href={`/api/datasets/download-file?file_path=${encodeURIComponent(profileData.file_path)}`}
                download
                className="btn-primary text-xs py-1.5 px-3.5 bg-white text-slate-950 hover:bg-slate-200 shadow-lg shadow-white/10 flex items-center gap-1.5 font-bold"
              >
                <Download size={14} />
                Download File
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all border border-white/15"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2 border-b border-white/10 bg-black/20 flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'table' ? 'bg-white text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table size={14} />
            Data Table
          </button>

          <button
            onClick={() => setActiveTab('columns')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'columns' ? 'bg-white text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hash size={14} />
            Column Schema & Missing Data ({columns?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'stats' ? 'bg-white text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 size={14} />
            Numeric Summary Stats
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-6 bg-black/20">
          {activeTab === 'table' && (
            <div className="flex flex-col h-full justify-between">
              <div className="overflow-x-auto rounded-xl border border-white/10 shadow-lg bg-black/40">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/10 text-slate-200 font-semibold border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 border-r border-white/10 w-12 text-center">#</th>
                      {columns.map((col, idx) => (
                        <th key={idx} className="px-4 py-3 border-r border-white/10 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-white font-bold">{col.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{col.dtype}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200 font-mono">
                    {paginatedData.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-white/5 transition-all">
                        <td className="px-4 py-2 text-center text-slate-500 border-r border-white/10">
                          {(currentPage - 1) * rowsPerPage + rIdx + 1}
                        </td>
                        {columns.map((col, cIdx) => (
                          <td key={cIdx} className="px-4 py-2 whitespace-nowrap max-w-xs truncate border-r border-white/10">
                            {row[col.name] !== null && row[col.name] !== undefined ? String(row[col.name]) : <span className="text-rose-400 italic">null</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 text-xs text-slate-400">
                <span>Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, sample_data.length)} of {sample_data.length} preview rows</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 border border-white/10"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-semibold text-white">Page {currentPage} of {totalPages}</span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 border border-white/10"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'columns' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {columns.map((col, idx) => (
                <div key={idx} className="glass-card p-4 flex flex-col justify-between border border-white/15 shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-sm">{col.name}</span>
                      <span className="badge badge-kaggle text-[10px]">{col.dtype}</span>
                    </div>

                    <div className="space-y-2 mt-3">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Missing values:</span>
                        <span className={col.null_count > 0 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                          {col.null_count} ({col.null_percentage}%)
                        </span>
                      </div>

                      {/* Visual Null Bar */}
                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden border border-white/10">
                        <div
                          className="bg-amber-400 h-full rounded-full"
                          style={{ width: `${col.null_percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              {Object.keys(summary_stats).length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No numeric columns available in this preview to compute statistics.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(summary_stats).map(([colName, stat], idx) => (
                    <div key={idx} className="glass-card p-4 border border-white/15 shadow-md">
                      <h4 className="font-bold text-white text-sm mb-3 flex items-center justify-between">
                        <span>{colName}</span>
                        <span className="badge badge-gemini text-[10px]">Numeric</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-white/5 border border-white/10">
                          <span className="text-slate-400 block">Min</span>
                          <span className="font-mono text-white font-semibold">{stat.min ?? 'N/A'}</span>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/10">
                          <span className="text-slate-400 block">Max</span>
                          <span className="font-mono text-white font-semibold">{stat.max ?? 'N/A'}</span>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/10">
                          <span className="text-slate-400 block">Mean</span>
                          <span className="font-mono text-slate-200 font-semibold">{stat.mean !== null ? stat.mean.toFixed(4) : 'N/A'}</span>
                        </div>
                        <div className="p-2 rounded bg-white/5 border border-white/10">
                          <span className="text-slate-400 block">Std Dev</span>
                          <span className="font-mono text-slate-200 font-semibold">{stat.std !== null ? stat.std.toFixed(4) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
