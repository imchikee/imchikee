# GitHub个人主页调研

更新：2026-10-29。**全部188个收录条目的当前页面和README检索已逐一核对，并另查看13个明确迁移后的地址。** 每个条目都有当前观察和证据链接。此前“188个历史截图＋12份当前README＋7个当前页面”只是阶段工作，两次据此报告完成均不准确，本版已补齐当前覆盖。

研究记录保存在当前简历仓库，主页源码仍在独立的`imchikee/imchikee`仓库。本轮没有修改或发布新主页。Bio `Don't know C++`保留；大幅删减的compact-personal方案仍为已否决。

**2026-10-30设计后续：** 已制作A/B/C本地预览，用户看后认为内容比较简单、A/B没有明显差异、B不比A好，C从当前效果看不喜欢。助手撤回对B的过高评价，承认调研尚未有效转成成熟设计。没有选定或发布新版；以下研究参考不是用户的设计选择。继续工作先读[最新讨论](DECISIONS.md)及[交接](../../HANDOFF.md)，不要重新做全量研究或直接部署草稿。

## 实际覆盖

清单来自用户给的[展示站](https://zzetao.github.io/awesome-github-profile/)及其[数据仓库](https://github.com/zzetao/awesome-github-profile-data)。共188个不同的收录网址，17个分类。

|工作|实际结果|
|---|---|
|图库历史截图|188/188已初筛，作为历史对照|
|当前原地址页面|188/188逐一打开、截图并查看，含404、组织页、无README的页面|
|明确迁移后的页面|另查看13个新地址，不把被重新注册的旧账号误认为作者本人|
|当前README源码|178份已核对正文结构、栏目、图片引用及可见布局方式，其中包含1份组织主页|
|特殊源码状态|1份是迁移说明；1份仅找到旧归档，当前不展示；8项未取得公开README。合计仍为188项|
|相关开源组件|此前已核对7个项目的官方说明，继续保留为实现方式参考|

**逐条结果：[188个当前主页记录](current-scan/ALL-PROFILES.md)。** 每条连接当前地址、原图、对照图和取得的源码快照。来源URL、文件SHA、原地址与迁移地址分别保存在[当前清单](current-scan/inventory.json)、[源码查询记录](current-scan/source-results.json)及[覆盖统计](current-scan/coverage.json)。

本轮看的是页面主要视觉结构与README内容组织，没有点击游戏、留言、订阅等会改变外部状态的控件。浏览器原图为1440×5000，对照图展示顶部2400px；超长README结合源码栏目核对。截图中的动画初帧、加载占位或缺图只说明这次呈现，不能证明完整动画效果或永久故障。本轮没有声称逐行审计所有组件后端，也没有完成全部手机、深浅主题测试。

## 看完当前版本后的结论

**moertel适合作为技术标签的局部参考，不能单独决定整页走极简。** 它没有解决用户希望主页更好看、更有趣、更像本人的全部问题。之前把横幅、动画和卡片大幅删掉，只剩简短介绍，既不是全量研究支持的结论，也没有回应用户的要求。

全量比较后，值得继续讨论的是下面几类不同做法。美观有主观性，不按star、粉丝或作者知名度排名，也不把“正式、少装饰”预设为最好。

|方向与当前样本|具体值得参考什么|为什么不整体照搬|
|---|---|---|
|人物插画＋本人内容：[Thaiane](https://github.com/Thaiane)、[samujjwaal](https://github.com/samujjwaal)、[sriharikapu](https://github.com/sriharikapu)|主图与本人形象或语气有关，正文仍有信息；图文比例自然，不需要删空|肖像、经历与兴趣属于作者；重复头像也未必适合用户。Thaiane代码清单不能当用户技能表|
|有明确主题的个人横幅：[rafnixg](https://github.com/rafnixg)、[SuperSupeng](https://github.com/SuperSupeng)、[dereknguyen269](https://github.com/dereknguyen269)|横幅有具体内容，姓名、角色、做事方式与图形形成整体；分别是深绿金色、粉黑编辑风、Builder Console|后两者正文较长且偏职业/项目展示。借主视觉组织，不把用户主页做成长简历或Utopia产品页|
|独立图形作为记忆点：[adamalston](https://github.com/adamalston)、[khalby786](https://github.com/khalby786)|前者现用原子轨道SVG主题，后者展示自己画的机甲；都比通用桌前程序员插画更有辨识度|前者本人正文少，且SVG来自外站；后者画作是作者自己的，不能直接移用。不能因为用户做系统软件就替其选择科学/机甲兴趣|
|整页玩心与复古：[sindresorhus](https://github.com/sindresorhus)、[BrunnerLivio](https://github.com/BrunnerLivio)、[fnky](https://github.com/fnky)|欢迎字、图像、幽默和小彩蛋属于同一种网页语言，丰富也能协调；不靠正式履历成立|作者喜好不能复制，动图和留言组件也非全要。用户是否喜欢复古仍待确认|
|用表达方式带幽默：[hedyhli](https://github.com/hedyhli)、[AlexMartinFR](https://github.com/AlexMartinFR)、[monkindey](https://github.com/monkindey)|命令式自述、字母方格、CSS属性玩笑，使技术与自我介绍有联系；保留自嘲无需依赖随机笑话API|纯代码或短语法玩笑单独使用容易信息少。不能把虚构属性和熟练度复制到用户介绍里|
|内容与技术兴趣呼应：[orhun](https://github.com/orhun)|个人形象、终端兴趣和Ratatui作品有关联，视觉不是任意外壳|大量项目、贡献与赞助来自作者多年积累，不能用同等密度包装用户|

这些是讨论用的参考，不是已选定风格，更不要求把它们全部拼进一页。下一轮最值得对照的是“人物/插画主视觉＋有本人语气的正文”与“一个带玩笑的完整主题”。现有头像和`Don't know C++`可以作为线索；不强行改正式，也不默认必须终端风。

## 为什么其他样本没有作为整页主要参考

完整的逐条理由见当前清单。这里归纳主要取舍：

- **纯统计、奖杯、排名型**：如kittinan、aemmadi、rafi0101等，很难回答“这是怎样一个人”，用户也明确不希望展示star/排名。本次很多卡还出现缺图，不优先整页采用。
- **长履历或活动目录型**：如dayyass、maximousblk、Raymo111，可能内容很好，但偏离本轮想要的轻松个人空间。不是因为信息多就不好，而是用途不匹配。
- **只剩一句介绍或几个链接型**：如bdougie、gargakshit、jatin2003，当前版本很短；不能因此再建议用户删掉已有视觉和内容。
- **主要展示一个产品型**：如saadeghi的daisyUI、部分作者的大作品页，视觉强但主角是产品。用户已明确本人应为主角，Utopia只是入口与证据。
- **音乐和游戏型没有被一概排除**：novatorem当前音乐卡、JonathanGin52四子棋、rossjrw的Ur棋盘都各有价值。不过需要真实兴趣或作品联系；不为了“酷炫”搭建与用户无关的服务。
- **通用办公插画型**：不少页面仍好读，但同一素材出现多次，单靠插画难形成个人识别。可以参考图文比例，不把换一张程序员图等同于完成设计。

## 当前版本与旧图库的重要差异

这些变化是必须逐个看当前页面才发现的，不应再依赖旧图库作当前推荐：

|样本|本轮实际发现|
|---|---|
|sw-yx|旧账号明确提示迁移swyxio，旧地址无公开仓库；已补看新页|
|qu4k、8bithemant、you-create等|部分旧地址现为空白或已是别的账号；按仓库重定向/作者明确说明找到新地址，13项均另查看|
|bdougie、gargakshit|旧特色内容已撤，目前分别只有hi和短问候|
|martonlederer|同名仓库重定向old-profile-readme，但当前主页不展示它；归档不计当前在用设计|
|adamalston|历史黑横幅、徽章和统计墙已换为原子轨道SVG；当前版本成为新的图形参考|
|khalby786、SuperSupeng、dereknguyen269|当前主视觉分别变成作者自画机甲、粉黑个人横幅、Builder Console，不能仅按旧图评价|
|rednafi、vidursatija|旧代码式或技术文档式介绍已撤，当前以短介绍和文章/兴趣为主；旧版仅作历史灵感|
|jh3y|旧卡通红黑横幅已换为单SVG链接；本次截帧为craft图形，不把alt文字当完整动效证据|
|Wrapperup|账号当前可以打开，但无主页README；同名仓库查询404。此前只查仓库时不能推断账号404|
|nilfalse|已为组织，真正源码在.github/profile/README.md；本轮已补查，不能只查个人同名仓库|
|dephraiim|旧页明确指向ephraimduncan；新页可访问但未展示个人README，本轮也查看了新页|
|HFO4、natemoo-re|本次游戏画面或音乐图片未加载；只说明本次呈现，没有点击控件或断言永久失效|
|memo4code2|旧图中的报错项目表已改成两张网站截图；当前仍有正文拥挤、项目图占大幅的问题|

8个未取得公开README的原条目为maddhruv、teoxoy、xcaq、alx365、Wrapperup、amxchang、federico-dondi、7ma7X。其中只有maddhruv和federico-dondi在本次原地址页面呈现404；其余可访问，但未展示该个人README。未猜测原因。

## 技术区与可用组件

技术区不应再作为独立图标换装游戏。moertel的统一小标签、MacroPower的带文字规则网格、jvillegasd的分类图标是不同参考；要结合整页主题再选。标题有无、尺寸和分组都仍待讨论，局部toolbox-labels草稿没有获得整体采用确认。

|官方项目|能提供什么|本轮取舍|
|---|---|---|
|[profile-readme-generator](https://github.com/maurodesouza/profile-readme-generator)|README组合与试排|生成器不能代替个人内容与整体设计|
|[readme-typing-svg](https://github.com/DenverCoder1/readme-typing-svg)|打字动画|用户已有；关键介绍仍需静态可读|
|[capsule-render](https://github.com/kyechan99/capsule-render)|横幅文字效果|适合原型，套模板本身不产生个人性|
|[devicon](https://github.com/devicons/devicon)|技术标志素材|统一高度不等于统一视觉重量，仍需文字和分组|
|[snk](https://github.com/Platane/snk)|贡献蛇动画|当前已实现，不重复搭建基础设施|
|[metrics](https://github.com/lowlighter/metrics)|活动及信息组件|有真实内容需求再引入，不默认加数据墙|
|[github-readme-stats](https://github.com/anuraghazra/github-readme-stats/blob/master/readme.md)|统计卡|此前官方说明已标记原仓库不再维护；用户也不需要star/排名，不引入|

前述官方说明的来源与版本证据保留在[sources.json](sources.json)。对icecoobe总提交数报错，只能确定对应获取失败，不能以公共服务维护状态推断其具体根因。

## 对用户当前主页的判断

[线上基线](screenshots/current/imchikee-before.png) · [源码](https://github.com/imchikee/imchikee)

现有头像和Bio比通用工程文字更有个人气质。横幅、打字副标题、两张卡片和工具区各自可以成立，但技术信息重复，视觉主次与本人联系还不够清楚。后续应重新组织内容并比较主视觉，而不是默认全部删除，或者继续逐项微调logo。

保持已确认边界：本人是主角；Utopia是当前置顶和简短入口；cocoa/Solo不包装为代表作；不放star/排名卡；保留`Don't know C++`。此前接受局部组件调整，不代表当前所有模块已永久定稿。先讨论具体方向，再修改主页。

## 文件与交付

- [当前188条记录](current-scan/ALL-PROFILES.md)：本轮结论的主要依据。
- [当前来源与状态清单](current-scan/inventory.json)：逐项URL、SHA、截图和判断。
- [历史188条初筛](full-scan/ALL-PROFILES.md)：只作历史对照，不混算为当前核对。
- [旧候选复核](full-scan/SHORTLIST.md)与[原15例报告](SAMPLE-REPORT.md)：保留为阶段记录，不能当最新候选结论。
- [决策状态](DECISIONS.md)：已确认、已否决与待确认内容。

本轮完成的是全量当前调研和研究记录。主页方案仍待讨论，没有自动生成或部署下一版。
