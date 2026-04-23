import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  suffix?: string;
}

export function Input({ error, suffix, className = '', ...props }: InputProps) {
  const base = `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all ${
    error
      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
  }`;

  if (suffix) {
    return (
      <div className="relative">
        <input className={`${base} pr-8 ${className}`} {...props} />
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-gray-400">
          {suffix}
        </span>
      </div>
    );
  }

  return <input className={`${base} ${className}`} {...props} />;
}
