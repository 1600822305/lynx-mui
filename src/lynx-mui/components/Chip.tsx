import type { ReactNode } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'
import { alpha } from '../utils/alpha.js'

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

// MUI: height 32 (small 24); borderRadius is always 32/2 = 16 (fully rounded).
// fontSize is 13 for both sizes. Horizontal padding lives on the label and is
// 1px tighter for outlined (to offset the border).
const chipHeight: Record<ChipSize, string> = { small: '24px', medium: '32px' }
const CHIP_FONT_SIZE = 13

const chipPadding: Record<ChipVariant, Record<ChipSize, string>> = {
  filled: { small: '0 8px', medium: '0 12px' },
  outlined: { small: '0 7px', medium: '0 11px' },
}

function chipRootStyle(os: ChipOwnerState, theme: Theme): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: chipHeight[os.size],
    borderRadius: '16px',
    padding: chipPadding[os.variant][os.size],
  }
  const isDefault = os.color === 'default'
  const c = isDefault ? undefined : theme.palette[os.color as ChipPaletteColor]

  if (os.variant === 'outlined') {
    style.backgroundColor = 'transparent'
    style.borderWidth = '1px'
    style.borderStyle = 'solid'
    // default -> grey[400]; colored -> alpha(main, 0.7)
    style.borderColor = c ? alpha(c.main, 0.7) : theme.palette.grey['400']
  } else {
    // default filled -> action.selected (rgba(0,0,0,0.08)); colored -> main
    style.backgroundColor = c ? c.main : theme.palette.action.selected
  }
  return style
}

function chipLabelStyle(os: ChipOwnerState, theme: Theme): LynxStyle {
  const isDefault = os.color === 'default'
  const c = isDefault ? undefined : theme.palette[os.color as ChipPaletteColor]

  let color: string
  if (os.variant === 'outlined') color = c ? c.main : theme.palette.text.primary
  else color = c ? c.contrastText : theme.palette.text.primary

  return sxToStyle({ fontSize: `${CHIP_FONT_SIZE}px`, color, whiteSpace: 'nowrap' }, theme)
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
