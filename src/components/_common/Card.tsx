import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  headerAction?: ReactNode;
}

export default function Card({ children, className = '', title, headerAction }: CardProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm ${className}`}>
      {(title || headerAction) && (
        <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4">
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
