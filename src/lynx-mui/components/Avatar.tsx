import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { SvgIcon } from './SvgIcon.js'
import { iconPaths } from '../icons/paths.js'
import type { SxObject, Theme } from '../system/types.js'

export type AvatarVariant = 'circular' | 'rounded' | 'square'

export interface AvatarProps extends BaseProps {
  variant?: AvatarVariant
  /** Image URL. When provided, renders a Lynx `<image>` filling the box. */
  src?: string
  alt?: string
}

interface AvatarOwnerState {
  variant: AvatarVariant
  hasSrc: boolean
  hasChildren: boolean
}

function avatarRootStyle(os: AvatarOwnerState, theme: Theme): SxObject {
  const style: SxObject = {
    // v7 AvatarRoot — exact values
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: 40,
    height: 40,
    lineHeight: 1,
    overflow: 'hidden',
  }

  // borderRadius: v7 uses '50%' for circular; Lynx avoids % radii → use px = half of 40.
  switch (os.variant) {
    case 'circular':
      style.borderRadius = 20
      break
    case 'rounded':
      style.borderRadius = theme.shape.borderRadius
      break
    case 'square':
      style.borderRadius = 0
      break
  }

  // colorDefault: MUI applies it whenever there is no (working) image — i.e. for
  // letters AND the Person fallback. Grey bg + white content.
  if (!os.hasSrc) {
    style.color = theme.palette.background.default // '#fff'
    style.backgroundColor = theme.palette.grey[400] // '#bdbdbd'
  }

  return style
}

/**
 * MUI `Avatar` -> Lynx `<view>` with image / letters / Person fallback.
 *
 * Render priority (v7 source-confirmed):
 *   1. children (letters / icon passed as children)
 *   2. src (image)
 *   3. Person fallback icon
 */
export const Avatar = createComponent<AvatarOwnerState, AvatarProps>({
  name: 'Avatar',
  root: 'view',
  defaultProps: { variant: 'circular' },
  ownerState: (p) => ({
    variant: p.variant ?? 'circular',
    hasSrc: typeof p.src === 'string' && p.src.length > 0,
    hasChildren: p.children != null && p.children !== '',
  }),
  rootStyle: avatarRootStyle,
  content: ({ ownerState, theme, props }) => {
    // 1. Children (letters / custom icon)
    if (ownerState.hasChildren) {
      // Lynx <text> doesn't inherit font props from <view>, so carry them explicitly.
      return (
        <text
          style={{
            color: theme.palette.background.default,
            fontSize: '20px',
            fontWeight: '400',
            lineHeight: 1,
            textAlign: 'center',
          }}
        >
          {props.children}
        </text>
      )
    }

    // 2. Image (mirror CardMedia.tsx's <image> approach)
    if (ownerState.hasSrc) {
      return (
        <image
          src={props.src!}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover' as never,
          }}
        />
      )
    }

    // 3. Person fallback: 75% of box, color = background.default (#fff)
    return (
      <SvgIcon
        pathData={iconPaths.Person}
        htmlColor={theme.palette.background.default}
        size={30}
      />
    )
  },
})
