# 场景中细修，而非继续标准化角色

用户认为角色表不如原手绘稿可爱，并询问仓鼠胡须。助手判断，角色表的端正站姿、规整对称轮廓与克制表情削弱了原场景里的情绪和动作。用户继续后，直接回到原稿第一格，保留抱书探身、鼓腮、帽子倾斜和开心表情，仅细化毛发与胡须。

输入为本地SVG视窗的第一格截图，保存为`reading-before.png`。使用内置imagegen一次请求，输出保存为`reading-soft-v1.png`，原默认生成文件保留。两者在`scene-check.html`并排展示。当前是原画局部试修，待用户评价；不是动作动画，未替换原整页或九格，也没有CLI/API生图。

```text
Use case: precise-object-edit. Edit this exact illustrated scene of the happy hamster reading a C++ book. Keep the entire composition, room, camera, lighting, book, hands, lettering and the hamster's precise pose and facial expression unchanged. Especially preserve its cheek width, eye positions, tiny pink nose, open delighted smile, teeth, cap tilt and eager lean toward the book. Do not make the expression neutral, the pose formal, or turn it into a model sheet.
Change only the fur rendering and whiskers: make the coat softly hand-painted, with much finer, sparser low-contrast strokes instead of dense coarse white scratches and sharp dark spikes. Retain warm orange/cream shading and the existing storybook illustration texture, not flat vector art, glossy 3D or airbrushed plastic. Outer cheek and ear contours should be rounded and soft with few tiny wisps, not sawtooth fur.
Replace the three thick brown cheek stripes with just two very fine, light brown tapered whiskers per side, originating naturally near the muzzle. They should be subtle and not dominate the face.
Do not change character proportions, expression, gesture, color palette, background or props. Return the same complete panel, same framing and labels.
```
