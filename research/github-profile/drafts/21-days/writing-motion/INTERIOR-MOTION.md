# 第二幕：完整页内姿势与连续运动

2026-11-03。用户在多次局部修订和截图纠正后反馈：“还是有问题，你能不能一次干好？”此前将局部功能或单处清理当成足够的视觉检查，导致腕口硬裁、补底色差、腕下浅色楔块、笔杆残影等问题反复出现。不能把前几轮修改记为用户认可。

## 最终实现

- 内置 imagegen 一次以 `clean-paw-v4.png` 为编辑目标重画完整握笔姿势，保存 `scene-v5-interior.png`。实际笔尖约(670,879)，在中央笔记本左页内部，与前景斜书边缘分离；短腕与手掌、身体在同一张原画内连续。生成器也重绘了书页/背景细节，不声称非手部像素保持上一原画不变。
- `shot.js`只使用这一张原画和它的原始像素数据，不加载去手生成底图，不拼接单独手掌或腕片。局部逆向采样让手笔作相同的小幅刚性运动，过渡仅在腕根毛发内平滑回零。三段累计前进6原画像素；段间抬笔与结束抬笔约4像素。动作克制，没有新增头部表演。
- 书页保护区在笔尖右侧及下方归零；前景书边与中央笔记本外缘不参与运动。笔尖周围的少量纸面空白属于局部过渡区，因此不夸大为所有纸面每个像素都不变。
- `build-region.mjs`用ffmpeg从原画导出236×222、起点(500,702)的原始RGBA样本到 `region-data.js`。这是原像素编码，未重绘。供浏览器直接打开本地file页面时读取，避免本地图片canvas的像素读取限制。
- `render.mjs`会先重建像素数据，再导出96帧/3.2秒GIF、四个原尺寸手部特写，并调用 `inspect-frames.mjs`做图像核对、导出12张连续取样帧的 `sequence.png`。入口仍为 `index.html`，完整主页共用同一个动作模块。

## 实际检查

已查看正常尺寸整幅、四个原尺寸手部特写与12格连续帧，检查腕根、手掌下缘、笔杆完整性及笔尖和书页关系。此前浅色楔块、硬裁腕口与笔边残影未在这组输出中重现。

`inspect-frames.mjs`通过：起始手部与新原画对应区域RGB完全一致；左侧纸页、中央文字行、笔尖下方页边这三个选定区域在起笔/抬笔/写字/结束四帧中RGB完全一致。检查不替代审美判断，也不代表整张纸面所有像素完全不变。

`capture.mjs`通过：两幕画面变化、暂停像素、章节切换、播放/重播/拖动、结尾停止、减少动态，以及1440/390深浅布局。第一幕未改。第二幕新姿势仍未获用户确认，未发布。

## 历史保留

- `layered-wrist-rejected/`保存本轮开始前的拆层版源码/GIF/手部截图。
- `source-motion-edge-rejected/`保存基于旧v4原画的连续运动候选。旧落点挨着斜书边缘，整段检查发现书边局部锯齿，未交付为最终版；不要重新启用。
- 全部旧原画、去手底图、用户截图与提示词继续保留。

## 完整生图提示词（内置 imagegen）

Use case: precise-object-edit.
Edit target: hamster scene with viewer-left writing arm already removed. Add a SINGLE anatomically natural compact writing paw with a pencil, in a NEW position further toward the middle of its chest. This is essential: the writing point MUST be DEEP INSIDE the central notebook LEFT PAGE, around (710,845) on the original 1316x1195 canvas, at least 80 pixels to the RIGHT of the diagonal foreground-left book. NOT at the edge near (600,860). The central notebook is the one held by the stationary viewer-RIGHT paw.
Place the small pink gripping paw around (635,785); a very SHORT furry wrist emerges from the lower chest immediately to its left around (565,780), with the elbow hidden inside the body. Let the wrist fur blend naturally between orange and ivory body fur with NO straight cuff seam. No long horizontal sausage arm, no bent human arm, no detached hand, no extra stump. One green pencil slopes down-right from upper end around (585,695), through the paw, to a SINGLE graphite tip around (710,845). Paw should be no larger than the resting right paw. Tip contacts a small blank area BETWEEN handwritten rows well INSIDE the page, no book edge underneath the hand or tip. Leave a clear gap between pencil and foreground left book.
Keep the exact existing hamster face, expression, cap, ears, whiskers, warm light, delicate fur finish, resting right paw, ALL book shapes and page edges, central notebook spine, mug, lamp, room, title 'DAYS 11 - 21' / 'More C++.' and framing. Do not move or enlarge the notebook to accommodate the pose. Same full frame size/aspect. Change only the single added writing limb/pencil and naturally hidden paper under it.

