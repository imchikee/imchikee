# 第二幕：固定预览入口、纸页透视、短腕书写与清晰背景

2026-11-05。唯一用户检查入口为[index.html](index.html)，后续直接更新同页。用户明确不愿每轮重新打开`preview-vXX.html`，本轮没有再新增编号HTML。`node render.mjs --preview`可先出两张快速检查图，完整96帧导出随后做；`--preview --layers`可分看手笔/毛腕/补底，避免把整段导出作为首次看到错误的时机。

## 用户反馈与实际状态

1. v24被明确指出：文字方向与笔记本不一致；角色不好看、手臂动作古怪；房间比第一幕模糊。旧源码、数据与画面在`page-angle-character-arm-rejected/`。
2. 本轮首张静态`scene-v25-master.png`用第二幕原场景为目标、第一幕已确认图仅作角色/画风参考。保留本幕左灯、右C++杯/书堆、参考书、中央笔记本；恢复书架/挂图等细节，缩短铅笔、收拢粉爪。43.8秒返回后先更新固定页让用户看静态，未等完整动画才展示。
3. 用户评价“虽然现在这版也挺可爱的”，同时认为仍与第一幕有差别，进一步指出是“扁平的胖，而不是仓鼠那种鼓鼓的腮帮子”。这仅是当前静态可爱感的局部正反馈，不代表整体造型或动作获认可。
4. `cheek-volume-edit-v25.png`及`compose-cheeks.mjs`试图修腮帮体积，得到`scene-v25-cheek-volume.png`。用户评价“现在又像老太太的脸了”，此修改立即撤回，运行时回到`scene-v25-master.png`。原画、编辑图、合成脚本和反馈保留，不再自动运行该脚本，不把下垂凸起当作年轻仓鼠鼓腮。
5. 用户要求检查横向脸宽。`face-width-check.png`上第一幕/下第二幕，原图均1316×1195，仅按眼睛高度平移对齐；共同可见的眼睛高度外沿均粗略约710像素（含短毛，人工读图约±10像素）。**这不是完整腮帮最宽处的测量**，第一幕下半脸被书遮住，不能据此断言整体脸型同宽，更不能否定用户指出的下半脸显宽/显扁。助手曾把这个结果说成“整颗头没有更宽”，已明确修正范围。脸颊体积与两幕风格一致性仍在讨论，不得写成已解决或用户已确认。

## 当前实现

### 文字投到各自纸页

`shot.js`不再用只旋转180度的整幅SVG文字层。左右页分别定义四角投影，作者坐标从相机近侧右角开始，文字朝仓鼠。字形用SVG路径采样后按同一页的投影映射，静态`int i=0;`、右页C++/清单和逐笔`++i;`都跟随页边倾斜、透视压缩和页内位置。笔尖位置也直接取同一投影的字形轨迹。

左页作者四角：[(759,1000),(467,1017),(428,900),(682,877)]；右页：[(1016,969),(772,999),(698,878),(918,875)]。页面逻辑尺寸240×140，书写字形尺度0.9，原笔尖(584,915)。8个接触笔画保留0.30–2.62秒，段间抬笔，最后抬起5像素并停住。实际作者视角在`writer-view.png`。

### 短腕关节运动

停用v24通过压缩橙色毛腕像素推进整只手的算法。当前把小段毛腕和粉爪/整支铅笔作为两个刚性层，源肘点(459,884)、腕点(490,874)、笔尖(584,915)。由纸面轨迹解肘—腕—笔尖两段长度，肘在藏于身体的区域沿桌面小幅滑动，手腕自然转动。纸页不参与变形，铅笔不拉伸。实际层边界曾漏掉一小段笔杆，已补成连续的整支铅笔遮罩，并逐阶段查看。初始粉爪内部与静态原画相同。

### 背景保持清晰

