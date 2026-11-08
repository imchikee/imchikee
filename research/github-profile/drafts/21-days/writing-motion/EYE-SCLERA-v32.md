# 第二幕：检查并修正眼白与眼形

2026-11-05。用户要求助手自己检查眼睛。实际放大查看v31完整导出和第一幕眼口参考，发现v31大块明亮眼白、小而偏下的虹膜、偏尖眼睑使表情不自然。此前只核对头部低下，没有充分检查眼形，不能宣称视觉已通过。

内置编辑用scene-v31-current.png为目标、expression-reference-v26.png为第一幕参考，恢复几乎填满眼眶的大棕色虹膜、圆润眼形及柔和短眼角。完整输出保存[eye-edit-v32.png](eye-edit-v32.png)，原文件exec-8010f63f-014c-4b31-b7b4-cb42cb655777.png。只合成双眼软区，保留v31低头姿态、嘴巴、手笔与场景，输出[scene-v32-current.png](scene-v32-current.png)。放大检查图[eyes-detail-v32.png](eyes-detail-v32.png)。

额外内置视线试验eye-gaze-v32-rejected.png（原文件exec-13870991-b9ec-459c-baff-e034d010c55f.png）把瞳孔压到虹膜下缘，助手自查弃用，未接入运行时。两个原始输出和提示词完整保留。旧脚本compose-expression-v31.mjs、shot-v31.js保留。固定入口revision=32，不新增编号HTML。未使用API/CLI，未发布，本轮尚未获用户评价。

## 采用输出完整提示词

Image1 is the edit target, full hamster writing scene. Image2 is the approved eye character reference. Change ONLY the TWO EYES of image1. Current eyes have large bright white crescents and small low-positioned brown irises, making an unpleasant sideways-eyed expression. Match image2's warm large deep-brown irises that fill almost the ENTIRE visible eye opening, with essentially no exposed bright eye white. Rounded soft eye apertures and gentle curved lids, short soft outer eye corners, not sharp narrow slits. Preserve image1's existing DOWNWARD head pose and attention to pencil tip on viewer-left notebook page. Both eyes should look naturally downward at that SAME nearby writing point, not sideways or cross-eyed. Convey downward gaze through gentle upper lid coverage and lower-directed pupils inside large brown irises, not by shrinking the irises into pools of white. No large white sclera. Keep exact eye positions and natural perspective, don't level or shift the eyes. Preserve the entire rest of image1 exactly: cap, ears, face shape, head tilt, nose, open smile and teeth, whiskers, paw, pencil and entire room/notebook. Only repaint eyes, no other changes. Output one full scene same aspect ratio as image1.

## 弃用视线试验完整提示词

Make ONE very localized correction to the two eyes of this image: the large brown irises now look right, but the black pupils sit toward their UPPER side and look up at the viewer. Move BOTH black pupils visibly toward the LOWER LEFT portion of their brown irises, to look down at the pencil tip on the left notebook page. In each eye there should be more visible brown iris ABOVE the pupil and less brown BELOW it. Keep the brown iris filling the eye opening with almost no white sclera. Keep catchlight direction from the left lamp coherent, not as the gaze target. Maintain the existing downward head pose, soft eye corners, eye size/positions and ALL other image pixels/composition. Do not change eyelids, nose, smile, hands, cap, fur or background. One full scene.


已完成3.2秒96帧导出与选定固定区检查，实际查看双眼放大图、完整合成图及原尺寸动画写完帧。冻结motion-v32.gif、native-finish-v32.png、character-comparison-v32.png。
