# 21 Days 仓鼠动画资产清单

> **事实来源定位（Phase 3.13）**：本文档是全项目的**素材与验收事实来源**，回答**哪些素材正在使用、哪些已经认可**。项目当前进度请看 [PROJECT_STATUS.md](PROJECT_STATUS.md)，各阶段改动与验证请看 `phase*/REPORT.md`（[3.10](phase3.10/REPORT.md) · [3.11](phase3.11/REPORT.md) · [3.12](phase3.12/REPORT.md) · [3.13](phase3.13/REPORT.md)）。

下表路径相对于 `research/github-profile/drafts/21-days/`，工作分支为 `work/profile-development`。根目录 `README.md`、`assets/` 与 `main` 分支均未替换。

## 当前正在使用的运行资产（第 1–9 幕）

下表对应当前整页预览（[index.html](index.html) / [preview-light.html](preview-light.html) / [preview-dark.html](preview-dark.html)）在 `fbf691b` 基线下实际加载的全部九幕素材与运行时模块，包含**文件路径、SHA256、原始尺寸、来源、当前用途、是否实际被运行时引用、验收状态**：

| 幕 | 文件路径 | SHA256 | 原始尺寸 | 来源 | 当前用途 | 运行时引用 | 验收状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | [reading-motion/lighting/front-v1.png](reading-motion/lighting/front-v1.png) | `20a1b6de37a3b34e3be92eee6c41fe207e3d0213710e56fd1e966e93eb3ec9f0` | `1316 × 1195`（PNG/RGB） | 第一幕光影统一绘制（2026-11-03） | 第一幕抬头光影原画 | 是（`config.js`） | 已认可（2026-11-03 阶段确认；Phase 3.11 满幅裁切通过） |
| 1 | [reading-motion/lighting/mid-v1.png](reading-motion/lighting/mid-v1.png) | `496616b3bff462a3bc0eabde92fbae23321d4085c60dd47be7362c438e4ca60f` | `1316 × 1195`（PNG/RGB） | 第一幕光影统一绘制（2026-11-03） | 第一幕中段光影原画 | 是（`config.js`） | 已认可（2026-11-03 阶段确认；Phase 3.11 满幅裁切通过） |
| 1 | [reading-motion/lighting/down-v2.png](reading-motion/lighting/down-v2.png) | `2547d4edb6a4764f2b40fc691d76ba9961defee8493d9d8ab19c88184534e118` | `1316 × 1195`（PNG/RGB） | 第一幕光影统一绘制（与 `style-match/down-light-v2.png` 同字节） | 第一幕低头光影原画 | 是（`config.js`） | 已认可（2026-11-03 阶段确认；Phase 3.11 满幅裁切通过） |
| 1 | [reading-motion/lighting/clean-accents-v1.png](reading-motion/lighting/clean-accents-v1.png) | `f6f5af8cadca4af6f9331c99ba55c2615d880d961e2f8e62352aeadda090f88f` | `1316 × 1195`（PNG/RGB） | 第一幕光影统一绘制（2026-11-03） | 第一幕惊叹线洁净底图 | 是（`config.js`） | 已认可（2026-11-03 阶段确认；Phase 3.11 满幅裁切通过） |
| 1 | [reading-motion/redrawn/contour-data.js](reading-motion/redrawn/contour-data.js) | `b60c6970a0e17a4b928b3b9cf75e520c246b998342416b3bad4ecd0bd4cfe803` | JS（4,422 B） | 第一幕轮廓点位提取 | 第一幕网格特征与轮廓坐标 | 是（`index.html`） | 已认可（随第一幕沿用） |
| 1 | [reading-motion/lighting/config.js](reading-motion/lighting/config.js) | `fcbc1001e608ba323eef7219c6f9ea8b5749179b565ff10ccd007578bdef0008` | JS（1,895 B） | 第一幕光影配置 | 绑定打光原画与惊叹线时序 | 是（`index.html`） | 已认可（随第一幕沿用） |
| 1 | [reading-shot.js](reading-shot.js) | `165b7bcfec63f489c5936da259e25a20fc87e47f99297b1d391fdbb8179b0d29` | JS（8,943 B） | 由 [build.py](build.py) 从 `reading-motion/motion.js` 生成 | 第一幕原生缓冲合成与满幅裁切输出 | 是（`index.html`） | 已认可（Phase 3.11 满幅输出通过） |
| 2 | [second-act-v3/frames-hd.webp](second-act-v3/frames-hd.webp) | `eb63ca9e948530a489e1e9c1a0652f13c6df2ecd95eb463870ef1af2e581e873` | `4272 × 2425` 图集（8×5 槽，单槽 `534 × 485`，无损 WebP） | [prepare.py](second-act-v3/prepare.py) 从 Candidate A 1254 px MP4 提取并经 Phase 3.12 静态标题校白 | 当前整页第二幕高清运行图集 | 是（`second-act-v3/shot.js`） | 已认可（Phase 3.12 视觉验收通过；不扩大至 Candidate A MP4 独立验收） |
| 2 | [second-act-v3/frame-table.js](second-act-v3/frame-table.js) | `dd2d1f7d95b78d066b289441658b19b32cee59c2449749d20f1ead9d408ce299` | JS（393 B） | [prepare.py](second-act-v3/prepare.py) 读取独立 V3 GIF 逐帧时长生成 | 38 帧时间索引，保留原 GIF 80/90 ms 时序（3160 ms + 末帧 40 ms 保持） | 是（`index.html`） | 已认可（Phase 3.10–3.12 沿用并通过） |
| 2 | [second-act-v3/shot.js](second-act-v3/shot.js) | `73d239411fa40244ec024fde428212074fdb51b0d8f80e5c3ed1099f526e7dfa` | JS（1,146 B） | Phase 3.10–3.11 编写 | 第二幕查表与 Canvas 绘制模块 | 是（`index.html`） | 已认可（Phase 3.10–3.12 验证通过） |
| 3 | [building-motion/p0.png](building-motion/p0.png) | `30c99af1ee1aeacf8029477745bd8496b146a43085444d0e800dfb541c3c914f` | `1380 × 1140`（PNG/RGB） | 与 [scratch/third-act-eye-study/p0.png](scratch/third-act-eye-study/p0.png) 同字节副本 | 第三幕原始 P0 母版（117 帧顶部零差分锁定） | 是（`building-motion/shot.js`） | 已认可（保持不变，Phase 3.9–3.12 基准） |
| 3 | [building-motion/p0-extended.png](building-motion/p0-extended.png) | `2ce5b94891c792314b3adde0bc3a9133490b08452c97328138b72b70ccbbab39` | `1380 × 1254`（PNG/RGB） | [phase3.12/compose_extension.py](phase3.12/compose_extension.py) 合成（顶 `1380×1140` 与 `p0.png` 差分 0 + 底 114 px 纯桌面延展） | 当前运行时第三幕底部延展满幅底图 | 是（`building-motion/shot.js`） | 已认可（Phase 3.12 完整构图延展通过视觉验收） |
| 3 | [building-motion/patches.png](building-motion/patches.png) | `77dacd8f9ae24b1c07aa11e6a19d9beea150f9ddc002839d6f7feef5a415df72` | `1470 × 327`（PNG/RGB） | [building-motion/prepare.py](building-motion/prepare.py) 从两份源 APNG 无损去重提取 | 第三幕前爪（5 组 `204×159`）与眼部（12 组 `245×84`）局部动作图集 | 是（`building-motion/shot.js`） | 已认可（Phase 3.9–3.12 视觉验收通过） |
| 3 | [building-motion/atlas.js](building-motion/atlas.js) | `6b3dbb420df34a9554bf841f95b734a692d0029148a64fc6c779c5c270ced848` | JS（1,089 B） | [building-motion/prepare.py](building-motion/prepare.py) 生成 | 第三幕 117 帧 @ 30 fps 局部图块索引 | 是（`index.html`） | 已认可（Phase 3.9–3.12 视觉验收通过） |
| 3 | [building-motion/shot.js](building-motion/shot.js) | `bfe8ff4f6c5098b93bef321b20b199bd25c670f69309571c547c6bbbcc56e015` | JS（3,331 B） | Phase 3.9 编写、Phase 3.12 接入延展底图 | 第三幕原生合成与满幅裁切输出模块 | 是（`index.html`） | 已认可（Phase 3.9–3.12 视觉验收通过） |
| 3（源） | [building-motion/source/forepaw.apng](building-motion/source/forepaw.apng) | `641a53c5d18ea79a3747ca58e943b06279dd1bd829cb16c851c77d6b8baa9213` | `1380 × 1140`（APNG/RGB，117 帧） | Phase 3.8 第三幕前爪轻触无损导出（详见 [third-act-paw-touch](scratch/third-act-paw-touch/README.md)） | 第三幕前爪动作原始无损来源 | 否（`building-motion/prepare.py` 构建输入） | 已认可的原始动作来源（经 117/117 逐帧零差分校验） |
| 3（源） | [building-motion/source/eyes.apng](building-motion/source/eyes.apng) | `d4817af9aa7f8f71e0119dc8ce9d0104c8a916164c7461bec53c33e673940279` | `1380 × 1140`（APNG/RGB，117 帧） | 与 [scratch/third-act-eye-study/preview.png](scratch/third-act-eye-study/preview.png) 同字节副本 | 第三幕眼部动作原始无损来源 | 否（`building-motion/prepare.py` 构建输入） | 已认可的原始动作来源（经 117/117 逐帧零差分校验） |
| 4、7–9 | [../../cpp-humor/storyboards/21-days/hamster-storyboard-v1.png](../../cpp-humor/storyboards/21-days/hamster-storyboard-v1.png) | `7a3e5dc5e3494fc4103677b8d6848b56007d5d6a332da9f22b81f6b665dca980` | `1254 × 1254`（PNG/RGB） | 2026-11-01 九格插画原图 | 第 4、7–9 幕静态分镜 SVG 图层 | 是（`index.html` SVG） | 满幅取景已核验；**连续动作未制作** |
| 5–6 | [../../cpp-humor/storyboards/21-days/hamster-aged-panels-v2.png](../../cpp-humor/storyboards/21-days/hamster-aged-panels-v2.png) | `8b3cd3c57a388a6b3016ed82a7ad3afc66dfc4936b0b8898cddb97b17ca792f3` | `1862 × 845`（PNG/RGB） | 2026-11-01 第 5–6 格修订补图 | 第 5–6 幕静态分镜 SVG 图层 | 是（`index.html` SVG） | 满幅取景已核验；**连续动作未制作** |
| 全剧链接 | [../../cpp-humor/storyboards/21-days/hamster-storyboard-v2.svg](../../cpp-humor/storyboards/21-days/hamster-storyboard-v2.svg) | `ab6b47a41db13e99367ac5ba4722041a55e5dc65cf8be128abdd04c76171d1e1` | SVG（506 B） | 组合 `v1.png` 与 `aged-panels-v2.png` | 页脚 “Read the comic” 漫画全页链接 | 是（`index.html` 页脚链接） | 静态分镜组合原件 |

