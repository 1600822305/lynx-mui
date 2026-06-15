import type { CSSProperties } from '@lynx-js/types'

import { defaultTheme } from './defaultTheme.js'
import { getScreenWidth } from './screen.js'
import {
  aliasProps,
  colorProps,
  spacingShorthands,
  spacingValueProps,
} from './shorthands.js'
import type {
  LynxStyle,
  PaletteColor,
  ResolvedSx,
  SxObject,
  SxProp,
  SxValue,
  StyleBag,
  Theme,
} from './types.js'

/** sx keys that map to interaction-state buckets (Lynx inline style can't carry pseudo-classes). */
const stateSelectors: Record<string, keyof ResolvedSx['states']> = {
  '&:active': 'active',
  '&:hover': 'active', // no hover on mobile -> treat as press feedback
  '&.Mui-disabled': 'disabled',
  '&:disabled': 'disabled',
  '&.Mui-focused': 'focus',
  '&:focus': 'focus',
}

/** Resolve a palette token like 'primary.main' / 'text.secondary' / 'divider' against the theme. */
export function resolveColor(value: string, theme: Theme): string {
  const p = theme.palette
  switch (value) {
    case 'divider': return p.divider
    case 'background.default': return p.background.default
    case 'background.paper': return p.background.paper
    case 'text.primary': return p.text.primary
    case 'text.secondary': return p.text.secondary
    case 'text.disabled': return p.text.disabled
  }

  const [group, key] = value.split('.')
  const colorGroups: Record<string, PaletteColor> = {
    primary: p.primary,
    secondary: p.secondary,
    error: p.error,
    warning: p.warning,
    info: p.info,
    success: p.success,
  }
  const g = colorGroups[group]
  if (g && (key === 'main' || key === 'light' || key === 'dark' || key === 'contrastText')) {
    return g[key]
  }
  if (group === 'grey' && key in p.grey) return p.grey[key]
  return value
}

function spacingToCss(value: string | number, theme: Theme): string | number {
  return typeof value === 'number' ? `${theme.spacing(value)}px` : value
}

/** A value like `{ xs: '100%', md: 600 }` — every key is a known breakpoint. */
function isResponsiveObject(value: SxObject, theme: Theme): boolean {
  const keys = Object.keys(value)
  if (keys.length === 0) return false
  return keys.every((k) => k in theme.breakpoints.values)
}

/**
 * Collapse an MUI responsive value `{ xs, sm, md, ... }` to the single value for
 * the current screen width: the largest breakpoint whose min-width <= width
 * wins (mobile-first), falling back to the smallest defined key.
 */
function resolveResponsive(value: SxObject, theme: Theme): SxValue {
  const width = getScreenWidth()
  let picked: SxValue
  for (const key of theme.breakpoints.keys) {
    const v = value[key]
    if (v === undefined) continue
    if (theme.breakpoints.values[key] <= width) picked = v
  }
  if (picked === undefined) {
    for (const key of theme.breakpoints.keys) {
      if (value[key] !== undefined) return value[key]
    }
  }
  return picked
}

/**
 * Props whose numeric value is unitless (mirrors React DOM's unitless list).
 * Every other numeric length gets `px` appended, because Lynx rejects bare
 * lengths ("CSS length need units (except 0)") whereas MUI/React tolerate them.
 */
const unitlessProps = new Set<string>([
  'flex',
  'flexGrow',
  'flexShrink',
  'order',
  'fontWeight',
  'lineHeight',
  'opacity',
  'zIndex',
  'aspectRatio',
  'zoom',
])

