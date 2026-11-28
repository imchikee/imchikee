# Phase 4.2 · Learn together

独立的第四幕动作原型，待用户审阅。工作基线为 `work/profile-development` 的 `c313536dcc582ae83debbcd2f40a90c4fc1da577`。

[循环 APNG](loop.png) · [MP4 预览](preview.mp4) · [15 格关键时刻对照](key-moments.jpg) · [原生关键帧](keyframes/) · [ImageGen 原件](source/)

## 动作重构

Phase 4.1 的眼球平移改为内置 ImageGen 补绘整个头部。主角左听、下点、半闭、闭眼和右读时，帽檐、双耳、双眼及眼睑、鼻嘴、脸颊和胡须按同一头姿变化。闭眼处的暖色毛纹和眼睑来自同一张绘画。

左右动作也采用完整补绘姿势。左侧先收爪蓄势，肩向前滚动时，眼镜、头、前臂与伸出的食指有各自的细小变化。右侧从桌沿勾起同一张笔记，纸页、握爪和肩在同一张画里改变角度与受力，纸下原先被挡住的窄处由同一姿势原件补出。每张动画帧直接选用相应绘画姿势，起势和回落使用绘制的过渡，关键时刻用停顿留出阅读时间。

## 裁切、配准和遮挡

原画为 [1254 × 1254 九格](../../../cpp-humor/storyboards/21-days/hamster-storyboard-v1.png)。以 `viewBox="21 446 384 350"` 裁得 RGB 底板 P0。以下是 P0 内的左、上、右、下坐标，右下为开区间。各编辑输入采用 Lanczos 放大 6 倍。左侧指屏额外参考全幕 P0 的 3 倍图。

| 局部 | P0 裁框 | 编辑参考尺寸 | 配准锚点 |
| --- | --- | --- | --- |
| 左 | `[0, 83, 160, 313)` | 960 × 1380 | 植物、杯旁静止书本、笔记本底座 |
| 中 | `[95, 78, 284, 269)` | 1134 × 1146 | 帽顶以上的墙、笔记本上沿与背盖 |
| 右 | `[246, 92, 384, 315)` | 828 × 1338 | 墙上流程图、笔记本背盖、书堆 |

[build.py](build.py) 在各静止锚点比较灰度边缘，搜索原裁切尺度附近 ±2% 和 ±4 原生像素的整张编辑图平移，以最小误差配准。只有 `C_look_right` 选择了向左 2 px 的整张参考校正。其余各张使用精确裁框映回。姿势本身由原件绘制。

- 左侧遮罩从耳缘、眼镜与头、脸颊延伸到肩前和指尖，原生范围约 `x 0–136 / y 116–284`。保留杯、翻开的桌上书本和笔记本底座的原画边界。
- 中央遮罩覆盖帽顶、耳朵、面颊和下巴到电脑背盖前的可见上半身，约 `x 104–278 / y 88–236`。耳帽边缘随头微动，固定前景背盖、边框和相邻角色前景按遮挡顺序合成。
- 右侧遮罩覆盖微倾的头肩、前爪和电脑到书堆之间的纸页路径，约 `x 264–383 / y 113–290`。电脑边、蓝绿书堆和杯缘从 P0 保留。原桌上纸页占据的区域只在起纸后由补绘露出。
- 遮罩沿轮廓裁出局部，边缘仅在轮廓内轻微羽化。笔记本、两个杯子和蓝绿书堆另有硬保护遮罩。其余墙面、标题、桌面和静止道具取自 P0。输出宽度决定缩放比例，画面横向居中、顶部对齐，源画底部裁去约 1.24 px，符合 `xMidYMin slice`。缩放后再用固定区域的 P0 对应像素锁定静止区，以免重采样在遮挡边界引入颜色差。

## 时间轴

帧号从 0 起算，时间窗右端开区间。每张原始补绘在下表各轨独立切换。结束停顿从 3.800 秒开始。

