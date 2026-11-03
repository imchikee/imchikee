# 一条错误的动画素材与生成记录

日期：2026-10-30。三张 PNG 均用内置 imagegen 生成；没有调用 CLI 或自写 API。原文件复制到本目录，没有改绘、缩放或覆盖原始生成文件。动画通过 SVG 组合原图，读取 alpha 边界只用于摆放。

- [自信表情](hamster-ready.png)：参考此前的三格分镜角色与画风。
- [无语表情](hamster-tired.png)：基于自信表情做局部表情修改，保留身体、手指和画幅，以便对齐。
- [纸堆](paper-pile.png)：参考三格分镜中的诊断纸带，生成独立透明素材。
- 参考分镜：[one-error.png](../../../../cpp-humor/storyboards/one-error.png)。

显示器、错误计数、气泡、入门书小道具、连续纸带路径和遮罩为本地编写的 SVG 图形；没有把生成图片冒充代码编辑器真实输出。

完整提示词如下。

## hamster-ready

```text
Use case: illustration-story. Production cutout asset for animating the attached original C++ hamster comic. The attached comic is the visual reference, not an image to reproduce wholesale. Match its tactile gouache and colored-pencil texture, warm dark-brown organic contours, cream-white and warm brown palette, muted teal/coral accents, and charming expressive character design. Clean transparent background with actual alpha, no panels, captions, surrounding room, broad glow, watermark or unrelated objects. Preserve complete silhouettes with generous transparent margins.
Draw ONLY the hamster from the TOP RIGHT panel as a complete standalone character. It faces the viewer in the same slight three-quarter pose. Keep the very plump cream cheeks, brown forehead patch, round brown ears with pink centers, little pink nose, tiny incisors, warm dark oval eyes and three short whiskers on each cheek. Its expression is confidently pleased, an open friendly grin, eyebrows relaxed, NOT already exhausted. Its left paw, on the viewer's right, is raised with ONE index finger pointing up, with a clearly readable tiny finger, like confidently saying 'just one'. The other paw rests naturally low in front of its belly. Tiny feet and a rounded cream/brown torso complete the silhouette; do not add a chair, mouse, keyboard, desk, book, screen or papers. Use roughly square framing. This will become the before-pose of one consistent character, so keep a stable upright stance and clear head/body connection. No readable text.
```

## paper-pile

```text
Use case: illustration-story. Production cutout asset for animating the attached original C++ hamster comic. The attached comic is the visual reference, not an image to reproduce wholesale. Match its tactile gouache and colored-pencil texture, warm dark-brown organic contours, cream-white and warm brown palette, muted teal/coral accents, and charming expressive character design. Clean transparent background with actual alpha, no panels, captions, surrounding room, broad glow, watermark or unrelated objects. Preserve complete silhouettes with generous transparent margins.
Draw ONLY one absurdly large, wide mound of continuous folded diagnostic paper, based on the BOTTOM comic panel. A long connected cream-white strip has repeatedly looped and accordion-folded onto itself into a voluminous heap, rather than separate loose sheets. Fine coral-red horizontal dashes suggest compiler diagnostic notes without readable words. Warm brown hand-drawn paper edges, subtle grey-lavender shading between folds, painterly paper texture. Silhouette approximately 2.2:1 landscape: low at both ends, tallest a little left of center, sloping down at the far right, with the lower edge roughly horizontal. A narrow connected ribbon tail extends a little from the upper left as an entry point. No hamster, body parts, face, character, book, furniture, screen or background. No text, logos or border. Keep this a single mound on transparent alpha, suitable for progressively revealing upwards in an animation.
```

## hamster-tired

```text
Use case: precise-object-edit.
Edit target: the attached transparent full-body hamster cutout. This is the after-expression for an animated comic, and it must register with the before-image.
Change ONLY the FACE and a few tiny hair tufts at the top of the head. Keep the exact canvas dimensions, transparent margins, body silhouette, camera angle, head position, ears, cheeks, limbs, feet, raised index finger, other paw and every pixel position of the body as close to the reference as possible. Preserve all real transparent alpha, gouache texture and brown/cream colors.
Facial acting: replace the delighted open smile and wide bright eyes with a wonderfully DRY, EXHAUSTED, BETRAYED SIDEWAYS STARE aimed toward the viewer. Eyelids heavy and uneven, one eyebrow slightly raised, the other sloped; a small flattened downward mouth with tiny incisors, cheeks still plump. The look says 'I was told there was only one error.' This should read as deadpan comic disbelief, not sadness, panic or a cute wink. Keep eyes large enough to read when reduced. The index finger stays raised, which is part of the absurdity.
Add at most three very small ruffled tufts near the forehead, no other decoration. No tears, sweat symbols, speech bubbles, props, text, background, paper, clothing or new objects. Do not redraw or reposition the torso. Output a genuine transparent-background PNG.
```
