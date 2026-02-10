'use client';

import { useState, useEffect } from 'react';
import { fetchPDBFile, fetchProteinMetadata } from '@/lib/api/rcsb';
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
        const [pdb, meta] = await Promise.all([
          fetchPDBFile(pdbId),
          fetchProteinMetadata(pdbId),
        ]);

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
