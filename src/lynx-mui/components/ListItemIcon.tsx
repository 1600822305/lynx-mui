import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import type { IconProps } from '../icons/createSvgIcon.js'
import { sxToStyle } from '../system/resolveSx.js'
import { useTheme } from '../system/ThemeContext.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'

export type ListItemIconAlign = 'center' | 'flex-start'

export interface ListItemIconProps {
  children?: ReactNode
  /**
   * Vertical alignment. In MUI this comes from the parent List's context; this
   * repo's List provides no context, so it's a direct prop. @default 'center'
   */
  alignItems?: ListItemIconAlign
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

/**
 * MUI `ListItemIcon` -> Lynx `<view>`. A wrapper that applies List styles to an
 * icon: minWidth 56, `action.active` colour, flexShrink 0.
 *
 * DEGRADATION: Lynx `<svg>` does not inherit `currentColor`, so instead of
 * relying on CSS colour inheritance we inject `htmlColor = action.active` into
 * valid icon children (same approach as AccordionSummary). `alignItems` is a
 * prop rather than read from List context (this repo's List exposes none).
 */
export function ListItemIcon(props: ListItemIconProps) {
  const theme = useTheme()
  const alignItems = props.alignItems ?? 'center'
  const iconColor = theme.palette.action.active

  const rootSx: SxObject = {
    minWidth: '56px',
    color: iconColor,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
  if (alignItems === 'flex-start') {
    rootSx.marginTop = '8px'
  }

  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx, theme),
    ...(props.sx ? sxToStyle(props.sx, theme) : {}),
    ...props.style,
  }

  const children = isValidElement(props.children)
    ? cloneElement(props.children as ReactElement<IconProps>, {
        htmlColor: (props.children as ReactElement<IconProps>).props.htmlColor ?? iconColor,
      })
    : props.children

  return (
    <view className={props.className} style={rootStyle}>
      {children}
    </view>
  )
}
ListItemIcon.displayName = 'ListItemIcon'
