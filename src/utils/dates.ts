const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export function dateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Parse persisted calendar dates without UTC shifting an ISO date into yesterday. */
export function parseDate(value?: string, fallbackYear?: number): Date | null {
  if (!value) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(value);
  const human = /^(\d{1,2})\s+([a-zA-Z]{3,9})(?:\s+(\d{4}))?$/.exec(value.trim());
  let year: number, month: number, day: number;
  if (iso) {
    [, year, month, day] = iso.map(Number);
    month -= 1;
  } else if (human && (human[3] || fallbackYear)) {
    year = Number(human[3] || fallbackYear);
    month = MONTHS.indexOf(human[2].slice(0, 3).toLowerCase());
    day = Number(human[1]);
  } else return null;
  const result = new Date(year, month, day);
  return month >= 0 && result.getFullYear() === year && result.getMonth() === month && result.getDate() === day ? result : null;
}

export function daysUntil(value: string, now = new Date()): number | null {
  const deadline = parseDate(value);
  if (!deadline) return null;
  return Math.round((Date.UTC(deadline.getFullYear(), deadline.getMonth(), deadline.getDate()) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
}

export function deadlineLabel(value: string, now = new Date()): string {
  const days = daysUntil(value, now);
  if (days === null) return 'No deadline';
  if (days === 0) return 'Due today';
  return days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`;
}

export function formatDate(value: string): string {
  const date = parseDate(value);
  return date ? date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : value;
}

export function relativeTime(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
