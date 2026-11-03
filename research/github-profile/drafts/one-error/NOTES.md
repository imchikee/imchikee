# 只有一个错误：连续动画与本地整页候选

2026-10-31 同步减重：SVG与动画HTML改为相对路径引用已有PNG，不再在六份文件中重复内嵌同一批原画。生成脚本已同步，GIF整页预览保持，实际检查三张共享原画加载及暂停/拖动功能。独立SVG需与其素材目录一起保留，可直接在浏览器中打开。

**最新反馈（2026-10-30）：** 用户看动画后评价「不怎么样」。本稿不采用，停止继续打磨；保留素材与预览作为过程记录。用户尚未具体说明原因，不能把助手对笑点、画风或节奏的分析记成用户的结论。

2026-10-30。用户在三格分镜后说「继续」，助手据此制作本地动画及整页预览。**制作授权不等于用户已确认包袱、最终采用或授权发布。** 原 personal-corner 的落书稿和独立主页仓库均保持，新的候选放在本目录。

## 直接查看

- [完整主页](index.html)：同一页中可切换深浅主题、查看手机截图与动画细节。
- [动画细节](animation.html)：可暂停、重播和拖动实际 SVG 的时间轴。
- [独立 GIF](assets/scene/scene-light.gif)，[最终表情](assets/scene/poster.png)。
- 整页截图：[浅色](full-light.png) / [深色](full-dark.png)。
- 手机截图：[浅色](mobile-light.png) / [深色](mobile-dark.png)。
- [候选 README](README.md)，[三格分镜](../../cpp-humor/storyboards/README.md)。

## 动画如何讲这个包袱

1. 入门书放在旁边，仓鼠准备编译。
2. 屏幕出现「1 error」，仓鼠举着一根手指，气泡为「Just one.」，先停一拍。
3. 诊断纸带继续涌出，纸堆逐渐变大；角色的自信变成无语，探出头看着观众，手指仍然举着。
4. 纸山和表情停留，屏幕计数仍然是「1 error」，随后淡出接回开头。

纸带和纸山是长篇编译诊断的视觉比喻，不是实际打印机工作流，不宣称每种编译器都把一条错误显示为相同长度。新的表现侧重小数字与大结果、先放心后失语，没有继续强化被书砸到的重量感。

为使表情衔接稳定，内置 imagegen 单独生成自信角色、同位无语角色和纸堆三张透明原画；显示器及纸带路径采用本地 SVG，计数用文字绘制保证始终清晰为1。原画、来源与[完整提示词](assets/scene/ART.md)已保存。身体通过纸堆遮挡，最终脸部上探，避免整个表情被盖住。

整页保留此前 personal-corner 的姓名、头像、Bio、自述、工具排列、Utopia入口与贡献蛇。只将该本地候选的首屏换成本次动画，并让页尾小注呼应单个错误；不视为这些变化已获最终确认。

## 实现与导出

- `error_motion.py`：固定时长7.2秒的SVG动作、气泡、计数及可控制细节页。
- `build.py`：复用原候选的正文和外框，将新首屏生成到独立目录；不写旧候选。
- `render-motion.mjs`：复用已有的离线Chromium/CDP与FFmpeg导出流程，以20fps采样新动作，输出独立场景与桌面/手机、深浅主题首屏GIF；静态封面取最终表情。
- `capture.mjs`：复用已有的本地页面检查与截图流程，读取本地文件并阻止HTTP/HTTPS请求。

```sh
python research/github-profile/drafts/one-error/build.py
node research/github-profile/drafts/one-error/render-motion.mjs
python research/github-profile/drafts/one-error/build.py
node research/github-profile/drafts/one-error/capture.mjs
```

需要本机已有的Python/Pillow、Node、Chromium与FFmpeg；本轮没有安装依赖。默认浏览器路径与旧流程相同，可通过`PROFILE_CHROME`指定。已生成的预览和素材可直接查看，无需重建；不要把HTML的近似GitHub外框当成线上截图。

## 本地验证

已检查1440、430、375像素宽度的深浅主题：图片加载和主题选择正常，没有横向溢出；减少动态时显示最终表情封面。整页动画会播放，页尾小注可以展开，细节页可暂停、重播和拖动时间轴，SVG文字没有越界。

五份GIF均为145帧、约7.21秒。已同步首屏嵌套SVG的导出时间轴，并从实际GIF抽帧核对「Just one.」、纸带增长与最终表情；桌面及手机封面均停在纸堆与无语表情阶段。已查看最终浅色整页和深色手机截图。

**当前状态：用户反馈不满意，本稿未采用、未发布，保留为历史试稿。**
