# 光影协调候选 · 2026-11-03

## v2：提亮左侧暖色反光、协调右侧受光

用户评价v1“不错，有点感觉”，同时指出左侧可能偏棕灰，并要求核对光源关系。确认右上台灯方向大体合理；左侧阴影偏重、帽子/右手/书页受光衔接需协调。用户继续后，以`down-light-v1.png`为输入，用内置imagegen单次微调，保存`down-light-v2.png`与`light-v2.html`（直接对照光影v1/v2，避免再沿用错误的v3标题）。

实际查看：左侧腮帮与耳根阴影暖亮了一些，帽子右侧、右手及右侧书页的暖光更明确；书脊附近也更亮。画面仍是绘本式光照，不能宣称物理严格准确。候选尚待评价，未接动画，也未将v1阶段正反馈扩大成全姿态/完整动画定稿。生成器仍可能轻微重绘其他细节，未宣称像素不变。

### v2完整提示词

Make a restrained LOCAL LIGHTING CORRECTION to this exact warm storybook hamster illustration. Preserve its current pleasing lamp atmosphere. The single desk lamp is at upper RIGHT, its opening faces down-left. Keep exact pose, shapes, facial features, fur detail, all lettering, objects and background painting. Only adjust local lighting as follows: (1) On the LEFT side of the hamster, especially left ear root/temple and left cheek underside, gently lift the overly heavy gray-brown shadow and shift it toward softly illuminated warm ochre/apricot fur. Maintain a visible light/shadow distinction: do NOT make both sides equally bright. The ivory left cheek should be luminous warm ivory with soft peach reflected light from the wooden desk, not dirty gray/brown. (2) Make the existing RIGHT lamp light agree gently across the hamster's right ear and cheek, cap's right-facing surfaces, the small visible RIGHT paw and the right upper edges of open book pages. Use modest pale golden highlights, not white glowing outlines or a new bright stripe. Keep the cap's cast shadow under its brim localized and soft, not a dark band over the entire forehead. Maintain clear warm light direction from upper right and believable room/desk bounce fill from below/left. This is a small correction, not a dramatic relight: leave the existing room, lamp, desk and books' general brightness unchanged; no global orange filter, no deepening shadows, no extra contrast. Absolutely do not repaint fur into coarse strokes, blur it, add noise, redesign hamster, shift pose or replace the background. Return one full image, same aspect ratio and framing. Text remains DAYS 1 - 10 / The basics. / C++.

## v1记录

用户否决低头宽笔触候选，要求提高效率、避免反复。本轮仅用内置imagegen一次编辑实际高清低头原画`../reading-motion/redrawn/down-key-soft-v1.png`，保存`down-light-v1.png`及`light.html`前后对照。

判断：这次保留细软毛纹，右侧暖光、左侧阴影较明显，加强了仓鼠与台灯的空间关系；没有解决原画笔触及动画过渡一致性。尽管提示词要求背景不变，生成图仍改变了背景、桌面和书本明暗，不能只把头部替换回原动画；暂作完整场景光影参考，未应用。此前宽笔触候选不采用，也未修改主页或冻结动作。

## 完整提示词

Polish this illustration as a cohesive warm hand-painted children's storybook scene. The hamster currently reads as separately lit plush fur. Integrate it naturally into the room through LIGHT, COLOR and SOFT SHADOWS, not by adding texture. Keep the exact downward-reading pose, head proportions, cute facial features, green cap, all objects, framing, and all lettering. The desk lamp at upper RIGHT should visibly warm the right ear, right temple and cheek with pale golden reflected light; the LEFT side of the hamster should have a gently cooler muted warm-brown room shadow, not an equally bright orange glow. Introduce a believable soft cap shadow on the forehead, subtle warm blue-book bounce/shadow under the muzzle where the face is close to the book, and gentle ambient occlusion where cheek meets arm. Keep ivory cheeks luminous and cute, never dirty or heavily outlined. Preserve fine soft fur and crisp eyes, nose, smile and whiskers. NO broad stripes across cheeks, NO big brush strokes, NO mosaic color fragments, NO added hatching or noise, NO sharpening, NO blur. The result should still feel like the same painter painted the whole original image, understated and charming, not a dramatic relight or a 3D render. Keep background and book unchanged, avoid global yellow/orange filtering. Make spatially meaningful light changes to the hamster only. Text unchanged DAYS 1 - 10 / The basics. / C++. One full illustration.
