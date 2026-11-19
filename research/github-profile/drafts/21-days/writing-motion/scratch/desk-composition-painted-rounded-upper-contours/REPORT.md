# 第二幕圆豆眼上缘重绘

人工验收否定了 [3625fb8 的上眼睑修订](../desk-composition-painted-soft-eyelid-review/REPORT.md)，因为 534px 下几乎不可辨认。本轮在同一母版上重绘两眼上半部形状。左眼把低斜的上弧收成较平衡的圆拱，右眼把偏横的外肩收成更立的卵形。使用内置 imagegen 重画眼缘和短毛，再在局部调整圆拱并合回母版。候选待人工视觉验收。

[完整候选](candidate.png) · [534px 前后对照](review-534.png) · [第一幕 3.179s 并排](review-cut-534.png) · [双眼原像素 2×](review-eyes-2x.png)

逐像素核对后，差异仅在两段上半眼轮廓及紧邻毛发。原高光区域、下半眼球、鼻口和其余画面保持原 RGB。眨眼尚未接入，既有遮罩及闭眼素材待重新验证。

<details>
<summary>局部重绘提示词</summary>

Image 1 is the edit target and the exact output framing, a 2:1 eye-region crop of a storybook hamster looking down. Image 2 is the authoritative model for the anatomy of its naturally round, innocent bean eyes. Make a visible anatomical correction to IMAGE 1, not a subtle fur recolor: redraw the actual silhouettes of the UPPER halves of both eyes and their outer corners. Replace the flattened, diagonally drawn upper arcs and dark elongated edges with a distinct lifted round crown flowing down BOTH shoulders in a continuously smooth curve like the reference. The top half of each eye should look like a small smooth dome with its apex above its own center, not a tilted wedge. The viewer-left eye: re-center its upper arch over the existing lower eye, adding a visibly fuller round dome toward the midpoint and rounding off the small high tip toward viewer-left. Viewer-right eye: give it a visibly taller and rounder upper dome around the central upper arc, and round off the descending viewer-right corner much earlier so it cannot read as a flick or almond. Match the naturally fine, low-contrast contact edge and little overlapping short hairs from the reference; no hood, line, tail, eyebrow, uniform black outline or shiny fur halo. Keep the existing relative eye size and position and their perspective difference, the lower half of each outline, the dark warm chestnut depth and warm high reflections, current pupil centers, current eye direction and current quiet expressive smile. Retain the exact existing nose, fur hue, whiskers, lighting and crop coordinates. Do not make the eyes identical, startled, sleepy, hard flat circles, oversized or forward facing. One edited crop, no writing.

</details>
