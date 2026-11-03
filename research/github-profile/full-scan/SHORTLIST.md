# 历史截图阶段的候选复核

2026-10-28阶段记录。**当前核对和更新结论见[最新报告](../REPORT.md)及[188条当前记录](../current-scan/ALL-PROFILES.md)，本文件不作为最新候选名单。**

先看完188份图库截图的整体构图，再从24个“revisit”中选择7个风格差异较大的案例查看原尺寸截图。选择依据是能否补充不同的个人表达方式，不是人气或全站美观排名。其余候选保留在全量表里，没有声称均核对过当前实现。

当前来源与文件版本见 [current-sources.json](current-sources.json)。除Wrapperup外，以下6例读到了当前README，其中4例另查看当前网页截图。原抽样阶段已有的moertel、orhun、CyrisXD仍可比较，但不享有“默认最优”的地位。

|样本|为什么选|历史与当前的区别|具体实现及对用户的价值|
|---|---|---|---|
|[Thaiane](../screenshots/gallery/Thaiane.jpeg)|人物插画、代码式介绍、轻松语气并存，信息不空|[当前页面](../screenshots/current/Thaiane.png)仍保留这套结构；职业信息有更新|README用`align='right'`、固定宽度GIF、JavaScript代码块。可参考图文比例和亲近感；图中人物、技术及社群经历属于作者，不能照搬。代码块并非必须。|
|[Wrapperup](../screenshots/gallery/Wrapperup.jpeg)|霓虹主视觉、手写说明、白色技术标志形成一套完整视觉|当前同名仓库及README查询均404，未取得当前实现|只作为历史视觉参考：大图与技术区可以属于同一主题。不能承诺同样资源、主题适配或动效现成可用。正文本人信息少，不能整页照搬。|
|[hedythedev](../screenshots/gallery/hedythedev.jpeg)|终端主题来自完整自述结构，而不只是加一个窗口框|现更名[hedyhli](https://github.com/hedyhli)；当前源码仍有ASCII、`ls links`、`finger hedy`，项目已更新；未另截图|当前源码主要用`pre`、`strong`、链接，几乎不依赖数据服务。借鉴一致的表达语言；等宽长行的手机阅读本次未测，不能宣布适配良好。|
|[vidursatija](../screenshots/gallery/vidursatija.jpeg)|以Abstract、Specifications、Requirements、How to run介绍人，技术文档本身成为幽默|当前README改成短About Me和兴趣列表，旧版文档主题已不存在|旧版适合作为程序员式自嘲的写作参考，说明“有趣”不一定靠笑话API。技能熟练度表和虚构硬件参数不复制；当前源码不能用于还原旧实现。|
|[HFO4](../screenshots/gallery/HFO4.jpeg)|互动与本人模拟器项目直接关联，主页本身也是工程作品入口|[当前页面](../screenshots/current/HFO4.png)保留控件，但本次游戏图未加载；不据此断言永久失效|README的图片从外部服务取画面，按钮链接发控制请求并返回主页；来源指向作者自己的gameboy.live。没有点击控制，也没有验证后端。值得借鉴“玩具与本人联系”，不为装饰另造游戏服务。|
|[jh3y](../screenshots/gallery/jh3y.jpeg)|旧版卡通标识与红黑横幅识别强，不靠统计|当前README仅链接`assets/gem.svg`并跳个人站；[实际截图](../screenshots/current/jh3y.png)呈现craft图形，与图库旧横幅不同|当前是单个仓库SVG入口。未检查SVG源码与完整动画，不能把alt文字“spinning gem”当成动效验证；旧横幅可研究个人图形，当前极简不能用来证明用户也该删光内容。|
|[sindresorhus](../screenshots/gallery/sindresorhus.jpeg)|复古网页元素连成完整玩笑，有明确人格和轻松感|[当前页面](../screenshots/current/sindresorhus.png)比图库旧版更丰富，含施工条、猫、独角兽、火焰和旧式标志|当前README引用仓库内GIF/PNG，不需要逐项调用统计API。计数器外观是`counter.gif`，没有证据证明实时计数。可以借复古彩蛋与统一语气，不复制作者兴趣，也不因其知名而认为同样空白内容适合用户。|

## 与先前结论的实质变化

- moertel只回答了“技术标签如何紧凑整齐”的局部问题；不足以单独回答用户想要的酷炫、好看且像本人的整体主页。
- Thaiane给出“有图形、有本人内容、也不空”的另一条路线；Wrapperup给出“主视觉与工具区统一”的另一条路线。这两者比继续删内容更直接回应用户反馈。
- hedyhli和vidursatija表明幽默可以来自介绍自己的方式，保留`Don't know C++`并不妨碍清晰表达技术背景。
- HFO4说明互动可以很有价值，同时本次缺图也说明不能只看历史成功截图。是否维护动态组件应由实际内容需要决定。
- sindresorhus、fnky、BrunnerLivio都证明复古可以成为完整主题；不需要只围绕“克制、正式”筛选样本。用户是否喜欢这种风格仍待讨论。

这是一组供下一轮讨论的不同参考，不是拟好的实施方案。没有把其中任何一例确定为用户最终方向。
