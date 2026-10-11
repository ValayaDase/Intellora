export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getLanguageLabel(code: string): string {
  switch (code) {
    case 'en':
      return 'English';
    case 'hi':
      return 'Hindi (हिन्दी)';
    case 'mr':
      return 'Marathi (मराठी)';
    case 'auto':
      return 'Auto-Detect';
    default:
      return code.toUpperCase();
  }
}

export function getLanguageBadgeColor(code: string): { bg: string; text: string; border: string } {
  switch (code) {
    case 'hi':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'mr':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'en':
    default:
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
  }
}
