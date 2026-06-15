import { createContext, useMemo } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'

export type TableCellPadding = 'normal' | 'checkbox' | 'none'
export type TableCellSize = 'small' | 'medium'

/** Mirrors MUI's internal `TableContext` — propagates padding/size/stickyHeader to cells. */
export interface TableContextValue {
  padding: TableCellPadding
  size: TableCellSize
  stickyHeader: boolean
}

/** @internal */
export const TableContext = createContext<TableContextValue | undefined>(undefined)

export type Tablelvl2Variant = 'head' | 'body' | 'footer'

/** Mirrors MUI's internal `Tablelvl2Context` — tells a row/cell which section it lives in. */
export interface Tablelvl2ContextValue {
  variant: Tablelvl2Variant
}

/** @internal */
export const Tablelvl2Context = createContext<Tablelvl2ContextValue | undefined>(undefined)

export interface TableProps {
  children?: ReactNode
  /** Allows TableCells to inherit padding of the Table. @default 'normal' */
  padding?: TableCellPadding
  /** Allows TableCells to inherit size of the Table. @default 'medium' */
  size?: TableCellSize
  /** Set the header sticky. @default false */
  stickyHeader?: boolean
  /** API-compat only; Lynx always renders a `<view>`. */
  component?: string
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/**
 * MUI `Table` -> Lynx `<view>` flex column.
 *
 * Degradations vs MUI:
 * - No CSS `display: table` in Lynx: the table is emulated with flexbox
 *   (column of rows; each row a flex row; each cell grows equally for equal widths).
 *   Auto column sizing (content-based widths) is therefore not reproduced.
 * - `borderCollapse` / `borderSpacing` are no-ops (handled by cell borderBottom).
 */
export function Table(props: TableProps) {
  const theme = useTheme()
  const padding = props.padding ?? 'normal'
  const size = props.size ?? 'medium'
  const stickyHeader = props.stickyHeader === true

  const table = useMemo<TableContextValue>(
    () => ({ padding, size, stickyHeader }),
    [padding, size, stickyHeader],
  )

  // MUI Table root: display:'table', width:'100%', borderCollapse:'collapse'.
  const rootSx: SxObject = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  }
  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx, theme),
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }

  return (
    <TableContext.Provider value={table}>
      <view className={props.className} style={rootStyle}>
        {props.children}
      </view>
    </TableContext.Provider>
  )
}
Table.displayName = 'Table'
