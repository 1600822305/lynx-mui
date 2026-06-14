import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export type CardVariant = 'elevation' | 'outlined'

export interface CardProps extends BaseProps {
  /** 0..24, maps to the theme elevation (box-shadow) scale. */
  elevation?: number
  variant?: CardVariant
  /** Disable the rounded corners. */
  square?: boolean
}

interface CardOwnerState {
  elevation: number
  variant: CardVariant
  square: boolean
}

function cardStyle(os: CardOwnerState, theme: Theme): SxObject {
  const style: SxObject = {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    overflow: 'hidden',
  }
  if (!os.square) style.borderRadius = `${theme.shape.borderRadius}px`

  if (os.variant === 'outlined') {
    style.borderWidth = '1px'
    style.borderStyle = 'solid'
    style.borderColor = theme.palette.divider
  } else {
    const max = theme.shadows.length - 1
    const idx = Math.max(0, Math.min(os.elevation, max))
    style.boxShadow = theme.shadows[idx]
  }
  return style
}

/** MUI `Card` -> Lynx `<view>` surface (like Paper, but clips overflow). */
export const Card = createComponent<CardOwnerState, CardProps>({
  name: 'Card',
  root: 'view',
  defaultProps: { elevation: 1, variant: 'elevation', square: false },
  ownerState: (p) => ({
    elevation: p.elevation ?? 1,
    variant: p.variant ?? 'elevation',
    square: p.square === true,
  }),
  rootStyle: cardStyle,
})
