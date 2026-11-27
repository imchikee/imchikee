# 21 Days 仓鼠动画资产清单

入库日期为 2026-11-23，工作分支为 `work/profile-development`。下表路径相对于 `research/github-profile/drafts/21-days/`。本次原件来自 `hamster-animation-repo-import-20261123.zip`，交接时仅整理路径。原 ZIP 路径和 ChatGPT Library 文件 ID 见 [SOURCE_MANIFEST.json](assets/provenance/SOURCE_MANIFEST.json)。

## 原画与底图

| 仓库路径 | 原始文件名 | SHA256 | 版本与验收 | 来源与派生关系 | HTML/JS 引用 | Profile 正式发布 |
| --- | --- | --- | --- | --- | --- | --- |
| [assets/source/second-act-v3-original-static.png](assets/source/second-act-v3-original-static.png) | `手绘质感的_days_11_21_more_c_hamster_学习桌面.png` | `949e32c854a4c21324d51899f66797b7de9cd0ab3ef5c889d236b6293c40f725` | 2026-11-20 V3 原画，静态版本阶段认可（交接记录） | ChatGPT Library 原画。与后续上传底图分别保留，两者的直接派生关系未确认。 | 无 | 否 |
| [assets/source/second-act-v3-static-base-20261121.png](assets/source/second-act-v3-static-base-20261121.png) | `image(20261121-133256).png` | `909fbda066667677136aea43c037aeb60bad6ce6444f3ac1238efdc9dffb599c` | 2026-11-21 用户上传的独立静态底图，单独验收状态未记载 | 来自 ChatGPT Library。历史 framed 构建和静态画框对齐试验均使用此底图。 | 无 | 否 |

## GIF 预览

| 仓库路径 | 原始文件名 | SHA256 | 版本与验收 | 来源与派生关系 | HTML/JS 引用 | Profile 正式发布 |
| --- | --- | --- | --- | --- | --- | --- |
| [assets/previews/second-act-v3-blink-preview.gif](assets/previews/second-act-v3-blink-preview.gif) | `second-act-v3-blink-preview-candidate-a-534.gif`（Library 文件 `second-act-v3-blink-preview-candidate-a-534(2).gif`） | `b5ab84edb840f5b38b01d049165e76303d6d9ff0ebfecb1a814bffcdb479e323` | 用户已认可。320 × 320，38 帧，3.16 秒。 | ChatGPT Library 的 Candidate A 第二幕 V3 眨眼原件。Phase 3.10 从原件无损解码出运行时帧。Phase 3.11 继续使用原逐帧时长。 | [第二幕 V3 时长读取与高清取样](second-act-v3/prepare.py) | 否 |
| [assets/previews/first-act-plus-second-act-v3-blink-preview.gif](assets/previews/first-act-plus-second-act-v3-blink-preview.gif) | `first-act-plus-second-act-v3-blink-candidate-a-6.4s-preview.gif`（Library 文件 `first-act-plus-second-act-v3-blink-candidate-a-6.4s-preview(2).gif`） | `2150ac2f6f4faf03ee5d07a512b647db530503684c924985c4b7e42bc89a4f89` | 用户已认可。320 × 320，77 帧，6.41 秒。 | ChatGPT Library 的 Candidate A 两幕联播原件，用于 534 px 视觉和幕间衔接对照。 | Phase 3.10 本地验收基准 | 否 |

联播 f000–f038 为第一幕，共 3.25 秒。联播 f039–f076 对应独立第二幕 f000–f037，逐帧时长相同。眨眼关键帧为独立 f016–f018、联播 f055–f057。两份 GIF 分别编码，按实际画面和动作对齐。上述 SHA256 对应原始文件。

## MP4 候选

四份 MP4 的验收各自独立。Phase 3.11 已确认用 Candidate A 的 1254 px 母版派生本地运行帧。交接包另存单幕预览和联播文件，具体转码与拼接输入尚未确认。

