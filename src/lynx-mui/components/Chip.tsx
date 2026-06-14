import type { ReactNode } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'

export type ChipVariant = 'filled' | 'outlined'
export type ChipColor =
  | 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
export type ChipSize = 'small' | 'medium'

/** Named palette colors a Chip can use (excludes the neutral 'default'). */
type ChipPaletteColor = Exclude<ChipColor, 'default'>

export interface ChipProps extends BaseProps {
  label?: ReactNode
  variant?: ChipVariant
  color?: ChipColor
  size?: ChipSize
}

interface ChipOwnerState {
  variant: ChipVariant
  color: ChipColor
  size: ChipSize
}

const chipHeight: Record<ChipSize, string> = { small: '24px', medium: '32px' }
const chipRadius: Record<ChipSize, string> = { small: '12px', medium: '16px' }
const chipPadding: Record<ChipSize, string> = { small: '0 8px', medium: '0 12px' }
const chipFontSize: Record<ChipSize, number> = { small: 12, medium: 13 }

function chipRootStyle(os: ChipOwnerState, theme: Theme): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: chipHeight[os.size],
    borderRadius: chipRadius[os.size],
    padding: chipPadding[os.size],
  }
  const isDefault = os.color === 'default'
  const c = isDefault ? undefined : theme.palette[os.color as ChipPaletteColor]

  if (os.variant === 'outlined') {
    style.backgroundColor = 'transparent'
    style.borderWidth = '1px'
    style.borderStyle = 'solid'
    style.borderColor = c ? c.main : theme.palette.action.disabled
  } else {
    style.backgroundColor = c ? c.main : theme.palette.grey['300']
  }
  return style
}

function chipLabelStyle(os: ChipOwnerState, theme: Theme): LynxStyle {
  const isDefault = os.color === 'default'
  const c = isDefault ? undefined : theme.palette[os.color as ChipPaletteColor]

  let color: string
  if (os.variant === 'outlined') color = c ? c.main : theme.palette.text.primary
  else color = c ? c.contrastText : theme.palette.text.primary

  return sxToStyle({ fontSize: `${chipFontSize[os.size]}px`, color, whiteSpace: 'nowrap' }, theme)
}

/** MUI `Chip` -> Lynx `<view>` (pill) + `<text>` (label). */
export const Chip = createComponent<ChipOwnerState, ChipProps>({
  name: 'Chip',
  root: 'view',
  defaultProps: { variant: 'filled', color: 'default', size: 'medium' },
  ownerState: (p) => ({
    variant: p.variant ?? 'filled',
    color: p.color ?? 'default',
    size: p.size ?? 'medium',
  }),
  rootStyle: chipRootStyle,
  content: ({ ownerState, theme, props }) => (
    <text style={chipLabelStyle(ownerState, theme)}>{props.label ?? props.children}</text>
  ),
})
