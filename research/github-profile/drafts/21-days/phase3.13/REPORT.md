# Phase 3.13 · 文档收口与三事实来源确立

> **阶段状态（Phase 3.13 核定）**：基于已推送至 `origin/work/profile-development` 的 `fbf691b`（Phase 3.12），完成前三幕视觉验收后的文档收口，确立全项目三大事实来源，为进入第四幕做好清晰边界。本阶段仅涉及文档与口径统一，未修改任何画面资产、运行时源码、根目录 `README.md`、`assets/` 或 `main` 分支。

## 做了什么

1. **确立三事实来源架构**：在 [PROJECT_STATUS.md](../PROJECT_STATUS.md)、[ASSET_MANIFEST.md](../ASSET_MANIFEST.md)、[AGENTS.md](../../../../../AGENTS.md) 与 [HANDOFF.md](../../../../../HANDOFF.md) 中明确后续项目的三类唯一事实来源：
   - `PROJECT_STATUS.md`：回答项目现在做到哪里了。
   - `ASSET_MANIFEST.md`：回答哪些素材正在使用、哪些已经认可。
   - `phase*/REPORT.md`：回答每个阶段具体做了什么、如何验证、最终结果是什么。
2. **新建 [PROJECT_STATUS.md](../PROJECT_STATUS.md)**：汇总 `fbf691b` 基线下的九幕时间轴（`39.90 s`、统一 `534 × 485` 纯彩绘满幅）、前三幕验收范围、第 4–9 幕待制作状态、验收边界（不外推至后六幕、不扩大至 Candidate A MP4 独立验收、不触碰线上发布文件）及第四幕入口。
3. **补齐并核定 [ASSET_MANIFEST.md](../ASSET_MANIFEST.md)**：
   - 新增顶层「当前正在使用的运行资产（第 1–9 幕）」总表，完整覆盖第一幕打光原画、第二幕校白高清图集与帧表、第三幕底图/延展底图/局部动作图集及第 4–9 幕 SVG 分镜源图，逐项附 SHA256 与验收状态。
   - 清除旧版「高清候选仍待最终定稿视觉验收」的过期措辞，严格区分「用户已认可参考原件（两份 V3 GIF）」「高清素材来源（Candidate A 1254 px MP4，不扩大为独立验收）」与「已通过视觉验收的运行图集（`second-act-v3/frames-hd.webp`）」。
   - 完整保留既有入库原件、来源审计表、旧九格发布稿及 `export.mjs` 导出限制说明。
4. **统一既有阶段报告与历史笔记口径**：
   - 在 [phase3.10/REPORT.md](../phase3.10/REPORT.md)、[phase3.11/REPORT.md](../phase3.11/REPORT.md)、[phase3.12/REPORT.md](../phase3.12/REPORT.md) 顶部补充 Phase 3.13 核定状态头，标明提交哈希、沿用范围与替代关系，原始验证记录完整保留。
   - 在 [NOTES.md](../NOTES.md) 顶部添加历史记录说明，指向 `PROJECT_STATUS.md` 与 `ASSET_MANIFEST.md`。
   - 明确 `NOTES.md`、`writing-motion/`、`writing-motion-minimal.zip`、`scratch/`、`acting/`、`model/`、`style-match/`、`github/` 及旧版静态截屏仅作历史归档或辅助产物，不删除历史档案，也不作为当前状态事实来源。
5. **同步交接与协作入口**：更新 [HANDOFF.md](../../../../../HANDOFF.md)（顶部追加 Phase 3.13 交接段，保留全部历史）与 [AGENTS.md](../../../../../AGENTS.md)（将协作入口指向三大事实来源与第四幕主线）。

## 历史实验与文件引用审计（9 个目录）

本轮对 `scratch/`、`writing-motion/`、`reading-motion/`、`style-match/`、`phase3.10/`、`phase3.11/`、`phase3.12/`、`building-motion/`、`second-act-v3/` 共 **1,998 个文件（1,879.79 MiB）** 执行了只读审计（**未删除、未移动、未重命名任何文件**）。

### 1. A–F 分类统计（互斥主分类）

> 注：为避免重复计数，下表对每个文件归入唯一主分类——**A** 计目录内运行时代码/配置（4 个），其与 **B** 类中被运行时直接加载的 5 张原图（`reading-motion/lighting/*.png`、`building-motion/p0.png`）及 **C** 类全部 5 个派生运行资产共同组成 9 目录内的 14 个运行时直接依赖；加上顶层 `index.html`、`preview-*.html`、`story.js`、`reading-shot.js` 及外部 `cpp-humor/storyboards/21-days/`、`personal-corner/assets/`，整页共 **28 条运行时引用，100% 存在**。`assets/previews/*.gif`（2 份已认可参考原件）位于 `assets/` 目录，详见 [ASSET_MANIFEST.md](../ASSET_MANIFEST.md)。

