import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export interface TableContainerProps extends BaseProps {
  /** API-compat only; Lynx always renders a `<view>`. */
  component?: string
}

/**
 * MUI `TableContainer` -> Lynx `<view>`.
 *
 * Degradation: MUI sets `overflowX: 'auto'` for horizontal scrolling. Lynx
 * `<view>` does not scroll; since the flex-emulated table fills the container
 * width it never overflows horizontally, so this is a visual no-op. Wrap in a
 * `<scroll-view scroll-orientation="horizontal">` if real scrolling is needed.
 */
export const TableContainer = createComponent<Record<string, never>, TableContainerProps>({
  name: 'TableContainer',
  root: 'view',
  rootStyle: (): SxObject => ({
    width: '100%',
  }),
})
