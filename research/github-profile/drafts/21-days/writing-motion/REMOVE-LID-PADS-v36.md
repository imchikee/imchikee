# 第二幕：去掉眼睛上方的浅色厚眼皮

2026-11-05。用户截图红框指出上眼睑仍明显。实际问题包括眼睛上方浅色、隆起的弧形眼皮，不仅是黑线。先前减轻黑线未去掉整块形体；进一步检查发现合成范围偏低，尤其右眼上方旧浅色眼皮未全部覆盖。因此必须同时修图和扩大覆盖区域，不能仅重试生图。

用户截图保存feedback-v35-eyelid.png。内置编辑目标eyes-detail-v35.png，第一幕参考expression-reference-v26.png，明确把浅色弧形厚眼皮替换成连续的橙色额头毛发，保留细眼缘和短柔眼角。完整原始输出[eye-edit-v36.png](eye-edit-v36.png)，原文件exec-f6a17da7-bd85-4290-b86b-402a3c5c9800.png。

compose-expression.mjs扩大双眼上方合成范围，涵盖完整浅色眼皮，并在裁图边界软过渡，输出[scene-v36-current.png](scene-v36-current.png)。[lid-pad-comparison-v36.png](lid-pad-comparison-v36.png)是最终合成的同尺度对照，左v35、右v36；[eyes-detail-v36.png](eyes-detail-v36.png)是修后放大图。旧图/compose-expression-v35.mjs/shot-v35.js保留。固定入口revision=36，无新编号HTML。未使用API/CLI，未发布，尚未获用户评价。

## 完整提示词

Edit image1. User is pointing specifically to the PALE RAISED ARCHED HOODS ABOVE BOTH EYES, not to the black eye outline. Remove those conspicuous bulging peach/beige crescent-shaped upper eyelid pads ENTIRELY. In the target, there is a large pale rounded lump above each eye which makes it look heavy-lidded and sleepy. Replace each lump with the SAME continuous fine orange forehead fur, same color and surface plane as the surrounding forehead, flowing naturally all the way down to the upper edge of each eyeball. No separate pale skin-colored lid, no raised rim, no arched brow dome, no ivory stripe/band above the eyes, no folded hood, no eyebrow or socket crease. Only a very thin soft dark eye margin should touch the eyeball as in image2. Keep the tiny gentle outer eye corners. Do not erase the eyeballs. Keep existing brown eyeballs, pupils, gaze, eye center positions, opening sizes and highlights unchanged. Preserve all nose, muzzle and lower-cheek fur unchanged. This is a localized repaint of the PALE ABOVE-EYE PADS into ordinary ORANGE FOREHEAD FUR. Make the removal obvious. Output one edited image1 crop same aspect ratio.


已完成3.2秒96帧导出和选定固定区检查，实际查看最终眼部前后对照和原尺寸动画写完帧。冻结motion-v36.gif、native-finish-v36.png、character-comparison-v36.png。
