# lynx-mui 架构设计

## 0. 设计目标 & 硬约束
**定位**：lynx-mui 是一个**纯净、通用、独立可发版的 UI 库**，地位同 MUI 本身——与任何业务（包括 AetherLink）无关。

**目标**
- API 与 `@mui/material` 对齐（同名组件、同 props）。
- 独立可发版，零业务耦合（库里不出现任何业务数据/接口）。
- 性能优先：能用引擎原语就别自造，自造但不滥造。

**当前唯一焦点**：证明 UI 组件能与 MUI **视觉同步**（像不像）。**主题系统后置**，现阶段只用够渲染的最小默认值。

**Lynx 约束（架构必须绕开的）**
- 无 DOM、无 `window/document`；CSS 只支持子集。
- 选择器只有 `:active/:not/:root`；**无 `:hover`、无 `:focus`、无伪元素、无 `@media`**。
- inline `style` 不能携带伪类/状态选择器。
- 双线程：逻辑跑后台线程，高频交互可走主线程脚本（MTS）。
- 无 `useLayoutEffect`，测量靠 `boundingClientRect` + layout 事件。

---

## 1. 分层架构（自底向上）
```
L4  公共 API        index.ts —— 镜像 @mui/material 导出
L3  组件层          components/*  (Box, Typography, Button, Dialog, ...)
L2  基座            Base 元素封装 + createStyled（所有组件的共同底座）
L1  样式引擎        system/  (sx 运行时 + 主题 + 响应式 + 交互状态)   ← 核心放大器
L0  Lynx 适配层     lynx/   (元素别名、测量、屏幕信息、浮层管理)
```
依赖方向只能自上而下，L1 不依赖任何具体组件。

---

## 2. 样式引擎（核心）：sx 运行时流水线
```
sx 对象
  │  ① 规范化：展开简写 p/px/py/m/mt/bgcolor… → 标准属性
  │  ② 主题解析：数字间距×theme.spacing；'primary.main' → theme.palette
  │  ③ 响应式解析：{xs,sm,md} → 按当前屏宽取当前断点的值（无 @media，运行时算）
  │  ④ 状态拆分：把 &:active / &.Mui-disabled / &:focus 等"嵌套状态"拆出来
  ▼
ResolvedSx { base, states:{ active?, disabled?, focus? } }
  │  ⑤ 组件按当前交互状态合并 → 最终 inline style
  ▼
Lynx <view style={...}>
```
接口（伪代码，不是实现）：
```ts
type SxInput = SxObject | SxObject[] | ((t: Theme) => SxObject)
interface ResolvedSx {
  base: LynxStyle
  states: { active?: LynxStyle; disabled?: LynxStyle; focus?: LynxStyle }
}
function resolveSx(sx: SxInput, theme: Theme, screen: ScreenInfo): ResolvedSx
function mergeState(r: ResolvedSx, flags: { active?: boolean; disabled?: boolean; focus?: boolean }): LynxStyle
```
- 简写映射、断点表都做成纯数据表，便于扩充。
- `hover` 在移动端直接丢弃（桌面 Clay 端可后续映射为 active）。

---

## 3. 关键决策：交互状态（hover/active/focus/disabled）怎么落
**问题**：MUI 用 `sx={{ '&:active': {...}, '&.Mui-disabled': {...} }}` 表达状态，但 Lynx inline style 带不了伪类。

**方案 A（推荐）——JS 状态模型**
组件用触摸/焦点事件维护 `pressed/focused/disabled` 状态，sx 运行时把状态样式拆成 `states`，运行时按当前状态合并进 inline style。
- 优点：通用、对动态主题友好、纯原语、可控；符合"自造"哲学。
- 即时反馈优化：Button 等超高频件，额外挂一个**静态 `:active` CSS class** 走引擎原生按下态，零延迟（可选增强，不是必需）。

**方案 B（不推荐）——运行时注入 CSS 类**
Lynx 是预编译 CSS、不适合运行时动态注入任意规则 → 放弃。

---

## 4. 主题系统（后置，现阶段最小化）
- **现在不做完整主题系统**。只提供一套**库自带的最小默认值**（类 MUI 的 default theme：spacing=8、一个 primary 色、几个字号），纯为了让 sx 能解析、组件能渲染。
- 这套默认值是**库自己的通用默认**，不绑任何业务。
- 完整的 `Theme` 形状（palette/typography/shadows/breakpoints…）、`ThemeProvider`、`useTheme` 等 **等 UI 同步验证过之后再补**。

