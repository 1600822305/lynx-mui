import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export interface CardActionAreaProps extends BaseProps {}

/**
 * MUI `CardActionArea` -> Lynx `<view>` with press feedback.
 * MUI source: display 'block', textAlign 'inherit', borderRadius 'inherit',
 * width '100%'. Hover/focus shows an overlay at action.hoverOpacity/focusOpacity.
 * Lynx: uses the factory's stateful.active for press feedback, applying a
 * subtle background tint on press (similar to MUI's focusHighlight overlay).
 */
function cardActionAreaStyle(_os: Record<string, never>, theme: Theme): SxObject {
  return {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderRadius: 'inherit',
    overflow: 'hidden',
    '&:active': {
      backgroundColor: theme.palette.action.hover,
    },
  }
}

/** MUI `CardActionArea` -> Lynx pressable `<view>` wrapper. */
export const CardActionArea = createComponent<Record<string, never>, CardActionAreaProps>({
  name: 'CardActionArea',
  root: 'view',
  stateful: { active: true },
  rootStyle: cardActionAreaStyle,
})
