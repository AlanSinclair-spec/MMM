'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ProteinViewer3D, { ProteinViewer3DRef } from '@/components/explore/ProteinViewer3D';
import VisualizationControls from '@/components/explore/VisualizationControls';
import ColorSchemeSelector from '@/components/explore/ColorSchemeSelector';
import { ExportButton } from '@/components/shared/ExportButton';
import { useExportImage } from '@/hooks/useExportImage';
import { generateProteinFilename } from '@/lib/export/image-exporter';
import { VisualizationStyle, ColorScheme, ProteinMetadata } from '@/types/protein';

interface ViewerPanelData {
  pdbData: string | null;
  metadata: ProteinMetadata | null;
  isLoading: boolean;
  error: string | null;
}

interface DualViewerPanelProps {
  proteinA: ViewerPanelData;
  proteinB: ViewerPanelData;
}

function SingleViewerColumn({ data, label }: { data: ViewerPanelData; label: string }) {
  const [style, setStyle] = useState<VisualizationStyle>('cartoon');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('spectrum');
  const viewerRef = useRef<ProteinViewer3DRef>(null);
  const { exportImage, isExporting } = useExportImage();

  const handleExport = async () => {
    const viewer = viewerRef.current?.getViewer();
    if (!viewer || !data.metadata?.structureId) return;

    const filename = generateProteinFilename(data.metadata.structureId, style);
    await exportImage(viewer, { format: 'png', filename });
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground truncate">
          {data.metadata?.structureId ?? label}
        </h3>
        {data.metadata?.title && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {data.metadata.title}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <VisualizationControls style={style} onStyleChange={setStyle} />
        {data.pdbData && (
          <ExportButton
            onClick={handleExport}
            isExporting={isExporting}
            size="sm"
            showLabel={false}
          />
        )}
      </div>

      <ColorSchemeSelector
        scheme={colorScheme}
        onSchemeChange={setColorScheme}
      />

      {data.isLoading && !data.pdbData && (
        <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl border border-border/50 flex items-center justify-center bg-card/30">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">
              Fetching {label}...
            </p>
          </div>
        </div>
      )}

      {data.error && (
        <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-xl border border-destructive/50 bg-destructive/10 flex items-center justify-center">
          <div className="text-center max-w-xs">
            <p className="text-sm text-destructive mb-1">Could not load protein</p>
            <p className="text-xs text-muted-foreground">{data.error}</p>
          </div>
        </div>
      )}

      {data.pdbData && (
        <div className="[&>div>div]:!h-[300px] sm:[&>div>div]:!h-[400px] lg:[&>div>div]:!h-[500px]">
          <ProteinViewer3D
            ref={viewerRef}
            pdbData={data.pdbData}
            style={style}
            colorScheme={colorScheme}
          />
        </div>
      )}
    </div>
  );
}

export default function DualViewerPanel({ proteinA, proteinB }: DualViewerPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      <SingleViewerColumn data={proteinA} label="Protein A" />
      <SingleViewerColumn data={proteinB} label="Protein B" />
    </motion.div>
  );
}
