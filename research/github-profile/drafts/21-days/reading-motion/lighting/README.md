# 第一幕统一台灯光影 · 2026-11-03

## 惊叹线拆层与时序

用户截图指出右侧最上方惊叹线叠出细线，并询问是否一直显示。此前三张原画均带标记，固定前景又恢复一份，位置略异会导致重复残边。现在用内置imagegen一次移除正面原画的三条标记，保存`clean-accents-v1.png`；仅以三个局部羽化遮罩提取干净墙面，不替换整幅生成图。`config.js`在三姿态参与插值前清除标记，另从固定正面原画提取相同三块作为独立层，在最终绘制后叠加，因此不参与头部网格变形。

时序：0—2.35秒隐藏，2.35—2.6秒淡入，2.6—3.0秒显示，3.0—3.2秒淡出。跟随统一时间，暂停/拖动亦同步；结尾隐藏，首尾保持一致。`motion.js`仅增加可选图层加载/绘制钩子，原姿态和节奏未改。低头、显示及结束实际截图均核对，无原先重复细线；旧GIF存为`before-accents.gif`。

### 清除标记的完整提示词

Precise object removal: erase ONLY the three orange comic surprise/attention marks floating in the empty lit wall to the RIGHT of the hamster's head and BELOW/LEFT of the desk lamp. Fill their former pixels with the same uninterrupted golden wall/light gradient. Keep absolutely everything else unchanged: hamster face, whiskers, fur, cap, book, room, lamp, lettering, frame and colors. No new marks, no blur, no other retouching. Output one full image same dimensions/framing. This is a clean background plate for animation.

## 光影接入记录

用户认可`style-match/down-light-v2.png`，同意毛发不再大改，并授权把光影统一到全部姿态、接回动画。

- `down-v2.png`复制已获阶段正反馈的低头光影图。
- `front-v1.png`、`mid-v1.png`分别用内置imagegen各编辑一次：第一输入为对应原姿态，第二输入为低头光影参考。保留姿态和表情，统一右上台灯与左侧暖色反光。
- `config.js`接在原`contour-data.js`之后，切换三张原画。旧轮廓补片带有未调光的背景，直接拼接会产生耳旁亮圈，已在本光影分支停用；使用这三张完整光影原画自身的毛发轮廓。**没有额外粗化/抹平毛发，但不能称像素级保留此前全部轮廓补片。** 旧图与补片未删除。
- 原`motion.js`的节奏、对应点、前景恢复、网格叠化未改。场景以正面原画作固定底图和前景，头部遮罩中的背景仍来自姿态原画；不能声称所有背景像素都完全不动。过渡帽檐双边/纹理融合仍存在，本轮未重开修补。
- `../before-lighting.html`保留光影前动作；`../index.html`、完整主页和`../motion.gif`已更新。`check-*.png`为本轮实际画面。

验证：实际查看抬头/过渡/低头；旧补片亮圈已去掉。主页首幕实际变化、暂停像素保持、章节切换、播放/重播/拖动/结束与减少动态通过，1440/390宽度深浅主题通过。GIF导出96帧/3.2秒，已有低头两区域与对应原画比较通过。检查不能替代用户对光影连贯和造型的评价；未发布，后八幕仍为分镜。

## front/mid 共用提示词

Image 1 is the EDIT TARGET, image 2 is the APPROVED LIGHTING REFERENCE for the same scene in a different head pose. Transfer ONLY the reference's cohesive warm lamp illumination to image 1. Preserve image 1's exact hamster pose, expression, eyes/nose/mouth/teeth, cap shape, head and ear positions, paws, book geometry, scene framing and all text. Do NOT copy the reference's lowered head or closed smile. Keep the fine soft fur: NO coarse strokes, NO blur, NO additional texture. Match reference exposure and colors: upper-right desk lamp gives gentle pale golden light on right ear/temple/cheek, right-facing cap surfaces, right paw and right page edges; left side retains warm ochre/apricot bounce fill and luminous ivory cheeks, never gray-brown or muddy. Soft localized cap-brim shadow. Match the room, tabletop and book illumination to reference too, but keep all object geometry fixed. No exaggerated contrast or saturated orange filter. Exact text DAYS 1 - 10 / The basics. / C++. Produce a single full scene the same aspect ratio as image 1.

正面附加：CRITICAL: preserve image 1's happy open mouth and tongue, upward-facing original pose.

中间附加：CRITICAL: preserve image 1's intermediate-pitch head angle and medium-open smiling mouth.
