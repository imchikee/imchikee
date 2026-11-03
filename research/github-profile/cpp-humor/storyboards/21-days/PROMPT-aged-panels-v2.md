# 第5、6格仓鼠脸型修订

2026-11-01。用户认为整体效果不错，但物理、生物两格的仓鼠像猫。第一轮以整页为目标的内置编辑返回通信错误，没有成图；随后使用已有SVG视窗截图作为两张局部参考，内置imagegen成功生成双格图`hamster-aged-panels-v2.png`。

以SVG把新双格放回原图相应位置，保存为`hamster-storyboard-v2.svg`；其余七格仍直接引用原PNG，保证画面原样保留。整页HTML内联相同SVG结构，避免SVG作为图片加载时丢失外部资源。旧图保留，没有CLI/API生图。

## 成功请求

```text
Use case: precise-object-edit. Edit the TWO attached comic panels. Output one horizontal image containing exactly two equal panels side by side, physics LEFT and biology RIGHT, with no gutter. Keep each input composition, wording, numbers, green cap, pose, props, warm colored-pencil style and backgrounds. Change ONLY the hamster character's species-defining facial shapes: both older characters look too feline. Make both unmistakable round HAMSTERS with very large low bulging cream cheek POUCHES, extremely short blunt rodent muzzle, tiny pink nose, two little upper incisors, small ROUND disk ears, compact round head and small paws. No feline muzzle, cat jaw or cat whisker pads. Keep age differences: physics hamster middle-aged with warm orange-brown fur and sparse gray flecks; biology hamster elderly with gray-brown flecks and round spectacles, but still full hamster cheeks. Avoid a gray cat face. Preserve thoughtful expression in physics and concentration at microscope in biology. Text remains exactly as in inputs. These replace only panels 5 and 6 of an existing comic; other panels will remain untouched in the application.
```

## 此前失败的整页局部编辑请求

```text
Use case: precise-object-edit.
Edit target: the attached complete 3x3 hamster comic "C++ IN 21 DAYS".
Make a strictly localized character-design correction ONLY in panel 5 (middle row center, "DAYS 3649 - 7781 / Study physics.") and panel 6 (middle row right, "DAYS 7782 - 14611 / Study biology.").
The user likes the overall comic but says these two older hamsters look like cats. Make both unmistakably the SAME HAMSTER as panels 1–4, aged appropriately.
In these two panels only: broaden the head into a round, squat hamster silhouette with very large soft cream cheek POUCHES bulging LOW and sideways, a very short blunt rodent muzzle, tiny pink nose, a small visible pair of upper incisors where natural, small round disk ears (never triangular cat ears), dark round eyes, small rounded paws. No elongated feline muzzle, no cat-shaped jaw, no cat whisker pads. Match the protagonist in panel 2 closely for identity and proportions.
Panel 5: middle-aged hamster, mostly warm orange-brown fur with subtle gray flecks, round cheeks, thoughtful paw at chin. Keep the green-and-cream cap, book, pose and physics scene.
Panel 6: elderly HAMSTER with fuller round cheeks, subtle gray-brown fur, tiny round ears and short muzzle; keep round spectacles, green-and-cream cap, microscope, paws and biology scene. Age through gray flecks and glasses without changing species.
Preserve all other seven panels, all wording and numbers, panel borders and positions, title, footer credit, backgrounds, props, framing, lighting, colored-pencil texture and overall page composition. Do not redraw or alter the story. Preserve the 3x3 layout and original aspect ratio. The existing final panel is part of the unchanged source; do not alter it. Output the complete edited comic page, not a new scene.
```
