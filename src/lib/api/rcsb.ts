import { ProteinMetadata } from '@/types/protein';

const PDB_FILE_URL = 'https://files.rcsb.org/download';
const REST_API_URL = 'https://data.rcsb.org/rest/v1';

export async function fetchPDBFile(pdbId: string): Promise<string> {
  const url = `${PDB_FILE_URL}/${pdbId.toUpperCase()}.pdb`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`PDB file not found: ${pdbId}`);
  }

  return response.text();
}

export async function fetchProteinMetadata(pdbId: string): Promise<ProteinMetadata> {
  const url = `${REST_API_URL}/core/entry/${pdbId.toUpperCase()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Metadata not found: ${pdbId}`);
  }

  const data = await response.json();

  return {
    structureId: data.rcsb_id ?? pdbId.toUpperCase(),
    title: data.struct?.title ?? 'Unknown',
    experimentalMethod: data.exptl?.[0]?.method ?? 'Unknown',
    resolution: data.rcsb_entry_info?.resolution_combined?.[0] ?? data.refine?.[0]?.ls_d_res_high ?? null,
    organism: data.rcsb_entity_source_organism?.[0]?.ncbi_scientific_name ?? 'N/A',
    releaseDate: data.rcsb_accession_info?.initial_release_date ?? 'Unknown',
    molecularWeight: data.rcsb_entry_info?.molecular_weight ?? 0,
    numberOfAtoms: data.rcsb_entry_info?.deposited_atom_count ?? 0,
    numberOfResidues: data.rcsb_entry_info?.deposited_polymer_monomer_count ?? 0,
    numberOfChains: data.rcsb_entry_info?.deposited_polymer_entity_instance_count ?? 0,
  };
}
