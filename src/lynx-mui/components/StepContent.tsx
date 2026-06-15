import type { ReactNode } from '@lynx-js/react'

import { sxToStyle } from '../system/resolveSx.js'
import { useTheme } from '../system/ThemeContext.js'
import type { LynxStyle, SxObject, SxProp, Theme } from '../system/types.js'
import { useStepContext } from './StepContext.js'

export interface StepContentProps {
  children?: ReactNode
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

function rootSx(last: boolean, theme: Theme): SxObject {
  const sx: SxObject = {
    marginLeft: '12px', // half icon
    paddingLeft: '20px', // 8 + 12
    overflow: 'hidden',
  }
  if (!last) {
    // light mode border (dark mode would use grey[600])
    sx.borderLeftStyle = 'solid'
    sx.borderLeftWidth = '1px'
    sx.borderLeftColor = theme.palette.grey['400']
  }
  return sx
}

/**
 * MUI `StepContent` -> Lynx `<view>`. Only meaningful inside a vertical Stepper.
 *
 * DEGRADATION: MUI wraps the content in `<Collapse>`; lynx-mui has no Collapse
 * component, so the reveal is a `max-height`/`overflow:hidden` transition
 * (same approach as `Accordion`). `transitionDuration='auto'` degrades to
 * `transitions.duration.standard`.
 */
export function StepContent(props: StepContentProps) {
  const { children, className, style, sx } = props
  const theme = useTheme()
  const { active, expanded, last } = useStepContext()

  const open = active || expanded
  const { duration, easing } = theme.transitions

  const rootStyle: LynxStyle = {
    ...sxToStyle(rootSx(last, theme), theme),
    ...(sx ? sxToStyle(sx, theme) : {}),
    ...style,
  }

  const collapseStyle: LynxStyle = {
    overflow: 'hidden',
    transition: `max-height ${duration.standard}ms ${easing.easeInOut}`,
    maxHeight: open ? '2000px' : '0px',
  }

  return (
    <view className={className} style={rootStyle}>
      <view style={collapseStyle}>{children}</view>
    </view>
  )
}
StepContent.displayName = 'StepContent'
