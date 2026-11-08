# 第二幕眼位与眼角修订

2026-11-05。用户要求根据眼间距/眼角检查继续修订。v27粗测两眼深色区域间距171px、高低差22px，第一幕约167/7px；优先减少高低差，放柔眼睑与眼角转折，不继续缩小笑口。

内置imagegen以expression-edit-v27.png为编辑目标、expression-reference-v26.png为第一幕参考。完整原始输出保存[expression-edit-v28.png](expression-edit-v28.png)，生成文件exec-9066e3ed-4e73-4246-8676-be5bed9ea0e2.png。仅用两处眼部软蒙版合成到scene-v27-current.png，输出[scene-v28-current.png](scene-v28-current.png)。未接入生成图嘴巴部分，沿用原笑容、角色轮廓、手笔和第二幕场景。旧脚本保存compose-expression-v27.mjs和shot-v27.js，历史素材保留。固定预览revision=28，无新编号HTML。未使用API/CLI，未发布，尚未获用户评价。

## 完整提示词

Image1 is the target face crop. Image2 is the approved same hamster character reference. Edit ONLY the TWO EYES and immediate eyelids of image1. Make their center-to-center line much more nearly horizontal like image2: move the viewer-left eye down a little and viewer-right eye up a little, preserving horizontal spacing and eye sizes. In image1's normalized 340x205 coordinates, shift left eye down 7 pixels and right eye up 7 pixels, reducing their vertical difference from about22 to about8pixels. Preserve natural slightly unequal eyes, do not mirror them. Match image2's soft curved upper lids, SHORT gentle outer corner extensions and warm brown gaze. No sharp angular eye corners, no long pointed eyeliner or foxlike upward flicks. Keep identifiable soft eye corners; do NOT turn into plain circular button eyes. Preserve image1's nose, open smiling mouth and two teeth EXACTLY; do not shrink or redraw the smile. Keep whiskers, fine fur, lighting and composition fixed. No book from image2. Output one edited target crop same aspect ratio.


v28深色眼区重心粗测：间距169.6px，高低差2.0px。方法同v27，含眼睑，不是精确虹膜中心。已完成3.2秒96帧导出及选定固定区检查，实际查看原尺寸合成整图与导出两幕对照。
