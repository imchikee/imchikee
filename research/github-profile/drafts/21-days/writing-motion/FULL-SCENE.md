# 第二幕完整场景与动画

2026-11-11。用户明确要求继续完成第二幕，白底动作稿只作造型和动作基准，不代表整幕完成。

本轮以内置 imagegen 绘制完整场景 [scene-finished-master.png](scene-finished-master.png) 和局部补底 [scene-finished-clean.png](scene-finished-clean.png)。保留第二幕自己的左灯、右侧C++杯与书堆、中央笔记本、前景参考书、书架；第一幕仅作完成度与绘本光影参考。角色姿态以当前白底起笔为参考，整幅重新绘制并统一左灯暖光，因此不声称旧角色像素完全不变。

scene-composite.js 将原4.90秒控制器的笔尖路径、六笔i++、前臂截面约束和无缩放手爪动作映射到完整场景。活动区域使用新场景原画的前臂/手笔像素，按原控制器网格变形；不是把白底图直接贴到房间。原控制器保留三原画资料，但新场景活动纹理来自这次完整原画的一张切片，不能称作重新绘制了三张完整场景关键原画。补底只通过活动区域局部蒙版合入，头脸、光影、场景和纸面其余位置固定。

已看正常尺寸两幕对照、整段实时播放采样、成片字迹放大。完整场景起止比较：活动区域外变化0像素，活动区域内12273像素变化；原动作几何及粗细检查通过。原白底完整版本和检查资料保留在 before-full-scene/。固定 index.html 已接完整场景动画，新成片尚未获用户审美确认。完整主页仍是历史第二幕，未更新或发布；未开展第三幕。

## 完整场景实际提示词

输入依次为 sketch-motion-start.png、scene-v38-current.png、../reading-motion/lighting/down-v2.png。

```text
Use case: compositing / finished storybook illustration.
Image 1 is the EDIT TARGET and exact hamster identity/pose reference (the white-background writing illustration). Image 2 is the required chapter-two ROOM AND PROP reference only; discard its older hamster. Image 3 is the rendering and lighting quality reference only; do not copy its room.
Create a finished chapter-two panel, aspect ratio 1316:1195. Compose the EXACT hamster, small hands, straight short green pencil and open notebook from image 1 into a complete warm study. Preserve image 1's facial expression, cheeks, cap, body proportions, rounded forearm, grip, notebook geometry and writing pose. Make room by uniformly scaling that entire character+notebook group to about 62% of its original dimensions and placing its original top-left at approximately (206,300) in the new panel. Do not redesign its anatomy.
Retain image 2's distinct setting: green articulated desk lamp on the LEFT, warmly illuminated wooden desk, pencil holder on left, green C++ mug and stacked books on the RIGHT, wooden shelves with books and small plant behind, open reference books at the bottom corners. The central notebook stays clearly visible. Header upper-left on a cream paper panel, exact text: "DAYS 11 - 21" then "More C++.".
Finish the hamster and environment together to the cohesive painterly quality of image 3: refined soft fur, rich but gentle warm light from the LEFT lamp, luminous ivory cheek fur, subtle cap-brim shadow, believable contact shadows on desk and paper, clear wood and paper textures. No white void behind the hamster, no pasted cutout edges, no strong orange filter, no blurry room. Keep the writing forearm full and naturally attached. Pencil tip touches the page; add no new writing besides existing light notebook marks. One finished full scene, not a sheet. Preserve the hamster from image 1; never replace it with either reference hamster.
```

原输出：/home/chikee/.codex/generated_images/01a1bb57-06e7-77b0-b28b-22ef7dbc15ee/exec-f02e45aa-2da9-4c35-8f5f-6ef4ee09d8e4.png。

## 补底实际提示词

输入 scene-finished-master.png。

```text
Edit this exact full illustration only for an animation clean plate. Remove ONLY the green pencil and the small pink writing hand and visible orange writing forearm in the lower middle-left (roughly x375–615 y775–900). Reconstruct the continuous cream chest behind the pencil and hand, and the wooden tabletop and notebook paper behind the removed forearm. Keep the body's left outline and all other parts of the hamster intact, no missing body or holes. Match the existing warm left-lamp illumination and paper/wood texture. Keep every other object, face, eyes, cap, ears, resting right paw, notebook, title, shelves, lamp, mug, foreground books, camera and exact composition unchanged. Add no ink, no new limb, no different pose. Same dimensions. This is a background layer only, NOT a new scene.
```

原输出：/home/chikee/.codex/generated_images/01a1bb57-06e7-77b0-b28b-22ef7dbc15ee/exec-3a781460-ef6c-4311-92af-0345f492b1e9.png。

