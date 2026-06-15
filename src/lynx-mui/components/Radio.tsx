import { RadioButtonCheckedIcon, RadioButtonUncheckedIcon } from '../icons/index.js'
import { SwitchBase } from './SwitchBase.js'
import type { SwitchBaseOwnProps, SelectionControlColor, SelectionControlSize } from './SwitchBase.js'

export type RadioColor = SelectionControlColor
export type RadioSize = SelectionControlSize
export interface RadioProps extends SwitchBaseOwnProps {}

/** MUI `Radio` -> Lynx SwitchBase with RadioButtonChecked / RadioButtonUnchecked icons. */
export function Radio(props: RadioProps) {
  return <SwitchBase icon={RadioButtonUncheckedIcon} checkedIcon={RadioButtonCheckedIcon} {...props} />
}
Radio.displayName = 'Radio'
