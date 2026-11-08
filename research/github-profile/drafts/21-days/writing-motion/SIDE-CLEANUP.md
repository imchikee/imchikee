# 第二幕：移除用户圈出的多余侧边毛团

2026-11-03，用户发送红框截图，追问“这是啥？你到底能不能干好？”。圈内是v10被助手当作低位后躯保留的毛团，但视觉上像多余肢体。此前把它作为“坐稳”结构接受是错误判断，本次只清理这个局部。

## 素材与接入

使用内置imagegen一次编辑 `scene-v10-settled.png`，生成 `side-clean-v1.png`。没有使用CLI/API。它提供移除左侧凸起、重建背景和身体/书本边界的局部修复像素；不将生成器在全图其他区域的重绘接入。

`compose-side.mjs`将生成修复以16像素柔边接回原图，输出 `scene-v11-clean-side.png`。修改仅限原坐标x280–439、y710–859，完全位于用户圈出区域内。修复窗口之外直接保留v10原像素。手笔动作采样区x480起，与修复区分离，继续使用原来的v10原始样本和轨迹，不改变脸、爪子位置或动画参数。

`render.mjs`先重建局部合成原画，再沿用动作数据导出GIF/特写；`inspect-frames.mjs`新增全图窗口外RGB一致性检查，并生成 `side-comparison.png`（左旧右新）。独立页/完整主页使用新原画，独立页新增圈出位置局部对照入口。旧坐姿对照继续保留。

## 实际检查与边界

已实际查看局部原尺寸修复、放大前后对照、正常尺寸整幅与连续帧。圈出毛团不再突出，身体轮廓接在书本后方。

检查通过：x280–439/y710–859窗口以外的原画RGB与v10逐像素完全一致；起始手部与原画对应区域相同；三个选定纸页/文字/页边区域四帧之间RGB相同。此项证明修改范围，不代表新图获得用户视觉认可。新结果仍待用户评价，第一幕未改，未发布。

用户截图和修改前源码/像素数据/GIF/体态图/正常画面保存在 `extra-haunch-rejected/`；v10原画与全部旧提示词继续保留。

## 完整提示词

Use case: precise-object-edit.
Edit target is this exact hamster scene.
Remove ONE erroneous orange furry round lump on the LOWER VIEWER-LEFT side, behind/beside the hamster: the small separate haunch/ball at approximately x310-400, y745-835 in this 1316x1195 image. It sits between the main cheek/body and the foreground-left open book, looks like an EXTRA LIMB or fur ball, and must disappear COMPLETELY. Do not reinterpret it as a needed hip or redraw another small lobe there.

After removing it, make the hamster's lower-left body contour one smooth continuous curve descending from the lower cheek around (375,740) toward the body behind the notebook around (420,835). Reconstruct the small patch of warm room background / desk behind the removed bump, and the existing book edge where needed. Keep the legitimate writing forelimb and pink writing paw farther RIGHT around x550-620 fully intact. Keep the resting paw on viewer RIGHT.

Change ONLY this small lower-left lump area. Keep the exact face, head/cap/ears, eye gaze, cheeks, muzzle/whiskers, body pose, TWO paws, green pencil, its tip, all books and handwriting, room objects, LEFT warm light and title unchanged. No new limbs, no new tail, no new body lump, no clothing, no pose redesign, no human torso, no overall re-styling. Same full frame and dimensions.

