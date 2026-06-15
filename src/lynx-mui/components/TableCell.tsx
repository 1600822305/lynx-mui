import { useContext } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import { defaultTheme } from '../system/defaultTheme.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { alpha } from '../utils/alpha.js'
import { lighten } from '../utils/lighten.js'
import {
  TableContext,
  Tablelvl2Context,
} from './Table.js'
import type { TableCellPadding, TableCellSize, Tablelvl2Variant } from './Table.js'

export type TableCellAlign = 'inherit' | 'left' | 'center' | 'right' | 'justify'

export interface TableCellProps {
  children?: ReactNode
  /** Text alignment of the cell content. @default 'inherit' */
  align?: TableCellAlign
  /** Padding. Defaults to the parent `Table`'s `padding` (`'normal'`). */
  padding?: TableCellPadding
  /** Cell size. Defaults to the parent `Table`'s `size` (`'medium'`). */
  size?: TableCellSize
  /** Cell type. Defaults to the section variant from TableHead/Body/Footer. */
  variant?: Tablelvl2Variant
  /** Set aria-sort direction (no-op on Lynx; kept for API compatibility). */
  sortDirection?: 'asc' | 'desc' | false
  /** API-compat only; Lynx always renders a `<view>`. */
  component?: string
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

function alignToJustify(align: TableCellAlign): string {
  switch (align) {
    case 'center':
      return 'center'
    case 'right':
      return 'flex-end'
    default:
      return 'flex-start'
  }
}

function alignToTextAlign(align: TableCellAlign): 'left' | 'center' | 'right' {
  switch (align) {
    case 'center':
      return 'center'
    case 'right':
      return 'right'
    // Lynx <text> has no 'justify'; degrade to 'left'.
    default:
      return 'left'
  }
}

/**
 * MUI `TableCell` -> Lynx `<view>` flex cell (renders a `<text>` for string /
 * number children, otherwise the children directly).
 *
 * Property-by-property port of MUI v7.3.11 `TableCell`:
 * - base: `theme.typography.body2`, `borderBottom: 1px solid lighten(alpha(divider,1),0.88)`
 * - variant head: color text.primary, lineHeight 24px, fontWeight 500 (fontWeightMedium)
 * - variant body: color text.primary
 * - variant footer: color text.secondary, lineHeight 21px, fontSize 12px
 * - size small: padding '6px 16px'; padding checkbox: width 48, padding '0 0 0 4px'
 *   (size small + checkbox: width 24, padding '0 12px 0 16px'); padding none: 0
 * - align -> textAlign + justifyContent
 *
 * Degradations vs MUI:
 * - No CSS table layout: every non-checkbox cell uses `flex: 1` (equal column
 *   widths) instead of content-based auto sizing.
 * - `align: 'right'` keeps `flexDirection: row` (MUI uses `row-reverse`), so a
 *   TableSortLabel arrow stays to the right of its label rather than the left.
 * - `stickyHeader` does not pin the header (Lynx lacks `position: sticky`); the
 *   header still renders, just non-floating.
 */
export function TableCell(props: TableCellProps) {
  const theme = defaultTheme
  const table = useContext(TableContext)
  const tablelvl2 = useContext(Tablelvl2Context)

  const align: TableCellAlign = props.align ?? 'inherit'
  const padding: TableCellPadding = props.padding ?? table?.padding ?? 'normal'
  const size: TableCellSize = props.size ?? table?.size ?? 'medium'
  const variant: Tablelvl2Variant = props.variant ?? tablelvl2?.variant ?? 'body'

  const body2 = theme.typography.body2
  const borderColor = lighten(alpha(theme.palette.divider, 1), 0.88)

  // ---- cell box ----
  const cellSx: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: alignToJustify(align),
    boxSizing: 'border-box',
    borderBottom: `1px solid ${borderColor}`,
  }

  if (padding === 'checkbox') {
    cellSx.flexGrow = 0
    cellSx.flexShrink = 0
    if (size === 'small') {
      cellSx.width = '24px'
      cellSx.padding = '0px 12px 0px 16px'
    } else {
      cellSx.width = '48px'
      cellSx.padding = '0px 0px 0px 4px'
    }
  } else {
    cellSx.flex = 1
    if (padding === 'none') {
      cellSx.padding = '0px'
    } else if (size === 'small') {
      cellSx.padding = '6px 16px'
    } else {
      cellSx.padding = '16px'
    }
  }

  const cellStyle: LynxStyle = {
    ...sxToStyle(cellSx, theme),
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }

  // ---- text style (Lynx <text> does not inherit font) ----
  const textSx: SxObject = {
    fontFamily: body2.fontFamily,
    fontSize: `${body2.fontSize}px`,
    fontWeight: `${body2.fontWeight}`,
    lineHeight: `${body2.lineHeight}`,
    letterSpacing: `${body2.letterSpacing}px`,
    color: theme.palette.text.primary,
    textAlign: alignToTextAlign(align),
  }
  if (variant === 'head') {
    textSx.color = theme.palette.text.primary
    textSx.fontWeight = `${theme.typography.fontWeightMedium}`
    textSx.lineHeight = theme.typography.pxToRem(24)
  } else if (variant === 'footer') {
    textSx.color = theme.palette.text.secondary
    textSx.lineHeight = theme.typography.pxToRem(21)
    textSx.fontSize = theme.typography.pxToRem(12)
  }

  const { children } = props
  let content: ReactNode
  if (children === null || children === undefined || children === false) {
    content = null
  } else if (typeof children === 'string' || typeof children === 'number') {
    content = <text style={sxToStyle(textSx, theme)}>{children}</text>
  } else {
    content = children
  }

  return (
    <view className={props.className} style={cellStyle}>
      {content}
    </view>
  )
}
TableCell.displayName = 'TableCell'
