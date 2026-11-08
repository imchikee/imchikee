# 修正直杆前肢

用户评价草图动画“手臂直的像根法棍”。v60 静态姿态仍为基准；只从内置生成的 foreleg-v61.png 提取弯曲、收腕的前肢与爪笔区域，其余画面沿用 v60 和已有局部补底。原始生成全图不直接替换已确认姿态。

动作改为腕部主导（85% 角度）、根部小幅跟随（15%），使用透明前肢上的连续网格过渡。爪和笔保持同一刚性变换，根点不动；不再整臂硬杆旋转，不对纸面做网格变形。仍为 4 秒短笔画试验，尚非完整书写、抬笔和循环。

已检查关键帧，修正补底不足导致的旧笔杆残影。数值检查根点位移为 0，爪到笔尖距离误差约 2.3e-13 像素。此检查不代表用户审美认可。旧版代码保存在 sketch-motion-rigid-rejected.js。

## 实际提示词（内置 imagegen）

Use case: precise-object-edit. Change ONLY the viewer-left orange writing forelimb between the cheek and the pink gripping paw. It currently looks like a long straight horizontal bread loaf, with parallel upper/lower edges. Replace that straight sausage shape with a compact softly bent hamster foreleg: rounded elbow tucked close against the body beneath the outer cheek, curved lower contour that rises gently toward a narrower furry wrist beside the pink paw. The foreleg is short and organically tapered, no human angular elbow, no long upper arm, no separate floating segment. Keep the gripping paw and pencil at their EXACT current positions and sizes, and keep the existing face, cheeks, eyes, cap, body pose, other paw, notebook and white background unchanged. Do not widen the back or add a rump. Preserve this watercolor graphite sketch's colors and style. This is a localized forelimb silhouette correction for animation, not a redesigned character.