---

## 5. 响应式 & 屏幕上下文
- `ScreenProvider`：读 `SystemInfo` 屏宽，监听尺寸变化，提供 `{ width, breakpoint }`。
- `useMediaQuery` 和 sx 的 `{xs,sm,md}` 都从这里取值 → 屏宽变化触发重新 resolve。
- 也可结合 `rpx` 单位做无脑自适应的简单场景。

---

## 6. 浮层系统（Tooltip / Menu / Popover / Dialog / Snackbar / Drawer）
- 基座：`position: fixed` + `OverlayManager`（层级栈 / zIndex、点击外部关闭、返回键）。纯 Lynx 应用里 `fixed` **受支持**且 fixed 节点**提升到 root**（= 天然 portal）；内置 `<overlay>` 元素**仅用于把 Lynx 嵌进原生页**，整页 Lynx 项目官方建议不用，本项目不用。
- 定位：全屏遮罩 / 居中直接 `fixed` + `inset:0`；锚定浮层用 `boundingClientRect` 测锚点（无 `useLayoutEffect` → `NodesRef.invoke` 异步 / `main-thread:bindlayoutchange` 事件 / 主线程 ref），再用 `fixed` + 计算坐标定位。
- Portal 语义：靠 `fixed` 自动提升到 root 实现（无 DOM Portal）。

---

## 7. 组件实现范式（每个组件长一个样）
```tsx
function Button({ variant='text', color='primary', sx, disabled, children, ...rest }) {
  const theme = useTheme()
  const screen = useScreen()
  const { pressed, bind } = usePressState()         // 触摸事件维护按下态
  const resolved = resolveSx(
    mergeSx(buttonVariantStyle(variant, color, theme), sx), theme, screen)
  const style = mergeState(resolved, { active: pressed, disabled })
  return (
    <view style={style} {...bind} {...rest}>
      <text style={resolved.base.__text}>{children}</text>
    </view>
  )
}
```
- 统一用一个 `createComponent` / `Box` 基座减少重复（sx 消费、ref 转发、事件绑定都在基座里）。
- `Typography` → `<text>`；`Box`/容器 → `<view>`；图片 → `<image>`。

---

## 8. API 兼容策略
- `index.ts` 镜像 `@mui/material` 命名导出。
- props 名对齐；**Lynx 做不到的 props → 静默 no-op + 保留 TS 类型**（保证业务 JSX 能编译过、不报错）。
- 维护一份"差异/降级清单"，标注哪些 prop 是 no-op、哪些行为有出入。

---

## 9. 目录结构
```
src/lynx-mui/
├─ index.ts                  # 公共 API（镜像 @mui/material）
├─ system/
│  ├─ resolveSx.ts           # sx 流水线
│  ├─ shorthands.ts          # 简写映射表
│  ├─ breakpoints.ts         # 响应式
│  ├─ mergeState.ts          # 状态合并
│  └─ styled.ts              # styled() 轻量版
├─ theme/
│  ├─ createTheme.ts  defaultTheme.ts  ThemeProvider.tsx  useTheme.ts
├─ screen/
│  ├─ ScreenProvider.tsx  useScreen.ts  useMediaQuery.ts
├─ overlay/
│  ├─ OverlayManager.tsx  Portal.tsx  usePosition.ts
├─ utils/  (alpha.ts, mergeSx.ts, …)
├─ hooks/  (usePressState.ts, …)
└─ components/
   ├─ Box.tsx  Typography.tsx  Button.tsx  …(按 Tier S→A→B 顺序补齐)
```
注：`apps` 暂不拆，`src/App.tsx` 充当对照画廊（预览台）。库稳定后再抽成独立可发版包。

---

## 10. 当前范围（UI 优先，主题后置）
- 只做：**sx 运行时雏形 + Box/Typography/Button + 对照画廊**，主题用最小默认值。
- 交互状态采用 **JS 状态模型**（方案 A）；不支持的 props **静默 no-op + 保留类型**。
- 主题系统、styled()、更多组件都是 UI 同步验证过之后的事。
