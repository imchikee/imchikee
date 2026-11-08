# 第二幕：减轻眼睑和眼窝阴影

2026-11-05。用户指出眼睑仍太明显，看起来无精打采，并询问是否设计本意。目标是专注、有精神地写字，不是疲倦表情；此前上眼睑折线和眼窝阴影过重。

内置imagegen从scene-v34-current.png局部编辑，以第一幕expression-reference-v26.png为眼睛参考，减轻上眼睑折线及眼窝阴影、自然打开眼睛，不继续放大眼球。完整原始输出[eye-edit-v35.png](eye-edit-v35.png)，原文件exec-e2a07adb-10a5-4c16-9ab0-a97c765374ab.png。只通过双眼软区合成，输出[scene-v35-current.png](scene-v35-current.png)，保留原头部/低头姿态、口鼻、手笔、纸页和环境。

同尺度实际对照[eyelid-comparison-v35.png](eyelid-comparison-v35.png)：左v34，右v35。[eyes-detail-v35.png](eyes-detail-v35.png)为修后放大图。旧图与compose-expression-v34.mjs、shot-v34.js保留，固定入口revision=35，无新编号HTML。未使用API/CLI，未发布，尚未获用户评价。

## 完整内置提示词

Image1 is the chapter2 hamster writing scene, the edit target. Image2 is its approved eye character reference. Fix ONLY the heavy upper eyelids and eye-socket shading of image1: the eyes currently look sleepy because of conspicuous drooping dark upper-lid folds and beige socket shadows. This hamster should look alert, warmly interested and focused on writing, NOT tired or half asleep. Remove the thick upper eyelid crease/hood and heavy shadow above each eye. Blend that area gently into the surrounding fur. Lift the upper lid slightly for a naturally awake open eye, keeping overall eye size close to the current reduced size; do not enlarge into bulging round glass beads. Eyelid edges should be delicate and understated like image2, with only a tiny soft outer eye corner retained, no eyeliner or eyebrow-like thick strokes. Preserve deep warm brown eyes, natural pupils and restrained catchlights. KEEP exact downward head angle and looking toward notebook/pencil, eye center positions, nose, smile, fur, paws, pencil and complete room. No head rotation and no looking up at viewer. Output one complete edited scene, same aspect ratio.


已完成3.2秒96帧导出与选定固定区检查；实际查看眼睑同尺度前后对照及原尺寸动画写完帧。冻结motion-v35.gif、native-finish-v35.png、character-comparison-v35.png。
