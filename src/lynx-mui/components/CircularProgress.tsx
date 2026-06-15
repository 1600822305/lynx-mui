import './progress.css'

import { useTheme } from '../system/ThemeContext.js'
import { resolveColor, sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'

export type CircularProgressColor =
  | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit'
export type CircularProgressVariant = 'determinate' | 'indeterminate'

export interface CircularProgressProps {
  /** @default 'primary' */
  color?: CircularProgressColor
  /** @default 'indeterminate' */
  variant?: CircularProgressVariant
  /** 0–100, only used when variant='determinate'. */
  value?: number
  /** Pixel size of the spinner. @default 40 */
  size?: number
  /** Stroke width. @default 3.6 */
  thickness?: number
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

// MUI constants (v7.3.11 CircularProgress.js)
const SIZE = 44
const CIRCUMFERENCE = 2 * Math.PI * ((SIZE - 3.6) / 2) // 2π·20.2 ≈ 126.920

function resolveStrokeColor(color: CircularProgressColor, theme: Theme): string {
  if (color === 'inherit') return theme.palette.text.primary
  return resolveColor(`${color}.main`, theme)
}

/**
 * MUI `CircularProgress` -> Lynx `<view>` + `<svg content="...">`.
 *
 * determinate: static arc, rotated -90deg to start at 12 o'clock.
 * indeterminate (DEGRADATION): MUI animates both a root rotation and a stroke-dasharray
 * morph on the circle. Lynx cannot morph SVG attributes inside a static `<svg content="...">`
 * string, so we render a fixed ~25% arc (stroke-dasharray="80,200") and continuously
 * rotate the wrapping <view> via CSS @keyframes. This produces a convincing spinner
 * that is visually very close to MUI's.
 */
export function CircularProgress(props: CircularProgressProps) {
  const {
    color = 'primary',
    variant = 'indeterminate',
    value = 0,
    size = 40,
    thickness = 3.6,
    sx,
    style,
    className,
  } = props

  const theme = useTheme()
  const stroke = resolveStrokeColor(color, theme)
  const r = (SIZE - thickness) / 2

  const isDeterminate = variant === 'determinate'

  // Build SVG circle attributes
  const circumference = 2 * Math.PI * r
  let dashArray: string
  let dashOffset: string
  let rootTransform: string | undefined

  if (isDeterminate) {
    const clampedValue = Math.min(100, Math.max(0, value))
    dashArray = circumference.toFixed(3)
    dashOffset = `${((100 - clampedValue) / 100 * circumference).toFixed(3)}px`
    rootTransform = 'rotate(-90deg)'
  } else {
    // Indeterminate: fixed arc, rotation handled by CSS animation
    dashArray = '80,200'
    dashOffset = '0'
  }

  const svgXml = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="22 22 ${SIZE} ${SIZE}">`,
    `<circle cx="${SIZE}" cy="${SIZE}" r="${r.toFixed(1)}"`,
    ` fill="none" stroke="${stroke}" stroke-width="${thickness}"`,
    ` stroke-dasharray="${dashArray}" stroke-dashoffset="${dashOffset}"/>`,
    `</svg>`,
  ].join('')

  const rootSx: SxObject = {
    display: 'inline-flex',
    width: `${size}px`,
    height: `${size}px`,
    flexShrink: 0,
  }
  if (rootTransform) {
    rootSx.transform = rootTransform
  }

  const baseStyle = sxToStyle(rootSx, theme)
  const extraStyle = sx ? sxToStyle(sx, theme) : {}
  const finalStyle: LynxStyle = { ...baseStyle, ...extraStyle, ...style }

  // Indeterminate: apply CSS animation via inline animation property
  if (!isDeterminate) {
    (finalStyle as Record<string, unknown>).animation = 'mui-circular-rotate 1.4s linear infinite'
  }

  return (
    <view className={className} style={finalStyle}>
      <svg
        content={svgXml}
        style={{ width: `${size}px`, height: `${size}px` } as LynxStyle}
      />
    </view>
  )
}
CircularProgress.displayName = 'CircularProgress'
