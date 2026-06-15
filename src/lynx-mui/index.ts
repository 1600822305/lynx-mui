// Public API — mirrors @mui/material entry points.
export { Box } from './components/Box.js'
export type { BoxProps } from './components/Box.js'
export { Typography } from './components/Typography.js'
export type { TypographyProps } from './components/Typography.js'
export { Button } from './components/Button.js'
export type {
  ButtonProps,
  ButtonVariant,
  ButtonColor,
  ButtonSize,
} from './components/Button.js'
export { IconButton } from './components/IconButton.js'
export type {
  IconButtonProps,
  IconButtonColor,
  IconButtonSize,
  IconButtonEdge,
} from './components/IconButton.js'
export { Stack } from './components/Stack.js'
export type { StackProps, StackDirection } from './components/Stack.js'
export { Paper } from './components/Paper.js'
export type { PaperProps, PaperVariant } from './components/Paper.js'
export { Divider } from './components/Divider.js'
export type { DividerProps, DividerOrientation } from './components/Divider.js'
export { Chip } from './components/Chip.js'
export type { ChipProps, ChipVariant, ChipColor, ChipSize } from './components/Chip.js'
export { Container } from './components/Container.js'
export type { ContainerProps, ContainerMaxWidth } from './components/Container.js'
export { Card } from './components/Card.js'
export type { CardProps, CardVariant } from './components/Card.js'
export { CardContent } from './components/CardContent.js'
export type { CardContentProps } from './components/CardContent.js'
export { CardActions } from './components/CardActions.js'
export type { CardActionsProps } from './components/CardActions.js'
export { CardHeader } from './components/CardHeader.js'
export type { CardHeaderProps } from './components/CardHeader.js'
export { CardMedia } from './components/CardMedia.js'
export type { CardMediaProps } from './components/CardMedia.js'
export { CardActionArea } from './components/CardActionArea.js'
export type { CardActionAreaProps } from './components/CardActionArea.js'
export { Toolbar } from './components/Toolbar.js'
export type { ToolbarProps, ToolbarVariant } from './components/Toolbar.js'
export { List } from './components/List.js'
export type { ListProps } from './components/List.js'
export { ListItem } from './components/ListItem.js'
export type { ListItemProps } from './components/ListItem.js'
export { ListItemText } from './components/ListItemText.js'
export type { ListItemTextProps } from './components/ListItemText.js'
export { AppBar } from './components/AppBar.js'
export type { AppBarProps, AppBarColor, AppBarPosition } from './components/AppBar.js'
export { ToggleButton } from './components/ToggleButton.js'
export type {
  ToggleButtonProps,
  ToggleButtonColor,
  ToggleButtonSize,
} from './components/ToggleButton.js'
export { Link } from './components/Link.js'
export type { LinkProps, LinkUnderline } from './components/Link.js'
export { Badge } from './components/Badge.js'
export type { BadgeProps, BadgeColor, BadgeVariant } from './components/Badge.js'
export { DialogTitle } from './components/DialogTitle.js'
export type { DialogTitleProps } from './components/DialogTitle.js'
export { DialogContent } from './components/DialogContent.js'
export type { DialogContentProps } from './components/DialogContent.js'
export { DialogContentText } from './components/DialogContentText.js'
export type { DialogContentTextProps } from './components/DialogContentText.js'
export { DialogActions } from './components/DialogActions.js'
export type { DialogActionsProps } from './components/DialogActions.js'
export { Tab } from './components/Tab.js'
export type { TabProps, TabTextColor } from './components/Tab.js'
export { Tabs } from './components/Tabs.js'
export type { TabsProps, TabsIndicatorColor, TabsVariant } from './components/Tabs.js'
export { Breadcrumbs } from './components/Breadcrumbs.js'
export type { BreadcrumbsProps } from './components/Breadcrumbs.js'
export { Checkbox } from './components/Checkbox.js'
export type { CheckboxProps, CheckboxColor, CheckboxSize } from './components/Checkbox.js'
export { Radio } from './components/Radio.js'
export type { RadioProps, RadioColor, RadioSize } from './components/Radio.js'
export { Switch } from './components/Switch.js'
export type { SwitchProps, SwitchColor, SwitchSize } from './components/Switch.js'
export { FormControlLabel } from './components/FormControlLabel.js'
export type { FormControlLabelProps, FormControlLabelPlacement } from './components/FormControlLabel.js'
export { Alert } from './components/Alert.js'
export type { AlertProps, AlertSeverity, AlertVariant, AlertColor } from './components/Alert.js'
export { AlertTitle } from './components/AlertTitle.js'
export type { AlertTitleProps } from './components/AlertTitle.js'
export { Avatar } from './components/Avatar.js'
export type { AvatarProps, AvatarVariant } from './components/Avatar.js'
export { AvatarGroup } from './components/AvatarGroup.js'
export type { AvatarGroupProps, AvatarGroupSpacing } from './components/AvatarGroup.js'
export { CircularProgress } from './components/CircularProgress.js'
export type { CircularProgressProps, CircularProgressColor, CircularProgressVariant } from './components/CircularProgress.js'
export { LinearProgress } from './components/LinearProgress.js'
export type { LinearProgressProps, LinearProgressColor, LinearProgressVariant } from './components/LinearProgress.js'

