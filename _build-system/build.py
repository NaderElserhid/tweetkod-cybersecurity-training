#!/usr/bin/env python3
"""build.py [L1|L2|all] [NN ...]  — يبني HTML + GIFT لكل وحدة من src/ بعد فحصها (lint)."""
import sys, os, json, subprocess, glob, re
D = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(D)
OUT = {'L1': os.path.join(ROOT, 'المستوى الأول'), 'L2': os.path.join(ROOT, 'المستوى الثاني')}
rd = lambda p: open(p, encoding='utf-8').read()
tpl, css, lib, eng = rd(f'{D}/template.html'), rd(f'{D}/tk.css'), rd(f'{D}/tk-lib.js'), rd(f'{D}/tk-engine.js')
args = sys.argv[1:]
levels = ['L1', 'L2'] if not args or args[0] == 'all' else [args[0]]
only = set(args[1:])
bad = 0
for L in levels:
    os.makedirs(OUT[L], exist_ok=True)
    for src in sorted(glob.glob(f'{D}/src/{L}/*.js')):
        nn = os.path.basename(src).split('-')[0]
        if only and nn not in only: continue
        p = subprocess.run(['node', f'{D}/lint.js', src], capture_output=True, text=True)
        try: r = json.loads(p.stdout)
        except Exception: print('✖', os.path.basename(src), 'lint crashed:', p.stderr[:300]); bad += 1; continue
        m = r['meta']
        if r['errors']:
            print('✖', os.path.basename(src)); [print('    خطأ:', e) for e in r['errors']]; bad += 1
            continue
        for w in r['warnings']: print('  ⚠', os.path.basename(src), w)
        lv = 'المستوى الأول' if m['level'] == 1 else 'المستوى الثاني'
        extra_css_path = src[:-3] + '.css'
        extra_css = rd(extra_css_path) if os.path.exists(extra_css_path) else ''
        html = tpl.replace('{{LEVEL}}', lv).replace('{{NUM}}', str(m['num'])).replace('{{TITLE}}', m['title'])
        html = html.replace('{{CSS}}', css).replace('{{EXTRA_CSS}}', extra_css).replace('{{LIB}}', lib).replace('{{MODULE}}', rd(src)).replace('{{ENGINE}}', eng)
        n2 = f"{m['num']:02d}"
        if m['level'] == 1:
            fn, gn = f"وحدة-{n2}-{m['slug']}.html", f"اختبار-الوحدة-{m['num']}-{m['slug']}.gift.txt"
        else:
            fn, gn = f"مستوى-2-وحدة-{n2}-{m['slug']}.html", f"مستوى-2-اختبار-الوحدة-{m['num']}-{m['slug']}.gift.txt"
        for old in glob.glob(os.path.join(OUT[L], (f'وحدة-{n2}-*.html' if m['level'] == 1 else f'مستوى-2-وحدة-{n2}-*.html'))):
            if os.path.basename(old) != fn: os.remove(old)
        open(os.path.join(OUT[L], fn), 'w', encoding='utf-8').write(html)
        open(os.path.join(OUT[L], gn), 'w', encoding='utf-8').write(r['gift'])
        print(f"✔ {fn}  | شرائح {m['slides']} · مختبرات {m['labs']} · تحديات {m['challenges']} · تفاعلات {m['anims']} (متحركة {m['motion']})")
sys.exit(1 if bad else 0)
