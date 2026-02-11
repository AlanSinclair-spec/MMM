'use client';

import { FileDown } from 'lucide-react';
import { ProteinMetadata } from '@/types/protein';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { exportComparisonToCSV } from '@/lib/export/csv-exporter';
import { cn } from '@/lib/utils';

interface ComparisonTableProps {
  metadataA: ProteinMetadata | null;
  metadataB: ProteinMetadata | null;
  isLoading: boolean;
}

interface ComparisonRowProps {
  label: string;
  valueA: string | number | null;
  valueB: string | number | null;
  highlight?: boolean;
}

function ComparisonRow({ label, valueA, valueB, highlight = false }: ComparisonRowProps) {
  const isDifferent = String(valueA) !== String(valueB);
  return (
    <tr className={cn(
      'border-b border-border/30 last:border-0',
      highlight && 'bg-secondary/20'
    )}>
      <td className="py-3 px-4 text-xs text-muted-foreground uppercase tracking-wider font-medium">
        {label}
      </td>
      <td className="py-3 px-4 text-sm text-foreground font-medium">
        {valueA ?? 'N/A'}
      </td>
      <td className="py-3 px-4 text-sm text-foreground font-medium">
        {valueB ?? 'N/A'}
      </td>
      <td className="py-3 px-4 text-center">
        {isDifferent ? (
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" title="Different" />
        ) : (
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" title="Same" />
        )}
      </td>
    </tr>
  );
}

export default function ComparisonTable({ metadataA, metadataB, isLoading }: ComparisonTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!metadataA || !metadataB) return null;

  const formatWeight = (w: number) => w ? `${(w / 1000).toFixed(1)} kDa` : 'N/A';
  const formatResolution = (r: number | null) => r ? `${r.toFixed(2)} \u00C5` : 'N/A';

  const handleExport = () => {
    exportComparisonToCSV(metadataA, metadataB);
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Structural Comparison
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {metadataA.structureId} vs {metadataB.structureId}
          </p>
        </div>
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <FileDown className="h-4 w-4 mr-1.5" />
          Export CSV
        </Button>
      </div>
      <Separator className="opacity-50" />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="py-3 px-4 text-left text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Property
              </th>
              <th className="py-3 px-4 text-left text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {metadataA.structureId}
              </th>
              <th className="py-3 px-4 text-left text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {metadataB.structureId}
              </th>
              <th className="py-3 px-4 text-center text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Match
              </th>
            </tr>
          </thead>
          <tbody>
            <ComparisonRow
              label="Molecular Weight"
              valueA={formatWeight(metadataA.molecularWeight)}
              valueB={formatWeight(metadataB.molecularWeight)}
            />
            <ComparisonRow
              label="Number of Chains"
              valueA={metadataA.numberOfChains}
              valueB={metadataB.numberOfChains}
              highlight
            />
            <ComparisonRow
              label="Organism"
              valueA={metadataA.organism}
              valueB={metadataB.organism}
            />
            <ComparisonRow
              label="Experimental Method"
              valueA={metadataA.experimentalMethod}
              valueB={metadataB.experimentalMethod}
              highlight
            />
            <ComparisonRow
              label="Resolution"
              valueA={formatResolution(metadataA.resolution)}
              valueB={formatResolution(metadataB.resolution)}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
