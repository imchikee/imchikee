# v47：中性腕姿与左腮下接合

2026-11-06。用户截图feedback-v46-floppy-wrist.png否定v46“像手瘫了”，补充“下巴和手臂中间像有块东西”，随后纠正为“左腮和手臂”。本轮同时修腕姿和左腮下方，脸型/表情/场景不重画，固定入口在内部检查前仍为v46。

## 动作

v46保持臂长，但前臂与爪子的相对角度反向变化，腕部软折，肘部又下垂。v47把可见前臂、短毛腕、粉爪与笔合成一个刚性层，保留原画主动握笔的相对姿态。以笔尖为目标求肘的位置，前臂/手/笔不再独立折腕。肩关节从误当肩根的左侧外轮廓(350,841)校准到身体内部(400,850)，上臂短且藏在身体后面；可见前臂只小幅转动，保持臂长。原画和纸面投影、八笔代码仍沿用。

内部保留shot-v47-long-upper-check.js长上臂检查稿、shot-v47-upper-visible-check.js露出上臂片检查稿与shot-v47-wide-shoulder-cover-check.js宽肩遮挡检查稿。最终上臂在身体内不单独露出，圆形肘部重叠与可见前臂相接。

## 左腮下方

逐层检查发现两类叠加：补底遮罩没完全覆盖原左腮下边界，固定肩片又把旧前臂上缘恢复到原位。仅动手腕或仅换背景都不够。最终删除旧肩片的绘制，身体内部的上臂片也不露出；继续使用clean42，扩大左腮下接合区遮罩，覆盖新旧边界，而不是挖空身体。左侧支撑连续，可见前臂从同一躯干毛发中衔接，纸页/绿边/前景书保持。

本轮内置试验完整输出clean-roll-edit-v47-check.png（原exec-c87294f9-ba06-45a8-9464-bc595ee7d08f.png），生成了柱状毛团，不合格。曾试着用已有clean43曲线和新输出的躯干局部合成，仍出现空隙/内侧亮边，全部否掉，未接入固定预览；compose-clean-v47.mjs、build-region-v47-bridge-check.mjs、clean-patch-v47.png与相关check脚本均为保留的试验记录，最终build-region.mjs没有导入它们。最终只改已有补底的覆盖范围与层级，不将失败图整幅或局部带入运行时。编辑目标clean-arm-input-v42.png，负参考clean-roll-negative-v47.png。未用API/CLI，无新编号HTML。

检查与最终接入状态在实际导出后续记，不以测试代替用户视觉认可。

## 完整内置提示词

Use case: precise-object-edit. Image 1 is the EDIT TARGET, an exact close crop of a hamster drawing. Image 2 is a NEGATIVE REFERENCE, a failed clean plate that extended the cheek downward into a big flat orange slab resting on the desk; DO NOT copy that shape. Make a clean animation background from IMAGE 1: remove the entire writing foreleg, pink paw and whole green pencil with all remnants and shadows. Crucially preserve the ORIGINAL lower edge of the left CHEEK from image 1; do not grow the cheek downward to fill the removed arm. Under the left cheek keep a compact upright orange torso/shoulder column only at the far LEFT, naturally supporting the head and reaching the desk, without a horizontal roll, cylinder, ledge, extra cheek, second forearm or tucked paw. To the right of this small torso column, the removed arm exposes a narrow area of warm wood desk and the cream notebook paper, rather than another orange mass. The new animated arm will cover much of that space. A soft natural cheek shadow is enough, no extra lump between cheek and future arm. Keep the left torso attached: do NOT hollow out the entire area under the head or make a floating severed head. Preserve nose/mouth fragment, cheek fur above its original lower contour, fine orange/cream fur and golden light, original straight green notebook left edge and paper perspective, desk grain and foreground book. Original framing and aspect ratio. Remove the pencil fully from the cheek and paper; clean paper, no ghost pencil or ink. This is a local animation clean plate, no character redesign.


## 最终接入

最终只使用scene-v38-current.png+clean-patch-v42.png。删除旧肩片和可见上臂片，扩大leftCheekJoin遮罩完整覆盖原左腮下边界；不接入新补底试验。已经完整导出96帧，查看arm-late-v47.png后段原尺寸、length-comparison-v47.png起笔/收笔原尺寸、arm-review-v47.png手部12阶段与whole-animation.png整幅12阶段。腕与前臂方向保持一致，握笔源图不变，左腮下无恢复旧肩片的轮廓。掌心、身体侧固定区域、选定头脸/场景/静止爪与纸页检查通过。检查后才接固定页revision=47，冻结motion-v47.gif/native-finish-v47.png/character-comparison-v47.png；旧新慢放arm-middle-comparison-v47.gif左v46右v47。尚未获用户评价，不写成采用或发布。

固定页最终截图preview.png已实际查看。capture.mjs通过revision=47加载、两幕播放/暂停/跳转及1440/390明暗布局；平均绘制0.1ms。git diff --check通过，第一幕和线上README/assets无改动。
