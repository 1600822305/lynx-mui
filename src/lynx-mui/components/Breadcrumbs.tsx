import { isValidElement } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'

export interface BreadcrumbsProps extends BaseProps {
  /** Separator between items. Defaults to `'/'`. */
  separator?: string
  /** Max items to show before collapsing (not yet implemented; kept for API compat). */
  maxItems?: number
}

interface BreadcrumbsOwnerState {
  separator: string
}

function breadcrumbsRootStyle(_os: BreadcrumbsOwnerState, _theme: Theme): SxObject {
  // v7: BreadcrumbsOl: display flex, flexWrap wrap, alignItems center, p/m 0
  return {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  }
}

/** v7: BreadcrumbsSeparator: marginLeft/Right 8, display flex, userSelect none. */
function separatorStyle(theme: Theme): LynxStyle {
  return sxToStyle({
    marginLeft: 8,
    marginRight: 8,
    color: theme.palette.text.secondary,
  }, theme)
}

/**
 * MUI `Breadcrumbs` -> Lynx `<view>` row with `<text>` separators between items.
 * Uses the existing `Link` component for breadcrumb items (consumer passes them as children).
 */
export const Breadcrumbs = createComponent<BreadcrumbsOwnerState, BreadcrumbsProps>({
  name: 'Breadcrumbs',
  root: 'view',
  defaultProps: { separator: '/' },
  ownerState: (p) => ({
    separator: p.separator ?? '/',
  }),
  rootStyle: breadcrumbsRootStyle,
  content: ({ ownerState, theme, props }) => {
    const sepStyle = separatorStyle(theme)
    const items: ReactNode[] = []

    const childArray = Array.isArray(props.children) ? props.children : [props.children]
    const validChildren = childArray.filter(isValidElement)

    validChildren.forEach((child: ReactNode, index: number) => {
      items.push(child)
      if (index < validChildren.length - 1) {
        items.push(
          <text key={`sep-${index}`} style={sepStyle}>
            {ownerState.separator}
          </text>,
        )
      }
    })

    return <>{items}</>
  },
})
