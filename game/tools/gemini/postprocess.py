#!/usr/bin/env python3
"""Image post-processing for the Gemini art pipeline (Pillow).

  postprocess.py fit  <in> <out> <width> <height>   center-crop to the target aspect, resize, save PNG
  postprocess.py ref  <in> <out> [max_side]          downscaled JPEG copy used as a reference attachment
  postprocess.py size <in>                           print {"width":..,"height":..,"format":..}

Prints one JSON line on success. Exits non-zero (and writes nothing) on failure.
The output is written to a temporary sibling file and renamed into place, so a
failed run never leaves a partial image behind.
"""
import json
import os
import sys

from PIL import Image, ImageOps


def _open(path):
    im = Image.open(path)
    im.load()
    fmt = im.format
    im = ImageOps.exif_transpose(im)  # returns a copy without .format
    im.format = fmt
    return im


def _atomic_save(im, out, fmt, **kw):
    d = os.path.dirname(os.path.abspath(out))
    os.makedirs(d, exist_ok=True)
    tmp = os.path.join(d, '.' + os.path.basename(out) + '.partial')
    try:
        im.save(tmp, fmt, **kw)
        os.replace(tmp, out)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def fit(src, out, w, h):
    im = _open(src)
    sw, sh = im.size
    fmt_in = im.format
    has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
    im = im.convert('RGBA' if has_alpha else 'RGB')
    target = w / h
    if sw / sh > target:          # too wide -> crop left/right
        cw, ch = max(1, min(sw, round(sh * target))), sh
    else:                          # too tall -> crop top/bottom
        cw, ch = sw, max(1, min(sh, round(sw / target)))
    left, top = (sw - cw) // 2, (sh - ch) // 2
    im = im.crop((left, top, left + cw, top + ch))
    if im.size != (w, h):
        im = im.resize((w, h), Image.LANCZOS)
    _atomic_save(im, out, 'PNG', optimize=True)
    print(json.dumps({'srcWidth': sw, 'srcHeight': sh, 'srcFormat': fmt_in, 'width': w, 'height': h,
                      'crop': [left, top, cw, ch], 'bytes': os.path.getsize(out)}))


def ref(src, out, max_side=1024):
    im = _open(src).convert('RGB')
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    _atomic_save(im, out, 'JPEG', quality=90)
    print(json.dumps({'width': im.size[0], 'height': im.size[1], 'bytes': os.path.getsize(out)}))


def size(src):
    im = Image.open(src)
    print(json.dumps({'width': im.size[0], 'height': im.size[1], 'format': im.format}))


def main(argv):
    if len(argv) < 2:
        print(__doc__, file=sys.stderr)
        return 2
    cmd = argv[1]
    try:
        if cmd == 'fit' and len(argv) == 6:
            fit(argv[2], argv[3], int(argv[4]), int(argv[5]))
        elif cmd == 'ref' and len(argv) in (4, 5):
            ref(argv[2], argv[3], int(argv[4]) if len(argv) == 5 else 1024)
        elif cmd == 'size' and len(argv) == 3:
            size(argv[2])
        else:
            print(__doc__, file=sys.stderr)
            return 2
    except Exception as e:  # noqa: BLE001 - report any decode/resize error as JSON
        print(json.dumps({'error': f'{type(e).__name__}: {e}'}))
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