| 目录 | A 运行依赖 | B 已认可原始素材 | C 已认可派生运行素材 | D 历史审阅材料 | E 否决/废弃实验 | F 待确认用途 | 合计文件 | 体积 (MiB) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `scratch/` | 0 | 0 | 0 | 23 | 0 | 0 | 23 | 37.82 |
| `writing-motion/` | 0 | 0 | 0 | 86 | 1,775 | 3 | 1,864 | 1,717.10 |
| `reading-motion/` | 2 | 4 | 0 | 45 | 4 | 0 | 55 | 55.71 |
| `style-match/` | 0 | 0 | 0 | 24 | 0 | 0 | 24 | 16.86 |
| `phase3.10/` | 0 | 0 | 0 | 4 | 0 | 0 | 4 | 10.96 |
| `phase3.11/` | 0 | 0 | 0 | 5 | 0 | 0 | 5 | 8.72 |
| `phase3.12/` | 0 | 0 | 0 | 11 | 0 | 0 | 11 | 12.08 |
| `building-motion/` | 1 | 3 | 3 | 1 | 0 | 0 | 8 | 12.40 |
| `second-act-v3/` | 1 | 0 | 2 | 1 | 0 | 0 | 4 | 8.13 |
| **合计** | **4** | **7** | **5** | **200** | **1,779** | **3** | **1,998** | **1,879.79** |

- **分类体积汇总**：A `0.01 MiB` · B `17.17 MiB` · C `11.44 MiB` · D `261.16 MiB` · E `1,589.63 MiB` · F `0.37 MiB`。
- **目录外（`21-days/` 顶层）待确认项**：`writing-motion-minimal.zip`（13.06 MiB，SHA256 `4ccab525eeb7de91450f72ab9098ffb4daa564b9ee399fd6b84c30c227a2d4cb`，无任何代码/文档引用）；`full-light.png`、`full-dark.png`、`readme-light.png`、`readme-dark.png`（Phase 3.9 整页截屏，当前无 HTML 引用）。

### 2. 重复文件与内容相同但命名不同的文件

全范围（9 目录 + 顶层 + `assets/`）按 SHA256 共检出 **152 组完全重复文件**，其中跨目录或异名代表项如下：

| 类型 | SHA256 前 12 位 | 大小 | 文件路径 | 说明 |
| --- | --- | ---: | --- | --- |
| 异名重复（有意） | `6a446e580fca` | 10,605 B | `index.html` = `preview-light.html` | `build.py` 复制生成默认浅色入口 |
| 跨目录异名重复 | `2547d4edb6a4` | 2,165,011 B | `reading-motion/lighting/down-v2.png` = `style-match/down-light-v2.png` | 第一幕低头打光原画在风格试样目录的同字节副本 |
| 跨目录同名重复 | `30c99af1ee1a` | 2,901,911 B | `building-motion/p0.png` = `scratch/third-act-eye-study/p0.png` | 第三幕 P0 原画在独立眼部试段的同字节原件 |
| 跨目录异名重复 | `d4817af9aa7f` | 3,214,067 B | `building-motion/source/eyes.apng` = `scratch/third-act-eye-study/preview.png` | 第三幕眼部 APNG 源与其试段导出预览完全同字节 |
| 同目录异名重复（验证证据） | `e33cc462f7cd` | 3,904,975 B | `scratch/third-act-eye-study/first.png` = `restored.png` | 用于证明眼部恢复帧与首帧零差分 |
| 同目录异名重复 | `465b76cbeeaf` / `466cd711cb1f` | 459 KB / 458 KB | `style-match/actual-front.png` = `actual-accent-end.png`；`actual-down.png` = `actual-accent-hidden.png` | 第一幕惊叹线对照截屏 |
| 历史实验内部重复（145 组） | 多组 | — | `writing-motion/` 内部（如 `shot-candidate-v44..51.js` 与 `shot-v44..51.js`、`candidate-check/` 与父级快照、`scratch/` 内重复验证脚本和对照图） | 全部属于旧第二幕书写实验历史副本 |

> 注：`scratch/third-act-paw-touch/preview.png`（`583cedaa...`，3,324,721 B）与 `building-motion/source/forepaw.apng`（`641a53c5...`，3,394,843 B）并非同字节文件，属不同封装版本，均予保留。

### 3. 失效路径引用与不再使用的临时入口

- **运行时与正式目录**：`index.html`、`preview-light.html`、`preview-dark.html`、`scratch/`、`reading-motion/`、`style-match/`、`phase3.10/`、`phase3.11/`、`phase3.12/`、`building-motion/`、`second-act-v3/` 均检出 **0 处失效引用**。
- **历史快照失效引用（140 处，全部位于 `writing-motion/` 子目录）**：分布在 `writing-motion/scratch/`（37 处）、`v25-before-form-repair/`（9 处）、7 个 `before-*` 目录（各 8 处）、`face-on-table-rejected/` 与 `page-angle-character-arm-rejected/`（各 7 处）等，成因为当时直接复制顶层 HTML 至嵌套子目录而未改写 `../reading-motion/lighting/down-v2.png` 或同级 `.md` 相对路径。
- **不再使用的临时入口**：9 个目录中共 90 个 `.html` 文件（`writing-motion/` 76、`reading-motion/` 6、`style-match/` 6、`scratch/` 2），仅 `reading-motion/index.html` 被顶层导航栏链接，其余 89 个均为独立历史审阅页，不参与主播放器运行。

