import { createContext, useContext } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import { getScreenWidth } from '../system/screen.js'
import { sxToStyle } from '../system/resolveSx.js'
import { useTheme } from '../system/ThemeContext.js'
import type { Breakpoint, LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'

export type GridSizeValue = number | 'auto' | 'grow'
/** A value that may be a single value or a per-breakpoint (mobile-first) object. */
export type GridResponsive<T> = T | Partial<Record<Breakpoint, T>>

export type GridDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
export type GridWrap = 'nowrap' | 'wrap' | 'wrap-reverse'

export interface GridProps {
  /** If true, the component acts as a flex container for Grid items. */
  container?: boolean
  /** Item span: number of columns, 'auto', 'grow' (or `true`), or responsive. */
  size?: GridResponsive<GridSizeValue | true>
  /** Number of columns of the container. @default 12 */
  columns?: GridResponsive<number>
  /** Spacing (both axes) as a theme spacing factor or responsive. */
  spacing?: GridResponsive<number>
  rowSpacing?: GridResponsive<number>
  columnSpacing?: GridResponsive<number>
  /** Flex direction of the container. @default 'row' */
  direction?: GridResponsive<GridDirection>
  /** Flex wrap of the container. @default 'wrap' */
  wrap?: GridWrap
  /** Empty columns left of the item. */
  offset?: GridResponsive<number | 'auto'>
  children?: ReactNode
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

interface GridContextValue {
  columns: number
  columnSpacingPx: number
}

const GridContext = createContext<GridContextValue>({ columns: 12, columnSpacingPx: 0 })

/**
 * Resolve a mobile-first responsive value against the current screen width.
 *
 * DEGRADATION: MUI emits `@media` breakpoints and lets CSS pick the active
 * value. Lynx has no `@media`, so we resolve once against `getScreenWidth()`
 * (largest breakpoint whose min-width <= width). It re-resolves on the next
 * render rather than reactively on resize.
 */
function resolveResponsive<T>(value: GridResponsive<T> | undefined, theme: Theme): T | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'object') return value as T
  const obj = value as Partial<Record<Breakpoint, T>>
  const width = getScreenWidth()
  const order: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl']
  let resolved: T | undefined
  for (const key of order) {
    const bp = theme.breakpoints.values[key]
    if (width >= bp && obj[key] !== undefined) {
      resolved = obj[key]
    }
  }
  // Fall back to the smallest defined value if none matched (width below xs).
  if (resolved === undefined) {
    for (const key of order) {
      if (obj[key] !== undefined) return obj[key]
    }
  }
  return resolved
}

function spacingPx(factor: number | undefined, theme: Theme): number {
  if (factor === undefined) return 0
  return theme.spacing(factor)
}

/**
 * MUI v7 `Grid` -> Lynx flexbox. Container sets `display:flex; flex-wrap; gap`;
 * items compute a concrete width from their span, the parent column count and
 * the column gap (passed down via context, since Lynx cannot cascade the CSS
 * custom properties MUI relies on).
 *
 * DEGRADATION: item widths use `calc(100% * span/cols - ...)` exactly like MUI;
 * if the Lynx CSS engine lacks `calc()` with mixed %/px these widths degrade.
 * Responsive props are resolved against the current screen width (see
 * `resolveResponsive`), not via `@media`.
 */
export function Grid(props: GridProps) {
  const theme = useTheme()
  const parent = useContext(GridContext)

  const isContainer = props.container === true
  const columns = resolveResponsive(props.columns, theme) ?? 12
  const rowFactor = resolveResponsive(props.rowSpacing, theme) ?? resolveResponsive(props.spacing, theme)
  const colFactor =
    resolveResponsive(props.columnSpacing, theme) ?? resolveResponsive(props.spacing, theme)
  const rowGapPx = spacingPx(rowFactor, theme)
  const colGapPx = spacingPx(colFactor, theme)

  const style: SxObject = {
    minWidth: '0px',
    boxSizing: 'border-box',
  }

  // Item styles (a Grid can be both a container and an item when nested).
  const sizeRaw = resolveResponsive(props.size, theme)
  const size: GridSizeValue | undefined = sizeRaw === true ? 'grow' : sizeRaw
  if (size !== undefined) {
    if (size === 'grow') {
      style.flexBasis = '0px'
      style.flexGrow = 1
      style.maxWidth = '100%'
    } else if (size === 'auto') {
      style.flexBasis = 'auto'
      style.flexGrow = 0
      style.flexShrink = 0
      style.width = 'auto'
      style.maxWidth = 'none'
    } else {
      const cols = parent.columns
      const sub = ((cols - size) * parent.columnSpacingPx) / cols
      style.flexGrow = 0
      style.flexBasis = 'auto'
      style.width = `calc(100% * ${size} / ${cols} - ${sub}px)`
    }
  }

  const offset = resolveResponsive(props.offset, theme)
  if (offset !== undefined) {
    if (offset === 'auto') {
      style.marginLeft = 'auto'
    } else if (offset === 0) {
      style.marginLeft = '0px'
    } else {
      const cols = parent.columns
      const add = (parent.columnSpacingPx * offset) / cols
      style.marginLeft = `calc(100% * ${offset} / ${cols} + ${add}px)`
    }
  }

  // Container styles.
  if (isContainer) {
    style.display = 'flex'
    style.flexDirection = resolveResponsive(props.direction, theme) ?? 'row'
    style.flexWrap = props.wrap ?? 'wrap'
    style.gap = `${rowGapPx}px ${colGapPx}px`
  }

  const rootStyle: LynxStyle = {
    ...sxToStyle(style, theme),
    ...(props.sx ? sxToStyle(props.sx, theme) : {}),
    ...props.style,
  }

  const node = (
    <view className={props.className} style={rootStyle}>
      {props.children}
    </view>
  )

  if (isContainer) {
    return (
      <GridContext.Provider value={{ columns, columnSpacingPx: colGapPx }}>{node}</GridContext.Provider>
    )
  }
  return node
}
Grid.displayName = 'Grid'
