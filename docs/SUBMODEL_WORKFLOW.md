# lynx-mui · 执行子模型通用工作流程 (SUBMODEL WORKFLOW)

> 这份是给**执行子模型**看的通用流程文档。统筹会**单独**发你一条"本批任务"消息(只含:批次号 + 组件清单 + 该批特有要点)。
> **你要做的 = 本文档的通用流程 + 那条任务消息里的组件清单。** 两者结合即可开工,不用再问统筹要细节。
>
> **第一步永远是 §1:先确认手上有这两个仓库/路径。没有就先弄到,再读文档、再动手。**

---

## 1. 第一步:先准备这两个仓库 / 路径(没有就先弄到,再往下做)

| 用途 | 路径 | 没有就执行 |
| --- | --- | --- |
| **① 工作仓库** lynx-mui(你写代码的地方) | `/home/ubuntu/repos/lynx-mui` | `git clone https://github.com/1600822305/lynx-mui /home/ubuntu/repos/lynx-mui` |
| **② MUI 参照源码** mui-ref(只读基准,**所有数值都回这核对**) | `/home/ubuntu/mui-ref/node_modules/@mui/material`(v7.3.11)+ `@mui/icons-material` | `cd /home/ubuntu/mui-ref && npm i @mui/material@7.3.11 @mui/icons-material@7.3.11` |

- 工作仓库:你通常**没有 git 写权限** → 最终**交 patch**,不要 push、不要开 PR(见 §8)。
- MUI 参照:读 `<C>/<C>.js` 的 `styled(...)` 根样式 + `variants` 逐属性翻译。
- 两个都就位后,再进 §2/§3。

---

## 2. 你的角色

- 你是**执行子模型**,只做**分配给你的这一批**组件,不是统筹、不做整合、不开 PR。
- 逐属性 1:1 复刻 `@mui/material` **v7.3.11** 到 Lynx(ReactLynx)。
- 干净、业务无关:**不要**把任何业务(如 AetherLink)的 theme/token 写进来。
- 诚实:Lynx 实现不了的地方就**降级 + 注释写明**,不要假装一致。

---

## 3. 开工前必读

1. **读唯一事实来源 (SSOT)**:`docs/ORCHESTRATION.md`(架构 / 1:1 铁律 / Lynx 约束速查 / 工厂用法 / 整合流程)+ 本文档。本文档不重复 SSOT,只给你的执行清单。
2. **Lynx 必读**(做任何 Lynx 任务前):https://lynxjs.org/next/llms.txt 。涉及输入控件再查 `<input>` / `<textarea>` 文档;相关:Rsbuild https://rsbuild.rs/llms.txt 、Rspack https://rspack.rs/llms.txt 。

---

## 4. 1:1 复刻铁律

1. **数值唯一来源 = MUI v7.3.11 源码**,不是记忆、不是"差不多"。padding 矩阵 / 颜色取值 / 尺寸 / 圆角 / 字重逐属性翻译。
2. **公共 API / prop 名必须和 MUI 1:1**(组件名、prop 名、默认值、variant 取值)。这是最贵的返工源——名字错了,后面所有调用方和 demo 都得改。拿不准就照 MUI `.d.ts` 抄。
3. **主题 token 用 MUI `createTheme()` 默认值核对**(palette / spacing / typography / shadows / shape)。**直接从 `src/lynx-mui/system/defaultTheme.ts` 读取并引用**,不要硬编码数值。
4. **图标走 `@mui/icons-material` 的精确 `<path d=...>`**(24×24),verbatim,像素级,不是仿。复用已有 `SvgIcon` / `createSvgIcon`。
5. 复用已有**工厂 + sx 运行时**(`createComponent` / `sxToStyle`),别每组件堆样板;复杂结构参考已有手写组件(SwitchBase / Rating / Accordion)。

---

## 5. Lynx 约束速查(踩过的坑)

> 完整版见 ORCHESTRATION.md §5。高频要点:

