# 第二幕：明显缩小外露后背

2026-11-03，用户对上一版收背结果反馈“没啥变化啊”。v8变化在正常尺寸下不够清楚，不能继续将提示词要求或轻微变化作为满足体形反馈的依据。

使用内置imagegen一次以 `scene-v8-trimmed-back.png` 为编辑目标，生成 `scene-v9-compact-back.png`。此次明确要求大幅减少头部左侧外露后背，移除耳后高鼓包，脸部、帽子、爪子与笔的位置沿用。实际正常尺寸对照显示，左侧后背向内收进，耳后背峰降低，灯与身体之间露出更多背景；不将提示坐标或比例直接当成实测值。生成图其他局部仍有重绘差异。

`shot.js`、原像素数据、导出/检查、独立页和完整主页共用模块均已切到新原画。手笔轨迹和播放控制不另改。GIF已重导出3.2秒96帧，查看正常尺寸画面、连续帧，以及 `back-comparison.png`（左v8，右v9，均534像素宽）。起始特写与原画、三个选定书页区域的像素检查通过。新体形仍未获用户确认，第一幕未改，未发布。

v8原画及提示词完整保留；修改前源码、像素数据、GIF和画面在 `subtle-back-rejected/`。导出脚本会重建前后对照图，独立页也有入口。

## 完整提示词

Use case: precise-object-edit.
EDIT TARGET: supplied hamster scene.
Make a SUBSTANTIAL, immediately visible reduction of the exposed orange REAR BODY on viewer LEFT. The previous modest edit was too subtle. Do NOT make another almost-identical image.

Keep the HEAD, cheeks, face, ears, green cap and BOTH tiny paws at exactly the same size and positions. Keep pencil, notebook and every book fixed. Change the rear body silhouette only:
- Currently the huge exposed back bulges far left around x210-250 over y560-790 on this 1316x1195 canvas.
- The NEW leftmost BODY contour should be around x330-350, about 100-130 pixels farther RIGHT. Remove roughly HALF of the visible orange body mass to the LEFT of the head/cheek.
- Behind the left ear, the back should start LOW around (430,555), slope down to (355,610), curve through (330,705), and tuck into (365,815). Do not retain the tall inflated dome behind the ear.
- Restore a clearly wider area of warm room background between the LEFT lamp and the slimmer back, so the difference is obvious even at thumbnail size.
Keep a healthy compact furry hamster with its short forelegs tucked under its low crouch. No skinny limbs, no human neck/shoulders/chest, no upright human torso. Do not slim or shrink the face to compensate. The face and little writing paw should remain the focus; the body should become a modest low oval BEHIND them, not a giant gas cylinder.

Preserve fine soft orange/cream fur, warm LEFT lighting, exact head expression, pencil tip on central notebook, handwriting, mug, plants, room and exact heading 'DAYS 11 - 21' / 'More C++.' Same full frame and dimensions.

