import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ProteinMetadata } from '@/types/protein';

/**
 * IndexedDB schema for protein data caching
 */
interface ProteinCacheDB extends DBSchema {
  pdbFiles: {
    key: string;
    value: {
      pdbId: string;
      data: string;
      timestamp: number;
      size: number;
    };
  };
  metadata: {
    key: string;
    value: {
      pdbId: string;
      data: ProteinMetadata;
      timestamp: number;
    };
  };
}

/**
 * Cache configuration
 */
const CACHE_CONFIG = {
  version: 1,
  dbName: 'protein-explorer-cache',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  maxSize: 50 * 1024 * 1024, // 50 MB total cache size
  maxEntries: 100, // Max 100 proteins cached
};

/**
 * Protein cache manager using IndexedDB
 * Provides persistent caching for PDB files and metadata
 */
class ProteinCache {
  private db: IDBPDatabase<ProteinCacheDB> | null = null;
  private initPromise: Promise<void> | null = null;

  /**
   * Initialize the IndexedDB database
   */
  private async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        this.db = await openDB<ProteinCacheDB>(
          CACHE_CONFIG.dbName,
          CACHE_CONFIG.version,
          {
            upgrade(db) {
              // Create object stores if they don't exist
              if (!db.objectStoreNames.contains('pdbFiles')) {
                db.createObjectStore('pdbFiles', { keyPath: 'pdbId' });
              }
              if (!db.objectStoreNames.contains('metadata')) {
                db.createObjectStore('metadata', { keyPath: 'pdbId' });
              }
            },
          }
        );
      } catch (error) {
        console.error('Failed to initialize protein cache:', error);
        throw error;
      }
    })();

    return this.initPromise;
  }

  /**
   * Get PDB file from cache
   */
  async getPDBFile(pdbId: string): Promise<string | null> {
    try {
      await this.init();
      if (!this.db) return null;

      const key = pdbId.toUpperCase();
      const entry = await this.db.get('pdbFiles', key);

      if (!entry) return null;

      // Check if cache entry has expired
      if (Date.now() - entry.timestamp > CACHE_CONFIG.maxAge) {
        await this.deletePDBFile(pdbId);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Error getting PDB file from cache:', error);
      return null;
    }
  }

  /**
   * Store PDB file in cache
   */
  async setPDBFile(pdbId: string, data: string): Promise<void> {
    try {
      await this.init();
      if (!this.db) return;

      const key = pdbId.toUpperCase();
      const size = new Blob([data]).size;

      await this.db.put('pdbFiles', {
        pdbId: key,
        data,
        timestamp: Date.now(),
        size,
      });

      // Cleanup old entries if cache is too large
      await this.cleanupIfNeeded();
    } catch (error) {
      console.error('Error storing PDB file in cache:', error);
    }
  }

  /**
   * Delete PDB file from cache
   */
  async deletePDBFile(pdbId: string): Promise<void> {
    try {
      await this.init();
      if (!this.db) return;

      const key = pdbId.toUpperCase();
      await this.db.delete('pdbFiles', key);
    } catch (error) {
      console.error('Error deleting PDB file from cache:', error);
    }
  }

  /**
   * Get metadata from cache
   */
  async getMetadata(pdbId: string): Promise<ProteinMetadata | null> {
    try {
      await this.init();
      if (!this.db) return null;

      const key = pdbId.toUpperCase();
      const entry = await this.db.get('metadata', key);

      if (!entry) return null;

      // Check if cache entry has expired
      if (Date.now() - entry.timestamp > CACHE_CONFIG.maxAge) {
        await this.deleteMetadata(pdbId);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Error getting metadata from cache:', error);
      return null;
    }
  }

  /**
   * Store metadata in cache
   */
  async setMetadata(pdbId: string, data: ProteinMetadata): Promise<void> {
    try {
      await this.init();
      if (!this.db) return;

      const key = pdbId.toUpperCase();

      await this.db.put('metadata', {
        pdbId: key,
        data,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error storing metadata in cache:', error);
    }
  }

  /**
   * Delete metadata from cache
   */
  async deleteMetadata(pdbId: string): Promise<void> {
    try {
      await this.init();
      if (!this.db) return;

      const key = pdbId.toUpperCase();
      await this.db.delete('metadata', key);
    } catch (error) {
      console.error('Error deleting metadata from cache:', error);
    }
  }

  /**
   * Clear all cached data
   */
  async clear(): Promise<void> {
    try {
      await this.init();
      if (!this.db) return;

      await this.db.clear('pdbFiles');
      await this.db.clear('metadata');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    pdbFileCount: number;
    metadataCount: number;
    totalSize: number;
  }> {
    try {
      await this.init();
      if (!this.db) {
        return { pdbFileCount: 0, metadataCount: 0, totalSize: 0 };
      }

      const pdbFiles = await this.db.getAll('pdbFiles');
      const metadata = await this.db.getAll('metadata');

      const totalSize = pdbFiles.reduce((sum, entry) => sum + entry.size, 0);

      return {
        pdbFileCount: pdbFiles.length,
        metadataCount: metadata.length,
        totalSize,
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { pdbFileCount: 0, metadataCount: 0, totalSize: 0 };
    }
  }

  /**
   * Clean up old entries if cache exceeds limits
   */
  private async cleanupIfNeeded(): Promise<void> {
    try {
      if (!this.db) return;

      const pdbFiles = await this.db.getAll('pdbFiles');

      // Check if we exceed max entries
      if (pdbFiles.length > CACHE_CONFIG.maxEntries) {
        // Sort by timestamp (oldest first)
        const sorted = pdbFiles.sort((a, b) => a.timestamp - b.timestamp);

        // Delete oldest entries
        const toDelete = sorted.slice(0, pdbFiles.length - CACHE_CONFIG.maxEntries);
        for (const entry of toDelete) {
          await this.deletePDBFile(entry.pdbId);
          await this.deleteMetadata(entry.pdbId);
        }
      }

      // Check total size
      const totalSize = pdbFiles.reduce((sum, entry) => sum + entry.size, 0);
      if (totalSize > CACHE_CONFIG.maxSize) {
        // Sort by timestamp (oldest first)
        const sorted = pdbFiles.sort((a, b) => a.timestamp - b.timestamp);

        // Delete oldest entries until we're under the limit
        let currentSize = totalSize;
        for (const entry of sorted) {
          if (currentSize <= CACHE_CONFIG.maxSize) break;
          await this.deletePDBFile(entry.pdbId);
          await this.deleteMetadata(entry.pdbId);
          currentSize -= entry.size;
        }
      }
    } catch (error) {
      console.error('Error during cache cleanup:', error);
    }
  }
}

// Export singleton instance
export const proteinCache = new ProteinCache();
