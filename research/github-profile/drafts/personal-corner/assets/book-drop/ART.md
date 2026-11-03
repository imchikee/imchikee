# 落书动画素材与提示词

使用 **内置 imagegen** 生成三个独立的透明 PNG 图层。书本沿用此前青绿封面及 C++ 字样；仓鼠以原头像和新立姿为参考，重新明确鼓腮、短胡须、粉色小鼻子、门牙与眉眼。原头像、旧插画均未覆盖。

## 保存的原画

|文件|用途|
|---|---|
|[book.png](book.png)|书本图层|
|[hamster-upright.png](hamster-upright.png)|抬头察觉的立姿|
|[hamster-squashed.png](hamster-squashed.png)|压扁后硬撑比赞|

动画由 [book_motion.py](../../book_motion.py) 组合图层与控制时间，不是让图像模型自由生成整段视频。PNG 原画保持不变；构建时只读取透明边界，用 SVG 的位移、缩放、遮罩和分层表达落下、压缩、抬头和抬爪。

[查看可暂停的动画](../../animation.html) · [最终 GIF](scene-light.gif) · [落地表情](poster.png)

一轮约 7.2 秒：抬头察觉 → 加速落书 → 短促挤压与回弹 → 露出挤眼、歪眉和冒汗的脸 → 稍停后比赞 → 保留笑点片刻 → 回到开场。GIF 实际编码为 65 帧，包含长短不同的停顿。

## imagegen 提示词

### 书本图层：book.png

```text
Precise-object edit for an animation layer. From this reference retain ONLY the single closed teal C++ textbook, in exactly the same three-quarter perspective with its cover clearly visible, thick cream page block, muted teal cloth cover, gold decorative border and large cream "C++" lettering. Remove the entire hamster, paws, all floor shadows and surrounding glow. Reconstruct the small book edges previously hidden by the hamster so the book is complete and coherent. Keep the existing tactile hand-painted gouache texture and confident warm brown outlines. The book is the only object. Center it on a genuinely transparent 3:2 canvas, all book edges inside with modest transparent margins. No ground plane, no cast shadow, no extra text or props. This independent cutout will fall straight downward in a cartoon animation.
```

### 抬头察觉的立姿：hamster-upright.png

```text
Use case: illustration-story, independent animation character layer. Image 1 is the original avatar identity reference; Image 2 provides the hand-painted gouache style and cream/brown palette. Draw ONE unmistakable HAMSTER, isolated on genuine transparent alpha, full body upright, front three-quarter view, no book. Make it clearly a hamster rather than a bear: oversized paired round cream-white cheek pouches, tiny pink triangular nose, three short fine whiskers on EACH cheek, two small upper incisors just visible, separate tiny round glossy dark bead eyes, small round ears with pink centers, a short muzzle and compact pear-shaped plump cream body. Keep the reference's warm brown crown/back patches, cream-white belly and cheeks, organic brown contours and tactile paint texture. No long tail, no large oval bear muzzle, no big dark face patches that can be confused with eyes. Design an anticipatory expression: pupils glancing upward, slightly raised brows, tiny surprised O-shaped mouth, paws tucked near chest as it notices something overhead. Small feet visible. Keep face and cheeks large and readable at thumbnail size. Center the whole hamster on a square transparent canvas with a little clear margin, no background, shadow, vignette, labels, props or other characters. This is the upright BEFORE pose for a harmless squash-and-stretch book-drop gag.
```

### 压扁后硬撑比赞：hamster-squashed.png

```text
Create the AFTER pose for a squash-and-stretch animation, using Image 1 as the exact HAMSTER identity and paint-style reference. Image 2 supplies the flattened-body/ thumbs-up staging only; replace its vague bear-like face with the unmistakable hamster from Image 1.
One full hamster, isolated on genuine transparent alpha, with NO book. Its cream body is comically flattened into a wide horizontal soft pancake, but its big distinctive head peeks up in front, still recognizably round and hamster-like. Preserve the paired bulging cream cheek pouches, tiny pink triangular nose, short fine three-per-side whiskers, two tiny upper incisors, small round pink-centered ears, separate dark bead eyes, and warm brown crown/back markings. No giant dark eye patches or bear muzzle.
Design the expression deliberately: one eye squeezed halfway shut, the other giving a tired side glance; one eyebrow higher than the other, a crooked strained little smile showing the two small incisors, one small sweat bead by the brow, and slightly bent whiskers. It is unhurt and trying to look composed after a ridiculous mishap. This is comic embarrassment, not suffering.
One tiny paw sticks up in a clear thumbs-up on a narrow raised arm, entirely to the RIGHT of the head and OUTSIDE the main body silhouette, with clear transparent space around it. The other paw rests at the front ground edge. The body extends to the LEFT; the head is slightly RIGHT of center, approximately 60% along the full silhouette. Make the head and thumb large enough to read small.
A compact wide silhouette about 3:1, centered with transparent margins on a landscape canvas. Body flattened, head not crushed into an unrecognizable blob. Keep Image 1's tactile warm gouache texture, organic warm brown contours and cream/brown palette. No book, props, captions, extra characters, floor, glow or vignette.
```
