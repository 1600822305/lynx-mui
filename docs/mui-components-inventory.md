# AetherLink 实际用到的 MUI 组件清单（按频次）

数据来源：扫描 `src/**/*.{ts,tsx}` 里所有 `import { ... } from '@mui/material'`。
共 **94 个标识符**、2392 处 import（频次≈引用该组件的文件数）。其中约 6 个是类型不是组件。

## Tier S — 超高频（≥60，必做、先做）
| 频次 | 组件 |
|---|---|
| 262 | Box |
| 219 | Typography |
| 174 | IconButton |
| 130 | Button |
| 87 | Paper |
| 85 | TextField |
| 83 | Chip |
| 73 | Divider |
| 69 | DialogContent |
| 65 | Alert |
| 62 | DialogTitle |
| 61 | CircularProgress |
| 60 | Tooltip |
| 60 | MenuItem |

## Tier A — 高频（25–59）
DialogActions(59) · ListItemText(53) · ListItem(49) · AppBar(49) · Toolbar(49) · FormControl(46) · List(44) · Select(42) · FormControlLabel(37) · InputLabel(30) · Avatar(29) · Collapse(25) · InputAdornment(25)

## Tier B — 中频（10–24）
ListItemIcon(24) · Slider(22) · Snackbar(17) · Menu(17) · ListItemButton(17) · Tabs(16) · Tab(16) · ListItemSecondaryAction(15) · Card(13) · Dialog(12) · Stack(12) · LinearProgress(11) · CardContent(10)

## Tier C — 低频（3–9）
ListItemAvatar(9) · FormHelperText(9) · DialogContentText(8) · Checkbox(8) · Drawer(7) · RadioGroup(6) · Radio(6) · Accordion(6) · AccordionSummary(6) · AccordionDetails(6) · Link(6) · Popover(5) · FormLabel(5) · ToggleButton(5) · ToggleButtonGroup(5) · Skeleton(3) · Fade(3) · ButtonGroup(3) · Fab(3) · Breadcrumbs(3) · ListSubheader(3)

## Tier D — 极低频（1–2，可手改/最后做）
AlertTitle(2) · Slide(2) · InputBase(2) · Badge(2) · Grid(2) · Modal(2) · FormGroup(2) · CardActionArea(2) · CardMedia(2) · CardActions(2) · CssBaseline(1) · ThemeProvider(1) · SpeedDial/SpeedDialAction/SpeedDialIcon(各1) · ButtonBase(1) · Zoom(1) · Backdrop(1) · BottomNavigation/BottomNavigationAction(各1) · Container(1) · Table/TableBody/TableCell/TableContainer/TableHead/TableRow(各1)

## 不是组件（类型/工具，不用实现）
SelectChangeEvent · Theme · SlideProps · DialogProps · DrawerProps · SxProps

---

## 关键观察
- **Top 14（Tier S）覆盖你绝大多数界面**——Box/Typography/IconButton/Button 四个就占了近 800 处。先把这层做了，界面骨架立刻成型。
- 很多是**组件族**，可成组实现，实际"要做的东西"比 94 少：
  - Dialog 族：Dialog/DialogTitle/DialogContent/DialogActions/DialogContentText
  - List 族：List/ListItem/ListItemText/ListItemIcon/ListItemButton/ListItemAvatar/ListItemSecondaryAction/ListSubheader
  - Form 族：FormControl/FormControlLabel/FormHelperText/FormLabel/FormGroup/InputLabel/InputAdornment/InputBase
  - Card 族 / Accordion 族 / Table 族 / ToggleButton 族 / SpeedDial 族 / BottomNavigation 族
- 去掉类型 + 合并组件族后，**真正要实现的组件约 50 个**，其中 ~14 个是高优先级。
- Table（6 个）、SpeedDial、BottomNavigation、Breadcrumbs 等只有 1 处，可最后做或就地手改。
