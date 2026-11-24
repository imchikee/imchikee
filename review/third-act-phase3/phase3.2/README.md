# 第三幕前爪轻触 · Phase 3.2

沿用 Phase 3 的独立试段。分辨率 1380 × 1140，30 fps，共 117 帧，总时长 3.900 秒。双眼沿用该试段的 P0 姿势。

- [无损 APNG 预览](preview.png)
- [九格动作图](motion-strip-review.jpg)，每格宽 534 px，JPEG 质量 80。
- [P0、旧 P1、新 P1 静态对照](comparison.png)
- [腮下、肩部、前臂上缘与键缘放大对照](detail.png)

## 时间分配

帧序号从 0 计数。时间按帧序号除以 30 计算，区间右端为下一阶段起点。

| 帧序号 | 时间（秒） | 姿势 |
| --- | --- | --- |
| 0–23 | 0.000–0.800 | P0 |
| 24–27 | 0.800–0.933 | 落爪，沿用 Phase 3 的相邻姿势 |
| 28–33 | 0.933–1.133 | P1 接触，保持 0.200 秒 |
| 34–37 | 1.133–1.267 | 回弹，复用落爪姿势 |
| 38–116 | 1.267–3.900 | P0 |

轻触段共 14 帧（0.467 秒），原 Phase 3 为 7 帧（0.233 秒）。九格图可从第 0 帧（起始）、27 帧（接近接触）、28 帧（接触）、34 帧（回弹）和 38 帧（恢复）检查一轮动作。

## 接触修正与核验

- 以前一版的完整上半身 P1 为底图，使用内置 ImageGen 补绘同机位的上半身姿势，合成时仅采用趾垫底边及相连的接触阴影。落爪和回弹继续使用原整帧姿势。
- 在原图 x=730 处，前端趾垫粉色下缘从 y=917 到 y=921，约下压 4 px（534 px 显示宽度时约 1.5 px）。趾垫下缘略压平，紧贴键缘的暖棕色阴影略加深。整帧姿势沿用原坐标。
- 新旧 P1 的像素差异仅位于原图 `(692, 891, 756, 935)` 范围内（左、上、右、下，右下边界不含）。腮下、肩部、前臂上缘以及笔记本电脑的固定边缘保持原 P1 像素。放大图可检查趾垫的贴合与遮挡。
- 逐帧解码了 117 张完整 APNG 合成帧，RGB 均与对应姿势一致。第 0 帧与第 38–116 帧逐像素匹配原 P0。九格图取自解码帧。
- 534 px 宽的画面上，接触变化仍很小。逐帧可见三张整帧姿势的切换，独立键帽下沉无法从现有机位辨认。

## 源文件

基于 `1cdef76f7e9d2c5451abfc6da4f2165c04252640` 的验收素材。

| 源文件 | SHA256 |
| --- | --- |
| [P0](../p0.png) | `30c99af1ee1aeacf8029477745bd8496b146a43085444d0e800dfb541c3c914f` |
| [Phase 3 P1](../contact.png) | `412a0f166a321cfad1a23d8158ddd222ebe640d9d673195f70d415c8e054e127` |
| [相邻姿势](../rebound.png) | `7485e643f6ad1b591b0f2bc18343372fa32cebf1527d45e36946d26145d99776` |

<details>
<summary>内置 ImageGen 提示词</summary>

以旧 P1 的 `(270, 266, 1380, 1006)` 裁框为主参考，以原趾垫和键缘的放大图标示接触位置。补绘原件的 SHA256 为 `4bcc56ac063531faed6ec55724c01f4c19997a7bb323bca08303f2196690badf`。

```text
Use case: precise-object-edit. The FIRST image is the exact existing contact pose P1 and the sole edit target. Return ONE complete 3:2 crop in precisely the first image's framing and scale. The SECOND image is a magnified detail for locating the pad and keyboard only; do not reproduce that zoom. This is the same fully drawn upper-body pose for one very small keystroke. Change ONLY the underside of the lowest visible rounded pink toe pad beside the mug, where it meets the existing key edge. Its underside settles a further 3–5 pixels downward in the 1110×740 first image while its horizontal position stays fixed. Give the lower curve a very short, softly flattened contact segment, with a narrow, subtle warm dark-brown contact shadow directly under the pad. Think 1–3 pixels of shadow at source scale, a soft edge and a clear point of contact, not a new thick outline or a ring. Preserve exactly the original three rounded toe shapes and their outlines apart from that single lower contact segment. Keep the wrist, front leg length and fur, shoulder, lower cheek and entire upper-arm contour in the same location, with the very same fur texture and light. Preserve every existing key and the identical diagonal laptop edge, mug and handle, head, cheeks, eyes, cap, framing, color and lighting. No lateral motion, restyling, added parts, duplicate toe edges, raised elbow or stretched leg. Output the entire coherent first crop with this one restrained P1 contact adjustment.
```

</details>
