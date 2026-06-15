import './skeleton.css'

import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'
import { alpha } from '../utils/alpha.js'

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded'
export type SkeletonAnimation = 'pulse' | 'wave' | false

export interface SkeletonProps {
  /** @default 'text' */
  variant?: SkeletonVariant
  /** @default 'pulse' — `false` disables the animation. */
  animation?: SkeletonAnimation
  /** Width of the skeleton (number -> px). */
  width?: number | string
  /** Height of the skeleton (number -> px). */
  height?: number | string
  /** Optional children to infer width/height from (rendered invisibly). */
  children?: ReactNode
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

/** number -> `${n}px`, string passes through. */
function toLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

/** Parse a length to px when possible (numbers and `${n}px` strings). */
function toPx(value: number | string | undefined): number | undefined {
  if (value == null) return undefined
  if (typeof value === 'number') return value
  const match = value.match(/^(-?\d+(?:\.\d+)?)px$/)
  return match ? Number(match[1]) : undefined
}

/**
 * MUI `Skeleton` -> Lynx `<view>`.
 *
 * Background = alpha(text.primary, 0.11) on the light theme (1:1 with v7).
 * Variant geometry mirrors the source: text scales 0.6 on the y-axis with a
 * small radius, circular is fully round, rounded uses shape.borderRadius (4px),
 * rectangular is square-cornered.
 *
 * DEGRADATIONS (Lynx):
 *  - `%` border-radius is avoided repo-wide, so `circular` computes a px radius
 *    from the resolved width/height (falls back to a pill radius if unknown).
 *  - MUI's `wave` animates a `::after` pseudo-element; Lynx has no pseudo-elements,
 *    so we render a real overlay <view> with the same moving gradient instead.
 */
export function Skeleton(props: SkeletonProps) {
  const {
    variant = 'text',
    animation = 'pulse',
    width,
    height,
    children,
    sx,
    style,
    className,
  } = props

  const theme: Theme = useTheme()
  const hasChildren = Boolean(children)

  const rootSx: SxObject = {
    display: 'flex',
    backgroundColor: alpha(theme.palette.text.primary, 0.11),
    height: '1.2em',
  }

  // Fill the parent width like MUI's block element when no explicit size/children.
  if (width == null && !hasChildren && variant !== 'circular') {
    rootSx.width = '100%'
  }

  if (variant === 'text') {
    rootSx.marginTop = 0
    rootSx.marginBottom = 0
    rootSx.transformOrigin = '0 55%'
    rootSx.transform = 'scale(1, 0.6)'
    rootSx.borderRadius = '4px'
  } else if (variant === 'circular') {
    const w = toPx(width)
    const h = toPx(height)
    const diameter = w != null && h != null ? Math.min(w, h) : (w ?? h)
    rootSx.borderRadius = diameter != null ? `${diameter / 2}px` : '9999px'
  } else if (variant === 'rounded') {
    rootSx.borderRadius = `${theme.shape.borderRadius}px`
  } else {
    // rectangular
    rootSx.borderRadius = '0px'
  }

  if (hasChildren && width == null) {
    rootSx.maxWidth = 'fit-content'
  }
  if (hasChildren && height == null) {
    rootSx.height = 'auto'
  }

  // The `wave` overlay needs a positioning context and clipping.
  if (animation === 'wave') {
    rootSx.position = 'relative'
    rootSx.overflow = 'hidden'
  }

  if (width != null) rootSx.width = toLength(width)
  if (height != null) rootSx.height = toLength(height)

  const baseStyle = sxToStyle(rootSx, theme)
  const extraStyle = sx ? sxToStyle(sx, theme) : {}
  const rootStyle: LynxStyle = { ...baseStyle, ...extraStyle, ...style }

  if (animation === 'pulse') {
    rootStyle.animation = 'mui-skeleton-pulse 2s ease-in-out 0.5s infinite'
  }

  const waveOverlayStyle: LynxStyle = {
    position: 'absolute',
    top: '0px',
    left: '0px',
    right: '0px',
    bottom: '0px',
    transform: 'translateX(-100%)',
    background: `linear-gradient(90deg, transparent, ${theme.palette.action.hover}, transparent)`,
    animation: 'mui-skeleton-wave 2s linear 0.5s infinite',
  }

  return (
    <view className={className} style={rootStyle}>
      {hasChildren ? <view style={{ visibility: 'hidden' }}>{children}</view> : null}
      {animation === 'wave' ? <view style={waveOverlayStyle} /> : null}
    </view>
  )
}
Skeleton.displayName = 'Skeleton'
