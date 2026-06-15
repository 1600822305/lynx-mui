import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import { ExpandMoreIcon } from '../icons/index.js'
import type { IconProps } from '../icons/createSvgIcon.js'
import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'

export interface AccordionSummaryProps {
  children?: ReactNode
  /** Override expand icon (default: ExpandMoreIcon). Pass false to hide. */
  expandIcon?: ReactNode | false
  onClick?: () => void
  className?: string
  style?: LynxStyle
  sx?: SxProp
  /** @internal Injected by Accordion. */
  expanded?: boolean
  /** @internal Injected by Accordion. */
  disabled?: boolean
  /** @internal Injected by Accordion. */
  disableGutters?: boolean
  /** @internal Injected by Accordion. */
  onToggle?: () => void
}

/**
 * MUI `AccordionSummary` -> Lynx `<view>` clickable header row with expand icon.
 *
 * Degradations vs MUI:
 * - No ButtonBase ripple; uses simple bindtap.
 * - focusVisible background omitted (Lynx has no keyboard focus state).
 */
export function AccordionSummary(props: AccordionSummaryProps) {
  const theme = useTheme()
  const expanded = props.expanded === true
  const disabled = props.disabled === true
  const disableGutters = props.disableGutters === true

  const { body1 } = theme.typography
  const { duration, easing } = theme.transitions

  // Root style
  const rootSx: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: (!disableGutters && expanded) ? 64 : 48,
    padding: '0px 16px',
    transition: `min-height ${duration.shortest}ms ${easing.easeInOut}, background-color ${duration.shortest}ms ${easing.easeInOut}`,
  }
  if (disabled) rootSx.opacity = theme.palette.action.disabledOpacity
  const rootStyle: LynxStyle = { ...sxToStyle(rootSx, theme), ...sxToStyle(props.sx, theme), ...props.style }

  // Content slot style
  const contentSx: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    margin: (!disableGutters && expanded) ? '20px 0' : '12px 0',
    transition: `margin ${duration.shortest}ms ${easing.easeInOut}`,
  }
  const contentStyle: LynxStyle = sxToStyle(contentSx, theme)

  // Text style for raw string/number children (Lynx <text> needs explicit font props)
  const textStyle: LynxStyle = {
    fontSize: `${body1.fontSize}px`,
    fontWeight: '400',
    lineHeight: `${body1.lineHeight}`,
    letterSpacing: `${body1.letterSpacing}px`,
    color: theme.palette.text.primary,
  }

  // Wrap raw string/number in <text> (Lynx constraint: text can't inherit from view)
  const renderContent = () => {
    const { children } = props
    if (children === null || children === undefined) return null
    if (typeof children === 'string' || typeof children === 'number') {
      return <text style={textStyle}>{children}</text>
    }
    return children
  }

  // Expand icon wrapper
  const expandIconWrapperSx: SxObject = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: `transform ${duration.shortest}ms ${easing.easeInOut}`,
  }
  const expandIconWrapperStyle: LynxStyle = sxToStyle(expandIconWrapperSx, theme)

  const renderExpandIcon = () => {
    if (props.expandIcon === false) return null
    const iconColor = theme.palette.action.active
    if (props.expandIcon && isValidElement(props.expandIcon)) {
      const el = props.expandIcon as ReactElement<IconProps>
      return (
        <view style={expandIconWrapperStyle}>
          {cloneElement(el, { htmlColor: el.props.htmlColor ?? iconColor })}
        </view>
      )
    }
    // Default: ExpandMoreIcon
    return (
      <view style={expandIconWrapperStyle}>
        <ExpandMoreIcon htmlColor={iconColor} />
      </view>
    )
  }

  const tap = disabled
    ? undefined
    : () => {
        props.onToggle?.()
        props.onClick?.()
      }

  return (
    <view className={props.className} style={rootStyle} bindtap={tap}>
      <view style={contentStyle}>
        {renderContent()}
      </view>
      {renderExpandIcon()}
    </view>
  )
}
AccordionSummary.displayName = 'AccordionSummary'
