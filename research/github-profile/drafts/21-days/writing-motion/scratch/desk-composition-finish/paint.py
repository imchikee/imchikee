"""Paint the approved composition with layered colour and brush marks."""
from math import atan2, cos, sin
from pathlib import Path
from random import Random

root = Path(__file__).resolve().parent
svg = (root.parent/'desk-composition-structure/structure.svg').read_text()
rng = Random(519)


def add_before(token, addition):
    global svg
    assert svg.count(token)==1
    svg = svg.replace(token,addition+token)


def swap(old,new):
    global svg
    assert svg.count(old)==1
    svg = svg.replace(old,new)


defs = '''
<radialGradient id="faceShade" cx="30%" cy="30%" r="80%"><stop stop-color="#f8bc72"/><stop offset=".46" stop-color="#e3924e"/><stop offset=".78" stop-color="#ba6c3e"/><stop offset="1" stop-color="#925238"/></radialGradient>
<radialGradient id="cheekShade" cx="39%" cy="35%" r="78%"><stop stop-color="#fff4d3"/><stop offset=".59" stop-color="#f6dca7"/><stop offset=".87" stop-color="#dea674"/><stop offset="1" stop-color="#ba734a"/></radialGradient>
<radialGradient id="blush"><stop stop-color="#df867d" stop-opacity=".56"/><stop offset="1" stop-color="#df867d" stop-opacity="0"/></radialGradient>
<radialGradient id="ear"><stop stop-color="#fabea2"/><stop offset=".64" stop-color="#d78c7b"/><stop offset="1" stop-color="#9c553e"/></radialGradient>
<linearGradient id="hat" x1="0%" x2="92%" y1="11%" y2="84%"><stop stop-color="#477656"/><stop offset=".4" stop-color="#345e45"/><stop offset=".93" stop-color="#193f39"/></linearGradient>
<linearGradient id="bill" x1="17%" y1="0%" x2="75%" y2="106%"><stop stop-color="#759668"/><stop offset=".52" stop-color="#466d53"/><stop offset="1" stop-color="#244437"/></linearGradient>
<linearGradient id="paper" x1="10%" y1="9%" x2="95%" y2="97%"><stop stop-color="#e3c28c"/><stop offset=".25" stop-color="#fff0ca"/><stop offset=".71" stop-color="#f9e5be"/><stop offset="1" stop-color="#dfb581"/></linearGradient>
<linearGradient id="paw" x1="20%" y1="10%" x2="78%" y2="93%"><stop stop-color="#ffd1b7"/><stop offset=".50" stop-color="#efa894"/><stop offset="1" stop-color="#b9675d"/></linearGradient>
<linearGradient id="lamp" x1="9%" y1="0%" x2="90%" y2="90%"><stop stop-color="#81846a"/><stop offset=".55" stop-color="#536d54"/><stop offset="1" stop-color="#2c3d35"/></linearGradient>
<radialGradient id="bulb"><stop stop-color="#ffffef"/><stop offset=".55" stop-color="#fff3b5"/><stop offset="1" stop-color="#efae58"/></radialGradient>
<radialGradient id="irisPaint" cx="45%" cy="83%" r="84%"><stop stop-color="#b98046"/><stop offset=".29" stop-color="#92572e"/><stop offset=".64" stop-color="#4f2d24"/><stop offset="1" stop-color="#221a1c"/></radialGradient>
<radialGradient id="pupilPaint"><stop offset=".65" stop-color="#1c1416"/><stop offset="1" stop-color="#2b1917"/></radialGradient>
<linearGradient id="nose" x1="25%" y1="0%" x2="70%" y2="100%"><stop stop-color="#f2af9e"/><stop offset=".56" stop-color="#cb796a"/><stop offset="1" stop-color="#a0554a"/></linearGradient>
<radialGradient id="contact"><stop stop-color="#572e29" stop-opacity=".68"/><stop offset="1" stop-color="#572e29" stop-opacity="0"/></radialGradient>
<clipPath id="woodClip"><path d="M0 344L534 298V485H0Z"/></clipPath>
<clipPath id="deskShade"><path d="M0 344L534 298V485H0Z"/></clipPath>
'''