| 仓库路径 | 原始文件名 | SHA256 | 版本与验收 | 来源与派生关系 | HTML/JS 引用 | Profile 正式发布 |
| --- | --- | --- | --- | --- | --- | --- |
| [assets/candidates/second-act-v3-blink-master-1254.mp4](assets/candidates/second-act-v3-blink-master-1254.mp4) | `second-act-v3-blink-master-1254.mp4` | `a6b65f74581523cd25d7df74c421c1b78ee1f78ccb0aafba6b4c476c675512ed` | 较早的 1254 px 眨眼动作源，验收未知 | 来自 ChatGPT Library，历史 framed 试验的动作输入。 | 无 | 否 |
| [assets/candidates/second-act-v3-blink-master-candidate-a-1254.mp4](assets/candidates/second-act-v3-blink-master-candidate-a-1254.mp4) | `second-act-v3-blink-master-candidate-a-1254.mp4` | `65dc4884dab3554dfe7b09f840b51a1553508a93f9d392f91e996fc316d8c429` | Candidate A 第二幕 1254 px 母版，Phase 3.11 批准使用 38 个对齐画面 | 来自 ChatGPT Library，与 534 px MP4 同属 Candidate A。帧映射为独立 GIF 索引 × 5 + 2。 | [无损高清运行图集](second-act-v3/frames-hd.webp) | 否 |
| [assets/candidates/second-act-v3-blink-preview-candidate-a-534.mp4](assets/candidates/second-act-v3-blink-preview-candidate-a-534.mp4) | `second-act-v3-blink-preview-candidate-a-534.mp4` | `7cebc3730bcab58cc565f2c512c0b7b28e8edba3a84fe4c70e7c57bf18f0ab89` | Candidate A 第二幕 534 px 候选预览，独立验收未确认 | 来自 ChatGPT Library，与独立 GIF 同属 Candidate A 预览。 | 无 | 否 |
| [assets/candidates/first-act-plus-second-act-v3-blink-candidate-a-6.4s.mp4](assets/candidates/first-act-plus-second-act-v3-blink-candidate-a-6.4s.mp4) | `first-act-plus-second-act-v3-blink-candidate-a-6.4s.mp4` | `d3b8f1af13cc7b840b76284ab8b17801e21804bf9f990903a7dfa5321d97b5ab` | Candidate A 两幕 6.4 秒联播候选，独立验收未确认 | 来自 ChatGPT Library，包含第一幕阅读和第二幕 V3 眨眼，与联播 GIF 同属 Candidate A。 | 无 | 否 |

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
| [reading-motion/motion.gif](reading-motion/motion.gif) | `motion.gif` | `25d07d9f495342f08c863c0b1e60cb012fc99c8335b7cac54042cd0ec0d95918` | 第一幕阅读，2026-11-03 阶段验收 | 既有阅读试段，导出入口为 `reading-motion/render.mjs`。本地摘要与交接记录一致。 | `reading-motion/index.html`、`alignment-before.html` 和 `before-lighting.html` 链接此 GIF | 否 |
| [github/assets/hero-light.gif](github/assets/hero-light.gif) | `hero-light.gif` | `c99a130e49f42234b5e525039356c2c40b0c53ac999cbf038fd2216c64688ff1` | 既有九格发布稿，桌面浅色 | 由 `export.mjs` 按幕截图导出 | `github/index.html` 和深浅预览页 | `github/README.md` 发布稿使用，根目录 Profile README 未使用 |
| [github/assets/hero-dark.gif](github/assets/hero-dark.gif) | `hero-dark.gif` | `4557b4d6aad57441e1ce3b716eb2c0680b7134971ee385411c5814c0ac8baea0` | 既有九格发布稿，桌面深色 | 由 `export.mjs` 按幕截图导出 | `github/index.html` 和深浅预览页 | `github/README.md` 发布稿使用，根目录 Profile README 未使用 |
| [github/assets/hero-mobile-light.gif](github/assets/hero-mobile-light.gif) | `hero-mobile-light.gif` | `b861d58027117a3502581daeb2fec04d81753999f1a4e3ff36a7e206c1765139` | 既有九格发布稿，移动端浅色 | 由 `export.mjs` 按幕截图导出 | `github/index.html` 和深浅预览页 | `github/README.md` 发布稿使用，根目录 Profile README 未使用 |
| [github/assets/hero-mobile-dark.gif](github/assets/hero-mobile-dark.gif) | `hero-mobile-dark.gif` | `7405c2c761333d297593f638ae08a72f304761f9249ddc647b538164a6766629` | 既有九格发布稿，移动端深色 | 由 `export.mjs` 按幕截图导出 | `github/index.html` 和深浅预览页 | `github/README.md` 发布稿使用，根目录 Profile README 未使用 |

整页和深浅主题本地预览通过 `second-act-v3/shot.js` 读取 Candidate A 派生的无损高清帧及独立 GIF 时长表。第二幕从全局 3.20 秒开始，f037 保持至 6.40 秒切入第三幕。v49/v51 留作历史实验。[整页预览](index.html) · [既有发布稿](github/README.md)

## 导出限制

现有 `export.mjs` 在每一幕起点后 0.1 秒取一张静帧，以整幕时长显示，生成九格轮播。Phase 3.10 的三幕连续视频见本地验收报告。[导出循环](export.mjs#L100-L111) · [Phase 3.10 验收报告](phase3.10/REPORT.md)
