# B：海报式主页候选

2026-10-29。用户要求补看 B，并表示从当前效果看不太喜欢 C。C 暂不继续打磨；A/B 均未被选为最终版。本次仅制作本地预览，没有更新主页仓库或发布。

**2026-10-30最新反馈：** 用户认为内容都比较简单、A/B没有太大区别、B不比A好。助手收回此前对B“更完整”的过高评价。本稿保留作为未采用的尝试，不能当作下一版已获认可的基线；接续讨论见[决策记录](../../DECISIONS.md)。

## 查看效果

- [浅色整页](preview-light.png) / [深色整页](preview-dark.png) / [手机宽度](preview-mobile.png)
- [README 区域](preview-readme.png) / [深色 README 区域](preview-readme-dark.png)
- [打开浅色 HTML](preview-light.html) / [打开深色 HTML](preview-dark.html)：可查看打字、光标和原有贡献蛇动画。
- [候选 README](README.md)
- [A 预览](../ac-comparison/A/preview-light.html)，作为同一外框下的对照。

## 实际设计

横幅采用炭黑、米白和橙色，放大姓名，以几何 C 形作为构图元素。名字保持静态可读，`Building things. Figuring things out.` 以打字和光标效果呈现；`Some assembly required.` 是候选小玩笑，未视作用户已确认文案。

正文以一句自述开场，将工程背景与当前兴趣放在两个并排的文字区域，再接 Utopia 的简短入口。工具标签和页尾使用同一橙色线条与方形边框。现有头像、Bio `Don't know C++`、技术信息和可见贡献动画均保留。没有新增星标、排名或技能百分比。

相比 A/C，B 重新组织了正文，而不只是更换横幅。工程与兴趣区使用 README 可用的 HTML 表格，内容仍为可选择的文字；手机宽度保持两列，阅读会比 A 的单列更密集。这里的样式仍为候选，并非用户已认可所有表述或布局。

## 实现与检查

所有新增图形均为本地编写的 SVG，动画也在 SVG 内；复用原有贡献 SVG 快照。正文通过已安装的 markdown-it-py 本地渲染，以离线 Firefox 查看 1440px 深浅色及 430px 手机宽度。HTML 只近似 GitHub 外框，不是线上截图；没有向外部服务发送本稿。截图是动画某一帧，不代表完整播放过程的测试。

已检查 SVG XML、素材链接、关键内容及截图。手机正文和标签没有明显横向溢出；横幅装饰性小字较小，主要介绍保留在正文。最终是否优于现版，需由用户结合效果判断。

`build.py` 复用 A 的本地预览外框及现有素材，依赖同仓库中的 A 候选文件；生成后的 README、HTML 和素材可以单独查看。运行：

```sh
python research/github-profile/drafts/poster/build.py
python research/github-profile/drafts/poster/capture.py
```

使用本机已有的 Python、markdown-it-py、Pillow 和 Firefox，没有安装新依赖。主要版式参考和取舍见[方向说明](../../DESIGN-DIRECTIONS.md)的 B 部分；未复制其他作者素材。

**当前状态：B 待用户比较；C 暂不推进；A 的静态头图仍为草稿，不代表确认删除原有动态表达。**
