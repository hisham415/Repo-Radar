import { formatCompactNumber, formatCountdown, formatRelativeDate } from './format';

describe('formatCompactNumber', () => {
  it('formats small numbers as-is', () => {
    expect(formatCompactNumber(999)).toBe('999');
  });

  it('formats thousands and millions compactly', () => {
    expect(formatCompactNumber(1500)).toBe('1.5K');
    expect(formatCompactNumber(2_300_000)).toBe('2.3M');
  });
});

describe('formatRelativeDate', () => {
  const now = new Date('2026-01-10T12:00:00Z');

  it('returns "just now" for sub-minute differences', () => {
    expect(formatRelativeDate('2026-01-10T11:59:40Z', now)).toBe('just now');
  });

  it('formats past dates in the largest fitting unit', () => {
    expect(formatRelativeDate('2026-01-10T09:00:00Z', now)).toBe('3 hours ago');
    expect(formatRelativeDate('2026-01-03T12:00:00Z', now)).toBe('last week');
    expect(formatRelativeDate('2024-12-10T12:00:00Z', now)).toBe('last year');
  });

  it('returns "unknown" for invalid input', () => {
    expect(formatRelativeDate('not-a-date', now)).toBe('unknown');
  });
});

describe('formatCountdown', () => {
  it('formats mm:ss with zero padding', () => {
    const now = 1_000_000;
    expect(formatCountdown(now + 65_000, now)).toBe('1:05');
  });

  it('clamps to zero when the target has passed', () => {
    expect(formatCountdown(0, 10_000)).toBe('0:00');
  });
});
