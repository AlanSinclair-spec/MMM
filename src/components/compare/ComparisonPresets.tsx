'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { COMPARISON_PRESETS } from '@/lib/constants/comparison-presets';

interface ComparisonPresetsProps {
  onSelect: (pdbIdA: string, pdbIdB: string) => void;
}

export default function ComparisonPresets({ onSelect }: ComparisonPresetsProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Try a Comparison
        </h2>
        <p className="text-muted-foreground">
          Select a preset to compare two related protein structures
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMPARISON_PRESETS.map((preset, index) => (
          <motion.button
            key={preset.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            onClick={() => onSelect(preset.proteinA.pdbId, preset.proteinB.pdbId)}
            className="group relative text-left w-full rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
          >
            <div
              className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-xl bg-gradient-to-r ${preset.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
              {preset.label}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {preset.description}
            </p>

            <div className="flex gap-2 items-center">
              <Badge variant="secondary" className="text-xs font-mono bg-secondary/80">
                {preset.proteinA.pdbId}
              </Badge>
              <span className="text-xs text-muted-foreground">vs</span>
              <Badge variant="secondary" className="text-xs font-mono bg-secondary/80">
                {preset.proteinB.pdbId}
              </Badge>
            </div>

            <div className="mt-4 text-xs text-muted-foreground/60 group-hover:text-primary/60 transition-colors">
              Click to compare &rarr;
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
