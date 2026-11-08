# 整行书写：从只写括号改为逐笔写出 ++i;

2026-11-04，用户反馈“没看出来有什么变化”。复核发现文件已更新，但v15只在很小的文字区域调整排版、写出一个括号，正常尺寸变化太弱；没有证据确认用户客户端是否缓存，不将问题归因于缓存。

本轮改为上行已有`int i=0;`，动画逐笔写出整行`++i;`。包含8个接触笔画，0.30–2.62秒书写，各笔画之间真实抬笔空移、不连线；2.62–2.95秒结束抬笔，保持到3.2秒。横向接触位置范围约44原画像素（534宽显示约18像素），整行高约18原画像素，笔尖和字迹逐点共用轨迹。新底图`scene-v16-writing-line.png`，静态手写声明在`notebook-declaration.svg`。

第一轮扩大原局部逆向采样后，纸页上缘和装订附近被拉扯，实际看连续帧后否决，源码/画面保存在`small-writing-rejected/full-line-page-warp.js`、`full-line-page-warp.png`。随后用内置imagegen补出去手笔背景，保存`clean-writing-background-v16.png`；不调用API或CLI。仅通过原手笔和前臂周围的局部蒙版接入生成底图，不整幅替换。生成器的其他重绘未接入；局部毛发、原手下方的背景和纸面有生成补绘差异，不能称这些区域与v12逐像素相同。

原粉爪/铅笔作为独立前景，手笔保持刚性；橙色前臂用单调变形连接固定根部，粉爪边缘与毛发分别处理。采样区为440×266、原点(270,700)。纸页/装订/脸主体作为固定背景，不再随手移动。原v15及源码/数据/GIF/核对图保留在`small-writing-rejected/`，原图与所有旧候选保留。`comparison-v16.gif`及`comparison-v16.png`均为左旧版、右新版，使用新文件名便于打开本次明确的对照。

实际查看正常整幅、原尺寸起笔/中段/结束及12格连续帧。新版仍属于第二幕候选，不将功能或像素检查当作自然度认可。第一幕与线上根目录README/assets未改，未发布。

## 内置编辑完整提示词

Use case: precise-object-edit. Edit this exact illustration into a clean animation background plate. Remove ONLY the small pink writing paw on viewer LEFT and the ENTIRE green pencil it holds, including the cap in front of the left cheek and the tip on the left notebook page. Remove the protruding orange forearm immediately behind this writing paw, restoring the compact hamster's natural orange lower body and softly rounded ivory cheek behind it, with no replacement hand or protruding lump. Continue the notebook's pale blank left page and its straight upper edge naturally beneath the removed paw/pencil; retain the original paper perspective, shape, rings and texture. Keep the resting right paw. Preserve EXACTLY the face, eyes, nose, teeth, whiskers, cap, silhouette, all background books, left lamp, pencil cup, right mug, title and framing. Same full-frame image and aspect ratio. No new objects, no additional paws, no new writing on the blank left page. The original hand and pencil will be composited back as a moving animation layer, so this is ONLY the clean background revealed behind them. Do not redesign the character or move any other object.

输入为`scene-v16-sampling.png`，原输出保留在Codex generated_images中的`exec-c0fb2bde-ea30-4dfa-a232-ce0393fbb3ff.png`，项目副本为上述clean背景。

最终验证：3.2秒96帧导出通过，起笔粉爪中心60×35区域与原画一致；文字底图在原两个编辑窗口之外RGB保持v12（这项仅检查文字底图，不代表生成背景合成区与旧原画一致）。选定纸页/静态声明/纸页上缘/装订区域在四个关键帧RGB一致。完整主页两幕动作、暂停像素、九章/重播/拖动/结尾/减少动态与1440/390深浅布局通过。实际看过正常尺寸新旧并排图、手部起笔/完成、作者视角与12格连续帧，GIF对照已生成；第一幕与根目录README/assets无差异，`git diff --check`通过。
