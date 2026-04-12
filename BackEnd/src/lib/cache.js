/**
 * A lightweight, zero-dependency in-memory cache for API responses.
 * Perfect for reducing heavy database loads cleanly.
 */

const cacheData = new Map();

export const memoryCache = {
  get: (key) => {
    const item = cacheData.get(key);
    if (!item) return null;

    // Check if TTL has expired
    if (Date.now() > item.expiresAt) {
      cacheData.delete(key);
      return null;
    }
    return item.value;
  },

  set: (key, value, ttlSeconds = 60) => {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    cacheData.set(key, { value, expiresAt });
  },

  delete: (key) => {
    cacheData.delete(key);
  },

  clear: () => {
    cacheData.clear();
  }
};
