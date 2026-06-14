import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export interface DialogTitleProps extends BaseProps {}

/**
 * MUI `DialogTitle` -> Lynx `<text>`.
 * Renders as Typography variant="h6" with padding 16px 24px.
 * MUI source: styled(Typography)({ padding: '16px 24px', flex: '0 0 auto' }),
 * default component="h2", variant="h6".
 * Lynx: just a <text> with h6 typography styles applied.
 */
function dialogTitleStyle(_os: Record<string, never>, theme: Theme): SxObject {
  const v = theme.typography.h6
  const style: SxObject = {
    padding: '16px 24px',
    flex: '0 0 auto',
    fontSize: `${v.fontSize}px`,
    fontWeight: `${v.fontWeight}`,
    lineHeight: `${v.lineHeight}`,
    letterSpacing: `${v.letterSpacing}px`,
    color: theme.palette.text.primary,
  }
  return style
}

export const DialogTitle = createComponent<Record<string, never>, DialogTitleProps>({
  name: 'DialogTitle',
  root: 'text',
  rootStyle: dialogTitleStyle,
})
