# lynx-mui · 统筹大脑交接文档 (ORCHESTRATION)

> 这份文档是给**接手的统筹会话**看的。读完你就能作为"统筹大脑"继续推进:
> 不直接写组件,而是**切批次发给空闲子模型**,自己负责**整合 + 1:1 复核 + 开 PR + 过 CI**。

---

## 0. 你的角色 (TL;DR)

- **你是统筹,不是码农。** 主要工作:把剩余组件切成**零重叠批次** → 写 spec 交接文档 → 用户丢给空闲子模型 → 子模型导出 `.patch` 发回 → **你 apply patch、逐属性对 MUI 源码复核、开 PR、过 CI**。
- 只有**基座/公共设施**(sx 运行时、工厂、OverlayManager 这类)才由你亲自写,因为它们影响全局、不适合并行外包。
- 跟用户沟通用**中文 + 英文技术名词**,简洁、诚实(降级点必须如实说明,别吹"100% 一致")。

---

## 1. 项目是什么 / 目的

- **lynx-mui = 一个干净、独立、可单独发版的通用 UI 库**,把 `@mui/material` 1:1 复刻到 **Lynx**(ReactLynx)上。
- **跟任何业务无关**(不要把 AetherLink 或其它业务的 theme/token 写进来)。它就像 MUI 本身一样通用,自带一套**最小默认主题**(对齐 MUI default light theme)。
- **主题系统后置**:现在不做完整主题系统,只用够渲染的默认值。当前唯一焦点:**组件能不能和 MUI 视觉 1:1**。
- **最终目标**:API 稳定后抽成 monorepo(`packages/lynx-mui` + `apps/playground`),`@lynx-js/react` 走 peerDependencies,用 Rslib + `pluginReactLynx()` 打包发 npm。**现在先在单仓库攒组件**(用户已拍板:攒够再抽,提前抽会拖慢)。

---

## 2. 仓库 / 关键路径 / 命令

- **仓库**:https://github.com/1600822305/lynx-mui (本机 `/home/ubuntu/repos/lynx-mui`)。本会话对该仓库**有 git 写权限**,子模型通常没有 → 走 patch。
- **MUI 源码基准 (SSOT,只读)**:`/home/ubuntu/mui-ref/node_modules/@mui/material` (**v7.3.11**) + `/home/ubuntu/mui-ref/node_modules/@mui/icons-material`。**所有数值都要回这里逐属性核对。**
- **库本体**:`src/lynx-mui/`(自包含,出口收敛在 `src/lynx-mui/index.ts`)。
- **对照画廊**:`src/App.tsx`(每加一个组件就在这追加一段 demo,供 LynxExplorer 肉眼比对)。
- **命令**(见 `AGENTS.md`):
  ```
  npm run dev          # 起 dev server(LynxExplorer 扫码/手填 URL 预览)
  npm run build        # 构建 Lynx 产物 dist/main.lynx.bundle
  # 每次改完必须过:
  npx tsc --noEmit -p src/tsconfig.json && npm run build
  ```
- **真机预览连不上**常见坑:dev server 挑了代理/VPN 的虚拟网卡(如 `198.18.0.x`)。解法:`adb reverse tcp:3000 tcp:3000` 然后 LynxExplorer 填 `http://localhost:3000/main.lynx.bundle?fullscreen=true`;或同 WiFi 填电脑真实 `192.168.x.x`;或关掉 Clash TUN 再 `npm run dev`。

---

## 3. 架构(模块化工厂,**不准每组件堆样板**)

分层(自底向上):
```
L4 公共 API    src/lynx-mui/index.ts        镜像 @mui/material 的导出
L3 组件层      src/lynx-mui/components/*.tsx 每个组件 = 一张"声明表"(spec)+ 样式函数
L2 工厂        src/lynx-mui/system/createComponent.tsx
L1 样式引擎    src/lynx-mui/system/          sx 运行时 + 最小主题 + 简写展开 + 状态拆分
L0 适配        Lynx intrinsic 元素 <view>/<text>/<image>/<scroll-view>/<svg>
```

