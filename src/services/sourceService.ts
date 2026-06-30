// Browser-friendly data source helpers (uses /public/data)

export const knownDatasets = [
  'cement.json',
  'steel.json',
  'semiconductor.json',
  'cbam.json',
  'industryData.json',
];

import cache from './cacheService';

export async function loadLocalJson(filename: string): Promise<any | null> {
  try {
    const url = `/data/${filename}`;
    const json = await cache.fetchWithCache(url, 300);
    return json;
  } catch (e) {
    return null;
  }
}

export async function loadLocalText(filename: string): Promise<string | null> {
  try {
    const url = `/data/${filename}`;
    const txt = await cache.fetchWithCache(url, 300);
    if (typeof txt === 'string') return txt;
    return null;
  } catch (e) {
    return null;
  }
}

export async function loadLocalCsv(filename: string, maxRows = 100): Promise<Record<string, string>[] | null> {
  const text = await loadLocalText(filename);
  if (!text) return null;
  const lines = text.trim().split('\n');
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows = lines.slice(1, 1 + maxRows).map((line) => {
    const cells = line.split(',');
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = cells[i] ?? '';
    });
    return obj;
  });
  return rows;
}
