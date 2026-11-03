# 编译还没结束：椰树、昼夜与四季动画

2026-10-31 同步减重：动画SVG/HTML引用同一批原PNG，整页HTML使用内联SVG保留动画，候选Markdown使用已有静态封面。避免多份预览重复内嵌PNG；素材、GIF、布局和动作保留。生成及检查脚本已同步，通过四季、控制、主题与手机布局检查。

2026-10-31。用户在组合分镜后说「继续」，本目录制作独立的分层动画预览。保留椰树成长的主线，叠加昼夜、四季和穿戴；编译从1%到2%，没有完成提示或主动重编译。

最新视觉修订：家具改用[透明手绘图层](assets/scene/ART-room-v2.md)，整页首屏采用透明底与页面衔接；独立预览/GIF采用纸色背景。成熟树冠和树高略收紧以完整显示叶片，剧情和时间轴保留。具体整页见[说明](profile/NOTES.md)。

## 查看

- [放回完整主页](profile/index.html) · [完整主页说明](profile/NOTES.md)
- [可暂停、重播、拖动进度的动画](index.html)
- [GIF](assets/scene/scene.gif) · [冬日封面](assets/scene/poster.png)
- [桌面截图](preview-desktop.png) · [手机截图](preview-mobile.png)
- [春](assets/scene/phase-spring.png) · [夏](assets/scene/phase-summer.png) · [秋](assets/scene/phase-autumn.png) · [冬](assets/scene/phase-winter.png)
- [原分镜](../../cpp-humor/storyboards/slow-build-seasons.png) · [素材与内置imagegen提示词](assets/scene/ART.md)

## 动作

同一镜头约12秒：春日坐等、小苗发芽；夏日树干与叶冠生长，仓鼠乘凉喝冷饮；秋夜椰子成熟，仓鼠喝椰汁；冬日窗外飘雪，仓鼠披毯子喝热饮，进度才到2%。树冠轻摆、角色轻微呼吸，热饮有蒸汽。场景在短暂淡出期间复位，再接回开头，首帧有完整画面。

这不是四张场景截图的切换。树干、叶冠、果实、角色分别组合，天空、室外树木、灯光、雪与文字在同一SVG时间轴上变化；仓鼠四种姿态使用独立精灵格。两张PNG图集保持生成原样，代码只读取透明边界进行SVG定位。

## 重建与检查

已有Python/Pillow、Node、Chromium与FFmpeg即可，无新依赖。运行顺序：

1. python research/github-profile/drafts/slow-build/motion.py
2. node research/github-profile/drafts/slow-build/render.mjs
3. node research/github-profile/drafts/slow-build/render.mjs --check

--inspect 单独保存关键帧；--check 检查四个阶段的姿态及百分比、暂停/重播/拖动、桌面及手机布局并保存截图。浏览器只读本地文件并阻止HTTP/HTTPS请求。默认使用/opt/google/chrome/chrome，可用PROFILE_CHROME指定路径。

本轮已通过上述页面与时间轴检查，并查看关键画面。PNG原画保留真实透明度；椰树图集的实际间隔没有严格等分，代码依照透明间隙引用各部件，未重新裁切或编码原画。SVG为960×600，GIF导出为720×450、12fps。

当前手绘背景版GIF为145帧、约12.08秒、5,124,314字节（约5.1MB）；已查看实际冬日帧，文字和表情保持可读。PNG原画与SVG分辨率保留。

当前是待用户看效果的本地动画，没有接入独立GitHub主页仓库或发布；原头像、Bio、此前草稿及简历均未修改。
