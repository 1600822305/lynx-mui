import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'
import { LinearProgress } from './LinearProgress.js'

export type MobileStepperVariant = 'text' | 'dots' | 'progress'
export type MobileStepperPosition = 'bottom' | 'top' | 'static'

export interface MobileStepperProps {
  /** Total number of steps. */
  steps: number
  /** Active step (zero-based). @default 0 */
  activeStep?: number
  /** @default 'dots' */
  variant?: MobileStepperVariant
  /** @default 'bottom' */
  position?: MobileStepperPosition
  /** Back-navigation control rendered on the left. */
  backButton?: ReactNode
  /** Forward-navigation control rendered on the right. */
  nextButton?: ReactNode
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

function rootSx(position: MobileStepperPosition, theme: Theme): SxObject {
  const sx: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    padding: '8px',
  }
  if (position === 'bottom' || position === 'top') {
    sx.position = 'fixed'
    sx.left = '0px'
    sx.right = '0px'
    sx.zIndex = theme.zIndex.mobileStepper
    if (position === 'bottom') sx.bottom = '0px'
    else sx.top = '0px'
  }
  return sx
}

function dotSx(active: boolean, theme: Theme): SxObject {
  const { duration, easing } = theme.transitions
  return {
    transition: `background-color ${duration.standard}ms ${easing.easeInOut}`,
    borderRadius: '4px', // 50% of 8px
    width: '8px',
    height: '8px',
    margin: '0px 2px',
    backgroundColor: active ? theme.palette.primary.main : theme.palette.action.disabled,
  }
}

/**
 * MUI `MobileStepper` -> Lynx `<view>` (Paper-like bar) with back/next controls
 * and a `dots` / `progress` / `text` middle indicator.
 *
 * DEGRADATION: the `text` variant `<text>` carries explicit body2 font
 * attributes (Lynx text doesn't inherit typography from the Paper container).
 */
export function MobileStepper(props: MobileStepperProps) {
  const {
    steps,
    activeStep = 0,
    variant = 'dots',
    position = 'bottom',
    backButton,
    nextButton,
    className,
    style,
    sx,
  } = props
  const theme = useTheme()

  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx(position, theme), theme),
    ...(sx ? sxToStyle(sx, theme) : {}),
    ...style,
  }

  const dotsContainerStyle = sxToStyle({ display: 'flex', flexDirection: 'row' }, theme)

  const body2 = theme.typography.body2
  const textStyle = sxToStyle(
    {
      fontSize: `${body2.fontSize}px`,
      fontWeight: '400',
      lineHeight: `${body2.lineHeight}`,
      letterSpacing: `${body2.letterSpacing}px`,
      color: theme.palette.text.primary,
    },
    theme,
  )

  return (
    <view className={className} style={rootStyle}>
      {backButton}
      {variant === 'text' && (
        <text style={textStyle}>
          {activeStep + 1} / {steps}
        </text>
      )}
      {variant === 'dots' && (
        <view style={dotsContainerStyle}>
          {Array.from({ length: steps }, (_, index) => (
            <view key={index} style={sxToStyle(dotSx(index === activeStep, theme), theme)} />
          ))}
        </view>
      )}
      {variant === 'progress' && (
        <LinearProgress
          variant='determinate'
          value={steps === 1 ? 100 : Math.ceil((activeStep / (steps - 1)) * 100)}
          sx={{ width: '50%' }}
        />
      )}
      {nextButton}
    </view>
  )
}
MobileStepper.displayName = 'MobileStepper'
