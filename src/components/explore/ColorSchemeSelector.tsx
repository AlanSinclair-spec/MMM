'use client';

import { Palette } from 'lucide-react';
import { ColorScheme } from '@/types/protein';
import { COLOR_SCHEMES } from '@/lib/visualization/color-schemes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ColorSchemeSelectorProps {
  scheme: ColorScheme;
  onSchemeChange: (scheme: ColorScheme) => void;
  className?: string;
}

/**
 * UI control for selecting protein color schemes
 */
export default function ColorSchemeSelector({
  scheme,
  onSchemeChange,
  className,
}: ColorSchemeSelectorProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <Palette className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Color Scheme</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {COLOR_SCHEMES.map((cs) => (
          <Button
            key={cs.id}
            onClick={() => onSchemeChange(cs.id)}
            variant={scheme === cs.id ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'transition-all',
              scheme === cs.id && 'ring-2 ring-primary ring-offset-1'
            )}
            title={cs.description}
          >
            {cs.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
