# 第二幕 · 3.2 秒自然眨眼

**视觉自查通过，可交人工验收。** Chromium 以 534px 宽完整播放了第二幕 Canvas 预览和 6.4 秒联播。实播采样中，双眼快速闭合后较慢睁开，随后恢复同一视线与短笑。半睁冻结放大时，眼睑上边稍直，闭眼毛纹略亮。正常尺寸的播放采样未见硬贴片边、第二道睫毛或明显错位。[眨眼各阶段](blink-review.jpg) · [534px 联播实播采样](review-pair.jpg)

联播于 3.2 秒直接切换。两幕的绿白帽、亮圆眼和橙白圆腮保持角色辨识度。第一幕抬头和表情变化更活泼，第二幕暖色更浓、笔触稍细，伏桌看笔记配合一次眨眼，形成较安静的停顿。[联播](pair.html) · [联播 MP4](pair-preview.mp4)

动画直接加载 b0db8a7 的 [已带字原画](../gentle-smile-soft-rim/candidate.png)。核对该 PNG 与留白图叠加既有 [程序化墨迹](../reading-identity-static/print-layer.png) 的 RGB 结果逐像素一致，差异范围仅在纸面。字迹始终是底图的一部分。

复用 Pose B 的 Canvas 播放、软化边缘的材质配准和 Chromium/FFmpeg 导出，并核对了 more-cpp-finish 的同类流程。基于本图的 [338×148 眼部裁框](eye-reference.png) 调用一次内置 imagegen，保留了[闭眼源图](closed-raw.png)与[提示词](BLINK-PROMPT.txt)。双眼作用范围和闭合曲线按本图重新登记。动画改变眼睑开口而保留其下原始眼球位置。1.300–1.385 秒合眼，1.385–1.415 秒全闭，1.415–1.560 秒睁开。

无损 PNG 的 [起始](start.png)、[恢复睁眼](middle.png)和[结束](end.png)与 b0db8a7 原画逐像素一致。[完全闭眼](blink.png)与其余抽样阶段中，双眼登记范围外的变化像素数为 0。[像素核对](scope-check.json) · [JPEG 关键帧](review-keyframes.jpg)

播放、暂停、跳转和重播已在 Chromium 核对。第二幕 MP4 为 30fps、96 帧，1316×1196，底部补 1px。联播使用第一幕现有 Canvas 源码，30fps、192 帧，534×486。两个视频均完整解码通过，三张 JPEG 均小于 400 KB。[交互预览](index.html) · [3.2 秒 MP4](preview.mp4) · [控件记录](controls-check.json) · [联播记录](pair-playback-check.json)
