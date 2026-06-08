import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QueryRequest } from '../types/ciw.types';
import useCIWStore from '../store/ciwStore';

const CIWSearchBar: React.FC = () => {
  const [value, setValue] = useState('');
  const runQuery = useCIWStore((s) => s.runQuery);
  const isLoading = useCIWStore((s) => s.isLoading);
  const isError = useCIWStore((s) => s.isError);
  const clearError = useCIWStore((s) => s.clearError);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    clearError();
    if (!value.trim()) return;
    const query: QueryRequest = {
      id: crypto.randomUUID(),
      source: detectSource(value),
      payload: value.trim(),
      timestamp: new Date().toISOString(),
    };
    try {
      await runQuery(query);
      setValue('');
    } catch (err) {
      // error stored in ciwStore
    }
  };

  return (
    <motion.form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-3 bg-[rgba(5,10,15,0.6)] border border-cyan-700/30 rounded-lg p-2">
          <input
            className="flex-1 bg-transparent outline-none text-cyan-100 placeholder-cyan-400 p-2"
            placeholder="Enter URL, IP, email, username, domain or wallet"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isLoading}
            aria-label="OSINT query"
          />
          <button
            type="submit"
            className="bg-cyan-500/90 text-black px-3 py-2 rounded-md hover:scale-105 transition-transform disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Probing…' : 'Probe'}
          </button>
        </div>
        {isError && <div className="text-sm text-red-300">{isError}</div>}
      </div>
    </motion.form>
  );
};

function detectSource(val: string): QueryRequest['source'] {
  const trimmed = val.trim();
  if (/^https?:\/\//i.test(trimmed) || /\./.test(trimmed) && /\//.test(trimmed)) return 'url';
  if (/^\d+\.\d+\.\d+\.\d+$/.test(trimmed)) return 'ip';
  if (/@[a-z0-9.-]+$/i.test(trimmed)) return 'email';
  if (/^\+?[0-9 \-()]{7,20}$/.test(trimmed)) return 'mobile';
  if (/^0x[a-f0-9]{40}$/i.test(trimmed)) return 'wallet';
  if (/^[\w.-]{3,}$/.test(trimmed)) return 'username';
  return 'username';
}

export default CIWSearchBar;