face = 'M188 190Q212 165 258 164Q319 155 353 179Q372 195 381 228Q409 259 387 284Q372 301 331 301Q299 320 258 309Q229 322 192 307Q150 298 149 267Q150 241 168 226Q176 207 188 190Z'
cheeks = 'M158 266Q162 240 204 239Q225 243 250 260Q274 256 292 247Q352 234 378 255Q396 274 372 289Q351 300 326 296Q303 315 268 308Q229 318 193 303Q166 293 158 266Z'
torso = 'M135 344Q151 266 204 246Q294 227 358 255Q388 273 413 322L323 351Z'
arm = 'M139 320Q158 306 180 310Q197 314 211 329Q217 336 207 345Q186 349 164 338Q152 330 139 320Z'
for name,path in [('faceFur',face),('cheekFur',cheeks),('bodyFur',torso),('armFur',arm)]:
    defs += f'<clipPath id="{name}"><path d="{path}"/></clipPath>'


def brush(clip, bounds, count, source, colours, alpha, minimum, maximum):
    x0,y0,x1,y1 = bounds
    out = [f'<g clip-path="url(#{clip})" fill="none" stroke-linecap="round">']
    for _ in range(count):
        x,y = rng.uniform(x0,x1),rng.uniform(y0,y1)
        angle = atan2((y-source[1])*.68,x-source[0])+rng.uniform(-.28,.28)
        length = rng.uniform(minimum,maximum)
        u,v = cos(angle)*length,sin(angle)*length
        bend = rng.uniform(-.23,.23)
        out.append(f'<path d="M{x:.2f} {y:.2f}q{u*.52-v*bend:.2f} {v*.52+u*bend:.2f} {u:.2f} {v:.2f}" stroke="{rng.choice(colours)}" stroke-width="{rng.uniform(.30,.72):.2f}" opacity="{rng.uniform(alpha*.3,alpha):.2f}"/>')
    return ''.join(out)+'</g>'


wood = ['<g clip-path="url(#woodClip)" fill="none" stroke-linecap="round">']
for j in range(340):
    x,y = rng.uniform(0,534),rng.uniform(310,550)
    length = rng.uniform(8,93)
    wood.append(f'<path d="M{x:.2f} {y:.2f}q{length*.42:.2f} {-length*.08+rng.uniform(-1.6,2):.2f} {length:.2f} {-length*.14:.2f}" stroke="{rng.choice(["#f5c383","#703e2e","#eeb473","#814733"])}" stroke-width="{rng.uniform(.34,1.34):.2f}" opacity="{rng.uniform(.035,.26):.2f}"/>')
