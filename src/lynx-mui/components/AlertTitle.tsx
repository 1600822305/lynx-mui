import type { ReactNode } from '@lynx-js/react'

import type { LynxStyle, SxProp } from '../system/types.js'
import { Typography } from './Typography.js'

export interface AlertTitleProps {
  children?: ReactNode
  /** Text color (Lynx `<text>` can't inherit; `Alert` injects its resolved color). */
  color?: string
  sx?: SxProp
  className?: string
  style?: LynxStyle
}

/** MUI `AlertTitle` -> `Typography` (body1) with fontWeight 500 / marginTop -2. */
export function AlertTitle(props: AlertTitleProps) {
  return (
    <Typography
      variant='body1'
      gutterBottom
      color={props.color}
      sx={props.sx}
      className={props.className}
      style={{ fontWeight: '500', marginTop: '-2px', ...props.style }}
    >
      {props.children}
    </Typography>
  )
}
AlertTitle.displayName = 'AlertTitle'