function applyEntry(
  target: StyleBag,
  key: string,
  value: string | number,
  theme: Theme,
): void {
  // spacing shorthands: p / px / mt ...
  const longhands = spacingShorthands[key]
  if (longhands) {
    const css = spacingToCss(value, theme)
    for (const prop of longhands) target[prop] = css
    return
  }

  // gap / rowGap / columnGap: numeric -> spacing units
  if (spacingValueProps.has(key)) {
    target[key] = spacingToCss(value, theme)
    return
  }

  const cssKey = aliasProps[key] ?? key

  // borderRadius number -> multiple of shape.borderRadius (MUI semantics)
  if (cssKey === 'borderRadius' && typeof value === 'number') {
    target[cssKey] = `${value * theme.shape.borderRadius}px`
    return
  }

  // palette token resolution for color props
  if (colorProps.has(cssKey) && typeof value === 'string') {
    target[cssKey] = resolveColor(value, theme)
    return
  }

  // bare numbers -> px for length props (MUI/React semantics); 0 and unitless
  // props (flexGrow, lineHeight, zIndex, ...) are left untouched.
  if (typeof value === 'number' && value !== 0 && !unitlessProps.has(cssKey)) {
    target[cssKey] = `${value}px`
    return
  }

  target[cssKey] = value
}

function walk(obj: SxObject, target: StyleBag, out: ResolvedSx, theme: Theme): void {
  for (const key in obj) {
    const value = obj[key]
    if (value === undefined) continue

    // nested state selector
    const stateName = stateSelectors[key]
    if (stateName !== undefined) {
      if (typeof value === 'object') {
        const bag: StyleBag = out.states[stateName] ?? {}
        walk(value, bag, out, theme)
        out.states[stateName] = bag
      }
      continue
    }

    if (typeof value === 'object') {
      // responsive value: { xs, sm, md, ... } -> pick the value for current width
      if (isResponsiveObject(value, theme)) {
        const picked = resolveResponsive(value, theme)
        if (typeof picked === 'string' || typeof picked === 'number') {
          applyEntry(target, key, picked, theme)
        }
        continue
      }
      // unknown nested object (e.g. other selector) — flatten into base for now
      walk(value, target, out, theme)
      continue
    }

    applyEntry(target, key, value, theme)
  }
}

/** Translate an MUI-style sx prop into a base style + interaction-state overrides. */
export function resolveSx(sx: SxProp, theme: Theme = defaultTheme): ResolvedSx {
  const out: ResolvedSx = { base: {}, states: {} }
  if (sx === undefined) return out

  const list = Array.isArray(sx) ? sx : [sx]
  for (const entry of list) {
    const obj = typeof entry === 'function' ? entry(theme) : entry
    walk(obj, out.base, out, theme)
  }
  return out
}

function mergeBag(a?: StyleBag, b?: StyleBag): StyleBag | undefined {
  if (!a) return b
  if (!b) return a
  return { ...a, ...b }
}

/** Merge two resolved sx results (b wins), preserving per-state buckets. */
export function mergeResolved(a: ResolvedSx, b: ResolvedSx): ResolvedSx {
  return {
    base: { ...a.base, ...b.base },
    states: {
      active: mergeBag(a.states.active, b.states.active),
      disabled: mergeBag(a.states.disabled, b.states.disabled),
      focus: mergeBag(a.states.focus, b.states.focus),
    },
  }
}

/** Merge the base style with the overrides for the currently-active interaction states. */
export function mergeState(
  resolved: ResolvedSx,
  flags: { active?: boolean; disabled?: boolean; focus?: boolean },
): LynxStyle {
  const merged: StyleBag = { ...resolved.base }
  if (flags.focus && resolved.states.focus) Object.assign(merged, resolved.states.focus)
  if (flags.active && resolved.states.active) Object.assign(merged, resolved.states.active)
  if (flags.disabled && resolved.states.disabled) Object.assign(merged, resolved.states.disabled)
  return merged as CSSProperties
}

/** Convenience: resolve + flatten base only (no interaction state). */
export function sxToStyle(sx: SxProp, theme: Theme = defaultTheme): LynxStyle {
  return resolveSx(sx, theme).base as CSSProperties
}

/** Shallow-merge several sx objects (later wins), preserving nested state selectors. */
export function mergeSx(...parts: Array<SxObject | undefined>): SxObject {
  const out: SxObject = {}
  for (const part of parts) {
    if (!part) continue
    Object.assign(out, part)
  }
  return out
}
