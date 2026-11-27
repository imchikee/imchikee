# 21 Days 仓鼠动画 · 项目状态总览（Phase 3.13）

> 本文档是 `research/github-profile/drafts/21-days/` 的**项目当前状态事实来源**（核定日期：2026-11-28，Phase 3.13）。仓库：`imchikee/imchikee`，工作分支：`work/profile-development`，代码与画面基线：`fbf691b22f372178edd04a5499fd93556c6c431b`（Phase 3.12，已推送至远端）。根目录 `README.md`、`assets/` 与 `main` 分支属于线上内容，用户确认发布前保持不动。

## 项目三事实来源

后续所有维护、协作与新幕推进统一以下列三类文档为唯一事实来源：

1. **[PROJECT_STATUS.md](PROJECT_STATUS.md)**（本文件）：回答**项目现在做到哪里了**（故事结构、九幕进度、运行架构、基线提交、验收边界与下一阶段入口）。
2. **[ASSET_MANIFEST.md](ASSET_MANIFEST.md)**：回答**哪些素材正在使用、哪些已经认可**（第 1–9 幕运行资产、原始参考原件、素材来源、尺寸、SHA256 与验收范围）。
3. **`phase*/REPORT.md`**：回答**每个阶段具体做了什么、如何验证、最终结果是什么**（[Phase 3.10](phase3.10/REPORT.md) · [Phase 3.11](phase3.11/REPORT.md) · [Phase 3.12](phase3.12/REPORT.md) · [Phase 3.13](phase3.13/REPORT.md)）。

其他历史笔记与过程目录（如 `NOTES.md`、`writing-motion/`、`scratch/`、`acting/`、`model/`、`style-match/`、`github/` 及旧版静态截屏 `full/readme/mobile-*.png`、`writing-motion-minimal.zip`）仅保留作历史依据或辅助产物，不作为当前状态与验收判断依据。

## 项目目标与整体故事结构

