# 实际低头原画的手绘笔触候选

2026-11-03，内置imagegen单次编辑。输入`../reading-motion/redrawn/down-key-soft-v1.png`，输出`down-painted-v1.png`。只作为独立候选；没有覆盖原图或主页。

`down-study.js`从现有`reading-shot.js`复制，仅替换低头姿态原图加载路径。保留现有完整轮廓补片、前景恢复及动作合成。`down-motion.html`提供同步播放、暂停、拖动与重播，默认停在1.1秒，正面/中间姿态未改。过渡融合方法未调整，不能宣称解决残影。

实际生成图中卷曲密纹改为较宽顺向笔触，清晰度未靠模糊降低；笔触仍偏密，是否更贴合环境尚待动作比较。生成图有非目标区域的轻微重绘变化，独立动画保留原固定前景及批准的轮廓补片，但不能宣称所有非目标像素不变。

## 完整提示词

Edit this actual downward-reading keyframe, keep the complete scene and exact pose/composition. Aim: repaint the hamster's head in the SAME handmade picture-book painting language as the blue book, wooden desk and room, with a CLEAR visible material change, not sharpening or blur. Keep eye/nose/mouth positions, expression, cheeks volume, whiskers, cap, ears, paws, book edges and all text exactly. Only repaint the interior orange forehead, ivory cheeks and pink inner ears. Replace the dense uniform curly engraved hair filaments with visibly laid, moderately broad, elongated gouache-and-colored-pencil brush passages following cheek volume. These are connected flowing curved strokes with uneven pigment coverage, roughly 12-30 source pixels wide, gently overlapping, NOT tiny dabs, tiles, scales, polygons, scratches or a noise filter. Ivory cheeks retain a few distinct light ochre/peach brush passages and open ivory areas, so the paint reads clearly rather than smudged airbrush. Orange forehead likewise uses a few directional apricot/ochre brush passages, not dense white hatch marks. Inner ears have restrained rose/peach painted passages. Keep transitions organic, soft but legible, preserving cute plush roundness without photoreal 3D fluffy rendering. Preserve crisp facial ink details and existing warm palette/light direction. Do not change the silhouette, shorten long tufts in this edit, move features, add objects, repaint background, increase saturation or globally sharpen. No blur. No flat vector cartoon. No dense individual hairs. Return the single full scene with original text unchanged: DAYS 1 - 10; The basics.; C++.