---

以下登记 2026-11-23 从 `hamster-animation-repo-import-20261123.zip` 入库的第二幕参考原件、MP4 候选与来源审计，以及既有第一幕独立试段与旧九格发布稿。原 ZIP 路径和 ChatGPT Library 文件 ID 见 [SOURCE_MANIFEST.json](assets/provenance/SOURCE_MANIFEST.json)。

## 原画与底图

| 仓库路径 | 原始文件名 | SHA256 | 版本与验收 | 来源与派生关系 | HTML/JS 引用 | Profile 正式发布 |
| --- | --- | --- | --- | --- | --- | --- |
| [assets/source/second-act-v3-original-static.png](assets/source/second-act-v3-original-static.png) | `手绘质感的_days_11_21_more_c_hamster_学习桌面.png` | `949e32c854a4c21324d51899f66797b7de9cd0ab3ef5c889d236b6293c40f725` | `1254 × 1254`（RGB），2026-11-20 V3 原画，静态版本阶段认可（交接记录） | ChatGPT Library 原画。与后续上传底图分别保留，两者的直接派生关系未确认。 | 无（未运行时引用） | 否 |
| [assets/source/second-act-v3-static-base-20261121.png](assets/source/second-act-v3-static-base-20261121.png) | `image(20261121-133256).png` | `909fbda066667677136aea43c037aeb60bad6ce6444f3ac1238efdc9dffb599c` | `1254 × 1254`（RGBA），2026-11-21 用户上传独立静态底图，单独验收未记载 | 来自 ChatGPT Library。历史 framed 构建和静态画框对齐试验均使用此底图。 | 无（未运行时引用） | 否 |