| 帧（含） | 秒 | 左侧 | 主角 | 右侧 |
| --- | --- | --- | --- | --- |
| 000–009 | 0.000–0.333 | `P0` | `P0` | `P0` |
| 010–013 | 0.333–0.467 | `L_gather` | `P0` | `P0` |
| 014–017 | 0.467–0.600 | `L_reach` | `P0` | `P0` |
| 018–033 | 0.600–1.133 | `L_point` | `P0` | `P0` |
| 034–037 | 1.133–1.267 | `L_point` | `C_left_in` | `P0` |
| 038–045 | 1.267–1.533 | `L_point` | `C_look_left` | `P0` |
| 046–049 | 1.533–1.667 | `L_reach` | `C_look_left` | `P0` |
| 050–052 | 1.667–1.767 | `L_gather` | `C_look_left` | `P0` |
| 053 | 1.767–1.800 | `L_gather` | `C_left_in` | `P0` |
| 054–056 | 1.800–1.900 | `P0` | `C_left_in` | `P0` |
| 057–059 | 1.900–2.000 | `P0` | `C_half_blink` | `P0` |
| 060–063 | 2.000–2.133 | `P0` | `C_ack_nod` | `P0` |
| 064 | 2.133–2.167 | `P0` | `C_half_blink` | `P0` |
| 065–066 | 2.167–2.233 | `P0` | `C_half_blink` | `R_pick_up` |
| 067–068 | 2.233–2.300 | `P0` | `P0` | `R_pick_up` |
| 069 | 2.300–2.333 | `P0` | `P0` | `R_lift` |
| 070–072 | 2.333–2.433 | `P0` | `C_right_in` | `R_lift` |
| 073 | 2.433–2.467 | `P0` | `C_right_in` | `R_share` |
| 074–105 | 2.467–3.533 | `P0` | `C_look_right` | `R_share` |
| 106–108 | 3.533–3.633 | `P0` | `C_look_right` | `R_lift` |
| 109 | 3.633–3.667 | `P0` | `C_right_in` | `R_lift` |
| 110–112 | 3.667–3.767 | `P0` | `C_right_in` | `R_pick_up` |
| 113 | 3.767–3.800 | `P0` | `P0` | `R_pick_up` |
| 114–125 | 3.800–4.200 | `P0` | `P0` | `P0` |

## 采用的内置 ImageGen 资产

原件为生成文件的逐字节副本。提示词中的原始参考都来自上面的局部 P0，或用表中注明的上一张绘画做姿势参考。右侧首版姿势参考来自 `exec-50093a7e-220a-49ad-8c37-19cffebb3894.png`，它的桌上重复纸页没有进入成片。

| 入库原件 | 尺寸 | 用途 | 输入 |
| --- | --- | --- | --- |
| [L_gather](source/L_gather.png) | 1046 × 1504 | 收爪蓄势，肩部跟着微收 | 左侧 P0，另给 `L_point` 姿势参考 |
| [L_reach](source/L_reach.png) | 1046 × 1504 | 肩和前臂开始朝电脑伸出 | `L_point` 为编辑目标，`L_gather` 为参考 |
| [L_point](source/L_point.png) | 1046 × 1504 | 讲解时肩带前倾，伸指示意电脑 | 左侧 P0，另给全幕 P0 构图参考 |
| [C_left_in](source/C_left_in.png) | 1254 × 1254 | 侧转刚起，之后回正时复用 | 中央 P0，另给 `C_look_left` 参考 |
| [C_look_left](source/C_look_left.png) | 1241 × 1268 | 帽耳、鼻嘴、眼眶随头向左侧转 | 中央 P0 |
| [C_half_blink](source/C_half_blink.png) | 1254 × 1254 | 轻点头，双眼自然遮住上半部 | 中央 P0，另给 `C_ack_nod` 参考 |
| [C_ack_nod](source/C_ack_nod.png) | 1254 × 1254 | 帽、耳随头低下，合眼微笑 | 中央 P0 |
| [C_right_in](source/C_right_in.png) | 1254 × 1254 | 向右下看的一张起势，回正时复用 | 中央 P0，另给 `C_look_right` 参考 |
| [C_look_right](source/C_look_right.png) | 1241 × 1268 | 头往右下倾读笔记，保留黑褐椭圆眼 | 中央 P0 |
| [R_pick_up](source/R_pick_up.png) | 987 × 1594 | 爪从桌边勾住纸，纸底仍靠桌面 | 右侧 P0，另给 `R_lift` 参考 |
| [R_lift](source/R_lift.png) | 986 × 1594 | 纸页离桌，扣住右侧边缘，向电脑侧倾 | 右侧 P0，另给右侧首版举纸作为姿势参考 |
| [R_share](source/R_share.png) | 986 × 1594 | 举高纸页供同伴看，纸顶高过电脑 | 右侧 P0，另给右侧首版举纸作为姿势参考 |

