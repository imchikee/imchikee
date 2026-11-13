# v64：重画小爪与完整握笔结构

> 2026-11-11 清理：本文涉及的已否定方案文件已按用户要求删除，具体范围见 [清理记录](CLEANUP.md)。以下保留反馈、提示词及历史说明；旧文件名不再表示文件仍存在。

使用内置 imagegen，以 pose-study-v60.png 为编辑目标，生成 foreleg-v64.png。运行时只提取新前肢、小爪与整支笔；头脸底图仍为 v60，局部补底复用 sketch-cleanplate.png。生成图本身有细微全幅变化，未整幅替换基准。

旧 v63 源码、中间帧和播放采样保存在 sketch-motion-v63-rejected.js、sketch-motion-v63-rejected-middle.png、sketch-playback-v63-rejected.png。首次 v64 遮罩残留旧爪、夹带背景，已否决并保留 v64-first-mask-rejected.js/png。

## 当前结果与限制

小爪明显缩小，手指围住笔杆，短前肢向腕部收窄；整支笔与小爪同层移动，取消笔杆拉伸拼接和独立转笔。前肢根部固定，柔性过渡只用于毛臂；仍为平面草图动作，不是精绘或最终循环。动作仍偏平移，笔身倾角固定，不能称为完成的自然书写表演。

已用本机 Chrome 实时播放至 6.50 秒，查看整幅中间帧与 14 个连续播放采样，旧爪残留和第一轮尖角背景已修正。六阶段导出、重播通过；根点漂移、爪笔距离误差、笔尖追踪误差为 0。这些仅为实现检查，未获用户审美确认。

固定入口 index.html 已更新，完整主页仍为历史 v51；线上 README/assets、第一幕未改。

## 实际生成提示词

```text
Use case: precise-object-edit. Edit target: supplied v60 hamster writing illustration. Preserve its exact face identity, full round cheeks, eyes, mouth, cap, compact seated body, composition, notebook and warm sketch/painterly style. Redraw ONLY the foreground writing forelimb, pink paw and green pencil as one coherent anatomically believable structure. Replace the long horizontal sausage forearm and large clenched human fist with a SHORT tapered furry forelimb emerging naturally from the torso below the left cheek, a gently bent wrist resting close to the notebook, and a SMALL delicate hamster paw, about half the original paw mass. Show a few small curved pink digits wrapping around the pencil, not a ball/fist. Forearm softly tapers toward the paw with a clear natural wrist transition. Draw ONE straight continuous green pencil, eraser through shaft through sharpened wooden tip all collinear, held between the small digits, with tip touching the same notebook area. Maintain the cheek contour and body support, no floating limb, no added legs, no hole under cheek, no thick cylinder, no disconnected pencil segments. Preserve all other parts. Full image same composition.
```

原始输出：/home/chikee/.codex/generated_images/01a1bb57-06e7-77b0-b28b-22ef7dbc15ee/exec-b0a6247a-42b1-48f7-ba4a-993dc816a0fc.png