## GIF 预览

| 仓库路径 | 原始文件名 | SHA256 | 版本与验收 | 来源与派生关系 | HTML/JS 引用 | Profile 正式发布 |
| --- | --- | --- | --- | --- | --- | --- |
| [assets/previews/second-act-v3-blink-preview.gif](assets/previews/second-act-v3-blink-preview.gif) | `second-act-v3-blink-preview-candidate-a-534.gif`（Library 文件 `second-act-v3-blink-preview-candidate-a-534(2).gif`） | `b5ab84edb840f5b38b01d049165e76303d6d9ff0ebfecb1a814bffcdb479e323` | 用户已认可参考原件。320 × 320，38 帧，3.16 秒。 | ChatGPT Library 的 Candidate A 第二幕 V3 眨眼原件。Phase 3.10 从原件无损解码出运行时帧。Phase 3.11–3.12 继续使用原逐帧时长。 | [第二幕 V3 时长读取与高清取样](second-act-v3/prepare.py) | 否 |
| [assets/previews/first-act-plus-second-act-v3-blink-preview.gif](assets/previews/first-act-plus-second-act-v3-blink-preview.gif) | `first-act-plus-second-act-v3-blink-candidate-a-6.4s-preview.gif`（Library 文件 `first-act-plus-second-act-v3-blink-candidate-a-6.4s-preview(2).gif`） | `2150ac2f6f4faf03ee5d07a512b647db530503684c924985c4b7e42bc89a4f89` | 用户已认可参考原件。320 × 320，77 帧，6.41 秒。 | ChatGPT Library 的 Candidate A 两幕联播原件，用于 534 px 视觉和幕间衔接对照。 | Phase 3.10 本地验收基准 | 否 |

