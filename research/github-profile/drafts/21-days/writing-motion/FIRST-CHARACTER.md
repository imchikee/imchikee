# 第二幕：直接以第一幕角色重画写字姿势

2026-11-04。用户指出第二幕姿态仍怪、不如第一幕可爱，并明确“不用api”。随后用户说“我切换了代理节点，你再试一下”。切换节点后，内置imagegen单参考图编辑成功，未使用CLI/API或API密钥。

## 原画与接入

输入是第一幕已阶段确认的 `reading-motion/lighting/down-v2.png`，直接将读书动作改为写笔记，不再以此前第二幕的变形脸型为角色基础。输出保存为 `scene-v12-character.png`（1316×1195）。

新图沿用第一幕的软脸颊、大而清楚的眼睛、小门牙与低帽檐，身体大部分在桌面/书本后，短前爪支在中央笔记本。左灯、右侧C++杯/书堆保留为第二幕布局，但笔记本改成了活页装订、前景书本与房间也有整体生成变化，不声称仅替换了脸或局部像素。新姿态与角色一致性仍待用户评价，不能把生成成功视作审美确认。

`shot.js`、`build-region.mjs`、`region-data.js`、导出/检查脚本和独立页已更新；不再运行v11的局部补片合成。手笔区域270×266、起点(390,700)，笔尖约(566,894)，三段累计向右6原画像素、段间及末尾抬笔约4像素。未新增头部动画。

独立页左侧新第二幕动画，右侧第一幕原画参考；`character-comparison.png`是同尺寸两幕对照（左第一幕、右新第二幕）。旧v11及源码/像素数据/GIF/画面在 `cute-pose-rework-history/`，所有历史原画/补片/提示词继续保留。第一幕文件未改，未发布。

## 实际检查

已导出3.2秒96帧GIF并查看正常尺寸整幅、原尺寸手部、12格连续帧以及两幕对照。起始手部与新原画RGB一致；左侧纸页、代码行和笔记本装订区域在四个关键帧间RGB一致。检查只证明这些区域，不替代自然度和可爱程度判断。

## 故障排查与恢复事实

切换节点前共六次外层调用失败：双PNG参考两次、单PNG编辑两次、281KB JPEG会话引用一次、无参考图生成一次。日志分别确认编辑走 `images/edits`、无图生成走 `images/generations`；图像正常解码，失败包含网络错误及实际HTTP 500。工具内部还执行了自动重试。没有发现遗漏的新输出文件。

官方[错误文档](https://developers.openai.com/api/docs/guides/error-codes)把HTTP 500列为服务端处理错误，但这不能单凭一条状态码就排除代理/连接路径问题。用户切换代理节点后，原先2.1MB的第一幕PNG单图编辑直接成功，因此不能声称压缩图片或切换引用方式修复了故障，更不能把此前失败简单归为无法排查的服务故障。没有修改代理、证书、登录或密钥配置，也没有换用其他付费生成服务。

## 本次成功调用完整提示词

Edit this APPROVED hamster illustration into chapter 2, preserving the exact lovable character: broad fluffy cheek pouches, gentle large dark eyes, tiny pink nose and two front teeth, round ears, soft orange/ivory fur and low green cap. Keep its relaxed tucked studying posture and downward gaze. Replace the large upright blue reading book with an open notebook lying naturally on the desk. One tiny viewer-left forepaw holds a slim green pencil, its single tip touching comfortably INSIDE the central notebook left page; the other tiny paw steadies the right page. Naturally hide upper forelimb roots behind overlapping foreground books. No long arms, human shoulders/chest, tall narrow face, raised rump or extra furry lumps. Warm green-shaded desk lamp on LEFT; dark green C++ mug and stacked books on RIGHT; several open books foreground, plant and faint wall diagrams. Remove orange surprise marks. Heading exactly 'DAYS 11 - 21' / 'More C++.' Same near-square framing and fine soft painterly finish. Preserve this approved hamster's cute face rather than designing a new animal.

