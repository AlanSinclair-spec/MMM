/**
 * Measurement tool for calculating distances between atoms
 */

export interface AtomSelection {
  serial: number;
  elem: string;
  chain: string;
  resi: number;
  resn: string;
  x: number;
  y: number;
  z: number;
}

export interface Measurement {
  id: string;
  atom1: AtomSelection;
  atom2: AtomSelection;
  distance: number; // in Ångströms
}

/**
 * Calculate Euclidean distance between two atoms
 * @param atom1 - First atom
 * @param atom2 - Second atom
 * @returns Distance in Ångströms
 */
export function calculateDistance(
  atom1: AtomSelection,
  atom2: AtomSelection
): number {
  const dx = atom1.x - atom2.x;
  const dy = atom1.y - atom2.y;
  const dz = atom1.z - atom2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Format atom information for display
 * @param atom - Atom selection
 * @returns Formatted string
 */
export function formatAtomLabel(atom: AtomSelection): string {
  return `${atom.resn}${atom.resi} ${atom.elem} (Chain ${atom.chain})`;
}

/**
 * Generate unique ID for measurement
 */
export function generateMeasurementId(): string {
  return `measurement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a measurement from two atoms
 */
export function createMeasurement(
  atom1: AtomSelection,
  atom2: AtomSelection
): Measurement {
  return {
    id: generateMeasurementId(),
    atom1,
    atom2,
    distance: calculateDistance(atom1, atom2),
  };
}
