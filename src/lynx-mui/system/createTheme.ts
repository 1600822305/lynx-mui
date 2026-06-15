import { darken, lighten } from '../utils/lighten.js'
import { createBreakpoints } from './createBreakpoints.js'
import { defaultTheme } from './defaultTheme.js'
import type {
  Palette,
  PaletteColor,
  PaletteColorOptions,
  Theme,
  ThemeOptions,
  TypographyGlobals,
} from './types.js'

// MUI's `light`/`dark` palette exports use these as the candidate text colors
// in `getContrastText` (createPalette.js). Verbatim.
const DARK_TEXT_PRIMARY = '#fff'
const LIGHT_TEXT_PRIMARY = 'rgba(0, 0, 0, 0.87)'

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Recursive merge: plain objects merge, everything else (incl. functions) is replaced. */
function deepMerge<T>(target: T, source: Record<string, unknown> | undefined): T {
  if (!source) return target
  const output: Record<string, unknown> = { ...(target as Record<string, unknown>) }
  for (const key of Object.keys(source)) {
    const sourceValue = source[key]
    const targetValue = output[key]
    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      output[key] = deepMerge(targetValue, sourceValue)
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue
    }
  }
  return output as T
}

function toRgb(color: string): [number, number, number] {
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ]
  }
  const match = color.match(/rgba?\(([^)]+)\)/)
  if (match) {
    const parts = match[1].split(',').map((s) => parseFloat(s))
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0]
  }
  return [0, 0, 0]
}

/** Relative luminance, mirroring MUI `getLuminance` (sRGB gamma + WCAG coefficients). */
function getLuminance(color: string): number {
  const rgb = toRgb(color).map((raw) => {
    const value = raw / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3))
}

/** WCAG contrast ratio, mirroring MUI `getContrastRatio`. */
function getContrastRatio(foreground: string, background: string): number {
  const lumA = getLuminance(foreground)
  const lumB = getLuminance(background)
  return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05)
}

type TonalOffset = number | { light: number; dark: number }

/**
 * Fills in `light`/`dark`/`contrastText` from `main`, mirroring MUI's
 * `augmentColor` + `addLightOrDark` + `getContrastText` (createPalette.js).
 */
function augmentColor(
  color: PaletteColorOptions,
  tonalOffset: TonalOffset,
  contrastThreshold: number,
): PaletteColor {
  const tonalOffsetLight = typeof tonalOffset === 'number' ? tonalOffset : tonalOffset.light
  const tonalOffsetDark = typeof tonalOffset === 'number' ? tonalOffset * 1.5 : tonalOffset.dark
  const main = color.main
  const contrastText =
    color.contrastText ??
    (getContrastRatio(main, DARK_TEXT_PRIMARY) >= contrastThreshold
      ? DARK_TEXT_PRIMARY
      : LIGHT_TEXT_PRIMARY)
  return {
    main,
    light: color.light ?? lighten(main, tonalOffsetLight),
    dark: color.dark ?? darken(main, tonalOffsetDark),
    contrastText,
  }
}

interface PaletteModeDefaults {
  text: Palette['text']
  background: Palette['background']
  divider: string
  action: Palette['action']
}

const LIGHT_DEFAULTS: PaletteModeDefaults = {
  text: defaultTheme.palette.text,
  background: defaultTheme.palette.background,
  divider: defaultTheme.palette.divider,
  action: defaultTheme.palette.action,
}

// MUI's `dark` palette export (createPalette.js getDark()), verbatim.
const DARK_DEFAULTS: PaletteModeDefaults = {
  text: {
    primary: '#fff',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
  background: { default: '#121212', paper: '#121212' },
  divider: 'rgba(255, 255, 255, 0.12)',
  action: {
    active: '#fff',
    hover: 'rgba(255, 255, 255, 0.08)',
    hoverOpacity: 0.08,
    selected: 'rgba(255, 255, 255, 0.16)',
    selectedOpacity: 0.16,
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
    disabledOpacity: 0.38,
    focus: 'rgba(255, 255, 255, 0.12)',
    focusOpacity: 0.12,
    activatedOpacity: 0.24,
  },
}

/**
 * Mirrors `@mui/material`'s `createTheme`: deep-merges options onto the default
 * theme and augments palette colors (light/dark/contrastText from `main`).
 *
 * Scope note: typography variants are deep-merged (explicit per-variant
 * overrides win); MUI's automatic variant recompute from `fontSize` alone is not
 * reproduced. Dark-mode intent defaults fall back to the light defaults, so pass
 * explicit `main` colors for dark themes (as MUI apps typically do).
 */
export function createTheme(options: ThemeOptions = {}): Theme {
  const paletteInput = options.palette ?? {}
  const mode = paletteInput.mode ?? 'light'
  const tonalOffset = paletteInput.tonalOffset ?? 0.2
  const contrastThreshold = paletteInput.contrastThreshold ?? 3
  const modeDefaults = mode === 'dark' ? DARK_DEFAULTS : LIGHT_DEFAULTS

  const palette: Palette = {
    mode,
    primary: augmentColor(paletteInput.primary ?? defaultTheme.palette.primary, tonalOffset, contrastThreshold),
    secondary: augmentColor(paletteInput.secondary ?? defaultTheme.palette.secondary, tonalOffset, contrastThreshold),
    error: augmentColor(paletteInput.error ?? defaultTheme.palette.error, tonalOffset, contrastThreshold),
    warning: augmentColor(paletteInput.warning ?? defaultTheme.palette.warning, tonalOffset, contrastThreshold),
    info: augmentColor(paletteInput.info ?? defaultTheme.palette.info, tonalOffset, contrastThreshold),
    success: augmentColor(paletteInput.success ?? defaultTheme.palette.success, tonalOffset, contrastThreshold),
    text: deepMerge(modeDefaults.text, paletteInput.text),
    background: deepMerge(modeDefaults.background, paletteInput.background),
    divider: paletteInput.divider ?? modeDefaults.divider,
    grey: deepMerge(defaultTheme.palette.grey, paletteInput.grey),
    action: deepMerge(modeDefaults.action, paletteInput.action),
  }

  const spacingInput = options.spacing
  const spacing =
    typeof spacingInput === 'function'
      ? spacingInput
      : ((): ((factor: number) => number) => {
          const unit = typeof spacingInput === 'number' ? spacingInput : 8
          return (factor: number) => factor * unit
        })()

  const typography = deepMerge(
    defaultTheme.typography,
    options.typography as Record<string, unknown> | undefined,
  ) as Theme['typography'] & TypographyGlobals

  return {
    spacing,
    shape: deepMerge(defaultTheme.shape, options.shape),
    palette,
    typography,
    shadows: options.shadows ?? defaultTheme.shadows,
    zIndex: deepMerge(defaultTheme.zIndex, options.zIndex),
    transitions: deepMerge(defaultTheme.transitions, options.transitions as Record<string, unknown> | undefined),
    breakpoints: createBreakpoints(options.breakpoints ?? {}),
  }
}
