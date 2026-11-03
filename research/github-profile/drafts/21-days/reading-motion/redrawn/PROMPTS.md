# 重画俯仰姿态

## 中间姿态

`mid-key-v1.png`，原稿与低头稿之间的单张中间姿态。实际提示词：

Use case: precise-object-edit / animation in-between.
Draw ONE single intermediate animation key drawing, the exact halfway head rotation between the two provided images. Image 1 is the approved upward-looking original, image 2 is the completed downward-reading key pose. Your result is neither endpoint and not a collage: it is a physically coherent HEAD PITCH HALFWAY between them, around 8–10 degrees of forward rotation.
Keep the entire scene and camera framing exactly from image 1 (1316:1195), with the same desk, lamp, plants, title ("DAYS 1 - 10", "The basics."), book and paws in precisely the same positions. Only the hamster's head rotates. The cap brim tilts down halfway, ears and full round skull turn together, round dark eyes shift their gaze toward the pages, the short muzzle and cheerful small mouth turn forward/down in perspective. Preserve the original wide full cheeks, not a horizontally flattened face. Chin can approach the page edge but not sink into it at this halfway stage. Keep head size stable, do not enlarge its cap or inflate skull.
Identity and medium are locked to image 1: soft finely painted orange/cream fur, round ears, green/cream cap, dark bean eyes with tiny highlights and very little/no white sclera, two delicate whiskers, happy eager expression. No gross white scratches or sawtooth contour, no new style, no sleepiness, no blink. Foreground book stays put. Do not modify the title or scene, do not crop, zoom, draw a grid, mix the two images as a dissolve, or merely compress/translate the front-facing face. Return one complete intermediate illustration.

## 十二格尝试（未采用）

`rejected-atlas.png` 第四列裁切、前几格重复、书本漂移，不能用于播放。实际提示词：

Use case: illustration-story / animation in-betweens.
Create ONE production animation sprite sheet: exactly 4 columns by 3 rows, TWELVE chronological complete-scene drawings. No gutters, frames, numbering or new labels. Each cell has precisely the same 1316:1195 aspect ratio and complete camera view as input image 1. Make the total sheet as high resolution as possible, preserving detailed illustrated faces.

INPUT ROLES: Image 1 is the APPROVED original scene and controls character identity, painting style, proportions, scale and room. Image 2 is a supporting new DOWNWARD HEAD-ROTATION key pose; use its coherent cap/ear/skull pitch, but correct its excess eye whites to match the original dark bean eyes. Do not copy the white human-like eye rims.

ANIMATION: the hamster's entire rounded head rotates gently and monotonically FORWARD toward its stationary book, from original cheerful forward-facing pose in cell 1 to about 18 degrees downward reading pose in cell 12. One gradual downward movement only: NO blink, NO reopening eyes, NO rebound, NO return upward within the sheet. Twelve small evenly spaced angle increments, from 0 degrees to 18 degrees, ordered left to right then top to bottom. Every neighboring drawing must be a very small in-between change, not a new pose or expression. Keep volume and cheek width coherent.

This must be a true painted head rotation, not a front-facing face pushed down or compressed: cap crown and brim change perspective gradually, a little more cap top becomes visible; forehead, ears and muzzle turn together. Pupils direct down at the pages; retain large dark original round bean eyes with tiny highlights and subtle upper eyelids, no conspicuous white sclera. The short hamster muzzle points down, the small happy smile naturally foreshortens, chin recedes behind the pages; FULL round fluffy cheek pouches remain on either side. The cap, skull and face should all agree on the same forward pitch. Do not vertically squash the face into a horizontal strip. Keep its original soft orange/cream round-eared hamster identity, tiny pink nose, green/cream cap, sparse fine soft fur and two delicate whiskers. Keep playful delight and warm painted shading. No jagged fur, new glasses or cat anatomy.

LOCK the complete camera, frame boundary, title ("DAYS 1 - 10", "The basics."), desk, lamp, books, plants, pencils, lighting, forearms, paws and especially the blue C++ book identically in every cell. The book stays in exactly the same position and angle with paws contacting the same spots; all movement is above its upper edge. No camera zoom, translation, new objects, restyling, lighting changes or body bouncing. This is one fixed shot for hand-drawn character animation, not a story montage or character sheet.

## 低头关键帧眼睛修订

`down-key-v2.png` 减少眼白。实际提示词：

Use case: precise-object-edit. Image 1 is the EDIT TARGET, the hamster already pitched downward reading. Image 2 is identity and eye-style reference only.
Return the same single complete illustration, exactly the same framing and pose as image 1. Change ONLY the eyes: remove the conspicuous white eyeball/sclera rims. Give it the reference hamster's large dark warm brown bean eyes, tiny single white highlights, subtle orange upper eyelids. Its gaze is directed down at the book, not at the viewer. No large white human-like eye sockets, no circles around the eyes. Keep the attentive happy expression, full rounded cheeks and short rodent muzzle.
Keep head pitch, cap perspective, ears, mouth, nose, fur, lighting, paws, book, room, title, scale and all object positions exactly as they are. Preserve soft fine sparse painted fur. Do not flatten or squish the face, do not make a new pose, sheet or cropped view.

内置imagegen，输入为 `../../model/reading-soft-v1.png`（角色与风格母版）。`down-key-v1.png` 是新的低头关键姿态，仍有眼白偏多的问题，不能当作已通过的最终动作。

## 低头关键帧实际提示词

Use case: precise-object-edit.
Edit the attached approved illustration into ONE new animation KEY DRAWING of the same hamster naturally bowing its head to read the open book. Return one complete scene with exactly the original 1316:1195 camera framing, not a grid or character sheet.
Change only the hamster's head pose: a modest but unmistakable forward pitch of the entire rounded skull, about 20 degrees toward the book. Draw this as a real change of viewpoint with coherent anatomy, NOT a vertically squashed or translated front-facing face. Show a little more of the green cap's top, a foreshortened cream front panel and a lower tilted brim casting a gentle shadow over the forehead. The rounded ears rotate with the skull. The eyes genuinely look downward at the pages, slightly hidden by naturally lowered upper lids, still alert and interested, NOT closed or sleepy. The short muzzle projects forward and down with the nose aimed at the book; the small happy mouth follows that perspective and the chin naturally recedes behind the pages. Preserve full inflated cheek pouches on either side; the cheeks must not collapse into a thin horizontal strip. The forehead, cap, eyes, nose and mouth must all agree on the same head rotation.
Preserve the identity, round ears, exact orange/cream color palette, green cap, fine soft painted fur, two subtle tapered whiskers, warm storybook shading, delighted engagement and broad cheek proportions. Do not make a cat or add a snout, heavy fur spikes or coarse white scratches. Do not replace the painting style with vector, 3D or a standardized mascot.
The camera, room, lettering ("DAYS 1 - 10", "The basics.", "C++"), lamp, plants, pencils, desk, book shape and position, paws gripping it, torso and forearms all remain in their original positions. Do not lift the book, change the paws, zoom, crop, move the background or redraw its layout. Keep lighting and scale unchanged. The change must be plainly readable as the head rotating toward the book while the original soft rounded character remains intact.