- **项目目标**：为个人 GitHub Profile 首屏打造一套绘本手绘风格的连续角色动画，在保证深浅主题兼容与桌面/移动端一致画幅的前提下，逐步将九格静态漫画升级为连续动作演出；全片完成并获用户确认后再导出便携素材替换线上主页。
- **整体故事结构**：改编自 [Abstruse Goose #249](https://abstrusegoose.com/249)（“Teach Yourself C++ in 21 Days”），以戴绿帽的仓鼠为主角，分 **9 幕**讲述“21 天学会 C++”的荒诞长旅：初学语法（第 1 幕）→ 深入笔记（第 2 幕）→ 动手做项目（第 3 幕）→ 协作学习（第 4 幕）→ 研习物理与生物（第 5–6 幕）→ 研制返老还童药剂（第 7 幕）→ 穿越时空回到第 21 天（第 8 幕）→ 取代年轻的自己完成“21 天学会 C++”（第 9 幕）。

## 九幕当前状态

整页播放器总时长 **39.90 秒**，统一采用 **`534 × 485`** 纯彩绘满幅舞台（桌面实际显示 `528 × 479.55` CSS px，移动端 `317 × 287.91` CSS px）。第 1–3 幕为 Canvas 实时动作，第 4–9 幕为 SVG 静态分镜占位。[整页预览](index.html) · [浅色预览](preview-light.html) · [深色预览](preview-dark.html) · [时间轴源码](story.js)

| 幕 | 标题 | 全局时间窗 | 时长 | 当前实现 | 验收与采用状态 |
| --- | --- | --- | --- | --- | --- |
| 1 | `Days 1–10: The basics.` | `0.00–3.20 s` | `3.2 s` | Canvas 阅读动作（[reading-shot.js](reading-shot.js)，由 [build.py](build.py) 生成；`1316 × 1195` 原生缓冲合成后按 `63, 48 → 1259.82, 1135` 等比裁切输出） | 2026-11-03 阶段确认；Phase 3.11 满幅裁切已通过视觉验收 |
| 2 | `Days 11–21: More C++.` | `3.20–6.40 s` | `3.2 s` | Canvas V3 眨眼（[frames-hd.webp](second-act-v3/frames-hd.webp) + [frame-table.js](second-act-v3/frame-table.js) + [shot.js](second-act-v3/shot.js)；38 帧取自 Candidate A 1254 px MP4 `5×i+2`，沿用独立 GIF 80/90 ms 时长 3160 ms + 末帧 40 ms 保持，Phase 3.12 静态标题底色校白） | Phase 3.12 运行图集已通过视觉验收（详见下方口径边界） |
| 3 | `Days 22–697: Build things.` | `6.40–10.30 s` | `3.9 s` | Canvas 编码、前爪轻触与眼部微动（[p0.png](building-motion/p0.png) + [p0-extended.png](building-motion/p0-extended.png) + [patches.png](building-motion/patches.png) + [atlas.js](building-motion/atlas.js) + [shot.js](building-motion/shot.js)；30 fps / 117 帧；顶部 `1380 × 1140` 原画零差分锁定 + 底部 114 px 纯桌面延展至 `1380 × 1254`） | Phase 3.12 完整构图延展与动作已通过视觉验收 |
| 4 | `Days 698–3648: Learn together.` | `10.30–14.50 s` | `4.2 s` | SVG 静态分镜（`hamster-storyboard-v1.png`，`viewBox="21 446 384 350"`，`xMidYMin slice`） | 满幅取景已核验；**角色动作待制作（下一阶段入口）** |
| 5 | `Days 3649–7781: Study physics.` | `14.50–19.00 s` | `4.5 s` | SVG 静态分镜（`hamster-aged-panels-v2.png`，`viewBox="17 2 934 841"`，`xMidYMin slice`） | 满幅取景已核验；角色动作未开始 |
| 6 | `Days 7782–14611: Study biology.` | `19.00–23.50 s` | `4.5 s` | SVG 静态分镜（`hamster-aged-panels-v2.png`，`viewBox="965 3 893 839"`，`xMidYMin slice`） | 满幅取景已核验；角色动作未开始 |
| 7 | `Day 14611: Reverse aging.` | `23.50–28.10 s` | `4.6 s` | SVG 静态分镜（`hamster-storyboard-v1.png`，`viewBox="20 827 386 372"`，`xMidYMin slice`） | 满幅取景已核验；角色动作未开始 |
| 8 | `Day 14611 to day 21: Go back.` | `28.10–33.10 s` | `5.0 s` | SVG 静态分镜（`hamster-storyboard-v1.png`，`viewBox="435 827 382 372"`，`xMidYMin slice`） | 满幅取景已核验；角色动作未开始 |
| 9 | `Day 21: Take your own place.` | `33.10–39.90 s` | `6.8 s` | SVG 静态分镜（`hamster-storyboard-v1.png`，`viewBox="846 827 386 372"`，`xMidYMin slice`） | 满幅取景已核验；角色动作未开始 |

## 当前运行架构与素材入口

- **页面入口**：[index.html](index.html)（与 [preview-light.html](preview-light.html) 字节一致）及 [preview-dark.html](preview-dark.html)，由 [build.py](build.py) 基于 `../personal-corner/` 外框模板生成，支持 Play / Pause / Replay / Seek 与 `prefers-reduced-motion`。
- **总控调度**：[story.js](story.js) 维护九幕 `starts[]` 与 `duration = 39.9 s`，在共享 `<canvas id="reading-stage" width="534" height="485">` 与备用 `<svg id="story-art" preserveAspectRatio="xMidYMin slice">` 之间按幕切换：
  - 第 1 幕（`0.00–3.20 s`）：`createReadingShot()`（[reading-shot.js](reading-shot.js)）+ [contour-data.js](reading-motion/redrawn/contour-data.js) + [config.js](reading-motion/lighting/config.js) → 加载 `reading-motion/lighting/` 四张 `1316 × 1195` 原画。
  - 第 2 幕（`3.20–6.40 s`）：`createSecondActV3Shot()`（[second-act-v3/shot.js](second-act-v3/shot.js)）+ [frame-table.js](second-act-v3/frame-table.js) → 加载 [frames-hd.webp](second-act-v3/frames-hd.webp)。
  - 第 3 幕（`6.40–10.30 s`）：`createBuildingShot()`（[building-motion/shot.js](building-motion/shot.js)）+ [atlas.js](building-motion/atlas.js) → 加载 [p0.png](building-motion/p0.png)、[p0-extended.png](building-motion/p0-extended.png)、[patches.png](building-motion/patches.png)。
  - 第 4–9 幕（`10.30–39.90 s`）：切换 SVG `viewBox`，在 [hamster-storyboard-v1.png](../../cpp-humor/storyboards/21-days/hamster-storyboard-v1.png)（第 4、7–9 幕）与 [hamster-aged-panels-v2.png](../../cpp-humor/storyboards/21-days/hamster-aged-panels-v2.png)（第 5–6 幕）双图层间显示。

## 关键资产目录

| 目录 | 职责与定位 | 是否运行时直接依赖 |
| --- | --- | --- |
| `reading-motion/` | 第一幕阅读动作源码、轮廓数据与打光原画（`lighting/`、`redrawn/contour-data.js` 被整页加载；其余为独立试段与对比历史） | 部分依赖（详见 [ASSET_MANIFEST.md](ASSET_MANIFEST.md)） |
| `second-act-v3/` | 第二幕 V3 校白高清运行图集、帧表、播放模块与打包脚本 | 是（`frames-hd.webp`、`frame-table.js`、`shot.js`） |
| `building-motion/` | 第三幕原画 P0、底部延展底图、局部动作图集、播放模块与源 APNG | 是（`p0.png`、`p0-extended.png`、`patches.png`、`atlas.js`、`shot.js`） |
| `assets/` | 2026-11-23 入库的第二幕参考原件 GIF、MP4 候选与来源审计 | 否（原件归档与构建输入） |
| `../../cpp-humor/storyboards/21-days/` | 第 4–9 幕静态分镜源图与完整漫画 SVG | 是（第 4–9 幕 SVG 图层） |
| `phase3.10/`、`phase3.11/`、`phase3.12/`、`phase3.13/` | 各阶段报告、验收对照图、审阅 MP4 与合成脚本 | 否（事实来源：阶段报告与证据） |
| `scratch/` | 第三幕眼部与前爪轻触独立研究源图、提示词与试段 | 否（源素材归档） |
| `writing-motion/`、`style-match/`、`acting/`、`model/` | 第一、二幕早期探索与被替代/否决实验档案 | 否（历史归档） |

## 正式发布 README 与本地动画预览的区别

| 形态 | 路径 | 当前内容与机制 | 发布边界 |
| --- | --- | --- | --- |
| **线上正式主页** | 根目录 `README.md`、`assets/`（`main` 分支） | 现网正在展示的个人主页 | **线上内容，严格锁定，确认发布前禁止替换** |
| **草稿静态 GIF 发布稿** | [github/README.md](github/README.md) 与 `github/assets/hero-*.gif` | 由 [export.mjs](export.mjs) 在每幕起点后 0.1 s 截取单帧静图拼成 9 帧轮播 GIF，无 JS 依赖 | 仅作便携兼容草稿，**不是**当前连续动作成果 |
| **本地可控制动画预览** | [index.html](index.html) / [preview-light.html](preview-light.html) / [preview-dark.html](preview-dark.html) | HTML + Canvas + SVG 实时播放第 1–3 幕连续动作与第 4–9 幕满幅分镜，支持播放控制与深浅主题 | **当前开发主线与视觉验收入口** |

## 验收口径与边界

- **第二幕原件、素材源与运行图集严格区分**：两份原始 V3 GIF（`second-act-v3-blink-preview.gif` 与 `first-act-plus-second-act-v3-blink-preview.gif`）保持**用户已认可参考原件**状态；Candidate A 1254 px MP4 仅作为高清素材来源，**不扩大为该 MP4 独立验收**；当前实际采用并通过整页视觉验收的是经 Phase 3.12 静态标题底色校白后的无损运行图集 [second-act-v3/frames-hd.webp](second-act-v3/frames-hd.webp)（SHA256 `eb63ca9e948530a489e1e9c1a0652f13c6df2ecd95eb463870ef1af2e581e873`）。
- **验收不自动外推**：前三幕及九幕满幅取景通过视觉验收，不代表后六幕完成或全片授权发布；第 4–9 幕后续新制作的动作均需单独核验与人工验收。
- **便携 GIF 与线上发布边界**：[github/README.md](github/README.md) 及其 `github/assets/hero-*.gif` 仍由 [export.mjs](export.mjs) 按幕截取单帧静图生成，尚未切换为连续动作导出；根目录 `README.md`、`assets/` 与 `main` 分支保持线上原状。

## 阶段报告与归档索引

| 文档 / 目录 | 作用 | 归类 |
| --- | --- | --- |
| [ASSET_MANIFEST.md](ASSET_MANIFEST.md) | 第 1–9 幕运行资产、原始参考原件、SHA256 与验收状态 | 事实来源（素材与验收） |
| [phase3.13/REPORT.md](phase3.13/REPORT.md) | 确立三事实来源、清理过期口径并收口前三幕基线 | 事实来源（阶段报告） |
| [phase3.12/REPORT.md](phase3.12/REPORT.md) | 第三幕纯底部 114 px 完整构图延展与第二幕标题色温对齐（`fbf691b`） | 事实来源（当前采用版本证据） |
| [phase3.11/REPORT.md](phase3.11/REPORT.md) | 九幕纯彩绘满幅取景统一与第二幕高清清晰度诊断（`ec078f8`） | 事实来源（阶段报告） |
| [phase3.10/REPORT.md](phase3.10/REPORT.md) | 恢复第二幕 V3 时序、38 帧查表与 `3.20 / 6.40 s` 切点核验（`ec078f8`） | 事实来源（阶段报告） |
| [scratch/third-act-eye-study/README.md](scratch/third-act-eye-study/README.md) | 第三幕眼部动作独立试段原图与提示词（`4d12226`） | 源素材归档 |
| [scratch/third-act-paw-touch/README.md](scratch/third-act-paw-touch/README.md) | 第三幕前爪轻触独立试段原图与提示词（`4d12226`） | 源素材归档 |
| [NOTES.md](NOTES.md) | 2026-11-01 至 2026-11-03 早期整页与第一、二幕初期探索记录 | 历史归档 |
| [writing-motion/CLEANUP.md](writing-motion/CLEANUP.md) | 第二幕早期书写动作探索与已授权清理清单 | 历史归档 |

## 下一阶段

在 `fbf691b` 与 Phase 3.13 三事实来源基线上，下一阶段进入 **第四幕（`Days 698–3648: Learn together.`，`10.30–14.50 s`，时长 4.2 s）** 的静态底图与角色动作制作。进入第四幕前不再改动已通过视觉验收的第一至三幕画面与切点。
