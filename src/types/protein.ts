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