wood.append('</g>')
add_before('</defs>',defs)
add_before('  <path d="M38 322', ''.join(wood)+'''
<ellipse cx="144" cy="355" rx="156" ry="47" fill="url(#pool)" opacity=".46" clip-path="url(#deskShade)"/>
<ellipse cx="312" cy="407" rx="157" ry="21" transform="rotate(-10 312 407)" fill="url(#contact)" opacity=".7"/>
<ellipse cx="111" cy="453" rx="111" ry="14" transform="rotate(-15 111 453)" fill="url(#contact)" opacity=".66"/>
''')
swap('fill="#49614c" stroke="#314437"', 'fill="url(#lamp)" stroke="#314437"')
swap('fill="#ffe2a1"/>','fill="url(#bulb)" stroke="#e4ad61" stroke-width="1.3"/>')
add_before('  <!-- Foreground props', '''
<path d="M64 146Q81 110 112 122Q130 129 137 145" stroke="#c3ad78" stroke-opacity=".47" fill="none" stroke-width="2.2"/>
<circle cx="37" cy="184" r="7" fill="#b68e53" stroke="#705639" stroke-width="1.5"/>
<circle cx="36" cy="184" r="2.5" fill="#ffe0a0" opacity=".72"/>
''')
swap('  <path d="M7 416L69 397L109 408L164 387L197 410L89 456L7 443Z" fill="#e6d4ab" stroke="#806345" stroke-width="2"/>\n  <path d="M109 408L89 456" stroke="#9c8265" stroke-width="2"/>', '''
  <path d="M4 418Q37 404 69 399L109 408Q132 394 163 384L199 411L91 463L5 447Z" fill="#4d6171" stroke="#3d4650" stroke-width="2"/>
  <path d="M7 416Q35 401 69 397Q88 397 109 408Q131 394 164 387L197 410L89 456L7 443Z" fill="url(#paper)" stroke="#936748" stroke-width="1.3"/>
  <path d="M7 443L89 456L197 410L196 416L90 461L6 449Z" fill="#d9af7e"/>
  <path d="M7 446L89 458L196 414M109 408Q101 429 89 456" stroke="#a47c56" stroke-width="1" fill="none"/>
  <path d="M472 413L533 393V459L480 480L437 460Z" fill="#695144" stroke="#4c392e" stroke-width="2"/>
  <path d="M438 451Q459 429 476 419Q507 402 534 396V449Q512 461 481 473Z" fill="url(#paper)" stroke="#b38b61" stroke-width="1.3"/>
  <path d="M476 419Q488 444 481 473M439 454L481 476L533 453" fill="none" stroke="#b98d5a" stroke-width="1.2"/>
  <!--FOREGROUND_INK-->
''')
for path,old,new in [(face,'fill="url(#fur)" stroke="#a96b44" stroke-width="2"','fill="url(#faceShade)" stroke="#aa6e48" stroke-width="1.1"'),
                     (cheeks,'fill="url(#cream)"','fill="url(#cheekShade)"')]:
    swap(f'd="{path}" {old}',f'd="{path}" {new}')
swap('fill="#e4a292"/>','fill="url(#ear)"/>')
swap('fill="#d99687"/>','fill="url(#ear)"/>')
add_before(f'  <path d="{cheeks}"',brush('faceFur',(148,162,403,317),4170,(262,214),
                  ['#ffd8a0','#fcbb77','#9e553b','#b9643a','#e48449'],.47,1.0,5.9))
add_before('  <path d="M214 177', '''
<ellipse cx="207" cy="267" rx="41" ry="17" fill="url(#blush)"/>
<ellipse cx="336" cy="265" rx="37" ry="15" fill="url(#blush)"/>
'''+brush('cheekFur',(153,237,391,320),2980,(268,265),
          ['#ffefd0','#fae4b9','#d19364','#c6855c','#f6ca8e'],.42,1.0,5.9))
add_before('  <ellipse cx="190"',brush('bodyFur',(134,245,415,355),1800,(285,259),
          ['#ffda9c','#efaa66','#a25b3d','#f7c383'],.37,1.2,5.8))
swap('fill="#4e7356" stroke="#344e41" stroke-width="3"', 'fill="url(#hat)" stroke="#344e41" stroke-width="1.7"')
swap('fill="#627f56" stroke="#354d3f" stroke-width="3"', 'fill="url(#bill)" stroke="#354d3f" stroke-width="1.5"')
add_before('  <!-- Rounded eye apertures', '''
<path d="M218 171Q215 139 251 126M269 178Q316 177 342 165M245 192Q293 201 339 177" stroke="#b7bb80" stroke-opacity=".57" stroke-dasharray="1.6 1.1" fill="none" stroke-width=".9"/>
<path d="M252 123Q246 142 257 169M315 130Q330 146 334 170" stroke="#e9d1a1" fill="none" stroke-width="1.1"/>
<ellipse cx="243" cy="240" rx="19" ry="19" fill="url(#contact)" opacity=".6"/>
<ellipse cx="299" cy="240" rx="17" ry="18" fill="url(#contact)" opacity=".5"/>
''')
svg = svg.replace('fill="url(#iris)"','fill="url(#irisPaint)"').replace('fill="#30201b"','fill="url(#pupilPaint)"')
add_before('  <path d="M257 265', '''
<path d="M231 249Q234 254 239 254M307 245Q306 250 302 252" stroke="#dea363" stroke-opacity=".65" stroke-width="1.1" fill="none" stroke-linecap="round"/>
<ellipse cx="256" cy="270" rx="13" ry="10" fill="#fbdfb0" opacity=".44"/>
<ellipse cx="274" cy="270" rx="12" ry="9" fill="#f7d5aa" opacity=".46"/>
''')
swap('fill="#c77f72" stroke="#a86457"','fill="url(#nose)" stroke="#a86457"')
add_before('  <path d="M265 271', '<path d="M259 264Q263 262 267 263" fill="none" stroke="#fbe4cb" stroke-width="1" stroke-linecap="round"/>')
swap('fill="#fbecd0" stroke="#9d7852"', 'fill="url(#paper)" stroke="#9d7852"')
swap('fill="#f9e5c1" stroke="#9d7852"', 'fill="url(#paper)" stroke="#9d7852"')
add_before('  <!--INK-->', '''
<path d="M193 417L287 385L465 358M193 419L289 389L465 360M162 357L194 419" fill="none" stroke="#a97a51" stroke-width=".8" opacity=".74"/>
<path d="M273 325Q281 343 282 359L288 383" fill="none" stroke="#ac8050" stroke-width="2" opacity=".42"/>
''')
add_before('  <path d="M189 299',brush('armFur',(137,306,218,351),650,(141,315),
          ['#f8ce8d','#af6945','#edb16f'],.42,1.1,5.4))
