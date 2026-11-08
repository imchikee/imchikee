# 第二幕：撤回人形躯干，改为低头伏案的仓鼠体态

2026-11-03，用户评价上一版：“这跟人似的，已经不像仓鼠了”。上一版为纠正手臂从脸颊伸出而增加宽肩、直立胸膛和明显长臂，矫枉过正；该版不采用，不能把结构检查通过写成角色造型获认可。

## 当前原画与动作

内置imagegen一次编辑，以原第二幕 `scene-v2.png` 为场景编辑目标，以第一幕已阶段确认的 `reading-motion/lighting/down-v2.png` 为仓鼠形象/细软毛发参考，生成 `scene-v7-hamster.png`。没有使用CLI/API，没有改动第一幕文件。

新姿势为圆团/梨形的低伏仓鼠，露出左侧圆背，头部略转向纸页并低下；前肢藏在身体毛里，只露短腕和小前爪。撤回人形宽肩、直立胸膛和长手臂。头、身体与前爪通过整体俯身姿势衔接。新图有生成重绘差异，不声称场景其他部分与旧原画逐像素一致。

实际笔尖约(615,870)，落在中央笔记本左页内。动作继续使用同一原画的连续局部采样，不拼贴去手底图或腕片；区域仍为230×224、起点(480,718)，以新笔杆/前爪轮廓调整权重，三段共前进6原画像素、段间与末尾抬笔约4像素。

原画、`shot.js`、像素样本、导出/检查和独立预览均已更新；完整主页共用同一模块。上一版源码、像素数据、GIF和画面保存在 `human-torso-rejected/`，原画 `scene-v6-torso.png` 与其提示词继续保留。

实际查看正常尺寸整幅、原尺寸前爪特写、12格连续帧。起始特写与新原画RGB完全一致；三个选定纸页/文字/页边区域四帧之间RGB完全一致。新角色与动作仍未获用户确认，检查不代替审美评价。第一幕未改，未发布。

## 完整提示词

Use case: illustration-story / identity-preserving pose correction.
Input 1 is the chapter-2 EDIT TARGET for the desk layout, green cap, LEFT lamp, notebook, mug and title. Input 2 is the approved chapter-1 REFERENCE for the HAMSTER identity, fine soft fur and compact animal proportions only.

Redraw the hamster as a visibly NON-HUMAN hamster studying and writing. Preserve the same adorable round cheeks, round little ears, small muzzle, black eyes, tiny pink paws and green cap as the reference. It must have a single plump pear/egg-shaped furry body in a low hunched crouch, rounded back and little forelimbs tucked underneath. NO upright human torso, NO broad shoulders, NO narrow neck, NO separate muscular/bare chest, NO long exposed arms, NO human fists. Avoid a teddy bear or a person wearing a hamster head.

Use a gentle THREE-QUARTER downward studying pose: head slightly turned toward the notebook on viewer right and tilted down to look at the page; rounded cheek/jaw overlaps the little body with a small natural fur crease. Show the rounded back/haunch on viewer left. The body is mostly behind the desk; the two TINY forepaws emerge from under the lower chest BELOW the jaw, where a real hamster's front legs attach. Expose only short furry wrist-to-paw transitions, about 30-45 original pixels, with elbow/upper forelimb hidden in body fur. This must not read as a paw growing out of the cheek. Do not solve it by adding human shoulders or a wide chest between arms.

The viewer-left tiny paw near (610,835) grips ONE slim green pencil whose SINGLE tip touches well INSIDE the central notebook left page near (690,880), separated from the foreground diagonal book edge. The other little paw rests on that same notebook. Paws smaller than reference human-like mittens; fine small rounded digits, not thick clenched fists. Keep gesture compact and clearly connected below the head.

Keep input1's entire desk/room arrangement, LEFT warm lamp lighting, central notebook and foreground books, right C++ mug, right stack, plant, soft painterly texture. Heading exactly 'DAYS 11 - 21' / 'More C++.' Do not copy input2's reading book or right lamp. One full frame, same size/aspect as input1.

