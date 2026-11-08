# 第二幕：眼球画法修订

2026-11-05。用户澄清说的是眼睛本身，助手之前多次转向眼位/视线/整脸透视，抓错重点。当前针对眼球硬黑外圈、明亮棕色虹膜/黑瞳孔分层、硬白高光以及眼睑与眼球缺乏自然衔接进行局部重绘，保留原有低头姿态。

内置imagegen以[eyes-detail-v32.png](eyes-detail-v32.png)（原图310×140+(485,655)放大三倍）为目标、expression-reference-v26.png为第一幕画法参考。原始输出完整保存[eye-edit-v33.png](eye-edit-v33.png)，原文件exec-cd6bf379-73cf-477f-8630-f2b54eebc919.png。仅通过双眼软区合成到scene-v32-current.png，输出[scene-v33-current.png](scene-v33-current.png)；[eyes-detail-v33.png](eyes-detail-v33.png)为实际合成后的放大图。嘴巴、头部姿态、手笔和环境保留原图。

旧图及脚本compose-expression-v32.mjs、shot-v32.js保留。固定预览revision=33，无新编号HTML。未使用API/CLI，未发布，用户尚未评价本轮结果。

## 完整内置提示词

Image1 is the target eye-region crop of a hamster with its head lowered to write. Image2 is the approved SAME character, precise reference for HOW THE EYES ARE PAINTED. Repaint only both eyes and immediate eyelid/fur transitions in image1 to match image2. The target eyes currently resemble rigid outlined glass marbles: stark black circumference, flat amber lower half, separate black pupil disks and pasted white highlights. Replace this with image2's naturally seated deep chocolate-brown eyes: continuous soft dark-brown volume, delicate warmer brown only in the lower lit area, subtly shaded pupils integrated into the iris, restrained soft-edged catchlights, eyelid shadows naturally covering the upper eyeball, soft lower-lid contact with fur rather than a black enclosing ring. Keep the character's short gentle outer eye corners. No bulging glass spheres, flat concentric circles, hard black outlines, bright amber rings or large white sclera. Preserve image1 eye centers, relative sizes and downward head/gaze orientation: attention remains on the notebook, do not look up at camera. Do not move or mechanically align the eyes. Keep nose, muzzle, fur and all surrounding parts unchanged. Output a single edited image1 crop, same aspect ratio.


已完成3.2秒96帧导出和选定固定区检查；实际查看合成后的双眼放大图及原尺寸动画写完帧。冻结motion-v33.gif、native-finish-v33.png、character-comparison-v33.png。
