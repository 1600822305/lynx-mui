import type { ComponentType, ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'
import { StepIcon } from './StepIcon.js'
import type { StepIconProps } from './StepIcon.js'
import { useStepContext } from './StepContext.js'
import { useStepperContext } from './StepperContext.js'

export interface StepLabelProps {
  /** Label content (usually a string title). */
  children?: ReactNode
  /** Mark the step as failed. @default false */
  error?: boolean
  /** Override the icon shown by the label. */
  icon?: ReactNode
  /** Optional node displayed below the label. */
  optional?: ReactNode
  /** Component rendered for the step icon. @default StepIcon */
  StepIconComponent?: ComponentType<StepIconProps>
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

function rootSx(
  orientation: 'horizontal' | 'vertical',
  alternativeLabel: boolean,
): SxObject {
  const sx: SxObject = { display: 'flex', alignItems: 'center' }
  if (orientation === 'vertical') {
    sx.textAlign = 'left'
    sx.paddingTop = '8px'
    sx.paddingBottom = '8px'
  }
  if (alternativeLabel) sx.flexDirection = 'column'
  return sx
}

function iconContainerSx(alternativeLabel: boolean): SxObject {
  return {
    flexShrink: 0,
    display: 'flex',
    paddingRight: alternativeLabel ? '0px' : '8px',
  }
}

function labelContainerSx(alternativeLabel: boolean, theme: Theme): SxObject {
  const sx: SxObject = { width: '100%', color: theme.palette.text.secondary }
  if (alternativeLabel) sx.textAlign = 'center'
  return sx
}

function labelSx(
  active: boolean,
  completed: boolean,
  error: boolean,
  alternativeLabel: boolean,
  theme: Theme,
): SxObject {
  const body2 = theme.typography.body2
  const sx: SxObject = {
    fontSize: `${body2.fontSize}px`,
    fontWeight: '400',
    lineHeight: `${body2.lineHeight}`,
    letterSpacing: `${body2.letterSpacing}px`,
    color: theme.palette.text.secondary,
  }
  if (active || completed) {
    sx.color = theme.palette.text.primary
    sx.fontWeight = '500'
  }
  if (error) sx.color = theme.palette.error.main
  if (alternativeLabel) sx.marginTop = '16px'
  return sx
}

/**
 * MUI `StepLabel` -> Lynx `<view>` (root) containing the icon and the label.
 * The label `<text>` carries explicit font attributes (Lynx text doesn't
 * inherit typography from its parent `<view>`).
 */
export function StepLabel(props: StepLabelProps) {
  const {
    children,
    error = false,
    icon: iconProp,
    optional,
    StepIconComponent: StepIconComponentProp,
    className,
    style,
    sx,
  } = props
  const theme = useTheme()

  const { alternativeLabel, orientation } = useStepperContext()
  const { active, completed, icon: iconContext } = useStepContext()

  const icon: ReactNode = iconProp ?? iconContext
  const StepIconComponent = StepIconComponentProp ?? StepIcon

  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx(orientation, alternativeLabel), theme),
    ...(sx ? sxToStyle(sx, theme) : {}),
    ...style,
  }

  return (
    <view className={className} style={rootStyle}>
      {icon != null && (
        <view style={sxToStyle(iconContainerSx(alternativeLabel), theme)}>
          <StepIconComponent completed={completed} active={active} error={error} icon={icon} />
        </view>
      )}
      <view style={sxToStyle(labelContainerSx(alternativeLabel, theme), theme)}>
        {children != null && (
          <text style={sxToStyle(labelSx(active, completed, error, alternativeLabel, theme), theme)}>
            {children}
          </text>
        )}
        {optional}
      </view>
    </view>
  )
}
StepLabel.displayName = 'StepLabel'
