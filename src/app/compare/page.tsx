'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import CompareInputs from '@/components/compare/CompareInputs';
import ComparisonPresets from '@/components/compare/ComparisonPresets';
import DualViewerPanel from '@/components/compare/DualViewerPanel';
import ComparisonTable from '@/components/compare/ComparisonTable';
import { useProteinData } from '@/hooks/useProteinData';
import { Button } from '@/components/ui/button';

export default function ComparePage() {
  const [pdbIdA, setPdbIdA] = useState<string | null>(null);
  const [pdbIdB, setPdbIdB] = useState<string | null>(null);

  const proteinA = useProteinData(pdbIdA);
  const proteinB = useProteinData(pdbIdB);

  const handleCompare = useCallback((idA: string, idB: string) => {
    setPdbIdA(idA);
    setPdbIdB(idB);
  }, []);

  const handleReset = useCallback(() => {
    setPdbIdA(null);
    setPdbIdB(null);
  }, []);

  const isComparing = pdbIdA !== null && pdbIdB !== null;
  const isLoading = proteinA.isLoading || proteinB.isLoading;
  const bothFailed = isComparing && !isLoading && proteinA.error && proteinB.error;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            {isComparing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground hover:text-foreground"
              >
                &larr; New Comparison
              </Button>
            )}
            <h1 className="text-3xl font-bold text-foreground">
              {isComparing
                ? `Comparing: ${pdbIdA} vs ${pdbIdB}`
                : 'Compare Proteins'}
            </h1>
          </div>

          <CompareInputs
            onCompare={handleCompare}
            initialA={pdbIdA ?? ''}
            initialB={pdbIdB ?? ''}
          />
        </motion.div>

        {/* Main Content */}
        {isComparing ? (
          <div className="space-y-8">
            {bothFailed && (
              <div className="p-6 rounded-xl border border-destructive/50 bg-destructive/10 text-center">
                <p className="text-lg font-medium text-destructive mb-2">
                  Could not load either protein
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Please check that both PDB IDs are valid and try again.
                </p>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Try Different Proteins
                </Button>
              </div>
            )}

            {!bothFailed && (
              <DualViewerPanel proteinA={proteinA} proteinB={proteinB} />
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ComparisonTable
                metadataA={proteinA.metadata}
                metadataB={proteinB.metadata}
                isLoading={isLoading}
              />
            </motion.div>
          </div>
        ) : (
          <ComparisonPresets onSelect={handleCompare} />
        )}
      </div>
    </div>
  );
}
