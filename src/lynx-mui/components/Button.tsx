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

const sizePadding: Record<ButtonSize, string> = {
  small: '4px 10px',
  medium: '6px 16px',
  large: '8px 22px',
}

/** Root (container) variant table -> sx object, including `:active` / disabled states. */
function buttonRootStyle(os: ButtonOwnerState, theme: Theme): SxObject {
  const c = theme.palette[os.color]
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '64px',
    padding: sizePadding[os.size],
    borderRadius: `${theme.shape.borderRadius}px`,
    transition: 'background-color 0.2s, box-shadow 0.2s',
  }
  if (os.fullWidth) style.width = '100%'

  if (os.variant === 'contained') {
    style.backgroundColor = c.main
    style.boxShadow = theme.shadows[2]
    style['&:active'] = { backgroundColor: c.dark, boxShadow: theme.shadows[4] }
    style['&.Mui-disabled'] = {
      backgroundColor: theme.palette.action.disabledBackground,
      boxShadow: 'none',
    }
  } else if (os.variant === 'outlined') {
    style.backgroundColor = 'transparent'
    style.borderWidth = '1px'
    style.borderStyle = 'solid'
    style.borderColor = alpha(c.main, 0.5)
    style['&:active'] = { backgroundColor: alpha(c.main, 0.08), borderColor: c.main }
    style['&.Mui-disabled'] = { borderColor: theme.palette.action.disabledBackground }
  } else {
    style.backgroundColor = 'transparent'
    style['&:active'] = { backgroundColor: alpha(c.main, 0.08) }
  }
  return style
}

/** Label (text slot) variant table -> resolved Lynx style. */
function buttonLabelStyle(os: ButtonOwnerState, theme: Theme): LynxStyle {
  const t = theme.typography.button
  const c = theme.palette[os.color]
  const color = os.disabled
    ? theme.palette.action.disabled
    : os.variant === 'contained' ? c.contrastText : c.main
  return sxToStyle({
    fontFamily: t.fontFamily,
    fontSize: `${t.fontSize}px`,
    fontWeight: `${t.fontWeight}`,
    lineHeight: `${t.lineHeight}`,
    letterSpacing: `${t.letterSpacing}px`,
    color,
  }, theme)
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
