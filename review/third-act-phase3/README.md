# 第三幕前爪轻触试段 · Phase 3

## 查看

- [P0／P1 静态并排](comparison.png)，每幕显示宽度 534 px。
- [Canvas 预览](index.html) · [无损 APNG](preview.png)，3.90 秒／30 fps／117 帧。
- [起始 P0](../third-act-eye-study/p0.png)（0.000 s） · [接触 P1](contact.png)（0.967 s） · [回弹](rebound.png)（1.067 s）。1.100 s 完整归位为 P0。
- [腮下、肩部、前臂、爪尖和键盘边缘对照](detail.png)，三张使用同一原像素裁框。

## 方法与结果

沿用 Phase 2 的 `p0.png`，独立试段把双眼固定在 P0，以便单独看前爪。用内置 ImageGen 补绘同机位完整上半身接触姿势和一张相邻过渡姿势。将绘制的腮肩至爪以及接触阴影统一配准回 P0。外肩、腮上缘、杯把和电脑前景以 P0 锚定。Canvas 直接切换三张整帧姿势，按下和回弹复用同一张过渡画。

第 26–27、31–32 帧为过渡，第 28–30 帧为接触，其余帧为 P0（从 0 计数）。Chrome 实际以 534 px 宽播放至 3.900 秒，采到 P0 → 过渡 → P1 → 过渡 → P0。解码无损 APNG 的全部 117 帧，均与对应姿势 RGB 一致。头部和双眼、杯身和杯把内部、电脑背盖及键盘近侧前沿的检查区域与 P0 一致。Phase 2 的 13 个文件前后 SHA256 一致。

原像素对照中，腮肩没有显出分离、明显折角或切口，爪尖与键缘仍相接，杯把和笔记本的固定边缘对齐。轻触位于被电脑遮挡的键盘一侧，正常尺寸下适合判断一次轻触，键帽的独立下沉不可读。中间趾垫下缘的色边抽样从 P0 的 y≈904 到过渡的 y≈915、接触的 y≈917。过渡位置更靠近接触位，逐帧看尚能看到切换，以及前臂上缘局部笔触变化。结论限于这一次轻触试段，待用户视觉验收。

## 新增文件与复现

| 文件 | 用途 |
| --- | --- |
| `p1-upper-body.png`、`transition-upper-body.png` | 内置 ImageGen 的两张原始整姿补绘 |
| `contact.png`、`rebound.png` | 与 P0 配准并合成的原像素姿势 |
| `comparison.png`、`detail.png` | 静态并排和局部原像素对照 |
| `preview.png` | 无损 APNG |
| `build.py`、`index.html` | 合成导出与独立 Canvas 播放 |
| `README.md` | 记录 |

在本目录运行 `python build.py`，使用 Pillow 和 FFmpeg 重做列出的合成预览。正式整页入口继续使用原有资产。

<details>
<summary>内置 ImageGen 提示词与原件</summary>

源画参考裁框为 P0 的 `(270, 266, 1380, 1006)`，按左、上、右、下记录。

P1 原件 `/home/chikee/.codex/generated_images/01a20854-b1f2-7142-b658-26d99ed99b12/exec-056649ea-1922-481d-ba74-af3bcd9b44f8.png`

```text
Use case: precise-object-edit. Input image 1 is the EXACT locked pixel crop of P0 and is the edit target. Return one complete crop at the same 3:2 framing. This is P1, a very slightly different painted pose of the same complete upper body for a 2D animation, a single quiet keystroke. The original visible near front paw is partly hidden by the cream mug and is resting over the pale strip above the existing dark keyboard. Paint one tiny press: lower only the leading rounded toe nearest the screen onto the nearest EXISTING key edge, approximately 10–13 pixels downward in the 1110x740 input (1–2% of height), with virtually no sideways travel. Show definite soft contact and a very small contact shadow tightly underneath it. The toe is part of the original small plush paw, with the same count, width, roundness, orange/cream/pink transition and painted shading. Preserve the overall length and width of the forearm, its continuous gentle connection back under the cheek to the shoulder, and the existing fur direction. Render the shoulder, under-cheek, forearm, wrist, paw, contact, and shadow together at the same scale and in the same pencil paint. The rest of the paw stays gathered and the upper arm is supported; no slapping, pointing gesture, raised elbow, extra paw, extra digit, fingers, or stretching. Keep the laptop's thick dark diagonal edge in the exact same place and in front, and preserve the mug handle as the same foreground occluder. Retain the exact keyboard perspective and key locations; make no new keys. Lock head, eyebrows, original open eyes and gaze, face shape, nose, whiskers, cheeks, sweat drop, ears, cap, existing display reflection, cup, and background. No camera movement, perspective change, relight, rescale, crop, restyling or labels. Return the full coherent P1 pose in the original crop.
```

过渡原件 `/home/chikee/.codex/generated_images/01a20854-b1f2-7142-b658-26d99ed99b12/exec-37b92de7-0f30-4b80-a283-6f7110af45e4.png`

```text
Use case: precise-object-edit. Input 1 is the exact P0 crop and edit target; input 2 is a registered completed contact P1 crop and only a pose reference. Make ONE true drawn intermediate frame halfway from P0 to P1. Maintain pixel framing and phase 0 head, cheeks, green cap, fixed body proportions, original mug handle, existing keyboard and dark diagonal laptop boundary. The visible rounded forward paw should trace exactly the same very short downward path as P1, but go ONLY half the amount (about 4 native input pixels below P0, barely above P1), the very same toe contour and number of toes. Preserve the shoulder-to-forearm-to-paw as one continuous shape from the base pose, and keep its length unchanged. Keep the same soft low-contrast contact shading, lighter than in P1. Do not lift or separate the limb, stretch it, change the keypad edge or generate extra toes. Retain paper texture, fur strokes and lighting. Return one complete 3:2 crop in the framing of the input.
```

</details>
