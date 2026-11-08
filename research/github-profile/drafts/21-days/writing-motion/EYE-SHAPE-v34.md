# 第二幕眼形与尺寸修订

2026-11-05。用户指出v33看不出太大变化。v33仅调明暗和边缘，眼球尺寸与球形轮廓未明显改变，不能继续将微弱变化称作修好。

内置imagegen以scene-v33-current.png为目标、第一幕expression-reference-v26.png为参考，明确重画眼形，缩小可见眼球、降低可见高度、让上眼睑自然覆盖上缘，保留低头姿态。原始完整输出[eye-edit-v34.png](eye-edit-v34.png)，原文件exec-2bd48fc0-4a81-458f-a649-3f3bce159afe.png。只接入双眼及周边毛发软区，清掉旧大眼边缘，输出[scene-v34-current.png](scene-v34-current.png)。

实际对照[eye-shape-comparison-v34.png](eye-shape-comparison-v34.png)：左v33、右v34，同一原图裁框与显示尺寸。[eyes-detail-v34.png](eyes-detail-v34.png)为修后放大图。旧图/compose-expression-v33.mjs/shot-v33.js完整保留，固定入口revision=34，无新编号HTML。未使用API/CLI，未发布，未获用户评价。提示词中的百分比是生成目标，不作为实测结果。

## 完整提示词

Image1 is the full chapter2 edit target; image2 is the approved SAME character eye reference. Make a CLEAR STRUCTURAL correction ONLY to both eyes, not merely a subtle color retouch. Target eyes currently are too large, circular and bulging like round glass beads. Reduce their visible WIDTH about15percent and visible HEIGHT about20percent, centered around their current locations. Reconstruct natural fur where the larger old eye borders were. Match image2's actual character eye shape and scale relative to the head: gently rounded oval eyes seated in soft fur sockets, upper lids naturally covering the upper eyeball, delicate short soft outer corners, a subtle soft lower-lid transition. Neither spherical protruding marbles nor pointed fox eyes nor narrowed sleepy slits. Deep warm chocolate brown with softly integrated pupils and a small restrained catchlight. No hard black encircling ring, no amber rings, no large eye whites. KEEP the existing DOWNWARD head pose and attention to the pencil/notebook; do not rotate head or look toward camera. Do not change eye center positions, head outline, cap, ears, nose, smile, whiskers, hands, pencil, notebook or room. Only eye size/shape and immediate surrounding fur. One full scene same aspect ratio.


已完成3.2秒96帧导出和选定固定区检查，实际查看同尺度眼部前后对照、完整合成图和原尺寸动画写完帧。冻结motion-v34.gif、native-finish-v34.png、character-comparison-v34.png。
