import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'
import { alpha } from '../utils/alpha.js'

export type ToggleButtonColor =
  | 'standard' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
export type ToggleButtonSize = 'small' | 'medium' | 'large'

export interface ToggleButtonProps extends BaseProps {
  value?: unknown
  selected?: boolean
  color?: ToggleButtonColor
  size?: ToggleButtonSize
  fullWidth?: boolean
}

interface ToggleButtonOwnerState {
  selected: boolean
  color: ToggleButtonColor
  size: ToggleButtonSize
  fullWidth: boolean
  disabled: boolean
}

/** v7 source: padding per size. */
const sizePadding: Record<ToggleButtonSize, number> = {
  small: 7,
  medium: 11,
  large: 15,
}

/** v7 source: fontSize per size. medium uses theme.typography.button.fontSize (14). */
const sizeFontSize: Record<ToggleButtonSize, number> = {
  small: 13,
  medium: 14,
  large: 15,
}

// MUI v7: action.selectedOpacity = 0.08
const SELECTED_OPACITY = 0.08

function toggleButtonRootStyle(os: ToggleButtonOwnerState, theme: Theme): SxObject {
  const t = theme.typography.button
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: `${theme.shape.borderRadius}px`,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    padding: sizePadding[os.size],
    color: theme.palette.action.active,
  }
  if (os.fullWidth) style.width = '100%'

  // Disabled state (v7 source-confirmed).
  if (os.disabled) {
    style.color = theme.palette.action.disabled
    style.borderColor = theme.palette.action.disabledBackground
  }

  // Selected state: controlled prop, applied directly (not via &:active press).
  if (os.selected && !os.disabled) {
    if (os.color === 'standard') {
      style.color = theme.palette.text.primary
      style.backgroundColor = alpha(theme.palette.text.primary, SELECTED_OPACITY)
    } else {
      const c = theme.palette[os.color]
      style.color = c.main
      style.backgroundColor = alpha(c.main, SELECTED_OPACITY)
    }
  }

  // Press feedback.
  if (!os.disabled) {
    style['&:active'] = {
      backgroundColor: os.selected
        ? alpha(
            os.color === 'standard'
              ? theme.palette.text.primary
              : theme.palette[os.color].main,
            SELECTED_OPACITY + 0.04,
          )
        : alpha(theme.palette.text.primary, 0.04),
    }
  }

  return style
}

function toggleButtonLabelStyle(os: ToggleButtonOwnerState, theme: Theme): LynxStyle {
  const t = theme.typography.button
  const sx: SxObject = {
    fontSize: `${sizeFontSize[os.size]}px`,
    fontWeight: `${t.fontWeight}`,
    lineHeight: `${t.lineHeight}`,
    letterSpacing: `${t.letterSpacing}px`,
    // ToggleButton does NOT uppercase text (unlike Button).
    color: 'inherit',
  }
  if (t.fontFamily) sx.fontFamily = t.fontFamily
  return sxToStyle(sx, theme)
}

/** MUI `ToggleButton` -> Lynx `<view>` + `<text>`. */
export const ToggleButton = createComponent<ToggleButtonOwnerState, ToggleButtonProps>({
  name: 'ToggleButton',
  root: 'view',
  defaultProps: { color: 'standard', size: 'medium', selected: false },
  stateful: { active: true },
  ownerState: (p) => ({
    selected: p.selected === true,
    color: p.color ?? 'standard',
    size: p.size ?? 'medium',
    fullWidth: p.fullWidth === true,
    disabled: p.disabled === true,
  }),
  rootStyle: toggleButtonRootStyle,
  content: ({ ownerState, theme, props }) => (
    <text style={toggleButtonLabelStyle(ownerState, theme)}>
      {props.children}
    </text>
  ),
})
