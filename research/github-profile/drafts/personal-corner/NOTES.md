# Chikee：一版完整的个人主页试稿

2026-10-30。用户明确反馈代码自述不好看、边注版一般，并要求助手承担设计取舍，不再反复提供方向选择。此次只交付一版整页，仍为本地试稿，尚未采用或发布。

**台式机接续后最新反馈：** 用户看实际GIF仍不满意，明确是「被书砸中」尚未形成笑点，不是在要求强化撞击。现先按其要求[搜索C++笑话与漫画](../../cpp-humor/README.md)，旧动画保持，尚未生成或确认新剧情。以下先前的正反馈和制作过程不能当成此次已获采用。

最新反馈：用户认为整页「有点味道了」，但插画很难让人一眼会心一笑、达不到「出梗」程度。已按这一反馈重画插画情境：C++ 大部头把仓鼠压扁，仓鼠仍伸出爪子比赞。页面使用新图，原长书页图保留。整体方向的正反馈不等于用户已确认新图或发布。

随后用户认可场景「已经有点梗的感觉」，指出面部表情没有设计、头部难辨认是仓鼠，并询问能否做成书掉落后将其压扁的动画。当前已重画明确的仓鼠特征与前后表情，并把同一场景做成约 7.2 秒循环 GIF，放回主页。当前待用户检查这次表情与动画，尚未发布。

## 直接查看

**[打开完整动态预览](index.html)**。页面上方可切换深浅主题或打开手机截图，没有设计方向选择器。

**[单独看动画，可暂停、重播和拖动进度](animation.html)** · [直接打开 GIF](assets/book-drop/scene-light.gif) · [落地后的表情](assets/book-drop/poster.png)。

- 整页：[浅色](full-light.png) / [深色](full-dark.png)。
- README 区域：[浅色](readme-light.png) / [深色](readme-dark.png)。
- 手机：[浅色](mobile-light.png) / [深色](mobile-dark.png)。
- [实际候选 README](README.md)。
- 当前动画的[图层、保存路径与完整提示词](assets/book-drop/ART.md)；[旧压扁静态图](assets/mascot-book-v2.png)及[原长书页图](assets/mascot-book.png)保留供回退。

## 本轮的设计判断

以「被 C++ 大部头压扁，却仍在比赞」的动作反差建立个人记忆点，呼应已有头像与 Bio 的自嘲。此前的长书页图只说明内容多、学不完，缺少足够的喜剧反差，因此重画情境，而非单靠文案解释。插画是虚构的视觉笑话，不表示用户拥有、读过某本具体书籍，也不表达其工作态度。

整页围绕同一组青绿、暖棕、米白和少量金色组织：开场介绍本人；普通文字说明真实的软件背景与兴趣；工具按用途紧凑排列；Linux 探索与 Utopia 收成一条可点击入口；保留贡献蛇，最后用一条可展开的小注呼应书籍笑话。原头像与侧栏 `Don't know C++` 原样保留。首屏现播放完整落书动作，入口光标及已有贡献蛇保留，关键介绍静态可读。

脸部现在明确画出鼓腮、粉色小鼻子、门牙、短胡须和小圆眼。立姿是抬头吃惊；压扁后是一只眼挤着、歪眉冒汗、勉强笑着比赞。书、立姿、压扁姿态为独立原画，落下和挤压由图层动画控制。页内预览可暂停检查表情；README 直接引用 GIF，不依赖脚本。

为适应新情境，副标题由 `And still turning pages.` 改为 `Still learning.`，页尾小注改为 `The book is winning this round.`。笑点主要交给画面，正文结构保持。

这次没有把旧版的终端横幅、双卡片结构固定为必须保留的框架。继承的是动态、可辨认的技术图标、工程背景与个人探索的区分，以及已有的轻松表达。

## 调研怎样落实

