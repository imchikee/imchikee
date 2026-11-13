# 恢复完整角色和连续书写

> 2026-11-11 清理：本文涉及的已否定方案文件已按用户要求删除，具体范围见 [清理记录](CLEANUP.md)。以下保留反馈、提示词及历史说明；旧文件名不再表示文件仍存在。

## 2026-11-10 肩部连接修订

用户要求继续。对照原画和活动蒙版，发现活动层仍从前臂中段x429开始，x430–490根部透明淡出，丢掉了原画连续肩部。候选将采样左界扩至真实体侧x324，取消根部淡出；x470以内仍固定。新短笔、握笔小爪、脸型/下巴、书写轨迹和时序均沿用，不再生图或修改手臂粗细。

先独立导出候选，实际看整幅中间帧及6.5秒实时播放14次采样；根点、爪笔距离、笔尖追踪检查通过。肩部不再依赖透明消失来连接，但这仍是现有原画的连接修订，不是完成全新骨骼动画或整幕验收。检查后接回固定入口。修改前源码、页面和检查图保留before-shoulder-continuity/。

用户否定四张局部关键姿态轮播，指出不断重复错误。轮播及其输出/脚本完整移存key-pose-playback-rejected/，截图feedback-key-playback-rejected.png。先恢复05dfb98/v66完整角色与连续动作，保留其下巴过渡及v64节奏。

随后内置imagegen仅针对握笔小爪和整支笔生成grip-pencil-candidate.png。运行时只取局部前景，底图仍v60与v66补底；笔变短、倾角变低、手指握姿调整，未整幅替换头脸。前臂仍沿用原有局部变形技术，**本轮没有完成新的动画制作方法，也没有解决所有肩臂自然度问题**。不同于v68，不旋转旧整臂，不拼接笔杆。

先在candidate.html和candidate-motion.js检查，render-sketch-motion.mjs新增--candidate，将截图输出到candidate-check/而非覆盖主预览。首次根点检查出现2.56px漂移，恢复原固定根点过渡后重查为0。实际查看整幅中间帧、正常尺寸页面及6.5秒实时播放采样；根点/爪笔距离/笔尖追踪检查通过。然后接回同一index.html。不得将检查或此次局部改善扩大为用户认可、整幕完成或发布。

## 内置生图实际提示词

```text
Precise localized edit of this exact full hamster illustration. Preserve face, cap, round cheeks, chin, torso, shoulder and forearm shape, right paw, notebook, and composition. Change ONLY the left pink writing fingers and pencil. Keep the hand at its current location, resting near the page, do NOT enlarge the forearm or move its silhouette. Redraw a relaxed small pencil grip with fingertips holding close to sharpened end. Draw a normal slender green wooden pencil tilted about 45 degrees to horizontal, eraser toward upper left, graphite tip touching the same point on paper. Shaft is one continuous straight object with uniform width before AND after the fingers; the short wood cone starts at full shaft width then tapers to graphite. No skinny needle segment, no disconnected axis, no brush grip, no fist. Shorten the pencil's overall length slightly so it is not oversize. Preserve everything outside the pink fingers and pencil. Painted warm style unchanged.
```

原件：/home/chikee/.codex/generated_images/01a1bb57-06e7-77b0-b28b-22ef7dbc15ee/exec-5cbe2d84-40b8-4da9-969a-170fa7457af4.png
