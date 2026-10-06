"""
Build public/img/sawtooth-logo.svg: a single sprite holding the Sawtooth logo
geometry once, exposed as two addressable <symbol>s.

  #logo               mark only, viewBox cropped to the mark
  #logo-and-wordmark  mark + SAWTOOTH wordmark

The mark and wordmark are each defined once in <defs> as <g>, then composed
into the symbols with <use>, so the path data is never duplicated.

The fill is a custom property on each symbol, so a consumer can recolour the
logo with `--sawtooth-logo-fg` (or just `color`) instead of editing this file.

Usage:
    python3 scripts/build-sawtooth-logo.py [path/to/source.svg]
"""

import re
import sys
import xml.etree.ElementTree as ET

SRC = sys.argv[1] if len(sys.argv) > 1 else '/Users/jason.burner/Downloads/Simple Logo White.svg'
OUT = 'public/img/sawtooth-logo.svg'
SVG = 'http://www.w3.org/2000/svg'
N = '{%s}' % SVG
ET.register_namespace('', SVG)

MARK_BOX = (1588.74, 621.95, 2910.99, 1944.0)  # from the source clipPath
MARK_BOTTOM = 2000.0  # user units; art below this line is the wordmark
PAD = 40


def nums(d):
    return [float(x) for x in re.findall(r'-?\d+\.?\d*(?:e-?\d+)?', d)]


def trim(d, places=3):
    return re.sub(r'-?\d+\.?\d*(?:e-?\d+)?',
                  lambda m: f'{round(float(m.group()), places):g}', d)


def measure(node, tx=0.0, ty=0.0):
    """Control-point-inclusive bbox. Curves' true extrema can sit outside this,
    which is why the viewBoxes below are padded rather than tight."""
    m = re.match(r'translate\(\s*([-\d.]+)[ ,]+([-\d.]+)', node.attrib.get('transform', ''))
    if m:
        tx += float(m.group(1))
        ty += float(m.group(2))
    box = None
    if node.tag == N + 'path':
        v = nums(node.attrib['d'])
        xs = [v[i] + tx for i in range(0, len(v), 2)]
        ys = [v[i] + ty for i in range(1, len(v), 2)]
        box = (min(xs), min(ys), max(xs), max(ys))
    for child in node:
        b = measure(child, tx, ty)
        if b:
            box = b if not box else (min(box[0], b[0]), min(box[1], b[1]),
                                     max(box[2], b[2]), max(box[3], b[3]))
    return box


def emit(node, indent=0, clip_id=None):
    """Serialise, dropping presentation attributes we want to inherit instead."""
    pad = '  ' * indent
    tag = node.tag.replace(N, '')
    a = {k: v for k, v in node.attrib.items()
         if k not in ('fill', 'fill-opacity', 'clip-rule', 'clip-path')}
    if 'd' in a:
        a['d'] = trim(a['d'])
    head = pad + '<' + tag + ''.join(f' {k}="{v}"' for k, v in a.items())
    kids = list(node)
    if not kids:
        return head + '/>'
    if clip_id and 'clip-path' in node.attrib:
        head += f' clip-path="url(#{clip_id})"'
    out = [head + '>']
    for c in kids:
        out.append(emit(c, indent + 1, clip_id))
    out.append(pad + '</' + tag + '>')
    return '\n'.join(out)


def view_box(boxes):
    bs = [b for b in boxes if b]
    x0 = min(b[0] for b in bs) - PAD
    y0 = min(b[1] for b in bs) - PAD
    x1 = max(b[2] for b in bs) + PAD
    y1 = max(b[3] for b in bs) + PAD
    return f'{x0:g} {y0:g} {x1 - x0:g} {y1 - y0:g}'


root = ET.fromstring(open(SRC).read())
# defs first, then three full-bleed white background rects, then the artwork.
art = [c for c in list(root) if c.tag not in (N + 'defs', N + 'rect')]
mark_nodes = [c for c in art if (measure(c) or (0,))[3] < MARK_BOTTOM]
word_nodes = [c for c in art if c not in mark_nodes]

mark_body = '\n'.join(emit(n, 3, None) for n in mark_nodes)
word_body = '\n'.join(emit(n, 3) for n in word_nodes)

mark_vb = view_box([measure(n) for n in mark_nodes])
both_vb = view_box([measure(n) for n in art])

FILL = 'var(--sawtooth-logo-fg, currentColor)'

HEADER = '''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none">
  <!--
    Sawtooth Ultimate logo sprite.

    The geometry below is defined once and composed, not duplicated:

      #sawtooth-mark        the mark alone
      #sawtooth-wordmark    the SAWTOOTH letterforms
      #logo                 symbol, mark only
      #logo-and-wordmark    symbol, mark plus wordmark

    Reference a version with use:

      svg viewBox="0 0 100 100" containing a use of sawtooth-logo.svg#logo

    Symbols carry their own viewBox, so use scales to the host svg box.
    Colour comes from the sawtooth-logo-fg custom property, falling back to
    currentColor.
  -->
  <defs>'''

svg = f'''{HEADER}
    <clipPath id="sawtooth-mark-clip" clipPathUnits="userSpaceOnUse">
      <path d="M {MARK_BOX[0]:g} {MARK_BOX[1]:g} L {MARK_BOX[2]:g} {MARK_BOX[1]:g} L {MARK_BOX[2]:g} {MARK_BOX[3]:g} L {MARK_BOX[0]:g} {MARK_BOX[3]:g} Z"/>
    </clipPath>

    <!-- The mark, still clipped to its own bounding box as the source was. -->
    <g id="sawtooth-mark" clip-path="url(#sawtooth-mark-clip)">
{mark_body}
    </g>

    <!-- The wordmark sits below the mark's clip box and is never clipped. -->
    <g id="sawtooth-wordmark">
{word_body}
    </g>

    <symbol id="logo" viewBox="{mark_vb}" fill="{FILL}">
      <title>Sawtooth Ultimate</title>
      <use xlink:href="#sawtooth-mark" href="#sawtooth-mark"/>
    </symbol>

    <symbol id="logo-and-wordmark" viewBox="{both_vb}" fill="{FILL}">
      <title>Sawtooth Ultimate wordmark</title>
      <use xlink:href="#sawtooth-mark" href="#sawtooth-mark"/>
      <use xlink:href="#sawtooth-wordmark" href="#sawtooth-wordmark"/>
    </symbol>
  </defs>
</svg>
'''

open(OUT, 'w').write(svg)
print(OUT)
print('  #logo              viewBox="%s"' % mark_vb)
print('  #logo-and-wordmark viewBox="%s"' % both_vb)
print('  %d bytes' % len(svg))