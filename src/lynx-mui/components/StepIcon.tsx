import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'
import { SvgIcon } from './SvgIcon.js'

export interface StepIconProps {
  /** Whether this step is active. @default false */
  active?: boolean
  /** Mark the step as completed. @default false */
  completed?: boolean
  /** Mark the step as failed. @default false */
  error?: boolean
  /** Label displayed in the icon (number/string -> drawn disc, node -> rendered as-is). */
  icon?: ReactNode
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

// MUI internal svg-icons (internal/svg-icons/CheckCircle.js, Warning.js) — verbatim.
const CHECK_CIRCLE_PATH =
  'M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z'
const WARNING_PATH = 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'

/** MUI `StepIcon` color: text.disabled, primary.main when active/completed, error.main on error. */
function iconColor(active: boolean, completed: boolean, error: boolean, theme: Theme): string {
  if (error) return theme.palette.error.main
  if (completed || active) return theme.palette.primary.main
  return theme.palette.text.disabled
}

/**
 * MUI `StepIcon` -> Lynx.
 *
 * - completed -> `CheckCircle` via `SvgIcon` (htmlColor = primary.main).
 * - error     -> `Warning` via `SvgIcon` (htmlColor = error.main).
 * - otherwise -> a filled disc with the centered step number.
 *
 * DEGRADATION: MUI draws the numbered disc as `<svg><circle/><text/></svg>`.
 * Lynx `<svg content>` text rendering is unreliable, so the disc is a `<view>`
 * (borderRadius = 12px, no `%`) with a child `<text>` for the number — the
 * `<text>` carries explicit font attributes since Lynx text doesn't inherit.
 */
export function StepIcon(props: StepIconProps) {
  const { active = false, completed = false, error = false, icon, className, style, sx } = props
  const theme = useTheme()

  if (typeof icon === 'number' || typeof icon === 'string') {
    const color = iconColor(active, completed, error, theme)

    if (error) {
      return (
        <SvgIcon pathData={WARNING_PATH} htmlColor={color} size={24} className={className} style={style} sx={sx} />
      )
    }
    if (completed) {
      return (
        <SvgIcon pathData={CHECK_CIRCLE_PATH} htmlColor={color} size={24} className={className} style={style} sx={sx} />
      )
    }

    const discSx: SxObject = {
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: 24,
      height: 24,
      borderRadius: '12px',
      backgroundColor: color,
    }
    const numberSx: SxObject = {
      fontSize: `${theme.typography.caption.fontSize}px`,
      fontWeight: '400',
      lineHeight: '1',
      letterSpacing: '0px',
      textAlign: 'center',
      color: theme.palette.primary.contrastText,
    }
    const discStyle: LynxStyle = {
      ...sxToStyle(discSx, theme),
      ...(sx ? sxToStyle(sx, theme) : {}),
      ...style,
    }
    return (
      <view className={className} style={discStyle}>
        <text style={sxToStyle(numberSx, theme)}>{icon}</text>
      </view>
    )
  }

  return <>{icon}</>
}
StepIcon.displayName = 'StepIcon'
