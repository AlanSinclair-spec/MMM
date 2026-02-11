import { saveAs } from 'file-saver';

export interface ExportImageOptions {
  format: 'png';
  quality?: number;
  filename?: string;
}

export interface ExportResult {
  success: boolean;
  error?: string;
}

/**
 * Exports a 3Dmol.js viewer instance as a PNG image
 * @param viewer - The 3Dmol.js viewer instance
 * @param options - Export options including format, quality, and filename
 * @returns Promise resolving to export result
 */
export async function exportViewerImage(
  viewer: any,
  options: ExportImageOptions
): Promise<ExportResult> {
  try {
    if (!viewer) {
      throw new Error('Viewer instance is required');
    }

    // Use 3Dmol's built-in PNG export
    const dataUrl = viewer.pngURI();

    if (!dataUrl) {
      throw new Error('Failed to generate PNG from viewer');
    }

    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // Generate filename with timestamp if not provided
    const filename = options.filename || `protein-${Date.now()}.png`;

    // Trigger download
    saveAs(blob, filename);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Export error:', error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Generates a filename for protein export
 * @param pdbId - The PDB ID
 * @param style - Visualization style
 * @returns Formatted filename
 */
export function generateProteinFilename(
  pdbId: string,
  style?: string
): string {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const parts = [pdbId.toUpperCase()];

  if (style) {
    parts.push(style);
  }

  parts.push(timestamp);

  return `${parts.join('_')}.png`;
}
