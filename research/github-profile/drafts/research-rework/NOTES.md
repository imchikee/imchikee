# 从调研重新组织整页：两份本地候选

2026-10-30。用户指出 current-evolution 试稿过于依赖现版，是矫枉过正；安装全局 stop-that-shit 后，要求继续主页设计。本轮重新组织整页，提供两个可比较的候选。均未采用或发布。

后续反馈：用户认为代码自述不好看、边注版一般，并要求助手承担设计判断，不再不断给方向选择。此处两稿保留历史，不再作为待二选一的方案。最新整页见 [personal-corner](../personal-corner/NOTES.md)。

## 直接看效果

**[打开对照页](index.html)**：左右两侧均可选择「边注个人页」「代码自述」或「现版」，切换深浅主题，以及 README、横幅以下、整页和手机截图。点击对应图片进入 HTML 查看动画。

|候选|动态 HTML|README 截图|手机截图|实际候选源码|
|---|---|---|---|---|
|边注个人页|[浅色](journal/preview-light.html) / [深色](journal/preview-dark.html)|[浅色](journal/readme-light.png) / [深色](journal/readme-dark.png)|[浅色](journal/mobile-light.png) / [深色](journal/mobile-dark.png)|[README](journal/README.md)|
|代码自述|[浅色](source/preview-light.html) / [深色](source/preview-dark.html)|[浅色](source/readme-light.png) / [深色](source/readme-dark.png)|[浅色](source/mobile-light.png) / [深色](source/mobile-dark.png)|[README](source/README.md)|

[两版 README 并排图](comparison-light.png) · [横幅以下并排图](comparison-middle.png)。直接打开现有文件即可，无须安装依赖或启动服务器。

## 研究怎样影响了整页

|参考与已有证据|本轮实际采用的做法|边界|
|---|---|---|
|[AlexMartinFR](../../current-scan/screenshots/132-AlexMartinFR.png) · [源码](../../current-scan/readmes/132-AlexMartinFR.md)|边注版用 C++ 问号与「see bio」串起主图、自嘲和正文语气，让文字与图形共同表达；没有仅替换姓名横幅|没有复制字母格、作者的兴趣或虚构名言；边注措辞是新候选|
|[adamalston](../../current-scan/screenshots/063-adamalston.png) · [源码](../../current-scan/readmes/063-adamalston.md)|采用一个可重复的小型动态图形作为记忆点：边注版的提问路径、代码版的问号回环|没有移用原子轨道、科学兴趣或装饰数字；正文信息保留|
|[Thaiane](../../current-scan/screenshots/039-Thaiane.png) · [源码](../../current-scan/readmes/039-Thaiane.md)|边注版采用叙述与视觉交替的节奏；代码版把本人背景写成可选择的代码式自述，代替原工程卡|没有复制作者经历、技能或电脑前人物素材|
|[hedyhli](../../current-scan/screenshots/canonical-064-hedyhli.png) · [源码](../../current-scan/readmes/064-hedythedev.md)|代码版让声明、注释与 C++ 自嘲构成阅读方式，并用原生 details 提供可展开的小注|不做伪终端按钮，不声称能执行命令；chikee.hpp 是自我介绍的表达方式，不是某个真实项目文件|
|[orhun](../../current-scan/screenshots/133-orhun.png) · [源码](../../current-scan/readmes/133-orhun.md)|当前探索与实际项目内容对应，用具体的壁纸驱动主题代替泛泛的「开发工具兴趣」|不复制项目规模、贡献数据或赞助模块；Utopia 保持简短入口|
|[MacroPower](../../current-scan/screenshots/058-MacroPower.png) · [源码](../../current-scan/readmes/058-MacroPower.md)|工具保留标志与明确名称，按用途或短行扫描；边注版分语言、平台和构建三组，代码版较紧凑|不引入宽表、工时、熟练度或统计卡|

现版的头像、`Don't know C++`、工程背景、技术图标、动态表达和已有贡献蛇继续保留。终端横幅及双卡结构参与重新取舍：边注版采用叙述与图文边注，代码版采用代码自述与展开注释。保留现版优点没有被处理成保留所有模块与配色的要求。

## 内容来源与候选状态

- 职业背景仍使用已确认的 C/C++、嵌入式、Linux/QNX、软件架构、集成、构建部署与性能经验，不写雇主时间线或指标。
- 本轮只读本机 `/home/chikee/code/utopia/README.md`，其中已记载壁纸驱动的桌面主题。主页仅用一幅主题示意和简短文字承接探索，未复制产品完整介绍，也未添加成熟度或用户规模结论。该仓库未修改。
- 壁纸、调色板与桌面的图形是本轮 SVG 示意，不是项目实拍、真实壁纸或产品截图。没有读取个人机器配置、运行状态或壁纸库。
- `C++? see bio.`、`knows_cpp = false`、边注标题和代码片段均是待看效果的候选表达；侧栏 Bio 原样保留，不因制作即记为确认。
- 现版比较复用 current-evolution/baseline 的同外框重建与已存截图，没有再次抓取线上主页或重新开展 188 条调研。

## 实现与检查

候选 README 只使用常规图片、picture、文字、链接，以及代码版的 C++ 代码块和 details。CSS 只近似 GitHub 外框、排版及代码高亮，不作为任意自定义样式写入 README。手机使用单独 SVG 构图，代码保持短行。

已用本机 Chromium 读取本地文件，检查两版的 1440、430、375px 深浅主题，生成截图并查看；没有页面横向溢出、缺失图片或代码横向滚动。已确认主题 / 手机素材选择、首屏动画帧变化、details 展开，以及比较页的主题与现版切换。SVG XML 解析通过，源码版新 SVG 已测量文字画布边界；本地视觉检查不能替代 GitHub 线上最终渲染。浏览器阻止 HTTP/HTTPS 资源请求，本轮未上传或发布。

重建：

```sh
python research/github-profile/drafts/research-rework/build.py
node research/github-profile/drafts/research-rework/capture.mjs
```

Python 使用标准库；复用仓库中的预览代码和素材。Node 使用内置模块与本机 Chromium，路径可通过 `PROFILE_CHROME` 指定。`capture.mjs source` 或 `capture.mjs journal` 可只重截相应候选；对照页需另一候选的现有截图。原技术标志及许可证在各候选 assets/icons/；原头像、贡献蛇和字体基础均来自此前素材，新增图形由本轮 SVG 代码绘制。
