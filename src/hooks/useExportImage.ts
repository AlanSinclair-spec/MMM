import { useState, useCallback } from 'react';
import { exportViewerImage, ExportImageOptions, ExportResult } from '@/lib/export/image-exporter';

export interface UseExportImageReturn {
  exportImage: (viewer: any, options: ExportImageOptions) => Promise<ExportResult>;
  isExporting: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook for exporting 3D protein visualizations as images
 * Manages export state and error handling
 */
export function useExportImage(): UseExportImageReturn {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportImage = useCallback(
    async (viewer: any, options: ExportImageOptions): Promise<ExportResult> => {
      setIsExporting(true);
      setError(null);

      try {
        const result = await exportViewerImage(viewer, options);

        if (!result.success && result.error) {
          setError(result.error);
        }

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Export failed';
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    exportImage,
    isExporting,
    error,
    clearError,
  };
}
