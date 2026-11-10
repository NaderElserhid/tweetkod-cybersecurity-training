/* TweetKod engine — يبني الشرائح ويربط المكوّنات ويدير الثيم والتنقل */
(function(){
  'use strict';
  const M = window.TK_MODULE, TK = window.TK;
  const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = TK.esc;
  const store = {
    get(k, d){ try { const v = localStorage.getItem('tk:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v){ try { localStorage.setItem('tk:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  const LV = M.level === 1 ? 'المستوى الأول' : 'المستوى الثاني';
  const KEY = M.id + ':';
  const safe = (fn, name) => { try { fn(); } catch (e) { console.error('TK component failed:', name, e); } };

  /* ---------- الثيم والخط ---------- */
  const root = document.documentElement;
  function setTheme(t){ root.setAttribute('data-theme', t); store.set('theme', t); const b = $('#tkTheme'); if (b) b.textContent = t === 'dark' ? '☀️' : '🌙'; }
  let th = store.get('theme', null);
  if (!th) th = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  let fs = store.get('fs', 1);
  function setFs(v){ fs = Math.max(.85, Math.min(1.4, v)); root.style.setProperty('--fs', fs); store.set('fs', fs); }
  setFs(fs);

  /* ---------- بناء الشرائح ---------- */
  const labs = TK.reg.filter(r => r.k === 'lab').length + TK.reg.filter(r => r.k === 'shell').length;
  const chs = TK.reg.filter(r => r.k === 'challenge').length;
  const anims = TK.reg.filter(r => ['steps', 'terminal', 'scan', 'transform', 'compare', 'cards', 'scenario', 'classify'].includes(r.k)).length;
  const S = [];
  S.push('<div class="in"><div class="center"><div class="big-emoji">' + (M.emoji || '🛡️') + '</div><div class="kicker">TweetKod · ' + LV + ' — الوحدة ' + M.num + '</div>' +
    '<h1 class="tk-h1">' + M.title + '<span class="en">' + (M.en || '') + '</span></h1><p class="lead">' + (M.lead || '') + '</p><div class="mt">' +
    '<span class="tag">⏱️ 90 دقيقة</span><span class="tag">🧪 ' + labs + ' مختبرات عملية</span><span class="tag">🏁 ' + chs + ' تحديات</span><span class="tag">🎬 ' + anims + ' تفاعلات</span>' +
    (M.tags || []).map(t => '<span class="tag">' + t + '</span>').join('') + '</div></div></div>');
  S.push(TK.s('خطة الجلسة', 'Session roadmap', '<div class="card"><ul class="agenda">' + (M.agenda || []).map(a => '<li><span>' + a.t + '</span><span class="t">' + a.time + '</span></li>').join('') + '</ul></div>' +
    '<div class="flag">⚖️ <b>تذكير الأخلاقيات:</b> كل تطبيق عملي يتم داخل مختبر معزول أو منصة تدريب قانونية. لا تفحص أو تختبر أي نظام لا تملكه أو لا تملك إذناً كتابياً به.</div>'));
  (M.slides || []).forEach(h => S.push(h));
  S.push(TK.s('🎯 اختبار الوحدة (تدريبي)', M.quiz.length + ' أسئلة · أجوبة فورية مع تفسير', '<p class="lead">للمراجعة فقط — الاختبار الرسمي على منصة مودل. ترتيب الخيارات يتغيّر في كل محاولة.</p><div class="card" id="tkQuiz"></div>'));
  S.push(TK.s('🏆 مشروع الوحدة: أشّر ما أنجزته فعلياً', 'Hands-on checklist', '<div class="card" id="tkAudit"></div><p id="tkAuditScore" class="tc" style="font-size:1.2rem;font-weight:900"></p>'));
  S.push(TK.s('📌 الملخص والمراجع', 'Recap & resources', '<div class="grid g2"><div class="card"><b style="color:var(--blue)">تذكّر دائماً</b><ul class="clean">' + (M.recap || []).map(i => '<li>' + i + '</li>').join('') + '</ul></div>' +
    '<div class="card"><b style="color:var(--yellow)">📝 الواجب</b><p class="sm muted">' + (M.homework || '') + '</p></div></div><div class="card"><b style="color:var(--blue)">📚 كل الروابط</b>' +
    (M.resources || []).map(r => '<a class="reslink" href="' + r.u + '" target="_blank" rel="noopener">🔗 ' + r.t + '</a>').join('') + '</div>'));
  S.push('<div class="in"><div class="center"><div class="big-emoji">🏁</div><h1 class="tk-h1">أحسنتم! أنجزتم الوحدة ' + M.num + '</h1><p class="lead">' + (M.next || '') + '</p><span class="tag mt">فريق تويتكود التعليمية 💙</span></div></div>');

  const stage = $('#stage');
  S.forEach(h => { const d = document.createElement('section'); d.className = 'slide'; d.innerHTML = h.indexOf('class="in"') === 0 || h.indexOf('<div class="in">') === 0 ? h : '<div class="in">' + h + '</div>'; stage.appendChild(d); });
  const els = $$('.slide');
  const titles = els.map((e, i) => { const h = $('h2.tk-h2,h1.tk-h1', e); if (!h) return 'شريحة ' + (i + 1); const c = h.cloneNode(true); const en = $('.en', c); if (en) en.remove(); return c.textContent.trim(); });

  /* ---------- التنقل ---------- */
  let cur = 0;
  function render(){
    els.forEach((e, i) => e.classList.toggle('on', i === cur));
    $('#tkCount').textContent = (cur + 1) + ' / ' + els.length;
    $('#tkBar').style.width = ((cur + 1) / els.length * 100) + '%';
    $('#tkPrev').disabled = cur === 0; $('#tkNext').disabled = cur === els.length - 1;
    els[cur].scrollTop = 0;
    if (history.replaceState) history.replaceState(null, '', '#' + (cur + 1));
    $$('.tk-drawer .it').forEach((b, i) => b.classList.toggle('cur', i === cur));
  }
  function go(d){ cur = Math.max(0, Math.min(els.length - 1, cur + d)); render(); }
  function jump(i){ cur = i; render(); }
  $('#tkPrev').onclick = () => go(-1); $('#tkNext').onclick = () => go(1);
  document.addEventListener('keydown', e => {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.key === 'ArrowLeft' || e.key === 'PageDown') go(1);
    if (e.key === 'ArrowRight' || e.key === 'PageUp') go(-1);
    if (e.key === 'Home') jump(0); if (e.key === 'End') jump(els.length - 1);
  });
  let tx = null; stage.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => { if (tx === null) return; const dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 70 && !/INPUT|TEXTAREA/.test((e.target || {}).tagName || '')) go(dx < 0 ? 1 : -1); }, { passive: true });

  /* ---------- الرأس: ثيم/خط/فهرس/طباعة ---------- */
  $('#tkTheme').onclick = () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  $('#tkFm').onclick = () => setFs(fs - .08); $('#tkFp').onclick = () => setFs(fs + .08);
  window.addEventListener('beforeprint', () => setTheme('light'));
  const dr = $('#tkDrawer');
  dr.querySelector('.pn').innerHTML = '<b>📑 فهرس الشرائح</b>' + titles.map((t, i) => '<button class="it"><span class="n">' + (i + 1) + '</span><span>' + esc(t) + '</span></button>').join('');
  $$('.it', dr).forEach((b, i) => b.onclick = () => { jump(i); dr.classList.remove('open'); });
  $('#tkMenu').onclick = () => dr.classList.add('open'); dr.querySelector('.bk').onclick = () => dr.classList.remove('open');
  setTheme(th);

  /* ---------- مؤقّت الاستراحة ---------- */
  (function(){
    let t = null, s = 600; const d = $('[data-tk-timer]'); if (!d) return;
    const paint = () => { d.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
    $('[data-tk-timer-start]').onclick = () => { if (t) return; t = setInterval(() => { s--; if (s <= 0) { clearInterval(t); t = null; d.textContent = 'انتهت الاستراحة ⏰'; } else paint(); }, 1000); };
    $('[data-tk-timer-reset]').onclick = () => { clearInterval(t); t = null; s = 600; paint(); };
  })();

  /* ---------- ربط المكوّنات ---------- */
  const W = {};
  W.steps = c => { const el = document.getElementById(c.id), st = $('.stage', el), mv = $('.mover', el), cap = $('.cap', el), dots = $('.dots', el); let i = 0;
    const pos = { a: '22%', mid: '50%', b: '78%' };
    function paint(){ const s = c.steps[i]; mv.textContent = s.icon || ''; mv.style.opacity = s.icon ? 1 : 0; mv.style.insetInlineStart = pos[s.at] || (typeof s.at === 'number' ? s.at + '%' : '50%');
      cap.textContent = s.cap; st.classList.remove('ok', 'bad'); if (s.flash) st.classList.add(s.flash);
      $$('.actor em', el).forEach((e, k) => { e.textContent = (k === 0 ? s.ba : s.bb) || ''; });
      dots.innerHTML = c.steps.map((_, k) => '<i class="' + (k <= i ? 'on' : '') + '"></i>').join(''); }
    el.addEventListener('click', e => { const a = e.target.getAttribute && e.target.getAttribute('data-a'); if (!a) return; if (a === 'next') i = Math.min(c.steps.length - 1, i + 1); if (a === 'prev') i = Math.max(0, i - 1); if (a === 'reset') i = 0; paint(); });
    paint(); };
  W.cards = c => { const el = document.getElementById(c.id); const cs = $$('.tk-card', el); cs.forEach(x => x.onclick = () => { const was = x.classList.contains('open'); cs.forEach(y => y.classList.remove('open')); if (!was) x.classList.add('open'); }); };
  W.compare = c => { const el = document.getElementById(c.id), bs = $$('.seg button', el), ps = $$('.pane', el);
    bs.forEach((b, i) => b.onclick = () => { bs.forEach((x, k) => { x.classList.toggle('blue', k === i); x.classList.toggle('ghost', k !== i); }); ps.forEach((p, k) => p.classList.toggle('on', k === i)); }); };
  W.terminal = c => { const el = document.getElementById(c.id), pre = $('pre', el); const btn = document.querySelector('[data-tk-run="' + c.id + '"]'); let run = 0;
    btn.onclick = () => { const my = ++run; pre.innerHTML = ''; let k = 0; (function next(){ if (my !== run || k >= c.lines.length) return; const l = c.lines[k++]; const sp = document.createElement('span'); sp.className = l[0]; sp.textContent = l[1] + '\n'; pre.appendChild(sp); pre.scrollTop = pre.scrollHeight; setTimeout(next, l[2] || c.ms); })(); }; };
  W.scan = c => { const el = document.getElementById(c.id), cells = $$('.c', el), sum = $('.sum', el); let run = 0;
    function reset(){ run++; cells.forEach(x => x.className = 'c'); sum.textContent = ''; }
    el.addEventListener('click', e => { const a = e.target.getAttribute && e.target.getAttribute('data-a'); if (a === 'reset') reset(); if (a === 'go') { reset(); const my = run; let k = 0, cnt = {};
      (function nx(){ if (my !== run) return; if (k > 0) { const p = cells[k - 1], s = c.cells[k - 1].s; p.className = 'c ' + s; cnt[s] = (cnt[s] || 0) + 1; }
        if (k >= cells.length) { sum.textContent = Object.keys(cnt).map(s => (c.labels[s] || s) + ': ' + cnt[s]).join(' · '); return; }
        cells[k].className = 'c scan'; k++; setTimeout(nx, c.ms); })(); } }); };
  W.transform = c => { const el = document.getElementById(c.id), inp = $('input', el), out = $('.out', el), gear = $('.gear', el), after = $('.after', el);
    el.addEventListener('click', e => { if (e.target.getAttribute('data-a') !== 'go') return; const v = inp ? inp.value : ''; out.textContent = '…'; gear.classList.add('spinning');
      setTimeout(() => { gear.classList.remove('spinning'); out.textContent = c.fn === 'sha256' ? TK.sha256(v) : (c.output || '—'); out.classList.add('pop'); setTimeout(() => out.classList.remove('pop'), 500); if (c.after) after.textContent = c.after; }, 1000); }); };
  W.lab = c => { const el = document.getElementById(c.id), st = $$('.stp', el), pm = $('.pm i', el); const k = KEY + c.id; let done = store.get(k, []);
    const paint = () => { st.forEach((s, i) => s.classList.toggle('done', done.indexOf(i) > -1)); pm.style.width = (done.length / c.n * 100) + '%'; };
    st.forEach((s, i) => s.onclick = () => { const p = done.indexOf(i); if (p > -1) done.splice(p, 1); else done.push(i); store.set(k, done); paint(); }); paint(); };
  W.challenge = c => { const el = document.getElementById(c.id), inp = $('input', el), res = $('.res', el); const k = KEY + c.id; const norm = s => String(s).trim().toLowerCase().replace(/\s+/g, ' ');
    const solved = () => { el.classList.add('solved'); res.innerHTML = '<span style="color:var(--ok)">✅ إجابة صحيحة! +' + c.pts + ' نقطة</span>' + (c.explain ? '<div class="sm muted" style="font-weight:600">' + c.explain + '</div>' : ''); };
    if (store.get(k, false)) solved();
    el.addEventListener('click', e => { const a = e.target.getAttribute && e.target.getAttribute('data-a'); if (a === 'hint') { const h = $('.hint', el); h.style.display = h.style.display === 'none' ? 'block' : 'none'; }
      if (a === 'chk') { const v = norm(inp.value); const ok = c.re ? new RegExp(c.re, 'i').test(inp.value.trim()) : c.answer.some(x => norm(x) === v); if (ok) { store.set(k, true); solved(); updScore(); } else { res.innerHTML = '<span style="color:var(--bad)">❌ ليست صحيحة بعد — راجع الخطوات وجرّب مرة أخرى.</span>'; } } });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('[data-a=chk]', el).click(); }); };
  W.scenario = c => { const el = document.getElementById(c.id), h = $('.sh', el), o = $('.so', el), f = $('.sf', el); let i = 0, score = 0;
    function paint(){ if (i >= c.steps.length) { o.innerHTML = ''; h.innerHTML = '<div class="big" style="font-weight:900;font-size:1.4rem;text-align:center">النتيجة: ' + score + ' / ' + c.steps.length + '</div>'; f.innerHTML = '<div class="tc mt"><button class="btn blue s" data-a="re">↺ أعد المحاولة</button></div>'; return; }
      const s = c.steps[i]; h.innerHTML = '<span class="tag">الموقف ' + (i + 1) + ' من ' + c.steps.length + '</span><p style="font-weight:800">' + s.s + '</p>'; f.innerHTML = '';
      o.innerHTML = s.o.map((x, j) => '<button class="opt" dir="auto" data-j="' + j + '">' + x.t + '</button>').join(''); }
    el.addEventListener('click', e => { const b = e.target.closest ? e.target.closest('[data-j]') : null; if (e.target.getAttribute && e.target.getAttribute('data-a') === 're') { i = 0; score = 0; paint(); return; }
      if (!b || b.classList.contains('ok') || b.classList.contains('no') || f.getAttribute('data-l')) return; const s = c.steps[i], x = s.o[+b.getAttribute('data-j')]; b.classList.add(x.ok ? 'ok' : 'no'); if (x.ok) score++;
      f.setAttribute('data-l', 1); f.innerHTML = '<div class="' + (x.ok ? 'tip' : 'warn') + '">' + (x.ok ? '✅ ' : '❌ ') + x.fb + '</div><div class="tc"><button class="btn blue s" data-a="nx">' + (i === c.steps.length - 1 ? 'عرض النتيجة' : 'الموقف التالي ▶') + '</button></div>'; });
    el.addEventListener('click', e => { if (e.target.getAttribute && e.target.getAttribute('data-a') === 'nx') { f.removeAttribute('data-l'); i++; paint(); } });
    paint(); };
  W.classify = c => { const el = document.getElementById(c.id), its = $('.its', el), bks = $('.bks', el), fb = $('.fb', el); let sel = null, ok = 0, tot = c.items.length;
    its.innerHTML = c.items.map((x, i) => '<button class="it" dir="auto" data-i="' + i + '">' + x.t + '</button>').join('');
    bks.innerHTML = c.buckets.map((b, i) => '<div class="bk" data-b="' + i + '"><b>' + (b.e || '') + ' ' + b.t + '</b><div class="got"></div></div>').join('');
    el.addEventListener('click', e => { const it = e.target.closest('.it'), bk = e.target.closest('.bk');
      if (it && !it.classList.contains('done')) { $$('.it', el).forEach(x => x.classList.remove('sel')); it.classList.add('sel'); sel = +it.getAttribute('data-i'); fb.textContent = ''; return; }
      if (bk && sel !== null) { const b = +bk.getAttribute('data-b'), item = c.items[sel], btn = $$('.it', el)[sel];
        if (item.b === b) { btn.classList.add('done'); btn.classList.remove('sel'); $('.got', bk).innerHTML += '✔ ' + item.t + '<br>'; ok++; sel = null; fb.innerHTML = '<span style="color:var(--ok)">✅ صحيح!' + (item.why ? ' ' + item.why : '') + '</span>'; if (ok === tot) fb.innerHTML = '<span style="color:var(--ok)">🎉 صنّفت كل العناصر بنجاح!</span>'; }
        else fb.innerHTML = '<span style="color:var(--bad)">❌ ليس هنا — فكّر مرة أخرى.' + (item.hint ? ' 💡 ' + item.hint : '') + '</span>'; } }); };

  /* تحقّق سريع صح/خطأ بعد كل موضوع — تنشيط فوري، لا يُحتسب في الاختبار النهائي */
  W.check = c => { const el = document.getElementById(c.id), fb = $('.fb', el); let picked = false;
    el.addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (!b || picked) return; picked = true;
      const v = b.getAttribute('data-v') === '1';
      $$('[data-v]', el).forEach(x => { if ((x.getAttribute('data-v') === '1') === c.t) x.classList.add('correct'); });
      if (v === c.t) { fb.innerHTML = '<div class="tip">✅ صحيح! ' + (c.why || '') + '</div>'; }
      else { b.classList.add('wrong'); fb.innerHTML = '<div class="warn">❌ ' + (c.t ? 'العبارة صحيحة فعلياً.' : 'العبارة خاطئة فعلياً.') + ' ' + (c.why || '') + '</div>'; } }); };

  /* طرفية Linux تفاعلية */
  W.shell = c => {
    const el = document.getElementById(c.id), out = $('.out', el), inp = $('input', el), pr = $('.pr', el), tasks = $$('.tk-tasks .t', el);
    const norm = p => { const parts = []; p.split('/').forEach(s => { if (!s || s === '.') return; if (s === '..') parts.pop(); else parts.push(s); }); return '/' + parts.join('/'); };
    const mk = (o) => (typeof o === 'string') ? { t: 'f', d: o, p: '-rw-r--r--' } : Array.isArray(o) ? { t: 'f', d: o[0], p: o[1] || '-rw-r--r--' } : { t: 'd', c: Object.keys(o).reduce((a, k) => { a[k] = mk(o[k]); return a; }, {}) };
    const fsr = mk(c.fs); let cwd = c.cwd; const home = c.cwd;
    const find = p => { let n = fsr; for (const s of p.split('/').filter(Boolean)) { if (!n || n.t !== 'd' || !n.c[s]) return null; n = n.c[s]; } return n; };
    const abs = p => p.charAt(0) === '/' ? norm(p) : (p === '~' ? home : norm(cwd + '/' + p));
    const tok = l => (l.match(/"[^"]*"|'[^']*'|\S+/g) || []).map(x => x.replace(/^["']|["']$/g, ''));
    const hist = []; let hi = 0; const done = tasks.map(() => false);
    const print = (t, cls) => { const s = document.createElement('span'); if (cls) s.className = cls; s.textContent = t; out.appendChild(s); out.scrollTop = out.scrollHeight; };
    const prompt = () => { pr.textContent = c.user + '@' + c.host + ':' + (cwd === home ? '~' : cwd) + '$'; };
    const dirList = (d, all) => Object.keys(d.c).filter(k => all || k[0] !== '.').sort();
    function runCmd(a, stdin){ // يعيد نصاً
      const cmd = a[0], args = a.slice(1), flags = args.filter(x => x[0] === '-'), rest = args.filter(x => x[0] !== '-'); const has = f => flags.some(x => x.indexOf(f) > -1);
      switch (cmd) {
        case 'pwd': return cwd;
        case 'whoami': return c.user;
        case 'id': return 'uid=1000(' + c.user + ') gid=1000(' + c.user + ') groups=1000(' + c.user + ')';
        case 'hostname': return c.host;
        case 'echo': return args.join(' ');
        case 'clear': out.textContent = ''; return null;
        case 'help': return 'الأوامر المتاحة: ls cd pwd cat head tail grep find wc echo mkdir touch rm cp mv chmod whoami id clear\nالمسارات: ~ هو مجلدك، .. المجلد الأعلى. جرّب الأنبوب: cat file | grep كلمة';
        case 'ls': { const n = find(abs(rest[0] || '.')); if (!n) return 'ls: cannot access \'' + (rest[0] || '') + '\': No such file or directory'; if (n.t === 'f') return rest[0];
          const names = dirList(n, has('a')); if (has('l')) return names.map(k => { const x = n.c[k]; return (x.t === 'd' ? 'drwxr-xr-x' : x.p) + ' 1 ' + c.user + ' ' + c.user + ' ' + String(x.t === 'd' ? 4096 : x.d.length).padStart(5) + ' ' + k + (x.t === 'd' ? '/' : ''); }).join('\n');
          return names.map(k => k + (n.c[k].t === 'd' ? '/' : '')).join('  '); }
        case 'cd': { const p = rest[0] ? abs(rest[0]) : home; const n = find(p); if (!n) return 'bash: cd: ' + rest[0] + ': No such file or directory'; if (n.t !== 'd') return 'bash: cd: ' + rest[0] + ': Not a directory'; cwd = p; prompt(); return null; }
        case 'cat': { if (!rest.length && stdin != null) return stdin; return rest.map(r => { const n = find(abs(r)); return !n ? 'cat: ' + r + ': No such file or directory' : n.t === 'd' ? 'cat: ' + r + ': Is a directory' : n.d; }).join('\n'); }
        case 'head': case 'tail': { let nn = 10; const ix = args.indexOf('-n'); if (ix > -1) nn = +args[ix + 1] || 10; const file = rest.filter(x => x !== String(nn))[0]; let txt = stdin; if (file) { const n = find(abs(file)); if (!n || n.t !== 'f') return cmd + ': cannot open \'' + file + '\''; txt = n.d; } const ls = String(txt || '').split('\n'); return (cmd === 'head' ? ls.slice(0, nn) : ls.slice(-nn)).join('\n'); }
        case 'wc': { let txt = stdin; if (rest[0]) { const n = find(abs(rest[0])); if (!n || n.t !== 'f') return 'wc: ' + rest[0] + ': No such file'; txt = n.d; } txt = String(txt || ''); const l = txt.split('\n').length, w = txt.split(/\s+/).filter(Boolean).length; return has('l') ? String(l) : has('w') ? String(w) : l + ' ' + w + ' ' + txt.length; }
        case 'sort': return String(stdin || '').split('\n').sort().join('\n');
        case 'uniq': return String(stdin || '').split('\n').filter((x, i, ar) => i === 0 || x !== ar[i - 1]).join('\n');
        case 'grep': { if (!rest.length) return 'usage: grep [-irn] pattern [file]'; const pat = rest[0], ic = has('i'), rr = has('r') || has('R'); const re = new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, m => m), ic ? 'i' : '');
          let re2; try { re2 = new RegExp(pat, ic ? 'i' : ''); } catch (e) { re2 = re; } const res = [];
          const scan = (txt, label) => String(txt).split('\n').forEach((ln, i) => { if (re2.test(ln)) res.push((label ? label + ':' : '') + (has('n') ? (i + 1) + ':' : '') + ln); });
          const walk = (n, p) => { if (n.t === 'f') scan(n.d, p); else Object.keys(n.c).sort().forEach(k => walk(n.c[k], p + (p === '/' ? '' : '/') + k)); };
          if (rest.length < 2) { if (stdin == null) return 'grep: missing file'; scan(stdin, ''); } else rest.slice(1).forEach(r => { const n = find(abs(r)); if (!n) { res.push('grep: ' + r + ': No such file or directory'); return; } if (n.t === 'd') { if (rr) walk(n, abs(r)); else res.push('grep: ' + r + ': Is a directory'); } else scan(n.d, rest.length > 2 ? r : ''); });
          return res.join('\n'); }
        case 'find': { const start = abs(rest[0] && rest[0][0] !== '-' ? rest[0] : '.'); const ni = args.indexOf('-name'); const pat = ni > -1 ? args[ni + 1] : null; const n = find(start); if (!n) return 'find: \'' + rest[0] + '\': No such file or directory';
          const re = pat ? new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$') : null; const res = [];
          const walk = (nd, p) => { if (!re || re.test(p.split('/').pop())) res.push(p); if (nd.t === 'd') Object.keys(nd.c).sort().forEach(k => walk(nd.c[k], p + (p === '/' ? '' : '/') + k)); }; walk(n, start); return res.join('\n'); }
        case 'mkdir': { rest.forEach(r => { const p = abs(r), par = find(norm(p + '/..')); if (par && par.t === 'd') par.c[p.split('/').pop()] = { t: 'd', c: {} }; }); return null; }
        case 'touch': { rest.forEach(r => { const p = abs(r), par = find(norm(p + '/..')); const nm = p.split('/').pop(); if (par && par.t === 'd' && !par.c[nm]) par.c[nm] = { t: 'f', d: '', p: '-rw-r--r--' }; }); return null; }
        case 'rm': { rest.forEach(r => { const p = abs(r), par = find(norm(p + '/..')); const nm = p.split('/').pop(); if (par && par.c && par.c[nm]) delete par.c[nm]; }); return null; }
        case 'cp': case 'mv': { const s = find(abs(rest[0])); if (!s) return cmd + ': cannot stat \'' + rest[0] + '\''; const p = abs(rest[1]), par = find(norm(p + '/..')); par.c[p.split('/').pop()] = JSON.parse(JSON.stringify(s)); if (cmd === 'mv') { const sp = abs(rest[0]); delete find(norm(sp + '/..')).c[sp.split('/').pop()]; } return null; }
        case 'chmod': { const n = find(abs(rest[1] || '')); if (!n) return 'chmod: cannot access \'' + (rest[1] || '') + '\''; if (n.t === 'f') { const m = rest[0]; if (m === '+x') n.p = '-rwxr-xr-x'; else if (m === '-x') n.p = '-rw-r--r--'; else if (/^[0-7]{3}$/.test(m)) { const f = d => (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-'); n.p = '-' + m.split('').map(d => f(+d)).join(''); } } return null; }
        default: return 'bash: ' + cmd + ': command not found';
      }
    }
    function exec(line){
      const raw = line.trim(); if (!raw) return;
      for (const cm of c.cmds) { if (new RegExp(cm.re, 'i').test(raw)) { print(cm.out + '\n', cm.cls || ''); return; } }
      const stages = []; let cur2 = []; tok(raw).forEach(t => { if (t === '|') { stages.push(cur2); cur2 = []; } else cur2.push(t); }); stages.push(cur2);
      let redir = null; const last = stages[stages.length - 1]; const ri = last.findIndex(t => t === '>' || t === '>>'); if (ri > -1) { redir = { f: last[ri + 1], app: last[ri] === '>>' }; stages[stages.length - 1] = last.slice(0, ri); }
      let data = null; for (let i = 0; i < stages.length; i++) { if (!stages[i].length) continue; data = runCmd(stages[i], data); if (data === null && i < stages.length - 1) data = ''; }
      if (redir && redir.f) { const p = abs(redir.f), par = find(norm(p + '/..')), nm = p.split('/').pop(); if (par && par.t === 'd') { const old = par.c[nm]; par.c[nm] = { t: 'f', d: (redir.app && old ? old.d + '\n' : '') + (data || ''), p: '-rw-r--r--' }; } data = null; }
      if (data !== null && data !== undefined) print(data + '\n');
    }
    function check(line){ tasks.forEach((t, i) => { if (!done[i] && new RegExp(c.tasks[i].re, 'i').test(line.trim())) { done[i] = true; t.classList.add('done'); } }); }
    prompt(); print(c.motd + '\n', 'dim');
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { const l = inp.value; print(pr.textContent + ' ', 'hl'); print(l + '\n', 'cmd'); hist.push(l); hi = hist.length; inp.value = ''; safe(() => { exec(l); check(l); }, 'shell'); prompt(); }
      else if (e.key === 'ArrowUp') { if (hi > 0) inp.value = hist[--hi]; e.preventDefault(); } else if (e.key === 'ArrowDown') { inp.value = hi < hist.length - 1 ? hist[++hi] : ''; if (hi >= hist.length - 1) hi = hist.length; e.preventDefault(); } });
    el.querySelector('.tk-shell').addEventListener('click', () => inp.focus());
  };

  /* أدوات حيّة */
  W.live = c => { const el = document.getElementById(c.id), inp = $('input', el);
    if (c.name === 'hash') { const o = $('.out', el); const f = () => { o.textContent = TK.sha256(inp.value); }; inp.oninput = f; f(); }
    if (c.name === 'entropy') { const m = $('.meter i', el), r = $('.res', el), tg = $$('.tag', el);
      const common = ['password', '123456', '12345678', 'qwerty', 'admin', 'letmein', 'iloveyou', 'welcome', 'abc123', 'password1', '111111', 'football', 'tweetkod'];
      const f = () => { const p = inp.value; let pool = 0; if (/[a-z]/.test(p)) pool += 26; if (/[A-Z]/.test(p)) pool += 26; if (/[0-9]/.test(p)) pool += 10; if (/[^a-zA-Z0-9]/.test(p)) pool += 33; const L = p.length; let H = L && pool ? L * Math.log2(pool) : 0;
        const isCommon = common.some(w => p.toLowerCase().indexOf(w) > -1); if (isCommon) H = Math.min(H, 20);
        const secs = Math.pow(2, H) / 1e10, hum = s => s < 1 ? 'أقل من ثانية' : s < 60 ? Math.round(s) + ' ثانية' : s < 3600 ? Math.round(s / 60) + ' دقيقة' : s < 86400 ? Math.round(s / 3600) + ' ساعة' : s < 31536000 ? Math.round(s / 86400) + ' يوم' : s < 3.15e9 ? Math.round(s / 31536000) + ' سنة' : 'أكثر من 100 سنة';
        m.style.width = Math.min(100, H / 80 * 100) + '%'; m.style.background = H < 40 ? 'var(--bad)' : H < 60 ? 'var(--warn)' : 'var(--ok)';
        r.textContent = !L ? '—' : (H < 40 ? '🔴 ضعيفة' : H < 60 ? '🟡 متوسطة' : '🟢 قوية') + (isCommon ? ' — تحتوي كلمة شائعة معروفة في قوائم الكسر!' : '');
        tg[0].textContent = 'الطول: ' + L; tg[1].textContent = 'الإنتروبيا: ' + Math.round(H) + ' بت'; tg[2].textContent = 'زمن الكسر التقريبي: ' + hum(secs); };
      inp.oninput = f; f(); }
    if (c.name === 'caesar') { const wo = $('.ring.o', el), wi = $('.ring.i', el), lbl = $('.lbl', el), o = $('.out', el); let k = 3; const AL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let ho = '', hi2 = ''; for (let i = 0; i < 26; i++) { const a = (i * 360 / 26 - 90) * Math.PI / 180; const xo = 130 + 112 * Math.cos(a) - 11, yo = 130 + 112 * Math.sin(a) - 11, xi = 130 + 76 * Math.cos(a) - 11, yi = 130 + 76 * Math.sin(a) - 11;
        ho += '<div class="l" style="left:' + xo + 'px;top:' + yo + 'px;color:#7ee787">' + AL[i] + '</div>'; hi2 += '<div class="l" style="left:' + xi + 'px;top:' + yi + 'px;background:#F7B228;color:#0c1f28;border-radius:50%">' + AL[i] + '</div>'; }
      wo.innerHTML = ho; wi.innerHTML = hi2; const f = () => { wi.style.transform = 'rotate(' + (k * 360 / 26) + 'deg)'; lbl.textContent = 'الإزاحة: ' + k; o.textContent = TK.caesar(inp.value, k); };
      $$('[data-d]', el).forEach(b => b.onclick = () => { k = (k + (+b.getAttribute('data-d')) + 26) % 26; f(); }); inp.oninput = f; f(); }
    if (c.name === 'convert') { const o = [1, 2, 3, 4].map(i => $('.o' + i, el)); const f = () => { const v = inp.value; let b64 = ''; try { b64 = btoa(unescape(encodeURIComponent(v))); } catch (e) { b64 = '—'; }
      o[0].textContent = b64; o[1].textContent = Array.from(unescape(encodeURIComponent(v))).map(ch => ch.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
      o[2].textContent = Array.from(unescape(encodeURIComponent(v))).map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0')).join(' '); o[3].textContent = TK.caesar(v, 13); }; inp.oninput = f; f(); } };

  TK.reg.forEach(c => safe(() => W[c.k] && W[c.k](c), c.k));

  /* ---------- الاختبار ---------- */
  (function(){
    const box = $('#tkQuiz'); let qi = 0, sc = 0, picked = false;
    const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    function paint(){
      if (qi >= M.quiz.length) { const p = Math.round(sc / M.quiz.length * 100), g = p >= 80 ? ['🏆', 'ممتاز!', 'var(--ok)'] : p >= 60 ? ['👍', 'جيد', 'var(--yellow)'] : ['📖', 'يحتاج مراجعة', 'var(--bad)'];
        box.innerHTML = '<div class="tc"><div class="big-emoji">' + g[0] + '</div><div style="font-size:2rem;font-weight:900;color:' + g[2] + '">' + sc + ' / ' + M.quiz.length + '</div><p class="lead" style="margin:auto;color:' + g[2] + ';font-weight:900">' + g[1] + ' — ' + p + '%</p><button class="btn blue mt" id="tkQRe">↺ أعد المحاولة</button></div>'; $('#tkQRe').onclick = () => { qi = 0; sc = 0; paint(); }; return; }
      const q = M.quiz[qi], opts = shuf([{ t: q.ok, c: 1 }].concat(q.no.map(t => ({ t, c: 0 })))); picked = false;
      box.innerHTML = '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><span class="tag">السؤال ' + (qi + 1) + ' من ' + M.quiz.length + '</span><div class="dots">' + M.quiz.map((_, k) => '<i class="' + (k <= qi ? 'on' : '') + '"></i>').join('') + '</div></div>' +
        '<p style="font-weight:900;font-size:1.05rem">' + q.q + '</p>' + opts.map((o, j) => '<button class="quiz-opt" dir="auto" data-j="' + j + '">' + o.t + '</button>').join('') + '<div id="tkQF"></div><div style="text-align:end"><button class="btn ghost" id="tkQN" style="display:none">' + (qi === M.quiz.length - 1 ? 'النتيجة 🏁' : 'التالي ▶') + '</button></div>';
      $$('.quiz-opt', box).forEach(b => b.onclick = () => { if (picked) return; picked = true; const o = opts[+b.getAttribute('data-j')]; $$('.quiz-opt', box).forEach((x, k) => { if (opts[k].c) x.classList.add('correct'); });
        if (o.c) { sc++; $('#tkQF').innerHTML = '<div class="tip">✅ صحيح! ' + (q.why || '') + '</div>'; } else { b.classList.add('wrong'); $('#tkQF').innerHTML = '<div class="warn">❌ ليست صحيحة. ' + (q.why || '') + '</div>'; } $('#tkQN').style.display = 'inline-block'; });
      $('#tkQN').onclick = () => { qi++; paint(); };
    }
    paint();
  })();

  /* ---------- قائمة الإنجاز + النقاط ---------- */
  function updScore(){ const n = TK.reg.filter(r => r.k === 'challenge' && store.get(KEY + r.id, false)).length; const b = $('#tkPts'); if (b) b.textContent = '🏅 ' + (n * 10); }
  (function(){
    const box = $('#tkAudit'); const k = KEY + 'audit'; let on = store.get(k, []);
    box.innerHTML = (M.audit || []).map((a, i) => '<div class="toggle' + (on.indexOf(i) > -1 ? ' on' : '') + '" data-i="' + i + '"><span>' + a + '</span><span class="sw"></span></div>').join('');
    const sc = () => { const n = $$('.toggle.on', box).length, t = (M.audit || []).length; const e = $('#tkAuditScore'); e.textContent = 'أنجزت: ' + n + ' / ' + t + (n === t ? ' 🎉 أحسنت! أنهيت كل مهام الوحدة' : ''); e.style.color = n >= t * .8 ? 'var(--ok)' : n >= t * .4 ? 'var(--yellow)' : 'var(--bad)'; };
    box.addEventListener('click', e => { const t = e.target.closest('.toggle'); if (!t) return; t.classList.toggle('on'); store.set(k, $$('.toggle', box).map((x, i) => x.classList.contains('on') ? i : -1).filter(x => x > -1)); sc(); }); sc();
  })();
  updScore();

  const h0 = parseInt((location.hash || '').slice(1), 10); if (h0 > 0 && h0 <= els.length) cur = h0 - 1;
  render();
})();
