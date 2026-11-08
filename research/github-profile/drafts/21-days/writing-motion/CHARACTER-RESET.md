# 第二幕：重新对齐第一幕角色与自然姿态

## 2026-11-04恢复结果

用户切换代理节点后，原PNG单参考内置编辑成功，新原画为`scene-v12-character.png`，已接回动画。两幕对照、成功提示词、排障事实和检查范围见[FIRST-CHARACTER.md](FIRST-CHARACTER.md)。全程未用CLI/API或密钥，新角色与姿态仍未获用户确认。以下为恢复前的失败记录；其中“当前v11”“未解决”描述的是当时状态，不代表没有新候选。

2026-11-03，用户连续反馈“现在姿态还是有点古怪”“而且这一幕没有第一幕的仓鼠可爱了”。该反馈否定当前v11姿态与角色表现；清掉局部毛团不代表整体姿态或可爱程度获得认可。

本轮改以第一幕已阶段确认的 `reading-motion/lighting/down-v2.png` 为主角色参考，现第二幕仅作场景布局参考；重点保留宽软脸颊、低帽檐、大而清楚的眼睛、小鼻子和门牙，以放松的专注写字姿态重新组织头部/身体/前爪，不再刻意展示胸肩。

失败阶段记录：双参考图内置imagegen请求及同设定重试均以网络错误失败；第三次改成单参考图，直接以第一幕原画为编辑目标，将读书改为写笔记，但仍返回HTTP 500 / server_error，请求ID为`a38e8f25-d338-49c7-a98d-ca5cc582f805`。三次均没有返回图片，当时姿态与造型问题仍未解决。未切换CLI/API，未使用API密钥。v11及其原始像素数据、源码、GIF/截图已保存在 `cute-pose-rework-history/`，当时页面没有替换，第一幕文件未修改，未发布。

## 双参考图完整提示词（两次网络错误）

Use case: illustration-story, character consistency and natural writing pose.
Image 1 is the APPROVED CHARACTER MASTER: preserve this exact cute hamster identity. Image 2 is ONLY the chapter-2 ROOM / DESK / HEADING layout reference. Do not use image2's less-cute face or awkward body as the character model.

Create chapter 2 with the SAME hamster as image1: broad soft fluffy cheek pouches, low rounded forehead, large clear dark eyes with the same gentle eye shape, tiny pink nose, tiny pair of front teeth, rounded little ears, soft ivory/orange fur, and green cap sitting low. Keep the relaxed innocent charm and fine soft fur of image1; no taller narrow face, no small beady eyes, no human grin, no stiff upright portrait.

Pose: a relaxed hamster absorbed in writing, eyes directed down to the central notebook. Head gently inclined as in the approved reading pose, body compact and mostly behind the notebook/foreground books. Use the overlap of existing books to hide the upper forelimb roots naturally; only TWO tiny pink forepaws and short furry wrist transitions need be visible. The viewer-left paw grips a slim green pencil, ONE graphite tip touching comfortably INSIDE the central notebook left page near (650,875) in the 1316x1195 layout. Other paw steadies the notebook. Do not force visible shoulders, elbows or a separate torso into the scene. No broad human chest, no long horizontal arm, no giant raised rear or fat hump, no separate fur-ball/extra limb beside the body, no neck like a person. Animal's weight rests low behind the desk, not head flat on the desk and rump raised.

Keep image2 scene arrangement: warm LEFT desk lamp, central open notebook, other foreground open books, C++ mug and stack on RIGHT, plant/wall, painterly room texture. Keep exact chapter heading 'DAYS 11 - 21' / 'More C++.' Do NOT copy image1's large upright blue reading book, right-side lamp or surprise accent marks. This is a full new coherent writing pose based on the approved hamster, not another anatomy patch. Same full-frame aspect and dimensions as image2, one illustration.


## 单参考图重试提示词

Edit this APPROVED hamster illustration into chapter 2, preserving the hamster's exact cute identity and gentle expression.

Keep the same round fluffy cheeks, round ears, large clear dark eyes, small pink nose, two little front teeth, soft orange/ivory fur and green cap. Keep its naturally tucked, relaxed studying posture, looking down. Do not invent a new face, tall forehead, human torso or inflated body.

Replace the large upright blue C++ book with an OPEN NOTEBOOK lying comfortably on the desk in front of the hamster. The tiny viewer-left paw holds a slim green pencil and writes on the INNER LEFT PAGE of that central notebook; the other little paw steadies the right page. Pencil has one clear point contacting the page, well away from page edges. Lower forelimb roots can be naturally occluded by the existing foreground books; keep visible paws and wrists very short and connected below the jaw. No detached hands, no extra furry limb/lump or raised rump. Do not force shoulders or a separate human chest into view.

For this second chapter, move the desk lamp to viewer LEFT and illuminate the hamster/pages warmly from the left. Put a dark green C++ mug and stacked books on the RIGHT. Several open study books overlap in the foreground. Cozy room, plant and wall diagrams behind. Remove the three orange surprise marks. Replace the heading EXACTLY with 'DAYS 11 - 21' and 'More C++.' Keep this image's fine soft fur and painterly finish. One full-frame illustration same dimensions/aspect. The priority is the SAME lovable hamster from this image in a simple natural writing pose.

## 后续约束

用户随后明确“不用api”：只使用内置生图，不切换CLI/API，不读取或使用API密钥，不再主动请求切换。已在该约束下执行一次内置单参考图重试，仍返回网络错误，没有图片。累计四次内置请求均失败，当前重画受服务故障阻断；预览仍为v11，姿态与角色可爱度问题仍未解决。没有把任何失败调用算作新版本，第一幕和现有预览未改。


