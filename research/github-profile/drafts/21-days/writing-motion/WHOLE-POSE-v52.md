# 完整静态写字姿态 v52

2026-11-07。用户明确否定 v51，随后同意先做一个完整写字姿态，静态成立再接动画。当前仅交付静态候选，不将旧切片动画套上新原画，也不记为用户认可。

内置 imagegen，以 scene-v49-current.png 为编辑目标，整体重绘可见躯干与两条前肢。首次结果多出后脚/臀部，判断不合格，保存 pose-v52-extra-feet-rejected.png；第二次仅去掉多余后肢，保留完整肩—肘—毛腕—爪连接，保存 pose-v52-static.png。两份生成原始输出都保留，未进行前肢拼接合成。

已实际查看完整画面及 pose-v52-forelimbs.png 原尺寸局部：两只前爪、握笔爪与毛腕连续，弯臂由身体侧面向纸页伸出，笔尖接触左页，另一爪压在右页；后脚已隐藏。毛臂较旧稿饱满，角色自然度仍属候选。当前没有逐笔字迹或动作；固定预览页明确标记静态。旧动画源码和导出均保留；完整主页仍为历史 v51，不能误认为已接新稿。

## 第一次实际提示词

Use case: precise-object-edit. Edit the supplied full illustration to draw ONE convincing complete hamster writing pose, not an animation and not a collage. Preserve the existing head, face expression, green cap, ears, title, desk, notebook, lamp, pen cup, mug, books and room composition. Redraw the hamster's entire visible lower body and BOTH forelimbs together coherently. It is a small squat furry hamster sitting behind the desk and leaning slightly forward over the open spiral notebook. Its viewer-left forelimb emerges from the SIDE of the torso below the cheek, bends at a small tucked elbow, and reaches diagonally forward/down onto the left page. Show the forelimb's continuous rounded outer contour and a subtle natural overlap separating it from the cream chest, so it reads as a short bent animal foreleg, not a horizontal fur roll or a rectangular block pasted on the body. The compact pink paw firmly wraps the green pencil, wrist aligned with forearm. The pencil tip touches the left notebook page near its current location. Give the foreleg believable soft volume and support at the tabletop; no dangling hand, no thin human wrist, no muscular human arm, no shoulder growing from the cheek, no extra furry lump or duplicate contour. The opposite paw gently rests on the right page. Maintain the existing character size, cheerful warm eyes, puffy cheeks, bright painterly fur and golden desk lighting. The desired visible change is a clearly readable natural bent foreleg attached to a compact animal torso, rendered as a single coherent drawing. Keep the full image framing and original title exactly.

原始输出：/home/chikee/.codex/generated_images/01a1a0b1-a246-71a1-942c-a64976c7822a/exec-cc525e23-7742-4bec-a8a0-cccf2a9d9224.png

## 去掉多余后肢的实际提示词

Use case: precise-object-edit. Correct this image: the hamster must sit BEHIND the desk, not squat ON the desk. Remove the two EXTRA pink hind feet at the far left and far right of its body, and remove the two separate orange haunch bulges behind those feet. Restore the original warm wall and desk in the removed areas. Only TWO pink paws should be visible in the entire image: the paw gripping the pencil and the paw resting on the right notebook page. Keep the newly drawn continuous bent writing foreleg, its shoulder-to-elbow-to-furry-wrist connection, the cream chest, the resting foreleg, head, face, hat and entire room unchanged. The compact torso terminates behind the notebook/desk edge, lower body and hind legs hidden below the tabletop. No extra limbs, no orange lumps behind the forelegs. Preserve exact framing and sharp painterly texture.

原始输出：/home/chikee/.codex/generated_images/01a1a0b1-a246-71a1-942c-a64976c7822a/exec-c6e246e0-d32c-49b6-bfbf-6e4a3711d21a.png
