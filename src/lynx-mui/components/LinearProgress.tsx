import './progress.css'

import { defaultTheme } from '../system/defaultTheme.js'
import { resolveColor, sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'
import { lighten } from '../utils/lighten.js'

export type LinearProgressColor =
  | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'inherit'
export type LinearProgressVariant = 'determinate' | 'indeterminate'

export interface LinearProgressProps {
  /** @default 'primary' */
  color?: LinearProgressColor
  /** @default 'indeterminate' */
  variant?: LinearProgressVariant
  /** 0–100, only used when variant='determinate'. */
  value?: number
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

/** MUI v7 getColorShade: lighten(palette[color].main, 0.62) for light theme. */
function getTrackColor(color: LinearProgressColor, theme: Theme): string {
  if (color === 'inherit') return theme.palette.action.hover
  const main = resolveColor(`${color}.main`, theme)
  return lighten(main, 0.62)
}

function getBarColor(color: LinearProgressColor, theme: Theme): string {
  if (color === 'inherit') return theme.palette.text.primary
  return resolveColor(`${color}.main`, theme)
}

/**
 * MUI `LinearProgress` -> Lynx `<view>` (track) + `<view>` (bar).
 *
 * determinate: bar width = `${value}%`. No animation.
 * indeterminate (DEGRADATION): MUI runs two bars with separate keyframe animations.
 * We implement both bars for closer visual fidelity:
 *   - bar1: mui-linear-indeterminate1, 2.1s cubic-bezier(0.65,0.815,0.735,0.395) infinite
 *   - bar2: mui-linear-indeterminate2, 2.1s cubic-bezier(0.165,0.84,0.44,1) 1.15s infinite
 */
export function LinearProgress(props: LinearProgressProps) {
  const {
    color = 'primary',
    variant = 'indeterminate',
    value = 0,
    sx,
    style,
    className,
  } = props

  const theme = defaultTheme
  const trackBg = getTrackColor(color, theme)
  const barBg = getBarColor(color, theme)
  const isDeterminate = variant === 'determinate'

  const rootSx: SxObject = {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    height: '4px',
    width: '100%',
    backgroundColor: trackBg,
  }

  const baseStyle = sxToStyle(rootSx, theme)
  const extraStyle = sx ? sxToStyle(sx, theme) : {}
  const rootStyle: LynxStyle = { ...baseStyle, ...extraStyle, ...style }

  if (isDeterminate) {
    const clampedValue = Math.min(100, Math.max(0, value))
    const barStyle: LynxStyle = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      bottom: '0px',
      height: '4px',
      width: `${clampedValue}%`,
      backgroundColor: barBg,
      transformOrigin: 'left',
    }

    return (
      <view className={className} style={rootStyle}>
        <view style={barStyle} />
      </view>
    )
  }

  // Indeterminate: two animated bars
  const bar1Style: LynxStyle = {
    position: 'absolute',
    top: '0px',
    bottom: '0px',
    height: '4px',
    width: '100%',
    backgroundColor: barBg,
    animation: 'mui-linear-indeterminate1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite',
  } as LynxStyle

  const bar2Style: LynxStyle = {
    position: 'absolute',
    top: '0px',
    bottom: '0px',
    height: '4px',
    width: '100%',
    backgroundColor: barBg,
    animation: 'mui-linear-indeterminate2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite',
  } as LynxStyle

  return (
    <view className={className} style={rootStyle}>
      <view style={bar1Style} />
      <view style={bar2Style} />
    </view>
  )
}
LinearProgress.displayName = 'LinearProgress'
