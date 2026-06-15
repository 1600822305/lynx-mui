import { useCallback, useRef, useState } from '@lynx-js/react'
import type { NodesRef } from '@lynx-js/types'

/**
 * Screen-space rect of an anchor element, as returned by Lynx's
 * `boundingClientRect` UI method (a structural subset of the full result).
 */
export interface AnchorRect {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

/**
 * Measure an element's screen rect for anchored overlays (Tooltip / Popover / ...).
 *
 * Lynx has no synchronous layout read (no `useLayoutEffect` + `getBoundingClientRect`).
 * Instead attach `ref` to an element and call `measure()` (e.g. on tap); the result
 * arrives asynchronously from the background thread and lands in `rect`.
 *
 *     const { ref, rect, measure } = useAnchorRect()
 *     <view ref={ref} bindtap={measure} />
 */
export function useAnchorRect() {
  const ref = useRef<NodesRef>(null)
  const [rect, setRect] = useState<AnchorRect | null>(null)

  const measure = useCallback(() => {
    const node = ref.current
    if (!node) return
    node
      .invoke({
        method: 'boundingClientRect',
        params: { relativeTo: 'screen' },
        success: (res: AnchorRect) => {
          setRect({
            left: res.left,
            top: res.top,
            right: res.right,
            bottom: res.bottom,
            width: res.width,
            height: res.height,
          })
        },
        fail: () => {},
      })
      .exec()
  }, [])

  return { ref, rect, measure }
}
