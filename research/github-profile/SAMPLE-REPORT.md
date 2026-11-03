# 原15例抽样报告（历史记录，不作为最终建议）

调研日期：2026-10-28。**状态：进行中。此前仅完成抽样调研，不应被报告为整项调研已完成。** 本文已有结论均为抽样观察，待补齐全量视觉初筛后修订；不代表用户已确认任何新方案。

记录位置：按用户要求保存在当前简历仓库的 `research/github-profile/`，与本仓库交接一起维护。GitHub 主页源码仍在独立的 `imchikee/imchikee` 仓库；研究材料不随主页公开发布。

调研完成后的确认与候选稿见 [DECISIONS.md](DECISIONS.md)，与本报告的原始观察和建议分开记录。

**最新评价前提：用户明确指出 GitHub 主页不是简历，完全可以轻松幽默。** 本报告不以求职名片、严肃正式或品牌式一致性作为默认目标。优先判断是否像本人、有没有趣、整体是否协调、阅读是否舒服；技术描述仍应真实。头像和自嘲式 Bio 不属于待修正的问题。

## 抽样阶段的暂定观察（待全量筛选复核）

值得参考的主页，通常先让人记住“这是怎样一个人”，再把视觉、内容和交互组织在这条主线上。漂亮的横幅、图标、动画和卡片分别都能成立，但组合起来未必协调。当前主页需要先统一个人表达，再决定使用哪些组件；不宜继续逐个替换图标来寻找整体效果。

在已查看的 15 份截图中，暂时选出的三个讨论样本是；它们不是从全部收录中选出的最优项：

- **moertel**：职业身份、个人兴趣和统一的小标签同时成立。特别值得研究技术栈如何收紧，而不是照搬她的技术列表。
- **orhun**：个人形象、终端兴趣与正在维护的项目有清晰联系。值得借鉴“视觉来自本人”的方式，不适合复制他的项目规模和数字统计。
- **CyrisXD**：首屏有一个清楚的主视觉，再展开人物、兴趣和项目。值得借鉴层次；其当前页面很长，不宜整体套用。

另有两个可选方向：rednafi 的**图库历史代码式介绍**，以及 fnky 的**整页复古语言**。是否适合用户，取决于本人对代码式自述、幽默和复古风的喜好，不能因为做系统软件就默认喜欢终端风。

## 1. 调研对象和证据范围