完整底图始终直接使用`scene-v25-master.png`。首次小裁图生成的补底有纸色/几何接缝，保留`hand-clean-edit-v25.png`但不使用；另以内置工具生成`clean-scene-v25.png`，只裁(395,760)260×205手部范围，通过局部软蒙版补被遮挡的身体和纸面。其他房间/书架/挂图像素直接沿用master，不用去手生成图替换整个房间。曾试过的矩形页边保护造成直角色块，已删去。没有把全图锐化当作清晰度修复。

`build-region.mjs`现在仅准备这个局部补底PNG，运行时使用原生Canvas遮罩与刚性图层，不再加载旧`region-data.js`的像素变形数据。旧数据保留为历史，不删除研究素材。

## 导出与核对

当前导出仍为3.2秒96帧。已实际看快速关键帧、独立手笔/毛腕/补底、16个原尺寸阶段、12个整幅连续帧和作者阅读方向。起始粉爪内部与master一致；选定头帽耳、固定五官、左灯、杯子、参考书、装订和静止粉爪区域保留master像素；既有声明、页边和装订在关键帧不动。测试只证明这些事项，不代表角色美感/自然度/体积获用户认可。

固定页中的测量对照可展开查看，不需要用户打开新的编号页。第一幕、根目录线上README/assets不改，工作分支`work/profile-development`，未发布。

## 内置输出对应

全部只用内置imagegen，未调用CLI/API或密钥。

- `exec-c4e1a498-005a-430e-9300-d0bff7609aec.png` → `scene-v25-master.png`。
- `exec-4561f3c0-0bf6-4c6c-a92a-7ff7adb998ee.png` → `hand-clean-edit-v25.png`（局部补底接缝试验，不用）。
- `exec-ac946ef8-21ad-4914-ad68-5c9535f61111.png` → `cheek-volume-edit-v25.png`（显老试稿，已撤回）。
- `exec-67b918b8-587d-46c9-aecc-40bf08054a50.png` → `clean-scene-v25.png`（只取手部补底）。

原始输出在`/home/chikee/.codex/generated_images/01a1a0b1-a246-71a1-942c-a64976c7822a/`，工作区已保存所有相关原始图和输入裁图。

## 完整提示词

### 当前静态候选：第二幕环境＋第一幕角色参考

Edit IMAGE 1, the chapter-2 room. IMAGE 2 is ONLY the approved hamster identity/rendering reference; never copy its room or reading pose. Keep image 1's LEFT desk lamp, RIGHT C++ mug/book stacks, foreground open reference books, plant/shelves/wall diagrams, central spiral notebook, framing and exact heading. Restore clear hand-painted room detail: bookshelf/book spines, wall charts, wood and plants should be as legible as image 2, no lens blur, defocus, smeared texture, extra sharpening halo or dense noise.
Make the hamster as lovable as image 2: same rounded full cheek pouches and ears, gentle open dark brown eyes with small bright reflections, tiny pink nose and small smile/two teeth, low green cap, soft fine orange/ivory painted fur and warm light. Preserve those face proportions; avoid image-1-to-new tall forehead, flattened muzzle, heavy sleepy eyelids/lashes, white sclera crescents, angry brows, sharp fur spikes or glossy 3D plush look. Head only gently tips down toward the notebook, not squashed.
Draw a coherent relaxed writing pose: compact seated animal body mostly behind the notebook, a little orange body visible beneath the rounded chin so the face stays above the paper. A TINY rounded writing paw close to the body grips a SHORT green pencil near its tip. Show just a short furry wrist from the low body BELOW the cheek, elbow tucked and supported near the notebook edge, no stretched forearm, human shoulder/chest, giant belly or raised rump. Pencil tip comfortably inside the central LEFT page (approximately x590,y935), other little paw steadies the right page near the spiral. Both notebook pages blank cream paper, same edges/rings/perspective. Use the LEFT lamp's cohesive warm light across hamster and room. Single full illustration, same 1316x1195 framing, no collage or inset.

### 局部去手补底（接缝明显，未采用）

