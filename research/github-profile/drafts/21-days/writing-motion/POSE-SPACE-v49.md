# 头身空间与短前肢候选 v49

用户明确否定 v48，并指出第二幕已经修改 48 版仍未做好。此前局部拼接不能补救头部下缘几乎贴着笔记本后缘的整体结构；功能和像素检查通过也不代表姿态自然。本稿改变整体头身空间，仍待用户评价，不能记为认可。

仅用内置 imagegen。第二幕 v38 为编辑目标，第一幕 `../reading-motion/lighting/down-v2.png` 只作角色和紧凑动物体态参照，不复制房间。头脸由生成结果重绘，保留角色特征的目标不等于原脸像素完全不变。整头含帽耳缩小、露出紧凑胸腹，短前爪从体侧伸出。房间外部采用 v38 原像素；角色新旧轮廓并集内使用新画，以免残留旧腮帮。

## 实际内置编辑提示词

Use case: identity-preserving illustration pose edit. Image 1 is the EDIT TARGET, the existing 'DAYS 11 - 21 / More C++.' hamster writing scene. Image 2 is ONLY a character and compact animal-body reference, NOT an environment/layout reference. Correct the overall head/body/desk relationship in IMAGE 1. IMPORTANT STRUCTURAL CHANGE: uniformly reduce the hamster's entire head including cap and ears by approximately 12%, keeping its cap top at the same height. This moves its chin upward about 60-70 original-image pixels and creates real space for a visible squat hamster torso between the head and the notebook. Keep the exact face identity: warm large brown eyes with soft little outer corners, puffy cheeks, pink nose, open toothy smile, original head tilt looking down toward the notebook. Do not flatten or widen the face, make tired eyelids, change expression or make a new character. The hamster sits securely BEHIND the desk on a short, soft round body, slightly leaning toward the notebook; its cream furry chest/belly is visibly below the head. NO human neck, human shoulders, upright human torso, huge belly or cylinder body. Both front limbs are genuinely short little hamster forelegs emerging from the SIDES OF THE VISIBLE BODY below the cheeks. The viewer-left tiny pink paw actively grips the existing green pencil and writes on the existing notebook near its current position; the viewer-right pink paw rests lightly on the opposite page. The foreleg must not touch or prop up the cheek, and must not look like a bent support bracket attached to the face. Keep the wrist straight with the little forearm and the grip firm, no limp or dangling paw. No extra body folds, furry collars, double arms or lumps between cheeks and paws. Keep title, left desk lamp, pen cup, right C++ mug/book stack, shelves, plants, notebook and foreground books unchanged in their existing positions and perspective. Do not copy the room from image 2. Preserve the crisp warm golden painterly fur texture and full framing. Make a convincing cute animal writing pose with clear head, squat torso and short forepaws as a single coherent illustration.

原始输出 `/home/chikee/.codex/generated_images/01a1a0b1-a246-71a1-942c-a64976c7822a/exec-daaf4d4f-2b9e-4030-9e1f-c3f2c4b187f8.png`，完整保存为 [pose-space-edit-v49.png](pose-space-edit-v49.png)。[compose-space-v49.mjs](compose-space-v49.mjs) 保留明确角色包络及羽化参数，输出 [scene-v49-current.png](scene-v49-current.png)。

## 实际补底提示词

Use case: precise-object-edit. Create a local animation clean plate from this exact crop. Preserve the visible hamster torso: its orange left flank and cream chest below the head remain the same compact round body at the same height and width. Remove only the projecting little writing forearm in front of the torso, the pink gripping paw, the entire green pencil and all pencil/paw shadows. Where the forearm covered the body, restore the continuous existing torso fur following its round form; where paw and pencil covered the notebook, restore clean cream paper and existing desk wood. Keep the body silhouette, cheek underside at the very top, chest fur boundary, notebook straight green edge and spiral, foreground book and desk grain exactly registered. No new neck, no new torso column, no forearm stump or spare paw, no horizontal fur roll, no expansion of head or body. Do not flatten the chest onto the paper; keep the body sitting behind the notebook. This is a clean background beneath a separately animated short foreleg; the original foreleg and paw will be placed back over it. Same crop framing and aspect ratio, same warm painterly texture, no ink or ghost pencil.

输入 [clean-space-input-v49.png](clean-space-input-v49.png)：原画 x340,y740,w370,h260，放大编辑。原始输出 `/home/chikee/.codex/generated_images/01a1a0b1-a246-71a1-942c-a64976c7822a/exec-bb1b6bf3-eda0-4af1-a37e-b7939a86caac.png`，完整保存为 [clean-space-edit-v49.png](clean-space-edit-v49.png)。[build-region.mjs](build-region.mjs) 缩回原裁图尺寸，位置保持不变，不拉伸填满旧 ROI。

## 动作与内部检查

肩点 (430,815)、肘参考点 (451,876)，上臂藏在实际胸腹内；露出的前肢、爪和笔同层保持长度和腕姿。笔尖与纸面投影共用坐标，仍逐笔写 `++i;`。首次内部切片根部过窄，末段显出斜切毛纹，保留为 `shot-v49-root-cutout-check.js`，随后扩大取样至身体内侧再遮接；未覆盖固定页提交该试验。扩大根部后取样曾在左侧带出额外竖毛边，已限制活动图层在实际体侧轮廓内，并以原胸腹遮住根部上缘；肩侧固定样区仍须通过逐帧检查。

检查应包括正常尺寸整幅、原尺寸起笔/收笔、12 阶段前肢，以及原角色参考。像素检查只覆盖所声明的不动样区；新角色不能拿旧脸像素作基准。台灯下沿样区原本包含旧角色 57 个像素，已明确排除 x301..309,y574..584 的旧腮轮廓，实际灯体检查保留。角色包络曾触及本子装订环，合成脚本已恢复该区域原画，保留原样检查。第一幕及线上 README/assets 未动。

最终导出 96 帧 / 3.2 秒；肩侧固定、原画对应样区、灯体/杯/前景书/装订环及纸页固定检查通过。固定两入口 revision=49；正常尺寸及原尺寸阶段已查看，待用户评价。

固定页及主页检查完成：桌面/手机、深浅主题、两幕切换、播放/重播/拖动、结束停止及减少动态通过。实际查看最终固定页截图、整幅连续帧与前肢阶段。检查通过不等于用户认可自然度。