- **`createComponent(spec)`** 把"声明"变成可用组件,统一处理:主题注入、sx 解析、交互状态(press/disabled)、事件接线(`bindtap` + touch)、className/style 合并。组件文件因此只剩声明 + 样式函数。
  - spec 字段:`name / root / defaultProps / ownerState(p) / rootStyle(os,theme) / content(args) / stateful:{active}`。
  - `rootStyle` 返回的 sx 对象里可以写 `&:active` / `&.Mui-disabled` 状态选择子,工厂按当前状态合并。
- **不走工厂的组件**:需要 cloneElement 子节点 / 复杂内部结构的(如 `Switch`/`SwitchBase`/`FormControlLabel`/`IconButton` 的内容槽),可写成普通函数组件或用 `content` 槽 —— 参考这些已有文件。
- **sx 运行时流水线**:`sx → ①简写展开(shorthands.ts) → ②主题解析(spacing/palette,resolveSx.ts) → ③响应式(按屏宽,目前最小实现) → ④状态拆分(&:active/&.Mui-disabled) → ⑤合并成 inline style`。**数值型长度自动补 px**(unitless 属性 + 0 除外)。

---

## 4. 1:1 复刻铁律

1. **数值唯一来源 = MUI v7.3.11 源码**,不是记忆、不是"差不多"。每个组件去读
   `mui-ref/.../@mui/material/<C>/<C>.js` 的 `styled(...)` 根样式 + `variants`,**逐属性翻译**。
2. 主题 token 用 MUI `createTheme()` 默认值核对(palette / spacing / typography / shadows / shape)。
3. 图标走 **`@mui/icons-material` 的精确 `<path d=...>`**(24×24),verbatim 注入 `<svg content>`,**像素级**,不是仿。
4. 交付的 patch 即使是子模型"按读源码要求"做的,**你仍要亲自再核一遍**(尤其 padding 矩阵、color 取值、尺寸)。历史上抓到过真实偏差(如 Badge default 底色、Button padding 矩阵、letterSpacing)。

---

## 5. Lynx 约束速查(踩过的坑,务必传达给子模型)

