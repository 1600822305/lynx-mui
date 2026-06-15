import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ComponentType, ReactElement, ReactNode } from '@lynx-js/react'

import {
  CheckCircleOutlineIcon,
  CloseIcon,
  ErrorOutlineIcon,
  InfoOutlinedIcon,
  ReportProblemOutlinedIcon,
} from '../icons/index.js'
import type { IconProps } from '../icons/createSvgIcon.js'
import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'
import { AlertTitle } from './AlertTitle.js'
import type { AlertTitleProps } from './AlertTitle.js'
import { IconButton } from './IconButton.js'

export type AlertSeverity = 'success' | 'info' | 'warning' | 'error'
export type AlertVariant = 'standard' | 'filled' | 'outlined'
export type AlertColor = AlertSeverity

export interface AlertProps extends BaseProps {
  severity?: AlertSeverity
  variant?: AlertVariant
  /** Overrides `severity` for styling. Defaults to `severity`. */
  color?: AlertColor
  /** Override the icon, or `false` to hide it. */
  icon?: ReactNode
  /** Rendered at the end of the alert. Takes precedence over `onClose`. */
  action?: ReactNode
  /** When set (and no `action`), renders a close `IconButton`. */
  onClose?: () => void
}

interface AlertOwnerState {
  severity: AlertSeverity
  variant: AlertVariant
  color: AlertColor
}

// Light-theme standard text/bg = darken(light,0.6) / lighten(light,0.9) per MUI source.
const STANDARD_TEXT: Record<AlertSeverity, string> = {
  success: '#1e4620',
  info: '#014361',
  warning: '#663c00',
  error: '#5f2120',
}
const STANDARD_BG: Record<AlertSeverity, string> = {
  success: '#edf7ed',
  info: '#e5f6fd',
  warning: '#fff4e5',
  error: '#fdeded',
}

// glyph picked by `severity`; the color comes from `color` (see resolveColors).
const DEFAULT_ICON: Record<AlertSeverity, ComponentType<IconProps>> = {
  success: CheckCircleOutlineIcon,
  warning: ReportProblemOutlinedIcon,
  error: ErrorOutlineIcon,
  info: InfoOutlinedIcon,
}

interface AlertColors {
  text: string
  bg: string
  icon: string
  border?: string
}

function resolveColors(os: AlertOwnerState, theme: Theme): AlertColors {
  const palette = theme.palette[os.color]
  if (os.variant === 'filled') {
    return { text: palette.contrastText, bg: palette.main, icon: palette.contrastText }
  }
  const text = STANDARD_TEXT[os.color]
  const icon = palette.main
  if (os.variant === 'outlined') {
    return { text, bg: 'transparent', icon, border: palette.light }
  }
  return { text, bg: STANDARD_BG[os.color], icon }
}

function alertRootStyle(os: AlertOwnerState, theme: Theme): SxObject {
  const c = resolveColors(os, theme)
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    padding: '6px 16px',
    borderRadius: '4px',
    backgroundColor: c.bg,
  }
  if (c.border) {
    style.borderWidth = '1px'
    style.borderStyle = 'solid'
    style.borderColor = c.border
  }
  return style
}

/** MUI `Alert` -> Lynx `<view>` row with icon / message / action slots. */
export const Alert = createComponent<AlertOwnerState, AlertProps>({
  name: 'Alert',
  root: 'view',
  defaultProps: { severity: 'success', variant: 'standard' },
  ownerState: (p) => ({
    severity: p.severity ?? 'success',
    variant: p.variant ?? 'standard',
    color: p.color ?? p.severity ?? 'success',
  }),
  rootStyle: alertRootStyle,
  content: ({ ownerState, theme, props }) => {
    const c = resolveColors(ownerState, theme)

    const iconStyle = sxToStyle(
      { marginRight: 12, padding: '7px 0', display: 'flex', flexDirection: 'row', opacity: 0.9 },
      theme,
    )
    const messageStyle = sxToStyle({ padding: '8px 0', minWidth: 0, flexGrow: 1 }, theme)
    const actionStyle = sxToStyle(
      {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: '4px 0 0 16px',
        marginLeft: 'auto',
        marginRight: -8,
      },
      theme,
    )

    const body2 = theme.typography.body2
    const messageTextStyle: LynxStyle = {
      fontSize: `${body2.fontSize}px`,
      fontWeight: ownerState.variant === 'filled' ? '500' : '400',
      lineHeight: `${body2.lineHeight}`,
      letterSpacing: `${body2.letterSpacing}px`,
      color: c.text,
    }

    let iconNode: ReactNode = null
    if (props.icon !== false) {
      if (props.icon != null) {
        iconNode = isValidElement(props.icon)
          ? cloneElement(props.icon as ReactElement<IconProps>, {
              size: (props.icon as ReactElement<IconProps>).props.size ?? 22,
              htmlColor: (props.icon as ReactElement<IconProps>).props.htmlColor ?? c.icon,
            })
          : props.icon
      } else {
        const Icon = DEFAULT_ICON[ownerState.severity]
        iconNode = <Icon size={22} htmlColor={c.icon} />
      }
    }

    const kids = Array.isArray(props.children) ? props.children : [props.children]
    const message = kids.map((child, i) => {
      if (child == null || typeof child === 'boolean') return null
      if (typeof child === 'string' || typeof child === 'number') {
        return (
          <text key={i} style={messageTextStyle}>
            {child}
          </text>
        )
      }
      if (isValidElement(child) && child.type === AlertTitle) {
        const el = child as ReactElement<AlertTitleProps>
        return cloneElement(el, { key: i, color: el.props.color ?? c.text })
      }
      return child
    })

    let actionNode: ReactNode = null
    if (props.action != null) {
      actionNode = props.action
    } else if (props.onClose) {
      actionNode = (
        <IconButton size='small' color='inherit' onClick={props.onClose}>
          <CloseIcon htmlColor={c.text} fontSize='small' />
        </IconButton>
      )
    }

    return (
      <>
        {iconNode != null ? <view style={iconStyle}>{iconNode}</view> : null}
        <view style={messageStyle}>{message}</view>
        {actionNode != null ? <view style={actionStyle}>{actionNode}</view> : null}
      </>
    )
  },
})
