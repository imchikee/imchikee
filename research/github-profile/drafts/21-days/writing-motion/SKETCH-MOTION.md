# v60 草图动作验证

用户阶段确认 v60 姿态后，明确担心动画，要求先验证短笔画动作，再精绘。

固定 index.html 现接 sketch-motion.js，有播放、重播和拖动进度。4 秒短笔画及回位测试，非整行代码或最终循环动画。前肢、爪、笔为同一原画图层，绕固定根部小幅转动，没有缩放；背景和纸页固定，新增笔迹按笔尖轨迹生成。当前回位是平面运动测试，尚未实现独立抬笔高度和完整书写节奏，不能当作成片。

直接局部网格变形会带动纸面，已弃用，保留 sketch-motion-mesh-rejected.js。采用内置生图生成补底 sketch-cleanplate.png，仅取前肢/笔周围的局部补底，原姿态图保留。遮罩与图层合成在动画源码中。

复用 render.mjs 的 Chromium/CDP 截图方式，新增 render-sketch-motion.mjs。实际查看起始、中间、结束、回位四阶段放大图及整页截图；清理了笔杆旁误带入的三角脸部块与浅色边。旋转根点到笔尖距离最大计算误差 2.3e-13 px，播放/重播检查通过。数值仅证明未缩放，不代表审美认可。第一幕、线上文件、完整主页历史动画未改。

## 补底实际提示词（内置 imagegen）

Use case: precise-object-edit. Create a clean background plate for animation from this exact sketch. Remove ONLY the viewer-left writing forearm, pink gripping paw, and the entire green pencil (eraser through tip). Reconstruct the small cream/orange body surface beneath the cheek where the arm was, and the unobstructed notebook paper where the tip was. Keep the round cheeks, eyes, smile, cap, other paw, body silhouette and all notebook writing absolutely unchanged as far as possible. No new limbs. This is an animation background plate, not a new pose. Same dimensions and framing, same watercolor pencil texture.