1. **`<text>` 不继承字体** → 每个 `<text>` 自带 `fontSize`/`fontWeight`/`color`/`lineHeight`/`letterSpacing`(`fontWeight` 是**字符串**:`'400'`/`'500'`)。
2. **`<svg>` 不继承 currentColor** → 父组件用 `htmlColor` 显式传色;`inherit` 实现不了就退化 `text.primary`。
3. **没有 `display:'block'`** → 用 `'flex'`。(`'inline-flex'` 经 sx 运行时可用。)
4. **所有非 0 长度带单位**:sx 运行时自动补 px;裸 `style={{}}` 必须自己写 `'4px'`。
5. **不要用 `%` 圆角** → 用 px = 盒子一半。
6. **没有 `@media` / `:hover` / 兄弟选择子 / class 选择子** → hover 映射成 `&:active`(press);需要"相邻元素"样式的用**逐位置注入 style** 替代。
7. **浮层用 `position:fixed`**(fixed 节点提升到 root = 天然 portal);锚定定位用 `boundingClientRect`(`NodesRef.invoke({method:'boundingClientRect',params:{relativeTo:'screen'}}).exec()`,后台线程**异步**,无 `useLayoutEffect`)。**注意:浮层基座已在 main,浮层批次由统筹另外分配——非浮层批次不要碰这块。**
8. **动画**:`@keyframes`/`animation`/`transition`/`transform` 原生支持;但 `@keyframes` **不能写 inline style** → 写进 `components/<name>.css` 再 import(参考 `progress.css` / `skeleton.css`)。`<svg content>` 是静态串,不能动画 svg 内部属性 → 动外层 `<view>` 的 transform。
9. **类型规范**:不用 `any` / `getattr` / `as unknown as`;Lynx csstype 里 `overflow`/`fontWeight` 等都是合法键,直接写。

---

## 6. 零重叠铁律(避免和别的批次/统筹撞车)

1. **只新增你这一批的组件文件**(`src/lynx-mui/components/*.tsx` 及必要的 `*.css`)。
2. **绝对不要动 `src/lynx-mui/system/*`**(`defaultTheme` / `types` / `resolveSx` / `createComponent` / `shorthands`)。**缺主题值/缺 token 不要自己往 system 里加**——在 patch 里**标注 `FLAG: 缺 xxx`** 反馈给统筹,先用 MUI 默认值内联 + 注释,统筹会补进基座。
3. **`index.ts` / `App.tsx` 只能【末尾追加】**(append export / append demo),**别改已有行**(别动已有 import 顺序、别删别人的行)。多个批次都追加末尾——这是允许的,统筹整合时会手动合并 EOF。
4. 不碰浮层基座、不碰别的批次的组件文件。

---

## 7. demo + 验证(交付前必做)

1. **App.tsx 末尾追加本批 demo**:把你这批每个组件都摆一个可视示例(供统筹/用户在 LynxExplorer 肉眼比对 MUI)。
2. **降级登记**:每个 Lynx 实现不了/简化的点,在**代码注释**里写明(`// Lynx degradation: ...`),方便后续质量 pass 回填。
3. **门禁必过(红就别交)**:
   ```
   npx tsc --noEmit -p src/tsconfig.json && npm run build
   ```
   `tsc` exit 0 且 build 无 CSS 单位/`display` 报错。

---

## 8. 交付方式(= 导 patch,别 push 别开 PR)

```
git fetch origin main && git diff origin/main...HEAD > batch<X>.patch
# 取不到 origin 就用本地基线:git diff main...HEAD > batch<X>.patch
```
- 把 `batch<X>.patch` **当附件发回**给用户/统筹。
- patch 里**只含你新增/末尾追加的改动**;不要带 `pnpm-lock.yaml`、`dist/`、`.rej`、plan/todo 等非功能文件。
- 在交付消息里附上:① 跑过的验证结果(tsc/build) ② 逐组件 1:1 要点 ③ **FLAG 的缺失 token** ④ Lynx 降级清单。

---

## 9. 一句话总结

> **先确认两个仓库/路径就位(§1)** → 读 SSOT(ORCHESTRATION.md)+ Lynx llms.txt → 只写本批组件文件、不碰 system/、index.ts·App.tsx 末尾追加 → 逐属性 1:1 + API/prop 名对齐 + 降级注释 → `tsc && build` 全绿 → 导 `batch<X>.patch` 当附件发回(不 push、不 PR)。本批组件清单见统筹单独发你的任务消息。
