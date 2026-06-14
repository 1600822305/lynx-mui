import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export type PaperVariant = 'elevation' | 'outlined'

export interface PaperProps extends BaseProps {
  /** 0..24, maps to the theme elevation (box-shadow) scale. */
  elevation?: number
  variant?: PaperVariant
  /** Disable the rounded corners. */
  square?: boolean
}

interface PaperOwnerState {
  elevation: number
  variant: PaperVariant
  square: boolean
}

function paperStyle(os: PaperOwnerState, theme: Theme): SxObject {
  const style: SxObject = {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    transition: 'box-shadow 0.3s',
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

/** MUI `Paper` -> Lynx `<view>` surface (elevation shadow or outlined border). */
export const Paper = createComponent<PaperOwnerState, PaperProps>({
  name: 'Paper',
  root: 'view',
  defaultProps: { elevation: 1, variant: 'elevation', square: false },
  ownerState: (p) => ({
    elevation: p.elevation ?? 1,
    variant: p.variant ?? 'elevation',
    square: p.square === true,
  }),
  rootStyle: paperStyle,
})
