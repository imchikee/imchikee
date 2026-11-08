# 第二幕：重画头、胸腹、肩部和手臂

2026-11-03。用户先反馈“这就是你干了半天的结果？”，随后明确指出“而且现在手臂也像是从脸上伸出来的”，并要求“那你倒是修啊”。助手确认此前头部一直延伸到桌面、没有清楚胸腹和肩部，却误把脸颊当成身体来修手臂；此前“短腕与身体自然衔接”的判断不成立。这个结构问题不能由局部遮罩和像素检查解决。

## 当前结果

使用内置 imagegen 一次编辑 `scene-v5-interior.png`，生成 `scene-v6-torso.png`。没有使用CLI/API。重建的是完整伏案姿势：头部缩小并上移，下巴停在胸口上方，两侧橙色肩部下接手臂，中间露出浅色胸腹。左侧手臂从身体侧面下垂后弯向笔记本，右侧手臂也从躯干接到压书爪子。头身比例和背景局部有生成重绘差异，不声称只改了手部像素。

实际笔尖约(645,891)，在中央笔记本左页内部；动作仍用同一原画的连续采样，不拼贴手掌或腕片。运动区域为230×224，起点(480,718)，不包含脸部；肩部和大部分上臂保持固定，手腕毛发小幅承接手笔运动。三段共前进6原画像素，段间与末尾抬笔约4像素，未新增头部表演。

`shot.js`、`build-region.mjs`、`region-data.js`、导出/图像检查脚本及独立页均已更新。旧v5原画、源码、数据和输出保留在原位置及 `cheek-arm-rejected/`。完整主页共用同一个动作模块。第一幕未改，未发布。

## 检查范围

实际查看完整原画、正常尺寸画面、四个原尺寸手部帧、12格连续帧，并新增 `body-detail.png` 将下巴、胸口、肩部、肘部和爪子放在一张特写里检查，避免再只盯着腕口。

`inspect-frames.mjs`通过：起始特写与新原画对应区域RGB完全一致；选定的左侧纸页、中央文字行与笔尖下方页边区域在四帧之间RGB完全一致。图像检查不代表自然度或新造型获用户认可；本次新姿势仍待用户评价。

## 完整提示词

Use case: precise-object-edit / anatomical pose reconstruction.
Input image is the EDIT TARGET. The current hamster has a serious structural error: its head fills the whole body area, and the writing arm appears to grow directly out of its CHEEK. Fix the COMPLETE seated upper-body anatomy, not just a wrist detail.

Reblock the character so there is a clearly readable HEAD above a separate plump TORSO behind the notebook. Reduce head width about 20% and lift the chin substantially: head/cheeks end around y710 rather than y820 in this original 1316x1195 canvas. Keep the cap near the current upper area and keep the same cute hamster identity, black eyes, tiny muzzle, round ears, green cap and determined studying expression. Below the chin, show an obvious ivory CHEST between two rounded orange SHOULDERS, with a gentle chin-over-chest occlusion shadow. The chest should visibly occupy about y710-835. No long human neck.

Both arms MUST originate from the SIDES OF THIS TORSO BELOW THE JAW, never from cheek fur. Viewer-left shoulder around (465,755), short upper arm down to tucked elbow around (490,810), forearm bends inward to the small pink gripping paw around (610,835). Show a coherent shoulder-to-elbow-to-wrist contour. Keep arm small, rounded, furry and hamster-like, no long human forearm or straight sausage tube. A single green pencil held naturally, point around (700,885) well INSIDE the central notebook left page. Viewer-right arm should likewise descend from its torso shoulder to the resting right paw on that same notebook. Hands rest low on the desk, visibly separated vertically from the face.

Preserve the room, LEFT lamp and warm light, foreground diagonal books, central notebook, RIGHT mug and book stack, plant, original painted fur style and title 'DAYS 11 - 21' / 'More C++.' Preserve page outlines as closely as possible. This authorized anatomical reconstruction needs a visibly smaller/higher head and a visible torso; do not simply keep the original giant head and add another paw. No clothing, no extra limbs, no extra props, no diagram. One full-frame illustration same dimensions/aspect.