<details>
<summary>生成文件路径与完整提示词</summary>

### L_gather

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-4ce4e17e-9327-40fe-b3f6-33dac465af92.png`

```text
Use case: precise-object-edit. Image 1 is the exact P0 local crop: use its crop, framing, background, electronics, and lighting as the edit target. Image 2 is the pointing end pose, a position reference only. Draw one true in-between pose of the brown glasses hamster approximately midway from image 1 to image 2. The existing single pale fingertip has traveled only half the distance upward and rightward from image 1, connected through the curved forearm and rolling shoulder fur. Head angles very slightly to look into the laptop with both same-sized eyes behind the same round glasses. Natural slightly open talking smile somewhere between the two pictures. Use EXACT same brown coat and cream face, identical muzzle, glasses, same size and proportions. Match paper grain and warm directional color pencil hatching in image 1. Keep the orange neighbor, original crop framing, plant, original wall, desk, mug, notebooks and laptop absolutely fixed. No new digit, no redesigned face, no zoom, no panels. Single full registered crop like Image 1.
```

### L_reach

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-77491997-7798-43a0-99ef-86509e004c12.png`

```text
Use case: precise-object-edit. First image is the exact registered crop to edit; second image is the earlier drawing for guidance. Make a close neighboring inbetween frame by changing the FIRST image only very slightly, moving a quarter of the way backwards toward image 2. The fingertip points the same way but is tucked back six original frame pixels to the LEFT and about one pixel lower; this means x slightly below 79% rather than 82% of crop width. Rounded original finger, same paw shape, forearm remains connected to shoulder. Cheeks, chin and shoulders subtly roll back by a pixel and preserve head size and exact circular glasses without moving face more than 1%. Same original colors, soft pencils, positioning, character and camera. Preserve all neighboring pixels of laptop, desk, cup, two hamsters and plant. Single painted frame, same size/crop, no panels.
```

### L_point

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-35bba903-404f-4023-9ef8-968905d64281.png`

```text
Use case: precise-object-edit. First image is the exact local crop to edit. Second image is the full composition to clarify the direction of the laptop and is context only. Return one complete image of the FIRST crop, same framing and proportions. Draw a single strong but small animation key pose of ONLY the brown bespectacled hamster. In the original its pointing paw is below its mouth. In this key its shoulder and head lean forward towards screen-right very subtly (2 native pixels, about 1% of subject), its mouth is mid-speech, and it bends and raises the original forearm, extending the one original small ivory index digit towards the computer screen at a shallow upward angle. The tip is about 1/10 of the face height higher and 1/10 of a face width farther right than the original. Shoulder-to-paw is one continuous rounded fur form with the rounded tucked digits and one readable pointing digit. Preserve head shape, ear size, circular brown glasses, eye identity, darker brown coat, original pencil scratches, warm light, and pose of the neighbors. Match the original illustration exactly, colored-pencil grain with delicate watercolor. The cup, table, notebooks, laptop, orange neighbor, wall and plant stay at exactly the original coordinates. No camera move, reframe, zoom, smooth digital fur, added limbs, or text. This is a registered overlay for the brown hamster, with the original foreground props restored.
```

### C_left_in

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-f7ae108e-e3fc-436b-9b98-b71ac772335e.png`

