import type { ReactNode } from '@lynx-js/react'

import { createComponent } from '../system/createComponent.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import type { LynxStyle, SxObject, Theme } from '../system/types.js'

export interface CardHeaderProps extends BaseProps {
  /** The Avatar element to display. */
  avatar?: ReactNode
  /** The action to display in the card header. */
  action?: ReactNode
  /** The title text. */
  title?: ReactNode
  /** The subheader text. */
  subheader?: ReactNode
}

interface CardHeaderOwnerState {
  hasAvatar: boolean
}

/**
 * MUI `CardHeader` -> Lynx `<view>`.
 * MUI source: root { display: flex, alignItems: center, padding: 16 }.
 * Avatar slot: { display: flex, flex: '0 0 auto', marginRight: 16 }.
 * Content slot: { flex: '1 1 auto' }.
 * Action slot: { flex: '0 0 auto', alignSelf: 'flex-start', marginTop: -4, marginRight: -8, marginBottom: -4 }.
 * Title: Typography variant = avatar ? 'body2' : 'h5', component = 'span'.
 * Subheader: Typography variant = avatar ? 'body2' : 'body1', color = 'textSecondary', component = 'span'.
 */
function cardHeaderStyle(): SxObject {
  return {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '16px',
  }
}

function avatarSlotStyle(theme: Theme): LynxStyle {
  return sxToStyle({
    display: 'flex',
    flex: '0 0 auto',
    marginRight: '16px',
  }, theme)
}

function contentSlotStyle(theme: Theme): LynxStyle {
  return sxToStyle({ flex: '1 1 auto' }, theme)
}

function actionSlotStyle(theme: Theme): LynxStyle {
  return sxToStyle({
    flex: '0 0 auto',
    alignSelf: 'flex-start',
    marginTop: '-4px',
    marginRight: '-8px',
    marginBottom: '-4px',
  }, theme)
}

function titleStyle(hasAvatar: boolean, theme: Theme): LynxStyle {
  const v = hasAvatar ? theme.typography.body2 : theme.typography.h5
  const sx: SxObject = {
    fontSize: `${v.fontSize}px`,
    fontWeight: `${v.fontWeight}`,
    lineHeight: `${v.lineHeight}`,
    letterSpacing: `${v.letterSpacing}px`,
    color: theme.palette.text.primary,
  }
  return sxToStyle(sx, theme)
}

function subheaderStyle(hasAvatar: boolean, theme: Theme): LynxStyle {
  const v = hasAvatar ? theme.typography.body2 : theme.typography.body1
  const sx: SxObject = {
    fontSize: `${v.fontSize}px`,
    fontWeight: `${v.fontWeight}`,
    lineHeight: `${v.lineHeight}`,
    letterSpacing: `${v.letterSpacing}px`,
    color: theme.palette.text.secondary,
  }
  return sxToStyle(sx, theme)
}

/** MUI `CardHeader` -> Lynx `<view>` with avatar / title+subheader / action slots. */
export const CardHeader = createComponent<CardHeaderOwnerState, CardHeaderProps>({
  name: 'CardHeader',
  root: 'view',
  ownerState: (p) => ({ hasAvatar: p.avatar != null }),
  rootStyle: cardHeaderStyle,
  content: ({ ownerState, theme, props }) => {
    const avatarStyle = avatarSlotStyle(theme)
    const contentSx = contentSlotStyle(theme)
    const actionSx = actionSlotStyle(theme)
    const tStyle = titleStyle(ownerState.hasAvatar, theme)
    const shStyle = subheaderStyle(ownerState.hasAvatar, theme)

    return (
      <>
        {props.avatar != null && (
          <view style={avatarStyle}>{props.avatar}</view>
        )}
        <view style={contentSx}>
          {props.title != null && <text style={tStyle}>{props.title}</text>}
          {props.subheader != null && <text style={shStyle}>{props.subheader}</text>}
        </view>
        {props.action != null && (
          <view style={actionSx}>{props.action}</view>
        )}
      </>
    )
  },
})
