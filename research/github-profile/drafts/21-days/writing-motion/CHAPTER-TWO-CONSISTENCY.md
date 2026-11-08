# 第二幕：继承角色画风，保留本幕环境，重画写字姿态

2026-11-05。用户明确指出“我真服了，第一幕的经验和前面的讨论你是一点没记住”“你这不是偷懒吗”，继而澄清“不止啊，你直接复用第一幕的环境不是偷懒吗”。v22退回粗硬尖毛与凶眉毛的最早第二幕，是错误回退；v23把第一幕的房间、右上台灯和静态读书姿态带进第二幕，也是错误处理，未接入运行时。两类错误与全部素材继续保留。

## 实际沿用的经验

第一幕的`reading-motion/lighting/down-v2.png`是阶段确认的角色/画风/光影参考；轮廓短软、圆腮和双耳、温和棕眼、小鼻子与门牙、橙白配色、细软绘本质感继续有效。大眼白已在第一幕被纠正，不能带回来。框选只是指出问题，实际要检查整只角色及动作，不以局部像素或导出通过当作审美确认。

第二幕继续使用自己的布局：左台灯、右侧C++杯与书堆、前景参考书、中央笔记本、书架/植物/墙上草图。左灯的方向与明暗处理必须作用到角色和场景，不能复制第一幕右上灯的环境。

## 当前素材与运行时

- 输入为第二幕既有`scene-v12-character.png`，以它的场景和由第一幕派生的角色为基础，重新处理低头看笔尖、头身与短前爪的关系，不再使用早期`scene-v1.png`或v23第一幕房间。
- `scene-v24-pose-eye-whites.png`：新写字姿态完整输出。保住第二幕环境，视线向下、前肢从低位身体接出，但眼白过多，未直接采用。
- `eye-input-v24.png` / `eye-edit-v24.png`：两个眼睛的局部输入/输出。`compose-writing-pose.mjs`只把两处眼部柔边接回，不导入眼部编辑图的其他脸部/嘴鼻变化，得到`scene-v24-writing-pose.png`。
- `clean-v24-writing.png`：内置去手完整底图，保留新低头姿态、棕眼、圆下巴、橙色身体层次和第二幕所有布景；运行时使用这幅连续背景，不插脸颊条带或变形下巴。
- `build-region.mjs`先运行眼部合成，再读新原画/底图的540×280+(280,760)样本。`shot.js`仅让新原画的前爪/铅笔和短毛腕运动，毛腕根部x350固定，x485起刚性跟随。笔尖原点(591,951)，`++i;`轨迹尺度1.3，8笔0.30–2.62秒，段间抬笔，末尾抬起停住。
- `notebook-declaration-v24.svg`在(591,985)放`int i=0;`，两页字迹均朝仓鼠。中间纸页、装订、另一爪保持固定。
- 姿态是重新绘制的低头写字形体，3.2秒动画内不额外做头部表演。不能声称本轮绘出了96张不同头部原画。
- 完整生成图有全幅细节变化，不能称场景与v12逐像素完全相同；布局与角色画风的保留经实际对照判断。

## 导出与实际查看

`motion-v24.gif`、`finish-v24.png`、`native-finish-v24.png`为固定版本；`preview-v24.html`为当前入口。`pose-comparison-v24.png`左第一幕/右新第二幕，只比较角色画风、姿态及各自环境，不把右侧写成已获用户认可。

已实际查看正常尺寸两幕对照、16个原尺寸动作阶段、12张整幅连续帧和作者阅读方向。导出3.2秒96帧；起始粉爪中心与本轮原画一致，选定头帽耳/脸颊下巴/灯/杯/参考书/装订/静止粉爪区域沿用完整底图，既有声明和页缘在关键帧不动。初次检查的静止爪裁框包含了爪下新加的纸页笔记，修正为实际爪子内区域，不以包含新增字迹的纸面作无变化断言。

完整主页两幕播放、暂停像素、九幕切换、重播、拖动、结尾停止、减少动态及1440/390深浅布局通过；实际预览加载/拖动通过，绘制抽样均值3.3ms。功能/像素检查只证明相应事项，不能替代用户视觉认可。第一幕和线上根目录README/assets没有改动，未发布。

## 原始输出

