'use client';

import { useState, useEffect } from 'react';
import { fetchPDBFile, fetchProteinMetadata } from '@/lib/api/rcsb';
import { proteinCache } from '@/lib/cache/protein-cache';
import { ProteinMetadata } from '@/types/protein';

export function useProteinData(pdbId: string | null) {
  const [pdbData, setPdbData] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ProteinMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pdbId) {
      setPdbData(null);
      setMetadata(null);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to get from cache first
        const [cachedPdb, cachedMeta] = await Promise.all([
          proteinCache.getPDBFile(pdbId),
          proteinCache.getMetadata(pdbId),
        ]);

        // If both are in cache, use them immediately
        if (cachedPdb && cachedMeta) {
          if (!cancelled) {
            setPdbData(cachedPdb);
            setMetadata(cachedMeta);
            setIsLoading(false);
          }
          return;
        }

        // Fetch from network
        const [pdb, meta] = await Promise.all([
          cachedPdb || fetchPDBFile(pdbId),
          cachedMeta || fetchProteinMetadata(pdbId),
        ]);

        // Cache the results for future use
        if (!cachedPdb) {
          proteinCache.setPDBFile(pdbId, pdb);
        }
        if (!cachedMeta) {
          proteinCache.setMetadata(pdbId, meta);
        }

        if (!cancelled) {
          setPdbData(pdb);
          setMetadata(meta);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load protein');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [pdbId]);

  return { pdbData, metadata, isLoading, error };
}
