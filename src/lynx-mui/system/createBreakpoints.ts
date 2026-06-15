import type { Breakpoint, BreakpointValues, Breakpoints } from './types.js'

/** MUI default breakpoint values (styles/createBreakpoints.js), verbatim. */
const DEFAULT_VALUES: BreakpointValues = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
}

const DEFAULT_KEYS: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl']

export interface BreakpointsOptions {
  values?: Partial<BreakpointValues>
  unit?: string
  step?: number
}

/**
 * Mirrors MUI's `createBreakpoints`. `up`/`down`/`between`/`only`/`not` return
 * the exact `@media (...)` strings MUI produces; on Lynx these are parsed by
 * `useMediaQuery` (which evaluates them against the screen width) rather than
 * applied as raw CSS.
 */
export function createBreakpoints(options: BreakpointsOptions = {}): Breakpoints {
  const values: BreakpointValues = { ...DEFAULT_VALUES, ...options.values }
  const unit = options.unit ?? 'px'
  const step = options.step ?? 5
  const keys = DEFAULT_KEYS

  function value(key: Breakpoint | number): number {
    return typeof key === 'number' ? key : values[key]
  }

  function up(key: Breakpoint | number): string {
    return `@media (min-width:${value(key)}${unit})`
  }

  function down(key: Breakpoint | number): string {
    return `@media (max-width:${value(key) - step / 100}${unit})`
  }

  function between(start: Breakpoint | number, end: Breakpoint | number): string {
    return (
      `@media (min-width:${value(start)}${unit}) and ` +
      `(max-width:${value(end) - step / 100}${unit})`
    )
  }

  function only(key: Breakpoint): string {
    const index = keys.indexOf(key)
    if (index < keys.length - 1) {
      return between(key, keys[index + 1])
    }
    return up(key)
  }

  function not(key: Breakpoint): string {
    const index = keys.indexOf(key)
    if (index === 0) {
      return up(keys[1])
    }
    if (index === keys.length - 1) {
      return down(keys[index])
    }
    return (
      between(key, keys[index + 1]).replace('@media', '@media not all and') +
      ` and ${up(keys[index + 1]).replace('@media ', '')}`
    )
  }

  return { keys, values, unit, up, down, between, only, not }
}
