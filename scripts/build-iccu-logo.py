"""
Build public/img/logo-iccu.svg from the ICCU logo supplied as Illustrator EPS.

The EPS is vector, so the logo is converted rather than rasterised: the drawing
section is a short, flat sequence of `mo`/`li`/`cv`/`cp` paths and two `cmyk`
fills, which is all that is needed to reproduce the artwork exactly.

Two details of the source are worth writing down, because both are counter-intuitive:

  * The drawing section's coordinates are already top-down. Its page setup reads
    `1 -1 scale 0 -400 translate`, which in bare PostScript would flip the page
    into y-up space and place the content at negative y, so the natural reading is
    that the numbers need flipping before they are SVG path data. They do not:
    applying that flip renders the wordmark upside down. The coordinates are used
    as they stand, and `verify()` is what proves it — the result matches the
    studio's export of the same file to within antialiasing.

  * CMYK does not survive a naive conversion. The two fills in the EPS convert to
    roughly #405054 and #42f600 by the usual formula, neither of which is the
    colour the artwork actually renders as. The studio's own PNG export of the
    same file is the authority, and the hexes below are sampled from it (that
    export has exactly two opaque colours). `verify()` proves the pairing too.

Usage:
    python3 scripts/build-iccu-logo.py [path/to/source.eps]
"""

import os
import re
import sys

SRC = sys.argv[1] if len(sys.argv) > 1 else '/Users/jason.burner/Downloads/ICCU-logo-2color.eps'
OUT = 'public/img/logo-iccu.svg'

# The artboard, from the EPS's own %%BoundingBox.
BOX = (960.0, 400.0)

# Sampled from ICCU-logo-2color.png, the studio's export of the same artwork.
# Keyed by the CMYK the EPS sets before each fill, because those four numbers are
# the only colour information the file carries.
COLORS = {
    (0.648524, 0.558679, 0.531579, 0.289647): '#555759',  # slate: the ICCU letterforms
    (0.740658, 0.0315557, 1.0, 0.00106813): '#43b02a',  # green: the ridgeline
}


def tokens(text):
    """Whitespace-split, with PostScript bracket arrays kept whole.

    A bare `[`/`]` would otherwise read as an unknown operator mid-path, so the
    scanner walks the array out as a single token instead. Brackets are spaced
    first, because a distiller can emit them welded to a neighbour (`]ct`).
    """
    text = text.replace('[', ' [ ').replace(']', ' ] ')
    for match in re.finditer(r'[^\s]+', text):
        word = match.group()
        if word == '[':
            depth, i = 1, match.end()
            while depth and i < len(text):
                depth += (text[i] == '[') - (text[i] == ']')
                i += 1
            yield text[match.start():i]
        elif word not in (']', '{', '}'):
            yield word


def read_drawing(raw):
    """The page content: after %%EndPageSetup, up to the page trailer."""
    text = raw.decode('latin-1')
    start = text.index('%%EndPageSetup') + len('%%EndPageSetup')
    return text[start:text.index('%%PageTrailer', start)]


def read_runs(raw):
    """Paths in source order as (cmyk, subpaths), each subpath a list of ops.

    PostScript puts coordinates first and the operator last — `421.329 160.408
    mo` — so operands are held in `pending` until an operator claims them.

    Only path construction and the colour operator carry meaning here. The rest
    is distiller boilerplate wrapped around the artwork, so an unrecognised token
    is skipped rather than treated as a boundary. The one exception is `clp`: the
    bounding-box clip is drawn as a path just before the artwork, and `clp` is
    what says to throw it away.
    """
    runs, subpaths, ops, color, pending = [], [], [], None, []

    def operands(count):
        """The last `count` held tokens, as floats."""
        taken = pending[-count:]
        del pending[-count:]
        return [float(v) for v in taken]

    for word in tokens(read_drawing(raw)):
        if word == 'clp':
            subpaths, ops = [], []
        elif word == 'mo':
            ops = [('M', *operands(2))]
            subpaths.append(ops)
        elif word == 'li':
            ops.append(('L', *operands(2)))
        elif word == 'cv':
            ops.append(('C', *operands(6)))
        elif word == 'cp':
            pass
        elif word == 'f':
            runs.append((color, subpaths))
            subpaths = []
        elif word == 'cmyk':
            color = tuple(operands(4))
        else:
            pending.append(word)
    return runs


def op_data(op):
    """One op as SVG path data."""
    name, nums = op[0], op[1:]
    return name + ''.join(f' {n:g}' for n in nums)


def path_data(subpaths):
    """A run's paths as one SVG `d`, closing each subpath.

    Illustrator repeats a subpath's first point before `cp`; SVG's Z does that
    job, so the repeat is dropped.
    """
    out = []
    for subpath in subpaths:
        ops = list(subpath)
        first, last = ops[0], ops[-1]
        if len(first) == len(last) and first[1:] == last[1:]:
            ops[-1] = (last[0], *last[1:-2])
        out.extend(op_data(op) for op in ops)
    return ' '.join(out) + ' Z'


def build(runs):
    """One <path> per source path, grouped by fill so the colours stay legible."""
    grouped = []
    for color, subpaths in runs:
        if not grouped or grouped[-1][0] != color:
            grouped.append((color, []))
        grouped[-1][1].append(path_data(subpaths))

    width, height = BOX
    body = []
    for color, datas in grouped:
        fill = COLORS.get(color)
        if not fill:
            raise SystemExit(f'no colour mapped for CMYK {color!r}')
        body.append(f'  <!-- {len(datas)} path(s), {fill} -->')
        body.extend(f'  <path fill="{fill}" d="{d}"/>' for d in datas)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:g} {height:g}" width="{width:g}" height="{height:g}">
  <!--
    ICCU logo, converted from the studio's Illustrator EPS by
    scripts/build-iccu-logo.py. Two fills, the artwork never rasterised.

    The coordinates below are the EPS's own, unchanged, so they can be diffed
    against the source by eye. They already read top-down: the page setup line
    in the EPS suggests otherwise, but honouring it renders the wordmark upside
    down. scripts/verify-iccu-logo.mjs rasterises this file and diffs it against
    the studio's own export of the same EPS; that check is what settles it, and
    what confirms the fills were mapped to the right colours.
  -->
{chr(10).join(body)}
</svg>
'''


def verify():
    """Diff the rendered SVG against the studio's export of the same artwork.

    This is the check that matters, because it is what proves the CMYK-to-hex
    mapping above — no amount of reading the EPS can establish it.
    """
    png = os.path.join(os.path.dirname(SRC), 'ICCU-logo-2color.png')
    if not os.path.exists(png):
        print(f'verify: no reference export beside {SRC}, skipped')
        return
    os.system(f'node scripts/verify-iccu-logo.mjs {png} {OUT}')


if __name__ == '__main__':
    with open(SRC, 'rb') as fh:
        runs = read_runs(fh.read())

    svg = build(runs)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w') as fh:
        fh.write(svg)

    print(OUT)
    print(f'  {sum(len(s) for _, s in runs)} paths, {len(set(c for c, _ in runs))} fills')
    print(f'  {len(svg)} bytes')
    verify()
