import React, { useState, useEffect } from 'react';
import { Folder, FileText, Database, HardDrive, Eye, RefreshCw, Layers, Download, Archive, Package } from 'lucide-react';
import axios from 'axios';

export default function FileExplorer({ onSelectFile, refreshTrigger }) {
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('/api/datasets/files');
      setDatasets(res.data.datasets || []);
    } catch (e) {
      console.error('Failed to list extracted files:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel border border-white/15 overflow-hidden shadow-2xl">
      {/* Header with Global Download All Datasets ZIP Button */}
      <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6]">
            <Folder size={18} />
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">Extracted Workspace Datasets</h3>
            <p className="text-xs text-slate-400">{datasets.length} dataset folder(s) ready for analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {datasets.length > 0 && (
            <a
              href="/api/datasets/download-all-zip"
              download="DatasetGPT_All_Extracted_Datasets.zip"
              className="btn-primary text-xs py-2 px-4 font-bold flex items-center gap-2 shadow-lg shadow-purple-500/30 rounded-full"
              title="Zip and download all extracted datasets in one archive"
            >
              <Package size={15} />
              <span>Download All Datasets (ZIP)</span>
            </a>
          )}

          <button
            onClick={fetchFiles}
            disabled={isLoading}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all border border-white/15"
            title="Refresh extracted files"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {datasets.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Layers size={36} className="mx-auto opacity-40 text-[#8B5CF6] animate-float" />
            <p className="text-sm font-semibold text-white">No extracted datasets found yet.</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Use the AI Chat or dataset search to extract datasets directly from Kaggle & UCI ML Repository.
            </p>
          </div>
        ) : (
          datasets.map((ds, idx) => (
            <div key={idx} className="glass-card p-4 rounded-2xl space-y-3 border border-white/15 animate-slide-up shadow-md">
              {/* Folder Header with Folder-Specific ZIP Download Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Database size={15} className="text-[#8B5CF6]" />
                    {ds.dataset_ref}
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                    <HardDrive size={11} className="text-slate-500" />
                    {ds.human_total_size} • {ds.file_count} file(s)
                  </p>
                </div>

                {/* Download All Files in this Folder as single ZIP button */}
                <a
                  href={`/api/datasets/download-folder-zip?folder_name=${encodeURIComponent(ds.folder_name)}`}
                  download={`${ds.folder_name}.zip`}
                  className="btn-secondary text-xs py-1.5 px-3.5 rounded-full flex items-center gap-1.5 font-bold hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 hover:text-white transition-all shadow-sm"
                  title="Download all files in this dataset as a single ZIP archive"
                >
                  <Archive size={14} className="text-[#8B5CF6]" />
                  <span>Download All (ZIP)</span>
                </a>
              </div>

              {/* List Individual Files */}
              <div className="space-y-1 pt-1">
                {ds.files.map((file, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 text-xs group transition-all"
                  >
                    <div className="flex items-center gap-2.5 truncate flex-1 pr-2">
                      <FileText size={13} className={file.ext === '.csv' ? 'text-[#8B5CF6]' : 'text-slate-400'} />
                      <span className="text-slate-200 text-xs truncate font-medium">{file.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[11px] text-slate-400 font-mono mr-1">{file.human_size}</span>
                      {['.csv', '.json', '.tsv', '.parquet'].includes(file.ext) && (
                        <button
                          onClick={() => onSelectFile(file.full_path)}
                          className="px-2.5 py-1 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/15 flex items-center gap-1 text-[11px] font-medium"
                          title="Inspect Data Table"
                        >
                          <Eye size={12} className="text-[#8B5CF6]" />
                          <span>Inspect</span>
                        </button>
                      )}
                      <a
                        href={`/api/datasets/download-file?file_path=${encodeURIComponent(file.full_path)}`}
                        download
                        className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 border border-white/15 transition-all"
                        title="Download single file"
                      >
                        <Download size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
