# 第二幕：腮帮形体、温和五官与手腕支撑

2026-11-05，内部修订 v26。固定预览为 [index.html](index.html)，完整主页为 [../index.html](../index.html)。用户要求继续修订第二幕，第一幕阶段确认；本轮结果未获用户视觉确认。

## 用户纠正与采用范围

v25 静态曾获“也挺可爱的”评价，但用户指出下半脸扁平显宽。下垂腮帮试验被否定“像老太太”，已撤回。眼睛高度的粗测不能证明完整下半脸等宽，不能据此否定用户观察。继续时需处理下缘横向白带和腕根浅色补底，保留第二幕自己的环境。

本轮先生成收拢下缘、保持上部腮帮和短前肢的完整原画。用户随后指出“眼睛有点像狐狸了，为什么不如第一幕那样温暖”，又补充“包括嘴巴和第一幕好像也有点差别”。因此完整原画中的上挑眼角和较尖、张开的笑容不作为最后五官。以第一幕眼口裁图作参考，再局部编辑为较圆眼形、柔和眼周和较小的微笑。没有把第一幕房间复制进第二幕。

## 保存的输入与原始输出

| 用途 | 输入 | 保存的内置输出 |
| --- | --- | --- |
| 腮帮和写字姿态 | scene-v25-master.png；第一幕 ../reading-motion/lighting/down-v2.png 仅作角色参考 | [scene-v26-master.png](scene-v26-master.png) |
| 去除手笔、准备局部补底 | scene-v26-master.png | [clean-scene-v26.png](clean-scene-v26.png) |
| 温和眼口 | [expression-input-v26.png](expression-input-v26.png)，340×205+(480,610)；[expression-reference-v26.png](expression-reference-v26.png)，第一幕310×165+(530,585) | [expression-edit-v26.png](expression-edit-v26.png) |

原始内置生成文件分别为 exec-d2d007a7-e641-4962-8403-802daf69cfac.png、exec-c8f94a41-0eb1-411f-9bba-44ab1184f06a.png、exec-41594e5a-2302-48e2-9eea-07136f52c272.png，均完整复制到以上本地PNG。三次均为内置工具；没有切换API或CLI。

[compose-expression.mjs](compose-expression.mjs)仅通过三个软椭圆接入双眼与口鼻，得到 [scene-v26-current.png](scene-v26-current.png)。头部轮廓、腮帮下缘、帽耳、手笔和房间来自本轮master。去手图只用于260×240+(395,770)的局部软蒙版，环境保持master。旧v25源码和当前输出另存于 [v25-before-form-repair/](v25-before-form-repair/)，历史图和提示词不删除。

## 动作实现

[shot.js](shot.js)沿用左右纸页各自的四角投影；静态声明、右页清单、动态 `++i;` 与接触笔尖共用各自纸面坐标，字迹朝仓鼠。短毛腕与粉爪/铅笔分别作刚性关节运动。腕根原有橙毛恢复为固定支撑，抬笔主要转动握笔角度，减少整只粉爪上浮。新增纸面接触阴影只覆盖左页，不移动脸颊或纸页。

这是从一张原画分层的3.2秒写字动作，头脸保持静态；不能称为96张独立头部原画或新的低头表演。画面自然度与两幕角色一致性由视觉判断，不以像素检查代替。

重建：`node research/github-profile/drafts/21-days/writing-motion/render.mjs`。快速检查：加 `--preview --layers`。固定输出包括 [motion.gif](motion.gif)、[native-finish.png](native-finish.png)、[character-comparison.png](character-comparison.png)、[face-phases-current-1.png](face-phases-current-1.png)、[face-phases-current-2.png](face-phases-current-2.png)、[writer-view.png](writer-view.png)。

## 本轮实际核对

已查看正常预览、两幕对照、16个原尺寸面部/手腕阶段、12个整幅连续帧和翻转作者视角。选定固定区域像素检查通过，纸页声明、页缘与线圈在关键帧固定。完整主页两幕切换、播放/暂停/重播/拖动、结束停止、减少动态和1440/390像素深浅布局检查通过；实际固定预览使用revision=26，并已截图查看。第一幕和线上README/assets没有差异。

