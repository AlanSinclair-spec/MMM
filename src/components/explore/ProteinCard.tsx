'use client';

import { motion } from 'framer-motion';
import { FeaturedProtein } from '@/types/protein';
import { Badge } from '@/components/ui/badge';

interface ProteinCardProps {
  protein: FeaturedProtein;
  onClick: () => void;
  index: number;
}

export default function ProteinCard({ protein, onClick, index }: ProteinCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={onClick}
      className="group relative text-left w-full rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
    >
      {/* Gradient accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-xl bg-gradient-to-r ${protein.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="flex items-start justify-between mb-3">
        <Badge
          variant="secondary"
          className="text-xs font-normal bg-secondary/80"
        >
          {protein.category}
        </Badge>
        <span className="text-xs font-mono text-muted-foreground">
          {protein.pdbId}
        </span>
      </div>

      <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
        {protein.name}
      </h3>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {protein.description}
      </p>

      <div className="mt-4 text-xs text-muted-foreground/60 group-hover:text-primary/60 transition-colors">
        Click to visualize &rarr;
      </div>
    </motion.button>
  );
}
