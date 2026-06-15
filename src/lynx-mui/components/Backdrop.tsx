import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { FixedLayer } from './Portal.js'

export interface BackdropProps {
  /** If true, the backdrop is shown. */
  open: boolean
  /** If true, the backdrop is transparent (still captures taps). @default false */
  invisible?: boolean
  /** Fired when the backdrop is tapped. */
  onClick?: () => void
  children?: ReactNode
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

/**
 * MUI `Backdrop` -> Lynx fixed full-screen layer.
 * MUI source (BackdropRoot): position fixed, display flex, alignItems/justifyContent
 * center, inset 0, backgroundColor 'rgba(0, 0, 0, 0.5)' (transparent when invisible).
 * Lynx degradations: no Fade transition (instant show/hide); `WebkitTapHighlightColor`
 * dropped (not a Lynx property).
 */
export function Backdrop(props: BackdropProps) {
  if (!props.open) return null
  const theme = useTheme()
  const base: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: props.invisible ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
  }
  const style: LynxStyle = {
    ...sxToStyle(base, theme),
    ...sxToStyle(props.sx, theme),
    ...props.style,
  }
  return (
    <FixedLayer className={props.className} style={style} bindtap={props.onClick}>
      {props.children}
    </FixedLayer>
  )
}
Backdrop.displayName = 'Backdrop'