联播 f000–f038 为第一幕，共 3.25 秒。联播 f039–f076 对应独立第二幕 f000–f037，逐帧时长相同。眨眼关键帧为独立 f016–f018、联播 f055–f057。两份 GIF 分别编码，按实际画面和动作对齐。上述 SHA256 对应原始文件。

## MP4 候选

四份 MP4 的验收各自独立，均**不因派生运行图集验收而扩大为 MP4 独立验收**。本地预览使用 Candidate A 1254 px MP4 作为高清素材来源，按 `5 × 独立 GIF 帧 + 2` 提取 38 个对齐画面并经 Phase 3.12 静态标题底色校白，生成当前已通过视觉验收的运行图集 `second-act-v3/frames-hd.webp`。交接包另存单幕预览和联播文件，具体转码与拼接输入尚未确认。

| 仓库路径 | 原始文件名 | SHA256 | 版本与验收 | 来源与派生关系 | HTML/JS 引用 | Profile 正式发布 |
| --- | --- | --- | --- | --- | --- | --- |
| [assets/candidates/second-act-v3-blink-master-1254.mp4](assets/candidates/second-act-v3-blink-master-1254.mp4) | `second-act-v3-blink-master-1254.mp4` | `a6b65f74581523cd25d7df74c421c1b78ee1f78ccb0aafba6b4c476c675512ed` | `1254 × 1254`（192 帧 / 3.20 s），较早的眨眼动作源，验收未知（Phase 3.11 已排除） | 来自 ChatGPT Library，历史 framed 试验的动作输入。 | 无 | 否 |
| [assets/candidates/second-act-v3-blink-master-candidate-a-1254.mp4](assets/candidates/second-act-v3-blink-master-candidate-a-1254.mp4) | `second-act-v3-blink-master-candidate-a-1254.mp4` | `65dc4884dab3554dfe7b09f840b51a1553508a93f9d392f91e996fc316d8c429` | `1254 × 1254`（192 帧 / 3.20 s），高清素材来源（不扩大为该 MP4 独立验收）；其派生并经标题校白的运行图集已通过视觉验收 | 来自 ChatGPT Library，与 534 px MP4 同属 Candidate A。帧映射为独立 GIF 索引 × 5 + 2。 | 否（仅作 [prepare.py](second-act-v3/prepare.py) 构建输入） | 否 |
| [assets/candidates/second-act-v3-blink-preview-candidate-a-534.mp4](assets/candidates/second-act-v3-blink-preview-candidate-a-534.mp4) | `second-act-v3-blink-preview-candidate-a-534.mp4` | `7cebc3730bcab58cc565f2c512c0b7b28e8edba3a84fe4c70e7c57bf18f0ab89` | `534 × 534`（192 帧 / 3.20 s），Candidate A 第二幕候选预览，独立验收未确认 | 来自 ChatGPT Library，与独立 GIF 同属 Candidate A 预览。 | 无 | 否 |
| [assets/candidates/first-act-plus-second-act-v3-blink-candidate-a-6.4s.mp4](assets/candidates/first-act-plus-second-act-v3-blink-candidate-a-6.4s.mp4) | `first-act-plus-second-act-v3-blink-candidate-a-6.4s.mp4` | `d3b8f1af13cc7b840b76284ab8b17801e21804bf9f990903a7dfa5321d97b5ab` | `534 × 534`（384 帧 / 6.40 s），Candidate A 两幕联播候选，独立验收未确认 | 来自 ChatGPT Library，包含第一幕阅读和第二幕 V3 眨眼，与联播 GIF 同属 Candidate A。 | 无 | 否 |

