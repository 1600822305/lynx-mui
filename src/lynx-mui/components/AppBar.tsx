import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export type AppBarColor = 'primary' | 'secondary' | 'default' | 'transparent' | 'inherit'

/**
 * MUI `position` prop type kept for API compatibility.
 * Lynx degradation: `position:'fixed'` is unreliable in Lynx, so the component
 * always renders with `position:'relative'` (static-like). The prop is accepted
 * but treated as a no-op until Lynx fixed positioning is stable.
 */
export type AppBarPosition = 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative'

export interface AppBarProps extends BaseProps {
  color?: AppBarColor
  elevation?: number
  position?: AppBarPosition
}

interface AppBarOwnerState {
  color: AppBarColor
  elevation: number
}

function appBarStyle(os: AppBarOwnerState, theme: Theme): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    boxSizing: 'border-box',
    flexShrink: 0,
    borderRadius: 0,
    // Lynx degradation: always relative (see AppBarPosition comment above).
    position: 'relative',
  }

  // Elevation shadow (transparent overrides to none).
  if (os.color === 'transparent') {
    style.boxShadow = 'none'
  } else {
    const max = theme.shadows.length - 1
    const idx = Math.max(0, Math.min(os.elevation, max))
    style.boxShadow = theme.shadows[idx]
  }

  // Color variants (v7 source-confirmed).
  switch (os.color) {
    case 'primary':
      style.backgroundColor = theme.palette.primary.main
      style.color = theme.palette.primary.contrastText
      break
    case 'secondary':
      style.backgroundColor = theme.palette.secondary.main
      style.color = theme.palette.secondary.contrastText
      break
    case 'default':
      style.backgroundColor = theme.palette.grey['100']
      style.color = theme.palette.text.primary
      break
    case 'transparent':
      style.backgroundColor = 'transparent'
      style.color = 'inherit'
      break
    case 'inherit':
      style.color = 'inherit'
      break
  }

  return style
}

/** MUI `AppBar` -> Lynx `<view>` (Paper variant, top bar surface). */
export const AppBar = createComponent<AppBarOwnerState, AppBarProps>({
  name: 'AppBar',
  root: 'view',
  defaultProps: { color: 'primary', elevation: 4 },
  ownerState: (p) => ({
    color: p.color ?? 'primary',
    elevation: p.elevation ?? 4,
  }),
  rootStyle: appBarStyle,
})
