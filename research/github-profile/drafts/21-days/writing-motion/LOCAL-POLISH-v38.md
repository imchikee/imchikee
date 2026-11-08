# 第二幕三处局部完善

2026-11-06。用户对v37说“这一版整体尚可”，要求完善标出的左眼眼缘、握笔处和左腮外沿。该反馈是整体造型的阶段正反馈，不代表发布或全部动画细节获认可。本轮锁定v37脸型、头身比例、表情与姿态，只做局部完善。

用户随后澄清左腮外沿是“好像有重影的感觉”，不是毛发长短。助手此前误判为毛发粗长，生成的rim-fur-v38-unused.png已弃用、不接入；原输出与提示词仍保留。

## 实际修订

- 左眼：内置编辑眼缘裁图，收窄虹膜上方偏宽灰白弧，局部软区合成，不改整脸。[eye-comparison-v38.png](eye-comparison-v38.png)左旧右新。
- 握笔：原手笔前景蒙版把笔杆后的脸颊毛色误当作拇指带入，形成随笔移动的棕色块。移除该前景区域，并收紧笔杆右缘蒙版，保留粉爪、笔尖、动作轨迹和纸页。[grip-comparison-v38.png](grip-comparison-v38.png)左旧右新。
- 左腮：比较旧底图、v37完整生成原画与最终合成，旧底图和新轮廓在原头部柔边处叠加。沿外沿窄带同时覆盖新旧边界位置，直接采用head-edit-v37.png的同版轮廓，过渡放到轮廓之外，不重画毛发/光照。[rim-source-check-v38.png](rim-source-check-v38.png)依次为旧底图、v37生成原画、旧合成；[rim-comparison-v38.png](rim-comparison-v38.png)左旧右新。

输入截图保存feedback-v37-marks.png、feedback-v37-rim.png、feedback-v37-rim-clarified.png。眼部编辑原始输出eye-edit-v38.png，原文件exec-c4a9ed30-e2ce-4a72-81e2-2477998d1ec2.png；未采用的毛发编辑原始输出rim-fur-v38-unused.png，原文件exec-b8193475-99d5-4c9c-adf7-97724f35ebaa.png。均为内置工具，没有使用API/CLI。

当前[scene-v38-current.png](scene-v38-current.png)，固定index.html使用revision=38，无新编号HTML。旧脚本compose-expression-v37.mjs、shot-v37.js及v37原画/GIF完整保留。第一幕和线上README/assets未改，未发布。本轮局部结果尚未获用户评价。

## 采用的眼缘编辑完整提示词

Image1 is a close-up edit target of the hamster's viewer-left eye. Image2 is the approved same character eye reference. Change ONLY the overly broad pale gray/white crescent between the upper-left eye rim and brown iris in image1. Make this crescent much narrower and softly warm-shaded, like the delicate sliver in image2. Preserve the existing iris, black pupil, catchlight, eye opening size/position, short gentle outer corner, nose and all fur EXACTLY. Do not erase all sclera, enlarge the iris, create a hooded eyelid, or change expression. The result should be a natural thin warm eye-edge transition, not a broad pale eyelid pad. Output one edited image1 crop same aspect ratio.

## 未采用的毛发编辑完整提示词

Edit ONLY the highlighted outer cheek fur in this crop of a storybook hamster. The long bright yellow/white wiry strokes along the cheek silhouette look coarse and spiky. Repaint this rim as SHORT, fine, soft orange-gold fur tips matching the fine fur inside the cheek, with restrained warm rim light. Preserve exact round cheek silhouette and cheek volume; do not shave it into a smooth hard edge, change its width or add a bulge. Reduce lemon-yellow saturation and long individual white strokes; retain natural warm LEFT-lamp lighting, soft tiny wisps and clean painted texture. Keep background/lamp glow, pen cup fragments and all other crop objects exactly in place. No blur or airbrushing. Output one edited crop same aspect ratio.


已完成3.2秒96帧导出，原手心和选定固定区域检查通过；实际查看独立手笔层、三处同尺度修改前后对照、起笔/写完和原尺寸面部阶段图。动画中笔杆旁不再携带原棕色块。冻结motion-v38.gif、native-finish-v38.png、character-comparison-v38.png。第一幕/线上README/assets无差异。
