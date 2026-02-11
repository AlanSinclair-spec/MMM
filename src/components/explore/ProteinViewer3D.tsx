'use client';

import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useTheme } from 'next-themes';
import { VisualizationStyle, ColorScheme } from '@/types/protein';
import { applyColorScheme, addSurfaceRendering } from '@/lib/visualization/color-schemes';
import { Skeleton } from '@/components/ui/skeleton';
import { AtomSelection, Measurement } from '@/lib/visualization/measurement-tool';

interface ProteinViewer3DProps {
  pdbData: string;
  style: VisualizationStyle;
  colorScheme?: ColorScheme;
  measurementMode?: boolean;
  onAtomClick?: (atom: AtomSelection) => void;
  measurements?: Measurement[];
}

export interface ProteinViewer3DRef {
  getViewer: () => any | null;
}

const ProteinViewer3D = forwardRef<ProteinViewer3DRef, ProteinViewer3DProps>(
  ({
    pdbData,
    style,
    colorScheme = 'spectrum',
    measurementMode = false,
    onAtomClick,
    measurements = []
  }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<unknown>(null);
  const $3DmolRef = useRef<unknown>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const labelRefs = useRef<any[]>([]);

  // Expose viewer instance to parent components via ref
  useImperativeHandle(ref, () => ({
    getViewer: () => viewerRef.current,
  }));

  const applyStyle = useCallback(
    (viewer: any, vizStyle: VisualizationStyle, scheme: ColorScheme, $3Dmol: any) => {
      if (!viewer || !$3Dmol) return;

      // Apply color scheme with visualization style
      applyColorScheme(viewer, scheme, vizStyle, $3Dmol);

      // Add surface rendering if style is 'surface'
      if (vizStyle === 'surface') {
        addSurfaceRendering(viewer, scheme, $3Dmol);
      }
    },
    []
  );

  // Initialize 3Dmol and load model
  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    let cancelled = false;

    const init = async () => {
      try {
        // Dynamic import of 3Dmol for client-side only
        await import('3dmol/build/3Dmol-min.js');
        const $3Dmol = (window as any).$3Dmol;

        if (!$3Dmol || cancelled) return;

        $3DmolRef.current = $3Dmol;

        // Clear any previous viewer
        if (viewerRef.current) {
          (viewerRef.current as any).clear();
        }
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        // Set background color based on theme
        const bgColor = resolvedTheme === 'light' ? 'white' : 'rgb(10, 10, 26)';

        const viewer = $3Dmol.createViewer(containerRef.current, {
          backgroundColor: bgColor,
          antialias: true,
        });

        viewerRef.current = viewer;

        viewer.addModel(pdbData, 'pdb');
        applyStyle(viewer, style, colorScheme, $3Dmol);
        viewer.zoomTo();
        viewer.render();
        viewer.zoom(1.2, 800);

        if (!cancelled) {
          setIsReady(true);
          setLoadError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Failed to load 3D viewer');
        }
      }
    };

    setIsReady(false);
    init();

    return () => {
      cancelled = true;
    };
  }, [pdbData, applyStyle, style, colorScheme]);

  // Update visualization style or color scheme
  useEffect(() => {
    if (viewerRef.current && $3DmolRef.current && isReady) {
      applyStyle(viewerRef.current, style, colorScheme, $3DmolRef.current);
    }
  }, [style, colorScheme, isReady, applyStyle]);

  // Setup atom click handling for measurement mode
  useEffect(() => {
    if (!viewerRef.current || !isReady || !$3DmolRef.current) return;

    const viewer = viewerRef.current as any;

    if (measurementMode && onAtomClick) {
      // Enable clicking on all atoms
      viewer.setClickable({}, true, (atom: any) => {
        const atomSelection: AtomSelection = {
          serial: atom.serial,
          elem: atom.elem,
          chain: atom.chain,
          resi: atom.resi,
          resn: atom.resn,
          x: atom.x,
          y: atom.y,
          z: atom.z,
        };
        onAtomClick(atomSelection);
      });
    } else {
      // Disable clicking when not in measurement mode
      viewer.setClickable({}, false);
    }

    viewer.render();
  }, [measurementMode, onAtomClick, isReady]);

  // Render measurement labels
  useEffect(() => {
    if (!viewerRef.current || !isReady || !$3DmolRef.current) return;

    const viewer = viewerRef.current as any;

    // Remove old labels
    labelRefs.current.forEach(label => {
      if (label) viewer.removeLabel(label);
    });
    labelRefs.current = [];

    // Add new labels for each measurement
    measurements.forEach((measurement) => {
      const midpoint = {
        x: (measurement.atom1.x + measurement.atom2.x) / 2,
        y: (measurement.atom1.y + measurement.atom2.y) / 2,
        z: (measurement.atom1.z + measurement.atom2.z) / 2,
      };

      const label = viewer.addLabel(
        `${measurement.distance.toFixed(2)} Å`,
        {
          position: midpoint,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          fontColor: 'white',
          fontSize: 12,
          borderThickness: 0,
          borderRadius: 3,
          padding: 4,
        }
      );

      labelRefs.current.push(label);
    });

    viewer.render();
  }, [measurements, isReady]);

  if (loadError) {
    return (
      <div className="w-full h-[350px] sm:h-[450px] lg:h-[600px] rounded-xl border border-destructive/50 bg-destructive/10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-destructive mb-1">Failed to load 3D viewer</p>
          <p className="text-xs text-muted-foreground">{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="w-full h-[350px] sm:h-[450px] lg:h-[600px] rounded-xl border border-border/50 overflow-hidden"
        style={{ position: 'relative' }}
      />
      {!isReady && (
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <Skeleton className="w-full h-full rounded-xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-muted-foreground">
                Rendering 3D structure...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

ProteinViewer3D.displayName = 'ProteinViewer3D';

export default ProteinViewer3D;
