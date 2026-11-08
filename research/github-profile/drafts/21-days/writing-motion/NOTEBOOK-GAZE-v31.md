# 第二幕：低头看笔记本

2026-11-05。用户指出v30侧脸朝向不对、没看笔记本，写字行为不成立。当前优先保证注意力落在左页笔尖，不能只追求柔和五官而忽略动作语义。

以内置imagegen从scene-v30-current.png编辑轻轻低头的头部，双眼向下略向画面左侧看笔尖。完整原始输出保存[head-edit-v31.png](head-edit-v31.png)，原文件exec-fc84c13f-8ea8-499f-be48-3f824077a16c.png。只通过头部软区合成，避开原写字手笔、静止爪与纸页，输出[scene-v31-current.png](scene-v31-current.png)。原始生成图对手笔有重绘，运行时不用该部分。旧稿和脚本compose-expression-v30.mjs、shot-v30.js保留。固定入口revision=31，无新编号HTML。头部保持这一静态低头姿态，不宣称新增抬头/低头连续表演。未使用API/CLI，未发布，尚未获用户评价。

## 完整提示词

Edit this exact chapter2 scene. The hamster is WRITING on the notebook, not posing for the viewer. Correct the HEAD/FACE AND GAZE: remove the current turn toward viewer RIGHT. Face should be centered toward the notebook, with a gentle downward head angle. Both pupils must visibly look DOWN and slightly toward viewer LEFT at the green pencil TIP touching the LEFT notebook page (tip approximately x580,y930 on this1316x1195image). Its attention must clearly be on the notebook, not the camera, not to the side. Retain warm brown cute eyes, rounded upper lids with short soft outer corners, no large eye whites. Keep small pink nose centered on head and naturally aligned with the gentle downward tilt. Cheerful soft open smile with two tiny front teeth, broad shallow opening, not a deep gaping grin. Preserve existing hamster head silhouette, cheeks, green cap and ears as much as possible while making the subtle downward head pose coherent. Preserve exact original writing paw, green pencil, resting paw, notebook geometry, books, LEFT lamp, RIGHT C++ mug, all room and framing. Only head/face fur and facial pose/gaze may change. No side-facing head. One complete edited scene same size and aspect ratio.


已完成3.2秒96帧导出，原手心与选定固定区域检查通过；实际查看原尺寸完整写完帧和面部/笔尖阶段图，检查低头视线与左页笔尖的关系。冻结motion-v31.gif、native-finish-v31.png、character-comparison-v31.png。检查不代表用户视觉确认。
