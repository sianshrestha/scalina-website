import sys
from PIL import Image, ImageDraw, ImageFont
SP = sys.argv[1]; OUT = sys.argv[2]
W, H, S = 1200, 630, 2           # draw at 2x, downsample for clean edges
COBALT, BONE, LIME = (0x1E,0x45,0xFB), (0xF4,0xF2,0xED), (0xCD,0xF2,0x2B)
im = Image.new('RGB', (W*S, H*S), COBALT); d = ImageDraw.Draw(im)
F = lambda name, px: ImageFont.truetype(f'{SP}/{name}.ttf', px*S)
pad = 72*S

# Mark (same path data as the header's SVG), top left.
k = 44*S/565; ox, oy = pad, pad
P = lambda pts: [(ox+x*k, oy+y*k) for x, y in pts]
for poly in ([(0,18),(114,18),(114,532),(0,532)], [(184,18),(331,18),(331,532),(184,532)], [(381,121),(556,0),(556,565),(381,433)]):
    d.polygon(P(poly), fill=BONE)

# Eyebrow, top right, in the label face.
mono = F('plexmono', 18)
label = 'MEDIA + SYSTEMS  /  SYDNEY'

tw = d.textlength(label, font=mono) + len(label)*2.5*S
x = W*S - pad - tw
for ch in label:
    d.text((x, oy + 12*S), ch, font=mono, fill=LIME); x += d.textlength(ch, font=mono) + 2.5*S

# Tagline.
tag = F('intertight500', 76)
d.text((pad, 196*S), 'Go Digital,', font=tag, fill=BONE)
d.text((pad, 282*S), 'or Go Invisible.', font=tag, fill=BONE)

# Wordmark along the foot, Oswald 700 uppercase, as on the site.
wm = F('oswald700', 200)
bbox = d.textbbox((0, 0), 'SCALINA', font=wm)
d.text((pad - bbox[0], H*S - pad + 26*S - bbox[3]), 'SCALINA', font=wm, fill=BONE)

# Supporting line beside the wordmark.
small = F('intertight300', 24)
lines = ['Content, campaigns and the', 'software your business runs on.']
for i, line in enumerate(lines):
    lw = d.textlength(line, font=small)
    d.text((W*S - pad - lw, H*S - pad - 72*S + i*34*S), line, font=small, fill=BONE)

im.resize((W, H), Image.LANCZOS).save(OUT, optimize=True)
