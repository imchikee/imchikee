# 第二幕色调、毛发与补底修订

## 腹部白块再次修订

用户截图明确指出白块仍在，推翻上一轮「白块消除」自评。此前补底沿笔杆及活动范围覆盖，在腹部留下斜向色差；本轮改为连贯的固定胸腹补底，过渡边界移离笔杆原位。未新生图、未改全图颜色、书写节奏或前臂粗细。已查看4.90秒连续播放局部采样（含约1.20秒、中后段与抬笔），旧斜向亮块在这些采样中不再明显。用户尚未确认；台灯受光偏弱、角色视线/比例仍待处理。旧代码保存在scene-composite-before-belly-fix.js。

2026-11-11。用户指出笔开始移动后腹部白块、配色过鲜明、毛发未遵循第一幕要求。本轮仅处理这三项，头部姿态/视线及角色比例问题仍未修订，不代表整幕确认。

内置 imagegen 输出 scene-soft-master.png 与 scene-soft-clean.png；第一幕仅作画法/配色参考。橙色与绿帽收敛，移除亮硬轮廓毛，保留第二幕布局。生成导致局部笔触/五官细节变化，非像素级保留。旧主原画和补底仍在，旧合成实现为 scene-composite-before-soft.js。

scene-composite.js 不再复用白底稿前肢取样边界，按场景实际前肢和铅笔轮廓取样，避免胸腹随笔移动。补底内部实心覆盖、外围柔化，清除原笔残影。原书写控制器和约4.90秒节奏不变。原控制器的粗细检查不是新场景轮廓的独立测量。

## 实际内置提示词

### 原画

Use case: style-transfer. Image 1 is the EDIT TARGET, chapter two writing hamster. Image 2 is ONLY the approved painted fur, color and lighting STYLE reference. Restyle image 1 to the gentle storybook painting of image 2. Preserve EXACT image 1 composition, hamster silhouette and size, ALL hand/pencil/book locations, pencil angle, room layout, left desk lamp, right mug/books and title text DAYS 11 - 21 / More C++. Reduce the oversaturated fluorescent orange fur, yellow lighting and bright lime cap to the muted warm ochres, soft cream, deeper forest green and restrained golden light of image 2. Fur must be soft fluffy volumes with selective natural short curved brush strokes, no wiry spiky glowing hair outline, no uniform etched microtexture or scratchy loops. Especially soften ear rims, hat rim and left cheek silhouette. Retain cheek volume, friendly expression and continuous chest/arm anatomy. Do not flatten into airbrushed plastic or blur whole image. Keep writing paw center around (558,861), pencil eraser (504,785), graphite tip (612,898) in 1316x1195 composition, preserve wrist/forearm silhouette for registered animation. Do not copy the room or reading pose from image 2. Output only the edited full chapter two painting.

### 补底

Precise-object-edit animation clean plate. Edit this exact painting, preserve its pixel registration and all shapes outside the small writing limb. Remove ONLY the viewer-left orange writing forearm, pink writing paw, and entire green pencil, located within x370–620 y770–905 in this 1316x1195 image. Reconstruct behind them the continuous chest fur, subtle naturally shaded lower torso and wood/paper. CRITICAL: match surrounding chest cream/ochre luminance and soft short painted fur exactly; no white patch, pale wedge, bright ghost silhouette, dark outline, bump or ghost pencil. Do not brighten the reconstructed area. Smooth natural chest illumination descending to its warm contact shadow at desk. Preserve original left body edge where possible, original book edges and handwritten lines. Keep the right paw, face, cap, title, lighting and room absolutely unchanged. Same full composition and resolution. This is a registered background plate used only behind the moving hand, not a new illustration.

原始输出：exec-d19c947d-2656-49ac-b975-e63b50cb2d01.png、exec-29e54493-604e-435c-870b-f40a9f06f3eb.png（生成会话目录01a1bb57-06e7-77b0-b28b-22ef7dbc15ee）。工作区素材：[原画](scene-soft-master.png)、[补底](scene-soft-clean.png)。
