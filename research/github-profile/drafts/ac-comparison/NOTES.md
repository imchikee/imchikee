# A / C 本地整页候选

2026-10-29。用户表示倾向 A 和 C 后，两版分别制作供比较，**均待确认，尚未发布**。两版使用相同的个人介绍、技术信息、Utopia 链接及已有贡献动画，区别是主视觉、栏目名称、目录导航、标签及页尾的整体风格。

后续反馈：用户表示从当前效果看不太喜欢C，暂不继续打磨，并要求补看[B方案](../poster/NOTES.md)。A的静态头图是当前草稿状态，不代表用户已确认移除原有动态表达。

**2026-10-30：** 用户进一步认为候选内容比较简单，A/B缺少明显差异，B不比A好。两者均未采用；这里保留草稿供回看，不应据此直接继续A/C二选一或部署。完整讨论见[决策记录](../../DECISIONS.md)。

## 直接看效果

|候选|浅色整页|深色整页|手机宽度|可打开的 HTML|
|---|---|---|---|---|
|A 插画个人空间|[截图](A/preview-light.png)|[截图](A/preview-dark.png)|[截图](A/preview-mobile.png)|[浅色](A/preview-light.html) / [深色](A/preview-dark.html)|
|C 复古个人站|[截图](C/preview-light.png)|[截图](C/preview-dark.png)|[截图](C/preview-mobile.png)|[浅色](C/preview-light.html) / [深色](C/preview-dark.html)|

[浅色并排对照](comparison-light.png) · [深色并排对照](comparison-dark.png) · [手机并排对照](comparison-mobile.png)

## 本轮具体设计

- A：奶油色、棕色和鼠尾草绿；原创矢量仓鼠与笔记、构建树、笔记本电脑组成插画；大字姓名和手绘下划线；工具标签与页尾采用同一配色。
- C：淡紫色复古窗口、像素字姓名和原创像素仓鼠；`Make yourself at /home.` 与 C++ 施工提示属于候选幽默文案；目录链接对应正文真实章节；工具标签用同一套立体边框；窗口光标闪烁。
- 工程背景与兴趣均采用实际可读的 README 正文，未删除为一句介绍，也没有把 Utopia 扩展为主角。现有重复信息合并到对应章节，未继续保留重复罗列技能的旧卡片。
- 原有头像只用于近似 GitHub 外框，头像和 Bio 未修改。仓鼠是呼应原头像的新矢量图形，不代表用户确认更换视觉形象。
- 贡献蛇直接沿用主页仓库的现有 SVG 快照；未新增工作流或改变线上更新配置。

## 实现与检查范围

候选实际入口为 [A/README.md](A/README.md)、[C/README.md](C/README.md)，视觉素材均为本地 SVG。README 不依赖任意 CSS、JavaScript、外部字体或虚构交互；导航链接指向章节。HTML 的 CSS 仅用于近似展示 GitHub 外框，不会被当成 README 部署。

两版最终均通过已安装的 markdown-it-py 在本地渲染，以离线 Firefox 截取 1440px 深浅色和 430px 手机宽度并查看。SVG 作 XML 检查，局部素材和章节链接作存在性检查；这些是预览验证，不等于已在 GitHub 线上确认所有浏览器表现。手机上横幅装饰性小字较小，关键自述仍在正文；未来若更看重手机横幅，需要进一步调整其信息密度。

截图只记录动画的某一帧，贡献蛇与 C 的闪烁光标请打开 HTML 查看。两个版本都保留相同内容，因此比较结果主要针对风格，而非最终英文措辞。

外部渲染记录：最初 A 的 GitHub Markdown 渲染请求成功返回；C 的同类请求被自动审批拒绝，理由为本轮仅授权本地预览、未授权向外部发送草稿。之后停止外部渲染，最终两版统一使用本地输出。未修改远端仓库，也没有再次请求外部发送。

## 再生成

在仓库根目录运行：

```sh
python research/github-profile/drafts/ac-comparison/build.py
python research/github-profile/drafts/ac-comparison/capture.py
python research/github-profile/drafts/ac-comparison/compare.py
```

使用本机已安装的 Python、markdown-it-py、Pillow 与 Firefox，没有为此安装新依赖。`build.py` 中现有素材读取位置是本机路径，跨设备重建前需对应调整；已经生成的 HTML、README 和图片可以直接查看。

## 来源

- A 的图文比例参考 Thaiane、samujjwaal；C 的复古语言参考 sindresorhus、fnky、BrunnerLivio，技术语气参考 hedyhli。具体研究链接见[方向说明](../../DESIGN-DIRECTIONS.md)。未复制这些作者的个人插画或素材。
- 新增横幅、标签和页尾均为本次编写的 SVG 图形；其中 C 的像素字与仓鼠为本地矩形图形。
- 头像快照为用户当前 GitHub 头像，仅供本地上下文预览。原图作者及权利归属没有另行核实。
- 贡献动画来自用户现有主页，使用 [Platane/snk](https://github.com/Platane/snk) 生成。本次没有生成新的贡献数据。

**当前状态：A/C 两版供比较，用户未选择最终方案；不自动合并、部署或替换主页。**
