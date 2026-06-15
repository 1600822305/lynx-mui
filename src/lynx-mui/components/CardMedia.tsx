import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject } from '../system/types.js'

export interface CardMediaProps extends BaseProps {
  /** Image URL to display. */
  image?: string
  /** Alias for image. */
  src?: string
  /** Explicit height (required for the image to be visible). */
  height?: number | string
}

interface CardMediaOwnerState {
  resolvedSrc: string
  height: string
}

/**
 * MUI `CardMedia` -> Lynx `<image>`.
 * MUI source (when component=img): width 100%, objectFit 'cover'.
 * In Lynx, <image> is the native image element; we render it directly
 * with src passed via the content slot (the factory root is a <view>
 * wrapper since createComponent cannot forward arbitrary props like src
 * to the root element).
 */
function cardMediaStyle(os: CardMediaOwnerState): SxObject {
  // MUI uses `display: block`; Lynx has no `block` display value, so use flex
  // with the image filling the box (same visual result).
  return {
    display: 'flex',
    width: '100%',
    height: os.height,
  }
}

export const CardMedia = createComponent<CardMediaOwnerState, CardMediaProps>({
  name: 'CardMedia',
  root: 'view',
  ownerState: (p) => ({
    resolvedSrc: p.image ?? p.src ?? '',
    height: typeof p.height === 'number' ? `${p.height}px` : (p.height ?? '140px'),
  }),
  rootStyle: cardMediaStyle,
  content: ({ ownerState }) => {
    if (!ownerState.resolvedSrc) return null
    return (
      <image
        src={ownerState.resolvedSrc}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover' as never,
        }}
      />
    )
  },
})
