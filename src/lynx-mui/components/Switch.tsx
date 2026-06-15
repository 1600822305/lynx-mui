import { useControlled } from '../hooks/useControlled.js'
import { defaultTheme } from '../system/defaultTheme.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'

export type SwitchColor =
  | 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
export type SwitchSize = 'small' | 'medium'

export interface SwitchProps {
  checked?: boolean
  defaultChecked?: boolean
  /** Lynx has no DOM event, so onChange just reports the next checked value. */
  onChange?: (checked: boolean) => void
  value?: unknown
  color?: SwitchColor
  size?: SwitchSize
  disabled?: boolean
  className?: string
  style?: LynxStyle
}

// v7 source dimensions. root = (track + 2*basePadding) wide / tall; thumb travels translateX.
interface Dimensions {
  rootW: number
  rootH: number
  basePadding: number
  thumb: number
  translateX: number
}
const dimensions: Record<SwitchSize, Dimensions> = {
  medium: { rootW: 58, rootH: 38, basePadding: 9, thumb: 20, translateX: 20 },
  small: { rootW: 40, rootH: 24, basePadding: 4, thumb: 16, translateX: 16 },
}
// Root padding around the track (v7: 12 medium / 7 small).
const trackInset: Record<SwitchSize, number> = { medium: 12, small: 7 }

type PaletteColorKey = Exclude<SwitchColor, 'default'>
function mainColor(color: SwitchColor, theme: Theme): string | undefined {
  return color === 'default' ? undefined : theme.palette[color as PaletteColorKey].main
}

/** MUI `Switch` -> Lynx `<view>` (relative) + track `<view>` + thumb `<view>`. */
export function Switch(props: SwitchProps) {
  const theme = defaultTheme
  const color = props.color ?? 'primary'
  const size = props.size ?? 'medium'
  const disabled = props.disabled === true

  const [checked, setChecked] = useControlled(props.checked, props.defaultChecked ?? false)
  const d = dimensions[size]
  const inset = trackInset[size]
  const main = mainColor(color, theme)

  const rootSx: SxObject = {
    display: 'inline-flex',
    position: 'relative',
    width: `${d.rootW}px`,
    height: `${d.rootH}px`,
    flexShrink: 0,
    boxSizing: 'border-box',
  }

  const trackSx: SxObject = {
    position: 'absolute',
    left: `${inset}px`,
    top: `${inset}px`,
    width: `${d.rootW - inset * 2}px`,
    height: `${d.rootH - inset * 2}px`,
    borderRadius: `${(d.rootH - inset * 2) / 2}px`,
    backgroundColor: checked ? (main ?? '#000') : '#000',
    opacity: disabled ? 0.12 : checked ? 0.5 : 0.38,
  }

  const thumbSx: SxObject = {
    position: 'absolute',
    top: `${d.basePadding}px`,
    left: `${d.basePadding + (checked ? d.translateX : 0)}px`,
    width: `${d.thumb}px`,
    height: `${d.thumb}px`,
    borderRadius: `${d.thumb / 2}px`,
    backgroundColor: disabled ? theme.palette.grey['100'] : checked ? (main ?? '#fff') : '#fff',
    boxShadow: theme.shadows[1],
  }

  const tap = disabled
    ? undefined
    : () => {
        const next = !checked
        setChecked(next)
        props.onChange?.(next)
      }

  const style: LynxStyle = { ...sxToStyle(rootSx, theme), ...props.style }

  return (
    <view className={props.className} style={style} bindtap={tap}>
      <view style={sxToStyle(trackSx, theme)} />
      <view style={sxToStyle(thumbSx, theme)} />
    </view>
  )
}
Switch.displayName = 'Switch'
