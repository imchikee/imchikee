# 背景画风统一：手绘家具图层

用户在助手指出画风不统一、浅底动画像独立卡片后要求继续。仅统一背景质感与首屏衔接，保留剧情、角色、节奏及正文。内置imagegen，以当前春日关键帧为严格布局参考，以四季分镜为绘画质感参考，补一张透明家具图层。

输出：[room-plate-v2.png](room-plate-v2.png)，1586×992 RGBA，保留生成原样。窗外、屏幕、椰树和角色继续由已有动画控制；整页取消独立浅底矩形，使用透明插画与姓名区衔接。具体最终采用仍待用户反馈。

布局参考：[修订前春日帧](room-layout-flat-v1.png)；画风参考：[四季分镜](../../../../cpp-humor/storyboards/slow-build-seasons.png)。原始内置生成结果为exec-ecb6de4a-01d6-41d9-999d-b46060cc5ae8.png，仓库副本可独立重建。

## 提示词

```text
Precise style-transfer edit for one static animation room plate. Image 1 is the STRICT layout/camera target; image 2 provides ONLY the rich textured colored-pencil/gouache style.
Keep the original 960:600 canvas ratio and exact relative placement and perspective of the desk, chair, desk lamp, keyboard, mouse, monitor casing/stand and wall window frame. Do not recenter or rearrange objects.
Repaint those fixtures with tactile paper grain, warm brown pencil contours, shaded wood grain, brushed dark teal monitor casing and softly textured chair, matching image 2's hand-painted hamster and palm. Avoid flat vector blocks or photorealism.
Remove the hamster and ALL plants, pots, drinks and clothing completely, reconstructing the empty chair/desk behind them.
The entire window GLASS INTERIOR must be genuinely transparent: no landscape, sky, branches, sun, houses or glass fill. Keep only its wooden frame/mullion.
The entire monitor SCREEN INTERIOR must also be genuinely transparent: erase all letters, numbers, progress bar and screen fill. Preserve casing and stand. Animation content will be drawn behind these two openings.
Everything outside the retained fixtures must be genuine transparent alpha, including all wall, floor, empty chair gaps and surrounding space. No colored or white background, no ground plane, no rectangular paper backdrop, no checkerboard, labels or extra props. This is ONE transparent painted furniture layer, not a new scene or character variant.
```
