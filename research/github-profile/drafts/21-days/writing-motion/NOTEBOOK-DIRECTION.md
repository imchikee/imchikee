# 第二幕：笔记内容面向仓鼠

2026-11-04，用户指出“现在代码是朝我们这边的”。中央笔记本的内容应面向作者，即从镜头看倒置180°；场景标题与杯上C++不属于笔记内容，保持原方向。

曾用内置imagegen请求只旋转笔记内容，但请求网络失败、没有生成图。未使用CLI/API或密钥。最终改为现有动画/导出流程中的确定性文字图层处理，不重新绘制角色：`compose-notebook.mjs`在v12中提取棕色手写墨迹，沿同一纸面行从邻近无字纸面估计底色，旋转原字迹180°后合回，输出`scene-v13-writing-direction.png`。不是水平镜像，也不旋转书页、装订环、纸面线条和阴影。笔尖、手爪、纸页边缘均排除在墨迹选择区外。

处理窗口为左页x470–681/y892–985、右页x746–975/y878–968，窗口以外RGB与v12完全一致。右页C++标题/清单也改为朝仓鼠。纸面内仅清理原字迹附近的小范围并合入旋转墨迹，保留原手写轮廓，没有用新字体替换。

`build-region.mjs`先合成新原画再取手部样本；`shot.js`将笔迹推进方向改为镜头向左6原画像素，对应仓鼠视角从左到右，笔尖起点(566,894)、三段时序和抬笔保持。`writer-view.png`把中央笔记本局部转向作者方向，已实际查看代码/清单可正向阅读；正常整幅、手部帧也已看过。GIF重导出3.2秒96帧，原画对应、窗口外RGB、笔尖RGB和四帧纸页/代码/装订区域检查通过。原角色/姿态尚未获用户确认，第一幕未改，未发布。

v12原画保留，修改前源码/像素数据/GIF/检查脚本在`before-notebook-direction/`。独立页和完整主页共用更新模块，新增仓鼠阅读方向核对入口。

## 失败的内置编辑提示词

Precise local edit: fix ONLY the reading orientation of the handwritten contents of the CENTRAL SPIRAL NOTEBOOK in this image. The hamster is sitting on the far side of the desk, so its own writing must face THE HAMSTER, not the camera. Rotate the left page's C++ code block 180 DEGREES within the same page: the camera must see the code UPSIDE DOWN, and the hamster would read it upright. This is rotation, NOT mirrored/backward text. Keep the same short for-loop and braces. The first 'for (int i=0; ...)' line should now be near the LOWER/FRONT edge of the left page; the closing brace nearest the hamster at the top. Likewise rotate the right page's small C++ heading and checklist 180 degrees to face the hamster. Keep all text inside the same page interiors. DO NOT rotate the notebook itself, rings, page ruling or shadows. Keep the pencil and its point, both paws, hamster face/body/cap/fur, lamp, mug, foreground books, room and large scene heading exactly unchanged. Only the ink on these two central notebook pages changes. Same full frame size and framing. Large top heading and mug C++ stay upright to camera.

