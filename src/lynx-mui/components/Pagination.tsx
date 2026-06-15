import { useControlled } from '../hooks/useControlled.js'
import type { BaseProps } from '../system/createComponent.js'
import { sxToStyle } from '../system/resolveSx.js'
import { useTheme } from '../system/ThemeContext.js'
import type { LynxStyle, Theme } from '../system/types.js'
import { PaginationItem } from './PaginationItem.js'
import type {
  PaginationItemColor,
  PaginationItemShape,
  PaginationItemSize,
  PaginationItemType,
  PaginationItemVariant,
} from './PaginationItem.js'

export interface PaginationProps extends BaseProps {
  /** Total number of pages. */
  count?: number
  /** Controlled current page (1-based). */
  page?: number
  /** Uncontrolled default page. */
  defaultPage?: number
  /** Always-visible pages at the start and end. */
  boundaryCount?: number
  /** Pages shown on each side of the current page. */
  siblingCount?: number
  showFirstButton?: boolean
  showLastButton?: boolean
  hideNextButton?: boolean
  hidePrevButton?: boolean
  /** Lynx note: reports the next page directly (no DOM event). */
  onChange?: (page: number) => void
  color?: PaginationItemColor
  variant?: PaginationItemVariant
  shape?: PaginationItemShape
  size?: PaginationItemSize
}

interface ResolvedItem {
  type: PaginationItemType
  page: number | null
  selected: boolean
  disabled: boolean
  onClick?: () => void
}

const range = (start: number, end: number): number[] =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i)

/** v7 PaginationUl: flex row, wrap, centered, no padding/margin/list-style. */
function ulStyle(theme: Theme): LynxStyle {
  return sxToStyle({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  }, theme)
}

/**
 * MUI `Pagination` -> Lynx `<view>` (nav) wrapping a `<view>` (ul) of
 * `PaginationItem`s. The `usePagination` item-list algorithm is inlined
 * verbatim from v7.3.11.
 *
 * Lynx note: `onChange(event, page)` becomes `onChange(page)` (no DOM event).
 */
export function Pagination(props: PaginationProps) {
  const {
    count = 1,
    defaultPage = 1,
    boundaryCount = 1,
    siblingCount = 1,
    showFirstButton = false,
    showLastButton = false,
    hideNextButton = false,
    hidePrevButton = false,
    color = 'standard',
    variant = 'text',
    shape = 'circular',
    size = 'medium',
    disabled = false,
    onChange,
    page: pageProp,
    sx,
    style,
    className,
  } = props

  const theme = useTheme()
  const [page, setPage] = useControlled<number>(pageProp, defaultPage)

  const handleClick = (value: number) => {
    setPage(value)
    if (onChange) onChange(value)
  }

  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  )
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    count - boundaryCount - 1,
  )

  const itemList: Array<number | string> = [
    ...(showFirstButton ? ['first'] : []),
    ...(hidePrevButton ? [] : ['previous']),
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? ['start-ellipsis']
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1
      ? ['end-ellipsis']
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),
    ...endPages,
    ...(hideNextButton ? [] : ['next']),
    ...(showLastButton ? ['last'] : []),
  ]

  const buttonPage = (type: string): number | null => {
    switch (type) {
      case 'first': return 1
      case 'previous': return page - 1
      case 'next': return page + 1
      case 'last': return count
      default: return null
    }
  }

  const items: ResolvedItem[] = itemList.map((item) => {
    if (typeof item === 'number') {
      return {
        type: 'page',
        page: item,
        selected: item === page,
        disabled,
        onClick: () => handleClick(item),
      }
    }
    const target = buttonPage(item)
    const itemDisabled =
      disabled ||
      (!item.includes('ellipsis') &&
        (item === 'next' || item === 'last' ? page >= count : page <= 1))
    return {
      type: item as PaginationItemType,
      page: target,
      selected: false,
      disabled: itemDisabled,
      onClick: target == null ? undefined : () => handleClick(target),
    }
  })

  const rootStyle: LynxStyle = { ...(sx ? sxToStyle(sx, theme) : {}), ...style }

  return (
    <view style={rootStyle} className={className}>
      <view style={ulStyle(theme)}>
        {items.map((item, index) => (
          <PaginationItem
            key={index}
            type={item.type}
            page={item.page}
            selected={item.selected}
            disabled={item.disabled}
            onClick={item.onClick}
            color={color}
            variant={variant}
            shape={shape}
            size={size}
          />
        ))}
      </view>
    </view>
  )
}
Pagination.displayName = 'Pagination'
