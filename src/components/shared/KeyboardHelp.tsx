'use client';

import { useState } from 'react';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GLOBAL_SHORTCUTS } from '@/lib/constants/keyboard-shortcuts';
import { cn } from '@/lib/utils';

/**
 * Keyboard shortcuts help dialog
 * Shows all available keyboard shortcuts organized by category
 */
export function KeyboardHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const categories = {
    navigation: GLOBAL_SHORTCUTS.filter((s) => s.category === 'navigation'),
    visualization: GLOBAL_SHORTCUTS.filter((s) => s.category === 'visualization'),
    general: GLOBAL_SHORTCUTS.filter((s) => s.category === 'general'),
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground"
        title="Show keyboard shortcuts (?)"
      >
        <Keyboard className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Keyboard Shortcuts</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto flex-1 space-y-6">
          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Navigation
            </h3>
            <div className="space-y-2">
              {categories.navigation.map((shortcut) => (
                <ShortcutRow key={shortcut.key} shortcut={shortcut} />
              ))}
            </div>
          </div>

          {/* Visualization */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              Visualization
            </h3>
            <div className="space-y-2">
              {categories.visualization.map((shortcut) => (
                <ShortcutRow key={shortcut.key} shortcut={shortcut} />
              ))}
            </div>
          </div>

          {/* General */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              General
            </h3>
            <div className="space-y-2">
              {categories.general.map((shortcut) => (
                <ShortcutRow key={shortcut.key} shortcut={shortcut} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border bg-secondary/20">
          <p className="text-xs text-muted-foreground text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">?</kbd> to toggle this dialog
          </p>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({ shortcut }: { shortcut: (typeof GLOBAL_SHORTCUTS)[0] }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-foreground">{shortcut.description}</span>
      <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">
        {shortcut.key}
      </kbd>
    </div>
  );
}
