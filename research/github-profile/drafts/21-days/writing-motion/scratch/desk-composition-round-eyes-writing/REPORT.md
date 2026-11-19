# 第二幕短书写候选

从 [3ffb295 的眨眼](../desk-composition-round-eyes-blink/REPORT.md)接续。仓鼠在当前纸面已有的 `i+` 后补写第二个加号和分号。收笔停在新的位置，单次 GIF 播到末帧后停住。

- [第二幕 3.2 秒 MP4](preview.mp4)
- [两幕 6.4 秒联播 MP4](pair-preview.mp4)
- [534px 单次播放 GIF](preview.gif)
- [534px 完整动作关键帧](review-only-writing-534.png)
- [原像素腮肩、前臂、手腕、握爪和笔尖连续对照](review-shoulder-grip-native.png)

[睁眼母版](../desk-composition-painted-rounded-upper-contours/candidate.png)提供完整起笔前肢，内置 imagegen 补绘[相邻的完整前肢姿势](painted-contact.png)和[移动后露出的局部底图](revealed-surface.png)。两幅前肢画的腮肩、肘部与腕部节点配准后做双向过渡。原画的粉爪与铅笔共用同一刚性变换，纸面按笔尖的接触区间累积新字迹。眨眼在 1.30–1.56s，覆盖加号末笔与下一笔的短抬笔。其余头部、印字和原场景取自母版。

Chrome 以 534px 宽播放两段 MP4 至结束，并检查了第二幕实际采到的 13 个时点，包括 0.833s 的第一笔中段、1.183–1.533s 的写字与眨眼中段和 2.817s 的收笔。FFmpeg 解码验证两段分别为 192 和 384 帧（60fps），联播前 192 帧逐帧与 3ffb295 一致，后 192 帧与第二幕独立文件一致。GIF 为 80 帧（25fps）。

仍可见的限制：原像素下，前臂毛束在两幅画的过渡中略软，腮下阴影在行笔中段略有变化。结束后握爪保持在抬笔位置，姿势停留较明显。候选待人工播放验收。

运行 `bash export.sh` 可重做视频、GIF 和两张对照图，使用相邻 scratch 的母版、原字迹及眨眼素材。

<details>
<summary>局部补绘提示词</summary>

### 相邻书写姿势

Image 1 is the edit target, a registered 4:3 crop. Image 2 is an annotation guide ONLY, never render cyan marks. Draw one independently painted adjacent contact pose of the same hamster's complete writing foreleg, from under the cheek to the wrist and pink gripping paw, still holding its same short green and gold pencil. Move the pencil tip left by about 22 original crop pixels (about 6% of width), down by 5, to the lower cyan circle. Move the pink paw center also about 6% of the image width left, slightly down, to the upper circle. Keep the pencil solid, its length and grip the same, its angle only slightly more vertical at most. Keep the same large rounded fluffy elbow, wrist volume, exactly the same location and natural occlusion at the cheek-covered shoulder; the elbow settles slightly down and forward under the weight as the wrist draws left. Preserve girth, soft fur detail, and the original cheek overhang, no visible shoulder repair seam, no anthropomorphic elbow joint. Preserve absolutely the face, fixed body, notebook contours, light, camera and framing, paper and writing. Extend paper or chest fur behind the old hand only where the moving parts uncover it. The look must be a minimal natural adjacent drawing by the same illustrator. Output a single exact registered image 1 crop with this new arm, no guides.

### 局部底图

In-place edit of the only provided image. It is a 4:3 crop from a storybook illustration. Produce a registered clean background plate underneath the movable writing foreleg. Erase only the viewer-left orange furry foreleg from immediately below the existing cheek to the pink gripping paw, the pink paw, and both exposed ends of the green and gold pencil, including its eraser. Reconstruct behind them in the original materials: unchanged gently bulging chest fur on the animal's right side and left of chest where plausible, the flat orange warm illuminated background on the far left, and existing cream paper with its soft warm original texture and exact notebook edge. Keep all present ink marks, all visible face and cheek fur above the original shoulder, other body areas, desk boundary, notebook edge, lighting and exact registration. No extra limb, no new objects, no added ink or letters. The edit is for a clean plate used only where the writing paw uncovers a few pixels, so the neighboring forms and textures must register to the original. Output one exact 4:3 crop; no panels or guides.

</details>
