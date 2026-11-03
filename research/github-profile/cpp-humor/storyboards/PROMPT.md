# 单个错误：三格分镜生成提示词

日期：2026-10-30。使用内置 imagegen，以原头像及已有立姿仓鼠为角色/画风参考，生成新的三格漫画。没有调用 CLI 或自写 API。输出保存为 [one-error.png](one-error.png)，保留默认生成目录的原文件，没有覆盖既有素材。

参考文件：

- [当前头像](../../drafts/personal-corner/assets/avatar.png)
- [已有立姿仓鼠](../../drafts/personal-corner/assets/book-drop/hamster-upright.png)

完整提示词：

```text
Use case: illustration-story.
Asset type: one original three-panel COMIC STORYBOARD for a personal GitHub profile. This is a humor test, not a finished website mockup.

Reference images:
1. The small existing profile avatar: character identity reference only. Keep the cream-white plump hamster, warm brown patches, round ears and expressive silhouette. Do not reproduce its Chinese words or change the user's avatar.
2. The upright hamster cutout: illustration texture and recognizable hamster features reference only. Keep the tactile gouache/pencil texture, generous cheeks, tiny pink nose, incisors and whiskers. Freely change the expression and poses to act out the story.

Create ONE coherent, immediately readable joke about C++ compiler diagnostics: the hamster feels ready after an introductory book, is reassured that there is only ONE error, then gets buried under the absurdly huge diagnostic for that same single error.

Layout: landscape canvas, approximately 3:2 aspect ratio. THREE PANELS total: two equal-sized setup panels across the top half, then ONE double-width payoff panel across the bottom half. Thin warm-brown panel borders, clean cream gutters, off-white paper background. Read left to right across the top, then the wide bottom. Keep expressions and important lettering clearly readable at reduced size. No diagram annotations, panel numbers, title, explanatory paragraph or web UI chrome.

TOP LEFT PANEL: The hamster has just closed a small teal beginner programming book. Its chin is lifted, eyes half-closed with endearing overconfidence, satisfied little smile, small self-congratulatory gesture. A simple keyboard/monitor nearby foreshadows the next panel, without clutter. Book cover text, large and exactly: "C++ BASICS". It should be clear that it thinks it has finished the easy part and is now ready.

TOP RIGHT PANEL: Same hamster and computer, in the same environment. The hamster has clicked compile and is casually relieved at a small, harmless-looking error count. The monitor title clearly says "C++"; its large main message is exactly "1 error". Hamster expression: amused confidence, one tiny paw held up with a single finger. One small speech bubble, exactly "Just one." A short strip of diagnostic paper has just begun to emerge from the lower edge of the monitor. The computer emits this paper as a visual metaphor for a long diagnostic, not as a separate office-printer joke.

WIDE BOTTOM PANEL: Pull back to reveal the SAME "1 error" on the SAME monitor, still clearly visible, while a single continuous accordion-like diagnostic-paper strip has poured out and piled up into an ABSURD MOUNTAIN that fills most of the panel. The paper has fine red diagnostic-looking lines, not long readable technical text. It is one long report, not many error-count cards. The hamster is almost buried beneath it, with only its round ears, cheeky face and one exhausted paw peeking out near the lower-right. Its facial acting is a very dry, betrayed, sideways stare toward the viewer: raised eyebrow, flattened mouth, a little scruffy fur, the exact opposite of its earlier smug assurance. Avoid another cute wink or thumbs-up. The huge pile versus the unchanged ONE-error counter is the visual punchline. The hamster must remain large enough to read as the protagonist rather than a tiny decorative detail.

Style: expressive editorial animal comic, confident hand-drawn contours, tactile gouache/paper texture, warm brown and cream hamster, muted teal computer/book, restrained coral-red diagnostic ink. Well-composed with lively physical acting, simple readable shapes and strong before/after contrast. Prioritize comic timing and legible staging over ornamental prettiness.
Only readable text allowed: "C++ BASICS", "C++", "1 error", "Just one." No other caption, random code, slogans, logos, watermarks, alcohol, or additional characters. This is an original composition; do not copy any existing meme, cartoon character or artist's strip.
```
