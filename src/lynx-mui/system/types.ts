import type { CSSProperties } from '@lynx-js/types'

/** Lynx-compatible style object (final output passed to `<view style={...}>`). */
export type LynxStyle = CSSProperties

/** Mutable style bag used while resolving sx (before it becomes a LynxStyle). */
export type StyleBag = Record<string, string | number>

export interface PaletteColor {
  main: string
  light: string
  dark: string
  contrastText: string
}

export interface Palette {
  mode: 'light' | 'dark'
  primary: PaletteColor
  secondary: PaletteColor
  error: PaletteColor
  warning: PaletteColor
  info: PaletteColor
  success: PaletteColor
  text: { primary: string; secondary: string; disabled: string }
  background: { default: string; paper: string }
  divider: string
  grey: Record<string, string>
  action: {
    active: string
    hover: string
    hoverOpacity: number
    selected: string
    selectedOpacity: number
    disabled: string
    disabledBackground: string
    disabledOpacity: number
    focus: string
    focusOpacity: number
    activatedOpacity: number
  }
}

export interface TypographyStyle {
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight: number
  letterSpacing: number
  textTransform?: 'none' | 'uppercase'
}

export type TypographyVariant =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'subtitle1' | 'subtitle2'
  | 'body1' | 'body2'
  | 'button' | 'caption' | 'overline'

/** Animation timing scale, mirrors MUI's `theme.transitions` (durations in ms). */
export interface Transitions {
  duration: {
    shortest: number
    shorter: number
    short: number
    standard: number
    complex: number
    enteringScreen: number
    leavingScreen: number
  }
  easing: {
    easeInOut: string
    easeOut: string
    easeIn: string
    sharp: string
  }
}

/** Stacking order for overlay layers (mirrors MUI's `theme.zIndex`). */
export interface ZIndex {
  mobileStepper: number
  fab: number
  speedDial: number
  appBar: number
  drawer: number
  modal: number
  snackbar: number
  tooltip: number
}

/**
 * MUI typography globals (font-weight scale, base sizes, and `pxToRem`).
 * `pxToRem` mirrors MUI's helper but, because this library renders in px on
 * Lynx (the whole scale is pre-converted to px integers), it returns a `px`
 * string instead of `rem` — visually identical at the default 16px base.
 */
export interface TypographyGlobals {
  fontFamily: string
  htmlFontSize: number
  fontSize: number
  fontWeightLight: number
  fontWeightRegular: number
  fontWeightMedium: number
  fontWeightBold: number
  pxToRem: (size: number) => string
}

export interface Theme {
  /** Returns spacing in px. `spacing(2)` -> 16 by default. */
  spacing: (factor: number) => number
  shape: { borderRadius: number }
  palette: Palette
  typography: Record<TypographyVariant, TypographyStyle> & TypographyGlobals
  /** elevation -> box-shadow string. Index 0 is 'none'. */
  shadows: string[]
  /** Stacking order for overlays (AppBar/Drawer/Modal/Snackbar/Tooltip/...). */
  zIndex: ZIndex
  /** Animation duration/easing scale (mirrors MUI's `theme.transitions`). */
  transitions: Transitions
}

/** A value inside an sx object: a raw style value, or a nested object (state selectors). */
export type SxValue = string | number | undefined | SxObject

export interface SxObject {
  [key: string]: SxValue
}

export type SxProp = SxObject | SxObject[] | ((theme: Theme) => SxObject) | undefined

/** sx resolved into a base style plus per-interaction-state overrides. */
export interface ResolvedSx {
  base: StyleBag
  states: {
    active?: StyleBag
    disabled?: StyleBag
    focus?: StyleBag
  }
}
