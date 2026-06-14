import type { ReactNode } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme, TypographyVariant } from '../system/types.js'

export interface TypographyProps extends BaseProps {
  variant?: TypographyVariant | 'inherit'
  color?: string
  align?: 'left' | 'center' | 'right'
  gutterBottom?: boolean
  noWrap?: boolean
}

interface TypographyOwnerState {
  variant: TypographyVariant | 'inherit'
  color?: string
  align?: 'left' | 'center' | 'right'
  gutterBottom: boolean
  noWrap: boolean
}

const colorShorthand: Record<string, string> = {
  primary: 'primary.main',
  secondary: 'secondary.main',
  error: 'error.main',
  warning: 'warning.main',
  info: 'info.main',
  success: 'success.main',
  textPrimary: 'text.primary',
  textSecondary: 'text.secondary',
}

/** Variant table -> sx object. The factory + sx runtime turn this into a Lynx style. */
function typographyStyle(os: TypographyOwnerState, theme: Theme): SxObject {
  const style: SxObject = {}
  if (os.variant !== 'inherit') {
    const v = theme.typography[os.variant]
    style.fontFamily = v.fontFamily
    style.fontSize = `${v.fontSize}px`
    style.fontWeight = `${v.fontWeight}`
    style.lineHeight = `${v.lineHeight}`
    style.letterSpacing = `${v.letterSpacing}px`
    style.color = theme.palette.text.primary
    if (os.gutterBottom) style.marginBottom = `${Math.round(v.fontSize * 0.35)}px`
  }
  if (os.color) style.color = colorShorthand[os.color] ?? os.color
  if (os.align) style.textAlign = os.align
  if (os.noWrap) {
    style.whiteSpace = 'nowrap'
    style.overflow = 'hidden'
    style.textOverflow = 'ellipsis'
  }
  return style
}

function renderLabel(children: ReactNode, transform?: 'none' | 'uppercase'): ReactNode {
  if (transform === 'uppercase' && typeof children === 'string') return children.toUpperCase()
  return children
}

/** MUI `Typography` -> Lynx `<text>`. */
export const Typography = createComponent<TypographyOwnerState, TypographyProps>({
  name: 'Typography',
  root: 'text',
  defaultProps: { variant: 'body1' },
  ownerState: (p) => ({
    variant: p.variant ?? 'body1',
    color: p.color,
    align: p.align,
    gutterBottom: p.gutterBottom === true,
    noWrap: p.noWrap === true,
  }),
  rootStyle: typographyStyle,
  content: ({ ownerState, theme, props }) => {
    const transform = ownerState.variant !== 'inherit'
      ? theme.typography[ownerState.variant].textTransform
      : undefined
    return renderLabel(props.children, transform)
  },
})
