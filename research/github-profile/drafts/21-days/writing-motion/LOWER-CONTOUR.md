# 补回脸颊下缘

后续状态：本候选v18已被用户否定，条带拼接停止使用；当前完整底图方案见[WHOLE-BACKGROUND.md](WHOLE-BACKGROUND.md)。以下为保留的历史过程，不作为认可或当前方案。

2026-11-04，用户再次截图红框追问“这个脸颊下缘是不是少了一段”。复看两爪之间的完整轮廓，v17虽然去掉斜向色带，却把左中段下缘压平，中间到装订处有不自然的角折，不能把上轮局部色差修订当作完整下缘已修好。截图和旧源码/GIF/原尺寸结束帧在`cheek-edge-rejected/`。

本轮用内置imagegen编辑已有去手笔背景，补完整、浅圆的下巴弧度与细毛边，输出完整试图`chin-contour-edit-v18.png`。`compose-chin.mjs`只取x480–799/y790–895的脸颊下缘带，外缘逐渐淡入，输出`clean-writing-background-v18.png`；其余源背景沿用v16。首次接入的上沿过渡过窄，原尺寸查看有横带感，已将上沿渐变展开到45原画像素。装订第一环保护区x658–735/y873起不接入补片。

`build-region.mjs`改为550×266、原点(270,700)的样本，以覆盖两爪之间完整下缘。`shot.js`把新轮廓放在固定背景中，新弧线区域不再使用v17的5像素下移校正；手、笔、前臂蒙版、书写坐标和时序仍沿用整行`++i;`版。固定背景中的相同装订保护区使用原图，不让生成底图覆盖环。

`lower-contour-v18.png/gif`上修前、下修后，完整展示两爪之间的下缘，避免只看左手特写而漏看中间轮廓。本轮没有重画角色五官或第一幕，没有使用API/CLI。完整生成图有其他局部重绘差异，实际只接入上述窄带；不能称脸颊修补区与旧原画逐像素相同。原候选与生成提示词均保留，未发布，第二幕整体未获用户确认。

## 内置编辑完整提示词

Use case: precise-object-edit. Edit ONLY the underside contour of the hamster's cream cheek/chin in this exact clean animation background. The current lower cheek has an unnaturally straight cropped-off stretch above the central notebook and an angular interruption near the spiral. Restore a COMPLETE, shallow, softly rounded continuous chin contour beneath the mouth, connecting the lower left cheek to the lower right cheek. Fine cream fur must continue all the way to that organic curved edge, with a thin soft warm contact shadow separating the chin from the paper, no missing segment, horizontal rectangular crop, V-shaped cutout or dark pasted-on stripe. Keep it compact and cute, no longer neck, no larger belly, no new limb or lump. Work only in the narrow strip immediately above the back edge of the notebook, roughly x500–780/y820–880 on this 1316×1195 image. The lowest part of the shallow chin arc should remain above the first spiral ring and must not cover or move the rings. Preserve the notebook paper, page edges and rings exactly; preserve the resting right paw. Keep the eyes, nose, mouth, teeth, whiskers, ears, cap, body silhouette, left lamp, pencil cup, C++ mug, books, background, title and framing unchanged. This is a clean background plate: DO NOT add a writing hand or pencil; those are separate animation layers. Same full image and aspect ratio. Match the existing fine painted fur and warm lighting. No text added to the blank notebook.

输入：`clean-writing-background-v16.png`。内置输出：`exec-ac6b755a-e9aa-4965-8130-bad85e5e398c.png`，项目副本为`chin-contour-edit-v18.png`。

最终核对：实际查看正常整幅、原尺寸起笔/结束、12格连续帧及包含两爪之间完整下缘的上下对照，确认中段已接上，装订处不再呈缺口。3.2秒96帧导出通过；原粉爪中心对应、文字底图窗口外RGB、固定脸颊/纸页/声明/装订四帧检查通过。第一环与周围保护区(658,873)/78×30在原尺寸结束帧与原图RGB完全一致。`git diff --check`通过，第一幕及根目录README/assets无差异。此结果仍供用户视觉评价，未记为第二幕确认。
