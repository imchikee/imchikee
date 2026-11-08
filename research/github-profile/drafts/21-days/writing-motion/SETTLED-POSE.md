# 第二幕：降低后躯，重画坐稳后轻前倾的姿势

2026-11-03，用户指出“为什么看着像撅着屁股？”，助手确认此前只收后背、头爪仍压在桌面，轮廓呈前低后高；用户授权“继续”。本次重画整体重心，不再仅调整外轮廓宽度。

内置imagegen一次编辑，以 `scene-v9-compact-back.png` 为场景/角色目标，第一幕已阶段确认的 `reading-motion/lighting/down-v2.png` 为仓鼠身份及紧凑体态参考，保存 `scene-v10-settled.png`。后躯落在左下，只露低位的小团身体；脸略抬起，短前肢与小爪子仍支在中央笔记本上。未重画成人形宽肩/长臂。头部、身体和背景局部均有生成变化，不声称只改了后背像素，也不把提示中的移动像素当成实际测量值。

笔尖根据新原画校准至(633,876)，动作权重按新笔杆和小爪子调整。仍是同一原画连续采样，230×224像素区域、起点(480,718)；三段累计前进6原画像素，段间/末尾抬笔约4像素。数据、导出检查、独立页及完整主页共用模块已同步。第一幕文件未改，未发布。

已重导出96帧/3.2秒GIF，实际查看正常尺寸整幅、12格连续帧及 `pose-comparison.png`（左v9、右v10，各534宽）。起始特写与新原画RGB相同，三个选定纸页/文字/页边区域在四个关键帧间RGB相同。检查不代表新坐姿获用户认可，当前仍待用户评价。

v9原画和提示词完整保留；修改前源码、像素数据、GIF、体态图及旧收背对照在 `raised-rump-rejected/`。旧 `back-comparison.png`继续保留，独立页改链接到新坐姿对照。

## 完整提示词

Use case: illustration-story / whole-pose correction.
Input 1 is the EDIT TARGET for chapter-2 layout and character. Input 2 is an APPROVED hamster identity / natural animal-proportion reference only.

Fix the animal's WEIGHT DISTRIBUTION. The current drawing reads as a hamster with its rear raised and face pressed down at the table. Do NOT just narrow that raised hump again. Repose the whole hamster into a small, settled SEATED hamster resting on its haunches behind the notebook, leaning forward only gently to write.

The rear/haunches must be LOW and supported below the desk line, not a high mound behind the left ear. Show only a small low rounded side of the body on viewer left, around y745-835 in the 1316x1195 canvas; its back slopes gently toward the head without an elevated rump or arch. Remove the high rear-body mass currently rising over y550-700. Restore room background there where appropriate. Lift the face/chin a little, about 40-55 pixels, so it is not lying on the page; eyes look down at the notebook. Keep big hamster cheeks, little round ears, tiny muzzle/teeth, green cap and the same soft orange/cream identity. Head overlaps the little body naturally without an exposed long neck.

Keep the body compact and rodent-like. Forelimbs are VERY SHORT and hidden in fur; only the two small pink forepaws reach the notebook under the lower chest. Keep the writing paw and single green pencil on the CENTRAL notebook left page, away from the foreground book edge. Other tiny paw steadies the same notebook. NO broad human shoulders, NO separate upright human chest, NO long exposed arms, NO inflated gas-cylinder body, NO raised rump, NO four-legged crouch with hips in the air. Do not make a bear or a person in a hamster head.

Preserve the desk/room layout, LEFT lamp light, right mug/stack, foreground books, central notebook, fine painterly fur and exact heading 'DAYS 11 - 21' / 'More C++.' Use input2 only for hamster cuteness and compact seated anatomy, not its held blue book or lamp placement. Same full frame size/aspect as input1. This must be a visibly different balanced seated pose, not a subtle body trim.

