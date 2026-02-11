
import {
  calculateDistance,
  formatAtomLabel,
  generateMeasurementId,
  createMeasurement,
  type AtomSelection,
} from '@/lib/visualization/measurement-tool';

describe('measurement-tool', () => {
  const mockAtom1: AtomSelection = {
    serial: 1,
    elem: 'C',
    chain: 'A',
    resi: 10,
    resn: 'ALA',
    x: 0,
    y: 0,
    z: 0,
  };

  const mockAtom2: AtomSelection = {
    serial: 2,
    elem: 'N',
    chain: 'A',
    resi: 11,
    resn: 'GLY',
    x: 3,
    y: 4,
    z: 0,
  };

  describe('calculateDistance', () => {
    it('should calculate Euclidean distance correctly', () => {
      const distance = calculateDistance(mockAtom1, mockAtom2);
      expect(distance).toBe(5); // 3-4-5 triangle
    });

    it('should return 0 for same atom', () => {
      const distance = calculateDistance(mockAtom1, mockAtom1);
      expect(distance).toBe(0);
    });

    it('should calculate distance in 3D space', () => {
      const atom3: AtomSelection = { ...mockAtom1, x: 1, y: 1, z: 1 };
      const distance = calculateDistance(mockAtom1, atom3);
      expect(distance).toBeCloseTo(Math.sqrt(3), 5);
    });
  });

  describe('formatAtomLabel', () => {
    it('should format atom label correctly', () => {
      const label = formatAtomLabel(mockAtom1);
      expect(label).toBe('ALA10 C (Chain A)');
    });

    it('should handle different residues', () => {
      const label = formatAtomLabel(mockAtom2);
      expect(label).toBe('GLY11 N (Chain A)');
    });
  });

  describe('generateMeasurementId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateMeasurementId();
      const id2 = generateMeasurementId();
      expect(id1).not.toBe(id2);
    });

    it('should start with "measurement-"', () => {
      const id = generateMeasurementId();
      expect(id).toMatch(/^measurement-/);
    });
  });

  describe('createMeasurement', () => {
    it('should create measurement with correct properties', () => {
      const measurement = createMeasurement(mockAtom1, mockAtom2);

      expect(measurement.atom1).toEqual(mockAtom1);
      expect(measurement.atom2).toEqual(mockAtom2);
      expect(measurement.distance).toBe(5);
      expect(measurement.id).toMatch(/^measurement-/);
    });

    it('should calculate distance automatically', () => {
      const measurement = createMeasurement(mockAtom1, mockAtom2);
      expect(measurement.distance).toBe(calculateDistance(mockAtom1, mockAtom2));
    });
  });
});
