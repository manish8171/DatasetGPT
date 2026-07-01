import React, { useState, useEffect } from 'react';
import { Cpu, Sparkles, Search, Database, Activity } from 'lucide-react';

const THINKING_STEPS = [
  { icon: Cpu, text: 'Connecting to Ashna AI Neural Core...' },
  { icon: Search, text: 'Querying Kaggle & UCI ML Repositories...' },
  { icon: Database, text: 'Extracting tabular metadata & schemas...' },
  { icon: Activity, text: 'Profiling missing values & data columns...' },
  { icon: Sparkles, text: 'Synthesizing ML recommendations & insights...' }
];

export default function ThinkingLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % THINKING_STEPS.length);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = THINKING_STEPS[stepIndex].icon;

  return (
    <div className="flex gap-3 justify-start animate-slide-up">
      {/* Animated Glowing AI Orb Avatar */}
      <div className="relative w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/30 to-[#6366F1]/30 border border-[#8B5CF6]/50 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-purple-500/20">
        <CurrentIcon size={16} className="text-[#8B5CF6] animate-pulse" />
        <div className="absolute -inset-0.5 rounded-2xl bg-[#8B5CF6]/30 blur-sm -z-10 animate-ping opacity-40"></div>
      </div>

      {/* Futuristic Thinking Container */}
      <div className="p-4 rounded-2xl bg-[#0D101C]/90 border border-white/15 text-[#F3F4F6] text-xs shadow-xl backdrop-blur-xl max-w-md space-y-3">
        {/* Step Indicator with Icon & Cycling Text */}
        <div className="flex items-center gap-2.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping flex-shrink-0"></span>
          <span className="text-[#8B5CF6] font-bold tracking-wide transition-all duration-300">
            {THINKING_STEPS[stepIndex].text}
          </span>
        </div>

        {/* High-Tech Animated Equalizer Spectrum Waveform */}
        <div className="flex items-center gap-1.5 pt-1">
          <div className="w-1.5 h-4 bg-gradient-to-t from-[#8B5CF6] to-[#6366F1] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-6 bg-gradient-to-t from-[#8B5CF6] to-[#6366F1] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-3 bg-gradient-to-t from-[#8B5CF6] to-[#6366F1] rounded-full animate-bounce"></div>
          <div className="w-1.5 h-5 bg-gradient-to-t from-[#8B5CF6] to-[#6366F1] rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          <div className="w-1.5 h-2.5 bg-gradient-to-t from-[#8B5CF6] to-[#6366F1] rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <span className="text-[10px] text-slate-400 font-mono ml-2 uppercase tracking-widest">
            Processing Tokens...
          </span>
        </div>
      </div>
    </div>
  );
}