本次先实际打开了[展示站](https://zzetao.github.io/awesome-github-profile/)，再查看它引用的[截图数据](https://github.com/zzetao/awesome-github-profile-data)。不是把 [awesome-github-profile-readme](https://github.com/abhisheknaiidu/awesome-github-profile-readme) 仓库的 README 当成个人主页设计样本。

完成的工作：

1. 查看展示站页面，并下载、逐张查看 **15 份收录截图**，覆盖代码式、主视觉、紧凑标签、图标、复古、互动和生活兴趣等风格。
2. 核对其中 **6 个主页当前的 README**：CyrisXD、rednafi、orhun、moertel、fnky、abhisheknaiidu。
3. 实际打开并截图 **3 个当前页面**：CyrisXD、orhun、moertel；另记录用户当前线上主页作为比较基线。
4. 核对 **7 个相关开源组件/生成器的官方 README**。这是功能与接入方式调研，不是代码安全审计或维护活跃度排名。
5. 结合此前已查看的 icecoobe、DenverCoder1，以及用户提供的统计卡报错截图作对照。

证据的限制：

- 本次抽样的图库图片，按数据源时间戳主要摄于 **2020–2021 年**；“当前查看日期”与“图片拍摄日期”不是一回事。
- 动态图片的单帧截图不能证明动画的全部效果或加载速度。
- 只有 3 个参考主页取得了本次实际页面截图，不能把其余历史样本描述成作者当前设计。
- 参考样本没有逐个完成手机、暗色模式和辅助阅读测试；相关适配评价是待验证的设计判断。
- 不按 star、粉丝量或作者知名度判断美观和适合程度。

原始网址、图库分类、截图时间戳、已核对 README 的 blob SHA，以及截图路径见 [sources.json](sources.json)。

## 2. 15 个视觉样本比较

下表评价的是链接所指的**图库截图**。当前核对结果另见下一节。“维护负担”是根据所用内容和组件推断的相对负担，不是性能测试结果。

| 样本与截图 | 整体表达 | 值得借鉴 | 不适合直接套用的部分 |
| --- | --- | --- | --- |
| [CyrisXD](screenshots/gallery/CyrisXD.jpeg) | 大幅个人问候横幅，首屏很集中 | 一个主视觉就能建立识别度；入口清楚 | 仅有横幅时自我介绍不足；动画不能承担唯一身份信息 |
| [rednafi](screenshots/gallery/rednafi.jpeg) | 用简短代码结构介绍自己和技术方向 | 信息被统一成一种语言，几乎没有零散装饰 | 这是历史版本；纯代码不一定适合所有访客，不能把技术熟练度写成虚构属性 |
| [ashbakernz](screenshots/gallery/ashbakernz.jpeg) | 类与方法组成自我介绍 | 职业、技能、目标置于同一结构，风格明确 | 代码较长，访客需要阅读；不能为了形式编造职责 |
| [WaylonWalker](screenshots/gallery/WaylonWalker.jpeg) | 头像、姓名横幅、主色和内容模块构成个人品牌 | 名字和人物先被看见；颜色有连续性 | 博客、关注者等模块多，后续维护更重；不能假设用户也有持续内容源 |
| [caneco](screenshots/gallery/caneco.jpeg) | 少量文字区分现在在做什么与个人背景 | 短、自然，有人的语气，不像技能目录 | 单独采用时视觉表现较少，可借鉴文案组织而非当成唯一视觉参考 |
| [orhun](screenshots/gallery/orhun.jpeg) | 个人兴趣、GNU/Linux、项目与社区工作相互支撑 | 展示的是有明确兴趣的人，项目用于提供证据 | 项目与社区积累属于作者本人，不能借他的密度制造自己的内容规模 |
| [moertel](screenshots/gallery/moertel.jpeg) | 简短自述、统一小标签、工程师与艺术家双重身份 | 标签色彩和尺寸统一；技术不压过本人；篇幅紧凑 | 徽章本身不是越多越好；她的个人艺术形象不能照搬 |
| [halfrost](screenshots/gallery/halfrost.jpeg) | 集中的插画横幅配简短背景、兴趣和链接 | 一张图统领视觉，正文不需要每行都做装饰 | 横幅技术 logo 密集；其中的技术、学历和成果只属于作者 |
| [peterthehan](screenshots/gallery/peterthehan.jpeg) | 头像与多组兴趣/社交图标构成身份 | 小图标按类别组织，轻巧，表达了技术之外的兴趣 | 没有文字时许多图标含义需要猜；对希望展示工程背景的人信息不足 |
| [fnky](screenshots/gallery/fnky.jpeg) | 风扇、火焰欢迎字、留言本等统一复古网页语汇 | 酷炫来自整页一致的主题，不是组件数量 | 自我背景很少；访客计数等外部服务可能额外维护，是否采用取决于用户性格 |
| [timburgan](screenshots/gallery/timburgan.jpeg) | 访客通过 GitHub issue 参与下棋 | 主页本身就是可参与的作品，有很强记忆点 | 互动工作流、状态和讨论带来持续维护；不应为装饰搭建一个与本人无关的游戏 |
| [natemoo-re](screenshots/gallery/natemoo-re.jpeg) | 简短身份介绍后展示音乐兴趣 | 技术之外的真实爱好也能使主页更像本人 | 音乐服务和持续数据接入需本人愿意；不能自动加入并不存在的兴趣 |
| [8bithemant](screenshots/gallery/8bithemant.jpeg) | 兴趣文字与太空动图形成联系 | 插画/动画可以表达个人爱好，而不仅是通用程序员形象 | 徽章、统计与分节较多，容易拉长页面；不复制原作者的年龄、领域与成果 |
| [MarikIshtar007](screenshots/gallery/MarikIshtar007.jpeg) | 黑客意象、代码式自述、技术列表和统计 | 自我介绍可以带幽默，动态点缀与内容有主题联系 | 组件较多，阅读路径被打断；不适合把所有模块都塞进用户主页 |
| [abhisheknaiidu](screenshots/gallery/abhisheknaiidu.jpeg) | 正文自述与侧边工作插画形成版面 | 人物、工作方式与一处插画配合，图文主次清楚 | 时间统计、任务统计、打赏等不是必需；历史截图已与当前 README 有明显差异 |

## 3. 当前页面和历史截图的交叉核对

### moertel：当前仍值得优先看

[当前截图](screenshots/current/moertel.png) · [当前 README](https://github.com/moertel/moertel/blob/main/README.md)

当前页面仍采用紧凑的个人介绍、灰蓝色小标签和明确的职业/个人身份表达。技术列表没有使用大小不同的彩色 logo；共同的背景、字号和高度让标签成为一组。

对用户的启发：不必因为上一版裸图标不好看，就断言“只能改成纯文字”。统一的小标签、带字的单色标识和克制的图标组都可比较；目前还没有证据把某一种宣布成最终方案。

### orhun：借鉴身份关联，不借鉴规模

[当前截图](screenshots/current/orhun.png) · [当前 README](https://github.com/orhun/orhun/blob/master/README.md)

当前页面的个人形象、终端兴趣和 Ratatui 工作互相呼应，并通过暗/亮主题图片分别展示。这比“给任何工程师都能使用的终端插画”更有辨识度。后面的项目、维护工作及统计内容较多，是作者自身积累的展示。

对用户的启发：Linux 和工程背景可以成为视觉线索，但应联系本人真正喜欢的元素；不能把通用终端外框当作已经完成的个人品牌。数字和大项目列表没有必要随之引入。

### CyrisXD：主视觉强，也要看页面长度

[当前截图](screenshots/current/CyrisXD.png) · [当前 README](https://github.com/CyrisXD/CyrisXD/blob/master/README.md)

当前页面保留动态图形问候，随后介绍本人、兴趣、当前项目、文章和工具。相比图库截图，它已经更长，项目图在首屏后占据了很大面积。

对用户的启发：可以参考“名字/一句定位 → 本人 → 兴趣或作品入口”的顺序；不必借入作者所有社交统计和项目展示模块。用户已经明确，主角应是本人，utopia 是证据与入口。

### rednafi 与 abhisheknaiidu：不能把历史设计说成当前效果

- [rednafi 当前 README](https://github.com/rednafi/rednafi/blob/master/README.md) 已从图库中的代码式介绍变为简短定位与文章列表。历史代码风可以作为独立设计灵感，但不能说这是其当前主页。
- [abhisheknaiidu 当前 README](https://github.com/abhisheknaiidu/abhisheknaiidu/blob/master/README.md) 与图库中的完整自述加侧边插画差异明显。单有动态数据模块并不能保证自我介绍仍然完整。
- [fnky 当前 README](https://github.com/fnky/fnky/blob/fnky/README.md) 仍使用复古图像和留言本链接；本次核对了源文件，未另录当前页面截图，也未验证每项外部资源的可用性。

## 4. 相关开源项目：作用和代价

以下是可选工具，不是建议全部采用。组件说明来自官方 README；适用性和维护负担是本次判断。

| 项目 | 能提供什么 | 对本主页的判断 |
| --- | --- | --- |
| [Profile Readme Generator](https://github.com/maurodesouza/profile-readme-generator) | 从个人信息和组件选项生成 README；icecoobe 源文件也注明使用它 | 适合快速试排版，不能代替个人内容取舍与整体设计 |
| [Readme Typing SVG](https://github.com/DenverCoder1/readme-typing-svg) | 可定制打字动画 SVG | 适合少量动态定位语；名字和关键身份仍要静态可读。用户当前已使用，本地保存 SVG |
| [capsule-render](https://github.com/kyechan99/capsule-render) | 可配置的横幅、文字和动画 | 适合原型或简单横幅；生成得快不等于有个人识别度，不应为换模板而换模板 |
| [Devicon](https://github.com/devicons/devicon) | 原始技术图标资源 | 小图标只是素材，仍需统一尺寸、视觉重量和排版；不是每种技术都有适配同一风格的标志 |
| [snk](https://github.com/Platane/snk) | 将贡献图生成动画，可通过 Actions 更新并支持主题切换 | 用户当前已经落地，不需要为本轮调研再增加一套同类贡献组件 |
| [Metrics](https://github.com/lowlighter/metrics) | 多种可配置个人活动图和信息组件 | 可提供有意义的活动模块，但配置/数据权限随所选功能变化；没有明确内容需求时不引入整套方案 |
| [GitHub Readme Stats](https://github.com/anuraghazra/github-readme-stats/blob/master/readme.md) | 统计与语言卡片 | **2026-10-28 官方 README 已说明原仓库不再维护**，并指向后继项目及 Action。原公共实例另有不稳定说明。用户也已明确不展示 star/排名，因此本轮不引入 |

此前对 icecoobe 报错的解释只提到公共服务限流，不够完整；本轮补充了上述维护状态。不能据此断言 icecoobe 那次失败的具体根因。

## 5. 用户当前主页的实际问题

[调研前线上截图](screenshots/current/imchikee-before.png) · [当前源码](https://github.com/imchikee/imchikee)

以下是针对当前效果的判断，不是待自动执行的修改清单。

1. **正文尚未充分利用已有的个人气质。** 头像里的轻松表达、Bio 中的“Don't know C++”可以成为主页很好的个人线索。问题在于右侧现有介绍偏通用、正式，还没有同样鲜明的本人语气；不应为了“专业”而修改头像或消除自嘲。两种表达也可以有意形成反差，不能把反差本身判为缺陷。
2. **主视觉仍偏通用。** 终端外框和叠窗可用于许多开发者。它与用户具体背景、兴趣或个人符号的联系，还没有被充分讨论。
3. **信息重复。** 自述、工程卡片、动态副标题、技术列表反复出现 C/C++、Linux/QNX、架构和开发工具。重复并不会增加可信度，反而挤压更像本人说话的内容。
4. **深浅主题的整页协调尚不足。** 本次实际访问为浅色页面，深色横幅和两张深色卡片对比强烈。深色资产并非不能放浅色页，但需要把它作为设计选择，而非只验证过深色本地预览就认为整体完成。
5. **技术区缩小了，设计语言仍未完全统一。** 图形轮廓、配色和带/不带图标的项目仍混合。是否采用统一标签、纯文字或同一风格的小标识，应放到完整页面里比较。
6. **首屏留白需要检查。** 这次截图里，横幅下的打字动画区域在初始帧接近空白。不能据此判断动画失效；但关键身份不应依赖访客等待动画，固定高度也应与实际信息量匹配。

较好且可以保留的基础：没有用 star 或排名证明能力；utopia 保持简短入口；当前内容没有把 cocoa/Solo 包装成代表作品。贡献动画也已经能生成，无需为继续美化而反复重建基础设施。

## 6. 后续讨论的三个方向

这些是候选方向，不是三个都要做的模块，也没有任何一个已经替用户确认。

| 方向 | 主要参考 | 视觉做法 | 适合的前提 |
| --- | --- | --- | --- |
| A. 轻松、紧凑的开发者个人空间 | moertel、orhun、caneco | 从现有头像、自嘲或个人兴趣出发，几句有本人语气的介绍，配少量统一标识和真实入口 | 希望有个人气质、好读又不空洞；本次优先建议讨论 |
| B. 一个强主视觉带动整页 | CyrisXD、WaylonWalker、halfrost | 名字和一句定位集中在横幅；正文简短；视觉主题贯穿少量组件 | 本人愿意确定一个长期使用的视觉主题或人物形象 |
| C. 明确的代码/复古个人表达 | rednafi 历史版、ashbakernz、fnky | 整页使用一种代码或复古语言，而非普通排版加几个装饰 | 本人确实喜欢这种表达，并接受部分访客需要多一步理解 |

现阶段的建议是先讨论 A 与 B，而不是立刻再做一版。真正需要用户决定的内容只有：

- 在个人空间里，更想让访客感受到哪种气质，例如轻松自嘲、极客趣味、复古、像素或其他本人喜欢的方向？这些只是讨论选项，不等于已经选择其中一种。
- 当前头像和 Bio 已经表达的幽默，是否希望在正文或主视觉中进一步延续？不要求将它们改得正式。
- 有没有本人喜欢、愿意长期使用的视觉元素或非技术兴趣？未知时不能编造。

用户已经确认的事实与偏好：GitHub 主页不是简历，可以轻松幽默；本人是主页主角；utopia 是当前置顶项目；cocoa/Solo 不作为代表作；不放 star/排名卡；希望参考实际好看的主页；先调研形成结论，再讨论下一版。此前接受过局部组件调整，不等于已确认终端风、双卡片、打字动画或当前整体设计最终定稿。

## 7. 本轮完成边界

- 调研截图、来源和结论保存在本地，未公开发布研究材料。
- 本轮没有改动主页 README、视觉素材、头像、Bio 或置顶项目，也没有部署新的主页方案。
- 下一步依据本文比较方向并讨论个人内容；报告中的建议不能自动转成实施授权。

## 截图索引

- [展示站实际页面](screenshots/gallery-site.png)
- [moertel：当前](screenshots/current/moertel.png) / [图库历史](screenshots/gallery/moertel.jpeg)
- [orhun：当前](screenshots/current/orhun.png) / [图库历史](screenshots/gallery/orhun.jpeg)
- [CyrisXD：当前](screenshots/current/CyrisXD.png) / [图库历史](screenshots/gallery/CyrisXD.jpeg)
- [用户当前线上主页基线](screenshots/current/imchikee-before.png)
- [用户提供的 icecoobe 统计卡报错](screenshots/icecoobe-user-supplied.png)

其余 12 张图库图片见第 2 节各样本链接。截图仅用于本地调研，不表示获得原作者图片的再发布许可。