```text
Use case: precise-object-edit. Input 1 is the exact local P0 crop and input 2 is reference for the final very subtle look left. Draw one VERY EARLY intermediate pose: almost trace image 1, move the nose ONLY 3 pixels left at native crop width 189 (1.5 percent of crop width), both complete dark eyes and friendly slightly open smile shift a comparable tiny amount in the whole face. Keep shape of eyes, original glints, dimensional texture. Retain whiskers, plump cheeks and the original almost exact green cap direction with brim visibly jutting to the right. Keep silhouettes and hatching extremely close to image 1. Match warm original colored pencil texture, leave wall, neighbors and laptop unedited. Return only one crop with exact same framing and no camera change.
```

### C_look_left

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-619b5988-de5a-487e-bc36-1543fd34fd88.png`

```text
Use case: precise-object-edit. Edit the exact local source crop. Return the whole crop without camera change. DRAW ONE barely changed animation inbetween of the orange hamster wearing the green cap, just beginning to listen to the character on image-left. Almost a perfect trace of the input: center nose and both complete eye sockets only 2 original 189×191 crop pixels to the left, about 1% of the image width; move the complete face and mouth very subtly with them. The cap/ears and cheeks participate with equally tiny movement, keep visor sticking out to the RIGHT as in input (do not reverse it). Same eyes, same size, same cheeks and gently partially open smile. No panels, no changed lighting or art treatment, keep the original pencil hatching and color. Preserve the entire outer silhouette, original laptop, wall and neighbors.
```

### C_half_blink

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-ca11926d-d26e-4e6a-9c57-cd91ab93801e.png`

```text
Use case: precise-object-edit. Input 1 is the exact animation crop to edit and input 2 is the neighboring closed blink frame. This is one INBETWEEN drawn animation frame of the blink and tiny nod, same scale and framing. In this frame the original oval eye width, lower contour, and dark color and glints are preserved in both eyes. The eyebrows (if any) stay. The upper 30–40 percent of both eyes is hidden by warm, smoothly continuous local orange hatching with NO outlined area over the dark eye. Only a delicate soft dark-brown eyelid seam at the lower edge of the orange forehead fur where it meets the exposed part of each eye. Entire head and cap are only about halfway to the nod shown in input 2. Preserve friendly small smile, eye spacing, nose, cheeks, whiskers, silhouette, ear positions, cap colors, pencil grain, surrounding wall, side hamsters and original laptop. No sticker eyelids, no arcs enclosing the fur on top, no raised orange ridges. Use one whole crop with unchanged anchors and texture.
```

### C_ack_nod

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-bd0d75fe-be7b-4da4-b923-fd9155d880ee.png`

```text
Use case: precise-object-edit. Input is the exact local crop, return the exact same composition and framing. Draw ONE very subtle animation frame of the SAME round orange hamster with the same green-and-cream cap giving a tiny downward nod in agreement while it blinks. Whole head subtly dips together (roughly 2–3 native pixels, 1.5% of width); the crown, cap brim, ears, cheeks, nose and mouth move together. Both eyes fully naturally closed in soft relaxed dark brown curved pencil seams; replace the old eye orbits with warm gold/cream textured fur exactly matching adjacent pencil marks. NO pupils visible. Retain the same eye spacing, cheek contour, nose, whiskers and gentle smile, reduce the mouth opening slightly to indicate understanding. Preserve exact cap color, scale and silhouette, paper texture and directional warm colored-pencil strokes. Match the original softness and edge definition. Leave the wall, side characters, and laptop in exactly their same place. No relight, restyle, camera or reframing, added details or alternate panels.
```

### C_right_in

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-5078a15a-e00e-4101-a8b7-ccb77cc1a741.png`

