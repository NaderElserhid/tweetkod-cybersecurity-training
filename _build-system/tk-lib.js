/* TweetKod lib — مكوّنات نقيّة (تعمل في المتصفح وفي Node للفحص وتوليد GIFT) */
(function(root){
  const TK = root.TK = { reg: [], _n: 0 };
  const nid = p => 'tk' + p + (++TK._n);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  TK.esc = esc;
  const reg = (k, cfg) => { TK.reg.push(Object.assign({ k }, cfg)); return cfg.id; };

  /* ---------- هيكل الوحدة ---------- */
  TK.module = function(cfg){ root.TK_MODULE = cfg; return cfg; };

  /* ---------- شرائح عامة ---------- */
  TK.s = (title, en, body) => '<div class="in"><h2 class="tk-h2">' + title + (en ? '<span class="en">' + en + '</span>' : '') + '</h2>' + body + '</div>';
  TK.concept = c => (TK._concepts = (TK._concepts || 0) + 1, 0) || TK.s('💡 ' + c.t, c.en || '', '<div class="card"><span class="tag">⏱️ مفهوم سريع · ' + (c.min || '3 د') + '</span><div class="mt">' + c.body + '</div></div>' +
      (c.key ? '<div class="tip"><b>🎯 الفكرة في جملة:</b> ' + c.key + '</div>' : ''));
  TK.code = (text, cls) => '<div class="codebox ' + (cls || '') + '">' + esc(text) + '</div>';
  TK.table = (head, rows) => '<div class="tblwrap"><table class="tbl"><tr>' + head.map(h => '<th>' + h + '</th>').join('') + '</tr>' +
      rows.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</table></div>';
  TK.terms = list => '<dl class="term"><b>📖 مصطلحات مهمة</b>' + list.map(x => '<dt>' + x[0] + '</dt><dd>' + x[1] + '</dd>').join('') + '</dl>';
  TK.tool = c => '<div class="tk-tool"><div class="ti">' + (c.e || '🛠️') + '</div><div><b>' + c.n + (c.free === false ? '' : ' <span class="tag">مجاني</span>') + '</b>' +
      '<div class="w"><b style="display:inline">ما هي؟</b> ' + c.what + '</div><div class="w"><b style="display:inline">لماذا نستخدمها؟</b> ' + c.why + '</div>' +
      (c.how ? '<div class="w"><b style="display:inline">كيف؟</b> ' + c.how + '</div>' : '') +
      (c.url ? '<a href="' + c.url + '" target="_blank" rel="noopener">🔗 ' + c.url.replace(/^https?:\/\//, '') + '</a>' : '') + '</div></div>';
  TK.breakSlide = next => '<div class="in"><div class="center"><div class="big-emoji">☕</div><div class="kicker">استراحة</div><h1 class="tk-h1">10 دقائق راحة</h1>' +
      '<div class="timerbig" data-tk-timer>10:00</div><div class="mt"><button class="btn" data-tk-timer-start>▶️ بدء العدّاد</button> <button class="btn ghost" data-tk-timer-reset>↺ إعادة</button></div>' +
      (next ? '<p class="lead mt2">' + next + '</p>' : '') + '</div></div>';
  TK.recap = (title, items) => '<div class="in"><div class="center"><div class="big-emoji">✅</div><h2 class="tk-h2" style="justify-content:center">' + title + '</h2><div class="card" style="max-width:640px;text-align:start"><ul class="clean">' +
      items.map(i => '<li>' + i + '</li>').join('') + '</ul></div></div></div>';

  /* ---------- steps: حركة تنقّل بين طرفين (a = بداية القراءة، b = النهاية) ---------- */
  TK.steps = c => {
    const id = nid('st'); reg('steps', { id, steps: c.steps });
    return '<div class="tk-steps card" id="' + id + '"><div class="stage"><div class="actor a"><i>' + c.a.e + '</i><b>' + c.a.l + '</b><em></em></div>' +
      '<div class="actor b"><i>' + c.b.e + '</i><b>' + c.b.l + '</b><em></em></div><div class="mover"></div></div><div class="dots"></div><p class="cap"></p>' +
      '<div class="ctrl"><button class="btn blue s" data-a="next">▶ الخطوة التالية</button><button class="btn ghost s" data-a="prev">◀ السابقة</button><button class="btn ghost s" data-a="reset">↺ من البداية</button></div></div>';
  };
  /* ---------- cards: بطاقات كشف (واحدة مفتوحة في كل مرة) ---------- */
  TK.cards = c => {
    const id = nid('cd'); reg('cards', { id });
    return '<div class="tk-cards c' + (c.cols || 3) + '" id="' + id + '">' + c.items.map(i => '<div class="tk-card"><div class="h"><i>' + (i.e || '•') + '</i>' + i.t + '</div><div class="b">' + i.b + '</div></div>').join('') + '</div>';
  };
  /* ---------- compare: لوحتان بمفتاح تبديل ---------- */
  TK.compare = c => {
    const id = nid('cp'); reg('compare', { id });
    return '<div class="tk-cmp card" id="' + id + '"><div class="seg"><button class="btn blue s" data-i="0">' + c.a.t + '</button><button class="btn ghost s" data-i="1">' + c.b.t + '</button></div>' +
      '<div class="pane on ' + (c.a.bad ? 'badp' : 'good') + '">' + c.a.html + '</div><div class="pane ' + (c.b.bad ? 'badp' : 'good') + '">' + c.b.html + '</div></div>';
  };
  /* ---------- terminal: عرض متحرّك لمخرجات أداة ---------- */
  TK.terminal = c => {
    const id = nid('tm'); reg('terminal', { id, lines: c.lines, ms: c.ms || 420 });
    return '<div class="tk-term" id="' + id + '"><div class="bar"><i style="background:#ff5f56"></i><i style="background:#ffbd2e"></i><i style="background:#27c93f"></i><span>' + esc(c.title || 'terminal') + '</span></div><pre>اضغط تشغيل لمشاهدة التنفيذ…</pre></div>' +
      '<div class="tc mt"><button class="btn blue s" data-tk-run="' + id + '">▶ ' + (c.btn || 'شغّل المحاكاة') + '</button></div>';
  };
  /* ---------- scan: شبكة فحص متتابع ---------- */
  TK.scan = c => {
    const id = nid('sc'); reg('scan', { id, cells: c.cells, labels: c.labels || {} , ms: c.ms || 140 });
    return '<div class="tk-grid card" id="' + id + '"><div class="cells" style="grid-template-columns:repeat(' + (c.cols || 5) + ',1fr)">' +
      c.cells.map(x => '<div class="c" title="' + esc(x.tip || '') + '">' + esc(x.t) + '</div>').join('') + '</div><div class="sum"></div><div class="tc"><button class="btn blue s" data-a="go">▶ ' + (c.btn || 'ابدأ الفحص') + '</button> <button class="btn ghost s" data-a="reset">↺</button></div></div>';
  };
  /* ---------- transform: مدخل → آلة → مخرج (sha256 حقيقي أو ناتج ثابت) ---------- */
  TK.transform = c => {
    const id = nid('tf'); reg('transform', { id, fn: c.fn || 'none', output: c.output || '', after: c.after || '' });
    return '<div class="tk-tf card" id="' + id + '"><div class="row"><div><label class="sm muted">' + (c.inLabel || 'المُدخل') + '</label>' +
      (c.editable === false ? '<div class="box">' + esc(c.input) + '</div>' : '<input type="text" class="ltr" value="' + esc(c.input) + '">') + '</div>' +
      '<div class="gear">' + (c.gear || '⚙️') + '<div class="sm muted">' + (c.label || '') + '</div></div><div><label class="sm muted">' + (c.outLabel || 'المُخرَج') + '</label><div class="box out">—</div></div></div>' +
      '<div class="tc mt"><button class="btn blue s" data-a="go">▶ ' + (c.btn || 'شغّل') + '</button></div><p class="sm muted tc after"></p></div>';
  };
  /* ---------- lab: مختبر بخطوات قابلة للتأشير ---------- */
  TK.lab = c => {
    const id = nid('lb'); reg('lab', { id, n: c.steps.length });
    return '<div class="tk-lab" id="' + id + '"><div class="lh"><span class="badge">🧪 مختبر عملي</span><b>' + c.t + '</b>' + (c.time ? '<span class="tag">⏱️ ' + c.time + '</span>' : '') + '</div>' +
      (c.req ? '<div class="req">✅ <b>المتطلبات:</b> ' + c.req + '</div>' : '') + c.steps.map((s, i) => '<div class="stp" data-i="' + i + '"><span class="n">' + (i + 1) + '</span><span class="tx">' + s + '</span></div>').join('') +
      (c.tools ? c.tools.map(t => '<a class="reslink" href="' + t.u + '" target="_blank" rel="noopener">🔗 ' + t.n + '</a>').join('') : '') +
      (c.tip ? '<div class="tip"><b>💡</b> ' + c.tip + '</div>' : '') + (c.warn ? '<div class="warn"><b>⚠️</b> ' + c.warn + '</div>' : '') +
      '<div class="pm"><i></i></div></div>';
  };
  /* ---------- challenge: تحدٍّ بإجابة قابلة للتحقق ---------- */
  TK.challenge = c => {
    const id = nid('ch'); reg('challenge', { id, answer: [].concat(c.answer), re: c.re || null, pts: c.pts || 10, explain: c.explain || '' });
    return '<div class="tk-ch" id="' + id + '"><div class="chh"><span>🏁 تحدٍّ ' + (c.pts || 10) + ' نقاط</span>' + (c.t || '') + '</div><div>' + c.q + '</div>' +
      '<div class="row"><input type="text" class="ltr" placeholder="' + esc(c.ph || 'اكتب إجابتك هنا…') + '" autocomplete="off"><button class="btn s" data-a="chk">تحقّق</button>' + (c.hint ? '<button class="btn ghost s" data-a="hint">تلميح</button>' : '') + '</div>' +
      '<div class="res"></div>' + (c.hint ? '<div class="sm muted hint" style="display:none">💡 ' + c.hint + '</div>' : '') + '</div>';
  };
  /* ---------- scenario: قرارات متتالية ---------- */
  TK.scenario = c => {
    const id = nid('sn'); reg('scenario', { id, steps: c.steps });
    return '<div class="tk-sc card" id="' + id + '"><div class="sh"></div><div class="so"></div><div class="sf"></div></div>';
  };
  /* ---------- classify: صنّف العناصر في صناديق ---------- */
  TK.classify = c => {
    const id = nid('cl'); reg('classify', { id, items: c.items, buckets: c.buckets });
    return '<div class="tk-cl card" id="' + id + '"><p class="sm muted">اختر عنصراً ثم اضغط الصندوق الصحيح.</p><div class="its"></div><div class="bks"></div><div class="fb"></div></div>';
  };
  /* ---------- check: تحقّق سريع صح/خطأ بعد كل موضوع (تنشيط فوري، لا يُحتسب في الاختبار النهائي) ---------- */
  TK.check = c => {
    const id = nid('ch'); reg('check', { id, s: c.s, t: c.t, why: c.why });
    return '<div class="tk-quick" id="' + id + '"><div class="qh">🧠 <b>تحقّق سريع</b></div><p dir="auto" class="qs">' + c.s + '</p>' +
      '<div class="opts"><button class="quiz-opt s" data-v="1">✅ صحيح</button><button class="quiz-opt s" data-v="0">❌ خطأ</button></div><div class="fb"></div></div>';
  };
  /* ---------- shell: طرفية Linux تفاعلية بنظام ملفات افتراضي ---------- */
  TK.shell = c => {
    const id = nid('sh'); reg('shell', { id, fs: c.fs, cwd: c.cwd || '/home/student', user: c.user || 'student', host: c.host || 'lab', tasks: c.tasks || [], cmds: c.cmds || [], motd: c.motd || 'اكتب help لعرض الأوامر المتاحة.' });
    return '<div id="' + id + '"><div class="tk-shell"><div class="bar"><i style="background:#ff5f56"></i><i style="background:#ffbd2e"></i><i style="background:#27c93f"></i><span>' + esc(c.title || 'student@lab: ~') + '</span></div>' +
      '<div class="out"></div><div class="in"><span class="pr"></span><input type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="terminal"></div></div>' +
      (c.tasks && c.tasks.length ? '<div class="tk-tasks">' + c.tasks.map(t => '<div class="t"><span class="ck">✓</span><span>' + t.d + '</span></div>').join('') + '</div>' : '') + '</div>';
  };
  /* ---------- أدوات حيّة جاهزة ---------- */
  TK.live = name => {
    const id = nid('lv'); reg('live', { id, name });
    const T = {
      hash: '<label>اكتب أي نص</label><input type="text" class="ltr" value="TweetKod2026"><label>SHA-256 (حقيقي، يُحسَب في متصفحك)</label><div class="out"></div><p class="sm muted">غيّر حرفاً واحداً وراقب تغيّر الناتج بالكامل (تأثير الانهيار الثلجي).</p>',
      entropy: '<label>جرّب كلمة مرور (لا تكتب كلمة مرورك الحقيقية!)</label><input type="text" class="ltr" value="Tweet2026"><div class="meter"><i></i></div><div class="res tc" style="font-weight:800"></div><div class="grid g3 mt"><div class="tag tc"></div><div class="tag tc"></div><div class="tag tc"></div></div>',
      caesar: '<div class="wheelwrap"><div class="ring o"></div><div class="ring i"></div></div><div class="tc"><button class="btn ghost s" data-d="-1">◀</button> <span class="tag lbl">الإزاحة: 3</span> <button class="btn ghost s" data-d="1">▶</button></div><label>النص (English)</label><input type="text" class="ltr" value="HELLO"><label>الناتج بهذه الإزاحة</label><div class="out"></div>',
      convert: '<label>النص</label><input type="text" class="ltr" value="Hello TweetKod"><div class="grid g2"><div><label>Base64</label><div class="out o1"></div></div><div><label>Hex</label><div class="out o2"></div></div><div><label>Binary</label><div class="out o3"></div></div><div><label>ROT13</label><div class="out o4"></div></div></div>'
    };
    return '<div class="tk-live card" id="' + id + '">' + (T[name] || '') + '</div>';
  };

  /* ---------- SHA-256 متزامن (لا يعتمد على crypto.subtle) ---------- */
  TK.sha256 = function(s){
    const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const rr = (v, a) => (v >>> a) | (v << (32 - a));
    const str = unescape(encodeURIComponent(s)), b = [];
    for (let i = 0; i < str.length; i++) b.push(str.charCodeAt(i));
    const bl = b.length * 8; b.push(0x80); while (b.length % 64 !== 56) b.push(0);
    const hi = Math.floor(bl / 4294967296), lo = bl >>> 0;
    b.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255, (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
    let H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    for (let o = 0; o < b.length; o += 64) {
      const w = new Array(64);
      for (let i = 0; i < 16; i++) w[i] = (b[o + 4*i] << 24) | (b[o + 4*i + 1] << 16) | (b[o + 4*i + 2] << 8) | b[o + 4*i + 3];
      for (let i = 16; i < 64; i++) {
        const s0 = rr(w[i-15], 7) ^ rr(w[i-15], 18) ^ (w[i-15] >>> 3), s1 = rr(w[i-2], 17) ^ rr(w[i-2], 19) ^ (w[i-2] >>> 10);
        w[i] = (w[i-16] + s0 + w[i-7] + s1) | 0;
      }
      let [a, bb, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25), ch = (e & f) ^ (~e & g), t1 = (h + S1 + ch + K[i] + w[i]) | 0;
        const S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22), mj = (a & bb) ^ (a & c) ^ (bb & c), t2 = (S0 + mj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = bb; bb = a; a = (t1 + t2) | 0;
      }
      H = [(H[0]+a)|0,(H[1]+bb)|0,(H[2]+c)|0,(H[3]+d)|0,(H[4]+e)|0,(H[5]+f)|0,(H[6]+g)|0,(H[7]+h)|0];
    }
    return H.map(x => ('00000000' + (x >>> 0).toString(16)).slice(-8)).join('');
  };
  TK.caesar = (s, k) => s.replace(/[a-zA-Z]/g, ch => { const b = ch <= 'Z' ? 65 : 97; return String.fromCharCode(((ch.charCodeAt(0) - b + k) % 26 + 26) % 26 + b); });

  /* ---------- GIFT من أسئلة الاختبار ---------- */
  TK.gift = function(M){
    const g = s => String(s).replace(/([~=#{}:])/g, '\\$1');
    const pre = 'L' + M.level + '_' + String(M.num).padStart(2, '0');
    let out = '// ' + (M.level === 1 ? 'المستوى الأول' : 'المستوى الثاني') + ' — اختبار الوحدة ' + M.num + ' — ' + M.title + '\n// تويتكود — صيغة GIFT: Question bank > Import > GIFT format\n// ' + M.quiz.length + ' سؤال اختيار من متعدد\n\n';
    M.quiz.forEach((q, i) => {
      out += '::' + pre + '_Q' + (i + 1) + ':: ' + g(q.q) + ' {\n=' + g(q.ok) + '\n' + q.no.map(w => '~' + g(w)).join('\n') + '\n}\n\n';
    });
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
