/**
 * Global keyboard shortcuts definition
 * Centralized location for all keyboard shortcuts in the app
 */

export interface ShortcutDefinition {
  key: string;
  description: string;
  category: 'navigation' | 'visualization' | 'general';
}

export const GLOBAL_SHORTCUTS: ShortcutDefinition[] = [
  // Navigation
  { key: '/', description: 'Focus search', category: 'navigation' },
  { key: 'Escape', description: 'Close dialog / Go back', category: 'navigation' },

  // Visualization (Explore page)
  { key: 'r', description: 'Reset camera view', category: 'visualization' },
  { key: 's', description: 'Cycle visualization styles', category: 'visualization' },
  { key: 'c', description: 'Cycle color schemes', category: 'visualization' },
  { key: 'e', description: 'Export current view', category: 'visualization' },

  // General
  { key: '?', description: 'Show keyboard shortcuts', category: 'general' },
  { key: 't', description: 'Toggle theme', category: 'general' },
];

/**
 * Get shortcuts by category
 */
export function getShortcutsByCategory(category: ShortcutDefinition['category']) {
  return GLOBAL_SHORTCUTS.filter((s) => s.category === category);
}
