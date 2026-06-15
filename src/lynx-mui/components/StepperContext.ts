import { createContext, useContext } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

export type StepperOrientation = 'horizontal' | 'vertical'

/**
 * Shared state a `Stepper` exposes to its descendant `Step*` components.
 * Mirrors MUI's `Stepper/StepperContext`.
 */
export interface StepperContextValue {
  /** Active step (zero-based). */
  activeStep: number
  /** Place the label under the icon (horizontal only). */
  alternativeLabel: boolean
  /** Element rendered between steps (defaults to `<StepConnector />`). */
  connector: ReactNode
  /** Skip linear completed/disabled inference. */
  nonLinear: boolean
  /** Layout direction. */
  orientation: StepperOrientation
}

export const StepperContext = createContext<StepperContextValue>({
  activeStep: 0,
  alternativeLabel: false,
  connector: null,
  nonLinear: false,
  orientation: 'horizontal',
})
StepperContext.displayName = 'StepperContext'

/** Returns the current `StepperContext`. */
export function useStepperContext(): StepperContextValue {
  return useContext(StepperContext)
}
