import { SvgIcon } from '../components/SvgIcon.js'
import type { SvgIconProps } from '../components/SvgIcon.js'

/** Props an individual icon accepts (everything `SvgIcon` takes except its path). */
export type IconProps = Omit<SvgIconProps, 'pathData' | 'rawContent'>

/**
 * Mirror of MUI's `createSvgIcon`: bind path `d` data into a reusable icon
 * component. `Close = createSvgIcon(iconPaths.Close, 'Close')` then `<Close />`.
 */
export function createSvgIcon(path: string | string[], displayName: string) {
  function Icon(props: IconProps) {
    return <SvgIcon pathData={path} {...props} />
  }
  Icon.displayName = `${displayName}Icon`
  return Icon
}