### 4. 文档与实际运行依赖不一致审计

- **本轮已修正**：`phase3.10–3.12/REPORT.md` 过期提交/验收状态、`ASSET_MANIFEST.md` 过期高清候选状态及缺失的第一/三/四至九幕运行资产、`NOTES.md` 过期状态误导、`HANDOFF.md` 与 `AGENTS.md` 停留在 2026-11-19 / 第二幕旧主线的问题均已统一。
- **保留说明（按保护规则未改代码/截图）**：顶层 `full-light.png`、`full-dark.png`、`readme-light.png`、`readme-dark.png`、`mobile-light.png`、`mobile-dark.png` 为 Phase 3.9（2026-11-27）截屏（其中 `mobile-*.png` 仍由 `index.html`/`preview-*.html` 页内链接引用），早于 Phase 3.11–3.12 满幅更新；`github/assets/hero-*.gif` 仍为 `export.mjs` 静态九格轮播。本轮按保护要求未重跑 `build.py` 或重截屏。

### 5. 待用户确认的候选清理清单（本轮未删除）

以下路径均已核验**零运行时引用**，如需瘦身仓库可由用户在后续轮次授权清理：

| 候选路径 | 规模 | 建议理由 | 运行时引用检查 |
| --- | --- | --- | --- |
| `research/github-profile/drafts/21-days/writing-motion-minimal.zip` | 1 文件 / 13.06 MiB | 2026-11-16 遗留打包 ZIP，未被任何 HTML/JS/脚本/文档引用 | 0 引用 |
| `research/github-profile/drafts/21-days/writing-motion/*-rejected/`（18 个子目录） | 116 文件 / 38.44 MiB | 明确否决的第二幕旧书写方案子目录，已整体被 V3 替代 | 0 引用 |
| `research/github-profile/drafts/21-days/writing-motion/` 中其余 E 类历史实验快照（`before-*`、`v25-*`、`v64..67-*`、`candidate-check/`、`motion-study-check/`、`scratch/`、`shot-v*.js` 等） | 1,659 文件 / 1,548.00 MiB | 旧第二幕书写动画探索与内部重复副本（含 145 组重复文件与 140 处嵌套 HTML 断链）；若需保留反馈截图与提示词，可仅保留 D 类 86 文件 | 0 引用 |
| `research/github-profile/drafts/21-days/reading-motion/rejected-*.js` 与 `redrawn/rejected-atlas.png` | 4 文件 / 3.19 MiB | 第一幕早期明确否决的测试脚本与旧图集 | 0 引用 |

## 如何验证

- **Markdown 内部链接检查**：扫描 `AGENTS.md`、`HANDOFF.md`（顶部交接段）、`PROJECT_STATUS.md`、`ASSET_MANIFEST.md`、`NOTES.md`（历史标注段）及 `phase3.10`–`phase3.13` 四份 `REPORT.md` 全部相对路径链接，确认 **0 处断链**。
- **资产清单 SHA256 逐项核验**：对 `ASSET_MANIFEST.md` 全部 **39 项**资产（含第 1–9 幕运行资产、参考原件、MP4 候选、审计原件与旧发布稿）重新计算 SHA256 并与磁盘逐一比对，**100% 一致**。
- **运行时引用全链路校验**：解析 `index.html`、`preview-light.html`、`preview-dark.html` 及运行时 JS（`config.js`、`second-act-v3/shot.js`、`building-motion/shot.js`）的全部 **28 条**本地依赖路径，全部存在于磁盘。
- **格式与代码/发布保护核验**：执行 `git diff --check` 无空白/格式错误；`git status` 与 `git diff --name-only` 确认仅修改文档文件，第一至三幕动画代码/素材、历史文件、`main` 分支与根目录线上文件均零改动、零删除、零移动。

## 最终结果

- 三大事实来源（`PROJECT_STATUS.md`、`ASSET_MANIFEST.md`、`phase*/REPORT.md`）建立并彼此对齐，所有跨文档引用、SHA256 与验收口径一致。
- 完成 9 个核心目录（1,998 文件、1,879.79 MiB）的 A–F 分类与重复/断链/无引用审计，输出待确认候选清理清单，未擅自删除或移动任何历史文件。
- 前三幕动画与九幕 `534 × 485` 满幅基线（`fbf691b`）正式收口归档，项目具备直接进入 **第四幕（`Days 698–3648: Learn together.`）** 的清晰起点。
