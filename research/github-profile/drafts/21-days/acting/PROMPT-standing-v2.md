# 完整站姿及柔和轮廓探索记录

用户否定拼接站姿、内八字脚与锯齿毛发后，尝试整体重画。首图保存为`hamster-standing-v2.png`，不是动画，也未获认可。后续去色晕请求没有解决色晕，柔和轮廓请求仍有尖毛；两者未接入项目。用户随后要求研究原头像的可爱特征，当前以`CHARACTER-NOTES.md`的观察继续，不将生图返回当作视觉问题已修复。

## 完整站姿：内置imagegen

```text
Use case: identity-preserve.
Create ONE complete, coherently drawn full-body hamster standing pose on a genuinely transparent background.
Image 1 is the APPROVED face and colored-pencil style reference: the round orange-and-cream elderly HAMSTER with gray flecks, tiny round ears, low bulging cheek pouches, tiny pink nose, short rodent muzzle, two incisors, round spectacles and green-and-cream cap.
Image 2 is a REJECTED assembled animation frame. Use it only to understand the mistakes to fix. Do NOT copy its head/body/limb geometry, inward toes, shoulder notch, seams, stage, portal or lettering.
Draw the entire character together as one natural illustration, NOT separate animation parts. Full body, cap and both feet entirely visible, generous transparent margins. Near-front, slight three-quarter view toward the viewer's right.
Correct anatomy and silhouette: the head and cheeks flow naturally into the neck and shoulders; shoulders, upper arms, elbows, wrists and paws are connected by continuous rounded fur contours. Head including cap about 43% of total character height, not an oversized head pasted onto a torso. Plump pear-shaped torso and a small but visible transition through hips to short legs/ankles.
Standing stance is critical: both feet on the SAME ground plane, weight evenly balanced, feet hip-width apart with a clear gap. Two small pink rounded rodent feet, toes pointing forward in parallel (at most very subtle outward angle). NO inward pointing feet, crossed legs, knock knees, pigeon toes, awkward duck feet, oversized flippers, floating feet or a continuous blob hiding the legs. The feet must look naturally attached and support the body.
Both paws hold ONE small round glass potion flask with pale blue liquid at lower-chest height. One paw visibly cups the lower bulb, the other visibly wraps the neck/side, with simple little fingers and clear physical contact. Bottle is upright, fully readable and in front of the belly; no detached/floating prop, no paws glued onto it. Keep elbows relaxed at sides and forearms gently lifted.
Expressive, kind, slightly elderly face with round cheek pouches, small visible incisors; preserve HAMSTER identity rather than a cat. Warm colored-pencil and watercolor texture with fine hand-drawn fur, matching the approved reference. The drawing should be ready to serve as a whole-character animation key pose.
No separate parts, sprite grid, labels, numbers, floor line, scene, furniture, portal, backdrop, shadow ellipse or captions. Transparent alpha outside the single full character.
```

## 去除色晕：未达到要求

```text
Use case: background-extraction. Edit target: the attached full-body standing hamster PNG. Remove ONLY the unwanted diffuse orange, green, brown and pink halo / background glow surrounding the character, including around cap, shoulders, belly and feet. Make all space outside the hamster and its held glass potion truly transparent with clean alpha edges and preserved fine fur tips. No shadow, aura, vignette, color wash, ground, scenery, or new background. Preserve the exact complete standing pose, full-body proportions, natural separated feet, spectacles, cap, facial expression, continuous shoulder contours, both paws holding the bottle and every detail inside the subject. Keep the existing transparent glass effect and colored-pencil texture. Do not redraw the character, alter toes or pose, or add text. Output a transparent-background cutout of precisely this hamster.
```

## 柔和轮廓：未作为采用结果

```text
Use case: style-transfer / precise-object-edit.
Edit the referenced complete standing hamster illustration. The user dislikes the sharp zigzag, sawtooth fur silhouette and densely scratched hair rendering.
Keep this exact character and coherent standing pose: orange-and-cream elderly HAMSTER, round low cheek pouches, tiny round ears, small pink nose and two incisors, round spectacles, green-and-cream cap, plump integrated torso, both paws naturally holding one small blue potion bottle, feet separated and pointing forward without pigeon toes.
Change the rendering treatment: a clean, soft, rounded hand-painted illustration. Continuous gently curved outer contours on cheeks, shoulders, arms and belly, with only a FEW tiny wisps. No serrated outline, repeated triangular fur spikes, saw teeth, spiky tufts, scratchy dense hatching, thick dark zigzag edging, or photographic individual hairs. Express softness with broad watercolor-like color transitions and very sparse short curved interior strokes. Make it feel warm and velvety, with understated detail, rather than bristly. Keep facial features legible, paws and bottle grip clear, and the body one unified drawing.
Full character visible from cap to both feet, generous margins, unchanged natural balanced standing stance. Head/cheeks proportional to body. Do not add a setting, portal, labels, floor line or shadows.
For this STYLE REVIEW image, use a completely flat very pale warm ivory background (#faf5e9), with NO glow, gradient, vignette or cast shadow. This review establishes the softer character style, not a transparent production sprite.
```
