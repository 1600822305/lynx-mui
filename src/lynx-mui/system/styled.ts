import { createElement } from '@lynx-js/react'
import type { ElementType, ReactNode } from '@lynx-js/react'

import { mergeSx, sxToStyle } from './resolveSx.js'
import { useTheme } from './ThemeContext.js'
import type { LynxStyle, SxObject, SxProp, Theme } from './types.js'

/** Props handed to a `styled` style callback: all component props, plus `theme` and (flattened) `ownerState`. */
export type StyledStyleArg = Record<string, unknown> & {
  theme: Theme
  ownerState?: unknown
}

/** A single style entry: an sx object or a `(props) => sx` callback (1:1 with MUI/emotion). */
export type StyledStyle = SxObject | ((props: StyledStyleArg) => SxObject)

export interface StyledOptions {
  /** Display name for the produced component. */
  name?: string
  /** Slot label (accepted for API parity; unused on Lynx). */
  slot?: string
  /** Decide which extra props are forwarded to the underlying element. Defaults to forwarding all. */
  shouldForwardProp?: (prop: string) => boolean
  /** Skip consuming the `sx` prop. */
  skipSx?: boolean
}

/** Props understood by every component produced by `styled`. */
export type StyledProps = Record<string, unknown> & {
  sx?: SxProp
  style?: LynxStyle
  ownerState?: unknown
  /** Override the rendered element/component (emotion `as`). */
  as?: ElementType
  className?: string
  children?: ReactNode
}

/**
 * 1:1 with MUI's `styled(Component, options)(...styles)`: returns a component
 * that merges the given styles (objects or `(props) => sx` callbacks), then the
 * caller's `sx`, then an explicit `style`, and renders the base element.
 *
 * Degradations vs MUI/emotion:
 * - Only the call form is supported, not tagged-template CSS strings
 *   (`styled('view')\`...\``) — Lynx has no runtime CSS string injection.
 * - Interaction-state selectors (`&:hover`/`&:active`) inside styled styles are
 *   resolved by the sx runtime but not auto-tracked (no press host), same as a
 *   bare `sx` on a non-stateful element.
 * - `theme.components` styleOverrides/variants are not applied (not part of this
 *   library's theme).
 */
export function styled(tag: ElementType, options: StyledOptions = {}) {
  return function styledFactory(...styleArgs: StyledStyle[]) {
    function Styled(props: StyledProps) {
      const theme = useTheme()
      const { sx, style, ownerState, as, children, className, ...rest } = props
      const renderTag = as ?? tag

      const os =
        ownerState != null && typeof ownerState === 'object'
          ? (ownerState as Record<string, unknown>)
          : {}
      const fnArg: StyledStyleArg = { ...rest, ...os, theme, ownerState }

      const styledSx = mergeSx(
        ...styleArgs.map((s) => (typeof s === 'function' ? s(fnArg) : s)),
      )

      const baseStyle = sxToStyle(styledSx, theme)
      const sxStyle = options.skipSx ? {} : sxToStyle(sx, theme)
      const finalStyle: LynxStyle = { ...baseStyle, ...sxStyle, ...style }

      const forwarded: Record<string, unknown> = {}
      for (const key in rest) {
        if (!options.shouldForwardProp || options.shouldForwardProp(key)) {
          forwarded[key] = rest[key]
        }
      }
      forwarded.className = className
      forwarded.style = finalStyle

      return createElement(renderTag, forwarded, children)
    }
    Styled.displayName = options.name ?? 'Styled'
    return Styled
  }
}
