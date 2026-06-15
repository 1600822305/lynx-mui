import { cloneElement, isValidElement, useMemo } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { StepConnector } from './StepConnector.js'
import { StepperContext } from './StepperContext.js'
import type { StepperContextValue, StepperOrientation } from './StepperContext.js'

export interface StepperProps {
  children?: ReactNode
  /** Active step (zero-based). @default 0 */
  activeStep?: number
  /** Place the label under the icon (horizontal only). @default false */
  alternativeLabel?: boolean
  /** Element rendered between steps. @default `<StepConnector />` */
  connector?: ReactNode
  /** Skip linear completed/disabled inference. @default false */
  nonLinear?: boolean
  /** Layout direction. @default 'horizontal' */
  orientation?: StepperOrientation
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

const defaultConnector = <StepConnector />

/** Flatten children, dropping nullish/boolean entries (mirrors Children.toArray().filter(Boolean)). */
function toStepArray(children: ReactNode): ReactNode[] {
  const out: ReactNode[] = []
  const visit = (node: ReactNode) => {
    if (Array.isArray(node)) {
      node.forEach(visit)
      return
    }
    if (node == null || node === false || node === true || node === '') return
    out.push(node)
  }
  visit(children)
  return out
}

function rootSx(orientation: StepperOrientation, alternativeLabel: boolean): SxObject {
  const sx: SxObject = { display: 'flex' }
  if (orientation === 'horizontal') {
    sx.flexDirection = 'row'
    sx.alignItems = 'center'
  } else {
    sx.flexDirection = 'column'
  }
  if (alternativeLabel) sx.alignItems = 'flex-start'
  return sx
}

/**
 * MUI `Stepper` -> Lynx `<view>`. Clones each child `Step` to inject `index`
 * and `last`, and publishes `StepperContext` (activeStep/orientation/connector/
 * alternativeLabel/nonLinear) to descendants.
 */
export function Stepper(props: StepperProps) {
  const {
    children,
    activeStep = 0,
    alternativeLabel = false,
    connector = defaultConnector,
    nonLinear = false,
    orientation = 'horizontal',
    className,
    style,
    sx,
  } = props
  const theme = useTheme()

  const childrenArray = toStepArray(children)
  const steps = childrenArray.map((step, index) => {
    if (!isValidElement(step)) return step
    const el = step as ReactElement<Record<string, unknown>>
    return cloneElement(el, {
      index,
      last: index + 1 === childrenArray.length,
      ...el.props,
    })
  })

  const contextValue: StepperContextValue = useMemo(
    () => ({ activeStep, alternativeLabel, connector, nonLinear, orientation }),
    [activeStep, alternativeLabel, connector, nonLinear, orientation],
  )

  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx(orientation, alternativeLabel), theme),
    ...(sx ? sxToStyle(sx, theme) : {}),
    ...style,
  }

  return (
    <StepperContext.Provider value={contextValue}>
      <view className={className} style={rootStyle}>
        {steps}
      </view>
    </StepperContext.Provider>
  )
}
Stepper.displayName = 'Stepper'