- `exec-0888db5d-d427-4dbd-b071-d009e62a9573.png` → `scene-v23-first-character.png`（复制第一幕房间的错误候选）。
- `exec-7edf1e23-58df-4f5b-aef8-8c2877e2468f.png` → `clean-v23-first-room-rejected.png`。
- v24首个姿态请求：`network error: error sending request`，无输出；未切API/CLI。
- `exec-cdc62fd6-dd0e-4cfe-9db4-34b9495cc4ab.png` → `scene-v24-pose-eye-whites.png`。
- `exec-44592e1d-7360-4d08-bdbe-30942f9c66a7.png` → `eye-edit-v24.png`。
- `exec-60836075-8145-4079-ae6c-58688df4e517.png` → `clean-v24-writing.png`。

均为内置imagegen，原始输出位于`/home/chikee/.codex/generated_images/01a1a0b1-a246-71a1-942c-a64976c7822a/`，工作区已保存全部输入/输出/提示词。v22源码、数据、画面及反馈存于`wrong-original-rejected/`，v23未接入运行时。

## 完整提示词

### v23：从第一幕改道具（错误地复制了环境，未接入）

Use case: identity-preserve, precise-object-edit. This is the APPROVED first-scene hamster and painting. Make chapter 2 by editing ONLY the upright blue reading book and the two paws that hold it into a desk-writing setup. Preserve this EXACT hamster's head pose, head size and position, soft full cheek pouches, rounded ears, gentle large brown eyes with their existing highlights and gaze, pink nose, smile and little teeth, cap shape and tilt, orange/ivory colors and the fine soft painterly fur. Do not redesign the face, add eyebrows, turn the head, shrink the character, create a new body shape, or bring back long jagged fur spikes or heavy ink outlines. KEEP the same room, camera, UPPER RIGHT desk lamp, warm lamp shading and left-side apricot bounce light, pens, plant, book stacks and desk. Replace the big upright blue book with ONE central open green-edged notebook LYING FLAT on the desk, two BLANK cream pages, with its fold visible and no writing yet. The new notebook fills the lower central area formerly behind the blue book, around x460..1000,y880..1100 in this 1316x1195 image. Retain the hamster's compact round seated body tucked behind it. Complete a small rounded chin beneath the existing smile with a visible little orange furry body gap above the notebook; the face must not lie on the page. No tall white bib, upright human chest, horizontal shoulders, long arms, raised rump or extra furry lumps. A TINY viewer-left pink forepaw holds a slim green pencil with the tip touching well inside the notebook LEFT page (around x620,y960), with a very short furry wrist emerging from the low body below the cheek and partly hidden by the notebook edge. The other tiny paw gently rests on the notebook right page near the fold, closer to the writing paw. The animal should remain relaxed and adorable, exactly the same character, with the head fully preserved. Remove the three orange surprise marks. Change heading ONLY to 'DAYS 11 - 21' and 'More C++.' in the same painted lettering. No other scene changes. Same full image and aspect ratio.

### v23：对应的去手底图（同样不接入）

Precise object removal for an animation clean plate. Use this exact scene, same full frame. Remove ONLY the writing pink paw on viewer LEFT and the ENTIRE upright green pencil that it grips (including the pink eraser at about x500,y790 and tip x591,y954). Restore matching orange/ivory fur and the blank notebook paper in the small exposed area. The little furry wrist should merge into the SAME low orange body, with no separate old arm stump or new bump. Keep the resting pink paw on viewer RIGHT and the spare pencil lying on the desk. Preserve exactly the hamster's soft round face, eyes, nose, smiling mouth/teeth, cap, ears and fur silhouette, including the existing rounded CHIN and the orange body gap between chin and notebook. No lowering the chin onto the paper, no human shoulders/chest, no flat facial strip. Keep the notebook blank, with its existing page geometry, shadows, fold and green cover. Do not change the lighting, room, background, books, heading or painting style. This is the SAME character and SAME scene with only the single active paw and pencil removed.

### v24：第二幕完整写字姿态（首次网络失败，无图）

