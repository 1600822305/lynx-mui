import { useState } from '@lynx-js/react'

import { SvgIcon } from './SvgIcon.js'
import { useControlled } from '../hooks/useControlled.js'
import { defaultTheme } from '../system/defaultTheme.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'

export type RatingSize = 'small' | 'medium' | 'large'

export interface RatingProps {
  /** Current value (controlled). Use `defaultValue` for uncontrolled. */
  value?: number | null
  /** @default null */
  defaultValue?: number | null
  /** Maximum number of stars. @default 5 */
  max?: number
  /** @default 'medium' */
  size?: RatingSize
  /** If `true`, the rating is display-only. @default false */
  readOnly?: boolean
  /** If `true`, the rating is disabled. @default false */
  disabled?: boolean
  /**
   * Fires with the next value when a star is tapped.
   * Lynx has no DOM event, so (unlike MUI) only the value is reported.
   */
  onChange?: (value: number | null) => void
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

// Star path data, verbatim from @mui/material/internal/svg-icons (24x24 grid).
const STAR_FILLED =
  'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
const STAR_BORDER =
  'M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z'

// MUI RatingRoot fontSize: pxToRem(18 | 24 | 30) by size.
const SIZE_PX: Record<RatingSize, number> = { small: 18, medium: 24, large: 30 }

// MUI active fill color (confirmed in source: `color: '#faaf00'`).
const ACTIVE_COLOR = '#faaf00'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * MUI `Rating` -> Lynx row of star `<svg>` icons (reusing `SvgIcon`).
 *
 * Filled stars use #faaf00; empty stars use `action.disabled`. Fractional values
 * (e.g. `value={3.5}`, common in read-only displays) render a clipped filled
 * star overlaid on an empty one, matching MUI's half-star look.
 *
 * DEGRADATIONS (Lynx): there is no hover, so MUI's hover preview is dropped and
 * selection is tap-only at integer precision (`precision` < 1 is not supported).
 * Tapping the already-selected star clears the value (matches MUI's clear-on-reclick).
 * Pressing a star scales it to 1.2 for tactile feedback (MUI's `iconActive` transform).
 */
export function Rating(props: RatingProps) {
  const {
    value: valueProp,
    defaultValue = null,
    max = 5,
    size = 'medium',
    readOnly = false,
    disabled = false,
    onChange,
    sx,
    style,
    className,
  } = props

  const theme: Theme = defaultTheme
  const [value, setValue] = useControlled<number | null>(valueProp, defaultValue)
  const [pressedIndex, setPressedIndex] = useState(-1)

  const px = SIZE_PX[size]
  const displayValue = value ?? 0
  const interactive = !readOnly && !disabled

  const rootSx: SxObject = {
    display: 'inline-flex',
    flexDirection: 'row',
    position: 'relative',
  }
  if (disabled) {
    rootSx.opacity = theme.palette.action.disabledOpacity
  }

  const baseStyle = sxToStyle(rootSx, theme)
  const extraStyle = sx ? sxToStyle(sx, theme) : {}
  const rootStyle: LynxStyle = { ...baseStyle, ...extraStyle, ...style }

  const items = Array.from({ length: max }, (_, index) => {
    const itemValue = index + 1
    const fraction = clamp(displayValue - index, 0, 1)
    const pressed = pressedIndex === index

    const iconWrapStyle: LynxStyle = {
      position: 'relative',
      display: 'flex',
      width: `${px}px`,
      height: `${px}px`,
      flexShrink: 0,
      transform: pressed ? 'scale(1.2)' : 'scale(1)',
      transition: 'transform 150ms',
    }

    const overlayStyle: LynxStyle = {
      position: 'absolute',
      top: '0px',
      left: '0px',
      height: `${px}px`,
      width: `${fraction * px}px`,
      overflow: 'hidden',
    }

    const press = interactive
      ? {
          bindtouchstart: () => setPressedIndex(index),
          bindtouchend: () => setPressedIndex(-1),
          bindtouchcancel: () => setPressedIndex(-1),
        }
      : {}

    const tap = interactive
      ? () => {
          const next = value === itemValue ? null : itemValue
          setValue(next)
          onChange?.(next)
        }
      : undefined

    return (
      <view key={itemValue} style={iconWrapStyle} bindtap={tap} {...press}>
        <SvgIcon pathData={STAR_BORDER} htmlColor={theme.palette.action.disabled} size={px} />
        {fraction > 0 ? (
          <view style={overlayStyle}>
            <SvgIcon pathData={STAR_FILLED} htmlColor={ACTIVE_COLOR} size={px} />
          </view>
        ) : null}
      </view>
    )
  })

  return (
    <view className={className} style={rootStyle}>
      {items}
    </view>
  )
}
Rating.displayName = 'Rating'
