import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { StepContext } from './StepContext.js'
import type { StepContextValue } from './StepContext.js'
import { useStepperContext } from './StepperContext.js'

export interface StepProps {
  children?: ReactNode
  /** Force the active state. Inferred from `Stepper.activeStep` when omitted. */
  active?: boolean
  /** Force the completed state. */
  completed?: boolean
  /** Force the disabled state. */
  disabled?: boolean
  /** Expand the `StepContent` regardless of `active`. @default false */
  expanded?: boolean
  /** Zero-based position. Injected by `Stepper`. */
  index?: number
  /** Whether this is the last step. Injected by `Stepper`. */
  last?: boolean
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

function rootSx(orientation: 'horizontal' | 'vertical', alternativeLabel: boolean): SxObject {
  const sx: SxObject = { display: 'flex' }
  if (orientation === 'horizontal') {
    sx.paddingLeft = '8px'
    sx.paddingRight = '8px'
  }
  if (alternativeLabel) {
    // Equal-width steps. Lynx does not apply the `flex: 1` shorthand given as a
    // number, so use the longhands instead (otherwise the step collapses to its
    // content and the label text renders one character per line).
    sx.flexGrow = 1
    sx.flexShrink = 1
    sx.flexBasis = 0
    sx.minWidth = 0
    sx.position = 'relative'
  }
  return sx
}

/**
 * MUI `Step` -> Lynx `<view>`. Derives active/completed/disabled from the
 * `Stepper`'s `activeStep` (unless overridden) and publishes a `StepContext`
 * to its descendants. `index`/`last` are injected by `Stepper`.
 */
export function Step(props: StepProps) {
  const {
    children,
    active: activeProp,
    completed: completedProp,
    disabled: disabledProp,
    expanded = false,
    index = 0,
    last = false,
    className,
    style,
    sx,
  } = props
  const theme = useTheme()
  const { activeStep, alternativeLabel, connector, nonLinear, orientation } = useStepperContext()

  let active = activeProp ?? false
  let completed = completedProp ?? false
  let disabled = disabledProp ?? false
  if (activeStep === index) {
    active = activeProp ?? true
  } else if (!nonLinear && activeStep > index) {
    completed = completedProp ?? true
  } else if (!nonLinear && activeStep < index) {
    disabled = disabledProp ?? true
  }

  const contextValue: StepContextValue = {
    index,
    last,
    expanded,
    icon: index + 1,
    active,
    completed,
    disabled,
  }

  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx(orientation, alternativeLabel), theme),
    ...(sx ? sxToStyle(sx, theme) : {}),
    ...style,
  }

  const showConnectorBefore = connector != null && !alternativeLabel && index !== 0
  const showConnectorInside = connector != null && alternativeLabel && index !== 0

  return (
    <StepContext.Provider value={contextValue}>
      {showConnectorBefore ? connector : null}
      <view className={className} style={rootStyle}>
        {showConnectorInside ? connector : null}
        {children}
      </view>
    </StepContext.Provider>
  )
}
Step.displayName = 'Step'
