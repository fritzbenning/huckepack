import { del, get, set } from "idb-keyval";
import type { StateStorage } from "zustand/middleware";

export const createIndexedDBStorage = (): StateStorage => {
  return {
    getItem: async (name: string): Promise<string | null> => {
      try {
        const value = await get(name);
        if (value === undefined) return null;

        return JSON.stringify(value);
      } catch (error) {
        console.error(`[IndexedDBStorage] Error reading ${name}:`, error);
        return null;
      }
    },
    setItem: async (name: string, value: string): Promise<void> => {
      try {
        const parsed = JSON.parse(value);
        await set(name, parsed);
      } catch (error) {
        console.error(`[IndexedDBStorage] Error writing ${name}:`, error);
        if (error instanceof DOMException && error.name === "QuotaExceededError") {
          console.error(`[IndexedDBStorage] Quota exceeded for ${name}. This is unusual for IndexedDB.`);
        }
        throw error;
      }
    },
    removeItem: async (name: string): Promise<void> => {
      try {
        await del(name);
      } catch (error) {
        console.error(`[IndexedDBStorage] Error removing ${name}:`, error);
      }
    },
  };
};

