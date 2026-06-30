type CacheEntry = {
  value: any;
  expiry?: number | null;
};

const memoryCache = new Map<string, CacheEntry>();

export function setCache(key: string, value: any, ttlSeconds?: number) {
  const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
  memoryCache.set(key, { value, expiry });
  try {
    // also persist small items to sessionStorage for page reloads
    const serial = JSON.stringify({ value, expiry });
    sessionStorage.setItem(`ciq_cache:${key}`, serial);
  } catch (e) {
    // ignore serialization errors
  }
}

export function getCache(key: string) {
  const entry = memoryCache.get(key);
  if (entry) {
    if (entry.expiry && Date.now() > entry.expiry) {
      memoryCache.delete(key);
      try { sessionStorage.removeItem(`ciq_cache:${key}`); } catch {};
      return null;
    }
    return entry.value;
  }

  try {
    const raw = sessionStorage.getItem(`ciq_cache:${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (parsed.expiry && Date.now() > parsed.expiry) {
      sessionStorage.removeItem(`ciq_cache:${key}`);
      return null;
    }
    // repopulate memory cache
    memoryCache.set(key, parsed);
    return parsed.value;
  } catch (e) {
    return null;
  }
}

export async function fetchWithCache(url: string, ttlSeconds = 300) {
  const key = url;
  const cached = getCache(key);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const contentType = res.headers.get('content-type') || '';
  let value: any;
  if (contentType.includes('application/json') || url.endsWith('.json')) {
    value = await res.json();
  } else {
    value = await res.text();
  }
  setCache(key, value, ttlSeconds);
  return value;
}

export function clearCache(key?: string) {
  if (key) {
    memoryCache.delete(key);
    try { sessionStorage.removeItem(`ciq_cache:${key}`); } catch {}
    return;
  }
  memoryCache.clear();
  try {
    Object.keys(sessionStorage).forEach((k) => {
      if (k.startsWith('ciq_cache:')) sessionStorage.removeItem(k);
    });
  } catch (e) {}
}

export default { getCache, setCache, fetchWithCache, clearCache };
