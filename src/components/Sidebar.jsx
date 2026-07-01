import React, { useState } from 'react';
import {
  Plus,
  Search,
  MessageSquare,
  Folder,
  Settings,
  Database,
  Code,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  LayoutDashboard,
  UploadCloud,
  BarChart2,
  PieChart,
  FileText,
  History,
  Bookmark,
  Layers
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'datasets', label: 'Datasets', icon: Database },
  { id: 'upload', label: 'Upload Dataset', icon: UploadCloud },
  { id: 'analysis', label: 'AI Analysis', icon: Sparkles },
  { id: 'visualizations', label: 'Visualizations', icon: PieChart },
  { id: 'chat', label: 'Query / Chat', icon: MessageSquare },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'history', label: 'History', icon: History },
  { id: 'saved', label: 'Saved Projects', icon: Bookmark },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({
  isOpen,
  onToggle,
  onNewChat,
  onOpenSettings,
  chats = [],
  activeChatId,
  onSelectChat,
  onDeleteChat,
  currentTab,
  onSelectTab
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={`h-full flex flex-col bg-[#0D101C] border-r border-white/10 transition-all duration-300 relative z-20 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Sidebar Header & Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        {isOpen && (
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#6366F1] flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Sparkles size={16} className="text-white font-bold" />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">DatasetGPT</span>
          </div>
        )}

        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all mx-auto"
          title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
        >
          {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
      </div>

      {/* New Analysis / New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className={`w-full flex items-center justify-center gap-2.5 py-3 px-4 pill-active font-bold text-xs transition-all ${
            !isOpen ? 'px-0 rounded-2xl' : ''
          }`}
          title="New Analysis"
        >
          <Plus size={16} className="text-white stroke-[2.5]" />
          {isOpen && <span>+ New Analysis</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 py-2">
        <div>
          {isOpen && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Workspace Navigation
            </p>
          )}
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const IconComp = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'settings') onOpenSettings();
                    else if (onSelectTab) onSelectTab(item.id);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-full text-xs flex items-center gap-3 transition-all ${
                    isActive
                      ? 'pill-active font-semibold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  } ${!isOpen ? 'justify-center px-0' : ''}`}
                  title={item.label}
                >
                  <IconComp size={15} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {isOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Chats Section */}
        {isOpen && chats.length > 0 && (
          <div className="pt-3 border-t border-white/5">
            <div className="px-3 flex items-center justify-between mb-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Recent Conversations ({chats.length})
              </p>
            </div>
            <div className="space-y-0.5">
              {filteredChats.slice(0, 5).map((chat) => {
                const isActive = activeChatId === chat.id;
                return (
                  <div
                    key={chat.id}
                    className={`group relative w-full flex items-center justify-between px-3.5 py-2 rounded-full text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/10 text-white font-medium border border-white/15'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                    onClick={() => {
                      if (onSelectTab) onSelectTab('chat');
                      onSelectChat(chat.id);
                    }}
                  >
                    <div className="flex items-center gap-2.5 truncate flex-1 mr-2">
                      <MessageSquare size={13} className={`flex-shrink-0 ${isActive ? 'text-[#8B5CF6]' : 'text-slate-500'}`} />
                      <span className="truncate">{chat.title}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-all"
                      title="Delete Chat"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Summary */}
      <div className="p-3 border-t border-white/5">
        <div
          className={`p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2.5 ${
            !isOpen ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#6366F1] flex items-center justify-center flex-shrink-0 font-bold text-xs text-white shadow-md">
            M
          </div>
          {isOpen && (
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">Manish</p>
              <p className="text-[10px] text-slate-400 truncate">DatasetGPT Pro</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
