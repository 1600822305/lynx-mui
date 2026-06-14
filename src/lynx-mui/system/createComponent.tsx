import { createElement } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react'

import { usePressState } from '../hooks/usePressState.js'
import { defaultTheme } from './defaultTheme.js'
import { mergeResolved, mergeState, resolveSx } from './resolveSx.js'
import type { LynxStyle, SxObject, SxProp, Theme } from './types.js'

/** Lynx intrinsic elements a component can render as its root. */
export type ElementTag = 'view' | 'text' | 'image' | 'scroll-view'

/** Props every factory component understands. Component-specific props extend this. */
export interface BaseProps {
  sx?: SxProp
  style?: LynxStyle
  className?: string
  children?: ReactNode
  disabled?: boolean
  onClick?: () => void
  bindtap?: () => void
}

export interface ContentArgs<OS, P> {
  ownerState: OS
  theme: Theme
  props: P
}

/** Declarative spec for a component. All shared behaviour lives in the factory below. */
export interface ComponentSpec<OS, P extends BaseProps> {
  name: string
  root: ElementTag
  defaultProps?: Partial<P>
  /** Derive ownerState (variant/color/size/...) from props; drives the style functions. */
  ownerState?: (props: P) => OS
  /** Root style as an sx object (may include `&:active` / `&.Mui-disabled` state selectors). */
  rootStyle?: (ownerState: OS, theme: Theme) => SxObject
  /** Inner content (slots). Defaults to rendering `props.children` directly. */
  content?: (args: ContentArgs<OS, P>) => ReactNode
  /** Interaction states the root should react to. */
  stateful?: { active?: boolean }
}

const EMPTY_SX: SxObject = {}

/**
 * Component factory: turns a declarative spec into a working Lynx component.
 * Handles theme injection, sx resolution, interaction state, event wiring and
 * className/style composition once — so component files stay declarative.
 */
export function createComponent<OS, P extends BaseProps>(spec: ComponentSpec<OS, P>) {
  function Component(rawProps: P) {
    const props = { ...spec.defaultProps, ...rawProps } as P
    const theme = defaultTheme
    const ownerState = (spec.ownerState ? spec.ownerState(props) : {}) as OS

    const press = usePressState()
    const wantActive = spec.stateful?.active === true
    const disabled = props.disabled === true

    const rootSx = spec.rootStyle ? spec.rootStyle(ownerState, theme) : EMPTY_SX
    const resolved = mergeResolved(resolveSx(rootSx, theme), resolveSx(props.sx, theme))

    const stateStyle = mergeState(resolved, {
      active: wantActive && press.pressed,
      disabled,
    })
    const style: LynxStyle = { ...stateStyle, ...props.style }

    const tap = disabled ? undefined : (props.onClick ?? props.bindtap)
    const content = spec.content
      ? spec.content({ ownerState, theme, props })
      : props.children

    const elementProps: Record<string, unknown> = {
      className: props.className,
      style,
      bindtap: tap,
    }
    if (wantActive && !disabled) {
      elementProps.bindtouchstart = press.bind.bindtouchstart
      elementProps.bindtouchend = press.bind.bindtouchend
      elementProps.bindtouchcancel = press.bind.bindtouchcancel
    }

    return createElement(spec.root, elementProps, content)
  }
  Component.displayName = spec.name
  return Component
}
