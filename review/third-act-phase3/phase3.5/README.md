# Phase 3.5 · P1 V5 前肢按键

## 生成前分析

[P0 前肢与键帽标注](p0-analysis.png)

- **结构与比例。** 橙毛从胸腹处伸出，选 `(579, 821)` 一带作为固定根部，经过前臂中段 `(625, 827)` 连到橙白过渡处的腕部 `(676, 850)`。根到腕的投影约 100 px，杯口上方可见的前臂厚度约 50–60 px，爪面宽约 125 px。杯把后只露出 T1 内缘，T2 最宽，T3 次之，靠屏的 T4 投影最窄。沿 `y≈890` 观察的宽度约为 14、40、22、8 px，受遮挡与曲面影响。
- **可达范围。** 标注图描出可辨的键帽顶面及两组透视边。K1 的左半顶面 `(760, 926)` 处于中间趾瓣 T3 的整体落位范围。K2 须从 T2 原粉边再向下约 27–30 px。K3 向屏侧偏出，K4 至 K6 更靠前。V4 的差异集中在 `[689, 854, 759, 940)`，整爪姿态沿用 P0，约 27 px 的落差由单个趾瓣承担，导致它从爪团中突出来。
- **拟定姿势。** 固定根部和近端毛流，远端前臂接着腕部约向下走 14 px，四瓣连同爪面共同向下转约 7°。T3 一带先贴 K1 顶面，旁边各瓣随腕收拢，压出一小段贴面阴影。投影只用来估计可达性。绘制以 [P0](../p0.png) 为基准，杯把、电脑边缘、键盘和胸毛的可见背景作固定锚点。

## 静态验收

- [P1 V5 全图](p1-v5.png)，1380 × 1140 RGB。
- [P0 / P1 V5 同尺度对照](comparison.png)，每幅 534 × 441 px。
- [前肢整体 3 倍放大](forelimb-detail.png)，同一裁框 `[531, 766, 836, 951)`。
- [趾瓣与键帽 4 倍放大](contact-detail.png)，同一裁框 `[671, 877, 833, 950)`。
- [全图 RGB 差分](rgb-diff.png)，每个通道取绝对差值，黑色为三个通道都相同。

以 P0 固定底图，将 ImageGen 的完整前肢补绘配准到 `[480, 741, 900, 1021)`。为使中间趾瓣的底边贴合键帽透视，合成时让整组补绘的腕爪在图像平面微转约 3°。根部沿原毛流渐接。合成区域覆盖新旧前肢轮廓，原前肢退让处补出其原先遮盖的胸毛。杯把和电脑边缘用 P0 定位，接触阴影直接使用 P0 键面像素。

534 px 对照中，远端前臂、腕部和四瓣整体下沉，爪仍呈短圆的一团。放大可在 K1 左半顶面看到 T3 的粉色下缘和贴面描边。以 `(765, 924)` 为例，原键帽的 RGB `(141, 102, 91)` 被趾垫的 RGB `(196, 67, 37)` 覆盖。K1 右侧 `(797, 925)` 仍是原键面的 RGB `(175, 136, 117)`。

差异包围框为 **`[601, 775, 805, 934)`**（左、上含，右、下不含，204 × 159 px）。全图有 20,570 像素发生变化，剩余 1,552,630 像素与 P0 的 RGB 完全一致。图像为待人工静态验收的候选。

## GPT ImageGen 完整 Prompt

使用内置 GPT ImageGen。第一张输入是 P0 上述裁框的干净图。第二张是同一裁框上的位置导图，标明固定根部、整爪轮廓和 K1 键帽顶面。补绘原件的 SHA256 为 `ad3591bb12b10eea167ddd559360f9bfa548bc7c6a041cfd8d72ff3d67119971`。

```text
Use case: precise-object-edit. Image 1 is the clean P0 crop and the sole drawing base. Image 2 is the same crop with a positional guide only. Return one unmarked 3:2 local edit at the same framing, camera perspective, and scale as Image 1. The purple outline in the guide shows the approximate outer envelope of the entire lowered paw, not strokes to paint. The cyan point is the fixed chest-to-foreleg root. The gold outline marks an existing key top, with a point on the left half of that surface.
Draw one quiet keystroke with the complete short rounded hamster forelimb moving as one coherent structure. Keep the base buried continuously in the chest fur at the cyan anchor. Ease the distal forearm down into the broad orange-to-cream wrist. Lower the wrist approximately 14 pixels in the original scene (42 pixels in the supplied crop) and pitch the entire furry paw downward about 7 degrees together. All of its visible rounded toe lobes flex down as a compact group, keeping their original branching, count, width and curved transitions: the partially mug-hidden lobe, the wide near lobe, the medium middle lobe and the narrower screen-side lobe. The middle lobe's underside bears softly on the left half of the gold-marked key top. Show just enough overlap to read as contact with the top plane, with a short compressed reddish pad edge and tight, subtle warm contact shadow. Leave part of the same key top exposed.
Preserve the original forelimb length, thickness and plush rounded volume, the unbroken shoulder connection, fur direction, eye-level viewpoint, fine pencil grain, and warm brown contour. Move the palm and toes together without isolating, growing, pointing, or stretching any toe. Keep the arm low, with no elbow bump, cleft, joint ring, hard root seam, extra toe, or extra digit joint. Match the original orange, cream and pink rendering. The original mug and handle stay precisely in front as the same foreground occluder. Preserve the existing keyboard, key tops, computer border, fixed chest fur, lighting and crop. Affect the keyboard only by the new forepaw occlusion and contact shadow. Do not shift or add a key. Do not reproduce any annotations or text.
```
