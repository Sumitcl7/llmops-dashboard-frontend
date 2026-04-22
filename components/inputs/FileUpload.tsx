'use client';

import { useRef } from 'react';

interface FileUploadProps {
  onUpload: (file: File) => void;
  loading?: boolean;
  accept?: string;
  label?: string;
}

export default function FileUpload({ onUpload, loading = false, accept, label = 'Upload File' }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
        disabled={loading}
        aria-label={label}
      />
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {loading ? '…' : label}
      </button>
    </div>
  );
}
