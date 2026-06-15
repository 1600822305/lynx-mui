import { cloneElement, isValidElement } from '@lynx-js/react'
import type { ReactElement, ReactNode } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import type { SxObject, Theme } from '../system/types.js'

export type AvatarGroupSpacing = 'small' | 'medium' | number

export interface AvatarGroupProps extends BaseProps {
  /** Max avatars to show before +N surplus. Default 5 (clamped ≥ 2). */
  max?: number
  /** Overlap spacing: 'medium' = -8, 'small' = -16, or a custom number. */
  spacing?: AvatarGroupSpacing
}

interface AvatarGroupOwnerState {
  spacing: AvatarGroupSpacing
}

const SPACINGS: Record<string, number> = { small: -16, medium: -8 }

function avatarGroupRootStyle(_os: AvatarGroupOwnerState, _theme: Theme): SxObject {
  // v7 AvatarGroupRoot: display flex, flexDirection row-reverse.
  return {
    display: 'flex',
    flexDirection: 'row-reverse',
  }
}

/**
 * MUI `AvatarGroup` -> Lynx `<view>` with row-reverse flex.
 *
 * Mirrors v7 source slice/reverse logic:
 * - Show up to `max - 1` real avatars.
 * - If more exist, prepend a surplus avatar showing "+N".
 * - Each child avatar gets `border: 2px solid #fff` and `marginLeft: spacing`.
 * - The last child in DOM (first visually) gets `marginLeft: 0`.
 * - Children are reversed because `flexDirection: 'row-reverse'` puts the
 *   first DOM child on the right.
 */
export const AvatarGroup = createComponent<AvatarGroupOwnerState, AvatarGroupProps>({
  name: 'AvatarGroup',
  root: 'view',
  defaultProps: { max: 5, spacing: 'medium' },
  ownerState: (p) => ({
    spacing: p.spacing ?? 'medium',
  }),
  rootStyle: avatarGroupRootStyle,
  content: ({ ownerState, theme, props }) => {
    const childArray = Array.isArray(props.children) ? props.children : [props.children]
    const children = childArray.filter(isValidElement)
    const totalAvatars = children.length

    // v7: clampedMax logic
    let clampedMax = Math.max(props.max ?? 5, 2)
    if (totalAvatars === clampedMax) clampedMax += 1
    clampedMax = Math.min(totalAvatars + 1, clampedMax)

    const maxAvatars = Math.min(children.length, clampedMax - 1)
    const extraAvatars = Math.max(totalAvatars - clampedMax, totalAvatars - maxAvatars, 0)

    // Resolve spacing px
    let marginValue: number
    if (typeof ownerState.spacing === 'number') {
      marginValue = -ownerState.spacing
    } else {
      marginValue = SPACINGS[ownerState.spacing] ?? SPACINGS.medium
    }

    const borderColor = theme.palette.background.default

    // Avatar overlay style: border + overlap margin
    const avatarOverlay = {
      border: `2px solid ${borderColor}`,
      boxSizing: 'border-box' as const,
      marginLeft: `${marginValue}px`,
    }
    // Last child in DOM (leftmost visually) has no overlap
    const avatarOverlayLast = {
      border: `2px solid ${borderColor}`,
      boxSizing: 'border-box' as const,
      marginLeft: '0px',
    }

    // Surplus avatar: grey bg, white text, same size as Avatar default (40x40)
    const surplusStyle = {
      ...avatarOverlay,
      display: 'flex' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexShrink: 0,
      width: '40px',
      height: '40px',
      borderRadius: '20px',
      backgroundColor: theme.palette.grey[400],
      overflow: 'hidden' as const,
    }

    const surplusTextStyle = {
      color: theme.palette.background.default,
      fontSize: '20px',
      fontWeight: '400' as const,
      lineHeight: 1,
      textAlign: 'center' as const,
    }

    // Build output: surplus first (rightmost in row-reverse = leftmost visually),
    // then avatars in reverse order (v7 source: children.slice(0, maxAvatars).reverse())
    const items: ReactNode[] = []

    if (extraAvatars > 0) {
      items.push(
        <view key="surplus" style={surplusStyle}>
          <text style={surplusTextStyle}>{`+${extraAvatars}`}</text>
        </view>,
      )
    }

    const visibleAvatars = children.slice(0, maxAvatars).reverse()
    visibleAvatars.forEach((child: ReactNode, index: number) => {
      if (!isValidElement(child)) return
      const el = child as ReactElement<Record<string, unknown>>
      const isLast = index === visibleAvatars.length - 1
      const existingStyle = (el.props.style ?? {}) as Record<string, unknown>
      items.push(
        cloneElement(el, {
          key: `avatar-${index}`,
          style: {
            ...existingStyle,
            ...(isLast ? avatarOverlayLast : avatarOverlay),
          },
        }),
      )
    })

    return <>{items}</>
  },
})
