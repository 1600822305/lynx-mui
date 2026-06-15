import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import { useControlled } from '../hooks/useControlled.js'
import { useTheme } from '../system/ThemeContext.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, SxProp } from '../system/types.js'

export interface AccordionProps {
  children?: ReactNode
  /** Controlled expanded state. */
  expanded?: boolean
  /** Initial expanded state (uncontrolled). */
  defaultExpanded?: boolean
  disabled?: boolean
  /** Remove inter-item spacing when expanded. */
  disableGutters?: boolean
  /** Disable rounded corners. */
  square?: boolean
  /**
   * Lynx degradation: no DOM event object; reports the next expanded value only.
   * MUI signature is (event, expanded) — here simplified to (expanded).
   */
  onChange?: (expanded: boolean) => void
  className?: string
  style?: LynxStyle
  sx?: SxProp
}

export type { AccordionProps as AccordionPropsType }

/**
 * MUI `Accordion` -> Lynx `<view>` collapsible panel (extends Paper elevation 1).
 *
 * Degradations vs MUI:
 * - ::before inter-item divider omitted (requires :first-of-type / sibling selectors).
 * - Collapse transition replaced with maxHeight/overflow:hidden (Collapse not yet built).
 * - onChange signature simplified: (expanded: boolean) instead of (event, expanded).
 * - borderRadius: all corners rounded when !square (can't target first/last-of-type).
 */
export function Accordion(props: AccordionProps) {
  const theme = useTheme()
  const disabled = props.disabled === true
  const disableGutters = props.disableGutters === true
  const square = props.square === true

  const { duration, easing } = theme.transitions

  const [expanded, setExpanded] = useControlled(props.expanded, props.defaultExpanded ?? false)

  const handleToggle = () => {
    if (disabled) return
    const next = !expanded
    setExpanded(next)
    props.onChange?.(next)
  }

  // Split children: first child = AccordionSummary, rest = region content
  const childArray = Array.isArray(props.children) ? props.children : [props.children]
  const [summaryChild, ...restChildren] = childArray

  // Clone summary to inject internal props
  const summaryNode = isValidElement(summaryChild)
    ? cloneElement(summaryChild as ReactElement<Record<string, unknown>>, {
        expanded,
        disabled,
        disableGutters,
        onToggle: handleToggle,
      })
    : summaryChild

  // Root style (Paper elevation 1 equivalent + Accordion overrides)
  const rootSx: SxObject = {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    transition: `box-shadow ${duration.standard}ms ${easing.easeInOut}, margin ${duration.shortest}ms ${easing.easeInOut}`,
  }
  if (!square) rootSx.borderRadius = `${theme.shape.borderRadius}px`
  if (!disableGutters && expanded) rootSx.margin = '16px 0'
  if (disabled) rootSx.backgroundColor = theme.palette.action.disabledBackground

  const rootStyle: LynxStyle = { ...sxToStyle(rootSx, theme), ...sxToStyle(props.sx, theme), ...props.style }

  // Region transition wrapper (degradation: maxHeight instead of Collapse)
  const regionStyle: LynxStyle = {
    overflow: 'hidden',
    transition: `max-height ${duration.standard}ms ${easing.easeInOut}`,
    maxHeight: expanded ? '2000px' : '0px',
  }

  return (
    <view className={props.className} style={rootStyle}>
      {summaryNode}
      <view style={regionStyle}>
        {restChildren}
      </view>
    </view>
  )
}
Accordion.displayName = 'Accordion'
