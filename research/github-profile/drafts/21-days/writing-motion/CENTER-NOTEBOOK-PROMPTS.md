# 中央笔记本姿势修正 · 2026-11-03

用户指出此前仓鼠写在另一本文字方向倾斜的前景书上。助手确认不是设计本意，应写正中间、由右侧爪子压住的主笔记本，用户授权继续。使用内置 imagegen，共两次编辑；没有使用 CLI/API。两张输出均为1316×1195。

第一张：以 `clean-hand-v1.png` 为编辑目标，输出 `scene-v3-center.png`。生成器把笔尖放在约(600,862)，靠中央笔记本左边；动画基于该新姿势将落点向页内收至(624,857)，不是平移旧的外伸手臂。生成器也重绘了部分毛发、书页等，不声称整图像素保持原样。

第二张：以新姿势原画为编辑目标，输出 `clean-hand-v2-center.png`。作为动画固定底图，新原画中的前臂、手笔分层覆盖其上，根部固定、腕端跟随。历史图和源码均保留。

## 新姿势完整提示词

Use case: precise-object-edit.
Input image: EDIT TARGET, a clean animation plate with the viewer-left writing paw and pencil removed.
Primary request: Restore ONE naturally connected writing forearm, pink paw and green pencil, but make the hamster write on the CENTRAL notebook immediately in front of its chest, the SAME notebook held open by the resting paw on viewer RIGHT. Do NOT write in the large diagonally placed open book on viewer LEFT.
Pose: the viewer-left orange forearm bends inward across the bottom of its chest; the little pink paw grips a single green pencil around image position (590,780) in the original 1316x1195 coordinate system. Pencil slopes from upper left toward lower right with its graphite tip contacting the central notebook LEFT page around (680,852), clearly inside that page, well to the right of the foreground left book edge and to the left of the central notebook spine. Keep paw fully connected with a compact, natural orange wrist to the body. Keep pencil, paw and forearm clearly readable. No detached hand, no extra paw, no long human arm.
Constraints: ONLY add this new forearm/paw/pencil. Preserve exact framing and all existing geometry, central notebook outline, handwritten lines, foreground books, resting right paw, face, whiskers, fur texture, cap, warm LEFT lamp illumination, mug, wall, plant, and exact title 'DAYS 11 - 21' / 'More C++.' No other design changes, no borders added. One full-frame illustration same aspect ratio. This is a subtle local pose correction for an existing animation.

## 去手笔底图完整提示词

Use case: precise-object-edit. Input image is the EDIT TARGET, an animation frame.
Create a clean background plate. Remove ONLY the single green pencil and the pink writing paw on viewer LEFT (at roughly x480-600,y700-865 in this 1316x1195 image). Keep the orange bent forearm; reconstruct its rounded furry wrist end behind where the pink writing paw was. Reconstruct ivory chest behind the upper pencil and the small patch of CENTRAL notebook left page underneath the pencil tip, matching the existing paper and handwriting. Keep the resting pink paw on viewer RIGHT untouched.
Preserve every other object and geometry: all book outlines, central notebook spine, foreground diagonal left book, face, whiskers, cap, orange forearm itself, mug, lamp, headings, lighting, fur texture and framing. No new limbs, no new pencil, no shifts. Same size/aspect. This image supplies a small locally masked background for a moving writing paw.