内部冻结保存 [motion-v26.gif](motion-v26.gif)、[native-finish-v26.png](native-finish-v26.png)、[character-comparison-v26.png](character-comparison-v26.png)、[preview-v26.png](preview-v26.png)。没有创建新的编号HTML入口。以上为实现和助手视觉检查记录，不代表用户已认可角色造型。

## 完整内置提示词：腮帮和姿态

Edit IMAGE 1, this chapter-2 writing scene. IMAGE 2 is only the same hamster's APPROVED youthful facial form/style reference, not a room or pose to copy. Preserve image 1's sharp LEFT-lamp room, RIGHT C++ mug/books, shelves/chart/plant, reference books, central blank spiral notebook and exact heading/framing. Keep its cute round dark brown eyes, pink nose, small smile/two teeth, ears/cap and soft fine storybook fur.
Correct the actual cheek SHAPE, not just the lighting. Currently the lower face is a wide flat ivory shelf. Keep the high cheek pouches full, with their fullest rounded volume at whisker height; gently taper their lower sides inward toward a SMALL short chin. Lift the broad lower-face edge a little so it forms one youthful gently curved lower face, with a little low orange body visible beneath. Do NOT add hanging cheek balls, three-lobed jowls, a central beard, crease lines, an extra chin or white chest bib. Do NOT squeeze/scale the whole head or flatten its height. Preserve the current eye/nose/mouth positions and expression; only the eye gaze shifts subtly DOWN-LEFT toward the writing tip, with dark irises retained and no exposed white crescents/heavy eyelids.
Correct the writing paw support in the same drawing: tiny rounded paw rests naturally at the notebook upper-left edge, short furry wrist continuous with the low orange body, elbow tucked and supported. One short green pencil gripped near the tip touches inside LEFT page around (584,915). No floating hand, pale patch under wrist, long human arm/shoulder, extra fur lump or lifted rump. Keep the resting right paw and notebook geometry in place. Match the original LEFT lamp's warm light and soft reflected fill, keep fur/room clear without blur or added noise. Same full 1316x1195 frame.

## 完整内置提示词：局部补底源图

Make a precise animation clean plate from this EXACT scene. Remove ONLY the active pink writing paw on viewer LEFT and the ENTIRE green pencil it grips. KEEP the existing ORANGE FOREARM/body in its original position, ending naturally behind the missing pink paw. Do not remove/rebuild the whole orange limb or lift the notebook edge up over it. Above the original notebook upper edge restore the same orange fur; below that existing edge restore blank cream paper. The original notebook edge, paper texture, spiral, shadows and green cover must remain aligned. No pale wedge or bright paper patch under the wrist, no separate fur stump, no new limb. Keep the resting right paw. Preserve this exact new tapered youthful cheek outline, short chin, eyes/gaze, nose, smile, ears/cap, fine fur and left-lamp illumination. Keep the room and ALL props crisp and unchanged. Same full 1316x1195 image. This is a background plate, not a new pose or character.

## 完整内置提示词：温和眼口

IMAGE 1 is the exact EDIT TARGET face crop. IMAGE 2 is the approved same hamster's warm, gentle eye/nose/mouth reference. Correct only image 1's facial expression to match image 2's character warmth. Keep image 1 crop alignment, feature center positions, head angle, cheek shape, fur, whiskers and light direction. Make both eyes softly rounded like image 2, with smooth curved lids, warm chocolate/amber irises, large gentle pupils and soft small reflections. Remove the pointed upward outer-corner flicks and heavy black eyelash strokes that make image 1 look foxlike. No narrow slanted eyes, raised eyebrows, large white crescents or cold glassy stare. Match the reference's petite rounded pink nose and SMALL quiet friendly smile with two tiny front teeth: soften the mouth corners, reduce the open dark mouth cavity and the sharp wide grin, keep the muzzle round and youthful. No pursed old-person lips, jowls, extra chin or exaggerated smile. Do not copy the reference book or rearrange facial features. Same face crop/framing as image 1. The edit should look like the first scene's same gentle hamster, in the second scene's current head pose.

