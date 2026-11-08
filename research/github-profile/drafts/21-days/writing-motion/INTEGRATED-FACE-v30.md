# 第二幕整脸表情修订

2026-11-05，用户仍觉得v29怪。助手自查：前轮把五官调得过于正、过于对称，圆眼和纵深较大的笑口不贴合原有头部转向。不能将用户对某个问题的纠正扩展成要求完全对称。

本轮以内置imagegen同时查看第二幕完整原画scene-v29-current.png与第一幕完整原画../reading-motion/lighting/down-v2.png，作为整脸绘制，恢复自然透视差别、柔和短眼角、棕眼、宽而浅的张开笑容。保留第二幕自己的环境，不复制第一幕房间。

原始完整输出保存[face-edit-v30.png](face-edit-v30.png)，原文件exec-ff772b2d-1e8e-45dd-99b8-ab74c8c86b0a.png。运行时只通过连贯面部软区接入，保留手笔，连贯接入面部与胡须，输出[scene-v30-current.png](scene-v30-current.png)。旧稿与脚本compose-expression-v29.mjs、shot-v29.js保留。固定index.html更新revision=30，无新编号HTML。未使用API/CLI，未发布，尚未获用户评价。

## 完整提示词

Image1 is the chapter2 edit target. Image2 is the approved SAME hamster character in chapter1, the precise character reference, not a room reference. Correct only the facial expression of image1 as an integrated painted face, naturally fitting its existing head angle and cap. Current face looks unnaturally symmetric, with a deep gaping U-shaped mouth and rigid round eyes. Match image2's actual warm lively eyes: soft short outer corners, curved lids, deep brown irises, subtle natural perspective and size difference between near/far eyes. Match image2's cheerful OPEN smile, a broad but shallow curved mouth with two small front teeth and a little red interior; not a tiny closed smile and not a deep vertical gaping grin. Eyes, nose, muzzle and smile must share ONE coherent slight head turn, no mismatched tilt or crooked mouth. Preserve the current head silhouette, plump cheeks, orange/ivory colors, exact cap, ears, whiskers, paws, green pencil, notebook, ALL room objects and composition from image1. Only facial features and immediately surrounding fur may change. Keep original LEFT lamp lighting. Do not copy chapter1 book or room. One full chapter2 image same dimensions/aspect ratio as image1.


已导出3.2秒96帧并通过选定固定区域检查；实际查看原尺寸写完帧和两幕对照。冻结motion-v30.gif、native-finish-v30.png、character-comparison-v30.png。以上为助手检查，不能作为用户审美认可。


首次导出发现旧眼下缘残影，因过窄的胡须避让范围留下旧眼像素，未作为最终交付；改为连贯覆盖整组面部与胡须的软区，手笔仍避开，修后再次导出。

修正遮罩后的整图与动画导出对照已实际查看，旧眼残影已清除；上述v30冻结输出已同步为修后结果。
