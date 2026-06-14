import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export interface DialogContentTextProps extends BaseProps {}

/**
 * MUI `DialogContentText` -> Lynx `<text>`.
 * Renders as Typography variant="body1" color="textSecondary".
 * MUI source: styled(Typography)({}) with default component="p",
 * variant="body1", color="textSecondary".
 * Lynx: <text> with body1 typography + text.secondary color.
 */
function dialogContentTextStyle(_os: Record<string, never>, theme: Theme): SxObject {
  const v = theme.typography.body1
  return {
    fontSize: `${v.fontSize}px`,
    fontWeight: `${v.fontWeight}`,
    lineHeight: `${v.lineHeight}`,
    letterSpacing: `${v.letterSpacing}px`,
    color: theme.palette.text.secondary,
  }
}

export const DialogContentText = createComponent<Record<string, never>, DialogContentTextProps>({
  name: 'DialogContentText',
  root: 'text',
  rootStyle: dialogContentTextStyle,
})