```text
Use case: precise-object-edit. Use the first image as the exact local edit target and second as endpoint reference. Make ONE true drawn animation inbetween only ONE THIRD of the way from image 1 to image 2. Match camera scale framing and anchors from image 1. The green-capped orange hamster head just begins a glance at lower right. Only move the original pink nose about 2% of the crop's width toward screen-right and 1% down, with both same small dark oval eyes, ears, cap and whiskers subtly rotating with it. In both eyes keep the beautiful simple colored-pencil darkness of frame 1: no white sclera, the ONLY white is the small original fixed catchlight. Friendly small toothy smile like frame 1. Same cheek width, cap shape and color, outer fur silhouette, paper and warm pencil hatching. Both neighboring faces, laptop and wall fixed. Return whole original crop, single pose, no multiple panels.
```

### C_look_right

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-c9a491a2-a238-4268-a321-4994996a7cfa.png`

```text
Use case: precise-object-edit. Input is the exact crop and camera of the green-cap hamster to edit. Return a single registered animation key. Same face as P0, with the whole head and cap turning a SMALL amount to its left (image right) and dipping to read the paper. Keep original nose/eyes landmark distances; the nose goes only about 5 native 189×191 crop pixels to the right and 2 down. The ear contour and green-and-cream cap adapt by 2–3 native crop pixels, keeping their shape and size. Keep the character's distinctive gently oval DARK eyes, their entire egg-shaped outline, NO WHITE SCLERA anywhere in either gaze except the single small white catchlight per eye like source. Replace a little of the open mouth with a smaller friendly toothy smile. Eyes, nose, the muzzle and the whiskers align organically and are redrawn as one face. Same round cheek shape and blush. Keep the original soft golden-orange colored pencil and paper grain exactly; match scale, original ear size and cap details, laptop position, neighbors and the wall. No camera change, no new shape, no text, no panels.
```

### R_pick_up

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-0f3cc7e5-adcd-401f-a3a4-f933e7e4af12.png`

```text
Use case: precise-object-edit. Image 1 is the exact local original crop and editing target. Image 2 is the later pose, as a gesture reference. Paint the FIRST small intermediate gesture as the original small loose handwritten page just starts to lift. Camera and texture are exact image 1. Keep the top of the one sheet LOW, at 65% from top of crop, over 20 native pixels below the top of the laptop. The bottom of the sheet still touches the wooden desk and the sheet tilts enough to see several small strokes of warm pencil handwriting. The sheet is shorter in vertical projection than image 2 because it is still nearly lying down. Original fur arm and tiny white paw curl around the upper right edge naturally; the hamster is the same round smiling hamster with original closed eyes. Tiny lean beginning only. Leave the laptop, books, desk, wall and neighboring character pixel-registered. Exactly one piece of paper in the gap. Keep warmth, hat ornament and color pencil pattern. No digital smoothing, change of framing, or panels.
```

