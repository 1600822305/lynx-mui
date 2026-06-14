import type { ReactNode } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme, TypographyVariant } from '../system/types.js'

export interface ListItemTextProps extends BaseProps {
  /** Main text. Falls back to `children` when omitted. */
  primary?: ReactNode
  /** Optional secondary (subtitle) text. */
  secondary?: ReactNode
}

function listItemTextStyle(): SxObject {
  return {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
    marginTop: '4px',
    marginBottom: '4px',
  }
}

/** Resolve a typography variant + color into a Lynx text style (no forced fontFamily). */
function textSlotStyle(variant: TypographyVariant, color: string, theme: Theme): LynxStyle {
  const v = theme.typography[variant]
  const style: SxObject = {
    fontSize: `${v.fontSize}px`,
    fontWeight: `${v.fontWeight}`,
    lineHeight: `${v.lineHeight}`,
    letterSpacing: `${v.letterSpacing}px`,
    color,
  }
  if (v.fontFamily) style.fontFamily = v.fontFamily
  return sxToStyle(style, theme)
}

/** MUI `ListItemText` -> Lynx `<view>` (column) with primary + optional secondary `<text>`. */
export const ListItemText = createComponent<Record<string, never>, ListItemTextProps>({
  name: 'ListItemText',
  root: 'view',
  rootStyle: listItemTextStyle,
  content: ({ theme, props }) => {
    const primary = props.primary ?? props.children
    return (
      <>
        {primary != null && (
          <text style={textSlotStyle('body1', theme.palette.text.primary, theme)}>
            {primary}
          </text>
        )}
        {props.secondary != null && (
          <text style={textSlotStyle('body2', theme.palette.text.secondary, theme)}>
            {props.secondary}
          </text>
        )}
      </>
    )
  },
})
