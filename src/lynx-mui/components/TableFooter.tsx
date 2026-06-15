import type { ReactNode } from '@lynx-js/react'

import { defaultTheme } from '../system/defaultTheme.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { Tablelvl2Context } from './Table.js'

export interface TableFooterProps {
  children?: ReactNode
  /** API-compat only; Lynx always renders a `<view>`. */
  component?: string
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/**
 * MUI `TableFooter` -> Lynx `<view>` flex column.
 * Provides `Tablelvl2Context { variant: 'footer' }`.
 * MUI's `display: table-footer-group` becomes a flex column.
 */
export function TableFooter(props: TableFooterProps) {
  const rootSx: SxObject = { display: 'flex', flexDirection: 'column', width: '100%' }
  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx, defaultTheme),
    ...sxToStyle(props.sx, defaultTheme),
    ...props.style,
  }
  return (
    <Tablelvl2Context.Provider value={{ variant: 'footer' }}>
      <view className={props.className} style={rootStyle}>
        {props.children}
      </view>
    </Tablelvl2Context.Provider>
  )
}
TableFooter.displayName = 'TableFooter'
