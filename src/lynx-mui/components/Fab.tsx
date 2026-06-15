import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import type { IconProps } from '../icons/createSvgIcon.js'
import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'

export type FabVariant = 'circular' | 'extended'
export type FabColor =
  | 'default' | 'inherit' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
export type FabSize = 'small' | 'medium' | 'large'

export interface FabProps extends BaseProps {
  variant?: FabVariant
  color?: FabColor
  size?: FabSize
}

interface FabOwnerState {
  variant: FabVariant
  color: FabColor
  size: FabSize
  disabled: boolean
}

type PaletteColorKey = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

// v7 FabRoot: circular size = width/height per size; borderRadius '50%' (Lynx: px = half).
const circularSize: Record<FabSize, number> = { small: 40, medium: 48, large: 56 }
// v7 extended variants: height/minWidth/padding/borderRadius per size.
const extended: Record<FabSize, { h: number; minW: number; pad: string; r: number }> = {
  small: { h: 34, minW: 34, pad: '0px 8px', r: 34 / 2 },
  medium: { h: 40, minW: 40, pad: '0px 16px', r: 40 / 2 },
  large: { h: 48, minW: 48, pad: '0px 16px', r: 48 / 2 },
}

/** Resolved foreground color for the Fab label/icon (Lynx carries it explicitly). */
function fabForeground(os: FabOwnerState, theme: Theme): string {
  if (os.disabled) return theme.palette.action.disabled
  // v7: color 'default' -> getContrastText(grey[300]) = text.primary;
  // 'inherit' has no ancestor color on Lynx -> degrade to text.primary.
  if (os.color === 'default' || os.color === 'inherit') return theme.palette.text.primary
  return theme.palette[os.color as PaletteColorKey].contrastText
}

function fabRootStyle(os: FabOwnerState, theme: Theme): SxObject {
  const style: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0px',
    minWidth: '0px',
    boxShadow: theme.shadows[6],
  }

  if (os.variant === 'extended') {
    const e = extended[os.size]
    style.height = `${e.h}px`
    style.minWidth = `${e.minW}px`
    style.padding = e.pad
    style.borderRadius = `${e.r}px`
    // v7: width 'auto' / minHeight 'auto' -> omit so the row sizes to content.
  } else {
    const d = circularSize[os.size]
    style.minHeight = '36px'
    style.width = `${d}px`
    style.height = `${d}px`
    style.borderRadius = `${d / 2}px`
  }

  // Background per color (v7): default/inherit keep grey[300]; palette colors use main.
  if (os.color === 'default' || os.color === 'inherit') {
    style.backgroundColor = theme.palette.grey[300]
  } else {
    style.backgroundColor = theme.palette[os.color as PaletteColorKey].main
  }

  // Press feedback (v7 hover -> Lynx active). default hover bg = grey.A100 (= grey[100]).
  const active: SxObject = { boxShadow: theme.shadows[12] }
  if (os.color === 'default') {
    active.backgroundColor = theme.palette.grey[100]
  } else if (os.color !== 'inherit') {
    active.backgroundColor = theme.palette[os.color as PaletteColorKey].dark
  }
  style['&:active'] = active

  // Disabled (v7): action.disabled text, action.disabledBackground bg, shadows[0].
  style['&.Mui-disabled'] = {
    color: theme.palette.action.disabled,
    backgroundColor: theme.palette.action.disabledBackground,
    boxShadow: theme.shadows[0],
  }
  return style
}

/** Label text style — carries the resolved typography.button props (Lynx text doesn't inherit). */
function fabLabelStyle(os: FabOwnerState, theme: Theme): LynxStyle {
  const t = theme.typography.button
  const sx: SxObject = {
    fontSize: `${t.fontSize}px`,
    fontWeight: `${t.fontWeight}`,
    lineHeight: `${t.lineHeight}`,
    letterSpacing: `${t.letterSpacing}px`,
    color: fabForeground(os, theme),
  }
  if (t.fontFamily) sx.fontFamily = t.fontFamily
  return sxToStyle(sx, theme)
}

/** Tint an icon child via `htmlColor` (Lynx `<svg>` can't inherit currentColor). */
function tintIcon(node: ReactNode, color: string, disabled: boolean): ReactNode {
  if (!isValidElement(node)) return node
  const el = node as ReactElement<IconProps>
  if (disabled) return cloneElement(el, { htmlColor: color })
  const hasExplicit = el.props.htmlColor != null || (el.props.color != null && el.props.color !== 'inherit')
  return hasExplicit ? node : cloneElement(el, { htmlColor: color })
}

/** MUI `Fab` -> Lynx `<view>` floating action button. */
export const Fab = createComponent<FabOwnerState, FabProps>({
  name: 'Fab',
  root: 'view',
  defaultProps: { variant: 'circular', color: 'default', size: 'large' },
  stateful: { active: true },
  ownerState: (p) => ({
    variant: p.variant ?? 'circular',
    color: p.color ?? 'default',
    size: p.size ?? 'large',
    disabled: p.disabled === true,
  }),
  rootStyle: fabRootStyle,
  content: ({ ownerState, theme, props }) => {
    const fg = fabForeground(ownerState, theme)
    const labelStyle = fabLabelStyle(ownerState, theme)
    const kids = Array.isArray(props.children) ? props.children : [props.children]
    return (
      <>
        {kids.map((child, i) => {
          if (typeof child === 'string') {
            // typography.button -> uppercase (matches Button).
            return (
              <text key={`fab-label-${i}`} style={labelStyle}>
                {child.toUpperCase()}
              </text>
            )
          }
          const tinted = tintIcon(child, fg, ownerState.disabled)
          if (isValidElement(tinted)) {
            return cloneElement(tinted as ReactElement, { key: `fab-child-${i}` })
          }
          return tinted
        })}
      </>
    )
  },
})
