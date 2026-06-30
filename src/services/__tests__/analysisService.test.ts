import { describe, it, expect } from 'vitest';
import { summarizeJsonDataset } from '../analysisService';

describe('analysisService', () => {
  it('summarizes simple dataset array', () => {
    const ds = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const s = summarizeJsonDataset(ds);
    expect(s.available).toBe(true);
    expect(s.rowCount).toBe(3);
    expect(Array.isArray(s.sample)).toBe(true);
  });

  it('summarizes dataset with values array', () => {
    const ds = { name: 'Test', values: [{ a: 1 }, { a: 2 }] };
    const s = summarizeJsonDataset(ds);
    expect(s.available).toBe(true);
    expect(s.name).toBe('Test');
    expect(s.rowCount).toBe(2);
  });
});
