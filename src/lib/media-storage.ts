/**
 * Persistent Binary Media Storage using IndexedDB.
 * Allows storing large videos (up to 100MB+) and images persistently
 * across browser sessions, page reloads, and tab closures without
 * crashing localStorage quotas.
 */

const DB_NAME = "artforms_media_store";
const DB_VERSION = 1;
const STORE_NAME = "media_blobs";

let dbPromise: Promise<IDBDatabase> | null = null;
const blobUrlCache = new Map<string, string>();

function getDB(): Promise<IDBDatabase> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("IndexedDB is not available on server"));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error("IndexedDB open error:", request.error);
        reject(request.error);
      };
    });
  }

  return dbPromise;
}

export const MediaStorage = {
  /**
   * Save a binary File or Blob to IndexedDB
   */
  async saveMediaBlob(id: string, file: Blob | File, mimeType?: string): Promise<string> {
    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const record = {
          id,
          blob: file,
          mimeType: mimeType || file.type,
          name: (file as File).name || id,
          size: file.size,
          updatedAt: Date.now()
        };

        const req = store.put(record);
        req.onsuccess = () => {
          // Cache live blob URL
          const url = URL.createObjectURL(file);
          blobUrlCache.set(id, url);
          resolve(url);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.error("Error saving media to IndexedDB:", e);
      // Fallback: create temporary object URL
      const tempUrl = URL.createObjectURL(file);
      blobUrlCache.set(id, tempUrl);
      return tempUrl;
    }
  },

  /**
   * Retrieve a live playable URL for a media ID
   */
  async getMediaUrl(id: string, fallbackUrl?: string): Promise<string> {
    if (blobUrlCache.has(id)) {
      return blobUrlCache.get(id)!;
    }

    try {
      const db = await getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);

        req.onsuccess = () => {
          const record = req.result;
          if (record && record.blob) {
            const url = URL.createObjectURL(record.blob);
            blobUrlCache.set(id, url);
            resolve(url);
          } else {
            resolve(fallbackUrl || "");
          }
        };

        req.onerror = () => {
          resolve(fallbackUrl || "");
        };
      });
    } catch {
      return fallbackUrl || "";
    }
  },

  /**
   * Retrieve binary Blob from IndexedDB
   */
  async getMediaBlob(id: string): Promise<Blob | null> {
    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result?.blob || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  },

  /**
   * Delete media blob from IndexedDB
   */
  async deleteMediaBlob(id: string): Promise<void> {
    if (blobUrlCache.has(id)) {
      try {
        URL.revokeObjectURL(blobUrlCache.get(id)!);
      } catch {}
      blobUrlCache.delete(id);
    }

    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn("Error deleting media from IndexedDB:", e);
    }
  }
};
