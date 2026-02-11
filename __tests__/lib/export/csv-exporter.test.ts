import { formatMetadataForExport } from '@/lib/export/csv-exporter';
import { ProteinMetadata } from '@/types/protein';

describe('csv-exporter', () => {
  const mockMetadata: ProteinMetadata = {
    structureId: '1CRN',
    title: 'Crambin',
    molecularWeight: 4730.0,
    numberOfChains: 1,
    numberOfAtoms: 327,
    numberOfResidues: 46,
    organism: 'Crambe abyssinica',
    experimentalMethod: 'X-RAY DIFFRACTION',
    resolution: 0.945,
    releaseDate: '1981-01-01',
  };

  describe('formatMetadataForExport', () => {
    it('should format metadata correctly', () => {
      const formatted = formatMetadataForExport(mockMetadata);

      expect(formatted['Structure ID']).toBe('1CRN');
      expect(formatted['Title']).toBe('Crambin');
      expect(formatted['Molecular Weight (kDa)']).toBe('4.73');
      expect(formatted['Number of Chains']).toBe(1);
      expect(formatted['Organism']).toBe('Crambe abyssinica');
    });

    it('should handle missing resolution', () => {
      const metadataWithoutResolution = { ...mockMetadata, resolution: undefined };
      const formatted = formatMetadataForExport(metadataWithoutResolution);

      expect(formatted['Resolution (Å)']).toBe('N/A');
    });

    it('should convert molecular weight to kDa', () => {
      const formatted = formatMetadataForExport(mockMetadata);
      const mwInKDa = parseFloat(formatted['Molecular Weight (kDa)']);

      expect(mwInKDa).toBeCloseTo(mockMetadata.molecularWeight / 1000, 2);
    });

    it('should include all required fields', () => {
      const formatted = formatMetadataForExport(mockMetadata);

      expect(formatted).toHaveProperty('Structure ID');
      expect(formatted).toHaveProperty('Title');
      expect(formatted).toHaveProperty('Molecular Weight (kDa)');
      expect(formatted).toHaveProperty('Number of Chains');
      expect(formatted).toHaveProperty('Number of Atoms');
      expect(formatted).toHaveProperty('Number of Residues');
      expect(formatted).toHaveProperty('Organism');
      expect(formatted).toHaveProperty('Experimental Method');
      expect(formatted).toHaveProperty('Resolution (Å)');
      expect(formatted).toHaveProperty('Release Date');
    });
  });
});
