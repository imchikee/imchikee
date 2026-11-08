# 第二幕 · 收短手腕与取消前臂拉伸

2026-11-03，用户反馈“手臂这里还是不太自然”。复看发现，原画可见前臂偏长，动画以x方向缩放承接手的位置，进一步拉长成横向粗管。去掉重复残影并未解决姿势本身的问题。

使用内置imagegen一次编辑，以 `scene-v3-center.png` 为目标，保存 `scene-v4-compact.png`，露出的橙色手腕更短，肘部收在身体轮廓内。生成器未严格按提示词指定坐标移动手与笔，因此接入时依据实际轮廓和笔尖(600,862)，将落点放到中央笔记本(610,858)附近。新图有生成重绘差异，不声称非手部像素全部保持旧版。

动画不再有单独的前臂缩放/剪切层。短手腕、手掌和笔组成一个刚性层，根部羽化进入固定胸腹区域；三段落笔总向右8原画像素，段间抬笔和结束悬停沿用原节奏。先尝试大区域补底、15像素位移，实际放大发现腕根颜色与裁剪边缘形成贴片，因此改为保留新原画的短臂与胸腹，仅通过手笔轮廓外扩的柔边遮罩，用 `clean-arm-v1.png` 补回手笔下面，位移收至8像素，腕根遮罩也增加柔边。旧源码保留为 `before-compact-wrist.js`。

## 完整提示词

Use case: precise-object-edit.
Input: edit target, hamster illustration.
Fix ONLY the viewer-left writing arm anatomy and pose. The current orange forearm is a long thick horizontal sausage across the lower left chest. REMOVE that long protruding forearm completely. Redraw a compact tucked writing pose: elbow hidden within the hamster's plump body outline, a SHORT tapered orange wrist emerging naturally from lower front chest close to the central notebook, ending in a small pink paw around (590,795) in this 1316x1195 image. Only about 60-85 pixels of wrist should be exposed, with fur overlapping softly into the pink paw, NO long horizontal arm, NO cuff-like seam, NO extra stump or limb. Paw should be comparable in size to the resting right paw. Keep a relaxed natural grip on ONE green pencil with its tip well inside the central notebook LEFT page around (650,850), NOT on the diagonal foreground-left book. Pencil upper end roughly (565,695), barrel stays straight. Make this a short cute hamster limb tucked against its chest, not a human elbow/forearm. Match original fine fur and warm left light.
Keep exact hamster face/expression, cap, ears, whiskers, resting right paw, central notebook and its outline and handwritten rows, all foreground books, mug, lamp, wall and title 'DAYS 11 - 21' / 'More C++.' unchanged. Same framing, one full scene, no extra objects.

