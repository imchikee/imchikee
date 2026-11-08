# v43短前肢：用户否定，已撤回

2026-11-06。用户截图feedback-v42-arm.png指出上一轮仍不自然。助手误把问题进一步归因为前臂长粗，内置局部重画为short-foreleg-edit-v43.png，并做clean-foreleg-edit-v43.png补底。生成图将腮下身体轮廓削掉，接入后露出空隙，细臂像接在脸下的管子。用户反馈feedback-v43-scary.png：『这搞的有点吓人啊，你做完能不能自己锐评一下先？』本版不合格，完整保留但撤回固定入口；不能将导出/像素检查通过当成自然度合格。

原始文件exec-de4ed01f-9ecb-469a-9481-516ab0bc2241.png、exec-3a72f90e-48df-440e-8f78-15a5d690f376.png，均已拷贝进项目，使用内置工具，未用API/CLI。shot-v43-rejected.js/motion-v43-rejected.gif/native-finish-v43-rejected.png保存本次失败。

## 完整前肢编辑提示词

Use case: precise-object-edit. Edit target: this exact close crop of an illustrated hamster writing. Change ONLY the orange writing foreleg and its transition into the pink gripping paw. The current forearm is an overly thick long horizontal sausage tucked under the cheek. Replace it with a genuinely short delicate hamster foreleg: compact bent elbow tucked into the body on the left, a narrower gently downward-sloping forearm extending toward the existing paw, tapering smoothly into the pink wrist with fine fur at the join. Clearly separate the little limb from the lower cheek above by a soft natural occlusion, not a hard straight seam. Reduce the exposed orange forearm bulk especially its lower contour; restore the small desk/paper area revealed under it. The pink paw remains small, rounded and animal-like, at EXACTLY the same location gripping the pencil. Preserve the pencil's exact angle, length and endpoints and the paw's position/scale. Do not move the mouth, nose, cheek contour, notebook/page edges, lamp base or foreground book. Keep the original warm golden light, orange and cream fur and detailed painterly texture, exact framing and aspect ratio. No long human arm, no large shoulder, no cylindrical horizontal arm, no detached paw, no second limb. This will be composited as a small local limb patch, everything outside the arm must remain registered.

## 完整补底提示词

Use case: precise-object-edit. This is a close crop of a hamster illustration used for animation. Make a clean BACKGROUND PLATE: remove the ENTIRE small orange curved foreleg under the cheek, ALL pink gripping paw, ALL of the green pencil and any cast shadows, with ZERO remnants or ghost outlines. Replace the removed foreleg/paw with the desk wood or cream notebook paper as appropriate; the notebook's existing straight left green edge must continue underneath the former paw without moving. The cheek above and its lower body/face edge remain EXACTLY as shown; do not add any orange horizontal stump or dangling arm. Behind the removed pencil, restore continuous cream cheek fur above and clean paper below. Preserve exact framing, nose/mouth at upper right, warm detailed brush texture, left lamp base, desk grain, foreground book, notebook and all edges. Same aspect ratio. No new arm or extra fur limb.

