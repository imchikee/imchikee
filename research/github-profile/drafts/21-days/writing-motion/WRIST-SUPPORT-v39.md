# 第二幕：当前原画补底与腕根支撑

2026-11-06。用户指出笔杆后仍有旧色块、手臂还有断开的感觉，截图feedback-v38-wrist.png。上一轮仅清掉前景误带的毛色，没有更新仍来自v26的补底，也没有处理书写中手腕上漂与短毛腕单独旋转的问题。v37“整体尚可”的头脸/造型继续保留。

本轮从scene-v38-current.png裁出260×240+(395,770)，放大保存clean-input-v39.png，用内置imagegen移除粉爪、笔及笔影，重建连续脸颊毛发、橙毛腕根和原纸面。原始输出完整保存[clean-edit-v39.png](clean-edit-v39.png)，原文件exec-35000de6-68b4-4bff-b89d-b27b082094d3.png；缩放为clean-patch-v39.png，仅用于原手笔/旧笔影附近软蒙版，不整幅替换角色或环境。

shot.js移除将短毛腕/粉爪向上带的两段关节解算，改为原前臂保持支撑、粉爪沿纸面小幅移动，握笔轻微旋转。接触笔尖仍由原纸面投影决定；落笔时手笔刚性变换的笔尖与墨迹共用位置，抬笔时围绕腕部轻微转动，接触阴影沿纸页运动。扩展原笔影补底范围，清理笔杆后旧色块。没有拉伸纸页或毛发，也没有重画脸型/表情。

固定脸部和场景原画仍是scene-v38-current.png，固定入口revision=39。旧shot-v38.js和build-region-v38.mjs及v38动画完整保留，无新编号HTML。[wrist-preview-v39.png](wrist-preview-v39.png)左旧右新，为快速预览同时间对照。未使用API/CLI，未发布，本轮连接自然度尚未获用户评价。

## 完整内置提示词

Create a clean animation background from this exact crop. Remove ONLY the pink writing paw and the ENTIRE green pencil, AND remove every brown pencil cast-shadow/straight-edged smear on the cheek behind it. Reconstruct the cheek behind the pencil as uninterrupted fine ivory/orange fur matching its immediate surroundings: absolutely no vertical rectangular stripe, no pale repair patch, no dark pencil-shaped residue. Keep the orange furry forearm from the LEFT intact, with a short softly rounded furry wrist end where the pink paw used to begin; do not erase or shorten the orange arm into a stump or replace it with blank paper. Reconstruct the cream notebook paper and soft natural arm contact shadow underneath the missing pink paw and pencil, with original page geometry unchanged. Preserve mouth/teeth at upper-right, head lower contour, orange arm, notebook edge and green cover, foreground book fragment, all lights and crop boundaries exactly. No new hand or pencil. Single clean crop same aspect ratio and composition.


已导出3.2秒96帧，初始掌心与选定固定区域检查通过；实际查看旧新快速对照、起笔/写完、16个原尺寸动作阶段，核对腕根连接与笔后补底。冻结motion-v39.gif、native-finish-v39.png、character-comparison-v39.png。功能检查不代表用户已认可连接自然度。
