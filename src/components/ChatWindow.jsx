import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, ArrowRight, Database } from 'lucide-react';
import DatasetCard from './DatasetCard';
import ThinkingLoader from './ThinkingLoader';

const SUGGESTED_PROMPTS = [
  "Find me financial & stock market datasets with CSV files",
  "Search for top machine learning datasets for customer churn",
  "Show me image classification datasets for medical imaging",
  "Download sentiment/imdb-dataset-of-50k-movie-reviews"
];

const renderFormattedText = (text) => {
  if (!text) return null;
  const html = text
    .replace(/### (.*?)\n/g, '<h3 class="text-sm font-bold text-white mt-2 mb-1">$1</h3>')
    .replace(/## (.*?)\n/g, '<h2 class="text-base font-bold text-slate-100 mt-3 mb-1.5">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/40 text-slate-200 font-mono text-[11px] border border-white/15">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-white underline hover:text-slate-300 font-medium">$1</a>')
    .replace(/\n/g, '<br/>');

  return (
    <div
      className="text-xs md:text-sm leading-relaxed text-slate-200"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default function ChatWindow({ messages, onSendMessage, isLoading, onDownloadDataset, downloadingRef, onSelectPreview }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handlePromptClick = (prompt) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full glass-panel overflow-hidden border border-white/15 shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 p-0.5 flex items-center justify-center shadow-lg shadow-black/30">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              KaggleMind AI Assistant
              <span className="badge badge-gemini text-[10px] font-mono">Ashna AI</span>
            </h3>
            <p className="text-xs text-slate-400">Natural language Kaggle dataset extractor & EDA agent</p>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12 animate-slide-up">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/15 shadow-lg shadow-black/40 animate-float">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">How can I help with Kaggle datasets today?</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Ask me to discover, analyze, download, or extract any dataset from Kaggle using simple natural language.
            </p>

            <div className="w-full space-y-2 text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Try these prompts:</p>
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-xs text-slate-200 transition-all flex items-center justify-between group glass-card shimmer-hover"
                >
                  <span>{prompt}</span>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={18} className="text-white" />
                </div>
              )}

              <div className={`max-w-3xl space-y-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-white text-slate-950 font-medium rounded-tr-none shadow-lg shadow-white/10'
                      : 'bg-white/5 border border-white/15 text-slate-100 rounded-tl-none shadow-md backdrop-blur-md'
                  }`}
                >
                  {/* Actions Taken Badges */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mb-3 space-y-1 pb-3 border-b border-white/10">
                      {msg.actions.map((act, i) => (
                        <div key={i} className="text-xs text-slate-200 font-mono flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-md border border-white/10">
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply text formatted */}
                  {renderFormattedText(msg.text)}
                </div>

                {/* Dataset Cards Grid if search returned datasets */}
                {msg.datasets && msg.datasets.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 animate-slide-up">
                    {msg.datasets.map((d, dIdx) => (
                      <DatasetCard
                        key={dIdx}
                        dataset={d}
                        onDownload={onDownloadDataset}
                        isDownloading={downloadingRef === d.ref}
                      />
                    ))}
                  </div>
                )}

                {/* Preview Trigger Button if dataset was extracted */}
                {msg.preview_data && (
                  <div className="mt-3 p-3 rounded-xl bg-white/10 border border-white/20 flex items-center justify-between shadow-md backdrop-blur-md animate-slide-up">
                    <div className="flex items-center gap-2">
                      <Database className="text-white" size={18} />
                      <div>
                        <p className="text-xs font-semibold text-white">Dataset Profile Ready ({msg.preview_data.filename})</p>
                        <p className="text-[11px] text-slate-400">{msg.preview_data.rows} rows • {msg.preview_data.columns_count} columns</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectPreview(msg.preview_data)}
                      className="btn-primary text-xs py-1.5 px-3"
                    >
                      Inspect Data Table
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                  <User size={18} className="text-white" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && <ThinkingLoader />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/30 flex gap-2 backdrop-blur-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask KaggleMind AI (e.g. 'Search for COVID-19 datasets', 'Download dataset owner/slug')..."
          className="flex-1 bg-white/5 border border-white/15 focus:border-white/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="btn-primary px-5 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          <Send size={16} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
