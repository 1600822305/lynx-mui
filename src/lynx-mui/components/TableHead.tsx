import type { ReactNode } from '@lynx-js/react'

import { defaultTheme } from '../system/defaultTheme.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { Tablelvl2Context } from './Table.js'

export interface TableHeadProps {
  children?: ReactNode
  /** API-compat only; Lynx always renders a `<view>`. */
  component?: string
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/**
 * MUI `TableHead` -> Lynx `<view>` flex column.
 * Provides `Tablelvl2Context { variant: 'head' }` so descendant cells render
 * with head typography. MUI's `display: table-header-group` becomes a flex column.
 */
export function TableHead(props: TableHeadProps) {
  const rootSx: SxObject = { display: 'flex', flexDirection: 'column', width: '100%' }
  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx, defaultTheme),
    ...sxToStyle(props.sx, defaultTheme),
    ...props.style,
  }
  return (
    <Tablelvl2Context.Provider value={{ variant: 'head' }}>
      <view className={props.className} style={rootStyle}>
        {props.children}
      </view>
    </Tablelvl2Context.Provider>
  )
}
TableHead.displayName = 'TableHead'
