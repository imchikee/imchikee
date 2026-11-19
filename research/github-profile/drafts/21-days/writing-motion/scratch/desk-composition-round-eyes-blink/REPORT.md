# 第二幕圆豆眼眨眼适配

睁眼取自 [6eff3e6 的静态候选](../desk-composition-painted-rounded-upper-contours/candidate.png)。沿用[旧闭眼补绘](../desk-composition-painted-blink/registered-lid.png)，按新版双眼提取开口，并补足旧遮罩在两眼上缘漏出的区域。半睁时让补绘的睑缘随曲线移动，下侧从闭眼画的接缝下方取样，以保留一道连续睑缘。第二幕只有一次眨眼。

- [第二幕 3.2 秒 MP4](preview.mp4)
- [两幕 6.4 秒联播 MP4](pair-preview.mp4)
- [534px 九阶段](review-blink-534.png)
- [原像素眼部闭合与恢复](review-eyes-native.png)
- [两幕关键表情并排](review-key-expressions.png)

视频为 60fps，第二幕 192 帧，联播 384 帧。FFmpeg 逐帧解码核对，联播前 192 帧与上一版相同，后 192 帧与本轮独立视频相同。两段视频均以 534px 宽在本地 Chrome 播放至结束。表情对照的第一幕取联播解码帧，第二幕取 Chrome 实播样本。

本地检查了 534px 半睁画面与原像素九阶段，闭合时眼球完全覆盖，恢复时睁眼画面与新版母版 RGB 一致。逐帧差异限于两处眼周遮罩。在原像素放大下，临近闭合仍可看见短暂的深色眼缝。候选待人工播放与视觉验收。

复现使用 `bash export.sh`。依赖 Pillow、FFmpeg 和 Noto Sans CJK，沿用相邻 scratch 中的注册素材和第一幕视频。
