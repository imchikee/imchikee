# 第一幕质感静帧候选 · 2026-11-03

## 第三次：高清正面原画局部上色

用户指出v2只是变糊，未采用。用`../model/reading-soft-v1.png`高清正面原画编辑一次，输出`painted-v3.png`；`v3.html`仅比较这张高清原画及其候选，两图同姿态同绘制分辨率，不与前两次低头截图混比。实际看左腮阴影略偏冷，右侧偏暖，五官清楚；仍保留不少粗毛纹，不能宣称风格统一完成。未替换原稿或动画。

### v3完整提示词

Local illustration edit of the supplied HIGH RESOLUTION original. Output one full image, same framing and aspect ratio. Keep this exact joyful open-mouth hamster, exact pose, proportions, facial features, round ears, green cap, hands and blue C++ book. Keep the room, text and objects unchanged. Change only the COLOR PAINTING of hamster forehead, cheeks and inner ears so it shares the existing room's warm hand-painted storybook medium. Use visible but restrained brush-drawn color transitions at a MEDIUM scale: small number of irregular connected painted passages with subtly varied warm apricot, pale ochre, ivory and muted peach; faint cool lilac-brown in the shaded LEFT cheek, warm pale yellow from the RIGHT desk lamp. Retain readable forms and delicate short fur strokes, crisp eyes, nose, mouth and whiskers. Important: painterly does NOT mean more sharp fur detail or a global texture overlay, and does NOT mean blurred/smudged gradients. Render the color as lightly overlapping translucent brush passes, gently uneven coverage and sparse directional dry-brush accents. Neither smooth airbrushed 3D fur nor fragmented mosaic/dabs. Edges can mix softly feathered brush edges with a few precise short marks, no new long spiky hairs. Preserve cuteness, cream cheek area, existing brightness, clear expression. No overall sharpening, blur, noise, impasto, geometric patches, palette overhaul or redesign. Exact text: DAYS 1 - 10; The basics.; C++. Existing background is the medium reference and must remain unchanged.

## 第二次：减少毛纹与硬色片

用户指出v1主要只是更清楚；v1未采用。继续用原`before.png`做一次内置imagegen编辑，保存`painted-v2.png`。对照页将两图均通过浏览器canvas绘制为输入原图的相同像素尺寸，再等大显示；不修改图片文件。

实际看v2：v1碎硬的片状笔触消失，细碎毛纹减少，但上色依然偏平滑，尚不能称与环境融合显著改善。仅候选，未接动画。

### v2完整提示词

Edit the supplied image, one full scene, keep its aspect ratio and composition exactly. This is a SMALL LOCAL PAINTING EDIT to ONLY the hamster's forehead, cheeks and inner ears. Keep the entire background, book, cap, hands, text, lighting and all face geometry unchanged. Preserve exact hamster identity, round plump cheeks, tiny muzzle, head tilt, eye sizes and positions, smile, whiskers, rounded silhouette. MAIN CHANGE: simplify the surface painting. REMOVE most of the tiny high-frequency individual hair marks on the face. Use a few BROAD, SOFT-EDGED, low-contrast opaque watercolor/gouache washes to describe orange forehead and creamy cheek volume, with gently irregular boundaries. The cream cheeks should read as quiet soft luminous masses, not fields of small marks. The pink inner ears likewise use simple softly uneven painted washes instead of airbrushed shiny gradients. Keep a very light natural paper tooth, visible only close up. This should look softly brushed and cuddly, sharing the warm children's picture-book environment. NOT more detailed, NOT sharper, NOT more saturated. Absolutely NO mosaic/tile/scale-like patches, NO faceted polygons, NO thick impasto, NO added noise, NO dark hatching, NO dense fur strokes, NO gritty contrast, NO outline thickening. Maintain warmth and softness. Keep everything else unchanged, including exact text DAYS 1 - 10, The basics., C++. Do not redraw the environment. Output the single edited scene.

## 首次尝试（未采用）

内置 imagegen 单次编辑。输入 `before.png` 为当前第一幕1.6秒截图；输出 `painted-v1.png`。未替换动画或修改冻结的阅读动作。

实际检查：脸颊/内耳平滑喷绘感减少，上色更接近背景手绘；脸颊形成偏碎、偏硬的片状笔触，尚未达到理想的柔软程度。生成图也有局部重绘变化，不能直接当严格对齐的动画关键帧。

## 完整提示词

Use case: style-transfer, precise local editing. Edit target: the supplied full first-chapter hamster reading illustration. Produce ONE edited full scene, same framing and aspect ratio, no comparison layout. Change ONLY the painted surface treatment of the hamster's orange forehead, cream cheeks and pink inner ears: replace their overly smooth airbrushed shading with restrained hand-painted gouache/colored-pencil color patches and subtle irregular paper tooth matching the existing desk, wall and book. Keep the hamster just as round, soft and cute. Use broad gentle color variation with sparse delicate strokes, NOT dense individual fur strands, scratchy white hatching, coarse hair or jagged silhouettes. Do not simply overlay noise. Maintain soft rounded outer cheek and ear contours. CRITICAL invariants: exact same head pose, head size, silhouette, eyes position/size/highlights, nose, smiling mouth, teeth, whiskers, cap, hands, body, book, background, lighting direction, palette, framing, decorative border and ALL text. Do not redesign or enlarge the face, do not move ears or paws. Preserve the whole environment unchanged. The goal is a small but visible improvement in shared hand-painted material, not a new illustration. Text must remain 'DAYS 1 - 10', 'The basics.', 'C++'.
