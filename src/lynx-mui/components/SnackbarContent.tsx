import type { ReactNode } from '@lynx-js/react'

import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'
import { darken } from '../utils/lighten.js'
import { Paper } from './Paper.js'

export interface SnackbarContentProps {
  /** The message to display. */
  message?: ReactNode
  /** The action to display after the message (e.g. a Button). */
  action?: ReactNode
  sx?: SxProp
  style?: LynxStyle
  className?: string
}

/**
 * MUI `SnackbarContent` -> Lynx `Paper` surface (elevation 6).
 * MUI root: typography.body2; backgroundColor = emphasize(background.default, 0.8);
 * color = getContrastText(bg); display flex, alignItems center, flexWrap wrap,
 * padding '6px 16px', flexGrow 1 (sm: flexGrow 'initial', minWidth 288).
 * Message slot: padding '8px 0'. Action slot: display flex, alignItems center,
 * marginLeft auto, paddingLeft 16, marginRight -8.
 *
 * Lynx degradations:
 * - `emphasize` collapses to `darken(background.default, 0.8)` because the default
 *   light background (#fff) always has luminance > 0.5 (the lighten branch only
 *   triggers for dark backgrounds, which the default theme never has).
 * - `getContrastText` is not ported -> the text color is hardcoded '#fff', which
 *   is the correct contrast color for the dark emphasized surface (FLAG).
 * - The `sm` breakpoint (flexGrow 'initial' / minWidth 288) is dropped; the
 *   mobile-first base styles are kept.
 * - A string/number `message` is wrapped in a `<text>` carrying body2; element
 *   messages render inside a `<view>` as-is.
 */
export function SnackbarContent(props: SnackbarContentProps) {
  const theme = useTheme()
  const t = theme.typography.body2

  // emphasize(background.default, 0.8): luminance(#fff) > 0.5 -> darken branch.
  const bg = darken(theme.palette.background.default, 0.8)

  const rootSx: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: '6px',
    paddingBottom: '6px',
    paddingLeft: '16px',
    paddingRight: '16px',
    flexGrow: 1,
    backgroundColor: bg,
  }

  const messageStyle: LynxStyle = sxToStyle(
    {
      paddingTop: '8px',
      paddingBottom: '8px',
      fontSize: `${t.fontSize}px`,
      fontWeight: `${t.fontWeight}`,
      lineHeight: `${t.lineHeight}`,
      letterSpacing: `${t.letterSpacing}px`,
      // getContrastText(emphasized dark surface) -> light text (not ported).
      color: '#fff',
    },
    theme,
  )

  const actionStyle: LynxStyle = sxToStyle(
    {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto',
      paddingLeft: '16px',
      marginRight: '-8px',
    },
    theme,
  )

  const message =
    typeof props.message === 'string' || typeof props.message === 'number' ? (
      <text style={messageStyle}>{props.message}</text>
    ) : (
      <view style={messageStyle}>{props.message}</view>
    )

  return (
    <Paper
      elevation={6}
      className={props.className}
      style={{ ...sxToStyle(rootSx, theme), ...sxToStyle(props.sx, theme), ...props.style }}
    >
      {message}
      {props.action ? <view style={actionStyle}>{props.action}</view> : null}
    </Paper>
  )
}
SnackbarContent.displayName = 'SnackbarContent'
