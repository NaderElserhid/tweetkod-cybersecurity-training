// lint.js <module.js> -> يطبع JSON: {ok, errors[], warnings[], meta, gift}
const vm = require('vm'), fs = require('fs'), path = require('path');
const dir = __dirname;
const modPath = process.argv[2];
const res = { ok: true, errors: [], warnings: [], meta: null, gift: '' };
const err = m => { res.errors.push(m); res.ok = false; }, warn = m => res.warnings.push(m);
try {
  const ctx = {}; vm.createContext(ctx); ctx.globalThis = ctx;
  vm.runInContext(fs.readFileSync(path.join(dir, 'tk-lib.js'), 'utf8'), ctx, { filename: 'tk-lib.js' });
  vm.runInContext(fs.readFileSync(modPath, 'utf8'), ctx, { filename: path.basename(modPath) });
  const M = ctx.TK_MODULE, TK = ctx.TK;
  if (!M) throw new Error('الملف لا يستدعي TK.module(...)');
  ['id', 'level', 'num', 'title', 'en', 'emoji', 'lead', 'slug', 'homework', 'next'].forEach(k => { if (!M[k]) err('حقل ناقص: ' + k); });
  if (!Array.isArray(M.agenda) || M.agenda.length < 3) err('agenda يجب أن يحتوي 3 عناصر على الأقل');
  if (!Array.isArray(M.slides) || M.slides.length < 10) err('slides: يلزم 10 شرائح على الأقل (الحالي ' + (M.slides || []).length + ')');
  if ((M.slides || []).length > 30) warn('عدد الشرائح كبير: ' + M.slides.length);
  if (!Array.isArray(M.quiz) || M.quiz.length !== 10) err('quiz: يجب أن يكون 10 أسئلة بالضبط');
  (M.quiz || []).forEach((q, i) => { if (!q.q || !q.ok || !Array.isArray(q.no) || q.no.length !== 3 || !q.why) err('سؤال ' + (i + 1) + ': يلزم q, ok, no[3], why'); if (q.no && q.no.indexOf(q.ok) > -1) err('سؤال ' + (i + 1) + ': الإجابة الصحيحة مكرّرة ضمن no'); });
  if (!Array.isArray(M.audit) || M.audit.length < 5) err('audit: 5 عناصر على الأقل');
  if (!Array.isArray(M.resources) || M.resources.length < 3) err('resources: 3 روابط على الأقل');
  if (!Array.isArray(M.recap) || M.recap.length < 3) err('recap: 3 نقاط على الأقل');
  const cnt = k => TK.reg.filter(r => r.k === k).length;
  const labs = cnt('lab') + cnt('shell'), chs = cnt('challenge');
  const anims = ['steps', 'terminal', 'scan', 'transform', 'compare', 'cards', 'scenario', 'classify'].reduce((a, k) => a + cnt(k), 0);
  const motion = ['steps', 'terminal', 'scan', 'transform'].reduce((a, k) => a + cnt(k), 0);
  if (labs < 3) err('مختبرات عملية (lab/shell) أقل من 3: ' + labs);
  if (chs < 3) err('تحديات (challenge) أقل من 3: ' + chs);
  const checks = cnt('check');
  if (checks < 3) err('تحقّق سريع (TK.check) أقل من 3 — ضع واحداً بعد كل موضوع رئيسي لتنشيط الطالب: ' + checks);
  if (motion < 2) err('يلزم رسمان متحرّكان على الأقل (steps/terminal/scan/transform): ' + motion);

  // تحقق من إعدادات المكوّنات (يمنع أخطاء وقت التشغيل)
  const okRe = (r, where) => { try { new RegExp(r, 'i'); } catch (e) { err(where + ': تعبير نمطي غير صالح ' + r); } };
  TK.reg.forEach((c, n) => {
    const w = c.k + '#' + (n + 1);
    if (c.k === 'steps') { if (!c.steps || c.steps.length < 3) err(w + ': يلزم 3 خطوات على الأقل'); (c.steps || []).forEach((s, i) => { if (!s.cap) err(w + ' خطوة ' + (i + 1) + ': cap ناقص'); if (['a', 'b', 'mid'].indexOf(s.at) < 0 && typeof s.at !== 'number') err(w + ' خطوة ' + (i + 1) + ': at يجب a|mid|b'); }); }
    if (c.k === 'shell') { if (!c.fs || typeof c.fs !== 'object') err(w + ': fs ناقص'); (c.tasks || []).forEach((t, i) => { if (!t.d || !t.re) err(w + ' مهمة ' + (i + 1) + ': d/re'); else okRe(t.re, w); }); (c.cmds || []).forEach(t => { okRe(t.re, w); if (typeof t.out !== 'string') err(w + ': cmd.out'); }); if (!(c.tasks || []).length) warn(w + ': بدون مهام'); }
    if (c.k === 'challenge') { if (!c.re && !(c.answer || []).filter(Boolean).length) err(w + ': لا إجابة'); if (c.re) okRe(c.re, w); }
    if (c.k === 'classify') { if (!c.buckets || c.buckets.length < 2) err(w + ': صندوقان على الأقل'); if (!c.items || c.items.length < 4) err(w + ': 4 عناصر على الأقل'); (c.items || []).forEach(i => { if (typeof i.b !== 'number' || i.b >= c.buckets.length) err(w + ': b خارج النطاق'); }); }
    if (c.k === 'scenario') { (c.steps || []).forEach((s, i) => { if (!s.o || s.o.length < 2 || !s.o.some(x => x.ok)) err(w + ' موقف ' + (i + 1) + ': خيارات/ok'); (s.o || []).forEach(x => { if (!x.fb) err(w + ': fb ناقص'); }); }); }
    if (c.k === 'scan') { if (!c.cells || c.cells.length < 4) err(w + ': 4 خلايا على الأقل'); (c.cells || []).forEach(x => { if (['open', 'closed', 'filtered', 'ok', 'bad'].indexOf(x.s) < 0) err(w + ': s غير معروف ' + x.s); }); }
    if (c.k === 'terminal') { (c.lines || []).forEach(l => { if (['cmd', 'out', 'ok', 'bad', 'dim', 'hl'].indexOf(l[0]) < 0 || typeof l[1] !== 'string') err(w + ': سطر غير صالح'); }); if ((c.lines || []).length < 3) err(w + ': 3 أسطر على الأقل'); }
    if (c.k === 'check') { if (!c.s) err(w + ': يلزم s (نص العبارة)'); if (typeof c.t !== 'boolean') err(w + ': يلزم t (true/false)'); }
    if (c.k === 'lab' && c.n < 3) err(w + ': 3 خطوات على الأقل');
    if (c.k === 'live' && ['hash', 'entropy', 'caesar', 'convert'].indexOf(c.name) < 0) err(w + ': اسم أداة غير معروف');
    if (c.k === 'transform' && c.fn === 'none' && !c.output) err(w + ': output ناقص (أو استخدم fn:"sha256")');
  });
  const concepts = TK._concepts || 0;
  if (concepts < 1) err('يلزم TK.concept واحد على الأقل (مفهوم سريع)');
  if (concepts > 3) warn('نظرية زائدة: ' + concepts + ' شرائح مفهوم (الحد الأقصى 3)');
  const ids = new Set(); TK.reg.forEach(c => { if (ids.has(c.id)) err('معرّف مكرر ' + c.id); ids.add(c.id); });
  // توازن الوسوم
  (M.slides || []).forEach((h, i) => {
    [['div'], ['ul'], ['table'], ['dl'], ['p'], ['span'], ['b'], ['li'], ['button']].forEach(([t]) => {
      const o = (h.match(new RegExp('<' + t + '(\\s|>)', 'g')) || []).length, c = (h.match(new RegExp('</' + t + '>', 'g')) || []).length;
      if (o !== c) err('شريحة ' + (i + 1) + ': عدم توازن <' + t + '> (' + o + ' فتح / ' + c + ' إغلاق)');
    });
    if (typeof h !== 'string') err('شريحة ' + (i + 1) + ' ليست نصاً');
  });
  // ملاحظات لغوية
  const all = JSON.stringify(M.slides) + JSON.stringify(M.quiz);
  if (/\bgenuinely\b|\bhonestly\b/i.test(all)) warn('كلمات إنجليزية زائدة');
  if (/\\\\'/.test(fs.readFileSync(modPath, 'utf8'))) warn('وُجد \\\' في الملف — تحقق من الاقتباسات');
  res.meta = { id: M.id, level: M.level, num: M.num, title: M.title, slug: M.slug, slides: (M.slides || []).length + 6, labs, challenges: chs, anims, motion };
  res.gift = TK.gift(M);
} catch (e) { err('خطأ تنفيذ: ' + e.message); }
process.stdout.write(JSON.stringify(res));
