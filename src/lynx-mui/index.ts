// Public API — mirrors @mui/material entry points.
export { Box } from './components/Box.js'
export type { BoxProps } from './components/Box.js'
export { Typography } from './components/Typography.js'
export type { TypographyProps } from './components/Typography.js'
export { Button } from './components/Button.js'
export type {
  ButtonProps,
  ButtonVariant,
  ButtonColor,
  ButtonSize,
} from './components/Button.js'

// System / theming.
export { defaultTheme } from './system/defaultTheme.js'
export {
  resolveSx,
  sxToStyle,
  mergeState,
  mergeResolved,
  mergeSx,
  resolveColor,
} from './system/resolveSx.js'
export { createComponent } from './system/createComponent.js'
export type {
  BaseProps,
  ElementTag,
  ComponentSpec,
} from './system/createComponent.js'
export { alpha } from './utils/alpha.js'
export type {
  Theme,
  Palette,
  PaletteColor,
  SxObject,
  SxProp,
  TypographyVariant,
  TypographyStyle,
  LynxStyle,
  ResolvedSx,
} from './system/types.js'
