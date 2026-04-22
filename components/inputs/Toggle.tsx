'use client';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: '36px',
          height: '20px',
          borderRadius: '10px',
          border: 'none',
          background: checked ? 'var(--accent)' : 'var(--bg-hover)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 150ms ease',
          padding: 0,
        }}
      >
        <span style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '18px' : '2px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 150ms ease',
        }} />
      </button>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </label>
  );
}
