import type { ReactNode } from '@lynx-js/react'

import { sxToStyle } from '../system/resolveSx.js'
import { useTheme } from '../system/ThemeContext.js'
import type { LynxStyle } from '../system/types.js'

export interface CssBaselineProps {
  children?: ReactNode
  /** No-op on Lynx (no `color-scheme` CSS); kept for API parity. */
  enableColorScheme?: boolean
}

/**
 * MUI `CssBaseline` -> Lynx baseline root `<view>`.
 *
 * DEGRADATION: MUI injects global resets onto `<html>` / `<body>` via a global
 * stylesheet. Lynx has no document/body and no global stylesheet, so instead of
 * a no-op we wrap children in a full-size `<view>` carrying the `body` baseline
 * (background.default + text.primary + body1 typography + border-box). Note
 * Lynx `<text>` still does not inherit font, so descendant text nodes must set
 * their own typography (every lynx-mui text component already does).
 */
export function CssBaseline(props: CssBaselineProps) {
  const theme = useTheme()
  const body = theme.typography.body1

  const rootStyle: LynxStyle = sxToStyle(
    {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      fontSize: `${body.fontSize}px`,
      fontWeight: `${body.fontWeight}`,
      lineHeight: `${body.lineHeight}`,
      letterSpacing: `${body.letterSpacing}px`,
    },
    theme,
  )

  return <view style={rootStyle}>{props.children}</view>
}
CssBaseline.displayName = 'CssBaseline'
