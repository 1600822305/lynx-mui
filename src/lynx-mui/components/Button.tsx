import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'
import { alpha } from '../utils/alpha.js'

export type ButtonVariant = 'text' | 'outlined' | 'contained'
export type ButtonColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps extends BaseProps {
  variant?: ButtonVariant
  color?: ButtonColor
  size?: ButtonSize
  fullWidth?: boolean
}

interface ButtonOwnerState {
  variant: ButtonVariant
  color: ButtonColor
  size: ButtonSize
  fullWidth: boolean
  disabled: boolean
}

// Exact MUI padding matrix, keyed by (variant, size). Outlined values are 1px
// smaller to compensate for the border, matching @mui/material.
const paddingMatrix: Record<ButtonVariant, Record<ButtonSize, string>> = {
  text: { small: '4px 5px', medium: '6px 8px', large: '8px 11px' },
  outlined: { small: '3px 9px', medium: '5px 15px', large: '7px 21px' },
  contained: { small: '4px 10px', medium: '6px 16px', large: '8px 22px' },
}

// MUI action.hoverOpacity (0.04) — the tint applied to text/outlined on hover.
const HOVER_OPACITY = 0.04

/** Root (container) variant table -> sx object, including `:active` / disabled states. */
function buttonRootStyle(os: ButtonOwnerState, theme: Theme): SxObject {
  const c = theme.palette[os.color]
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '64px',
    padding: paddingMatrix[os.variant][os.size],
    borderRadius: `${theme.shape.borderRadius}px`,
    transition: 'background-color 0.25s, box-shadow 0.25s, border-color 0.25s, color 0.25s',
  }
  if (os.fullWidth) style.width = '100%'

  if (os.variant === 'contained') {
    style.backgroundColor = c.main
    style.boxShadow = theme.shadows[2]
    style['&:active'] = { backgroundColor: c.dark, boxShadow: theme.shadows[8] }
    style['&.Mui-disabled'] = {
      backgroundColor: theme.palette.action.disabledBackground,
      boxShadow: theme.shadows[0],
    }
  } else if (os.variant === 'outlined') {
    style.backgroundColor = 'transparent'
    style.borderWidth = '1px'
    style.borderStyle = 'solid'
    style.borderColor = alpha(c.main, 0.5)
    style['&:active'] = { backgroundColor: alpha(c.main, HOVER_OPACITY), borderColor: c.main }
    style['&.Mui-disabled'] = { borderColor: theme.palette.action.disabledBackground }
  } else {
    style.backgroundColor = 'transparent'
    style['&:active'] = { backgroundColor: alpha(c.main, HOVER_OPACITY) }
  }
  return style
}

// MUI Button font sizes per size (medium = typography.button = 14).
const labelFontSize: Record<ButtonSize, number> = { small: 13, medium: 14, large: 15 }

/** Label (text slot) variant table -> resolved Lynx style. */
function buttonLabelStyle(os: ButtonOwnerState, theme: Theme): LynxStyle {
  const t = theme.typography.button
  const c = theme.palette[os.color]
  const color = os.disabled
    ? theme.palette.action.disabled
    : os.variant === 'contained' ? c.contrastText : c.main
  const style: SxObject = {
    fontSize: `${labelFontSize[os.size]}px`,
    fontWeight: `${t.fontWeight}`,
    lineHeight: `${t.lineHeight}`,
    letterSpacing: `${t.letterSpacing}px`,
    color,
  }
  if (t.fontFamily) style.fontFamily = t.fontFamily
  return sxToStyle(style, theme)
}

/** MUI `Button` -> Lynx `<view>` (container) + `<text>` (label). */
export const Button = createComponent<ButtonOwnerState, ButtonProps>({
  name: 'Button',
  root: 'view',
  defaultProps: { variant: 'text', color: 'primary', size: 'medium' },
  stateful: { active: true },
  ownerState: (p) => ({
    variant: p.variant ?? 'text',
    color: p.color ?? 'primary',
    size: p.size ?? 'medium',
    fullWidth: p.fullWidth === true,
    disabled: p.disabled === true,
  }),
  rootStyle: buttonRootStyle,
  content: ({ ownerState, theme, props }) => {
    const label = typeof props.children === 'string' ? props.children.toUpperCase() : props.children
    return <text style={buttonLabelStyle(ownerState, theme)}>{label}</text>
  },
})
