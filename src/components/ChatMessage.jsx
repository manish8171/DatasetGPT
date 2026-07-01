import React, { useState } from 'react';
import {
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Edit2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Terminal,
  Database
} from 'lucide-react';
import DatasetCard from './DatasetCard';
import CopyCodeButton from './CopyCodeButton';

const processMarkdownContent = (part) => {
  let content = part;

  // 1. Process Markdown Tables into Styled HTML Glass Tables
  const tableRegex = /((?:\|[^\n]+\|\n?){2,})/g;
  content = content.replace(tableRegex, (tableMatch) => {
    const lines = tableMatch.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return tableMatch;

    const headers = lines[0].split('|').map(c => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1);
    const hasSeparator = lines[1].includes('---');
    const dataRows = hasSeparator ? lines.slice(2) : lines.slice(1);

    if (headers.length === 0) return tableMatch;

    const ths = headers
      .map(h => `<th class="px-3.5 py-2.5 font-bold border-b border-white/15 text-[#8B5CF6] uppercase tracking-wider text-[11px] font-mono">${h}</th>`)
      .join('');
    
    const trs = dataRows
      .map(row => {
        const cells = row.split('|').map(c => c.trim()).filter((_, i, a) => i > 0 && i < a.length - 1);
        const tds = cells
          .map(c => {
            // Check if cell contains source badges or links
            let formattedCell = c
              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#8B5CF6] underline hover:text-white">$1</a>');
            return `<td class="px-3.5 py-2.5 border-b border-white/5 text-slate-200 text-xs font-medium">${formattedCell}</td>`;
          })
          .join('');
        return `<tr class="hover:bg-white/5 transition-colors">${tds}</tr>`;
      })
      .join('');

    return `\n<div class="my-3 overflow-x-auto rounded-2xl border border-white/15 bg-black/40 shadow-lg backdrop-blur-md"><table class="w-full text-left text-xs border-collapse"><thead class="bg-white/10"><tr>${ths}</tr></thead><tbody class="divide-y divide-white/5">${trs}</tbody></table></div>\n`;
  });

  // 2. Process Headings, Formatting, Inline Code, and Links
  const html = content
    .replace(/### (.*?)\n/g, '<h3 class="text-sm font-bold text-white mt-3 mb-1.5">$1</h3>')
    .replace(/## (.*?)\n/g, '<h2 class="text-base font-bold text-white mt-4 mb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-400">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-[#8B5CF6] font-mono text-[11px] border border-white/10">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#8B5CF6] underline hover:text-white font-medium">$1</a>')
    .replace(/\n/g, '<br/>');

  return html;
};

const renderFormattedText = (text) => {
  if (!text) return null;

  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-3 text-xs md:text-sm leading-relaxed text-[#F3F4F6] break-words">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const match = part.match(/^```(\w+)?\n([\s\S]*?)```$/);
          const lang = match ? match[1] || 'code' : 'code';
          const codeContent = match ? match[2].trim() : part.replace(/```/g, '').trim();

          return (
            <div key={index} className="my-3 rounded-2xl bg-[#080A12] border border-white/10 overflow-hidden shadow-lg">
              <div className="px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-[#8B5CF6] font-bold">
                  <Terminal size={12} />
                  {lang}
                </span>
                <CopyCodeButton text={codeContent} />
              </div>
              <pre className="p-4 text-xs font-mono text-[#F3F4F6] overflow-x-auto">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        return (
          <div
            key={index}
            className="py-0.5"
            dangerouslySetInnerHTML={{ __html: processMarkdownContent(part) }}
          />
        );
      })}
    </div>
  );
};

export default function ChatMessage({
  message,
  onDownloadDataset,
  downloadingRef,
  onSelectPreview,
  onRegenerate,
  onEditUserMsg
}) {
  const { sender, text, actions, datasets, preview_data } = message;
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null);
  const [showTools, setShowTools] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 ${sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      {sender === 'bot' && (
        <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/30 to-[#6366F1]/30 border border-[#8B5CF6]/40 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
          <Bot size={18} className="text-[#8B5CF6]" />
        </div>
      )}

      <div className={`max-w-3xl space-y-2.5 ${sender === 'user' ? 'items-end' : 'items-start'}`}>
        {/* Header Metadata */}
        {sender === 'bot' && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-white">DatasetGPT AI</span>
            <span className="badge badge-purple text-[10px] font-mono">Ashna AI</span>
          </div>
        )}

        {/* Compact Expandable Tool Activity Card */}
        {actions && actions.length > 0 && (
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden text-xs">
            <button
              onClick={() => setShowTools(!showTools)}
              className="w-full px-3.5 py-2 flex items-center justify-between text-slate-400 hover:text-white font-mono text-[11px] transition-all bg-black/20"
            >
              <span className="flex items-center gap-2">
                <Sparkles size={13} className="text-[#8B5CF6]" />
                {actions.length} Tool execution(s) completed
              </span>
              {showTools ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showTools && (
              <div className="p-3 space-y-1.5 border-t border-white/10 bg-black/40 font-mono text-[11px]">
                {actions.map((act, i) => (
                  <div key={i} className="text-slate-300 flex items-center gap-2">
                    <span className="text-[#8B5CF6]">›</span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content Bubble matching DatasetGPT dark purple theme */}
        <div
          className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed relative group break-words ${
            sender === 'user'
              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] border border-white/20 text-white rounded-tr-none shadow-lg shadow-purple-500/25'
              : 'bg-[#0D101C] border border-white/10 text-[#F3F4F6] rounded-tl-none shadow-md backdrop-blur-md'
          }`}
        >
          {renderFormattedText(text)}

          {/* User Edit Trigger */}
          {sender === 'user' && onEditUserMsg && (
            <button
              onClick={() => onEditUserMsg(text)}
              className="absolute -left-8 top-3 p-1 rounded-full hover:bg-white/10 text-slate-400 opacity-0 group-hover:opacity-100 transition-all"
              title="Edit message"
            >
              <Edit2 size={13} />
            </button>
          )}
        </div>

        {/* Dataset Cards Grid */}
        {datasets && datasets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 animate-slide-up">
            {datasets.map((d, dIdx) => (
              <DatasetCard
                key={dIdx}
                dataset={d}
                onDownload={onDownloadDataset}
                isDownloading={downloadingRef === d.ref}
              />
            ))}
          </div>
        )}

        {/* Dataset Preview Trigger Card */}
        {preview_data && (
          <div className="mt-3 p-3.5 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-between shadow-md backdrop-blur-md animate-slide-up">
            <div className="flex items-center gap-2.5">
              <Database className="text-[#8B5CF6]" size={18} />
              <div>
                <p className="text-xs font-semibold text-white">Dataset Profile Ready ({preview_data.filename})</p>
                <p className="text-[11px] text-[#A596A3]">{preview_data.rows} rows • {preview_data.columns_count} columns</p>
              </div>
            </div>
            <button
              onClick={() => onSelectPreview(preview_data)}
              className="btn-primary text-xs py-1.5 px-3.5"
            >
              Inspect Data Table
            </button>
          </div>
        )}

        {/* Bot Action Bar */}
        {sender === 'bot' && (
          <div className="flex items-center gap-1.5 pt-1 text-slate-400 text-xs">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all"
              title="Copy Response"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>

            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all"
                title="Regenerate Response"
              >
                <RefreshCw size={14} />
              </button>
            )}

            <button
              onClick={() => setLiked(liked === 'up' ? null : 'up')}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-all ${
                liked === 'up' ? 'text-emerald-400 bg-white/10' : 'hover:text-white'
              }`}
              title="Good response"
            >
              <ThumbsUp size={14} />
            </button>

            <button
              onClick={() => setLiked(liked === 'down' ? null : 'down')}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-all ${
                liked === 'down' ? 'text-rose-400 bg-white/10' : 'hover:text-white'
              }`}
              title="Bad response"
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>

      {sender === 'user' && (
        <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#6366F1] flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
}