|参考证据|此次采用的经验|
|---|---|
|[samujjwaal](../../current-scan/screenshots/173-samujjwaal.png)、[afc163](../../current-scan/screenshots/163-afc163.png)|头像与页内符号形成联系。基于用户仓鼠与 C++ 自嘲设计具体情景，未套用电脑前程序员素材，也未复制作者插画。|
|[Thaiane](../../current-scan/screenshots/039-Thaiane.png)|控制插画与自述比例，正文保留可读取的自然语言，没有再用一大段代码替代介绍。|
|[rafnixg](../../current-scan/screenshots/067-rafnixg.png)|主视觉的色彩与字形关系延续到工具、入口及分隔，而非头图结束后采用另一套视觉。|
|[AlexMartinFR](../../current-scan/screenshots/132-AlexMartinFR.png)|让图形和文字共同承担一个小玩笑；页尾的原生展开小注与开场呼应，没有编造个人爱好。|
|[orhun](../../current-scan/screenshots/133-orhun.png)|兴趣和实际项目联系。Linux 工作环境、桌面主题与 Utopia 对应，项目保持次要入口，不复制作者的作品数量或统计。|

## 内容与实现范围

职业背景继续使用已经确认的 C/C++、嵌入式、软件架构、跨平台集成、Linux/QNX、构建部署及运行性能经验。桌面主题来自此前只读核对的本机 Utopia README，没有新增项目成果指标，也未改该仓库。没有改简历或独立主页仓库。

