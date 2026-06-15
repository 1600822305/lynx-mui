import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactNode, ReactElement } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'
import type { TabTextColor } from './Tab.js'

export type TabsIndicatorColor = 'primary' | 'secondary'
export type TabsVariant = 'standard' | 'fullWidth'

export interface TabsProps extends BaseProps {
  /** Currently selected tab value. */
  value?: unknown
  /** Called when the user taps a tab: `(value) => void`. */
  onChange?: (value: unknown) => void
  textColor?: TabTextColor
  indicatorColor?: TabsIndicatorColor
  /** `'fullWidth'` stretches tabs equally; `'standard'` uses natural sizing. */
  variant?: TabsVariant
  centered?: boolean
}

interface TabsOwnerState {
  centered: boolean
  variant: TabsVariant
}

function tabsRootStyle(os: TabsOwnerState, theme: Theme): SxObject {
  return {
    overflow: 'hidden',
    minHeight: 48,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    ...(os.centered && os.variant !== 'fullWidth' ? { justifyContent: 'center' } : {}),
  }
}

/**
 * MUI `Tabs` -> Lynx `<view>` row container.
 *
 * Clones child `Tab` elements to inject:
 * - `selected` (matched via `value`)
 * - `textColor` (inherited from Tabs)
 * - `fullWidth` (when variant='fullWidth')
 * - `onClick` wired to `onChange`
 *
 * Lynx degradation: the selected indicator is rendered inside each Tab
 * (not as a single sliding element) because Lynx cannot measure DOM
 * positions for dynamic indicator translation.
 */
export const Tabs = createComponent<TabsOwnerState, TabsProps>({
  name: 'Tabs',
  root: 'view',
  defaultProps: {
    textColor: 'primary',
    indicatorColor: 'primary',
    variant: 'standard',
    centered: false,
  },
  ownerState: (p) => ({
    centered: p.centered === true,
    variant: p.variant ?? 'standard',
  }),
  rootStyle: tabsRootStyle,
  content: ({ props }) => {
    const {
      value,
      onChange,
      textColor = 'primary',
      variant = 'standard',
      children,
    } = props
    const isFullWidth = variant === 'fullWidth'

    const childArray = Array.isArray(children) ? children : [children]
    return (<>
      {childArray.map((child: ReactNode) => {
        if (!isValidElement(child)) return child
        const tabEl = child as ReactElement<Record<string, unknown>>
        const tabValue = tabEl.props.value
        const isSelected = tabValue !== undefined && tabValue === value
        return cloneElement(tabEl, {
          selected: isSelected,
          textColor,
          fullWidth: isFullWidth,
          onClick: () => {
            if (onChange && tabValue !== undefined) onChange(tabValue)
            const origClick = tabEl.props.onClick as (() => void) | undefined
            if (origClick) origClick()
          },
        })
      })}
    </>)
  },
})