Animation background repair on this exact crop. Remove ONLY the pink writing paw, the entire green pencil including cap and tip, and the small orange wrist immediately behind that paw. Fill their former area with matching low orange body fur and blank cream notebook paper. Keep the original white cheek's rounded lower contour, fur colors, light direction, notebook upper edge/green cover and paper geometry exactly aligned. Keep a smooth low body, no separate arm stump or new bump. Do not repaint the whole crop, move the cheek/page boundary, blur, change texture or add anything. Same crop framing and aspect ratio. This is a technical clean patch, not a new character pose.

### 腮帮体积编辑（用户否定显老，已撤回）

Edit this exact cropped hamster head. Preserve the current adorable eye shapes/positions/reflection highlights, tiny pink nose, little smile/teeth, round ears, cap, head height/pose and fine soft storybook rendering. The flaw is the broad FLAT ivory face band: it looks laterally padded, not like rounded hamster cheek pouches. Model the LEFT and RIGHT cheek pouches as TWO rounded volumes gently projecting FORWARD from the face. Give each a softly convex lower arc and a subtle rounded side-to-front light gradient. The little central muzzle should read separately between the full cheeks, without enlarging it. Reduce the sideways spread of the flat lower cheek areas a little while retaining plush cheek fullness and the same overall head size; do not squeeze, narrow or scale the whole head. Maintain the viewer-LEFT lamp direction: warm luminous left cheek and soft peach/ochre reflected shadow on the away-facing cheek sides/undersides, never gray or muddy. Keep ivory highlights open and soft, not a heavy dark line. A small shadow where the rounded cheeks overlap the low orange body should distinguish head from forelimbs; no straight horizontal lower-face shelf, no tall white bib. Do not add huge balloon cheeks, human chin, jowls, extra furry lumps, sharp hair, new texture, eye white, heavy lids or 3D plastic shine. Keep the pencil, small paw, body, background and exact crop alignment unchanged. Only cheek form and its restrained light/shadow are corrected.

### 完整上下文去手底图（只裁取手部局部补底）

Precise animation clean plate from this EXACT illustration. Remove only the writing pink paw on viewer LEFT and the ENTIRE short green pencil it grips. Merge only the small exposed orange wrist into the existing low body, no detached stump or new lump; restore blank notebook paper seamlessly beneath the removed hand. Keep the SAME cute hamster's face outline, eyes/reflections, nose, smile/teeth, cap, ears, cheek proportions and illumination EXACTLY as supplied: no hanging cheek lobes or new facial changes. Preserve the existing coherent rounded cheek/body separation. Keep the right resting paw. Preserve the notebook's full geometry, paper texture, spiral, edge and green cover, with both pages blank. Keep ALL room details sharp and in place: LEFT lamp, RIGHT C++ mug/book stacks, wall chart, bookshelf/spines, plant, reference books and heading. No defocus, blur, camera shift, global repaint, restyling or color filter. Same full scene/aspect 1316x1195. Only the single active paw, its pencil and tiny wrist are removed.


## 撤回下垂腮帮后的受光微调

完整内置提示词见[PROMPT-cheek-light-v25.md](PROMPT-cheek-light-v25.md)。

后续按用户要求保留较可爱候选的轮廓和五官，不再添加腮帮凸起。内置局部受光编辑保存`cheek-light-edit-v25.png`；`compose-cheek-light.mjs`只比较14像素模糊后的缓慢颜色/明暗变化，在脸颊内部两个软椭圆内以受限强度接回，得到`scene-v25-current.png`。不引入编辑图的眼睛、嘴、耳朵、帽子、毛纹或轮廓；铅笔区域排除，脸型宽高/下巴外沿和房间不变。这里的模糊仅用于提取低频光照场，输出原有毛纹不被模糊。该微调仍待用户评价，不写成脸颊问题已获认可。

当前运行时采用`scene-v25-current.png`作为master，其他纸页投影和刚性短腕逻辑保持。已重新导出并核对正常尺寸与原尺寸，选定固定区域检查通过。旧受光前GIF/原尺寸帧另留`before-cheek-light-motion-v25.gif`、`before-cheek-light-native-v25.png`。内置原始输出`exec-30604a4c-6557-4fea-bc0f-bf6720c910a3.png`已复制为`cheek-light-edit-v25.png`。
