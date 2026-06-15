import { CheckBoxIcon, CheckBoxOutlineBlankIcon } from '../icons/index.js'
import { SwitchBase } from './SwitchBase.js'
import type { SwitchBaseOwnProps, SelectionControlColor, SelectionControlSize } from './SwitchBase.js'

export type CheckboxColor = SelectionControlColor
export type CheckboxSize = SelectionControlSize
export interface CheckboxProps extends SwitchBaseOwnProps {}

/** MUI `Checkbox` -> Lynx SwitchBase with CheckBox / CheckBoxOutlineBlank icons. */
export function Checkbox(props: CheckboxProps) {
  return <SwitchBase icon={CheckBoxOutlineBlankIcon} checkedIcon={CheckBoxIcon} {...props} />
}
Checkbox.displayName = 'Checkbox'
