# 微张口自然小笑：一次设计与绘画

内置 imagegen，仅一次调用、一个候选。编辑底图来自 closed-smile-design/candidate.png 原坐标(620,690)–(760,790)，140×100。原始U形嘴仅裁取门牙体量参考；两版嘴部没有直接混合。

内部先绘制一张 design-guide.png 结构示意：两瓣圆润上口鼻、适度露出的独立门牙、牙根后方小而浅的口腔阴影，牙尖下方不画托牙弧线；左右嘴角有轻微差别。该图只作内部拓扑指引，不是第二个绘画候选。

实际提示词：

+Use case: precise-object-edit. Create ONE final slightly-parted natural hamster smile in this registered mouth crop.
INPUT ROLES:
Image 1 is the EDIT BASE, the CURRENT CLOSED-SMILE crop (140x100). Paint the new structure directly from this crop, preserving its nose, position, cream muzzle volume, light and fur texture.
Image 2 shows ONLY the original two teeth as a VOLUME/ENAMEL REFERENCE. Do not copy its dark mouth surround, lip or mouth contour, and do not blend/paste the two input paintings.
Image 3 is ONE internal TOPOLOGY SKETCH: modest elongated tooth tips attached under the upper muzzle, small shallow shaded cavity BEHIND the roots and sides, slightly unequal rounded upper-muzzle curves. It is NOT a style reference or a literal geometric template. Render a coherent soft-furred painting, not flat diagram lines/rectangles.

DESIGN: a SMALL slightly parted, relaxed, quiet but lively smile. Two clearly recognizable ivory incisors with some exposed length and soft rounded three-dimensional shading. More exposed than the white specks in Image 1, significantly less exposed than Image 2: roughly 8-10 original crop pixels of tooth height, not tiny white dots or long full buck teeth. Naturally rooted beneath the upper muzzle, never floating on the cream face. Do not stretch or scale existing tooth pixels: repaint their anatomy, depth and soft enamel highlights as part of the new coherent mouth.
Keep a VERY SHALLOW, SMALL warm-dark oral recess just behind the tooth roots and to their sides, enough to imply depth, not a wide open grin. No broad dark U/crescent enclosing the teeth. No thick lower-lip band, no dark arc directly under both tooth tips, no tooth tips resting on a lip. The lower opening should dissolve subtly into cream chin fur, never an outlined lower border carrying the teeth. No tongue, big open laugh or forced teeth-baring.
Retain rounded left/right short-muzzle lobes under the unchanged nose. Relaxed corners with only modest upward movement and a little natural perspective asymmetry: do NOT draw two exactly mirrored smile arcs or curled hook corners, a sharp cat W or a smirk. Aim for a sweet hamster quietly thinking while studying, not blank, severe or posing for the viewer.
Keep the NOSE EXACTLY unchanged in shape, size, location, material and highlight. No change to the tiny eye fragments at the upper corners, head/muzzle volume or surrounding fur. Same cream directional short fur, painting grain, warm light and color; no smooth blurred patch, repeated texture, cutout edge or flat color paint-over. Confine the redraw to the small mouth, exposed incisors, oral recess and immediately adjoining fur.
Original crop framing remains EXACTLY 140x100, aspect 1.4:1; output the entire corrected crop only. ONE candidate, no alternatives, labels, comparison or diagram rendering. At thumbnail size it should show two modest teeth and a lively small smile, distinct from the nearly closed white specks but without returning to the wide dark U mouth.