## 来源与审计原件

`delivery-audit.json` 和 `build_framed_blink.py` 的证据范围是历史 framed 候选。该审计里的联播 GIF 为 492,592 字节（SHA256 `c577a9fe15c4f2a3cbdbc6705409fa9d1ad992fb71f4e6bb7118005962158ded`），本表登记的用户认可 GIF 为 307,604 字节。当前两份 GIF 的构建证据尚未确认。[历史 framed 审计](assets/provenance/delivery-audit.json)

| 仓库路径 | 原始文件名 | SHA256 | 版本与验收 | 来源与派生关系 | HTML/JS 引用 | Profile 正式发布 |
| --- | --- | --- | --- | --- | --- | --- |
| [assets/provenance/delivery-audit.json](assets/provenance/delivery-audit.json) | `delivery-audit.json` | `eda548fa6afdbdf56b299a9408d2f7894993777d42191aaaae8ca25cc5fb2659` | 历史 framed 交付审计，证据归档 | 来自 ChatGPT Library，记录 2026-11-21 底图、早期 1254 px 动作源及 framed 输出的摘要。 | 无 | 否 |
| [assets/provenance/frame-match-candidate-audit.json](assets/provenance/frame-match-candidate-audit.json) | `frame-match-candidate-audit.json` | `524b989f0e286d7d9af1deb08dfc27c1c2a1bb180eb71b59506de3f136ae8208` | 静态画框对齐候选审计，证据归档 | 来自 ChatGPT Library。以第一幕视频首帧为参照，对 2026-11-21 底图做静态几何变换。审计记录 `blink_animation_modified: false`。 | 无 | 否 |
| [assets/provenance/build_framed_blink.py](assets/provenance/build_framed_blink.py) | `build_framed_blink.py` | `628224c1195287d264581758979bffee680ca849a6b98a2c7da3cc614d8b29d4` | 历史 framed 构建脚本，证据归档 | 来自 ChatGPT Library。以 2026-11-21 底图和早期 1254 px 动作源生成 framed 版第二幕母版与预览。 | 无 | 否 |
| [assets/provenance/SOURCE_MANIFEST.json](assets/provenance/SOURCE_MANIFEST.json) | `SOURCE_MANIFEST.json` | `fd073521ba4a6e79dcfa8d4e022129f10e06395e60550882a33a8cc1cb30a5a8` | v1 交接元数据，原件归档 | ZIP 根目录，记录 11 项素材及审计文件的来源、角色、原路径和摘要。 | 无 | 否 |
| [assets/provenance/README-IMPORT.md](assets/provenance/README-IMPORT.md) | `README-IMPORT.md` | `dd7540767523b3eb452e118ddace566f11bf2210bf2d36e3c92dc2c5ecb2d68c` | 打包时的交接说明，原件归档 | ZIP 根目录，记录交接范围、版本状态和当时的导出限制。 | 无 | 否 |
| [assets/provenance/SHA256SUMS.txt](assets/provenance/SHA256SUMS.txt) | `SHA256SUMS.txt` | `2afb1f55d3e086441758dc17f2f02745b73904747afa38829527c310a9e2bc60` | 原包校验清单，原件归档 | ZIP 根目录，使用解压时的路径记录 11 项 SHA256。正式仓库路径的校验值见本索引。 | 无 | 否 |

