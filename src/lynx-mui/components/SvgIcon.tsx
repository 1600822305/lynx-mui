import { defaultTheme } from '../system/defaultTheme.js'
import { resolveColor, sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxProp, Theme } from '../system/types.js'

export type SvgIconFontSize = 'inherit' | 'small' | 'medium' | 'large'
export type SvgIconColor =
  | 'inherit'
  | 'action'
  | 'disabled'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'

/** MUI `SvgIcon` fontSize -> px: small 20 / medium 24 / large 35. */
const fontSizePx: Record<Exclude<SvgIconFontSize, 'inherit'>, number> = {
  small: 20,
  medium: 24,
  large: 35,
}

export interface SvgIconProps {
  /** Path `d` data (one or more `<path>`), normally provided by `createSvgIcon`. */
  pathData?: string | string[]
  /** Full raw SVG inner XML; overrides `pathData` when set. */
  rawContent?: string
  /** SVG viewBox. MUI icons are authored on a 24x24 grid. */
  viewBox?: string
  fontSize?: SvgIconFontSize
  color?: SvgIconColor
  /** Explicit color string, bypasses the theme palette (MUI `htmlColor`). */
  htmlColor?: string
  /** Explicit pixel size; overrides `fontSize`. */
  size?: number
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

/**
 * Resolve the `color` prop to a concrete color.
 * Lynx renders `<svg>` as a single native view, so `currentColor` cannot inherit
 * from a surrounding `<text>` — `inherit` therefore best-efforts to text.primary,
 * and consumers (Button/IconButton/Alert) pass an explicit color/htmlColor.
 */
function resolveIconColor(color: SvgIconColor, htmlColor: string | undefined, theme: Theme): string {
  if (htmlColor) return htmlColor
  switch (color) {
    case 'inherit':
      return theme.palette.text.primary
    case 'action':
      return theme.palette.action.active
    case 'disabled':
      return theme.palette.action.disabled
    default:
      return resolveColor(`${color}.main`, theme)
  }
}

/**
 * MUI `SvgIcon` -> Lynx `<svg content="...">`.
 * The MUI path data is injected verbatim with a resolved `fill`, so icons are
 * pixel-identical to `@mui/icons-material`.
 */
export function SvgIcon(props: SvgIconProps) {
  const {
    pathData,
    rawContent,
    viewBox = '0 0 24 24',
    fontSize = 'medium',
    color = 'inherit',
    htmlColor,
    size,
    sx,
    style,
    className,
  } = props

  const theme = defaultTheme
  const px = size ?? (fontSize === 'inherit' ? fontSizePx.medium : fontSizePx[fontSize])
  const fill = resolveIconColor(color, htmlColor, theme)

  const paths = pathData == null ? [] : Array.isArray(pathData) ? pathData : [pathData]
  const inner = rawContent ?? paths.map((d) => `<path d="${d}" fill="${fill}"/>`).join('')
  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${inner}</svg>`

  const baseStyle = sxToStyle({ width: px, height: px, flexShrink: 0 }, theme)
  const extraStyle = sx ? sxToStyle(sx, theme) : {}
  const finalStyle: LynxStyle = { ...baseStyle, ...extraStyle, ...style }

  return <svg content={xml} style={finalStyle} className={className} />
}
SvgIcon.displayName = 'SvgIcon'
