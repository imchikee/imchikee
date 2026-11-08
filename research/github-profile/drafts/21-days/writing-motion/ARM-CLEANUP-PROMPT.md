# 第二幕 · 清除旧前臂底影

2026-11-03，用户追问“你检查手的位置了吗”，助手复查确认手腕下方残留去手底图中的旧橙色前臂，又叠加了移动前臂，造成手掌贴在前臂上侧的效果。用户授权“那你继续修吧”。

使用内置 imagegen 一次编辑，以 `scene-v3-center.png` 为编辑目标，生成 `clean-arm-v1.png`，去掉整条写字前臂、握笔手掌和铅笔。没有使用 CLI/API。原画、旧底图和 `before-arm-cleanup.js` 均保留。

动画底图从 `scene-v3-center.png` 开始，仅在原肢体周围以羽化区域补入新底图；因此生成器在其他区域的重绘不接入动画，补底区域本身有生成差异。前臂层包含完整下缘，固定根部，腕端跟随；手笔仍使用原画刚性层。中央笔记本落点和动作节奏保持。

原尺寸手部截图：`hand-start.png`、`hand-lift.png`、`hand-writing.png`、`hand-finish.png`。已实际查看，原先手腕下方突出的旧前臂残段已消除；这些截图不是用户审美认可。导出脚本 `render.mjs` 同时输出这些特写，便于复现。

## 完整提示词

Use case: precise-object-edit.
Input image: EDIT TARGET, current full-frame hamster writing illustration.
Create an animation clean plate by removing the ENTIRE viewer-LEFT writing limb: ALL of the bent orange forearm projecting across the lower left chest (roughly x315-500,y730-840), the pink gripping paw (x480-570,y765-850), and the complete green pencil (x480-605,y700-865).
IMPORTANT: No rounded orange wrist stump, no orange sausage-shaped arm left resting on the book, no remnant paw or pencil. Reconstruct the natural continuous orange-to-ivory chest/body surface behind the entire missing bent forearm, and reconstruct the small paper areas behind its lower silhouette. The body should simply end against the books with NO second limb projecting forward on viewer left. Keep the pink resting paw on viewer RIGHT fully intact.
Preserve the original central notebook shape, left diagonal book, all handwritten lines outside the removed limb, exact face, whiskers, cap, fur style, left lamp, warm lighting, mug, background, title 'DAYS 11 - 21' / 'More C++.', framing and image size. No redesign. This clean plate is used through a local mask; the original complete forearm and paw will be animated on top.

