import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme, TypographyVariant } from '../system/types.js'
import { alpha } from '../utils/alpha.js'

export type LinkUnderline = 'none' | 'hover' | 'always'

export interface LinkProps extends BaseProps {
  underline?: LinkUnderline
  color?: string
  variant?: TypographyVariant
}

interface LinkOwnerState {
  underline: LinkUnderline
  color: string
  variant?: TypographyVariant
}

/** Map short color names to palette tokens (same map as Typography). */
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

/** Palette groups that map to PaletteColor objects. */
type PaletteColorKey = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
const paletteColorKeys: PaletteColorKey[] = ['primary', 'secondary', 'error', 'warning', 'info', 'success']

/** Resolve a color shorthand to an actual color value from the theme. */
function resolveColorValue(color: string, theme: Theme): string {
  const token = colorShorthand[color] ?? color
  const parts = token.split('.')
  if (parts.length === 2) {
    const key = parts[0] as string
    const field = parts[1] as string
    if (paletteColorKeys.includes(key as PaletteColorKey)) {
      const group = theme.palette[key as PaletteColorKey]
      const val = group[field as keyof typeof group]
      if (val) return val
    }
    if (key === 'text') {
      const val = theme.palette.text[field as keyof typeof theme.palette.text]
      if (val) return val
    }
  }
  return token
}

function linkStyle(os: LinkOwnerState, theme: Theme): SxObject {
  const style: SxObject = {}

  // Typography variant sizing.
  if (os.variant) {
    const v = theme.typography[os.variant]
    if (v.fontFamily) style.fontFamily = v.fontFamily
    style.fontSize = `${v.fontSize}px`
    style.fontWeight = `${v.fontWeight}`
    style.lineHeight = `${v.lineHeight}`
    style.letterSpacing = `${v.letterSpacing}px`
  }

  // Color (resolve shorthand).
  style.color = colorShorthand[os.color] ?? os.color

  // Underline.
  switch (os.underline) {
    case 'always': {
      style.textDecoration = 'underline'
      // v7: underline color = alpha(color.main, 0.4). Best-effort for Lynx.
      const resolved = resolveColorValue(os.color, theme)
      style.textDecorationColor = alpha(resolved, 0.4)
      break
    }
    case 'hover':
      // Lynx degradation: no hover pseudo-class. Degrade to no underline.
      // To always show underline instead, change to 'underline'.
      style.textDecoration = 'none'
      break
    case 'none':
    default:
      style.textDecoration = 'none'
      break
  }

  return style
}

/** MUI `Link` -> Lynx `<text>` (inline link styling). */
export const Link = createComponent<LinkOwnerState, LinkProps>({
  name: 'Link',
  root: 'text',
  defaultProps: { underline: 'always', color: 'primary' },
  ownerState: (p) => ({
    underline: p.underline ?? 'always',
    color: p.color ?? 'primary',
    variant: p.variant,
  }),
  rootStyle: linkStyle,
})
