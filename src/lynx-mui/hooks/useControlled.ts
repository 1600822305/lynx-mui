import { useCallback, useState } from '@lynx-js/react'

/**
 * Mirror of MUI's `useControlled`: lets a component support both controlled
 * (`value` prop supplied) and uncontrolled (`defaultValue`) operation. When
 * controlled, the internal state is ignored and the setter is a no-op on state.
 */
export function useControlled<T>(controlled: T | undefined, defaultValue: T): [T, (next: T) => void] {
  const isControlled = controlled !== undefined
  const [valueState, setValueState] = useState<T>(defaultValue)
  const value = isControlled ? (controlled as T) : valueState

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setValueState(next)
    },
    [isControlled],
  )

  return [value, setValue]
}
