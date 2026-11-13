# 收回人形胸肩，重建仓鼠体态

> 2026-11-11 清理：本文涉及的已否定方案文件已按用户要求删除，具体范围见 [清理记录](CLEANUP.md)。以下保留反馈、提示词及历史说明；旧文件名不再表示文件仍存在。

2026-11-04，用户反馈“感觉你有点智障”“这不又像人了吗”。v20用抬头和露出直立胸腹修正了脸压纸面，却形成宽分的双臂、横向肩线和两截式头身，仍不符合仓鼠体态。v20原画/背景/源码/像素数据/输出均保留，拒绝阶段在`upright-humanlike-rejected/`，不将先前检查结果当作用户认可。

本轮以v12作为原场景目标、第一幕已确认原画作为卡通角色参考，并加入真实仓鼠照片，仅核对整体轮廓和前爪间距。新原画改为微侧身、前爪靠拢、头与身体融为一体的紧凑形状；没有竖直胸腹、横向肩线或长前臂。第一稿`scene-v21-animal-first.png`的右后躯仍过大，助手自查后另一次内置编辑收窄压低，得到`scene-v21-compact.png`。这是助手选择，用户尚未评价v21，不能写成用户接受了任何初稿。

去手笔背景首次请求网络失败、无图片；简化提示词后重试返回`writing-background-v21.png`。不据此将失败原因归为提示词长度。四次外层内置调用为：体态成功、收背成功、首次清底失败、清底重试成功，全程未切CLI/API。原图和完整提示词均保留。

动画的原手、笔和短腕来自本轮新原画，完整背景来自同姿态去手图。笔尖校准为(539,898)，8个笔画的字迹和笔尖共用位置，字形尺度1.1，写出`++i;`；声明原点(539,922)，前景根部由x330向x440过渡，粉爪/铅笔/短腕蒙版重描，保留3.2秒96帧和段间抬笔。两页原字迹已由背景编辑清空，`notebook-declaration-v21.svg`重新放入朝向仓鼠的声明、右页C++和清单，右页预留页边，不恢复面向镜头的旧字迹。无脸颊条带插片或身体局部变形，整幅背景采用内置编辑输出，因此有生成像素差异，不声称其他区域与v20或v12逐像素相同。

当前入口`preview-v21.html`，固定输出`motion-v21.gif`和`finish-v21.png`。正常尺寸`pose-comparison-v21.png/gif`左v20、右v21。已实际查看16个原尺寸面部/前爪阶段、96帧眼睛至纸页的连续图、12格整幅图、正常画面及作者阅读方向；重点核对紧凑体态、前爪靠拢、后躯不过高、下巴与纸面层次、手移开无残影及笔尖接字迹，不以功能检查代替美术判断。

第一幕及线上根目录README/assets不改，未发布，第二幕整体仍未获用户确认。

## 真实仓鼠参考

