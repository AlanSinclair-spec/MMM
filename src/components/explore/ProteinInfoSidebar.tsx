'use client';

import { ProteinMetadata } from '@/types/protein';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

interface ProteinInfoSidebarProps {
  metadata: ProteinMetadata | null;
  isLoading: boolean;
  error: string | null;
}

function InfoRow({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="space-y-1">
      <dt className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </dt>
      <dd className="text-sm text-foreground font-medium">
        {value ?? 'N/A'}
      </dd>
    </div>
  );
}

export default function ProteinInfoSidebar({
  metadata,
  isLoading,
  error,
}: ProteinInfoSidebarProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-5">
        <p className="text-sm text-destructive">Failed to load protein info</p>
        <p className="text-xs text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Separator className="opacity-50" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    );
  }

  if (!metadata) return null;

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5">
      <h3 className="text-sm font-semibold text-foreground mb-1">
        {metadata.structureId}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
        {metadata.title}
      </p>

      <Separator className="mb-4 opacity-50" />

      <dl className="space-y-3">
        <InfoRow label="Organism" value={metadata.organism} />
        <InfoRow label="Method" value={metadata.experimentalMethod} />
        <InfoRow
          label="Resolution"
          value={metadata.resolution ? `${metadata.resolution.toFixed(2)} A` : null}
        />
        <InfoRow label="Release Date" value={metadata.releaseDate} />

        <Separator className="opacity-50" />

        <InfoRow
          label="Molecular Weight"
          value={metadata.molecularWeight ? `${(metadata.molecularWeight / 1000).toFixed(1)} kDa` : null}
        />
        <InfoRow label="Atoms" value={metadata.numberOfAtoms?.toLocaleString()} />
        <InfoRow label="Residues" value={metadata.numberOfResidues?.toLocaleString()} />
      </dl>
    </div>
  );
}
