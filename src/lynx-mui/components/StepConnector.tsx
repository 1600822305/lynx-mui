import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'
import { useStepperContext } from './StepperContext.js'

export interface StepConnectorProps {
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

function connectorRootSx(orientation: 'horizontal' | 'vertical', alternativeLabel: boolean): SxObject {
  const sx: SxObject = {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  }
  if (orientation === 'vertical') {
    sx.marginLeft = '12px' // half icon
  }
  if (alternativeLabel) {
    sx.position = 'absolute'
    sx.top = '12px' // 8 + 4
    sx.left = 'calc(-50% + 20px)'
    sx.right = 'calc(50% + 20px)'
  }
  return sx
}

function connectorLineSx(orientation: 'horizontal' | 'vertical', theme: Theme): SxObject {
  const borderColor = theme.palette.grey['400'] // light mode
  if (orientation === 'vertical') {
    return {
      borderLeftStyle: 'solid',
      borderLeftWidth: '1px',
      borderLeftColor: borderColor,
      minHeight: '24px',
    }
  }
  return {
    flexGrow: 1,
    borderTopStyle: 'solid',
    borderTopWidth: '1px',
    borderTopColor: borderColor,
  }
}

/**
 * MUI `StepConnector` -> Lynx `<view>` (root) + `<view>` (line).
 *
 * The default theme line color is static (`grey[400]`); MUI exposes
 * active/completed line states only via class overrides, which the default
 * theme does not style — so they are intentionally not reflected here.
 */
export function StepConnector(props: StepConnectorProps) {
  const { className, style, sx } = props
  const theme = useTheme()
  const { alternativeLabel, orientation } = useStepperContext()

  const rootStyle: LynxStyle = {
    ...sxToStyle(connectorRootSx(orientation, alternativeLabel), theme),
    ...(sx ? sxToStyle(sx, theme) : {}),
    ...style,
  }
  const lineStyle = sxToStyle(connectorLineSx(orientation, theme), theme)

  return (
    <view className={className} style={rootStyle}>
      <view style={lineStyle} />
    </view>
  )
}
StepConnector.displayName = 'StepConnector'