仅用于本轮体态参考的照片：`animal-posture-reference/natgeo-hamster.jpg`，来源 [National Geographic Kids：Hamsters: From the Wild to Your Bedroom](https://kids.nationalgeographic.com/nature/article/wild-hamsters)，[原图](https://i.natgeofe.com/k/2fedc730-e8a5-4d86-896b-a32317dafc0a/hamsters-golden-cheeks.jpg?h=1084.125&w=1084.125&wp=1)。没有将照片的写实画风替换进原卡通角色；没有将它当成用户提供或自行拍摄的图片。

## 完整内置提示词

### 体态重画

Use case: identity-preserve / illustration-story. Image 1 is the EDIT TARGET SCENE. Image 2 is the approved cartoon CHARACTER reference. Image 3 is a REAL HAMSTER reference for ANIMAL BODY SHAPE AND TINY PAW PLACEMENT ONLY. Redraw the hamster in image 1 with a believable compact hamster silhouette like image 3: a single low pear-shaped furry volume, head blending organically into its little body, slightly turned THREE-QUARTER toward viewer-left and leaning gently over the central notebook. The back is a modest continuous curve behind the head, rump settled LOW, not a huge hump or extra round appendage. Eliminate the frontal little-person anatomy: NO upright chest, horizontal shoulder line, separate round head sitting on a torso, bib-shaped breast, visible human neck, human arms or elbows. The TINY rodent forepaws are tucked close together under the front of its round body, like the real hamster holding food; one small paw holds the green pencil to write, the other braces the notebook nearby. Keep their spacing close, not arms spread at shoulder width. Most forelimb length stays hidden in fur. The chin/muzzle remains visibly ABOVE the notebook with a little fur/body depth and a soft separation shadow, NOT planted flat on paper; do not stretch the lower face down to the table. Both eyes remain visible, looking down toward the pen. Keep image 2's cute large glossy eyes, soft round cheek pouches, little pink nose and tiny incisors, fine painted orange/cream fur and green cap. Use photo 3 for compact animal posture, NOT photographic rendering or a realistic long muzzle. This must read as a CARTOON HAMSTER quietly studying, not a furry human student or teddy bear. Keep image 1's LEFT lamp and pencil cup, RIGHT C++ mug/books, central spiral notebook, foreground books, warm room and framing. Exact title 'DAYS 11 - 21' / 'More C++.'. Writing happens on the CENTRAL notebook LEFT page, keep that page BLANK for animation lettering. Same full image and aspect, one scene. No extra paws, no clothes or new objects.

### 收窄并压低后躯

Use case: precise-object-edit. Keep this hamster's animal-like three-quarter posture, face, green cap, eye direction, tiny close-together paws and pencil EXACTLY as they are. ONLY reduce the excess rear body on the viewer RIGHT, behind the right ear and cheek. The right rear bulge currently fills a large oval up to about x1000; pull that outside curve inward by roughly 70–100 pixels, and lower the exposed upper-back curve behind the ear. Let the small haunch settle LOW at the same tabletop baseline; keep just a narrow natural continuation of back fur behind the cheek, rather than a big inflated balloon. ONE compact merged hamster body, no extra lump, no lifted rump, no upright torso, human shoulders, chest or neck. Preserve the front muzzle's clearance above paper and the tucked short forepaws. Leave the paper, all rings, both paws, pencil tip, left lamp/cup, right mug/books, heading, lighting, fur style and every other object in place. Reconstruct only the small background space opened beside the reduced back. Same full frame/aspect. Do not change the cute face or make the animal skinny.

### 首次去手笔背景（网络失败，无图）

Use case: precise-object-edit. Prepare an animation CLEAN BACKGROUND from this exact compact three-quarter hamster scene. Remove ONLY the tiny viewer-left pink writing paw, its very short furry wrist immediately behind it, and the ENTIRE green pencil including cap and tip. Restore the animal's continuous compact orange/cream body fur behind that small paw and the unbent notebook paper behind the tip. Keep the nearby resting pink paw. CRITICAL: preserve this exact low, compact animal silhouette, turned head, tucked paws, narrow settled rear body and muzzle clearance above paper. No upright chest, shoulders, neck or separate torso. Do not enlarge the back, lower the chin onto paper, add a new limb or alter the face. Also erase the handwritten C++ title and little checklist marks ONLY from the CENTRAL NOTEBOOK'S RIGHT PAGE; both central notebook pages must be clean pale paper with their original fine ruling/texture, since properly writer-facing ink is drawn later. Keep the mug C++ and scene title unchanged. Retain all page edges, spiral rings, resting paw, whiskers, green cap, left lamp/pencil cup, right mug/books, foreground books, lighting and framing. Same full image/aspect. Do not remove any other body part or add objects. Original writing paw and pencil are composited back as foreground animation.

### 去手笔背景重试（成功）

Make a clean animation background from this EXACT image. Remove only the small writing paw on viewer-left, the tiny furry wrist behind that paw, and the ENTIRE green pencil including cap and tip. Fill with matching hamster fur and notebook paper. Keep the nearby resting paw. Both pages of the CENTRAL spiral notebook should be blank pale paper, with the existing fine ruling/texture, edges and rings retained; remove just its C++ heading/checklist for later animation lettering. The mug C++ and scene title stay unchanged. Preserve the compact THREE-QUARTER animal silhouette, low settled rear, face, hat, whiskers and muzzle clearance above paper. No human shoulders/chest/neck, no new paw, no extra body bulge. Keep all lamps, cups, books, room, lighting and framing. Same full image/aspect. Original writing paw/pencil are a separate foreground layer, so do not replace them with another limb.

## 输出对应

- 体态初稿：`exec-e52a2d44-5254-4085-9074-2d07d015ea79.png` → `scene-v21-animal-first.png`。
- 收背结果：`exec-2af122fa-e5ed-4a15-9136-f80c3dd4efd2.png` → `scene-v21-compact.png`。
- 清底重试：`exec-b0b80276-b3c4-4805-9ef7-3b09ce60d755.png` → `writing-background-v21.png`。


最终验证：导出3.2秒96帧通过；起笔20×15粉爪中心与新原画一致，选定纸页/既有声明/脸颊/纸页上缘/装订区域在四个关键帧不动。实际预览`preview-v21.html`加载并拖到3.1秒，截图`preview-v21.png`已查看。主页两幕播放/暂停像素、九章切换、重播/拖动/结尾/减少动态以及1440/390深浅布局检查通过，本机绘制抽样均值5.4ms。`git diff --check`通过，第一幕与根目录README/assets无差异。视觉核对与功能验证分别记录，均不作为用户已认可的依据。
