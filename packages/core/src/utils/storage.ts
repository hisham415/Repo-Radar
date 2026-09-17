interface Envelope<T> {
  version: number;
  data: T;
}

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function resolveStorage(adapter?: StorageAdapter): StorageAdapter | null {
  if (adapter) return adapter;
  if (typeof window === 'undefined' || !window.localStorage) return null;
  return window.localStorage;
}

export function loadFromStorage<T>(
  key: string,
  version: number,
  isValid: (value: unknown) => value is T,
  adapter?: StorageAdapter,
): T | null {
  const storage = resolveStorage(adapter);
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Envelope<unknown>>;
    if (parsed.version !== version || !isValid(parsed.data)) {
      storage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function saveToStorage<T>(
  key: string,
  version: number,
  data: T,
  adapter?: StorageAdapter,
): boolean {
  const storage = resolveStorage(adapter);
  if (!storage) return false;
  try {
    const envelope: Envelope<T> = { version, data };
    storage.setItem(key, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
}

export function removeFromStorage(key: string, adapter?: StorageAdapter): void {
  const storage = resolveStorage(adapter);
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // storage may be unavailable (private mode / quota); failing silently is intended
  }
}
