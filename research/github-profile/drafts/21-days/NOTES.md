# 21天学会C++：新插画整页预览

**第二幕候选已接入（2026-11-03）：** [第二幕独立动作](writing-motion/index.html)和[GIF](writing-motion/motion.gif)已完成三小段连续写笔记、最后停笔；[整页](index.html)3.2—6.4秒为新第二幕，第三至九幕仍是分镜。原画与动作尚待评价，第一幕阶段确认版未改。提示词、素材及导出说明见[第二幕README](writing-motion/README.md)。

**第一幕阶段确认（2026-11-03）：** 用户对统一光影及惊叹线时序后的版本评价“可以，感觉这版差不多了”。当前第一幕作为后续动作的视觉基准，停止本轮打磨；接续重点转向第二幕及后续剧情。后八幕仍为分镜，未发布，不将第一幕反馈扩大为全片定稿。

## 最新：三姿态光影接入（2026-11-03）

用户认可低头光影v2，并同意不再大改毛发、统一其余姿态。现在[整页](index.html)、[独立动作](reading-motion/index.html)和3.2秒GIF已使用统一方向的台灯光影；[光影前动作](reading-motion/before-lighting.html)保留。旧轮廓补片因亮度不匹配产生亮圈，在光影分支停用，使用新原画本身边缘；没有另加粗毛纹。原节奏和插值未改，过渡双边/纹理融合仍存在。素材、提示词和检查见[说明](reading-motion/lighting/README.md)。后八幕仍是分镜，README便携GIF仍未更新，未发布。

## 最新状态：首幕动作接入整页（2026-11-03）

打开[浅色主页](index.html)或[深色主页](preview-dark.html)：第一幕已接入当前3.2秒阅读动作，与整页共用播放、暂停、重播和进度条；第2—9幕仍是分镜占位，全段39.9秒。用户暂时保留阅读动作，毛边、重影等剩余问题没有因此变成已解决；本轮没有重画或继续局部修补。

`build.py`从独立试段生成`reading-shot.js`，保留其绘制方式，仅适配素材加载与整页时钟；[独立动作对照](reading-motion/index.html)仍可查看。`capture.mjs`已验证首幕实际画面变化、暂停像素保持、章节往返、九章顺序、重播/拖动/结束、减少动态及1440/390宽度深浅主题布局，整页截图已更新。

**以下角色表与`acting/`试段为历史探索，不是当前采用的动作基准。`github/`中的README GIF仍为旧九格轮播，未更新为本轮动作。** 现有`export.mjs`按分镜抽帧，不能直接用于导出连续动作成品；后续完整动作需相应更新导出。当前仅本地预览，未发布。

## 当前视觉基准

用户明确现有整页的手绘风格不错，动画制作后反而变差；同时毛发仍偏粗。当前保留此绘本式手绘，头像仅作造型观察，不改成简笔平涂。新[视觉基准页](model/index.html)包含同风格角色表、原稿对照、轮廓/上色/质感与动画制作条件，[规范和生成提示词](model/STYLE.md)一并保存。该角色表仍待评价，不是动作动画或逐帧一致性验证结果。

## 当前重点：角色连续动作

用户指出GIF版只是静态分镜轮播，尚未满足动画目标。已开始重做真实动作，先看[喝药与穿越的11秒试段](acting/index.html)或[GIF](acting/motion.gif)。头、躯干、四肢、药瓶及时间门独立组合，抬臂/仰头/迈步均有连续变化；详见[素材和提示词](acting/ART.md)。GIF为132帧、11秒、3,284,061字节。已查看实际关键帧并检查透明素材加载、手机布局与导出时长。

完整九段动作还未制作完成。下面的README/GIF版保留为分镜预览，不再作为角色动画目标的完成交付。

## README与GIF适配

当前另有[README候选](github/README.md)，直接查看[浅色GIF整页](github/index.html)或[深色GIF整页](github/preview-dark.html)。`github/`目录包含完整本地素材，README首屏仅使用GIF/PNG，保留原正文、工具、Utopia与贡献蛇，不依赖JavaScript。四个GIF分别适配桌面/手机和深浅主题，静态封面为首格，避免提前展示结尾；原作者署名是独立的可点击文字。

九格累计39.9秒，每格依次为3.2、3.2、3.9、4.2、4.5、4.5、4.6、5、6.8秒。GIF循环播放；可控制HTML仍结尾停止。桌面约1.3MiB/份、手机约1MiB/份，没有为静态画面生成数百个重复帧。已从实际GIF抽帧检查脸型和文字，并修正播放器按钮误入导出的问题；已检查四种主题/宽度下的GIF选图、真实播放、图片加载、无横向溢出及减少动态时的PNG封面。

重建README适配素材：

```sh
python3 research/github-profile/drafts/21-days/build.py
node research/github-profile/drafts/21-days/export.mjs
node research/github-profile/drafts/21-days/check-github.mjs
```

没有发布到独立主页仓库。GIF版同样是九格顺序播放，并非连续角色动作。

## 可控制的插画预览

最新局部反馈：用户认为整体不错，指出第5、6格像猫。已用内置imagegen单独修这两格的鼓腮、短口鼻与门牙；中老年区别、道具及文本保留。整页内联`hamster-storyboard-v2.svg`，以原图加局部图引用组合，其他七格仍用原PNG。原图与双格均只保存一份。当前“Read the comic”打开完整组合SVG，需与同目录PNG一起保留。

2026-11-01。用户决定留在当前电脑继续，并询问是否重试imagegen。单次内置请求成功生成[完整九格仓鼠插画](../../cpp-humor/storyboards/21-days/hamster-storyboard-v1.png)，现放入完整主页供评估。

打开[浅色整页](index.html)或[深色整页](preview-dark.html)。首屏完整保留九段故事，按插画格顺序播放约40秒，可暂停、重播、拖动，到结尾停止；减少动态时默认暂停。**这是插画顺序播放，不是新绘角色的连续动作动画。** 旧[动作样片](../../cpp-humor/storyboards/21-days/motion.html)保持独立。

头像、Bio、正文、工具、Utopia、贡献蛇及整页外框沿用personal-corner。新PNG只保存一份，SVG视窗读取不同区域，没有裁切/修改原PNG或内嵌base64。其他资源直接引用原候选的已有文件。故事署名Abstruse Goose #249，完整提示词与内置生成记录在原图目录。

已检查原图实际加载、九格顺序、播放/暂停/重播/拖动、结尾停止和减少动态效果偏好；1440/390像素深浅布局无横向溢出、素材加载正常。实际查看[浅色正文](readme-light.png)、[深色正文](readme-dark.png)、[手机浅色](mobile-light.png)、[手机深色](mobile-dark.png)及末格。截图停在首格，打开HTML会从第一格播放。

重建与检查使用已有Python、Node及Chrome，无新依赖：

```sh
python3 research/github-profile/drafts/21-days/build.py
node research/github-profile/drafts/21-days/capture.mjs
```

当前等用户评价新插画及整页，不代表最终采用、确认片长或授权发布；没有修改独立GitHub主页仓库或简历。
