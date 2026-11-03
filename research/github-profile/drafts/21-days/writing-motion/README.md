# 第二幕 · Days 11–21：More C++

## 最新：固定前臂根部，加入抬笔

2026-11-03，笔记本接续。前臂与手笔分开绘制：前臂根部固定在身体上，腕端以局部剪切跟随手掌，手和笔保持刚性。落笔从原画笔尖`(556,844)`附近开始，累计向右18原画像素；两次短暂停顿各有6原画像素以内的抬笔，墨迹只在落笔时延伸。笔尖与墨迹使用同一个位置。纸页使用固定底图，第一幕未改，没有新增生成图。

已重新导出3.2秒96帧GIF，实际查看起笔、抬笔、写字及停笔帧。正常显示尺寸下动作仍比较细小，当前供用户看播放效果，尚未确认自然度。以下各版记录为历史过程，以本节为准。

## 当前：前臂连接修订

用户再次截图指出拆层版效果仍有问题。上一版只裁手掌，偏移过大，与橙色前臂脱开；局部底图也留下接缝。现将橙色前臂一并加入手笔层，根部羽化，落笔收回到接近原画的`(548,858)`至`(557,858)`，动作幅度更小。背景改用完整`clean-hand-v1.png`以消除局部拼补接缝，因此与右侧静态原画有轻微重绘差异；**仅保证动画内纸页固定，不保证背景与原静态稿像素相同**。本轮未另生图，GIF/实际截图更新，仍待用户评价手臂连接和动作。

## 当前修订：纸页固定，手与笔独立移动

用户用1.52秒截图再次质疑效果：上一轮只是移动网格控制点，纸页被一起拉扯，笔杆姿态不自然，不能算修好。该网格版已停用，保存在`rejected-page-warp.js`，以下局部网格/挪坐标描述仅为历史。

内置imagegen单次从原画移除握笔左手及整支铅笔，保存`clean-hand-v1.png`。只通过原手/笔周围的小范围羽化遮罩补回原画，不整幅替换新生成图。用原画中的手/笔轮廓组成一个刚性图层，整体平移和小角度旋转，笔杆不再被拉伸；背景、纸页与原有文字完全固定。落笔位置约`(512,870)`至`(530,870)`，笔尖与轨迹共用接触点。显示中的手/笔位置相对静态原画不同是有意调整，连接自然度仍待用户评价，不宣称视觉定稿。

实际查看起笔/写字帧，GIF更新。以ffmpeg比较起笔和写字画面中两处纸面/书页边缘区域（显示坐标`60×30+95+355`、`30×30+235+345`），两处RGB像素均完全一致（PSNR inf），确认纸面不随动作拉伸；这不代表全部造型/动作已经获用户认可。第一幕保持原状。

### 移除手笔底图的完整提示词

Create a clean animation background plate from this exact scene. Remove ONLY the writing hand on viewer LEFT (the small pink paw gripping the pencil) and the ENTIRE green pencil, including its upper end in front of cheek and tip on page. Reconstruct the small orange forearm fur and ivory cheek behind the missing paw/pencil naturally. Reconstruct the original unbent cream paper and existing handwritten lines underneath the missing pencil tip. Keep the resting paw on viewer RIGHT. Leave absolutely everything else exactly in place: hamster face, whiskers, green cap, body outline, original book page geometry and edges, all foreground books, cup, left lamp, heading and scene framing. No shifts, no changing lights, no re-styling, no extra paws or pencils. Output the same full-frame image and aspect ratio; this image will be used ONLY through narrow local masks where the original paw and pencil were.

## 历史：仅移动坐标的修订（已被后续否决）
## 落笔位置修正

用户指出写字位置不对。原控制点近似为`(551,839)`，笔尖靠纸页边缘，笔迹还往页边延伸。已核对原画，将笔尖控制点改为`(556,844)`，把实际落笔起点移至页内`(516,862)`，结束于`(534,862)`附近。笔尖运动与新增墨迹共用`inkPoint()`，取消各自独立的坐标和两像素高度偏差，纸上最后一点始终接到当前笔尖位置。没有重新生图或改第一幕。实际查看修订后的起始/写字帧，GIF重新导出，整页直接使用更新模块。

