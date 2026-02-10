'use client';

import { FEATURED_PROTEINS } from '@/lib/constants/featured-proteins';
import ProteinCard from './ProteinCard';

interface FeaturedProteinsProps {
  onSelect: (pdbId: string) => void;
}

export default function FeaturedProteins({ onSelect }: FeaturedProteinsProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Featured Proteins
        </h2>
        <p className="text-muted-foreground">
          Select a protein to explore its 3D structure
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURED_PROTEINS.map((protein, index) => (
          <ProteinCard
            key={protein.pdbId}
            protein={protein}
            onClick={() => onSelect(protein.pdbId)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
