import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'

export type TabTextColor = 'inherit' | 'primary' | 'secondary'

export interface TabProps extends BaseProps {
  /** Opaque value identifying this tab (matched against Tabs `value`). */
  value?: unknown
  label?: string
  selected?: boolean
  textColor?: TabTextColor
  fullWidth?: boolean
}

interface TabOwnerState {
  selected: boolean
  disabled: boolean
  textColor: TabTextColor
  fullWidth: boolean
}

function tabRootStyle(os: TabOwnerState, theme: Theme): SxObject {
  const t = theme.typography.button
  const style: SxObject = {
    // v7: ...theme.typography.button base
    fontSize: `${t.fontSize}px`,
    fontWeight: `${t.fontWeight}`,
    letterSpacing: `${t.letterSpacing}px`,
    // v7 overrides
    lineHeight: 1.25,
    maxWidth: 360,
    minWidth: 90,
    position: 'relative',
    minHeight: 48,
    flexShrink: 0,
    padding: '12px 16px',
    overflow: 'hidden',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
  if (t.fontFamily) style.fontFamily = t.fontFamily

  if (os.fullWidth) {
    style.flexShrink = 1
    style.flexGrow = 1
    style.flexBasis = 0
    style.maxWidth = 'none'
  }

  // textColor variants (v7 source-confirmed)
  switch (os.textColor) {
    case 'inherit':
      style.color = 'inherit'
      style.opacity = os.selected ? 1 : 0.6
      if (os.disabled) style.opacity = 0.38
      break
    case 'primary':
      style.color = os.selected
        ? theme.palette.primary.main
        : theme.palette.text.secondary
      if (os.disabled) style.color = theme.palette.text.disabled
      break
    case 'secondary':
      style.color = os.selected
        ? theme.palette.secondary.main
        : theme.palette.text.secondary
      if (os.disabled) style.color = theme.palette.text.disabled
      break
  }

  // Press feedback
  if (!os.disabled) {
    style['&:active'] = { opacity: 0.8 }
  }

  return style
}

/** Resolved label color (mirrors the root color logic). Lynx `<text>` does not
 * inherit font props from a `<view>` parent, so the label carries them itself. */
function resolveTabTextColor(os: TabOwnerState, theme: Theme): string {
  if (os.disabled) {
    return os.textColor === 'inherit' ? theme.palette.text.primary : theme.palette.text.disabled
  }
  switch (os.textColor) {
    case 'primary':
      return os.selected ? theme.palette.primary.main : theme.palette.text.secondary
    case 'secondary':
      return os.selected ? theme.palette.secondary.main : theme.palette.text.secondary
    case 'inherit':
    default:
      return theme.palette.text.primary
  }
}

function tabLabelStyle(os: TabOwnerState, theme: Theme): LynxStyle {
  const t = theme.typography.button
  const style: SxObject = {
    fontSize: `${t.fontSize}px`,
    fontWeight: `${t.fontWeight}`,
    lineHeight: '1.25',
    letterSpacing: `${t.letterSpacing}px`,
    color: resolveTabTextColor(os, theme),
  }
  if (t.fontFamily) style.fontFamily = t.fontFamily
  return sxToStyle(style, theme)
}

/**
 * Indicator: 2px bar at the bottom of the tab, shown when selected.
 * Lynx degradation: indicator is per-Tab (not a single sliding element in Tabs)
 * because Lynx cannot measure DOM for dynamic positioning.
 */
function indicatorStyle(indicatorColor: string): LynxStyle {
  return sxToStyle({
    position: 'absolute',
    height: 2,
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: indicatorColor,
  }, undefined)
}

/** MUI `Tab` -> Lynx `<view>` + `<text>` + optional indicator `<view>`. */
export const Tab = createComponent<TabOwnerState, TabProps>({
  name: 'Tab',
  root: 'view',
  defaultProps: { textColor: 'primary', selected: false },
  stateful: { active: true },
  ownerState: (p) => ({
    selected: p.selected === true,
    disabled: p.disabled === true,
    textColor: p.textColor ?? 'primary',
    fullWidth: p.fullWidth === true,
  }),
  rootStyle: tabRootStyle,
  content: ({ ownerState, theme, props }) => {
    const rawLabel = typeof props.label === 'string' ? props.label : props.children
    // MUI Tab inherits typography.button's uppercase transform.
    const label = typeof rawLabel === 'string' ? rawLabel.toUpperCase() : rawLabel
    const labelSx = tabLabelStyle(ownerState, theme)

    // Indicator color: resolve from textColor
    const indicatorColorMap: Record<TabTextColor, string> = {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      inherit: theme.palette.text.primary,
    }
    const indColor = indicatorColorMap[ownerState.textColor]

    return (
      <>
        <text style={labelSx}>{label}</text>
        {ownerState.selected && <view style={indicatorStyle(indColor)} />}
      </>
    )
  },
})
