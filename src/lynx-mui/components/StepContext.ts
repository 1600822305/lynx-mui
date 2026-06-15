import { createContext, useContext } from '@lynx-js/react'

/**
 * Per-step state a `Step` exposes to its children (`StepLabel`, `StepConnector`,
 * `StepContent`, `StepButton`). Mirrors MUI's `Step/StepContext`.
 */
export interface StepContextValue {
  /** Zero-based position within the `Stepper`. */
  index: number
  /** Whether this is the last step. */
  last: boolean
  /** Expand `StepContent` regardless of `active`. */
  expanded: boolean
  /** Default icon label (`index + 1`). */
  icon: number
  active: boolean
  completed: boolean
  disabled: boolean
}

export const StepContext = createContext<StepContextValue>({
  index: 0,
  last: false,
  expanded: false,
  icon: 1,
  active: false,
  completed: false,
  disabled: false,
})
StepContext.displayName = 'StepContext'

/** Returns the current `StepContext`. */
export function useStepContext(): StepContextValue {
  return useContext(StepContext)
}
