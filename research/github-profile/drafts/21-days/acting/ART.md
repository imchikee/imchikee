# 连续角色动作试段

用户指出上一稿只是图片轮播。先前九帧GIF确为静态分镜切换，不应作为角色动作交付。这里重新制作喝药、恢复年轻、迈步进入时间门的11秒动作试段；完整九段连续动画仍未完成。

使用内置imagegen，根据修订后的中老年仓鼠参考生成透明部件图`hamster-parts.png`，头、躯干、四肢、药瓶与时间门分别引用。原PNG保持不变，代码读取alpha边界并以SVG裁剪、旋转、位移及遮挡组合动作；没有把整张画面平移代替走路。中老年/年轻头部过渡，手臂和瓶口靠近嘴部，双腿交替迈步，门框遮挡角色进入。当前仍是局部动作试段，未接入正式主页或发布。

查看`index.html`可暂停、重播及拖动，`motion.gif`为同一动作的12fps导出。`build.py`重建页面，`node render.mjs`查看关键帧及手机布局，`node render.mjs --gif`导出GIF。使用已有Python/Pillow、Chrome、Node及FFmpeg，无新依赖。

内置工具提示词：

```text
Use case: illustration-story. Asset type: transparent articulated character sprite atlas for an actual 2D animation, NOT comic panels and NOT a sequence of complete poses.
Reference image is character identity and colored-pencil rendering only. Keep the clearly recognizable round orange/cream HAMSTER with huge low cheek pouches, small round ears, tiny pink nose, short blunt muzzle, two incisors, green-and-cream cap. Preserve this hamster identity.
Create ONE square transparent PNG atlas arranged in exactly 3 equal columns and 3 equal rows, with large fully transparent gutters, no labels, no grid lines, no cast shadows, no background. Each cell holds ONE isolated animation component, complete and uncut:
row1 col1: pear-shaped orange/cream TORSO ONLY from neck to hips, no head, no ears, no arms, no paws, no legs, no clothes. A small rounded neck overlap area at top, creamy belly.
row1 col2: elderly hamster HEAD ONLY including cap, round spectacles, gray-brown flecks and huge round cream cheek pouches; no body, no neck, no paws. Gentle focused expression, mouth slightly open to drink.
row1 col3: youthful version of exactly the same HEAD ONLY, same outline, cap size and viewpoint; orange fur, no spectacles, bright eyes, small visible incisors. No body.
row2 col1: isolated LEFT ARM AND PAW, orange upper arm and cream paw, bent slightly, closed grip, no object, broad rounded shoulder overlap at upper end, paw lower end. One limb only.
row2 col2: isolated RIGHT ARM AND PAW, mirror counterpart, broad rounded shoulder overlap at upper end, paw lower end. One limb only.
row2 col3: isolated LEFT LOWER LEG AND PINK FOOT, small orange haunch, rounded overlap at top and cute flat pink toes at bottom. No body.
row3 col1: isolated RIGHT LOWER LEG AND PINK FOOT, mirror counterpart, same scale. No body.
row3 col2: small glass youth-potion flask with short narrow neck and glowing pale-blue liquid, no hand.
row3 col3: complete freestanding homemade TIME PORTAL, rounded wooden/bronze arch with softly glowing blue interior, simple mechanical details, floor base; front view, no hamster, no labels or numbers.
All character parts share the same near-front three-quarter view, looking slightly to the right. Limbs must have clean overlapping shoulder/hip ends for rotation in code. Heads have consistent registration and size. Warm textured colored pencil and watercolor, same illustrated character as reference. Fully transparent alpha outside parts. No assembled hamsters, no scenes, no books, no captions. This is a production cutout sheet, not a diagram.
```
