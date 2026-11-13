# v48：先修静态躯干与前肢，再接动画

> 2026-11-11 清理：本文涉及的已否定方案文件已按用户要求删除，具体范围见 [清理记录](CLEANUP.md)。以下保留反馈、提示词及历史说明；旧文件名不再表示文件仍存在。

2026-11-06。用户截图feedback-v47-cheek-origin.png追问“这手是从哪出来的呢”，随后授权继续。v47腕部虽同向，静态仍缺少清楚的躯干—肩部—前爪关系，像从左腮直接伸出。不能再以消除断口、像素固定或骨段长度替代姿态判断。

## 静态结构

以内置图像编辑scene-v38-current.png，得到完整anatomy-edit-v48.png（原exec-1946de94-b0c7-4b93-a2ce-ceb7eb9a7adb.png）。新结构在左腮下保留可见的紧凑躯干，前肢从体侧弯向笔记本，肘部与腕部连贯。compose-anatomy-v48.mjs只接躯干/前肢的小范围，五官、帽子和环境继续原图；没有整幅替换。静态新旧对照static-anatomy-comparison-v48.png和原尺寸局部static-anatomy-detail-v48.png已实际查看，先看静态再接运动。

再从新原画裁出clean-anatomy-input-v48.png，内置生成clean-anatomy-edit-v48.png（原exec-e7c8024e-59fe-43ef-b889-4bedfaaae877.png），保留已有躯干并移除活动前肢、粉爪和笔。clean-patch-v48.png仅用于原前肢周围，不再把旧clean42的身体形状套到新姿态上。最初补底遮罩没有覆盖完整旧前肢上缘，露出叶状残片，已扩大独立forelegErase；笔旁小暗点也已用clean42中的干净面部毛发小区修掉，避免恢复原图的旧笔影。原始输出全部保留。

## 动作

按新原画选择躯干内肩点(369,845)和肘部(395,888)，采用保留前臂/粉爪/笔相对姿态的刚性活动层。短上臂通过两段关系承接笔尖轨迹；实际躯干原画从前面遮住体侧接缝，该遮片止于原画真实躯干边缘，不带原前肢。前肢不从脸部切片采样，不拉伸笔或压缩毛臂，纸面投影与八笔书写仍沿用。

本轮完整提示词与内置输出保留，没有API/CLI，没有新编号预览HTML，固定页在内部检查完成前仍是v47。实际完整导出与最终接入状态后续按结果续记，用户尚未评价。

## 原画编辑完整提示词

Use case: precise-object-edit. EDIT TARGET: the attached full hamster writing illustration. Repair ONLY the viewer-left lower torso, shoulder and writing foreleg. Keep this exact cute hamster identity, full head shape, face, eyes, mouth, hat, pose direction, room, title and all books unchanged. The current writing limb reads as a long horizontal orange sausage sprouting from the cheek. Redraw the local anatomy so the arm clearly grows from a small compact ROUND TORSO below and behind the cheek, rather than from the cheek itself. Show a continuous body-side shoulder that flows naturally down into a short tucked upper foreleg and a small bent elbow supported on the desk/notebook, then a gently upward/forward forearm ending in the existing small pink paw. Keep the original pink paw, its size, grip, green pencil angle and pencil tip position at the same place on the notebook. The body must be a squat hamster body, not a human shoulder/neck/chest. The cheek should overlap the torso with ONE soft natural occlusion shadow; no extra intermediate furry roll, fold, lobe, phantom limb, dark block or furry collar. Do not hollow out the cheek/body or rest the whole face flat on the desk. Make the elbow compact and the wrist firm and aligned with the forearm, actively gripping the pencil. Preserve warm orange and cream fine fur, golden desk lamp light, crisp painterly detail. Keep the notebook perspective and straight edges, the right resting paw, and all environment exactly registered. This is a local structural correction under the left cheek; no redesign of the face, no new objects. Same full framing and aspect ratio.

## 补底编辑完整提示词

Use case: precise-object-edit. This exact crop is an animation clean-plate target. Remove ONLY the writing limb projecting to the right: the curved orange writing foreleg from its shoulder overlap toward the pink paw, the entire pink gripping paw and the entire green pencil including its shadow. Keep the existing squat torso at the FAR LEFT exactly as it is, including its width and original bottom at the wooden desk; do not lengthen it, make a new vertical stump, add feet or extra limbs. Preserve the original lower cheek contour above the arm, including its natural curve and fur; do not expand the cheek downward into the removed limb area. In the space left by the removed arm, show the existing wood desk and notebook paper, with only the existing torso left behind at the left. No horizontal furry roll, orange slab, second arm, middle lobe, new chest bulge, or pencil/paw remnants. Keep the head supported by the existing left torso: do not cut that torso away or make the head float. The cream chin and mouth fragment at upper right stay exactly fixed. Keep the notebook's left green edge, paper perspective, foreground book and wood grain registered. Same crop framing/aspect, fine warm orange/cream fur and golden painterly light. This plate is only the background beneath the original animated foreleg; the full original foreleg will be placed over it.


## 最终检查与接入

完整导出96帧/3.2秒，实际查看静态结构新旧、静态原尺寸、arm-review-v48.png手部12阶段、whole-animation.png整幅12阶段，以及length-comparison-v48.png起笔/收笔原尺寸。新姿态明确露出躯干，前肢连接体侧；中后段未再恢复旧前肢上缘，笔旁暗点已清。初始掌心与新scene-v48-current.png对应；固定头帽耳、选定五官、灯/杯/前景书/静止爪仍与v38一致；身体侧固定区、纸页声明/边缘/线圈关键帧检查通过。

检查后才复制候选到shot.js并接固定入口revision=48，冻结motion-v48.gif/native-finish-v48.png/character-comparison-v48.png；慢放arm-middle-comparison-v48.gif左v47右v48。没有新编号HTML，第一幕及线上README/assets不改。用户尚未评价，本轮不写成采用或发布授权。

固定页最终截图preview.png已实际查看。capture.mjs通过revision=48加载、两幕播放/暂停/跳转及1440/390明暗布局；平均绘制0.1ms。git diff --check通过，第一幕和线上README/assets无改动。

## 用户否定

用户截图feedback-v48-rejected.png明确“还是很垃圾”，随后批评第二幕48版仍未做好。此版未通过视觉要求。此前“检查过静态/中段”不能当作姿态成立；用户仍指出手臂关系不自然，当前头部下缘约870，笔记本后缘约877，基本没有可见躯干空间。后续先检查整体空间，停止在现构图上补手臂切片；不得继续把功能通过说成修好。
