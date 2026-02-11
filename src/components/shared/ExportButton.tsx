'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ExportButtonProps {
  onClick: () => void;
  isExporting?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showLabel?: boolean;
}

/**
 * Reusable export button component with loading state
 */
export function ExportButton({
  onClick,
  isExporting = false,
  disabled = false,
  variant = 'outline',
  size = 'default',
  className,
  showLabel = true,
}: ExportButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isExporting}
      variant={variant}
      size={size}
      className={cn(className)}
    >
      <Download className={cn('h-4 w-4', showLabel && 'mr-2', isExporting && 'animate-pulse')} />
      {showLabel && (isExporting ? 'Exporting...' : 'Export PNG')}
    </Button>
  );
}
