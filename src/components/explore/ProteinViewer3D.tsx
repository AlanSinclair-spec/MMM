'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { VisualizationStyle } from '@/types/protein';
import { Skeleton } from '@/components/ui/skeleton';

interface ProteinViewer3DProps {
  pdbData: string;
  style: VisualizationStyle;
}

export default function ProteinViewer3D({ pdbData, style }: ProteinViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<unknown>(null);
  const $3DmolRef = useRef<unknown>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const applyStyle = useCallback(
    (viewer: any, vizStyle: VisualizationStyle, $3Dmol: any) => {
      if (!viewer) return;
      viewer.removeAllSurfaces();
      viewer.setStyle({}, {});

      switch (vizStyle) {
        case 'cartoon':
          viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
          break;
        case 'stick':
          viewer.setStyle({}, { stick: { colorscheme: 'Jmol', radius: 0.15 } });
          break;
        case 'sphere':
          viewer.setStyle({}, { sphere: { colorscheme: 'Jmol', scale: 0.3 } });
          break;
        case 'surface':
          viewer.setStyle({}, { stick: { colorscheme: 'Jmol', radius: 0.1 } });
          if ($3Dmol) {
            viewer.addSurface($3Dmol.SurfaceType.VDW, {
              opacity: 0.85,
              colorscheme: 'whiteCarbon',
            });
          }
          break;
        case 'line':
          viewer.setStyle({}, { line: { colorscheme: 'Jmol' } });
          break;
      }

      viewer.render();
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

        const viewer = $3Dmol.createViewer(containerRef.current, {
          backgroundColor: 'rgb(10, 10, 26)',
          antialias: true,
        });

        viewerRef.current = viewer;

        viewer.addModel(pdbData, 'pdb');
        applyStyle(viewer, style, $3Dmol);
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
  }, [pdbData, applyStyle, style]);

  // Update visualization style
  useEffect(() => {
    if (viewerRef.current && $3DmolRef.current && isReady) {
      applyStyle(viewerRef.current, style, $3DmolRef.current);
    }
  }, [style, isReady, applyStyle]);

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
}
