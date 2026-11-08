# 第二幕：回到原稿，只修改写字局部

**本稿已被用户纠正：** 错把“回到原稿”执行成最早第二幕，重新带回粗硬尖毛和凶眉，丢失第一幕已确认的画风；不作为后续基准。当前见`CHAPTER-TWO-CONSISTENCY.md`。

2026-11-05。用户指出“为什么跟原稿差的越来越远了？”，随后要求“然后呢”。v21被否定，不能继续以它作为设计基准。回到最初的 `scene-v1.png`，保留正面圆脸、原始眼鼻嘴/眉毛、帽子、耳朵、头身比例、整体轮廓和场景构图。第一幕不变。

## 素材与范围

- `scene-v1.png`：未覆盖的原稿，运行时直接作为完整底图。
- `local-paw-edit-v22.png`：内置编辑，仅取写字粉爪、铅笔和很短的毛腕前景；完整生成图保留但不替代原稿。
- `clean-hand-v1.png`：复用已有去手素材，只用于原稿旧手笔轮廓内的补底。
- `local-clean-edit-v22.png`：内置清底结果，只取中央本子页内空白纸面；脸颊边缘、书页外形和其他书本保持原稿。
- `notebook-declaration-v22.svg`：已有 `int i=0;` 与后续逐笔 `++i;` 组成同一行，两个页面的字迹均朝仓鼠。
- v21工作源码、数据、完整原尺寸帧与GIF已保存在 `character-drift-rejected/`；全部历史素材继续保留。

旧手笔清除蒙版和新粉爪前景分离。新原画笔尖(627,859)，起始接触位置(668,859)，8笔 `++i;` 在中央页内向镜头左侧推进34像素，段间抬笔；毛腕根部固定至x440，x510起为刚性手笔。整段3.2秒。

首轮外层内置请求失败：`network error: error sending request`，没有图片；缩短提示词后重试成功。未使用API/CLI。首遍导出曾发现旧笔残影、页内漏字和一条右页笔记覆盖静止爪子；这些试验未作为交付，随后修正蒙版与笔记长度。不能以导出通过代替视觉认可。

## 内置编辑完整提示词

首次请求（失败，无输出）：

Use case: precise-object-edit. Edit target: this original chapter-2 illustration, NOT a redesign. Change ONLY the little writing paw, its short wrist, and pencil in the lower-left-center of the character. The hamster's enormous round frontal cheek pouches, exact face/eyes/mouth/eyebrows, green cap, ears, body outline and position MUST stay unchanged. Preserve the exact bold children's-book brushwork; do not introduce more realistic or softer fur. Curl its existing tiny writing paw slightly inward to viewer-right so the green pencil tip touches well INSIDE the LEFT page of the CENTRAL open notebook behind the large foreground book. Approximate full image coordinates: pink paw centered (565,805), green pencil cap near (505,714), tip near (640,858), full image 1316x1195. The short furry wrist should connect low from the existing forelimb at viewer-left, below the cheek, with its root hidden naturally by the foreground book, no long arm or human shoulder. The foreground book and central notebook remain in the same positions and proportions. Keep the original RESTING pink paw, ALL original face pixels, lamps, books, mug, background, heading, composition and lighting. Do not shrink or turn the hamster, do not raise or widen the body. Everything except that single writing-paw/pencil correction stays as supplied. Same image aspect and full frame.

局部握笔请求（成功）：

Edit this original illustration locally. Keep its exact hamster face, round cheeks, eyes, eyebrows, mouth, cap, ears, silhouette, size, frontal pose, style and entire scene unchanged. Only curl the little writing paw inward, moving it about 90 pixels right, so the pencil tip rests INSIDE the central notebook left page, away from the slanted foreground book. Keep a very short furry wrist hidden behind the foreground book, no human arm or shoulder. Do not change the character, camera, books, resting paw or background. Same full image 1316x1195.

清底请求（成功）：

Make a clean animation plate from this EXACT illustration. Remove only the writing pink paw on viewer-left and the ENTIRE green pencil, restoring the matching orange/ivory fur and paper behind them. Keep the resting right pink paw. Erase only the handwriting on BOTH pages of the central open notebook, leaving blank cream paper; keep all book/page boundaries, folds and shadows exact. The other foreground books keep their writing. Preserve exact face, eyebrows, eyes, nose, mouth, cap, ears, cheek contour, silhouette and scene. No changes to pose, scale, character or rendering style. Full frame 1316x1195. This supplies only tiny masked clean areas, not a replacement illustration.

## 原始输出对应

- `exec-f16f1b73-b9ed-4d4d-a8d3-3e114b4e7409.png` → `local-paw-edit-v22.png`。
- `exec-dfde091f-94c0-4612-9766-87655b4f8623.png` → `local-clean-edit-v22.png`。

两份完整输出来自 `/home/chikee/.codex/generated_images/01a1a0b1-a246-71a1-942c-a64976c7822a/`，工作区已保存，不依赖生成目录。


## 当前导出与检查

`motion-v22.gif`、`finish-v22.png`、`native-finish-v22.png`已保存。实际查看正常尺寸原稿/结果对照、16个原尺寸动作阶段、12张整幅连续帧和作者阅读方向。原稿头部0–639行、鼻嘴、右侧脸颊、前景书、静止右爪与原尺寸结束帧RGB一致；初始粉爪中心与本轮局部原画一致，固定脸颊/页缘在关键帧不动。检查不作为用户审美认可。

实际浏览器预览 `preview-v22.html` 加载、拖到3.1秒和截图查看完成；主页两幕播放/暂停像素、九幕切换、重播、拖动、结尾停止与减少动态检查通过，1440/390深浅布局通过。本机绘制抽样均值4.6ms。`git diff --check`通过，第一幕与线上根目录README/assets无差异，未发布。
