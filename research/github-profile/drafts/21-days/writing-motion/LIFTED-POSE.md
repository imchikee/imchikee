# 抬起头，恢复头、身体与桌面的关系

后续状态：用户再次指出v20像人，直立胸腹/肩线方案被否定；当前紧凑侧身体态见[ANIMAL-POSTURE.md](ANIMAL-POSTURE.md)，以下为保留的历史过程。

2026-11-04，用户指出v19“那不变成整张脸放在桌子上了吗”。这一批评成立：v19虽然去掉了条带接缝，但下巴整段压在纸面上，身体被大脸遮住，不能把背景连续误当成姿态自然。v19源码、数据、完整结束帧、GIF、预览截图与反馈保留在`face-on-table-rejected/`，固定`motion-v19.gif`仍保留为历史。

本轮用内置imagegen一起重画头、短前肢和小身体，以v19原尺寸结束画面为目标、第一幕已确认原画为角色参考，生成`scene-v20-lifted.png`。头抬离本子，脸下方可见一段短胸腹，两只短前爪从身体下方落到纸页上；没有靠加长手臂或补一条下巴边解决。提示词要求缩头8–10%只是生成指导，没有将其写成实际测量结果。新图有整体生成差异，未声称其他像素与旧版完全相同。

第二次内置编辑只为新姿态准备去左手/笔背景，保存`writing-background-v20.png`；保持新图头抬起及胸腹可见，去掉写字粉爪、短前臂和整支铅笔，保留右爪。动画采用这幅完整连贯底图，手笔前景来自本轮新原画，不再沿用v12旧爪子。两个完整输入/输出及提示词均保留，全程未用API/CLI。

笔尖按新图校准为(560,917)，声明图层在`notebook-declaration-v20.svg`，作者坐标原点(560,941)；仍朝仓鼠，8个接触笔画写`++i;`，段间抬笔，3.2秒96帧。重新设置粉爪/铅笔/橙色前臂蒙版，根部x350固定，x460起刚性跟随手笔，腕前毛发吸收小幅变化。采样区仍550×266，原点(270,700)，`build-region.mjs`直接读本轮原画和去手背景，不再导入旧文字/脸颊合成脚本。

实际查看正常尺寸新旧姿态并排图`pose-comparison-v20.png`（左v19，右v20），以及包含下巴、胸腹、两只前爪、笔尖和纸面的96帧连续图、16个原尺寸阶段、整幅12格图与作者阅读方向。检查重点是下巴在书写全程是否离纸、前肢是否从身体连接、手移开后有无旧手残影、笔尖是否接着新增墨迹；没有只用像素不动证明姿态正确。v20独立入口`preview-v20.html`，固定导出`motion-v20.gif`、`finish-v20.png`。

第一幕文件和线上根目录README/assets不改，未发布。以上是本轮结果和自查，不代表用户已确认第二幕整体。

## 姿态编辑完整提示词

Use case: identity-preserve. Image 1 is the EDIT TARGET, the writing scene. Image 2 is the approved CHARACTER REFERENCE, the same cute hamster reading. Correct the writing scene's ANATOMY AND POSE: right now its enormous lower face lies directly on the notebook like a head resting on a table. Repaint it as a compact natural hamster sitting behind the desk, gently leaning forward to write. Lift the entire head clear of the notebook; slightly reduce the head about 8–10 percent if needed to keep the green cap below the title. The rounded chin must finish clearly ABOVE the writing paws and paper, with a visible narrow band of short orange/cream chest fur between the chin and the notebook. Keep head and small body organically connected with no visible human neck. Show TWO short furry forelimbs emerging from the small BODY below the cheeks, not from the face. Viewer-left tiny pink paw holds the green pencil and touches its tip to the CENTRAL NOTEBOOK'S LEFT PAGE; viewer-right tiny pink paw rests on the notebook's right page. Keep forelimbs SHORT and natural, no human shoulders, elbows or long arms. The torso stays compact and mostly hidden behind the notebook, no large belly, raised rump, extra haunch or extra limb. Maintain the reference's large glossy eyes, soft rounded cheeks, little teeth, sweet expression, green cap and fine warm painted fur; eyes glance down toward the writing. Make the chin/chest/paws/page separation immediately visible at normal thumbnail size, without making a floating head or large empty gap. Keep the target's scene composition: title 'DAYS 11 - 21' and 'More C++.', LEFT desk lamp and pencil cup, RIGHT C++ mug/book stack, central spiral notebook, foreground books, warm wood room, same framing/aspect. Leave the central notebook LEFT PAGE BLANK: the correct writer-facing code is added by animation later. Preserve the whole unbent notebook and visible spiral rings. One full image, no collage. A modest but CLEARLY lifted seated hamster pose, not a head planted on paper.

输入一：v19原尺寸结束帧，已归档`face-on-table-rejected/native-finish.png`。输入二：`../reading-motion/lighting/down-v2.png`。内置原输出`exec-b0a9b559-d494-416f-9883-cd7ad1dd9ab7.png`，项目副本`scene-v20-lifted.png`。

## 去手笔背景完整提示词

Use case: precise-object-edit. Create a CLEAN ANIMATION BACKGROUND from this exact lifted-head hamster writing scene. Remove ONLY the viewer-LEFT writing pink paw, its short orange forearm below the cheek, and the ENTIRE green pencil including the cap and graphite tip. Reconstruct the small compact body's orange/cream fur behind the removed writing limb and the blank notebook paper behind the pencil tip. Keep the viewer-right resting paw. CRITICAL: preserve EXACTLY the lifted head, rounded chin, visible short chest between chin and paper, body height and seated pose. The chin ends near y800 and notebook begins near y875 on this 1316x1195 image: retain this visible chest separation. DO NOT lower the head onto the notebook, broaden the jaw, add a neck, change the face or restore a face resting on paper. Do not create any replacement arm, paw, extra haunch or bump. Keep all paper edges, spiral rings, right paw, cap, eyes, muzzle, fur, LEFT lamp and pencil cup, RIGHT mug/books, title and room framing as in the input. The original writing limb and pencil will be composited back as a moving foreground. Left notebook page stays blank. Same full frame/aspect. This is only the layer revealed behind the removed writing limb; no other edits.

输入：`scene-v20-lifted.png`。内置原输出`exec-0014f02d-203b-45d1-ac20-14c5400dee5f.png`，项目副本`writing-background-v20.png`。

最终验证：3.2秒96帧导出通过，起笔35×25粉爪中心与新原画RGB对应，选定纸页/已有声明/固定脸颊/纸页上缘/装订四帧不动检查通过。实际浏览器`preview-v20.html`加载并拖到3.1秒，截图为`preview-v20.png`；主页面两幕播放/暂停像素/九章切换/重播/拖动/结尾/减少动态及1440/390深浅布局通过，本机绘制抽样均值6.7ms。`git diff --check`通过，第一幕及根目录README/assets无差异。功能检查与视觉核对分开记录，不将它们当作用户确认。