Use case: identity-preserve / character pose correction. EDIT THIS EXACT SECOND-SCENE PAINTING. Keep its own setting: desk lamp on LEFT, dark green C++ mug and stacked books on RIGHT, open reference books in foreground, plant, shelves, wall diagrams, central spiral notebook, heading DAYS 11 - 21 / More C++. Do not copy a different room or move these props. Keep the same adorable hamster identity: full soft cheek pouches, same large brown eyes, tiny nose, small gentle smile with two little teeth, round pink ears, low green cap, orange/ivory colors, fine SOFT painterly fur and short rounded tufts. No angry eyebrows, heavy outlines or sharp long spiky fur.
Correct the COMPLETE writing posture coherently, rather than just moving a paw. The hamster sits settled with a compact rounded orange body mostly behind the notebook; head and body flow naturally, no human neck, horizontal shoulders or white bib chest. Raise its intact head only about 25-30px to make room for a small orange furry body/wrist area between the rounded chin and notebook: the face must not lie on the desk. Turn/pitch the head gently downward toward the writing tip, keeping its wide cute proportions and both ears; do not compress or narrow the face. The eye pupils/gaze should aim DOWN and slightly viewer-left at the pencil tip, without large exposed eye whites. The tiny writing paw is tucked low in front of the orange body, visibly connected by a SHORT furry wrist emerging BELOW the cheek, not from the face. It grips one green pencil naturally, with the tip comfortably INSIDE the central notebook LEFT page, around x565,y905. The other tiny paw rests naturally near the notebook right page/spiral, keeping its connection to the body. No stretched human arms, giant torso, bulky rear, lifted rump or extra fur lumps. Preserve the coherent rounded chin, with a small shaded gap above paper and a little orange body visible. Both central notebook pages should be blank cream paper for later animation lettering, retaining original paper texture, ruling, rings, edges and perspective. Keep the LEFT lamp's warm golden key light and warm soft orange fill cohesive across face, ears, cap, paws and desk. Preserve the entire scene composition, camera and character size; only the posture and notebook handwriting are corrected. Same full-frame 1316x1195 illustration.

### v24：缩短后重试写字姿态（成功）

Edit this SECOND-SCENE illustration, preserving its own LEFT lamp, RIGHT C++ mug/books, foreground reference books, central spiral notebook, room and heading. Preserve this same cute hamster: wide soft cheeks, gentle large brown eyes, tiny nose/smile/teeth, round ears, green cap, fine short soft painted fur and warm LEFT-lamp light. Correct the full writing posture: settled compact orange body behind notebook, head gently pitched down with gaze clearly at the pencil tip; both ears visible, no face compression, angry brows or large eye whites. Rounded chin sits a little ABOVE the notebook with a small orange furry body gap beneath, not face-on-table. Tiny writing paw joins the low body through a short furry wrist BELOW the cheek, not from face; pencil tip well inside central LEFT page, around (565,905). Other tiny paw steadies the right page. No human chest/shoulders, white bib, long arms, big rump or extra lumps. Keep character size, composition and all props unchanged. Blank only the central notebook's two pages for animation ink; preserve pages, spiral, edges, perspective. Same full 1316x1195 frame. Do not copy another scene's setting or redesign the character.

### v24：眼部局部修正（成功）

Precise eye correction on this exact cropped hamster face. Keep crop framing and all face geometry, nose, smile/teeth, fur, whiskers, warm light and downward-looking head pose unchanged. Remove the large cream-white sclera crescents inside BOTH eyes. Expand the rich dark chocolate/amber-brown irises so they fill nearly the whole eye opening, like cute painted hamster bead eyes, with the existing dark pupils and small white reflection highlights retained. Maintain the sense of looking down and slightly left toward the notebook through lower pupil placement and softly lowered upper eyelids. Only tiny white reflection dots should remain; no white eye bands or human sclera. Soften the heavy eyelash-like black upper outline into the same gentle painterly eyelid as the rest of this character. Do not shrink the eyes, make a flat black button, add eyebrows, alter expression or redesign the face. The result must remain the SAME face and same precise crop. Only the two eye interiors/eyelid edges change.

### v24：完整去手底图（成功）

Create a clean animation plate from this EXACT second-scene illustration. Remove ONLY the active writing pink paw on viewer LEFT and the ENTIRE green pencil it grips, from eraser near (505,800) to tip near (591,950). Restore the matching orange/ivory fur and blank notebook paper exposed behind them; the orange furry wrist merges into the same low compact body with no old arm stump, extra bump or new limb. Keep the resting right paw, notebook, paper/spiral/edges, and all props completely in place. STRICTLY preserve this exact downward-looking cute head pose, both DARK BROWN eyes (no white sclera bands, only their tiny reflection glints), small smile/teeth, nose, cap, ears, soft fine fur, rounded chin and the orange body GAP between chin and notebook. The face must remain off the page. Preserve this second scene's LEFT desk lamp, RIGHT C++ mug/stacked books, foreground reference books, room, heading and original warm lighting. No chest bib, human shoulders, face strip, lower-face alteration, new character, camera shift or style change. Same full frame 1316x1195. Only that one writing paw and pencil disappear.

