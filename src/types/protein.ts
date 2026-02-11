export interface ProteinMetadata {
  structureId: string;
  title: string;
  experimentalMethod: string;
  resolution: number | null;
  organism: string;
  releaseDate: string;
  molecularWeight: number;
  numberOfAtoms: number;
  numberOfResidues: number;
  numberOfChains: number;
}

export interface FeaturedProtein {
  pdbId: string;
  name: string;
  description: string;
  category: string;
  color: string;
}

export type VisualizationStyle = 'cartoon' | 'stick' | 'sphere' | 'surface' | 'line';

export type ColorScheme =
  | 'spectrum'        // Default rainbow (N to C terminus)
  | 'secondary'       // Secondary structure (helix, sheet, loop)
  | 'chain'           // By chain
  | 'bfactor'         // B-factor (temperature/flexibility)
  | 'residue';        // Residue type (amino acid properties)

export interface ColorSchemeDefinition {
  id: ColorScheme;
  label: string;
  description: string;
  icon?: string;
}
