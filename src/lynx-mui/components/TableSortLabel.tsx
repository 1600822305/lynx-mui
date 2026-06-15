import type { ComponentType, ReactNode } from '@lynx-js/react'

import { usePressState } from '../hooks/usePressState.js'
import { createSvgIcon } from '../icons/createSvgIcon.js'
import type { IconProps } from '../icons/createSvgIcon.js'
import { defaultTheme } from '../system/defaultTheme.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'

export type TableSortDirection = 'asc' | 'desc'

/** Default sort icon, identical path to `@mui/icons-material/ArrowDownward`. */
const ArrowDownwardIcon = createSvgIcon(
  'm20 12-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8z',
  'ArrowDownward',
)

export interface TableSortLabelProps {
  children?: ReactNode
  /** Active styling (should be true for the sorted column). @default false */
  active?: boolean
  /** Current sort direction. @default 'asc' */
  direction?: TableSortDirection
  /** Hide the sort icon when `active` is false. @default false */
  hideSortIcon?: boolean
  /** Sort icon component. @default ArrowDownwardIcon */
  IconComponent?: ComponentType<IconProps>
  onClick?: () => void
  disabled?: boolean
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/**
 * MUI `TableSortLabel` -> Lynx pressable `<view>` (label `<text>` + rotatable arrow).
 *
 * Property-by-property port of MUI v7.3.11:
 * - root: inline-flex row, alignItems center, justifyContent flex-start.
 * - color: active/idle -> text.primary, hover -> text.secondary (mapped to press).
 * - icon: fontSize 18, marginLeft/Right 4, opacity 0 (idle) / 0.5 (hover) / 1 (active),
 *   color text.secondary; transform rotate(180deg) for asc, rotate(0deg) for desc;
 *   transition opacity+transform over `transitions.duration.shorter`.
 * - `hideSortIcon && !active` removes the icon entirely.
 *
 * Degradations vs MUI:
 * - No hover on Lynx, so the hover styling is driven by press (`&:active`).
 * - Label typography assumes the head-cell style (fontWeight 500 / lineHeight 24px)
 *   because Lynx `<text>` cannot inherit font from the surrounding TableCell.
 */
export function TableSortLabel(props: TableSortLabelProps) {
  const theme = defaultTheme
  const active = props.active === true
  const direction: TableSortDirection = props.direction ?? 'asc'
  const hideSortIcon = props.hideSortIcon === true
  const disabled = props.disabled === true
  const Icon = props.IconComponent ?? ArrowDownwardIcon

  const press = usePressState()
  const pressed = !disabled && press.pressed

  const { text } = theme.palette
  const labelColor = pressed ? text.secondary : text.primary

  const rootSx: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx, theme),
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }

  // Lynx <text> does not inherit font: assume the head-cell typography.
  const labelStyle: LynxStyle = {
    fontFamily: theme.typography.body2.fontFamily,
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '24px',
    letterSpacing: `${theme.typography.body2.letterSpacing}px`,
    color: labelColor,
  }

  const iconOpacity = active ? 1 : pressed ? 0.5 : 0
  const duration = theme.transitions.duration.shorter
  const easing = theme.transitions.easing.easeInOut
  const iconWrapStyle: LynxStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '4px',
    marginRight: '4px',
    opacity: iconOpacity,
    transform: direction === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: `opacity ${duration}ms ${easing} 0ms, transform ${duration}ms ${easing} 0ms`,
  }

  const { children } = props
  let label: ReactNode
  if (children === null || children === undefined || children === false) {
    label = null
  } else if (typeof children === 'string' || typeof children === 'number') {
    label = <text style={labelStyle}>{children}</text>
  } else {
    label = children
  }

  const showIcon = !(hideSortIcon && !active)

  const elementProps: Record<string, unknown> = {
    className: props.className,
    style: rootStyle,
    bindtap: disabled ? undefined : props.onClick,
  }
  if (!disabled) {
    elementProps.bindtouchstart = press.bind.bindtouchstart
    elementProps.bindtouchend = press.bind.bindtouchend
    elementProps.bindtouchcancel = press.bind.bindtouchcancel
  }

  return (
    <view {...elementProps}>
      {label}
      {showIcon
        ? (
          <view style={iconWrapStyle}>
            <Icon size={18} htmlColor={text.secondary} />
          </view>
        )
        : null}
    </view>
  )
}
TableSortLabel.displayName = 'TableSortLabel'
