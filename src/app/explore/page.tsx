'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ProteinSearch from '@/components/explore/ProteinSearch';
import FeaturedProteins from '@/components/explore/FeaturedProteins';
import ProteinViewer3D, { ProteinViewer3DRef } from '@/components/explore/ProteinViewer3D';
import VisualizationControls from '@/components/explore/VisualizationControls';
import ColorSchemeSelector from '@/components/explore/ColorSchemeSelector';
import ProteinInfoSidebar from '@/components/explore/ProteinInfoSidebar';
import MeasurementPanel from '@/components/explore/MeasurementPanel';
import { ExportButton } from '@/components/shared/ExportButton';
import { KeyboardHelp } from '@/components/shared/KeyboardHelp';
import { useProteinData } from '@/hooks/useProteinData';
import { useExportImage } from '@/hooks/useExportImage';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useMeasurementTool } from '@/hooks/useMeasurementTool';
import { generateProteinFilename } from '@/lib/export/image-exporter';
import { VisualizationStyle, ColorScheme } from '@/types/protein';
import { COLOR_SCHEMES } from '@/lib/visualization/color-schemes';
import { Button } from '@/components/ui/button';

const VISUALIZATION_STYLES: VisualizationStyle[] = ['cartoon', 'stick', 'sphere', 'surface', 'line'];

export default function ExplorePage() {
  const [selectedPdbId, setSelectedPdbId] = useState<string | null>(null);
  const [style, setStyle] = useState<VisualizationStyle>('cartoon');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('spectrum');
  const viewerRef = useRef<ProteinViewer3DRef>(null);

  const { pdbData, metadata, isLoading, error } = useProteinData(selectedPdbId);
  const { exportImage, isExporting, error: exportError } = useExportImage();
  const {
    measurements,
    isActive: measurementActive,
    selectedAtom,
    addAtom,
    removeMeasurement,
    clearMeasurements,
    toggleActive: toggleMeasurement,
    clearSelection,
  } = useMeasurementTool();

  const handleBack = () => {
    setSelectedPdbId(null);
    setStyle('cartoon');
    setColorScheme('spectrum');
  };

  const handleExport = async () => {
    const viewer = viewerRef.current?.getViewer();
    if (!viewer || !selectedPdbId) return;

    const filename = generateProteinFilename(selectedPdbId, style);
    await exportImage(viewer, { format: 'png', filename });
  };

  const cycleStyle = () => {
    const currentIndex = VISUALIZATION_STYLES.indexOf(style);
    const nextIndex = (currentIndex + 1) % VISUALIZATION_STYLES.length;
    setStyle(VISUALIZATION_STYLES[nextIndex]);
  };

  const cycleColorScheme = () => {
    const currentIndex = COLOR_SCHEMES.findIndex((s) => s.id === colorScheme);
    const nextIndex = (currentIndex + 1) % COLOR_SCHEMES.length;
    setColorScheme(COLOR_SCHEMES[nextIndex].id);
  };

  const resetView = () => {
    const viewer = viewerRef.current?.getViewer();
    if (!viewer) return;
    viewer.zoomTo();
    viewer.render();
    viewer.zoom(1.2, 800);
  };

  // Keyboard shortcuts (only active when viewing a protein)
  useKeyboardShortcuts({
    shortcuts: [
      { key: 'r', action: resetView, description: 'Reset camera view' },
      { key: 's', action: cycleStyle, description: 'Cycle visualization styles' },
      { key: 'c', action: cycleColorScheme, description: 'Cycle color schemes' },
      { key: 'e', action: handleExport, description: 'Export current view' },
      { key: 'm', action: toggleMeasurement, description: 'Toggle measurement mode' },
    ],
    enabled: !!pdbData,
  });

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
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <VisualizationControls style={style} onStyleChange={setStyle} />
                {pdbData && (
                  <ExportButton
                    onClick={handleExport}
                    isExporting={isExporting}
                    disabled={!pdbData}
                  />
                )}
              </div>

              <ColorSchemeSelector
                scheme={colorScheme}
                onSchemeChange={setColorScheme}
              />

              {exportError && (
                <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                  {exportError}
                </div>
              )}

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
                <ProteinViewer3D
                  ref={viewerRef}
                  pdbData={pdbData}
                  style={style}
                  colorScheme={colorScheme}
                  measurementMode={measurementActive}
                  onAtomClick={addAtom}
                  measurements={measurements}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <ProteinInfoSidebar
                metadata={metadata}
                isLoading={isLoading}
                error={error}
              />
              {pdbData && (
                <MeasurementPanel
                  measurements={measurements}
                  isActive={measurementActive}
                  selectedAtom={selectedAtom}
                  onToggle={toggleMeasurement}
                  onRemove={removeMeasurement}
                  onClear={clearMeasurements}
                  onClearSelection={clearSelection}
                />
              )}
            </div>
          </motion.div>
        ) : (
          <FeaturedProteins onSelect={setSelectedPdbId} />
        )}
      </div>
    </div>
  );
}