add_before('  <path d="M188 298', '<path d="M188 301L235 359" stroke="#8da36b" stroke-width="1.2" opacity=".83"/>')
swap('fill="#e5a897" stroke="#aa6d5f" stroke-width="1.7"/>\n  <path d="M199','fill="url(#paw)" stroke="#aa6d5f" stroke-width="1.15"/>\n  <path d="M199')
swap('fill="#e5a897" stroke="#aa6d5f" stroke-width="1.7"/>\n  <rect','fill="url(#paw)" stroke="#aa6d5f" stroke-width="1.15"/>\n  <rect')
add_before('  <rect x="1.5"', '<path d="M379 311Q388 314 390 319M373 315Q380 317 382 322" stroke="#b47764" stroke-width="1" fill="none" opacity=".84"/>')

add_before('  <path d="M0 344', '''
<path d="M444 72L451 79V311L444 323Z" fill="#6f4936"/>
<path d="M451 79L534 71V77L453 85Z" fill="#c99058"/>
<path d="M450 136L534 125V131L451 142ZM450 201L534 189V194L451 207ZM450 265L534 252V258L451 271Z" fill="#ba8051"/>
<path d="M458 113l8-1m18-9l9-1m14 4l8-1m7-8l6-1m-69 70l7-1m12-3l6-1m16 8l9-1m7-9l6-1" stroke="#e3b57a" stroke-width="1.2" opacity=".67"/>
<path d="M449 280L506 270V292L449 301Z" fill="#6d695b"/>
<path d="M459 283l34-6v2l-34 6z" fill="#bda080"/>
<path d="M387 126L422 119L425 158L390 166Z" fill="#e4bc87" stroke="#8b6249" stroke-width="1"/>
<path d="M395 137l8-2v5l-8 2zm15-2l7-2v5l-7 2zm-5 12l8-2v5l-8 2zm-2-9l6-2m-10 6l7 6" stroke="#986e55" stroke-width=".75" fill="none"/>
''')
add_before('  <ellipse cx="481"', '''
<path d="M450 272L456 301Q459 311 468 314L460 312Q453 311 452 300Z" fill="#a6a77c" opacity=".6"/>
<path d="M457 314Q481 326 508 306" stroke="#bec18f" stroke-width="1.1" stroke-opacity=".46" fill="none"/>
<path d="M452 352L525 332M454 354L525 335M455 358L525 339" stroke="#ba9267" stroke-width=".75" opacity=".75"/>
''')
add_before('  <!-- New notebook planes', '''
<path d="M157 269Q163 296 188 302M340 299Q367 293 384 281" stroke="#9d643f" stroke-opacity=".37" fill="none" stroke-width="1.15" stroke-dasharray="1.3 1.9"/>
''')
title_start = svg.index('  <g fill="#39241d"')
title_end = svg.index('  </g>',title_start)+len('  </g>')
svg = svg[:title_start]+'  <!--TITLE-->'+svg[title_end:]

(root/'painted.svg').write_text(svg)
