'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProteinSearch from '@/components/explore/ProteinSearch';
import FeaturedProteins from '@/components/explore/FeaturedProteins';
import ProteinViewer3D from '@/components/explore/ProteinViewer3D';
import VisualizationControls from '@/components/explore/VisualizationControls';
import ProteinInfoSidebar from '@/components/explore/ProteinInfoSidebar';
import { useProteinData } from '@/hooks/useProteinData';
import { VisualizationStyle } from '@/types/protein';
import { Button } from '@/components/ui/button';

export default function ExplorePage() {
  const [selectedPdbId, setSelectedPdbId] = useState<string | null>(null);
  const [style, setStyle] = useState<VisualizationStyle>('cartoon');

  const { pdbData, metadata, isLoading, error } = useProteinData(selectedPdbId);

  const handleBack = () => {
    setSelectedPdbId(null);
    setStyle('cartoon');
  };

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
            {selectedPdbId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground"
              >
                &larr; Back
              </Button>
            )}
            <h1 className="text-3xl font-bold text-foreground">
              {selectedPdbId
                ? `Viewing: ${metadata?.title ?? selectedPdbId}`
                : 'Protein Explorer'}
            </h1>
          </div>
          <ProteinSearch onSelect={setSelectedPdbId} />
        </motion.div>

        {/* Main Content */}
        {selectedPdbId ? (
          <motion.div
            key={selectedPdbId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Viewer + Controls */}
            <div className="lg:col-span-3 space-y-4">
              <VisualizationControls style={style} onStyleChange={setStyle} />

              {isLoading && !pdbData && (
                <div className="w-full h-[350px] sm:h-[450px] lg:h-[600px] rounded-xl border border-border/50 flex items-center justify-center bg-card/30">
                  <div className="text-center">
                    <div className="inline-block w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Fetching protein from RCSB PDB...
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="w-full h-[350px] sm:h-[450px] lg:h-[600px] rounded-xl border border-destructive/50 bg-destructive/10 flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <p className="text-lg font-medium text-destructive mb-2">
                      Could not load protein
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">{error}</p>
                    <Button variant="outline" size="sm" onClick={handleBack}>
                      Go Back
                    </Button>
                  </div>
                </div>
              )}

              {pdbData && (
                <ProteinViewer3D pdbData={pdbData} style={style} />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProteinInfoSidebar
                metadata={metadata}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </motion.div>
        ) : (
          <FeaturedProteins onSelect={setSelectedPdbId} />
        )}
      </div>
    </div>
  );
}
