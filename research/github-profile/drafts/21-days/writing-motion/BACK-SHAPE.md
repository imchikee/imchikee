# 第二幕：收窄后背与压低背峰

2026-11-03，用户反馈：“这版有点胖的像煤气罐了”。这条反馈指向v7过度膨胀的背部体积，不扩大为否定低头伏案、短前肢、小爪子或重新采用人形躯干。

内置imagegen一次以 `scene-v7-hamster.png` 为编辑目标，保存 `scene-v8-trimmed-back.png`。提示词要求收窄左侧后背并压低耳后的背峰，保留脸、帽子、低头姿势和爪子位置。实际生成结果是较克制的收背，未按提示数字严格作几何变换，因此不将15–20%写成实测变化。其余区域存在生成重绘差异，不声称只改了身体轮廓的像素。

新原画已接入动作、原始像素数据、导出/检查脚本与独立页，完整主页共用动作模块。笔尖锚点和三段写字时序沿用v7。已重新导出96帧/3.2秒GIF，查看正常尺寸画面、体态大图和连续帧；起始特写与新原画一致，三个选定纸页/文字/页边区域四帧之间RGB一致。未重新修改播放控制或第一幕文件，未发布；新轮廓仍未获用户确认。

v7原画继续保留，改动前源码、像素数据、GIF、体态图和正常尺寸图在 `before-back-slimming/`。

## 完整提示词

Use case: precise-object-edit.
Edit ONLY the oversized rear body/back silhouette of this hamster. The user likes neither a human body nor this excessively inflated gas-cylinder shape. Keep the current natural low crouch, downward three-quarter face, big cute cheeks and tiny forepaws. This is a modest silhouette slimming, not a new character or pose.

Reduce the volume of the large orange BACK/HAUNCH on viewer LEFT by about 15-20%. Pull its leftmost outer contour inward about 65-80 original pixels, and lower the high rounded hump behind the left ear about 40-50 pixels, making a smaller, gently sloping back that tapers into the tucked forelimb. Restore the warm room behind the reduced silhouette. Keep a healthy softly rounded compact hamster, not skinny, no straight cylindrical sides, no giant inflated hump. Keep the HEAD and cheeks the same size and in exactly the same position; do not shrink the whole animal or enlarge the head. Preserve tiny pink paws and short hidden forelimbs. NO human shoulders, chest, neck or long arms.

Everything else should stay in exactly the same places: face/eyes/muzzle/whiskers, green cap/ears, writing paw and pencil with its tip on the central notebook, resting paw, all page shapes/handwriting, foreground books, mug, LEFT lamp, wall/plant, framing and exact heading 'DAYS 11 - 21' / 'More C++.' Preserve the fine soft fur and warm painterly finish. Same full frame 1316x1195 aspect. One picture, no comparison panels.

