# 风格提案：圆润平涂的二维手绘卡通

**历史提案，当前不采用此方向。** 用户后续明确认为现有整页手绘稿不错，只是动画变差、毛发偏粗；当前以绘本式手绘为基准，不改成此处的简笔平涂。最新规范及角色表见[同风格角色基准](../model/STYLE.md)。

用户澄清头像接近简笔画，与先前彩铅风格不同，并要求助手先统一轮廓、上色等风格选择。以下是助手明确提出的一套方向，尚待用户评价，不等于用户已决定照搬头像或已采用该样稿。

样稿：`style-flat-v1.png`，由内置imagegen基于头像生成。它仅用于确认风格，未用于动作或替换整套九格。

| 项目 | 统一规则 |
|---|---|
| 轮廓 | 暖棕色、圆头圆角、略有手绘起伏；整块连续轮廓，无锯齿毛刺和外露关节拼接。 |
| 上色 | 奶白为主体，浅棕作头背色块，少量淡米色阴影；道具用低饱和小色块。 |
| 质感 | 平涂为主，最多一层浅阴影；不画逐根毛发、彩铅排线、密纸纹、厚重渐变及强烈反光。 |
| 造型 | 参考头像大白团子与小表情的比例；头腮和身体融为完整形状，小圆耳、小爪与极简脚。 |
| 五官 | 小棕色豆眼、小嘴，表情靠位置和简单弧线变化；不使用巨大的玻璃眼球。 |
| 道具 | 同样的圆线、平涂与简化体块；帽子、眼镜、药瓶不能占据角色重心。 |
| 场景 | 家具、书本和时间门一起遵循这套规则，避免简笔角色配写实道具或复杂彩铅背景。 |
| 动作 | 后续用完整姿态与连续轮廓变形表现抬手、喝药和迈步；不再把旧细毛部件直接拼到新造型上，也不把静态故事轮播称为角色动画。 |

内置imagegen提示词：

```text
Use case: illustration-story. Asset: a single character STYLE PROOF for a later 2D animated comic.
The attached avatar is the reference for simplicity, rounded shapes, small facial features and quiet color, NOT its lettering or exact pose.
Create ONE full-body cute HAMSTER as a clean, simple hand-drawn 2D cartoon, a refined continuation of this avatar. The entire character is one softly irregular milk-white dumpling silhouette: plump cheeks flow into the body without a separate large head, neck seam, human shoulders or waist. Tiny circular ears, tiny paw shapes, tiny separated forward-facing oval feet. The face is a SMALL compact cluster high on the body, with two little brown bean-shaped eyes and a tiny curved mouth; no large glossy eyeballs, detailed irises, conspicuous teeth or 3D muzzle.
The character holds one small round pale-blue potion bottle using two tiny paws with readable contact. Relaxed balanced pose, feet apart, no inward-pointing toes. Complete silhouette, generous margins.
STYLE LOCK:
- Warm muted brown outlines, rounded joins and caps, gently hand-drawn irregularity, uniform restrained weight.
- Smooth continuous rounded perimeter with NO fur spikes, serrations, sawteeth, pointed tufts or hair-by-hair texture.
- Flat solid color fills: mostly milk white, small light caramel-brown patches around the forehead/ears/back. Exactly one subtle flat pale beige shadow shape where useful. No blended gradients, painterly fur, pencil hatching, paper grain, heavy contrast or glossy rendering.
- Optional tiny simple green/cream cap to connect with the existing comic character; it must remain visually secondary to the dumpling shape and tiny expression. No glasses in this neutral base-style proof.
- Keep the playful slight asymmetry and soft hand-drawn expression of the avatar. It should feel like a simple charming cartoon that can squash and stretch, not a realistic furry animal or a detailed mascot figurine.
Flat pale warm ivory background (#faf5e9), no background scene, text, labels, borders, cast shadow, aura or vignette. This is ONE complete character, not a sprite sheet, storyboard, collage, icon grid or multiple alternatives.
```
