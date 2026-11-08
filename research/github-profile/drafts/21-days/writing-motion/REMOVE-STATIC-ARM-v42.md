# 第二幕：清除背景旧前臂，检查动作中段

2026-11-06。用户指出v41动画中段仍怪，截图feedback-v41-mid.png。回看ARM-CLEANUP-PROMPT.md：前面已有“背景旧前臂与活动前臂重复”的教训。v41仅恢复运动方式，仍使用带橙色前臂残段的clean-patch-v39.png，并额外恢复forearmBase，造成中段两层前臂重叠、显厚显折；不能将运动公式接回等同于完整复用历史经验。

本轮从当前scene-v38-current.png裁出340×240+(315,770)，放大为clean-arm-input-v42.png。内置编辑移除完整橙色前臂、粉爪、笔及影子，明确不留橙毛腕残段；完整原始输出[clean-arm-edit-v42.png](clean-arm-edit-v42.png)，原文件exec-68588083-3bad-48f7-9dcd-616dace9f071.png。缩放为clean-patch-v42.png，局部接入原肢体周围，不整幅替换脸型/场景。

shot.js扩大补底到整条旧前臂并移除forearmBase恢复层；画面只绘制一条活动前臂和一只刚性手笔层。身体根部仍固定、腕端跟随，纸面投影/八笔字迹与小幅转腕继续沿用。背景修补在脸部之前渐隐，保留已确认的五官/脸型和其他布景。

render.mjs的快速预览增加--time参数，可直接检查用户指出的中间时刻，而不是固定只看3.1秒结束。已先查看--time=1.3的背景层、整幅和[mid-detail-v42.png](mid-detail-v42.png)，确认背景没有旧前臂残段。旧shot-v41.js、render-v41.mjs、build-region-v41.mjs及v41动画保留。

固定入口revision=42，原画仍scene-v38-current.png，无新编号HTML。未使用API/CLI，未发布。中段自然度尚未获用户评价。

## 完整内置提示词

Create a clean animation background from this exact crop by removing the ENTIRE writing limb: ALL projecting orange furry FOREARM across the middle/lower left, ALL pink gripping paw, the ENTIRE green pencil and ALL their cast shadows. IMPORTANT: do NOT leave any rounded orange forearm/wrist stump resting on the paper. No orange sausage-shaped limb, no second arm or protruding lump remains. Reconstruct the natural tucked lower body surface behind the removed arm, then the cream notebook paper/wood desk exposed beneath its previous silhouette. Preserve the cheek/chin above, mouth and teeth at upper right, original face fur colors and texture, notebook perspective, green cover/page edges and foreground book fragment. The green notebook edge continues straight under the former arm, do not bend or move the book. This is a BACKGROUND PLATE: the original full forearm and paw will be animated on top, so the background must contain ZERO remnants of the writing limb. Keep exact crop framing and all other objects fixed. One edited crop same aspect ratio.

## 实际检查

完整导出96帧后，逐格查看0.7–2.4秒中段的52个连续帧（mid-review-v42-0.png至mid-review-v42-6.png）：活动前臂只有一层，根部留在身体侧，腕根与粉爪一起连续移动，未再出现原来的静态前臂重叠。另保留[中段两倍慢放对照](arm-middle-comparison-v42.gif)，左v41、右v42，同一时段同一尺度。

inspect-frames.mjs通过：原画初始爪心、头帽耳/固定五官、台灯、杯子、前景书、线圈和静止爪像素保持；三个选定纸页区域在关键帧中固定。动画和整幅最终画面另存motion-v42.gif/native-finish-v42.png/character-comparison-v42.png。功能与局部检查不代表用户审美确认。

固定预览实际截图preview.png已查看。capture.mjs通过1440/390明暗布局、两幕动画/暂停、九幕跳转及当前revision=42加载检查；git diff --check通过，第一幕与线上README/assets无改动。
