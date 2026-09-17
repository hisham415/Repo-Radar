import { loadFromStorage, removeFromStorage, saveToStorage, type StorageAdapter } from './storage';

function createMemoryStorage(): StorageAdapter & { store: Map<string, string> } {
  const store = new Map<string, string>();
  return {
    store,
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => void store.set(key, value),
    removeItem: (key) => void store.delete(key),
  };
}

const isNumberArray = (v: unknown): v is number[] =>
  Array.isArray(v) && v.every((n) => typeof n === 'number');

describe('storage', () => {
  it('round-trips data with a version envelope', () => {
    const storage = createMemoryStorage();
    expect(saveToStorage('k', 1, [1, 2, 3], storage)).toBe(true);
    expect(loadFromStorage('k', 1, isNumberArray, storage)).toEqual([1, 2, 3]);
  });

  it('returns null and clears the key on version mismatch', () => {
    const storage = createMemoryStorage();
    saveToStorage('k', 1, [1], storage);
    expect(loadFromStorage('k', 2, isNumberArray, storage)).toBeNull();
    expect(storage.store.has('k')).toBe(false);
  });

  it('returns null and clears the key when the guard rejects the data', () => {
    const storage = createMemoryStorage();
    saveToStorage('k', 1, ['bad'], storage);
    expect(loadFromStorage('k', 1, isNumberArray, storage)).toBeNull();
    expect(storage.store.has('k')).toBe(false);
  });

  it('returns null for corrupt JSON', () => {
    const storage = createMemoryStorage();
    storage.setItem('k', '{not json');
    expect(loadFromStorage('k', 1, isNumberArray, storage)).toBeNull();
  });

  it('returns false when the adapter throws on write', () => {
    const storage: StorageAdapter = {
      getItem: () => null,
      setItem: () => {
        throw new Error('quota');
      },
      removeItem: () => undefined,
    };
    expect(saveToStorage('k', 1, 1, storage)).toBe(false);
  });

  it('removes keys', () => {
    const storage = createMemoryStorage();
    saveToStorage('k', 1, 1, storage);
    removeFromStorage('k', storage);
    expect(storage.store.has('k')).toBe(false);
  });
});
