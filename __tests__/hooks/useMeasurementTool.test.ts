
import { renderHook, act } from '@testing-library/react';
import { useMeasurementTool } from '@/hooks/useMeasurementTool';
import type { AtomSelection } from '@/lib/visualization/measurement-tool';

describe('useMeasurementTool', () => {
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

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useMeasurementTool());

    expect(result.current.measurements).toEqual([]);
    expect(result.current.isActive).toBe(false);
    expect(result.current.selectedAtom).toBeNull();
  });

  it('should toggle active state', () => {
    const { result } = renderHook(() => useMeasurementTool());

    expect(result.current.isActive).toBe(false);

    act(() => {
      result.current.toggleActive();
    });

    expect(result.current.isActive).toBe(true);

    act(() => {
      result.current.toggleActive();
    });

    expect(result.current.isActive).toBe(false);
  });

  it('should select first atom', () => {
    const { result } = renderHook(() => useMeasurementTool());

    act(() => {
      result.current.addAtom(mockAtom1);
    });

    expect(result.current.selectedAtom).toEqual(mockAtom1);
    expect(result.current.measurements).toHaveLength(0);
  });

  it('should create measurement when second atom is added', () => {
    const { result } = renderHook(() => useMeasurementTool());

    act(() => {
      result.current.addAtom(mockAtom1);
    });

    act(() => {
      result.current.addAtom(mockAtom2);
    });

    expect(result.current.measurements).toHaveLength(1);
    expect(result.current.measurements[0].atom1).toEqual(mockAtom1);
    expect(result.current.measurements[0].atom2).toEqual(mockAtom2);
    expect(result.current.measurements[0].distance).toBe(5);
    expect(result.current.selectedAtom).toBeNull(); // Reset after measurement
  });

  it('should remove measurement by ID', () => {
    const { result } = renderHook(() => useMeasurementTool());

    // Create a measurement
    act(() => {
      result.current.addAtom(mockAtom1);
    });

    act(() => {
      result.current.addAtom(mockAtom2);
    });

    const measurementId = result.current.measurements[0].id;

    act(() => {
      result.current.removeMeasurement(measurementId);
    });

    expect(result.current.measurements).toHaveLength(0);
  });

  it('should clear all measurements', () => {
    const { result } = renderHook(() => useMeasurementTool());

    // Create multiple measurements
    act(() => {
      result.current.addAtom(mockAtom1);
    });
    act(() => {
      result.current.addAtom(mockAtom2);
    });
    act(() => {
      result.current.addAtom(mockAtom1);
    });
    act(() => {
      result.current.addAtom(mockAtom2);
    });

    expect(result.current.measurements).toHaveLength(2);

    act(() => {
      result.current.clearMeasurements();
    });

    expect(result.current.measurements).toHaveLength(0);
    expect(result.current.selectedAtom).toBeNull();
  });

  it('should clear selection without affecting measurements', () => {
    const { result } = renderHook(() => useMeasurementTool());

    act(() => {
      result.current.addAtom(mockAtom1);
    });

    expect(result.current.selectedAtom).toEqual(mockAtom1);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedAtom).toBeNull();
    expect(result.current.measurements).toHaveLength(0);
  });

  it('should clear selection when toggling active', () => {
    const { result } = renderHook(() => useMeasurementTool());

    act(() => {
      result.current.addAtom(mockAtom1);
    });

    expect(result.current.selectedAtom).toEqual(mockAtom1);

    act(() => {
      result.current.toggleActive();
    });

    expect(result.current.selectedAtom).toBeNull();
  });
});
