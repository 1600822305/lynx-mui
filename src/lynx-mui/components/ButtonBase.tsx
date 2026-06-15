import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export interface ButtonBaseProps extends BaseProps {
  /** No-op on Lynx (no ripple); kept for API parity. */
  disableRipple?: boolean
  /** No-op on Lynx (no ripple); kept for API parity. */
  centerRipple?: boolean
  /** No-op on Lynx (no ripple); kept for API parity. */
  focusRipple?: boolean
  /** No-op on Lynx (no ripple); kept for API parity. */
  disableTouchRipple?: boolean
}

interface ButtonBaseOwnerState {
  disabled: boolean
}

/**
 * Style reset for the interactive base, mirroring MUI's ButtonBaseRoot. The DOM
 * resets that have no Lynx equivalent (outline/appearance/cursor/tap-highlight)
 * are dropped; the layout + transparency resets are kept.
 */
function rootStyle(): SxObject {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    borderWidth: '0px',
    borderStyle: 'solid',
    margin: '0px',
    borderRadius: '0px',
    padding: '0px',
  }
}

/**
 * MUI `ButtonBase` -> Lynx pressable `<view>`. Contains as few styles as
 * possible; it's the building block for buttons.
 *
 * DEGRADATION: no ripple / focus-visible ring (Lynx has no DOM event model);
 * the ripple-related props are accepted but inert. `disabled` gates the tap
 * handler (handled by the factory).
 */
export const ButtonBase = createComponent<ButtonBaseOwnerState, ButtonBaseProps>({
  name: 'ButtonBase',
  root: 'view',
  defaultProps: {
    disableRipple: false,
    centerRipple: false,
    focusRipple: false,
    disableTouchRipple: false,
  },
  ownerState: (p) => ({ disabled: p.disabled === true }),
  rootStyle,
})
