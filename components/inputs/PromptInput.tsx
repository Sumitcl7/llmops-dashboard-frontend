'use client';

import { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  loading?: boolean;
}

export default function PromptInput({ onSubmit, loading = false }: PromptInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim() || loading) return;
    onSubmit(value.trim());
    setValue('');
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        className="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="Type a query…"
        disabled={loading}
        aria-label="Query prompt"
      />
      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !value.trim()}>
        {loading ? '…' : 'Send'}
      </button>
    </div>
  );
}
