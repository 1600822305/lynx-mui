import { getScreenWidth } from '../system/screen.js'
import { useTheme } from '../system/ThemeContext.js'
import type { Theme } from '../system/types.js'

/**
 * Evaluate a CSS media-query string against a viewport width (CSS px).
 * Only width features (`min-width` / `max-width`, in px) are understood —
 * those are what `theme.breakpoints.up/down/between/only` emit. Any other
 * feature (orientation, etc.) is ignored and treated as matching.
 */
function matchQuery(query: string, width: number): boolean {
  const min = /min-width\s*:\s*([\d.]+)px/.exec(query)
  if (min && width < parseFloat(min[1])) return false
  const max = /max-width\s*:\s*([\d.]+)px/.exec(query)
  if (max && width > parseFloat(max[1])) return false
  return true
}

/**
 * 1:1 with MUI's `useMediaQuery`: accepts a query string or a
 * `(theme) => string` factory (e.g. `theme.breakpoints.down('sm')`) and
 * returns whether it currently matches.
 *
 * Degradation: Lynx has no resize/`matchMedia` events and `SystemInfo` is
 * static, so the result is computed from the current screen width and does not
 * update on rotation. Non-width media features are ignored.
 */
export function useMediaQuery(
  queryInput: string | ((theme: Theme) => string),
): boolean {
  const theme = useTheme()
  const query = typeof queryInput === 'function' ? queryInput(theme) : queryInput
  return matchQuery(query, getScreenWidth())
}