### R_lift

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-6d0fcbbe-9d74-4610-8784-471b86e1d9c1.png`

```text
Use case: precise-object-edit. Input 1 = exact crop of P0, the edit target; input 2 = gesture reference only. Draw ONE true painted frame approximately midway through lifting the note. Keep the exact camera and all anchors of input 1. The original small loose paper in the gap between the laptop and blue books is being picked up with the original short arm, ivory toes curling over the page's right edge. The paper is already just clear of the table but only halfway raised and tilted gently up and left, top edge beneath the hamster's whiskers and below the height of the top of the laptop. The single sheet spans the gap; no second sheet on table. Show warm wood where the paper left, with the original table height. Keep the laptop in front of the paper and blue books in front of the mascot's elbow, original shapes and coordinates. Preserve round cheerful head, ear and green ornament, eyes, smile, lighting and pencil directional fur marks. The shoulder leans inward only a touch. Match texture and camera of input 1. One coherent local crop, no panels or added objects.
```

### R_share

`/home/chikee/.codex/generated_images/01a2219a-307d-79a2-9c76-5858cdb617a7/exec-48b12215-a92e-4dd9-b835-11897ff8320c.png`

```text
Use case: precise-object-edit. Input 1 is the exact local animation crop and edit target, use its exact framing and static anchors. Input 2 is an animation gesture reference only. Draw ONE key animation frame of the same friendly hamster holding up the ONE original loose handwritten small paper to the green-cap coworker, gently tilting it left by gripping the right edge naturally with the original ivory front paw. The note is upright so cream paper and warm brown scribbles are readable, the top at the height immediately below the hamster’s mouth, clearly above the top of the laptop by about 6 native pixels. Keep the same poses, COLORED PENCIL fur (fine soft warm paper and hatch grain of input 1), scale, facial features, ears and green ornament. Shoulder rolls in as the paw rises. CRITICAL one sheet only: the original loose sheet has left the table; inside the very small gap below the raised sheet show the SAME warm orange bare wood grain as rest of original table. The unedited blue book stack, laptop, wall, left neighbor and foreground cream mug stay exactly in place. No added objects, no second paper on the table, no change to crop, camera, outlines of static objects or lighting, no multiple panels.
```

</details>

## 实际检查

- 将每张 ImageGen 候选在相同原生坐标下与 P0、遮罩合成图三栏对照，再按 534 × 485 查看。淘汰了反转帽檐的左看、带显著眼白的右看、带凸起描边的半闭眼、前伸过多导致眼镜接近遮罩边的左侧过渡，以及在桌上留下重复纸页的右侧举纸。扩大了主角耳帽的原画交界余量，画面中耳缘没有残留第二道毛边。
- 全部合成帧核对动作遮罩之外像素和独立前景保护遮罩，与 P0 的 RGB 差异均为 0。导出取景后的固定区也用对应 P0 像素锁定。原生第 0、125 帧与原始 384 × 350 裁区逐像素一致。APNG 的同两帧与应用相同取景的 P0 逐像素一致。
- APNG 解码 126 帧与构建画面逐帧匹配。文件帧控块的 126 个延迟均为 `1/30 s`，循环为 `0`。MP4 实测 534 × 485、30 fps、126 帧、4.200 秒。连续两次运行构建，APNG、MP4、原生关键帧和对照图的 SHA256 全部一致。
- 本地 Chrome 158 以 534 × 485、DPR 1 连续播放 APNG 超过两轮，检查了两轮的浏览器实际画面。获取的 143 张播放截图均逐像素匹配某张解码帧，两轮都看到了指屏、主角左听和闭眼点头、右侧举纸及原画归位。绿帽角色连续可辨认，视线变化伴随帽、嘴鼻和腮部的变化，未看到独立眼珠漂移。从低位捏起笔记、举高再放下均可读。书堆、电脑和马克杯的遮挡边界保持稳定。
- 动作保持有停顿的绘本动画节奏。左侧指尖在原图已指向电脑，画面中最清楚的变化是先收再伸，持续讲解时头部的前倾较轻。右侧举纸清楚，纸底与前爪部分仍被电脑和书堆遮住。姿势切换附近能看到一点手绘笔触跳动，尤其是左侧眼镜旁的毛纹和主角从半闭到全闭时的面部纹理。以上为制作端视觉自检，用户视觉验收待定。

## 复现

在本目录运行 `python build.py`。使用 Pillow 和带 APNG、libx264 的 FFmpeg。脚本读取原始九格和 `source/`，导出 `keyframes/`、`loop.png`、`preview.mp4` 与 `key-moments.jpg`。每格实际画面为 534 × 485。
