import { saveAs } from 'file-saver';
import { ProteinMetadata } from '@/types/protein';

export interface CSVExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  delimiter?: ',' | ';' | '\t';
}

/**
 * Exports protein comparison data to CSV format
 * @param metadataA - Metadata for the first protein
 * @param metadataB - Metadata for the second protein
 * @param options - Export options
 */
export function exportComparisonToCSV(
  metadataA: ProteinMetadata,
  metadataB: ProteinMetadata,
  options: CSVExportOptions = {}
): void {
  const {
    filename,
    includeHeaders = true,
    delimiter = ',',
  } = options;

  const rows: string[][] = [];

  // Add headers
  if (includeHeaders) {
    rows.push(['Property', metadataA.structureId, metadataB.structureId]);
  }

  // Add data rows
  rows.push(['Title', metadataA.title, metadataB.title]);

  rows.push([
    'Molecular Weight (kDa)',
    (metadataA.molecularWeight / 1000).toFixed(2),
    (metadataB.molecularWeight / 1000).toFixed(2),
  ]);

  rows.push([
    'Number of Chains',
    metadataA.numberOfChains.toString(),
    metadataB.numberOfChains.toString(),
  ]);

  rows.push(['Organism', metadataA.organism, metadataB.organism]);

  rows.push([
    'Experimental Method',
    metadataA.experimentalMethod,
    metadataB.experimentalMethod,
  ]);

  rows.push([
    'Resolution (Å)',
    metadataA.resolution?.toFixed(2) || 'N/A',
    metadataB.resolution?.toFixed(2) || 'N/A',
  ]);

  rows.push([
    'Number of Atoms',
    metadataA.numberOfAtoms.toString(),
    metadataB.numberOfAtoms.toString(),
  ]);

  rows.push([
    'Number of Residues',
    metadataA.numberOfResidues.toString(),
    metadataB.numberOfResidues.toString(),
  ]);

  rows.push([
    'Release Date',
    metadataA.releaseDate,
    metadataB.releaseDate,
  ]);

  // Convert rows to CSV format
  const csv = rows
    .map(row =>
      row.map(cell => {
        // Escape cells that contain the delimiter, quotes, or newlines
        if (cell.includes(delimiter) || cell.includes('"') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(delimiter)
    )
    .join('\n');

  // Create and download the file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const defaultFilename = `comparison-${metadataA.structureId}-${metadataB.structureId}.csv`;

  saveAs(blob, filename || defaultFilename);
}

/**
 * Formats protein metadata for export
 * @param metadata - Protein metadata
 * @returns Formatted object for export
 */
export function formatMetadataForExport(metadata: ProteinMetadata): Record<string, any> {
  return {
    'Structure ID': metadata.structureId,
    'Title': metadata.title,
    'Molecular Weight (kDa)': (metadata.molecularWeight / 1000).toFixed(2),
    'Number of Chains': metadata.numberOfChains,
    'Number of Atoms': metadata.numberOfAtoms,
    'Number of Residues': metadata.numberOfResidues,
    'Organism': metadata.organism,
    'Experimental Method': metadata.experimentalMethod,
    'Resolution (Å)': metadata.resolution?.toFixed(2) || 'N/A',
    'Release Date': metadata.releaseDate,
  };
}
