'use client';

import { VisualizationStyle } from '@/types/protein';
import { cn } from '@/lib/utils';

const STYLES: { value: VisualizationStyle; label: string }[] = [
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'stick', label: 'Stick' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'surface', label: 'Surface' },
  { value: 'line', label: 'Line' },
];

interface VisualizationControlsProps {
  style: VisualizationStyle;
  onStyleChange: (style: VisualizationStyle) => void;
}

export default function VisualizationControls({
  style,
  onStyleChange,
}: VisualizationControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Style:</span>
      <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-secondary/50 border border-border/50">
        {STYLES.map((s) => (
          <button
            key={s.value}
            onClick={() => onStyleChange(s.value)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200',
              style === s.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
