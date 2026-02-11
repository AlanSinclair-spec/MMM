import { useState, useCallback } from 'react';
import {
  AtomSelection,
  Measurement,
  createMeasurement,
} from '@/lib/visualization/measurement-tool';

export interface UseMeasurementToolReturn {
  measurements: Measurement[];
  isActive: boolean;
  selectedAtom: AtomSelection | null;
  addAtom: (atom: AtomSelection) => void;
  removeMeasurement: (id: string) => void;
  clearMeasurements: () => void;
  toggleActive: () => void;
  clearSelection: () => void;
}

/**
 * Hook for managing distance measurements
 * Handles atom selection and measurement creation
 */
export function useMeasurementTool(): UseMeasurementToolReturn {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [selectedAtom, setSelectedAtom] = useState<AtomSelection | null>(null);

  const addAtom = useCallback(
    (atom: AtomSelection) => {
      if (!selectedAtom) {
        // First atom selected
        setSelectedAtom(atom);
      } else {
        // Second atom selected - create measurement
        const measurement = createMeasurement(selectedAtom, atom);
        setMeasurements((prev) => [...prev, measurement]);
        setSelectedAtom(null); // Reset for next measurement
      }
    },
    [selectedAtom]
  );

  const removeMeasurement = useCallback((id: string) => {
    setMeasurements((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const clearMeasurements = useCallback(() => {
    setMeasurements([]);
    setSelectedAtom(null);
  }, []);

  const toggleActive = useCallback(() => {
    setIsActive((prev) => !prev);
    setSelectedAtom(null); // Clear selection when toggling
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedAtom(null);
  }, []);

  return {
    measurements,
    isActive,
    selectedAtom,
    addAtom,
    removeMeasurement,
    clearMeasurements,
    toggleActive,
    clearSelection,
  };
}
