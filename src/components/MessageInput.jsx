import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Globe,
  Brain,
  ChevronDown,
  Cpu,
  Mic,
  Sparkles,
  BarChart2,
  Lightbulb,
  Eraser,
  HelpCircle
} from 'lucide-react';

const MODELS = [
  { id: 'ashnaai', name: 'Ashna AI (Default)', desc: 'Multimodal dataset agent' },
  { id: 'gemini-2.5', name: 'Gemini 2.5 Flash', desc: 'Ultra-fast reasoning' },
  { id: 'claude-3.5', name: 'Claude 3.5 Sonnet', desc: 'Complex analysis' },
  { id: 'gpt-4o', name: 'GPT-4o', desc: 'General AI' },
];

const QUICK_ACTIONS = [
  { label: 'Analyze Dataset', prompt: 'Perform complete automated statistical analysis on the current dataset', icon: Sparkles },
  { label: 'Generate Chart', prompt: 'Generate interactive visualization chart for monthly revenue trends', icon: BarChart2 },
  { label: 'Find Insights', prompt: 'Discover hidden correlations and anomalies in the data', icon: Lightbulb },
  { label: 'Clean Data', prompt: 'Check missing value percentage and apply median imputation', icon: Eraser },
  { label: 'Ask a Question', prompt: 'What are the top features correlated with target outcome?', icon: HelpCircle },
];

export default function MessageInput({
  onSendMessage,
  isLoading,
  selectedModel,
  onSelectModel,
  isSearchEnabled,
  onToggleSearch,
  isReasoningEnabled,
  onToggleReasoning
}) {
  const [input, setInput] = useState('');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const activeModelObj = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  return (
    <div className="p-4 bg-[#0D101C]/90 backdrop-blur-xl border-t border-white/10 relative z-10">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Quick Action Glass Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {QUICK_ACTIONS.map((action, idx) => {
            const IconComp = action.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSendMessage(action.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white whitespace-nowrap transition-all shadow-sm"
              >
                <IconComp size={13} className="text-[#8B5CF6]" />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>

        {/* Controls Bar (Model Selector & Feature Toggles) */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowModelPicker(!showModelPicker)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full pill-inactive text-xs font-semibold"
            >
              <Cpu size={13} className="text-[#8B5CF6]" />
              <span>{activeModelObj.name}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {showModelPicker && (
              <div className="absolute bottom-full mb-2 left-0 w-60 rounded-2xl bg-[#0D101C] border border-white/15 p-2 shadow-2xl z-30 space-y-1 animate-slide-up">
                <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select AI Model</p>
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m.id);
                      setShowModelPicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex flex-col ${
                      selectedModel === m.id
                        ? 'pill-active font-semibold'
                        : 'text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{m.name}</span>
                    <span className="text-[10px] text-slate-400">{m.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleSearch}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                isSearchEnabled ? 'pill-active' : 'pill-inactive'
              }`}
            >
              <Globe size={13} />
              <span>Multi-Hub Search</span>
            </button>

            <button
              type="button"
              onClick={onToggleReasoning}
              className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all ${
                isReasoningEnabled ? 'pill-active' : 'pill-inactive'
              }`}
            >
              <Brain size={13} />
              <span>Deep Reasoning</span>
            </button>
          </div>
        </div>

        {/* Input Box Command Center Container */}
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-white/5 border border-white/15 rounded-3xl p-3 shadow-2xl focus-within:border-[#8B5CF6]/60 transition-all">
          <button
            type="button"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1 text-xs"
            title="Attach dataset file"
          >
            <Paperclip size={18} />
            <span className="hidden sm:inline text-[11px]">Attach dataset</span>
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask DatasetGPT anything about your data..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 outline-none resize-none py-1 px-2 max-h-36 font-sans"
            disabled={isLoading}
          />

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all"
              title="Voice input"
            >
              <Mic size={18} />
            </button>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn-primary px-4 py-2.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed shadow-lg flex items-center gap-1.5 font-bold text-xs"
            >
              <Sparkles size={15} />
              <span>Ask DatasetGPT</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
