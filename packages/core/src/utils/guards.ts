import type { TrackedRepo, ThemeMode } from '../types/domain';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isTrackedRepo(value: unknown): value is TrackedRepo {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.fullName === 'string' &&
    typeof value.name === 'string' &&
    typeof value.ownerLogin === 'string' &&
    typeof value.url === 'string' &&
    typeof value.trackedAt === 'string'
  );
}

export function isTrackedRepoList(value: unknown): value is TrackedRepo[] {
  return Array.isArray(value) && value.every(isTrackedRepo);
}

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark';
}

export function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}