1. **Lynx `<text>` 不继承字体**:`fontSize`/`fontWeight`/`color`/`lineHeight`/`letterSpacing` 不会从 `<view>` 父级继承 → 每个 `<text>` 必须自带解析后的字体属性。(Button/Tab label 都踩过。)
2. **Lynx `<svg>` 不继承 currentColor**:svg 是单个原生 view,拿不到环境色 → 父组件必须把颜色用 `htmlColor` 显式传给图标(IconButton/Alert 都这么做)。`inherit` 没法实现时退化到 `text.primary`。
3. **没有 `display: 'block'`** → 用 `'flex'`(CardMedia 踩过)。`'inline-flex'` 可用(Badge 在用)。
4. **所有非 0 长度必须带单位**:sx 运行时会自动补 px,但裸 `style={{}}` 必须自己写 `'4px'`(PR#7 专门修过 "CSS length need units")。
5. **不要用 `%` 圆角**:仓库约定用 px = 盒子一半(Chip `'16px'`、IconButton `padding+12`、Avatar 40→`'20px'`、Switch thumb `thumb/2`)。
6. **没有 `@media` / `:hover` / 兄弟选择子**:hover 移动端丢弃 → 映射成 `&:active`(press,走工厂 `stateful:{active:true}`)。
7. **浮层定位(已更正:用 `position: fixed`)**:纯 Lynx 应用里 `fixed` **受支持**,且 fixed 节点会**提升到 root**(= 天然 portal)→ 全屏遮罩/居中直接 `fixed` + `inset:0`。内置 `<overlay>` 元素**仅用于把 Lynx 嵌进原生页**,整页 Lynx 项目官方明确建议**不用** `<overlay>`、直接 fixed。锚定浮层(Tooltip/Menu/Popover/Select)用 `boundingClientRect`(`NodesRef.invoke({method:'boundingClientRect',params:{relativeTo:'screen'}}).exec()`,后台线程**异步**;无 `useLayoutEffect`)测锚点坐标再 fixed 定位。**无法实时测量**的场景(如滑动指示条)仍降级(Tabs 改成每个选中 Tab 内画 2px 条)。
8. **动画**:Lynx **原生支持** `@keyframes` + `animation` + `transition` + `transform`(已确认)。但 `<svg content>` 是静态字符串,**不能动画 svg 内部属性**(如 stroke-dasharray 形变)→ 改成动画外层 `<view>` 的 transform。inline style 不能定义 `@keyframes` → 写进 `.css` 文件再 import。

---

## 6. 当前进度(已合并进 main)

**40 个组件 + SvgIcon 基座 + 33 个预制图标。** 导出见 `src/lynx-mui/index.ts`。

- **基座/核心**:sx 运行时、`createComponent` 工厂、最小默认主题、`usePressState`、`useControlled`、`alpha`、`lighten`/`darken`(`utils/lighten.ts`)。
- **已合并组件**:Box, Typography, Button, IconButton, Stack, Paper, Divider, Chip, Container, Card, CardContent, CardActions, CardHeader, CardMedia, CardActionArea, Toolbar, List, ListItem, ListItemText, AppBar, ToggleButton, Link, Badge, DialogTitle, DialogContent, DialogContentText, DialogActions, Tab, Tabs, Breadcrumbs, Checkbox, Radio, Switch, FormControlLabel, **Alert, AlertTitle, Avatar, AvatarGroup, CircularProgress, LinearProgress**。
- **图标**:SvgIcon + createSvgIcon 工厂 + 33 个预制(Close/Check/Menu/Search/ExpandMore/Delete/Star/Info/Warning/CheckCircle/Favorite/Settings/Add/ArrowBack/Home/Visibility… + CheckBox/CheckBoxOutlineBlank/RadioButtonChecked/RadioButtonUnchecked + CheckCircleOutline/ReportProblemOutlined/ErrorOutline/InfoOutlined/Person)。
- **PR 历史**:#1 文档清单 / #2 工厂内核+Box/Typography/Button / #3 中文字体修复 / #4 Stack/Paper/Divider/Chip / #5 1:1 源码修正 / #6 12 组件(布局+AppBar 族+Dialog 片) / #7 px 单位修复 / #8 图标系统 / #9 Card 家族+导航+选择控件 / #10 IconButton / #11 本统筹文档 / #12 批次 G/H/I 6 组件(Alert/Avatar/Progress)。**全部已合并。**

> **已知降级点**(代码里有注释):~~AppBar `position:fixed`→static~~(**旧假设,已更正**:fixed 在 Lynx 受支持,恢复 AppBar fixed 列入 backlog);Link hover 丢弃;DialogActions 用 gap;Tabs 指示条逐 Tab 画;Breadcrumbs 不做 `maxItems` 折叠;选择控件 onChange 上报 next checked 值(无 DOM event);**CircularProgress indeterminate = 固定弧 + 整体旋转(svg content 静态串不能 morph dasharray);LinearProgress indeterminate = 双 bar 滑动近似;动画 `@keyframes` 写在 `components/progress.css` 里再 import(inline style 不能声明 keyframes)**。

---

## 7. 并行工作流(怎么外包给子模型)

1. **切零重叠批次**:批次之间 + 跟 main 已合并的,**组件文件零重叠**;允许同时**追加** `index.ts` / `App.tsx`(append-only,冲突好解)。一批 2-3 个相关组件。
2. **写 spec 交接文档**(放 `docs/handoff-batch<X>-*.md`),必含:① 1:1 铁律 ② Lynx 约束速查 ③ 工厂架构要求 ④ 每个组件的 v7 精确数值 ⑤ Lynx 降级点 ⑥ 验证命令 ⑦ **交付方式 = 导 patch**。参考已有的 `handoff-batchG/H/I-*.md`。
3. **patch 交付**(子模型没 git 权限也行):
   ```
   git fetch origin main && git diff origin/main...HEAD > batchX.patch
   # 取不到 origin 就用本地: git diff main...HEAD > batchX.patch
   ```
   用户把 `.patch` 当附件发回。
4. 多个 patch 都动 `index.ts`/`App.tsx` 时,**合成一个 PR** 落地比开多个 PR 省事(避免 GitHub 上互相冲突)。

---

## 8. 整合 playbook(收到 patch 后你做的)

```bash
cd /home/ubuntu/repos/lynx-mui
git checkout main && git pull origin main
git checkout -b devin/$(date +%s)-<name>
git apply --reject /path/to/batchX.patch        # 组件/hook/icon 文件一般干净落地
# index.ts / App.tsx 多半 reject → 手动合并:
#   - index.ts: 追加 export(别动已有顺序)
#   - App.tsx : 合并 import(字母序)+ useState + 追加 gallery section
rm -f **/*.rej
npx tsc --noEmit -p src/tsconfig.json && npm run build   # 必须过,无 CSS 单位/display 报错
# 逐属性对 mui-ref 源码复核;修 Lynx 不兼容点(display:block、% 圆角、text 不继承字体、svg 颜色…)
git add <具体文件>                                # 不要 git add .
git commit -m "feat: ..." && git push -u origin HEAD
```
- 开 PR:先 `fetch_pr_template` 再 `git_create_pr`,描述要高信息量(只写读代码看不出的、为什么这么改、降级点)。
- `git_pr_checks` 等 CI 绿。**不要直接 push main,不 merge,等用户拍板**(用户在 LynxExplorer 肉眼验收)。
- 不要提交非功能文件(plan/todo/handoff 文档/截图)进功能 PR。

---

## 9. 在途 + 待办

**在途**:无。批次 G/H/I 已全部整合并合并(PR #12)。下一批待切。

> 整合 G/H/I 时复核改掉的真实偏差(供参考,说明子模型 patch 仍需亲自核):
> ① Avatar `colorDefault`(灰底+白字)应在"无图片"时就上,跟有无 children 无关;字母 `<text>` 用了 `color:'inherit'`(Lynx 不继承)→ 改显式白色。
> ② AvatarGroup 描边 `box-sizing` content-box → border-box(对齐 MUI 的 CssBaseline 默认,头像保持 40px)。
> ③ CircularProgress 去掉 `stroke-linecap='round'`(MUI 默认 butt)。

**Backlog(下一步,多数需要先建基座,适合你亲自做或谨慎外包)**:
- **OverlayManager 基座**(浮层定位 + 遮罩 + 居中,**基于 `position: fixed`**;锚定浮层用 `boundingClientRect` 测锚点)→ 解锁 **Tooltip / Menu / MenuItem / Dialog 壳 / Snackbar / Select / Popover**。
- **恢复 AppBar `position:fixed`**(之前按"fixed 不可靠"的旧假设降级成 static;fixed 实际受支持)。
- **TextField**(Tier S,85 处):input + label 浮动 + outline/filled/standard + helperText + adornment 图标。Lynx 输入用 `<input>`,需要查 Lynx input 能力。
- 其它高频未做:FormControl / InputLabel / InputAdornment / Collapse / Slider / Snackbar / LinearProgress(在批次 I) / Menu 族。
- 组件优先级看 `/home/ubuntu/aetherlink-mui-components.md`(Tier S→A→B→C 的频次清单)。

**终局**:API 稳定 → 抽 monorepo(packages/lynx-mui + apps/playground)→ Rslib + pluginReactLynx 打包 → 发 npm。

---

## 10. 纪律红线

- 不直接 push `main`/`master`;不 force push 别人分支;不 `git add .`;不改 git config;不 `--no-verify`;不 amend。
- 不提交疑似密钥文件。
- 改完**必过** `tsc --noEmit -p src/tsconfig.json && npm run build`。
- 数值拿不准就回 `mui-ref` 源码查,别猜。
- 降级如实告诉用户,别声称 100% 一致。
