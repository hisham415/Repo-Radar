const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const relativeFormatter = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

const RELATIVE_UNITS: ReadonlyArray<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 1000 * 60 * 60 * 24 * 365],
  ['month', 1000 * 60 * 60 * 24 * 30],
  ['week', 1000 * 60 * 60 * 24 * 7],
  ['day', 1000 * 60 * 60 * 24],
  ['hour', 1000 * 60 * 60],
  ['minute', 1000 * 60],
];

export function formatCompactNumber(value: number): string {
  return compactFormatter.format(value);
}

export function formatRelativeDate(iso: string, now: Date = new Date()): string {
  const diff = new Date(iso).getTime() - now.getTime();
  if (Number.isNaN(diff)) return 'unknown';

  const abs = Math.abs(diff);
  for (const [unit, ms] of RELATIVE_UNITS) {
    if (abs >= ms) {
      return relativeFormatter.format(Math.round(diff / ms), unit);
    }
  }
  return 'just now';
}

export function formatAbsoluteDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'unknown';
  return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatCountdown(targetEpochMs: number, now: number = Date.now()): string {
  const remainingSec = Math.max(0, Math.ceil((targetEpochMs - now) / 1000));
  const minutes = Math.floor(remainingSec / 60);
  const seconds = remainingSec % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
