# 完整轮廓修订（2026-11-02）

用户明确纠正：标记只是在指出问题，不能被当成仅修改那个局部的边界。范围包括左脸、左耳、右耳和右脸，且三个动作姿态都要统一。使用内置imagegen，每个姿态一次，不使用CLI/API。

输入为当前合成画面中完整头部（原图坐标x170/y280/w850/h530），保存 `head-contour-input-{front,mid,down}.png`；输出 `contour-head-{front,mid,down}-v1.png`。保留原文件，动画/姿态页/对照页通过同一配置合成四段外沿，保护原五官、帽子和书本。头部图中的所有像素并未全部替换进原图。

## 实际提示词（三个姿态分别使用同一提示词）

Use case: precise-object-edit. This input is an exact head crop from a larger hand-painted hamster scene. Return the identical crop framing and character pose.

UNIFY THE ENTIRE FUR SILHOUETTE, all four regions: (1) left cheek including below the ear, (2) the ENTIRE outer rim of the LEFT round ear, (3) the ENTIRE outer rim of the RIGHT round ear, (4) the right temple and RIGHT cheek down to the book. Do not fix only one marked spot. The outer ear rims and right cheek currently have long dark/orange needle tufts, a jagged comb-like halo. Actually paint those projecting triangles OUT and fill their former tips with matching room background. Repaint both ears as rounded soft curves, and both cheek edges as full smooth convex curves, with only occasional tiny, very short low-contrast soft wisps. No rows of sharp spikes anywhere on these four outer fur edges. Do not merely blur or lower contrast on the same jagged silhouette.
Make this visible at the two ear rims and the right cheek. Keep a soft fluffy painted character rather than a hard outlined vector shape. The smooth arcs must preserve cheek fullness and ear size, not shave the cheeks flat. Cap edges and whiskers are NOT fur and must retain their original shapes.
STRICTLY PRESERVE the eye/nose/mouth positions and shapes, highlights, smile/teeth, expression, downward or upward gaze, head angle, ear center positions and pink interiors, cap position/tilt/shape, original orange/cream coat and interior fine-fur shading, whiskers, book, paws, background layout and scale. No facial squashing, no moving or duplicating an ear, no new bump at an ear root, no zoom/crop or restyling. Only a narrow band along the WHOLE outer fur silhouette is repainted; all other painting stays intact.
