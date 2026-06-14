import { useCallback, useState } from '@lynx-js/react'

/** Tracks press (active) state via touch events, since Lynx inline style can't use `:active`. */
export function usePressState() {
  const [pressed, setPressed] = useState(false)
  const press = useCallback(() => { setPressed(true) }, [])
  const release = useCallback(() => { setPressed(false) }, [])
  return {
    pressed,
    bind: {
      bindtouchstart: press,
      bindtouchend: release,
      bindtouchcancel: release,
    },
  }
}