2026-11-03，用户确认第一幕阶段版本后要求继续，推进第二幕，不重开第一幕修补。打开`index.html`看独立动作候选，或到`../index.html`拖到3.2—6.4秒。`motion.gif`为3.2秒/96帧/30fps。

## 画面与动作

按原第二幕布局：仓鼠伏案、左侧台灯、右侧C++杯、多本笔记。内置imagegen以第二幕分镜为编辑目标，第一幕批准的光影正面图为风格参考生成`scene-v1.png`；初稿白毛纹过粗，再做一次针对毛发的修订`scene-v2.png`。细节较初稿收敛，但与第一幕细腻程度仍有差别，尚待用户评价，不记为画风一致性已确认。

`shot.js`用单张原画的局部网格使手腕、握笔处、笔杆和笔尖连续变化：0.4—0.85、1.05—1.5、1.7—2.15秒三段落笔，最后停笔。纸上短笔迹按进度累积；没有给头脸做俯仰或假装拥有新增原画姿态。动作幅度较小，目前只表现写字，不把静止表情称为完整思考表演。固定控制点限制局部变形，主体与环境不整体摇摆。笔尖总位移约18原画像素（534宽显示约7像素），不是大幅挥笔。

主页统一控制第一、二幕；第三至九幕仍为分镜。`capture.mjs`增加第二幕不同时间实际截图变化和两幕切换检查，原播放/暂停像素保持/重播/拖动/结尾/减少动态及1440/390深浅布局通过。`render.mjs`已导出GIF并保存起始/写字截图，实际查看未发现明显手笔重复；不宣称动画自然度已获用户认可。第一幕原画、源码和GIF未修改。未提交、未发布。

重建导出：`node research/github-profile/drafts/21-days/writing-motion/render.mjs`。

## 初稿完整提示词

Image 1 is the EDIT TARGET, chapter 2 of a storybook hamster comic: DAYS 11 - 21 / More C++. Image 2 is the approved chapter 1 STYLE REFERENCE only. Create a high-resolution refinement of image 1 maintaining its exact composition: hamster centered behind open notes, green cap, pencil in the hand on viewer LEFT, free paw on viewer RIGHT, dark green C++ mug on right, many open books in foreground, desk lamp on LEFT. Keep target's determined studying expression, round small ears and plump cheeks. Match image 2's cute identity, delicate fine soft orange/ivory fur, short soft silhouette wisps rather than jagged long dark spikes, warm painted book/room texture, clear black eyes/tiny muzzle and coherent warm light. Light comes from the LEFT lamp in this target, unlike image 2: light left cheek/ear/paw and pages gently gold, right side soft warm ochre room bounce, never muddy gray-brown. Keep delicate fur: do not add broad cheek stripes, coarse hatching, shiny 3D fur or blur. Ensure the pencil has a single clear tip touching the notebook paper, with a natural visible wrist and paw grip, useful for animating small writing strokes. Preserve all target objects and positions, don't substitute chapter1's pose, book-holding hands or right-side lamp. Keep exact heading text 'DAYS 11 - 21' and 'More C++.' and mug 'C++'. One full scene same aspect ratio as image1, no panels/comparison/sprite sheet.

## 毛发修订完整提示词

Image1 is the second-chapter edit target, image2 is the APPROVED first-chapter finish reference. Correct only the fur rendering in image1 to match image2. Image1 currently has conspicuous thick white/orange streaks and long dark comb-like spiky fur around left cheek and both ears. Repaint these as delicate short fine soft fur, gently rounded cheek and ear silhouettes with only tiny sparse wisps, like image2. Keep face clear and cute, no blur or airbrushed feature loss, no broad stripes or mosaic paint. Make this correction visible in outer left cheek, forehead and BOTH ears; keep right cheek equally soft. Preserve image1 pose, determined eyebrows, facial features, green cap, pencil touching notebook, paws, books, cup, LEFT lamp and existing directional golden lighting. Do not copy image2 pose or room. Exact text DAYS 11 - 21 / More C++. Single full illustration, no grid.
