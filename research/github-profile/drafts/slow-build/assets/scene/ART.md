# 编译等待动画图层与提示词

内置 imagegen。角色、配色与构图参考[四季组合分镜](../../../../cpp-humor/storyboards/slow-build-seasons.png)。只补两张透明动画图集；原图保持不变，由SVG引用各格，不在Python中改绘或抠图。背景、窗口、进度条与动画控制使用已有代码流程。

两张图集均为1254×1254 RGBA，已原样复制入本目录：[角色图集](hamster-poses.png)、[椰树图集](palm-parts.png)。原始生成结果分别为exec-8e5b5d79-7d3f-44a7-a212-a3f94487e47e.png和exec-d23e4601-ce4b-4cf3-bc64-22abf972502b.png，位于本次会话的Codex generated_images目录；后续重建只需要仓库内副本。

后续视觉修订补充了一张[手绘家具图层](ART-room-v2.md)，替代初版的扁平家具。两张角色/椰树图集未改绘；窗外、屏幕和季节继续使用同一时间轴。

## hamster-poses.png

2×2依次：坐等、冷饮乘凉、喝椰汁、围巾/毯子/热饮。

```text
Create ONE animation character sprite atlas, square, 2x2 equal cells, on genuine transparent alpha. Reference is character/style only. Preserve the four hamsters' identity, proportions, green cap, enormous cream cheeks, brown fur, pink ears/nose, incisors, expressive brows and textured colored-pencil/gouache medium.
Extract/reconstruct ONLY the full hamster in each state, with its held drink and clothing. No chairs, trees, pots, desks, computers, window, lamp, background, floor or shadows.
TOP LEFT: seated upright patiently waiting, paws together, green cap, feet down, attentive eyes open.
TOP RIGHT: reclined plump hamster, feet lifted forward/right, sunglasses perched on green cap, pleased closed-eye smile, holding a cold citrus drink in a glass.
BOTTOM LEFT: same reclined body and feet placement, same cap/sunglasses, sipping through a straw from a green opened coconut.
BOTTOM RIGHT: same relaxed body placement and scale, same cap, warm red scarf and checked lap blanket, holding a white paw-print mug. No steam; added in animation.
All four are complete isolated cutouts, equal scale, centered within their own quadrant, with clear 12% transparent padding from EVERY cell edge. Align lower body baselines consistently. Do not let objects cross cells. No grid lines, labels, text, checkerboard pattern, duplicate characters or other objects. This is one sprite atlas for a layered animation.
```

## palm-parts.png

2×2依次：树干、叶冠、椰子、完整花盆。树干、叶冠、果实分阶段生长，花盆保持固定大小。

```text
Create ONE palm-tree animation parts sprite atlas, square, 2x2 equal cells, genuine transparent alpha. Use the reference's textured pencil/gouache drawing, warm brown outlines, green palm fronds and striped pot. Each cell contains exactly ONE independent complete animation component with generous transparent padding.
TOP LEFT: the mature palm's curved, tapered brown woody TRUNK ONLY, with its characteristic rings. No roots, pot, fronds or fruit. Complete visible upper tip and flat lower end, gently leaning right.
TOP RIGHT: the palm's entire arching green LEAF CANOPY ONLY, fronds radiating from one clear central crown. No trunk, fruit, pot or background.
BOTTOM LEFT: a hanging cluster of THREE green coconuts with short connected stems only. No leaves or trunk.
BOTTOM RIGHT: intact blue-and-cream striped flowerpot with dark soil visible at top, the SAME design as reference. Empty soil, no plant, roots or cracks. Complete pot, no ground shadow.
Keep all parts fully contained in their own cells with 12% transparent margins; no borders, grid, labels, checkerboard or extra objects. One source sprite atlas; parts will be composited and animated separately.
```
