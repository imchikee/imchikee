# v45：从二维动画关节经验修肩根，而非继续淡出

2026-11-06。用户反馈feedback-v44-floating-root.png：“你还是虚空连接的手臂”，要求上网查。助手最初搜索仓鼠解剖/姿态，用户追问“你搜索的是动画的处理经验吗”，指出搜索方向偏差。随后改查二维切片动画的真实转轴、关节重叠与网格权重。

## 直接相关的一手资料

- [Toon Boom — About Pivots](https://docs.toonboom.com/help/harmony-20/essentials/rigging/about-pivot.html)：手臂的转轴要位于肩关节，并使手臂保持接在躯干上。文档搜索可取得正文；harmony-22对应链接本次404，采用能检索正文的harmony-20版本。
- [Toon Boom Animate 2 Getting Started Guide — Fixing Articulations and Gaps](https://docs-stg.toonboom.com/download/animate/2/Animate_2_0_Getting_Started_Guide.pdf)：搜索正文说明重叠关节去掉上层接合区的轮廓，可使两片看成连续绘画。PDF直取本次401，未声称已看PDF截图。
- [Spine — Weights](https://en.esotericsoftware.com/spine-weights)：网格顶点按权重跟随骨骼；重叠网格可匹配权重，建议在完整最大运动范围内验证。
- [Spine Tips](https://esotericsoftware.com/spine-tips)：提供固定骨与控制骨共同影响网格、以及肩部额外权重控制的实例。

## 对当前实现的诊断与改动

v44把整条前肢跟手平移，再把身体侧根部渐变透明；看似柔边，实际没有固定肩根，也没有真正的连接组织。这是结合代码与用户红框作出的判断，不是网络资料对本图的评价。

v45保留v38原画与clean42补底，不新增生图，不改脸型或挖身体。前肢采样向上/向左包含原肩侧连接组织；补底只清理远端旧肢体，身体侧的原画连接留在原位。删除整条手臂平移与根部透明渐变，改为连续网格：身体侧权重为零、手端权重为一，中间毛臂平缓过渡，爪与笔杆保持刚性；上缘留在身体侧，接合区的柔边位于同一片原画内部。

内部试过双段肘关节IK，但最大位移时把原画毛发拉折、产生细线，实际查看后否掉，没有接入固定预览。保留shot-v45-ik-rejected.js；最终采用适合当前小幅书写的固定端/手端连续权重，不因搜到骨骼教程而强加完整骨架。新的肩根检查读取实际原尺寸画面，比较身体侧连接区域在所有关键帧是否保持原位。

检查与采用状态在实际导出后续记；不把像素检查通过当成用户认可。旧v44源码与GIF保留，无新编号预览HTML，第一幕及线上内容不改。


## 检查修正记录

最初把连接区直接与原图要求逐像素相等，起始帧仅3个色彩通道有1级差（960通道平均0.003125），来自网格重采样；关键帧之间该区域完全相等，没有任何位移。因此连接区检查改为实际起始渲染与后续关键帧严格相等，而不是把渲染舍入误当肩根移动。没有放宽动画期间的固定要求。

最大位移处另发现尖角裁切延伸和夹带书边，限制网格裁切尖角长度，收紧毛臂下缘；对应未修检查图不作为最终图。

## 最终接入

最终完整导出96帧/3.2秒，实际查看最大位移原尺寸root-late-v45.png、arm-review-v45.png手部12阶段与whole-animation.png整幅12阶段；细线已消除，根部保留身体连续体积，肩侧固定。初始掌心、实际肩根关键帧固定、原画选定头脸/场景、静止爪、纸页区域检查全部通过。最终候选在这些检查后才复制为shot.js并接固定入口revision=45。保存motion-v45.gif/native-finish-v45.png/character-comparison-v45.png；新旧慢放arm-middle-comparison-v45.gif左v44右v45。此次改变连接和运动方法，不把功能检查写成审美已获认可。

固定页最终截图preview.png已查看；capture.mjs通过revision=45加载、两幕播放/暂停/跳转、明暗1440/390布局；当前平均绘制2.6ms。git diff --check通过，第一幕与线上README/assets无改动。