// Overlay system (position:fixed substrate -> Portal/Backdrop/Modal/Dialog/Tooltip).
export { Portal, FixedLayer } from './components/Portal.js'
export type { PortalProps, FixedLayerProps } from './components/Portal.js'
export { Backdrop } from './components/Backdrop.js'
export type { BackdropProps } from './components/Backdrop.js'
export { Modal } from './components/Modal.js'
export type { ModalProps, ModalCloseReason } from './components/Modal.js'
export { Dialog } from './components/Dialog.js'
export type { DialogProps, DialogMaxWidth } from './components/Dialog.js'
export { Tooltip } from './components/Tooltip.js'
export type { TooltipProps, TooltipPlacement } from './components/Tooltip.js'
export { useAnchorRect } from './hooks/useAnchorRect.js'
export type { AnchorRect } from './hooks/useAnchorRect.js'

// Icons — SvgIcon base + createSvgIcon factory + prebuilt set (1:1 with @mui/icons-material).
export * from './icons/index.js'

// System / theming.
export { defaultTheme } from './system/defaultTheme.js'
export {
  resolveSx,
  sxToStyle,
  mergeState,
  mergeResolved,
  mergeSx,
  resolveColor,
} from './system/resolveSx.js'
export { createComponent } from './system/createComponent.js'
export type {
  BaseProps,
  ElementTag,
  ComponentSpec,
} from './system/createComponent.js'
export { alpha } from './utils/alpha.js'
export { lighten, darken } from './utils/lighten.js'
export type {
  Theme,
  Palette,
  PaletteColor,
  SxObject,
  SxProp,
  TypographyVariant,
  TypographyStyle,
  LynxStyle,
  ResolvedSx,
} from './system/types.js'

export { Accordion } from './components/Accordion.js'
export type { AccordionProps } from './components/Accordion.js'
export { AccordionSummary } from './components/AccordionSummary.js'
export type { AccordionSummaryProps } from './components/AccordionSummary.js'
export { AccordionDetails } from './components/AccordionDetails.js'
export type { AccordionDetailsProps } from './components/AccordionDetails.js'
export { AccordionActions } from './components/AccordionActions.js'
export type { AccordionActionsProps } from './components/AccordionActions.js'

export { Rating } from './components/Rating.js'
export type { RatingProps, RatingSize } from './components/Rating.js'
export { Skeleton } from './components/Skeleton.js'
export type { SkeletonProps, SkeletonVariant, SkeletonAnimation } from './components/Skeleton.js'

// Batch J — Button family (Fab, ButtonGroup, ToggleButtonGroup).
export { Fab } from './components/Fab.js'
export type { FabProps, FabVariant, FabColor, FabSize } from './components/Fab.js'
export { ButtonGroup } from './components/ButtonGroup.js'
export type {
  ButtonGroupProps,
  ButtonGroupVariant,
  ButtonGroupColor,
  ButtonGroupSize,
  ButtonGroupOrientation,
} from './components/ButtonGroup.js'
export { ToggleButtonGroup } from './components/ToggleButtonGroup.js'
export type {
  ToggleButtonGroupProps,
  ToggleButtonGroupOrientation,
} from './components/ToggleButtonGroup.js'

// Batch L — Table family (Table, TableContainer, TableHead, TableBody,
// TableRow, TableCell, TableFooter, TableSortLabel).
export { Table, TableContext, Tablelvl2Context } from './components/Table.js'
export type {
  TableProps,
  TableCellPadding,
  TableCellSize,
  TableContextValue,
  Tablelvl2ContextValue,
  Tablelvl2Variant,
} from './components/Table.js'
export { TableContainer } from './components/TableContainer.js'
export type { TableContainerProps } from './components/TableContainer.js'
export { TableHead } from './components/TableHead.js'
export type { TableHeadProps } from './components/TableHead.js'
export { TableBody } from './components/TableBody.js'
export type { TableBodyProps } from './components/TableBody.js'
export { TableRow } from './components/TableRow.js'
export type { TableRowProps } from './components/TableRow.js'
export { TableCell } from './components/TableCell.js'
export type { TableCellProps, TableCellAlign } from './components/TableCell.js'
export { TableFooter } from './components/TableFooter.js'
export type { TableFooterProps } from './components/TableFooter.js'
export { TableSortLabel } from './components/TableSortLabel.js'
export type { TableSortLabelProps, TableSortDirection } from './components/TableSortLabel.js'

// Batch O — Pagination & BottomNavigation.
export { Pagination } from './components/Pagination.js'
export type { PaginationProps } from './components/Pagination.js'
export { PaginationItem } from './components/PaginationItem.js'
export type {
  PaginationItemProps,
  PaginationItemType,
  PaginationItemColor,
  PaginationItemVariant,
  PaginationItemShape,
  PaginationItemSize,
} from './components/PaginationItem.js'
export { BottomNavigation } from './components/BottomNavigation.js'
export type { BottomNavigationProps } from './components/BottomNavigation.js'
export { BottomNavigationAction } from './components/BottomNavigationAction.js'
export type { BottomNavigationActionProps } from './components/BottomNavigationAction.js'
