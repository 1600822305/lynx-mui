import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export interface FormGroupProps extends BaseProps {
  /** Display group in a row (MUI `row`). Default column. */
  row?: boolean
}

interface FormGroupOwnerState {
  row: boolean
}

/** v7 FormGroupRoot: flex column, flexWrap wrap; `row` -> flexDirection row. */
export const FormGroup = createComponent<FormGroupOwnerState, FormGroupProps>({
  name: 'FormGroup',
  root: 'view',
  ownerState: (props) => ({ row: props.row === true }),
  rootStyle: (ownerState): SxObject => ({
    display: 'flex',
    flexDirection: ownerState.row ? 'row' : 'column',
    flexWrap: 'wrap',
  }),
})
