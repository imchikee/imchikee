# 毛发修订（2026-11-02）

**最新状态：** 用户认为下述动画毛纹合成使重影更重，已撤回，不能当作改善已成功。用户另框出原参考轮廓的长尖毛束，原参考与各新姿态的外沿仍须实际改画；本轮尚未实施该轮廓修改。

## 后续额头尝试与动画合成修订

用户再次继续后，以两张 `*-key-soft-v1.png` 分别为输入、原细修稿为参考，各做一次额头局部编辑。输出保存在 `mid-forehead-test-v2.png`、`down-forehead-test-v2.png`，**减弱刻线的效果仍有限，未接入动画**；现继续使用上一轮两张较稳的姿态。两次实际使用相同提示词：

Use case: precise-object-edit. Image 1 is the exact target; image 2 is the approved identity and gentle hand-painted style reference.
Repaint ONLY THE FOREHEAD FUR and the orange fur on upper cheeks, plus tiny coarse ear-tip hairs. The existing dense white scratch pattern on the forehead between cap and eyes needs to disappear visibly. Paint that orange forehead as soft short velvety fur: mostly quiet continuous hand-painted orange shading, just a FEW barely perceptible extremely fine directional hairs. Remove the crowded white V-shaped scratches and etched wavy ridges instead of merely making each existing scratch slightly smaller. Likewise quiet the orange upper cheek patch left of the left eye. Keep the full round fluffy cheek volume through gentle color and shadow, and preserve the already soft cream cheek areas. Refine only the few sharp ear-tip tufts into delicate rounded wisps.
Keep this a warm dimensional STORYBOOK PAINTING with matte soft fur, not glossy plastic, flat cartoon or realistic strands. Keep the eyes, nose, mouth, teeth, whiskers and cap crisply illustrated. Strictly preserve head angle, eye and ear positions/sizes, rounded cheek widths, happy expression, gaze, hands, book, room, lettering, colors, camera and complete 1316:1195 framing. Do not redesign or relocate anything. The surface change should be clearly visible in the forehead while every landmark and pose stays the same.

本轮主要落地修改是动画的毛纹合成：保留三张原画形成的俯仰、五官、帽檐及颜色，毛发区域用原细修稿随对应点移动的亮度/细纹替换多图叠化，眼口、胡须、帽子等区域排除。使用原生Canvas合成，无像素读回要求，直接打开本地HTML可用。并非已新画出更稀疏的额头，也不宣称解决所有插值或纹理问题。

用户对整体动作给出“这版还可以”，随后询问毛发是否最终；助手明确尚未定稿，并在用户继续后仅修改中间和低头姿态的毛发表现。全部使用内置imagegen，不使用CLI/API。

输入：原中间姿态 `mid-key-v1.png`、原低头姿态 `down-key-v2.png`，及 `../../model/reading-soft-v1.png` 细修参考。中间姿态第一轮只略有改善，再编辑一次，最终保存为 `mid-key-soft-v1.png`；低头姿态额外参考该修订，保存为 `down-key-soft-v1.png`。原图保留，动画入口及姿态对照引用新图。

提示中的“减少约三分之二”是生成要求，不是已测量或已达到的结果；新图仍保留细密纹理，不能宣称毛发问题完全解决或用户已最终认可。

## 中间姿态第一轮（未采用）

Use case: precise-object-edit.
Image 1 is the EDIT TARGET: this exact intermediate head-pitch illustration. Image 2 is the approved fur-rendering reference only.
Make ONE tightly scoped surface-rendering edit to image 1: refine ONLY the hamster's fur to match the soft, fine, low-contrast coat in image 2. Return the same complete image at the same 1316:1195 framing.
Replace the conspicuous coarse white dash marks, thick orange/brown fur ridges and dense scratching on the forehead, cheek pouches, ears and forearms with much thinner, sparser, lower-contrast tapered hairs over intact softly painted warm orange/cream volumes. Reduce fur mark density and contrast especially on the brow, top of cheeks and ear edges. Keep a few delicate tiny wisps rather than long dark spiky clumps at the outer silhouette. The cheek and ear contours must read as soft rounded shapes. Preserve the warm illustrated dimensional shading and a subtle hand-painted surface; do not make flat vector art, smudgy blur, plastic 3D or waxy airbrush skin.
STRICT INVARIANTS: exactly preserve the head angle, cap shape/tilt, ear positions, cheek width and rounded volumes, eye size/positions/highlights, downward gaze, pink nose, small happy mouth and teeth, whiskers, hands, grip, book shape and location, all lettering, entire room, lighting, color palette and camera. Do not shift any facial feature, enlarge/shrink the head, flatten the cheeks, change expression, lift the book or redraw the character design. Only the fur mark thickness/density/contrast and jaggedness of individual fur tips should change.

## 中间姿态再次细化（采用为本轮候选）

Use case: precise-object-edit.
Image 1 is the exact edit target. Image 2 is the fine-fur reference. The previous small refinement was insufficient. Change ONLY fur texture and tiny fur tips, preserving this exact character and pose.
Make the fur visibly quieter: REMOVE about TWO THIRDS of the prominent individual white/orange/brown hair marks on the head and ears, especially the dense wavy white scratches on the upper cheeks and forehead. Render most fur as soft continuous painted orange/cream masses with a few extremely fine, short, faint directional hair hints. At ordinary viewing size the cheeks should look fluffy and soft, not etched or densely striped. Preserve the rounded cheek volume using gentle painted shading, not dense stroke patterns. Round the ear/cheek silhouettes; remove long sharp dark triangular spikes and leave only a few tiny, soft, low-contrast wisps. Match the original reference's gentle storybook coat, with less coarse surface scratching.
This is NOT an instruction to blur the whole picture. Keep face, eyes, nose, mouth, cap and book crisp; do not create glossy plastic, flat vector coloring or a new mascot.
Preserve EXACT pixel positions and shapes of head angle, ears, eyes and highlights, gaze, nose, delighted mouth/teeth, cap, whiskers, cheeks' outer rounded volume, paws, book and room. Preserve warm orange/cream colors, original shading, lighting, title and full framing (1316:1195). Do not move or resize anything. Only fine-scale coat rendering changes.

## 低头姿态（本轮候选）

Use case: precise-object-edit.
Image 1 is the exact EDIT TARGET (hamster with its head bowed to read). Image 2 is the approved original fur reference. Image 3 is the refined middle-pose coat to match for animation consistency.
Only repaint the hamster's FUR surface in image 1. Keep its exact head rotation and complete 1316:1195 scene framing. Replace thick bright scratch-like white hairs, dense wavy ridges and dark spiky clumps with fine, sparse, low-contrast soft short fur over smooth hand-painted orange/cream volumes, matching images 2 and 3. Visibly reduce the etched/coarse appearance on the forehead, upper cheeks, ear rims and forearms. Let soft shading carry most of the fluffy cheek volume. Keep only occasional tiny tapered hair hints and tiny soft wisps at the silhouette; no sawtooth edge. Preserve the warm storybook painting and dimensional rounded cheek pouches, not flat vector blocks, plastic gloss, blurry face or dense fur detailing.
Absolutely preserve the existing head angle, brim/ear perspective, eye positions/sizes/dark bean style/highlights, downward gaze, nose, happy small mouth/teeth, cheek width and outer volumes, whiskers, green cap, hands and grip, blue C++ book, lighting, room, lettering and object positions. Do not change expression or anatomy, re-angle the head, shrink cheeks, enlarge eyes, lift the book, shift the camera or redesign anything. This is a coat-rendering adjustment only.
