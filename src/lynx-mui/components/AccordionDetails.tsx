import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export interface AccordionDetailsProps extends BaseProps {}

function rootStyle(_os: object, theme: Theme): SxObject {
  return {
    // MUI source: padding: theme.spacing(1, 2, 2) = '8px 16px 16px'
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
  }
}

/** MUI `AccordionDetails` -> Lynx `<view>` content area below the summary. */
export const AccordionDetails = createComponent<object, AccordionDetailsProps>({
  name: 'AccordionDetails',
  root: 'view',
  rootStyle,
})
