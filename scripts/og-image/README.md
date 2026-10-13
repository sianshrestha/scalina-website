# Share image (`public/og-image.png`)

The 1200x630 image social networks show when a Scalina link is shared. It is a
static PNG, not generated per request, so it costs the Worker nothing.

`generate.py` draws it with Pillow in the brand faces. It needs four TTFs in one
folder: `oswald700.ttf`, `intertight500.ttf`, `intertight300.ttf`, `plexmono.ttf`.
The ones used were converted from the latin subsets `next/font` downloads into
`.next/static/media/` (woff2, so `fonttools` + `brotli`, pinning `wght` with
`fontTools.varLib.instancer`). Any TTF of the same families works.

```bash
python3 -m venv /tmp/ogenv && /tmp/ogenv/bin/pip install pillow
/tmp/ogenv/bin/python scripts/og-image/generate.py <font-folder> public/og-image.png
```
