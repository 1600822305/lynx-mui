import type { ComponentType } from '@lynx-js/react'

import { useControlled } from '../hooks/useControlled.js'
import { usePressState } from '../hooks/usePressState.js'
import type { IconProps } from '../icons/createSvgIcon.js'
import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'
import { alpha } from '../utils/alpha.js'

export type SelectionControlColor =
  | 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
export type SelectionControlSize = 'small' | 'medium'

/** Shared props for the Checkbox/Radio family (mirrors MUI's internal SwitchBase). */
export interface SwitchBaseOwnProps {
  checked?: boolean
  defaultChecked?: boolean
  /** Lynx has no DOM event, so onChange just reports the next checked value. */
  onChange?: (checked: boolean) => void
  value?: unknown
  color?: SelectionControlColor
  size?: SelectionControlSize
  disabled?: boolean
  edge?: 'start' | 'end' | false
  className?: string
  style?: LynxStyle
}

interface SwitchBaseProps extends SwitchBaseOwnProps {
  icon: ComponentType<IconProps>
  checkedIcon: ComponentType<IconProps>
}

// MUI internal/SwitchBase: padding 9, circular hit area.
const HIT_PADDING = 9

type PaletteColorKey = Exclude<SelectionControlColor, 'default'>

function mainColor(color: SelectionControlColor, theme: Theme): string | undefined {
  return color === 'default' ? undefined : theme.palette[color as PaletteColorKey].main
}

/** Icon color: disabled wins, then checked palette color, else text.secondary (v7 source). */
function controlColor(checked: boolean, color: SelectionControlColor, disabled: boolean, theme: Theme): string {
  if (disabled) return theme.palette.action.disabled
  const main = mainColor(color, theme)
  if (checked && main) return main
  return theme.palette.text.secondary
}

function rootStyle(
  checked: boolean,
  color: SelectionControlColor,
  size: SelectionControlSize,
  edge: 'start' | 'end' | false,
  disabled: boolean,
  pressed: boolean,
  theme: Theme,
): LynxStyle {
  const sx: SxObject = {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${HIT_PADDING}px`,
    // Circular hit area; Lynx % radii are avoided repo-wide, so use px = half the box
    // (padding*2 + icon size, where icon = 24 medium / 20 small).
    borderRadius: `${HIT_PADDING + (size === 'small' ? 20 : 24) / 2}px`,
    boxSizing: 'border-box',
  }
  const negative = size === 'small' ? '-3px' : '-12px'
  if (edge === 'start') sx.marginLeft = negative
  if (edge === 'end') sx.marginRight = negative
  if (pressed && !disabled) {
    const base = (checked && mainColor(color, theme)) || theme.palette.action.active
    sx.backgroundColor = alpha(base, 0.08)
  }
  return sxToStyle(sx, theme)
}

/** MUI `internal/SwitchBase` -> Lynx `<view>` wrapping a single icon, with controllable checked state. */
export function SwitchBase(props: SwitchBaseProps) {
  const theme = useTheme()
  const color = props.color ?? 'primary'
  const size = props.size ?? 'medium'
  const edge = props.edge ?? false
  const disabled = props.disabled === true

  const [checked, setChecked] = useControlled(props.checked, props.defaultChecked ?? false)
  const press = usePressState()

  const Icon = checked ? props.checkedIcon : props.icon
  const iconColor = controlColor(checked, color, disabled, theme)
  const style: LynxStyle = {
    ...rootStyle(checked, color, size, edge, disabled, press.pressed, theme),
    ...props.style,
  }

  const tap = disabled
    ? undefined
    : () => {
        const next = !checked
        setChecked(next)
        props.onChange?.(next)
      }

  const touch = disabled ? {} : press.bind

  return (
    <view className={props.className} style={style} bindtap={tap} {...touch}>
      <Icon fontSize={size} htmlColor={iconColor} />
    </view>
  )
}
SwitchBase.displayName = 'SwitchBase'
