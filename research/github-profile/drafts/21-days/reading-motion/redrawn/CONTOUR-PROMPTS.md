# 轮廓短软毛修订（2026-11-02）

## 局部补片（当前候选）

实际拼回后发现第一张低头补片（`contour-patch-down-v1.png`）改变了耳根位置，出现多余小凸起，已停用。仅以原低头局部为输入再次编辑，保存 `contour-patch-down-v2.png`；当前低头引用v2。正面与中间引用v1。低头版仍有较明显的小尖毛，不能声称三张都已完全收成短软毛。

### 低头耳根修正实际提示词

Use case: precise-object-edit. Edit this exact rectangular crop and return exactly the same crop composition.
STRICTLY LOCK the pink ear fragment and its brown base in the upper-right corner. Do not change any pixels in the uppermost 45-pixel strip of this 270x240 input framing. Do not shift or enlarge that ear or create an additional oval, flap, bump or tuft beneath it. Keep the outer 5-pixel border and whisker fragments at the right unchanged.
Only clean up the diagonal cheek silhouette BELOW that top strip, where the long dark spiky hairs point left into the tan background. Paint out the long needle tufts and restore tan background where they projected. Use a full softly convex cheek arc with just a handful of extremely short faint hairs, not a sawtooth/comb. Keep the underlying arc at the same position and preserve its original contour endpoints. Preserve interior orange/cream fur and warm hand-painted shading. No whole-patch zooming, moving, blurring or restyling. This is a local contour-tip paint correction in a larger illustration, and its exact geometry must still fit the original image.
整张编辑减少长毛仍有限，因此通过原生浏览器视窗截取三个姿态同一矩形 `x=200,y=490,width=270,height=240`，保存 `contour-input-{front,mid,down}.png`。分别用内置imagegen重画该段轮廓，保存 `contour-patch-{front,mid,down}-v1.png`。窄区补片按原位置与原比例显示，边界轻微羽化以接合；原PNG不覆盖，五官未包含在补片区域内。

当前只完成用户明确框出的左侧耳下至腮帮这一段，不能写成全部耳缘、右侧轮廓或毛发已定稿；整张编辑稿 `reading-contour-v1.png` 不作为动画源。

### 原参考局部编辑提示词

Use case: precise-object-edit. This is a CLOSE-UP EDIT TARGET, a rectangular patch from an existing storybook hamster painting, not a complete new illustration. Return this EXACT SAME CROP and framing, with no text or added objects.
The diagonal boundary between the orange hamster fur on the right and tan room background on the left currently has many long dark needle-shaped tufts and a serrated comb edge. REPAINT THAT BOUNDARY into a soft continuous rounded cheek curve. REMOVE the long projecting triangles, especially the rows immediately below the pink ear at the top. Paint the small exposed areas where spikes were removed with the existing tan room background.
There should be only 3 to 5 barely noticeable tiny soft wisps along the entire diagonal curve, not dozens of sharp hairs. No jagged sawtooth, no comb-like parallel dark strokes and no thick drawn contour line. Keep the overall cheek's full convex arc and volume. Keep the inner orange/cream fur, warm painted shading, tiny piece of pink ear at top, visible whisker pieces at right and tiny pencil fragment bottom-left exactly located. Keep the contour's entry/exit positions at the crop borders and outermost 3-pixel border unchanged so this patch can join the original painting.
Make an actual painted contour change, not a blur effect or a contrast adjustment. Match the original warm hand-painted storybook medium. Do not introduce flat vector outlines, glossy plastic or a different room.

### 中间、低头局部编辑（各一次，同一提示词；第二输入为修订后的原参考局部）

Use case: precise-object-edit. Image 1 is the exact rectangular crop to EDIT; image 2 is the refined short-soft-edge reference. Return image 1's same crop, positions and diagonal cheek arc.
Repaint ONLY the narrow border between the orange hamster cheek and the tan room background to match image 2's softer, simpler edge. REMOVE the rows of projecting long dark needle-shaped triangles and the comb-like jagged fringe, especially below the small pink ear fragment. Fill the removed tips with the correct tan background. The underlying cheek curve stays full and rounded; only a few very short faint soft wisps may break it. No thick contour line, no sawtooth, no blur filter.
Keep inner fur color and painted shading, cheek volume, the ear fragment at top, visible whisker pieces at right and pencil fragment bottom-left in the EXACT same locations as image 1. Keep the silhouette entry and exit points at all crop edges and the outermost 3-pixel border unchanged so the crop can be reinserted. Do not move the cheek or ear, change camera, add objects or restyle the painting. Make a real local painted contour cleanup, preserving the original warm storybook illustration.

用户框出原参考图左侧成排尖毛，要求继续。使用内置imagegen，先修原参考图，再在同一方向处理两张动作姿态；版本化保存，原图保留。目标是实际缩短和减少投影尖毛、恢复露出的背景，保留圆腮体积及原表情，而不是模糊或叠加另一层毛纹。

## 原参考轮廓

输入 `../../model/reading-soft-v1.png`，输出 `../../model/reading-contour-v1.png`。

Use case: precise-object-edit.
Edit this exact hamster illustration. Change ONLY the tiny OUTER FUR EDGE around the hamster's cheek pouches and ears. The key problem is the row of long dark sharp spikes pointing left from the left temple immediately below the left ear (the sloping edge between the ear and the widest left cheek).

Actually PAINT OUT those projecting long triangular tufts and their dark comb-like outlines. Restore the small strip of room background exposed by removing the tips. Replace the sawtooth fringe with a rounded continuous underlying cheek contour and only a very few tiny SOFT short wisps, about 2–4 pixels long at this image's resolution, rather than 15–30 pixel dark spikes. Apply the same restrained edge treatment to the other cheek and ear rims, preserving full soft round hamster cheek volume. Do not merely blur the spikes, lower their contrast or repaint the same spiky silhouette. The smoother contour must be visibly different in a close-up of the left temple.

Preserve the broad original cheek envelope and every other element: head size/proportions and pose, eager open delighted smile, eyes and highlights, nose, teeth, whiskers, cap/ears positions, warm orange/cream painted fur inside the silhouette, gentle shading, paws holding the book, C++ book, lettering, entire desk/room, camera and 1316:1195 framing. Keep the fine hand-painted storybook style and original identity; do not change to a flat vector outline, plastic smoothness, cat face or new character. Only the narrow edge band and a few background pixels where removed hair tips used to be are allowed to change. Return the same complete scene.
