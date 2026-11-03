# 视觉基准提案：保留绘本式手绘，细化毛发

依据用户最新纠正，基准是`../index.html`现有手绘稿。用户认可整体观感，但毛发偏粗；动画时曾出现比例变化、接缝和握持问题。头像只用于理解可爱比例，不作为改成简笔平涂的授权。当前整页仍保留，未用本页样稿替换。

## 本轮具体结果

**2026-11-02状态更新：** 细修原场景已获“这一版会好很多”，重画俯仰姿态后的短动作获“这版还可以”，毛发仍未最终确认。用户继续后已仅细化两张动作原画的毛发，并接回[动作试段](../reading-motion/index.html)；[同姿态前后对照](../reading-motion/redrawn/fur-check.html)与[提示词](../reading-motion/redrawn/FUR-PROMPTS.md)保存。耳缘/上颊粗线减弱，额头仍有细密纹理；角色表仍非可爱感母版。

**后续反馈更新：** 用户认为角色表不如原手绘稿可爱，询问胡须是否为仓鼠特征。角色表不再被当作已解决可爱感的母版；它只能辅助核对身份。表情、姿态及腮帮表现继续参照原场景，不能把角色统一成规整站姿。现以[原场景细修对照](scene-check.html)验证：保留开心抱书、探身和帽子角度，只细化毛发与胡须。此新图也仍待评价，不是动画完成结果。

`character-sheet.png`为内置imagegen生成的同一角色正面、四分之三侧面、侧面及专注/疑惑/惊讶表情。第一稿仍有粗密毛发，随后仅编辑质感，减少深色短线与尖硬外沿。保留橙白色、绿色帽子、柔和体积及纸面手绘感。

这是供校对的角色母版草案，尚未获用户采用；不是可动骨架，也不能仅凭一张图保证逐帧一致。视角变化和表情中的具体比例仍需在短动作里检验。

| 项目 | 保留 | 约束与修订 |
|---|---|---|
| 角色 | 鼓腮、小圆耳、短口鼻、粉鼻、橙白色与绿帽 | 身体收在腮帮下方；避免另造大肚子、猫脸或写实人形腿脚。 |
| 轮廓 | 手绘的不规则与柔软体积 | 外沿以连续圆曲线为主，只留少量极短软毛；不用一圈锯齿。 |
| 毛发 | 毛绒感与浅层笔触 | 减少粗密短线，以细、低对比笔触和色面过渡交代，不能用模糊整幅画来遮掩。 |
| 上色 | 橙、奶白、暖棕、暗绿、粉色 | 保留柔和明暗与纸面质感；不转粗线平涂，也不变塑料高光或3D毛发。 |
| 表情 | 原稿五官与帽子关系 | 主要改变眉眼和嘴；不能每个表情换头骨、腮帮大小、眼距或物种。 |
| 道具与场景 | 已有书房、书本、实验室、药瓶、时间门的绘本质感 | 与角色采用相同光向、线条轻重和材质表现；不把角色贴进另一套图形风格。 |

## 动画制作与一致性检验

1. 从此基准中选定同一完整姿态作为短镜头初始帧。固定镜头、背景和道具尺度；完整轮廓及接触关系要在姿态中画清楚，不再直接拼旧部件。
2. 先制作约2—3秒的一个动作，控制变量为抬手/握瓶/靠近嘴部。对照头部大小、眼距、腮帮、帽沿、身体重心和脚底位置；变化应来自动作本身。
3. 使用足够的连续中间姿态；不以整图平移、透明叠化或静态故事格轮播代替动作。背景保持固定，不跟着角色每帧重新生成。
4. 把初始、关键、中间与结束姿态并排检查，再看实际尺寸播放。检查脸型漂移、四肢接缝、瓶口/手掌接触、脚底滑动及画风变化。
5. 短动作达到视觉要求后再扩展故事。当前没有声称完整九段动画完成、逐帧一致已被验证或已获发布授权。

## 生成记录

使用内置imagegen，两次请求：先生成同风格角色表，再对粗密毛发做一次定向修订。没有CLI/API生图。原输出保留，选择第二张复制入工作区。

### 角色表提示词

```text
Use case: illustration-story. Asset: ONE coherent character model sheet for the existing illustrated C++ comic, not a new style.
Image 1 is the APPROVED overall visual baseline: preserve the orange-and-cream HAMSTER protagonist, green-and-cream cap, expressive but restrained dark eyes, pink nose, round ears, large low cheek pouches, warm illustrated storybook rendering and softly painted light/shadow.
Image 2 is the corrected hamster species/face reference: preserve the round cheek pouches and short rodent muzzle rather than a cat face.
Make a landscape model sheet on pale ivory paper with exactly 2 rows and 3 columns, ample space and no panel borders.
TOP ROW: the SAME YOUNG protagonist at a consistent full-body scale in FRONT view, THREE-QUARTER view facing right, and SIDE view facing right. Simple small captions "Front", "Three-quarter", "Side".
BOTTOM ROW: three matching head-and-upper-chest expressions of that same protagonist, "Focused", "Puzzled", "Surprised". Preserve the SAME skull, cheek volume, eye placement, nose, ears and cap across expressions, changing only acting. The side view must clearly remain the same short-muzzled round hamster, not a long-snouted mouse, cat or bear.
The body's lower half is smaller and tapers below the broad cheeks. Avoid a huge pear-shaped belly as wide as the cheeks. Short, small naturally attached limbs, little paws, tiny feet forward on the same ground plane; no human anatomy, pigeon toes or conspicuous toe detail. Draw each whole pose together, no detached pieces or seams. No props, backpack, portal, lab or scene.
ONE controlled improvement to the rendering: retain the approved hand-painted storybook style and dimensional soft color, but make fur FINE and SOFT. Replace dense thick scratch marks with very sparse fine low-contrast strokes and broad soft painted fur masses. Use delicate brown edge accents, a mostly round continuous silhouette with only a few tiny soft wisps. NO coarse sawtooth fur outline, repetitive pointed tufts, dense pencil hatching, heavy marker outline, 3D glossy fur, hyperreal hairs or plastic shading. Do NOT convert to flat avatar-style line art or a white blob mascot.
A small row of five unlabelled swatches at the bottom: muted orange, cream, warm brown, muted green, pink. No dense explanatory text or extra characters.
This is a character consistency reference for later actual action animation. It must look like it belongs in the supplied comic, not like a different mascot.
```

### 质感修订提示词

```text
Use case: precise-object-edit. Edit the attached six-view character model sheet. Preserve all six drawings' exact poses, proportions, expressions, eye/nose placement, cheek volumes, caps, colors, layout, labels and swatches.
The unresolved defect is coarse fur. Repaint ONLY the fur treatment and fur silhouette:
Remove almost all repetitive dark short hair strokes, white scratch hatching and pointed fur tufts. Treat the coat as soft, matte, gently blended watercolor shapes with a faint paper surface, not as individually drawn hairs. Use soft orange-to-cream shading to retain hand-painted storybook volume. Interior hair marks should be at least 80% fewer and much finer/lower-contrast than now.
Replace jagged cheek, ear and torso edges with gently curved continuous edges, interrupted by only 2–3 extremely small soft wisps per cheek. Eliminate the long dark spikes around the cheek sides, shoulders and ears. Do not turn this into glossy 3D, airbrushed plastic, flat vector art, thick marker line art, avatar doodles or a different mascot.
It must retain the existing warm illustrated comic style, color and form, simply with a noticeably softer, finer coat. Drawings remain on pale ivory paper. This is a localized texture refinement, not a redesign or new set of poses.
```
