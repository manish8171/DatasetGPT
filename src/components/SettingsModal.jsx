import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function SettingsModal({ isOpen, onClose, onSaveSuccess }) {
  const [kaggleUsername, setKaggleUsername] = useState('');
  const [kaggleKey, setKaggleKey] = useState('');
  const [kaggleApiToken, setKaggleApiToken] = useState('');
  const [ashnaApiKey, setAshnaApiKey] = useState('');
  const [status, setStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
    }
  }, [isOpen]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get('/api/settings/status');
      setStatus(res.data);
      if (res.data.kaggle_username) setKaggleUsername(res.data.kaggle_username);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg(null);
    try {
      const res = await axios.post('/api/settings/keys', {
        kaggle_username: kaggleUsername.trim() || undefined,
        kaggle_key: kaggleKey.trim() || undefined,
        kaggle_api_token: kaggleApiToken.trim() || undefined,
        ashna_api_key: ashnaApiKey.trim() || undefined
      });
      setMsg({ type: 'success', text: 'API Credentials updated successfully!' });
      fetchStatus();
      if (onSaveSuccess) onSaveSuccess();
    } catch (e) {
      setMsg({ type: 'error', text: 'Failed to save settings: ' + (e.response?.data?.detail || e.message) });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg overflow-hidden border border-white/20 shadow-2xl animate-slide-up">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Key className="text-white" size={20} />
            <h3 className="text-lg font-bold text-white">API Key & Credentials Configuration</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {msg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${msg.type === 'success' ? 'bg-white/10 text-white border border-white/20' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}`}>
              {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{msg.text}</span>
            </div>
          )}

          {/* Status Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${status?.kaggle_authenticated ? 'bg-white/10 border-white/20 text-white' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`}>
              <span>Kaggle API</span>
              <span className="font-bold">{status?.kaggle_authenticated ? 'Authenticated' : 'Unauthenticated'}</span>
            </div>
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${status?.has_ashna_key ? 'bg-white/10 border-white/20 text-white' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'}`}>
              <span>Ashna AI API</span>
              <span className="font-bold">{status?.has_ashna_key ? 'Active' : 'Missing Key'}</span>
            </div>
          </div>

          {/* Kaggle Credentials */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                Kaggle API Token / Credentials
              </label>
              <a
                href="https://www.kaggle.com/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-slate-300 hover:underline flex items-center gap-1 font-semibold"
              >
                Get Kaggle Key <ExternalLink size={10} />
              </a>
            </div>
            <input
              type="password"
              placeholder="Kaggle API Token (e.g. KGAT_57c94...)"
              value={kaggleApiToken}
              onChange={(e) => setKaggleApiToken(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-white/50 outline-none"
            />
          </div>

          {/* Ashna AI API Key */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                Ashna AI API Key
              </label>
            </div>
            <input
              type="password"
              placeholder="Ashna AI API Key (juTblif...)"
              value={ashnaApiKey}
              onChange={(e) => setAshnaApiKey(e.target.value)}
              className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-white/50 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="btn-primary text-xs">
              <ShieldCheck size={14} />
              {isSaving ? 'Saving...' : 'Save Credentials'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
