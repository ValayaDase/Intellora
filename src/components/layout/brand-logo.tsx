import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function BrandLogo({ size = 'md', showTagline = false }: BrandLogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-3xl font-bold tracking-tight',
  };

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group select-none">
      <div
        className={`${iconSizes[size]} rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors`}
      >
        {/* Clean geometric graph node glyph */}
        <svg viewBox="0 0 24 24" fill="none" className="w-5/6 h-5/6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="6" r="2.5" />
          <circle cx="12" cy="18" r="2.5" />
          <path d="M8.2 7.2L15.8 7.2" strokeDasharray="2 2" />
          <path d="M7.4 8.2L10.6 15.8" />
          <path d="M16.6 8.2L13.4 15.8" />
        </svg>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className={`${textSizes[size]} text-slate-900 group-hover:text-blue-600 transition-colors`}>
            Relate
          </span>
          <span className={`${textSizes[size]} text-blue-600`}>RAG</span>
        </div>
        {showTagline && (
          <span className="text-xs text-slate-500 font-normal">Cross-Lingual Relationship Discovery</span>
        )}
      </div>
    </Link>
  );
}
