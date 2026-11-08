# 第二幕眼口：按第一幕的具体形状修订

2026-11-05。用户否定v26修订：“眼角你为什么修没了？……第一幕明显笑得更开”。上一轮把温暖误解成无眼角圆眼和小笑口，方向错误；v26不作为获认可的五官。

实际并排查看第一幕完整原画和眼口裁图：保留柔和短外眼角、圆弧上眼睑，以及露出红色口腔和两颗门牙的张开笑容。本轮以内置imagegen编辑expression-input-v26.png，以expression-reference-v26.png作角色参考。原始输出完整保存为[expression-edit-v27.png](expression-edit-v27.png)，合成输出为[scene-v27-current.png](scene-v27-current.png)。生成文件名exec-8e93763b-4dad-4ccb-959c-ee20dbe75b64.png，未使用API/CLI。

compose-expression.mjs只接入双眼和口鼻三个软区，其余头型、腮帮、手笔、环境沿用v26原画。旧合成脚本保存compose-expression-v26.mjs，旧动作脚本保存shot-v26.js；v26原图/动画均保留。固定index.html更新revision=27，无新增编号HTML。第一幕与线上内容未改。用户尚未评价本轮结果。

## 完整提示词

Edit image 1 (340x205 facial crop of chapter 2) using image 2 (chapter 1 approved face crop) as the precise character reference. Match the actual eye and mouth design of image2, not a generic cute round face. Preserve the eye centers, nose center and head angle from image1. Eyes should have the short soft dark outer corner / upper eyelid extensions seen in image2, gently rounded lids, warm brown irises, no sharp upturned fox eyes. Do NOT erase the outer corners into plain circular button eyes. Match image2's OPEN delighted warm smile: visible reddish mouth interior below the upper muzzle, two ivory front teeth extending down into the opening, rounded lower lip. The smile should be as open and expressive relative to eye size as image2; do NOT shrink it to a closed tiny smile. Keep pink nose and ivory muzzle, fine fur, existing lighting, whiskers and crop dimensions. Do not copy the book visible at the bottom of image2 into image1. Only change eye and mouth character design. Output single edited image1 facial crop, no text or comparison.


已重导出3.2秒96帧，选定固定区域与初始爪心检查通过；实际查看合成整图、原尺寸写完画面和两幕对照，外眼角与张开笑口已进入动作成品。手腕及纸页动作未改。冻结motion-v27.gif、native-finish-v27.png、character-comparison-v27.png。


## 用户追问眼间距与眼角朝向（2026-11-05）

用户仍觉得不如第一幕柔和，要求检查眼间距及眼角朝向。已制作eye-proportion-check-v27.png（上第一幕，下第二幕，同原画像素比例）。在1316×1195原图的各眼局部范围，按RGB<105/75/65的深色区域重心粗测：第一幕两眼间距166.6px、高低差6.7px、连线2.3°；第二幕171.5px、高低差21.6px、连线7.3°。这是深色区域重心，含眼睑且受透视影响，不是精确虹膜中心。间距只差约3%，更明显的差异是两眼连线倾斜；视觉上第二幕眼角转折也较刻意。两侧外眼角都向外延伸，没有左右反画。检查不等于证明柔和度全由眼间距决定；本次检查没有改动原画。
