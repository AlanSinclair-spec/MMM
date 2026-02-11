'use client';

import { Ruler, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Measurement, formatAtomLabel } from '@/lib/visualization/measurement-tool';
import { cn } from '@/lib/utils';

interface MeasurementPanelProps {
  measurements: Measurement[];
  isActive: boolean;
  selectedAtom: any;
  onToggle: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClearSelection: () => void;
}

/**
 * Panel for displaying and managing distance measurements
 */
export default function MeasurementPanel({
  measurements,
  isActive,
  selectedAtom,
  onToggle,
  onRemove,
  onClear,
  onClearSelection,
}: MeasurementPanelProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Distance Measurements</h3>
        </div>
        <div className="flex items-center gap-2">
          {measurements.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground hover:text-destructive"
              title="Clear all measurements"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={onToggle}
            className={cn('transition-all', isActive && 'ring-2 ring-primary ring-offset-1')}
          >
            {isActive ? 'Active' : 'Activate'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Instructions */}
        {isActive && (
          <div className="bg-secondary/30 rounded-lg p-3 text-xs text-muted-foreground">
            {selectedAtom ? (
              <div className="space-y-1">
                <p className="font-medium text-foreground">First atom selected:</p>
                <p className="font-mono text-primary">{formatAtomLabel(selectedAtom)}</p>
                <p className="mt-2">Click a second atom to measure distance.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  className="mt-2 h-7 text-xs"
                >
                  Cancel Selection
                </Button>
              </div>
            ) : (
              <p>Click on two atoms in the structure to measure the distance between them.</p>
            )}
          </div>
        )}

        {/* Measurements List */}
        {measurements.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Measurements ({measurements.length})
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {measurements.map((measurement) => (
                <MeasurementItem
                  key={measurement.id}
                  measurement={measurement}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </div>
        ) : (
          !isActive && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              <Ruler className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No measurements yet</p>
              <p className="text-xs mt-1">Activate measurement mode to begin</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function MeasurementItem({
  measurement,
  onRemove,
}: {
  measurement: Measurement;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="bg-secondary/20 rounded-lg p-3 space-y-2 group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-primary">
              {measurement.distance.toFixed(2)} Å
            </span>
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5 font-mono">
            <div className="truncate">
              <span className="text-foreground">1:</span> {formatAtomLabel(measurement.atom1)}
            </div>
            <div className="truncate">
              <span className="text-foreground">2:</span> {formatAtomLabel(measurement.atom2)}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(measurement.id)}
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
