
import { COLOR_SCHEMES } from '@/lib/visualization/color-schemes';

describe('color-schemes', () => {
  describe('COLOR_SCHEMES', () => {
    it('should have 5 color schemes', () => {
      expect(COLOR_SCHEMES).toHaveLength(5);
    });

    it('should have unique IDs', () => {
      const ids = COLOR_SCHEMES.map(scheme => scheme.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(COLOR_SCHEMES.length);
    });

    it('should have all required properties', () => {
      COLOR_SCHEMES.forEach(scheme => {
        expect(scheme).toHaveProperty('id');
        expect(scheme).toHaveProperty('label');
        expect(scheme).toHaveProperty('description');
        expect(typeof scheme.id).toBe('string');
        expect(typeof scheme.label).toBe('string');
        expect(typeof scheme.description).toBe('string');
      });
    });

    it('should include expected color schemes', () => {
      const ids = COLOR_SCHEMES.map(s => s.id);
      expect(ids).toContain('spectrum');
      expect(ids).toContain('secondary');
      expect(ids).toContain('chain');
      expect(ids).toContain('bfactor');
      expect(ids).toContain('residue');
    });
  });
});