README 使用图片、picture、普通标题与段落、真实链接及原生 details。首屏采用四份 GIF 对应深浅主题及桌面 / 手机构图；系统请求减少动态时，picture 选择最终表情的静态 PNG。SVG 是动画源与本地可控制预览，导出 GIF 后再用于 README。[GitHub 的图片显示说明](https://docs.github.com/en/repositories/working-with-files/using-files/working-with-non-code-files)明确列出 GIF 支持；本轮没有向线上上传验证。

技术标志复用已有 Devicon 和 Shell 素材，[许可证副本](assets/DEVICON-LICENSE)随稿保存。贡献图复用已有快照，没有生成或修改贡献数据。

已用本机 Chromium 检查深浅主题、1440px 桌面和 430px 手机，另检查 375px 窄屏；未发现页面横向溢出或缺失图片。已验证实际 GIF 帧变化、主题 / 手机素材选择、减少动态时的 PNG、原生展开，以及动画页的暂停 / 重播 / 进度控制。已查看书接触头顶、身体挤压和比赞的关键帧，并从实际 GIF 解码最终帧检查画质。五份 GIF 均为 65 帧、时长 7.21 秒；桌面首屏约 0.93–1.07 MiB，手机约 0.55–0.70 MiB。

整页 PNG 截图统一使用最终表情的静态来源，避免不同截图随机落在 GIF 的不同阶段。GIF 播放另行检查。浏览器只读取本地文件，并阻止 HTTP/HTTPS 资源请求；未调用 GitHub Markdown 渲染接口。本地结果尚不代表线上最终渲染。

重建：

```sh
python research/github-profile/drafts/personal-corner/build.py
node research/github-profile/drafts/personal-corner/render-motion.mjs
python research/github-profile/drafts/personal-corner/build.py
node research/github-profile/drafts/personal-corner/capture.mjs
```

代码使用 Python / Node 标准库、本机 Chromium 和 FFmpeg，没有新增安装依赖。第一次 build 生成 SVG 源，render-motion 导出 GIF 与静态封面，第二次 build 将 GIF 接入 README。`render-motion.mjs --inspect` 可重截关键帧。FFmpeg 使用[调色板过滤器](https://ffmpeg.org/ffmpeg-filters.html#palettegen-1)编码 GIF。浏览器可执行路径可通过 `PROFILE_CHROME` 指定。

## 插画生成记录

使用 **内置 imagegen**，不是 CLI/API fallback。输入为既有头像的角色参考及此前生成的插画；原头像文件未修改。初版长书页图保存在 `assets/mascot-book.png`，随后压扁静态图为 `assets/mascot-book-v2.png`。最新动画的三份独立图层与提示词另存于 [assets/book-drop/ART.md](assets/book-drop/ART.md)，所有交付均不依赖生成缓存目录。以下保留前两轮提示词。

初次生成提示词：

```text
Use case: illustration-story.
Asset type: one polished, transparent-background illustration for Chikee's personal GitHub profile; an original visual joke about C++ always having more to learn.
Reference image: use the attached image only as the character identity reference. Keep the recognizable tiny round ears, cream-white plump hamster, warm brown forehead/back patches, brown outlines, tiny dark eyes and energetic silhouette. The existing avatar itself will remain unchanged.
Scene: the full-body hamster is attempting to carry one oversized teal C++ book. The book has an absurdly long accordion-fold strip of cream pages that keeps unfolding behind it, making a sweeping playful curve. The hamster looks endearingly puzzled but determined; one foot is raised in an energetic balancing pose, with tiny motion marks. The little physical gag should read clearly at small scale. This is a curious personal mascot, not a character sitting at a laptop.
Style: sophisticated hand-painted editorial character illustration with tactile gouache/paper texture, confident organic contours, restrained shading, rounded dimensional forms. Warm, witty, beautifully crafted; neither generic corporate vector art nor photorealism. Warm brown and cream fur, deep muted teal book, a small dusty lavender accent, warm amber details. Strong clear silhouette.
Composition: a self-contained landscape cluster about 3:2, complete book, hamster, and curling accordion pages all visible with comfortable transparent margins. No background rectangle or scene backdrop. A very subtle contact shadow is fine.
Text: only "C++" on the book cover, clearly legible. No other words, captions, Chinese text, watermarks, UI, logos, extra characters or unrelated props. Genuine transparent alpha outside the illustration.
```

清理提示词：

```text
Precise background-extraction edit of the referenced illustration. Preserve the hamster, the teal C++ book, every accordion paper page, all painted texture, the exact composition and colors, and the tiny motion marks. Remove ONLY the broad diffuse brown glow/halo that fills the otherwise empty area around the entire scene. That large brown mist must become fully transparent alpha. Keep a tiny subtle lavender contact shadow immediately under the hamster's foot. Do not crop, redraw, add text, or change any character or book detail. Output a genuine transparent-background PNG, clean transparent margins, no backdrop, no vignette.
```

当前插画的情境重画提示词：

```text
Use case: illustration-story. Redraw the pose in this reference as a SINGLE-FRAME VISUAL COMEDY GAG, with the same hamster identity, teal C++ book, palette and hand-painted gouache texture.
The joke must be obvious WITHOUT captions: an absurdly heavy, thick C++ textbook lies nearly flat at a three-quarter angle ON TOP OF the plump hamster, squashing its soft cream-white body into a wide, silly pancake underneath the front edge. The book is genuinely resting on the hamster, not being carried and not merely sitting beside it. The hamster's little brown round ears, familiar brown face patches, tiny eyes and face peek out below the book. Give it a deadpan, slightly dazed forced smile. One tiny paw extends from under the book and gives a very clear, determined THUMBS-UP, contradicting its ridiculous flattened situation. Think harmless rubbery cartoon slapstick: no injury, distress, tears or violence. The expression says "I'm fine" while the pose obviously says otherwise.
Composition: one oversized book above, one comically flattened hamster below, one conspicuous thumbs-up to the side. Strong uncluttered silhouette, full scene visible, compact landscape 3:2 arrangement. Make the face and thumbs-up large enough to read when reduced to a GitHub header illustration. Keep the C++ book cover facing the viewer enough that the large cream "C++" lettering is immediately legible. Retain the muted teal cover with warm gold border and cream paper edges. Remove the long accordion paper ribbon entirely; at most two tiny loose page slips or motion marks.
Preserve the existing character's warm brown/cream identity and sophisticated tactile editorial illustration style, with organic brown contours and restrained shading. Transparent background with genuine alpha and a tiny contact shadow only. No backdrop or broad glow. No additional text other than "C++", no infinity symbol, no laptop, no new characters, no watermark.
```