## 既有第一幕与发布稿

| 仓库路径 | 原始文件名 | SHA256 | 版本与验收 | 来源与派生关系 | HTML/JS 引用 | Profile 正式发布 |
| --- | --- | --- | --- | --- | --- | --- |
| [reading-motion/motion.gif](reading-motion/motion.gif) | `motion.gif` | `25d07d9f495342f08c863c0b1e60cb012fc99c8335b7cac54042cd0ec0d95918` | `534 × 485`（96 帧），第一幕阅读，2026-11-03 阶段验收 | 既有阅读试段，导出入口为 `reading-motion/render.mjs`。本地摘要与交接记录一致。 | `reading-motion/index.html`、`alignment-before.html` 和 `before-lighting.html` 链接此 GIF | 否 |
| [github/assets/hero-light.gif](github/assets/hero-light.gif) | `hero-light.gif` | `c99a130e49f42234b5e525039356c2c40b0c53ac999cbf038fd2216c64688ff1` | `900 × 480`（9 帧），既有九格发布稿，桌面浅色 | 由 `export.mjs` 按幕截图导出 | `github/index.html` 和深浅预览页 | `github/README.md` 发布稿使用，根目录 Profile README 未使用 |
| [github/assets/hero-dark.gif](github/assets/hero-dark.gif) | `hero-dark.gif` | `4557b4d6aad57441e1ce3b716eb2c0680b7134971ee385411c5814c0ac8baea0` | `900 × 480`（9 帧），既有九格发布稿，桌面深色 | 由 `export.mjs` 按幕截图导出 | `github/index.html` 和深浅预览页 | `github/README.md` 发布稿使用，根目录 Profile README 未使用 |
| [github/assets/hero-mobile-light.gif](github/assets/hero-mobile-light.gif) | `hero-mobile-light.gif` | `b861d58027117a3502581daeb2fec04d81753999f1a4e3ff36a7e206c1765139` | `447 × 675`（9 帧），既有九格发布稿，移动端浅色 | 由 `export.mjs` 按幕截图导出 | `github/index.html` 和深浅预览页 | `github/README.md` 发布稿使用，根目录 Profile README 未使用 |
| [github/assets/hero-mobile-dark.gif](github/assets/hero-mobile-dark.gif) | `hero-mobile-dark.gif` | `7405c2c761333d297593f638ae08a72f304761f9249ddc647b538164a6766629` | `447 × 675`（9 帧），既有九格发布稿，移动端深色 | 由 `export.mjs` 按幕截图导出 | `github/index.html` 和深浅预览页 | `github/README.md` 发布稿使用，根目录 Profile README 未使用 |

整页和深浅主题本地预览通过 `second-act-v3/shot.js` 读取经 Phase 3.12 静态标题底色校白并已通过视觉验收的高清运行图集 `second-act-v3/frames-hd.webp` 及独立 GIF 时长表，两份原始 GIF 保留「用户已认可参考原件」状态，Candidate A 1254 px MP4 仅作高清素材来源（不扩大为该 MP4 独立验收）。第二幕从全局 3.20 秒开始，f037 保持至 6.40 秒切入第三幕（`building-motion/shot.js` 经底部 114 px 延展满幅输出，6.40–10.30 秒）。v49/v51 与 `writing-motion/` 留作历史实验。[状态总览](PROJECT_STATUS.md) · [整页预览](index.html) · [既有发布稿](github/README.md)

## 导出限制

现有 `export.mjs` 在每一幕起点后 0.1 秒取一张静帧，以整幕时长显示，生成九格轮播。Phase 3.10–3.13 的阶段报告与验收证据见对应目录。[导出循环](export.mjs#L100-L111) · [Phase 3.10](phase3.10/REPORT.md) · [Phase 3.11](phase3.11/REPORT.md) · [Phase 3.12](phase3.12/REPORT.md) · [Phase 3.13](phase3.13/REPORT.md)
