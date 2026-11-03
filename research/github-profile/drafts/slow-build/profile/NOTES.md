# 编译等待动画：完整主页预览

2026-10-31。用户同意先看整页、再针对性优化动画。本目录把已有动画放回此前personal-corner的完整内容与GitHub近似外框；不重新设计整页或生成新插画。

## 手绘背景与透明衔接修订

用户在助手指出画风割裂和浅底卡片感后要求继续。现补一张[手绘家具图层及提示词](../assets/scene/ART-room-v2.md)，桌椅、显示器、窗框、灯具和键鼠改为与角色接近的彩铅/水粉质感；窗外和屏幕继续独立运动。首屏采用透明底和底部柔化，与姓名区共用页面底色；略收紧成熟树冠和树高，减少顶部裁切。剧情、时间轴和正文保留。

已查看更新后的浅/深README和手机深色截图。修订前对照：[浅色](before-room-v2-readme-light.png)、[深色](before-room-v2-readme-dark.png)、[手机](before-room-v2-mobile-light.png)。旧截图库用于比较，不作为新候选。

## 查看

- [浅色动态整页](index.html) · [深色动态整页](preview-dark.html)
- [浅色整页截图](full-light.png) · [深色整页截图](full-dark.png)
- [浅色README截图](readme-light.png) · [深色README截图](readme-dark.png)
- [手机浅色](mobile-light.png) · [手机深色](mobile-dark.png)
- [独立动画及控制](../index.html)

整页HTML正常播放完整动画；截图使用10.7秒的冬日封面，便于检查布局。当前首屏采用自包含SVG复用分层动画，分别适配桌面/手机与深浅主题，减少动态效果时使用PNG。此阶段是本地整页评估，发布素材等整体效果确认后再整理。

自述、工具、Utopia入口、贡献蛇、头像与Bio沿用原方案。页尾插画小注随新场景改为About that build…／The palm is making better progress.，作为候选文案供检查。桌面首屏高度从456微调至470以容纳完整场景，其他页面结构保留。

生成入口：父目录profile.py；检查与截图：父目录render.mjs --profile。复用原目录静态素材和已完成的动画，没有新增依赖。已检查1440/390像素、深浅主题、图片加载、首屏实际播放、展开小注与减少动态效果封面，没有横向溢出。

这是本地近似GitHub外框，不是线上截图；尚未写入独立主页仓库或发布。用户对整页和动画效果的最终判断仍待反馈。
# 同步减重补充（2026-10-31）

完整HTML主页仍播放原动画，采用内联SVG引用共享PNG；独立SVG同样引用素材，不再内嵌大段base64。`README.md`和`fragment.html`以已有静态封面保留GitHub图片兼容性；评估动画请打开`index.html`或`preview-dark.html`。原图、GIF及截图保留，生成与检查脚本已同步。

