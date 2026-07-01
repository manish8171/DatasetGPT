import React from 'react';
import { Download, ExternalLink, ThumbsUp, HardDrive, Star, Tag } from 'lucide-react';

export default function DatasetCard({ dataset, onDownload, isDownloading, onPreview }) {
  const { ref, title, owner, human_size, vote_count, usability_rating, url, tags, description, source } = dataset;

  const isUCI = source === 'uci' || ref?.startsWith('uci/');

  return (
    <div className="glass-card p-4 flex flex-col justify-between gap-3 border border-white/10 hover:border-[#8B5CF6]/40 rounded-2xl transition-all shadow-md shimmer-hover relative overflow-hidden">
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="font-semibold text-white text-base leading-snug line-clamp-2 hover:text-[#8B5CF6]">
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
              {title}
              <ExternalLink size={14} className="opacity-60 hover:opacity-100 flex-shrink-0" />
            </a>
          </h4>

          {/* Source Badge */}
          <span
            className={`badge flex-shrink-0 text-[10px] uppercase font-bold font-mono px-2.5 py-0.5 rounded-full ${
              isUCI
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-[#8B5CF6]/20 text-[#C084FC] border border-[#8B5CF6]/40'
            }`}
          >
            {isUCI ? 'UCI Repo' : 'Kaggle'}
          </span>
        </div>

        <p className="text-xs text-slate-400 font-mono mb-2">Ref: {ref}</p>

        {description && (
          <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1 font-medium text-white">
            <ThumbsUp size={12} className="text-[#8B5CF6]" />
            {vote_count} votes
          </span>
          <span className="flex items-center gap-1 font-medium text-white">
            <HardDrive size={12} className="text-[#8B5CF6]" />
            {human_size}
          </span>
          <span className="text-slate-400">by <strong className="text-white">{owner}</strong></span>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] text-white flex items-center gap-1 border border-white/15">
                <Tag size={10} className="text-[#8B5CF6]" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
        <button
          onClick={() => onDownload(ref)}
          disabled={isDownloading}
          className="btn-primary text-xs flex-1 justify-center py-2.5 font-bold shadow-lg shadow-purple-500/30 rounded-full"
        >
          <Download size={15} className="font-bold stroke-[2.5]" />
          <span>{isDownloading ? 'Extracting Dataset...' : `Download ${isUCI ? 'UCI Dataset' : 'Kaggle Dataset'}`}</span>
        </button>
      </div>
    </div>
  );
}
