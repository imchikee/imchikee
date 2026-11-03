# 编译间隙的小假期：三格试稿

**已被后续反馈取代：** 本图开始生成后，用户明确不喜欢编译完成的收尾，并进一步强调笑点应落在编译时长。三格原图仅保存在`compiling-break-original.png`作历史，不推进末格。当前方案见[植物生长表现编译等待](slow-build-PROMPT.md)。

用户澄清「编译摸鱼」例子可以，疑问只针对编译完成后主动重新编译的动作；不应据此否定整个方向，也不需要用户提供幽默样本。复用已获好评的仓鼠，改为等待编译时准备休息、刚躺舒服却被完成提示打断。新分镜本身尚待评价，不自动做成动画或接入主页。

内置imagegen，角色参考：[搬家公司仓鼠](move-permission.png)。输出：`compiling-break.png`。灵感延续已记录的xkcd Compiling等待情境，情节、角色、画面另行设计。

## 提示词

```text
Draw one landscape three-panel comic, 1536x1024, three equal panels in a horizontal row. Warm textured pencil/gouache on cream paper. Reference only the cute hamster identity: plump brown body, huge cream cheeks, pink ears/nose, whiskers, incisors, expressive brows, green cap. New poses, same character and camera throughout.
The clear story: while waiting for a C++ build, hamster prepares a tiny holiday at its desk; the build finishes just when it gets comfortable, and it scrambles back to work. No restart/rebuild buttons, code syntax, extra characters or explanatory narration.
Panel 1: hamster upright at a small desk, paw has just started build, watching monitor impatiently. Large legible screen text "C++" above "Compiling..." and "1%". A very short progress bar.
Panel 2: same desk, screen still "Compiling..." now "2%". Hamster has extravagantly reclined the chair, feet up, miniature beach umbrella beside chair, sunglasses pushed onto cap, holding a drink with a straw. Very pleased, eyes half closed, JUST settling in for first sip. Funny over-prepared miniature vacation, not a real location change.
Panel 3: same monitor now full green progress bar and large "Build complete!" with a little "DING!" notification. Hamster abruptly sits bolt upright and reaches for keyboard, eyes wide, sunglasses crooked over one ear, drink still in other paw, umbrella still open. Its startled annoyed face says this alarm interrupted its relaxation at exactly the wrong instant. Tiny speech balloon "Already?!"
Keep hamster faces large, round and lovable. Make screen state, relaxation and sudden reaction readable immediately. Simple scene, generous clean space; only specified text. No repeated compilation, books, piles or watermark.
```
