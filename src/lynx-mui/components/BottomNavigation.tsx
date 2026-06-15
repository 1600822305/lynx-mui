import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export interface BottomNavigationProps extends BaseProps {
  /** Value of the currently selected `BottomNavigationAction`. */
  value?: unknown
  /** Lynx note: reports the next value directly (no DOM event). */
  onChange?: (value: unknown) => void
  /** If `true`, every action shows its label (default: only the selected one). */
  showLabels?: boolean
}

interface BottomNavigationOwnerState {
  showLabels: boolean
}

/** v7 BottomNavigationRoot: flex, centered, height 56, background paper. */
function bottomNavigationRootStyle(_os: BottomNavigationOwnerState, theme: Theme): SxObject {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    height: 56,
    backgroundColor: theme.palette.background.paper,
  }
}

/**
 * MUI `BottomNavigation` -> Lynx `<view>` row.
 *
 * Clones child `BottomNavigationAction`s to inject `selected` (matched via
 * `value`, falling back to child index), `showLabel`, `value`, and an
 * `onClick` wired to `onChange`.
 *
 * Lynx note: `onChange(event, value)` becomes `onChange(value)` (no DOM event).
 */
export const BottomNavigation = createComponent<BottomNavigationOwnerState, BottomNavigationProps>({
  name: 'BottomNavigation',
  root: 'view',
  defaultProps: { showLabels: false },
  ownerState: (p) => ({ showLabels: p.showLabels === true }),
  rootStyle: bottomNavigationRootStyle,
  content: ({ props }) => {
    const { value, onChange, showLabels = false, children } = props
    const childArray = Array.isArray(children) ? children : [children]
    return (<>
      {childArray.map((child: ReactNode, childIndex: number) => {
        if (!isValidElement(child)) return child
        const el = child as ReactElement<Record<string, unknown>>
        const childValue = el.props.value === undefined ? childIndex : el.props.value
        const origClick = el.props.onClick as (() => void) | undefined
        return cloneElement(el, {
          key: childIndex,
          selected: childValue === value,
          showLabel: el.props.showLabel !== undefined ? el.props.showLabel : showLabels,
          value: childValue,
          onClick: () => {
            if (onChange) onChange(childValue)
            if (origClick) origClick()
          },
        })
      })}
    </>)
  },
})
