import { useContext } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import { usePressState } from '../hooks/usePressState.js'
import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { alpha } from '../utils/alpha.js'
import { Tablelvl2Context } from './Table.js'

export interface TableRowProps {
  children?: ReactNode
  /** If `true`, the row shades on press (MUI shades on hover). @default false */
  hover?: boolean
  /** If `true`, the row has the selected shading. @default false */
  selected?: boolean
  /** API-compat only; Lynx always renders a `<view>`. */
  component?: string
  onClick?: () => void
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/**
 * MUI `TableRow` -> Lynx `<view>` flex row.
 *
 * - `display: table-row` + `verticalAlign: middle` -> `flexDirection: row` with
 *   `alignItems: stretch` so sibling cells share a height and their bottom
 *   borders line up; each cell vertically centers its own content.
 * - `hover` shading has no hover on Lynx, so it maps to press feedback (`&:active`).
 * - `selected` shading uses `alpha(primary.main, action.selectedOpacity)`.
 */
export function TableRow(props: TableRowProps) {
  const theme = useTheme()
  const hover = props.hover === true
  const selected = props.selected === true
  // Read for parity with MUI ownerState (head/footer); does not change visuals.
  useContext(Tablelvl2Context)

  const press = usePressState()
  const pressed = hover && press.pressed

  const { action, primary } = theme.palette
  let backgroundColor: string | undefined
  if (selected) {
    backgroundColor = pressed
      ? alpha(primary.main, action.selectedOpacity + action.hoverOpacity)
      : alpha(primary.main, action.selectedOpacity)
  } else if (pressed) {
    backgroundColor = action.hover
  }

  const rootSx: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
  }
  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx, theme),
    ...(backgroundColor ? { backgroundColor } : {}),
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }

  const elementProps: Record<string, unknown> = {
    className: props.className,
    style: rootStyle,
    bindtap: props.onClick,
  }
  if (hover) {
    elementProps.bindtouchstart = press.bind.bindtouchstart
    elementProps.bindtouchend = press.bind.bindtouchend
    elementProps.bindtouchcancel = press.bind.bindtouchcancel
  }

  return <view {...elementProps}>{props.children}</view>
}
TableRow.displayName = 'TableRow'
