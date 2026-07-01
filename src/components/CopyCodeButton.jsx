import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyCodeButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-[11px] font-mono transition-all"
      title="Copy code to clipboard"
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      <span>{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}
