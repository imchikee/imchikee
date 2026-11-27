# 第三幕眼部动作试段 · Phase 2

## 静态基准

下载目录中与第三幕标题和构图吻合的完整候选是 `/home/chikee/下载/仓鼠程序员的温暖工作日.png`，下载时间为 2026-11-23 22:29（上海时间）。在本试段使用其同字节副本 [p0.png](p0.png)。为 **1380 × 1140 RGB**，SHA256 为 `30c99af1ee1aeacf8029477745bd8496b146a43085444d0e800dfb541c3c914f`。下载文件未编辑。

## 交付

- [Canvas 预览](index.html)，打开后点击播放。原生画布 1380 × 1140，正常显示宽度 534 px，独立使用 `draw(localTime)`。
- [无损 APNG](preview.png)，**3.9 秒、30 fps、117 帧**，一次播放。
- [首帧](first.png)（0.000 s）、[闭眼](closed.png)（1.533 s）、[恢复](restored.png)（2.467 s）。

0–1.25 s 保持 P0 注视电脑。约 1.43–1.67 s 使用同机位半闭、闭眼、半闭素材合成一次眨眼，随后恢复 P0。约 1.97–2.30 s 在原眼球内叠加极轻微的视线试样并返回 P0，保留原高光。2.45–3.90 s 保持原始专注状态。视线变化在 534 px 播放尺寸下很轻，适合拖到 2.10 s 和首帧比较。

## 验证

- Chrome 逐帧检查 117 帧，眼区 `[692,588,773,661)` 与 `[865,577,937,650)` 以外变化 **0 像素**。首帧、眨眼后恢复和最终恢复均与 P0 的 RGB 完全一致。
- 对最终 APNG 解码后独立复核 117 帧。固定区域仍为 **0 像素差异**，三张 PNG 分别与第 0、46、74 帧相同，帧号从 0 起算。117 个帧延迟均为 `1/30 s`。
- 本地 Chrome 以 534 px 宽实时播放至 3.900 s，查看了半闭、闭眼、恢复和视线调整的样本。局部眼睑保留绘制的边界，眼外无运动。试段待用户视觉验收。

## 文件与复现

本轮新增文件均在此目录。

- 原画副本和补绘输入 `p0.png`、`half-lid-source.png`、`eyelids-source.png`、`gaze-source.png`
- 素材与代码 `eye-frames.png`、`prepare.py`、`index.html`、`export.mjs`
- 验收输出 `preview.png`、`first.png`、`closed.png`、`restored.png`、`README.md`

Pillow 配准补绘并压进局部眼区限定遮罩，Canvas 每帧先画 P0 再叠对应眼区。项目正式入口只读。使用 `python prepare.py` 重做局部图集，用 `node export.mjs` 运行本地 Chrome 核验并导出。需要时用 `PROFILE_CHROME` 指定 Chrome 路径。

<details>
<summary>内置 ImageGen 局部补绘记录</summary>

输入为 P0 的 `(592, 449, 1042, 749)` RGB 裁切，按左、上、右、下记录。根据原图坐标注册素材后，只采双眼区域。内置 ImageGen 原始输出分别为：

- 半闭眼 `/home/chikee/.codex/generated_images/01a20854-b1f2-7142-b658-26d99ed99b12/exec-5a2ba8e2-1243-46f4-b56f-eb37dcd988b2.png`
- 闭眼 `/home/chikee/.codex/generated_images/01a20854-b1f2-7142-b658-26d99ed99b12/exec-d475382c-1ee0-4f81-9548-9d54948e5d8b.png`
- 视线 `/home/chikee/.codex/generated_images/01a20854-b1f2-7142-b658-26d99ed99b12/exec-86e50ed3-80df-4417-9f20-7cdd90146907.png`

半闭眼请求

```text
Use case: precise-object-edit. Input 1 is the EXACT 3:2 crop of a painted hamster and the edit target. Paint one mid-blink frame in this EXACT crop: both eyelids are HALF closed, the upper lids come down to roughly the middle of the current open eyeballs, partly hiding the pupils. Preserve the bottom edge and width of each eye, draw a soft continuous natural upper lid edge attached at the outer and inner corners. The portion of the pupil still visible keeps the iris texture and apricot lighting of the input. Do not change gaze direction or make a wink. Keep exact framing, scale and expression during this fleeting transitional action. Both eyebrows, the fur outside the eyes, nose, mouth, whiskers, cheeks, sweat drop, ear and cap edges, and laptop stay like the source. Do not add any objects or text. Return one whole registered crop, not a second actor or panel. This will only be sampled from a mask around the two eyes.
```

闭眼请求

```text
Use case: precise-object-edit. Input 1 is the exact pixel crop to edit, a 3:2 animation eye reference, not an inspiration. Return the same full crop with identical framing, scale, and features. Edit only the two eyes: the same hamster is fully closing both eyelids in one moment of a natural quick blink. Paint a single delicate continuous dark-brown closed lid line per eye, around the resting lower half of each original eye (left a few pixels below right as in the source). Completely replace both dark open eyeballs, pupils and highlights with same local warm soft colored pencil fur and closed eyelid anatomy, matching the source at the top and bottom, with no trace of the original upper eyelash line. Keep both short brown eyebrows exactly as in the source, and all fur outside the open eye areas, cheeks, highlights, nose, mouth, whiskers, sweat drop, computer corner and position exactly unchanged. The eyes stay the same width as the open eye silhouettes and the curved seams are relaxed, not shut tight. Do not zoom, move facial features, crop, stylize, texture-smooth, add text, or create alternate versions. Editorial raster reference for a pixel-registered masked composite.
```

视线请求

```text
Use case: precise-object-edit. Input 1 is the exact pixel crop to edit, a 3:2 animation eye reference. Return the same full crop, identical framing, size, shape, original open eyelid silhouettes, eyebrows and fur. Adjust ONLY the direction of the existing two dark pupils by a very tiny amount toward screen-right and slightly down toward the laptop, equivalent to 2 to 3 pixels in the supplied 450x300 crop. Keep the pupils round, the same size and outlined shape, brown iris colors and painted details. Keep the highlights in the same place to preserve the warm light. Preserve nose, mouth, whiskers, sweat drop, cheeks, hat, laptop corner and every other feature. No facial expression change, no eye enlargement or narrowing, no camera or crop changes, no stylization. This is a subtle local pupil repaint plate for a registered original illustration, with no additional objects or text.
```

</details>
