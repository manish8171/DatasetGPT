import React from 'react';
import { Search, Bell, HelpCircle, Settings, User, Sparkles, Folder } from 'lucide-react';

export default function TopBar({ onOpenSettings, currentTab, onOpenCommandSearch }) {
  return (
    <header className="h-14 border-b border-white/10 px-6 flex items-center justify-between bg-[#0D101C]/80 backdrop-blur-xl z-20">
      {/* LEFT: Current workspace / Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#6366F1] flex items-center justify-center shadow-md">
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="font-extrabold text-sm text-white tracking-tight">DatasetGPT</span>
        </div>
        <span className="text-xs text-slate-600">/</span>
        <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
          <Folder size={13} className="text-[#8B5CF6]" />
          <span>Workspace</span>
          <span className="text-slate-600">›</span>
          <span className="text-white capitalize">{currentTab || 'Dashboard'}</span>
        </div>
      </div>

      {/* CENTER: Global Search / Command Palette */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          onClick={onOpenCommandSearch}
          className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-full pl-9 pr-10 py-1.5 text-xs text-left text-slate-400 flex items-center justify-between relative transition-all shadow-inner group"
        >
          <Search size={14} className="absolute left-3.5 top-2.5 text-slate-400 group-hover:text-white" />
          <span className="truncate">Search datasets, analyses, or ask DatasetGPT...</span>
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
            <span>⌘K</span>
          </div>
        </button>
      </div>

      {/* RIGHT: Notifications, Help, Settings, Profile */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all relative"
          title="Notifications"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></span>
        </button>

        <button
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Help & Documentation"
        >
          <HelpCircle size={16} />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          title="Settings & Credentials"
        >
          <Settings size={16} />
        </button>

        <div className="h-4 w-px bg-white/10 mx-1"></div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#6366F1] p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-[#080A12] rounded-full flex items-center justify-center text-xs font-bold text-white">
              M
            </div>
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">Manish</p>
            <p className="text-[10px] text-slate-400 leading-tight">DatasetGPT Pro</p>
          </div>
        </div>
      </div>
    </header>
  );
}
