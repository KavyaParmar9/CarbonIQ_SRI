import { describe, it, expect, beforeEach } from 'vitest';
import { setCache, getCache, clearCache } from '../cacheService';

beforeEach(() => {
  // simple sessionStorage mock
  (global as any).sessionStorage = {
    store: {} as Record<string, string>,
    setItem(k: string, v: string) { this.store[k] = v; },
    getItem(k: string) { return this.store[k] ?? null; },
    removeItem(k: string) { delete this.store[k]; },
    clear() { this.store = {}; },
  };
  clearCache();
});

describe('cacheService', () => {
  it('sets and gets value', () => {
    setCache('x', { a: 1 }, 1);
    const v = getCache('x');
    expect(v).toEqual({ a: 1 });
  });

  it('clears cache by key', () => {
    setCache('a', 1);
    setCache('b', 2);
    clearCache('a');
    expect(getCache('a')).toBeNull();
    expect(getCache('b')).toEqual(2);
  });
});
