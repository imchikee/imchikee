# 第二幕圆豆眼上眼睑修正

基于 `c8b69f4` 的[圆豆眼候选](../desk-composition-painted-round-eyes-review/candidate.png)。左眼上缘的深褐线稍淡，尖角处用短毛过渡。右眼上缘外侧的斜收尾用同方向短毛软化。534px 下变化细微，原像素放大更容易检视。候选待人工验收。

[静态候选](candidate.png) · [534px 前后对照](review-534.png) · [第一幕 3.179s 并排](review-cut-534.png) · [双眼原像素 2×](review-eyes-2x.png)

逐像素对比 1316 × 1195 的 RGB，共 1,693 个变化像素。画面左眼上缘 868 个，范围 x=468–524、y=574–612。画面右眼上缘 825 个，范围 x=613–675、y=616–655。两段上眼缘之外的 RGB 一致，两处高光区域一致，按 R≤110 检查的深色眼口逐像素一致。

旧眨眼遮罩覆盖本轮改动中的 1,472 个像素，旧睁眼裁图在本轮改动中的 1,692 个像素上与新候选不同。旧脚本会将该裁图贴回睁眼帧，直接沿用会覆盖这次修订。闭眼素材和遮罩的动态兼容性留待接入前复验。

<details>
<summary>局部重绘提示词</summary>

Edit image 1 in place, an exactly 2:1 landscape crop. Image 2 is a reference only for the smooth, naturally round upper eye edge of this very same storybook hamster. Deliver a single image of the exact crop with unchanged framing and all registration landmarks. Preserve the whole existing eyes: preserve the shape, peak of the upper arc, pupil positions, pupil and iris colors, highlight size and position, and the lower lids. Edit only the narrow hair-to-eye transitions at the upper two eyelids. At the screen-left eye, soften the thick dark brown brownish eyeliner-looking band on the upper perimeter and soften its small triangular peak, replacing any excess dark contour outside the round glossy eyeball with a few fine short warm golden hairs. At the screen-right eye, round off the tapered diagonal upper outer corner (the corner toward screen-right) so the eye meets the fur in a continuous convex arc with no stretched tip. Naturally varied, hair-fine soft contact edge between warm fur and glossy unbroken rich dark eye, with no halo, no crease, no ridge, no pencil stroke, no eyebrow and no eyelash. Very subtle edit only at the upper edges. Keep both eyes wide, plump, curious and innocent, with the existing size, centers, offset and asymmetric perspective. Do not lower the lids or fill in any part of the eyeball. Keep nose, mouth, whiskers and all surrounding face texture identical. Retain the directional fur texture, color and illumination of image 1. No other changes, no text.

</details>
