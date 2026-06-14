import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export interface CardContentProps extends BaseProps {}

/** MUI `CardContent` -> Lynx `<view>` with the standard 16px padding. */
export const CardContent = createComponent<Record<string, never>, CardContentProps>({
  name: 'CardContent',
  root: 'view',
  rootStyle: (): SxObject => ({ padding: '16px' }),
})
