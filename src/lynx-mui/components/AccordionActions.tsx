import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export interface AccordionActionsProps extends BaseProps {
  /** If true, remove the spacing between action buttons. */
  disableSpacing?: boolean
}

interface OwnerState {
  disableSpacing: boolean
}

function rootStyle(os: OwnerState, _theme: Theme): SxObject {
  const sx: SxObject = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '8px',
    justifyContent: 'flex-end',
  }
  // MUI uses `& > :not(style) ~ :not(style) { marginLeft: 8 }` — Lynx degradation: use gap.
  if (!os.disableSpacing) sx.gap = '8px'
  return sx
}

/** MUI `AccordionActions` -> Lynx `<view>` action row (flex end, gap 8). */
export const AccordionActions = createComponent<OwnerState, AccordionActionsProps>({
  name: 'AccordionActions',
  root: 'view',
  defaultProps: { disableSpacing: false },
  ownerState: (p) => ({ disableSpacing: p.disableSpacing === true }),
  rootStyle,
})
