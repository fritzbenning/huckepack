import { del, get, set } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

const PENDING_WRITES = new Map<string, { value: string; timeoutId: ReturnType<typeof setTimeout> }>();
const DEBOUNCE_MS = 100;

const flushWrite = async (name: string, value: string): Promise<void> => {
  try {
    const parsed = JSON.parse(value);
    await set(name, parsed);
  } catch (error) {
    console.error(`[DebouncedIndexedDBStorage] Error writing ${name}:`, error);
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.error(`[DebouncedIndexedDBStorage] Quota exceeded for ${name}. This is unusual for IndexedDB.`);
    }
    throw error;
  }
};

export const createDebouncedIndexedDBStorage = (): StateStorage => {
  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        const value = await get(name);
        if (value === undefined) return null;
        return JSON.stringify(value);
      } catch (error) {
        console.error(`[DebouncedIndexedDBStorage] Error reading ${name}:`, error);
        return null;
      }
    },
    setItem: async (name: string, value: string): Promise<void> => {
      const pending = PENDING_WRITES.get(name);
      if (pending) {
        clearTimeout(pending.timeoutId);
      }

      const timeoutId = setTimeout(async () => {
        PENDING_WRITES.delete(name);
        await flushWrite(name, value);
      }, DEBOUNCE_MS);

      PENDING_WRITES.set(name, { value, timeoutId });
    },
    removeItem: async (name: string): Promise<void> => {
      const pending = PENDING_WRITES.get(name);
      if (pending) {
        clearTimeout(pending.timeoutId);
        PENDING_WRITES.delete(name);
      }

      try {
        await del(name);
      } catch (error) {
        console.error(`[DebouncedIndexedDBStorage] Error removing ${name}:`, error);
      }
    },
  };
};

