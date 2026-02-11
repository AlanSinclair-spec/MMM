import { ColorScheme, ColorSchemeDefinition, VisualizationStyle } from '@/types/protein';

/**
 * Available color schemes for protein visualization
 * Uses 3Dmol.js built-in color schemes
 */
export const COLOR_SCHEMES: ColorSchemeDefinition[] = [
  {
    id: 'spectrum',
    label: 'Spectrum',
    description: 'Rainbow gradient from N-terminus (blue) to C-terminus (red)',
  },
  {
    id: 'secondary',
    label: 'Secondary Structure',
    description: 'Color by secondary structure: helices, sheets, and loops',
  },
  {
    id: 'chain',
    label: 'Chain',
    description: 'Different color for each protein chain',
  },
  {
    id: 'bfactor',
    label: 'B-Factor',
    description: 'Color by temperature factor (blue = rigid, red = flexible)',
  },
  {
    id: 'residue',
    label: 'Residue Type',
    description: 'Color by amino acid properties (Jmol standard)',
  },
];

/**
 * Apply a color scheme to a 3Dmol viewer
 * @param viewer - The 3Dmol viewer instance
 * @param scheme - The color scheme to apply
 * @param style - The visualization style
 * @param $3Dmol - The 3Dmol library instance
 */
export function applyColorScheme(
  viewer: any,
  scheme: ColorScheme,
  style: VisualizationStyle,
  $3Dmol: any
): void {
  if (!viewer) return;

  // Clear existing styles
  viewer.removeAllSurfaces();
  viewer.setStyle({}, {});

  // Build style configuration based on visualization style and color scheme
  const styleConfig = buildStyleConfig(scheme, style, $3Dmol);

  // Apply the style
  viewer.setStyle({}, styleConfig);
  viewer.render();
}

/**
 * Build the 3Dmol style configuration
 * @param scheme - Color scheme
 * @param style - Visualization style
 * @param $3Dmol - The 3Dmol library instance
 * @returns Style configuration object
 */
function buildStyleConfig(
  scheme: ColorScheme,
  style: VisualizationStyle,
  $3Dmol: any
): any {
  const colorConfig = getColorConfig(scheme);
  const baseStyle: any = {};

  switch (style) {
    case 'cartoon':
      baseStyle.cartoon = { ...colorConfig };
      break;

    case 'stick':
      baseStyle.stick = {
        ...colorConfig,
        radius: 0.15,
      };
      break;

    case 'sphere':
      baseStyle.sphere = {
        ...colorConfig,
        scale: 0.3,
      };
      break;

    case 'surface':
      baseStyle.stick = {
        ...colorConfig,
        radius: 0.1,
      };
      // Surface rendering will be added separately
      break;

    case 'line':
      baseStyle.line = {
        ...colorConfig,
      };
      break;
  }

  return baseStyle;
}

/**
 * Get the color configuration for a scheme
 * @param scheme - Color scheme
 * @returns Color configuration object for 3Dmol
 */
function getColorConfig(scheme: ColorScheme): any {
  switch (scheme) {
    case 'spectrum':
      return { color: 'spectrum' };

    case 'secondary':
      return { colorscheme: 'ssBased' };

    case 'chain':
      return { colorscheme: 'chain' };

    case 'bfactor':
      return {
        colorscheme: {
          prop: 'b',
          gradient: 'roygb', // Blue (low) to red (high)
        },
      };

    case 'residue':
    default:
      return { colorscheme: 'Jmol' };
  }
}

/**
 * Add surface rendering if needed
 * @param viewer - The 3Dmol viewer instance
 * @param scheme - Color scheme
 * @param $3Dmol - The 3Dmol library instance
 */
export function addSurfaceRendering(
  viewer: any,
  scheme: ColorScheme,
  $3Dmol: any
): void {
  if (!viewer || !$3Dmol) return;

  const colorConfig = getColorConfig(scheme);

  viewer.addSurface($3Dmol.SurfaceType.VDW, {
    opacity: 0.85,
    ...colorConfig,
  });

  viewer.render();
}

/**
 * Get a color scheme by ID
 * @param id - Color scheme ID
 * @returns Color scheme definition or default
 */
export function getColorScheme(id: ColorScheme): ColorSchemeDefinition {
  return COLOR_SCHEMES.find(s => s.id === id) || COLOR_SCHEMES[0];
}
