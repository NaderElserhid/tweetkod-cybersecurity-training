/* المستوى الأول — الوحدة 8: أمن الويب والتصفح — اكشف الموقع المزيّف بنفسك */
TK.module({
  id: 'L1-08', level: 1, num: 8, slug: 'أمن-الويب-والتصفح',
  title: 'أمن الويب والتصفح: اكشف الموقع المزيّف بنفسك', en: 'Web Safety & Spotting Fake Sites', emoji: '🌐',
  lead: 'في هذه الوحدة ستفتح أدوات متصفحك الحقيقية: تفحص شهادة موقع، وتراقب الطلبات والكوكيز في أدوات المطوّر (DevTools)، وتحقق في موقعين (أحدهما متجر مزيّف) باستخدام whois وnslookup وcurl. النظرية 11 دقيقة فقط، والباقي تطبيق بيدك.',
  tags: ['🛠️ شهادة الموقع', '🛠️ DevTools (F12)', '🛠️ whois / nslookup / curl', '🌐 VirusTotal', '🌐 crt.sh'],
  agenda: [
    { t: '💡 القفل والشهادة: ماذا يعنيان؟ (مفهوم سريع + حركة HTTPS)', time: '8 د' },
    { t: '🧪 مختبر ١: افحص شهادة موقع حقيقي + تحدي الشهادة', time: '14 د' },
    { t: '🔗 قراءة الرابط والنطاقات المتشابهة + تحديات', time: '14 د' },
    { t: '☕ استراحة', time: '10 د' },
    { t: '🧪 مختبر ٢: «فاحص النطاق» (DNS, whois, curl) + 3 تحديات', time: '16 د' },
    { t: '🍪 الكوكيز وDevTools: Network وApplication وElements', time: '18 د' },
    { t: '🧩 الإضافات، إعدادات الحماية، متجر مزيّف، سيناريو', time: '10 د' }
  ],
  slides: [
    TK.concept({
      t: 'القفل الأخضر لا يعني «موقع موثوق»', en: 'The padlock is not a trust badge', min: '4 د',
      body: '<p>الرابط الذي يبدأ بـ <span class="code">https://</span> بدل <span class="code">http://</span> يعني أن الموقع يستخدم بروتوكول HTTPS: طريقة تبادل بيانات مشفّرة بين متصفحك والموقع، بحيث يتحوّل كل ما ترسله (مثل كلمات المرور) إلى شكل غير مفهوم لأي شخص آخر يتنصّت في الطريق، كموجود على نفس شبكة Wi-Fi عامة. القفل 🔒 بجانب الرابط هو العلامة التي يضعها المتصفح ليخبرك أن هذا التشفير يعمل الآن.</p>' +
        '<p>عندما ترى القفل 🔒 بجانب الرابط فهذا يعني شيئين فقط: <b>الاتصال مشفّر</b> بين متصفحك والموقع، و<b>اسم النطاق</b> (Domain — عنوان الموقع الذي تكتبه، مثل <span class="code">google.com</span>) مطابق لـ<b>شهادة</b> رقمية (Certificate — ملف إلكتروني يشبه بطاقة هوية الموقع) صادرة من <b>جهة مصدِّقة</b> (Certificate Authority أو CA — شركة متخصصة تتحقق من هوية صاحب الموقع قبل أن تصدر له الشهادة) يثق بها متصفحك.</p>' +
        '<p>لكنه <b>لا يعني</b> أن صاحب الموقع أمين. أي شخص يشتري نطاقاً يستطيع الحصول على شهادة (توجد جهات تصدرها مجاناً)، فللمتجر المزيّف قفل أيضاً!</p>' +
        '<div class="grid g2 mt"><div class="card"><b>✅ القفل يضمن</b><br>أن أحداً في الطريق (مثل شبكة Wi-Fi عامة) لا يقرأ ما ترسله.</div><div class="card"><b>❌ القفل لا يضمن</b><br>أن النطاق الذي تزوره هو النطاق الذي تظنه، ولا أن المتجر سيرسل لك البضاعة.</div></div>' +
        TK.check({ s: 'أي شخص يستطيع شراء نطاق والحصول على شهادة HTTPS، حتى لو كان متجراً مزيّفاً.', t: true, why: 'توجد جهات تصدر شهادات مجانية لأي نطاق، فالقفل وحده لا يثبت أمانة صاحب الموقع.' }),
      key: 'القفل يحمي الطريق، أما الحكم على الموقع فمهمتك أنت: النطاق، العمر، الشهادة، العلامات المريبة.'
    }),
    TK.s('🎬 مصافحة HTTPS: ماذا يحدث قبل ظهور القفل؟', 'Animated: the HTTPS handshake',
      '<p class="lead">اضغط «الخطوة التالية» وتابع الحوار بين المتصفح والخادم في أجزاء من الثانية.</p>' +
      TK.steps({
        a: { e: '👩‍💻', l: 'متصفحك' }, b: { e: '🖥️', l: 'خادم الموقع' },
        steps: [
          { icon: '', at: 'mid', cap: 'كتبتَ https://www.sahab-store.example وضغطتَ Enter. المتصفح لم يرسل أي شيء حساس بعد.' },
          { icon: '👋', at: 'b', cap: '١) ClientHello (أول رسالة في المصافحة): المتصفح يقول للخادم: «أريد اتصالاً مشفّراً، هذه طرق التشفير التي أفهمها».', ba: 'يطلب اتصالاً آمناً', bb: 'يستقبل الطلب' },
          { icon: '📜', at: 'a', cap: '٢) الخادم يردّ بـ <b>شهادته</b> (Certificate) ومفتاحه العام (Public Key — رمز رياضي يستخدمه الخادم ليثبت هويته، ولا ضرر من معرفة أي شخص به): «هذا اسمي، وهذه الجهة التي وقّعت لي».', ba: 'استلم الشهادة', bb: 'أرسل شهادته' },
          { icon: '🔍', at: 'mid', cap: '٣) المتصفح يفحص الشهادة: هل أصدرتها جهة موثوقة؟ هل اسم النطاق موجود في خانة SAN (اختصار Subject Alternative Name، أي قائمة النطاقات التي تغطيها الشهادة)؟ هل ما زالت صالحة (لم تنتهِ)؟' },
          { icon: '🔑', at: 'b', cap: '٤) إن نجح الفحص يتفق الطرفان على <b>مفتاح جلسة سري</b> لا يعرفه أحد غيرهما.', ba: 'الفحص ناجح ✓', bb: 'اتفقا على المفتاح' },
          { icon: '🔒', at: 'a', cap: '٥) يظهر القفل، وكل ما تتبادله بعد الآن (كلمات المرور، الكوكيز) يصير مشفّراً أثناء الطريق.', flash: 'ok', ba: 'اتصال مشفّر' },
          { icon: '⚠️', at: 'mid', cap: 'وإن فشل أي فحص (شهادة منتهية أو اسم لا يطابق) يعرض المتصفح صفحة تحذير حمراء. لا تضغط «متابعة على أي حال».', flash: 'bad' }
        ]
      }) +
      TK.check({ s: 'عندما يحذّر المتصفح بصفحة حمراء بسبب شهادة غير صالحة، الأفضل الضغط على «متابعة على أي حال» لإكمال التصفح بسرعة.', t: false, why: 'تحذير الشهادة يعني فشل فحص مهم (اسم لا يطابق أو شهادة منتهية)، والصحيح هو التوقف وعدم إدخال أي بيانات.' })),
    TK.s('🧪 مختبر ١: افحص شهادة موقع حقيقي', 'Lab 1 — inspect a real certificate in your browser',
      '<p class="lead">ستقرأ الآن «بطاقة الهوية» لموقع حقيقي بنفسك، وهذه المهارة تكشف لك هل الاسم والجهة المصدِّقة والمدة مقبولة.</p>' +
      TK.lab({
        t: 'اقرأ شهادة موقع من متصفحك', time: '8 د', req: 'متصفح Chrome أو Edge أو Firefox على الحاسوب.',
        steps: [
          'افتح <code>https://www.wikipedia.org</code> في تبويب جديد.',
          'اضغط على الأيقونة <b>يسار الرابط</b> (قفل أو أيقونة إعدادات)، ثم «الاتصال آمن» (Connection is secure).',
          'اختر «الشهادة صالحة» (Certificate is valid) في Chrome وEdge، أو «مزيد من المعلومات ← عرض الشهادة» في Firefox.',
          'دوّن: <b>Issued to</b> (اسم النطاق)، و<b>Issued by</b> (الجهة المصدِّقة)، و<b>Valid from / to</b> (مدة الصلاحية).',
          'افتح التبويب Details (أو «التفاصيل») وابحث عن <b>Subject Alternative Name</b>: هذه قائمة النطاقات التي تغطيها الشهادة.',
          'كرّر الفحص على موقع آخر تعرفه (مثل موقع مدرستك) وقارن الجهة المصدِّقة والمدة.'
        ],
        tip: 'إن كان اسم النطاق الذي في شريط العنوان غير موجود في خانة SAN فالمتصفح نفسه سيمنعك بتحذير.',
        warn: 'افحص مواقع تعرفها فقط. لا تفتح روابط مشبوهة من الرسائل لتدريب نفسك.'
      })),
    TK.s('🏁 تحدي: اقرأ الشهادة', 'Challenge — read the certificate dump',
      '<p class="lead">هذه شهادة تدريبية (وهمية) لمتجر <span class="code">sahab-store.example</span> كما تظهر في تفاصيل المتصفح. اقرأها وأجب.</p>' +
      TK.code(
        'Certificate:\n' +
        '  Subject:        CN=www.sahab-store.example\n' +
        '  Issuer:         C=XX, O=Falconsign, CN=Falconsign TLS CA 1\n' +
        '  Validity:\n' +
        '    Not Before:   2026-10-14 00:00:00 UTC\n' +
        '    Not After:    2027-01-12 23:59:59 UTC\n' +
        '  Subject Alternative Name:\n' +
        '    DNS:www.sahab-store.example\n' +
        '    DNS:sahab-store.example\n' +
        '    DNS:pay.sahab-store.example\n' +
        '  Signature Algorithm: sha256WithRSAEncryption\n' +
        '  SHA-256 Fingerprint: E2:D3:D1:E9:86:11:D1:4E:A4:71:2C:B5:F1:4E:0E:97') +
      TK.challenge({ t: 'من أصدرها؟', q: 'ما اسم المنظمة المصدِّرة (حقل <b>O=</b> داخل Issuer)؟', answer: ['Falconsign'], hint: 'ابحث عن السطر Issuer.', explain: 'الجهة المصدِّقة (CA) هي التي وقّعت على الشهادة، والمتصفح يثق بها مسبقاً.', ph: 'اسم واحد' }) +
      TK.challenge({ t: 'متى تنتهي؟', q: 'في أي <b>سنة</b> تنتهي صلاحية الشهادة (Not After)؟', answer: ['2027'], hint: 'السطر Not After.', explain: 'الشهادة المنتهية تجعل المتصفح يعرض تحذيراً. الشهادة الحديثة وحدها لا تثبت أن الموقع أمين.', ph: 'سنة من 4 أرقام' }) +
      TK.challenge({ t: 'كم نطاقاً؟', q: 'كم نطاقاً تغطيه هذه الشهادة في خانة Subject Alternative Name؟', answer: ['3'], hint: 'عُدّ أسطر DNS:', explain: 'ثلاثة نطاقات. لو زرت sahab-store-offers.example فلن يجد المتصفح اسمه في الخانة، وسيحذّرك.', ph: 'رقم' }) +
      TK.challenge({ t: 'هل تصلح؟', q: 'هل تصلح هذه الشهادة لموقع اسمه <span class="code">sahab-store-offers.example</span>؟ اكتب yes أو no', answer: ['no', 'لا'], hint: 'هل الاسم موجود في SAN؟', explain: 'لا. الشهادة تُصدَر لأسماء محددة، ولا يمكن لمحتال أن يستخدم شهادة غيره.', ph: 'yes / no' })),
    TK.s('🔗 اقرأ الرابط من اليمين إلى اليسار', 'Anatomy of a URL — find the real domain',
      '<p class="lead">أخطر خدعة هي رابط يبدأ باسم متجر معروف لكن النطاق الحقيقي شيء آخر. القاعدة: ابحث عن أول علامة <span class="code">/</span> منفردة بعد <span class="code">https://</span>، وانظر إلى الجزأين الأخيرين قبلها.</p>' +
      TK.code('https://login.mybank.com.secure-verify.example/account?id=7\n' +
        '\\_____/ \\_________________/ \\_____________/ \\_______/ \\____/\n' +
        'scheme    subdomain (يتغير)    DOMAIN الحقيقي  TLD      path') +
      TK.cards({ cols: 3, items: [
        { e: '🏷️', t: 'النطاق الأساسي', b: 'الاسم + النهاية قبل أول / مثل <code>secure-verify.example</code>. هو مالك الموقع الحقيقي، وكل ما قبله أسماء فرعية يختارها صاحب النطاق كما يشاء.' },
        { e: '🪤', t: 'خدعة @', b: 'في <code>https://a.example@b.example/</code> ما قبل @ مجرد اسم مستخدم، والموقع الفعلي هو ما بعد @ (b.example).' },
        { e: '🔤', t: 'TLD مختلف', b: '<code>.com</code> و<code>.co</code> و<code>.shop</code> نطاقات مختلفة تماماً. الاسم نفسه مع نهاية أخرى = مالك آخر.' }
      ] }) +
      TK.challenge({ t: 'النطاق الحقيقي', q: 'ما النطاق الأساسي (الاسم + النهاية) في الرابط <span class="code" dir="ltr">https://login.mybank.com.secure-verify.example/account</span> ؟', answer: ['secure-verify.example'], hint: 'اقرأ من اليمين حتى أول / منفردة.', explain: 'الاسم mybank.com مجرد جزء فرعي (Subdomain) داخل نطاق المحتال secure-verify.example.', ph: 'domain.tld' }) +
      TK.challenge({ t: 'خدعة @', q: 'ما الموقع الذي سيفتحه المتصفح فعلاً في الرابط <span class="code" dir="ltr">https://sahab-store.example@pay-secure-sahab.example/login</span> ؟', answer: ['pay-secure-sahab.example'], hint: 'ما بعد علامة @ هو الخادم الحقيقي.', explain: 'ما قبل @ يُعدّ بيانات مستخدم فقط. المحتال يضع اسم متجر مألوف أولاً ليخدعك.', ph: 'domain.tld' })),
    TK.s('🎬 النطاق المتشابه: الفرق حرف واحد', 'Animated: typosquatting up close',
      '<p class="lead">بدّل بين الزرين وتأمّل: هل تلاحظ الفرق لو لم يُخبرك أحد؟ المحتالون يعتمدون على سرعة قراءتك. تسمى هذه الخدعة <b>Typosquatting</b> (تسجيل نطاق بخطأ إملائي مقصود): شراء اسم يشبه نطاقاً مشهوراً بفارق حرف أو حرفين، على أمل أن تقرأه بسرعة ولا تلاحظ الفرق.</p>' +
      TK.compare({
        a: { t: '✅ النطاق الحقيقي', html: '<div class="tc"><div class="code" dir="ltr" style="font-size:1.6em">microsoft.com</div><p class="sm muted">حرف <b>m</b> واحد في بداية الاسم.</p></div>' },
        b: { t: '🚨 النطاق المزيّف', bad: true, html: '<div class="tc"><div class="code" dir="ltr" style="font-size:1.6em"><span style="color:var(--bad)">rn</span>icrosoft.com</div><p class="sm muted">الحرفان <b>r</b> و<b>n</b> متجاورين يشبهان حرف <b>m</b> في خطوط كثيرة!</p></div>' }
      }) +
      TK.table(['نوع الخدعة', 'مثال', 'كيف تكشفها'], [
        ['حرفان بدل حرف', '<span dir="ltr">rnicrosoft.com</span>', 'كبّر الرابط، أو اقرأه حرفاً حرفاً'],
        ['رقم بدل حرف', '<span dir="ltr">paypa1.com</span>', 'الرقم 1 بدل l (ل)'],
        ['حرف زائد أو ناقص', '<span dir="ltr">gooogle.com</span>', 'عدّ الحروف المتكررة'],
        ['أبجدية أخرى (Homograph — حرف من أبجدية مختلفة يشبه شكلاً حرفاً لاتينياً)', '<span dir="ltr">аpple.com</span>', 'الحرف الأول سيريلي لا لاتيني؛ تظهر في بعض المتصفحات بصيغة <span dir="ltr">xn--pple-43d.com</span>'],
        ['كلمات إضافية', '<span dir="ltr">apple-support-login.example</span>', 'الشركات الكبرى تستعمل نطاقاً واحداً معروفاً، فاحذر الكلمات الإضافية'],
      ]) +
      TK.challenge({ t: 'الحرفان المخادعان', q: 'ما الحرفان اللذان يشبهان حرف <b>m</b> في النطاق <span class="code" dir="ltr">rnicrosoft.com</span> ؟', answer: ['rn'], hint: 'انظر إلى بداية الاسم.', explain: 'rn تتجاور فتشبه m. استعمل مدير كلمات المرور: لن يملأ بياناتك في نطاق مختلف.', ph: 'حرفان' }) +
      TK.challenge({ t: 'أين الحرف المزيّف؟', q: 'في النطاق <span class="code" dir="ltr">goog1e.com</span> ما <b>ترتيب</b> الرمز المزيّف من اليسار (الأول = 1)؟', answer: ['5'], hint: 'g=1, o=2, ...', explain: 'الرقم 1 في الموضع الخامس يحلّ محل الحرف l.', ph: 'رقم' })),
    TK.s('🃏 صنّف: نطاق رسمي أم مزيّف؟', 'Classify — real domain or lookalike',
      '<p class="lead">اضغط النطاق ثم الصندوق. أغلب النطاقات الحقيقية هنا معروفة، فلا تتسرّع: ابحث عن الفخ في كل واحد.</p>' +
      TK.classify({
        buckets: [{ t: 'نطاق رسمي', e: '✅' }, { t: 'نطاق مزيّف', e: '🚨' }],
        items: [
          { t: 'accounts.google.com', b: 0, why: 'النطاق الأساسي google.com، وaccounts مجرد جزء فرعي.' },
          { t: 'login.microsoftonline.com', b: 0, why: 'النطاق الأساسي microsoftonline.com يخص مايكروسوفت لتسجيل الدخول.' },
          { t: 'steamcommunity.com', b: 0, why: 'نطاق مجتمع Steam الرسمي.' },
          { t: 'rnicrosoft.com', b: 1, why: 'rn تقلّد m.' },
          { t: 'paypa1.com', b: 1, why: 'الرقم 1 بدل الحرف l.' },
          { t: 'google.com.account-check.example', b: 1, why: 'النطاق الأساسي هو account-check.example وليس google.com.' },
          { t: 'steamcommunnity.com', b: 1, why: 'حرف n زائد في كلمة community.' },
          { t: 'apple-id.verify-now.example', b: 1, why: 'النطاق الأساسي verify-now.example.' },
          { t: 'github.com', b: 0, why: 'النطاق الرسمي لمنصة GitHub.' }
        ]
      })),
    TK.breakSlide('الجزء القادم: DNS واختطافه، ثم مختبر «فاحص النطاق» الذي تقارن به متجراً حقيقياً بمتجر مزيّف، ثم الكوكيز وأدوات المطوّر.'),
    TK.s('🎬 DNS: دفتر هواتف الإنترنت... وماذا لو زُوِّر؟', 'Animated: normal DNS vs DNS hijacking (pharming)',
      '<p class="lead">جهازك لا يفهم الأسماء، بل يحتاج عنوان IP (رقماً مثل 198.51.100.20) للاتصال بأي خادم. <b>DNS</b> (نظام أسماء النطاقات، Domain Name System) هو الخدمة التي تحوّل الاسم الذي تكتبه إلى عنوان IP، تماماً كدفتر هاتف يحوّل اسم شخص إلى رقم هاتفه. اضغط الخطوة التالية لترى مرة طبيعية ومرة مخترقة.</p>' +
      TK.steps({
        a: { e: '👩‍💻', l: 'جهازك' }, b: { e: '📖', l: 'خادم DNS' },
        steps: [
          { icon: '', at: 'mid', cap: 'تكتب www.sahab-store.example. الجهاز لا يعرف أين هو، فيسأل DNS.' },
          { icon: '❓', at: 'b', cap: '١) جهازك يسأل خادم DNS: «ما عنوان IP لهذا الاسم؟»', ba: 'يسأل', bb: 'يبحث في سجلاته' },
          { icon: '✅', at: 'a', cap: '٢) الحالة الطبيعية: الخادم يردّ <b>198.51.100.20</b> وهو الخادم الحقيقي للمتجر.', flash: 'ok', ba: 'يتصل بالعنوان الصحيح' },
          { icon: '☠️', at: 'mid', cap: '٣) الهجوم: راوتر مخترق أو إعدادات DNS غُيّرت خفية بوساطة برنامج خبيث أو شبكة Wi-Fi مزيّفة. هذا هو <b>DNS Hijacking</b>.' },
          { icon: '❓', at: 'b', cap: '٤) تكتب الرابط الصحيح نفسه. السؤال نفسه يصل الآن إلى خادم DNS يتحكم فيه المهاجم.', ba: 'نفس الرابط الصحيح', bb: 'خادم المحتال' },
          { icon: '🎭', at: 'a', cap: '٥) يردّ <b>203.0.113.45</b>: خادم المحتال. الرابط صحيح 100% لكن الموقع مزيّف. تسمى هذه الحيلة <b>Pharming</b> (مزيج من Phishing وFarming): تحويلك إلى موقع مزيّف عبر تزوير DNS، لا عبر رابط مكتوب خطأ.', flash: 'bad', ba: 'يفتح موقعاً مزيّفاً!' },
          { icon: '🛡️', at: 'mid', cap: '٦) ما ينقذك: المتصفح يحذّرك لأن الشهادة لا تطابق الاسم، ومدير كلمات المرور لا يعرض حسابك، وتغيير DNS في الراوتر يُكتشف بفحص إعداداته.', flash: 'ok' }
        ]
      }) +
      TK.compare({
        a: { t: '🪞 Typosquatting', html: '<p><b>العنوان مختلف قليلاً</b> (rnicrosoft). عيناك والمتصفح يكشفانه: اقرأ الرابط بتمهّل.</p>' },
        b: { t: '☠️ Pharming', bad: true, html: '<p><b>العنوان صحيح تماماً</b> لكن DNS زوّر الوجهة. لا تكفي عيناك: اعتمد على <b>تحذير الشهادة</b> و<b>مدير كلمات المرور</b> وإعدادات الراوتر.</p>' }
      }) +
      TK.check({ s: 'تحذير الشهادة في المتصفح قد يكشف هجوم Pharming حتى لو كان الرابط المكتوب صحيحاً تماماً.', t: true, why: 'في Pharming الشهادة لا تطابق الخادم المزيّف فيحذّر المتصفح، وهذا أحد الأدلة التي تنقذك حتى مع رابط مكتوب بلا أخطاء.' })),
    TK.s('🧪 مختبر ٢: «فاحص النطاق» — متجر حقيقي أم مزيّف؟', 'Lab 2 — the domain inspector: whois, nslookup, curl -I',
      '<div class="card"><b>السيناريو:</b> رأيت إعلاناً لسماعات بسعر 10% من سعرها على <span class="code">sahab-store-offers.example</span>. المتجر الحقيقي المعروف هو <span class="code">sahab-store.example</span>.' +
        '<p>ستقارن بينهما بثلاث أدوات نصية (Command-line Tools — برامج تكتب لها أمراً بالكتابة بدل الضغط على أزرار) يستخدمها محلل الأمن للتحقيق في أي موقع بسرعة:</p>' +
        '<ul class="clean">' +
        '<li><b><code>whois domain</code></b>: يسأل سجل النطاقات العالمي «من سجّل هذا الاسم؟ ومتى؟». 🍎 macOS/Linux: الأمر <code>whois</code> موجود جاهزاً في الطرفية. 🪟 Windows: لا يوجد أمر whois مدمج في PowerShell، فاستخدم أداة ويب بحث WHOIS (مثل ICANN Lookup في قائمة الأدوات لاحقاً) بدل الطرفية.</li>' +
        '<li><b><code>nslookup domain</code></b>: يسأل «إلى أي عنوان IP يشير هذا الاسم؟». 🪟 Windows: نفس الأمر <code>nslookup</code> مدمج أصلاً، أو يمكنك استخدام الأمر الأحدث <code>Resolve-DnsName domain</code> في PowerShell. 🍎 macOS/Linux: نفس الأمر <code>nslookup</code>.</li>' +
        '<li><b><code>curl -I url</code></b>: يرسل طلباً للخادم ويعرض ترويسات الرد (Headers) فقط، مثل رمز الحالة ووجهة أي تحويل. 🍎 macOS/Linux: الأمر جاهز باسمه. 🪟 Windows (PowerShell): استخدم <code>Invoke-WebRequest -Method Head url</code> بدلاً منه.</li>' +
        '</ul>' +
        '<p>تاريخ اليوم في المختبر: <b>2026-10-15</b>.</p></div>' +
      TK.shell({
        title: 'student@lab: ~ (فاحص النطاق — مخرجات تدريبية)', user: 'student', host: 'lab', cwd: '/home/student',
        motd: 'تاريخ اليوم في المختبر: 2026-10-15 · النطاقات: sahab-store.example و sahab-store-offers.example · اكتب help لمزيد.',
        fs: { home: { student: {
          'ad.txt': 'إعلان ظهر في تطبيق تواصل:\n"سماعات لاسلكية بسعر 10% فقط! العرض ينتهي خلال ساعة!"\nالرابط: sahab-store-offers.example\nالدفع: بطاقات هدايا أو تحويل فقط.',
          'case.txt': 'ملف التحقيق\n1) قارن whois للنطاقين\n2) قارن nslookup\n3) قارن curl -I\nالمطلوب: هل المتجر المعروض في الإعلان آمن؟'
        } } },
        tasks: [
          { d: 'اقرأ نص الإعلان: <code>cat ad.txt</code>', re: '^cat\\s+.*ad\\.txt' },
          { d: 'من سجّل المتجر الحقيقي ومتى؟ <code>whois sahab-store.example</code>', re: '^whois\\s+sahab-store\\.example\\s*$' },
          { d: 'وماذا عن المتجر المعروض في الإعلان؟ <code>whois sahab-store-offers.example</code>', re: '^whois\\s+sahab-store-offers\\.example\\s*$' },
          { d: 'أين يشير المتجر المزيّف؟ <code>nslookup sahab-store-offers.example</code>', re: '^nslookup\\s+sahab-store-offers\\.example\\s*$' },
          { d: 'ماذا يرد الخادم؟ <code>curl -I https://sahab-store-offers.example</code>', re: '^curl\\s+(-[A-Za-z]+\\s+)*(https?://)?sahab-store-offers\\.example/?\\s*$' },
          { d: 'قارن مع المتجر الحقيقي: <code>curl -I https://sahab-store.example</code>', re: '^curl\\s+(-[A-Za-z]+\\s+)*(https?://)?sahab-store\\.example/?\\s*$' }
        ],
        cmds: [
          { re: '^whois\\s+sahab-store\\.example\\s*$', cls: 'ok', out:
            'Domain Name: SAHAB-STORE.EXAMPLE\nRegistry Domain ID: D1042250-EX\nRegistrar: Nile Registrar Ltd\nCreation Date: 2015-06-02T08:15:30Z\nUpdated Date: 2026-05-20T11:02:09Z\nRegistry Expiry Date: 2027-06-02T08:15:30Z\nRegistrant Organization: Sahab Store LLC\nName Server: NS1.NILE-DNS.EXAMPLE\nName Server: NS2.NILE-DNS.EXAMPLE\nDNSSEC: signedDelegation' },
          { re: '^whois\\s+sahab-store-offers\\.example\\s*$', cls: 'bad', out:
            'Domain Name: SAHAB-STORE-OFFERS.EXAMPLE\nRegistry Domain ID: D9930017-EX\nRegistrar: QuickReg Offshore Ltd\nCreation Date: 2026-10-09T02:41:10Z\nUpdated Date: 2026-10-09T02:41:10Z\nRegistry Expiry Date: 2027-10-09T02:41:10Z\nRegistrant Organization: REDACTED FOR PRIVACY\nName Server: NS1.CHEAP-HOST.EXAMPLE\nDNSSEC: unsigned' },
          { re: '^nslookup\\s+sahab-store\\.example\\s*$', cls: 'ok', out:
            'Server:\t\t192.168.1.1\nAddress:\t192.168.1.1#53\n\nNon-authoritative answer:\nName:\tsahab-store.example\nAddress: 198.51.100.20' },
          { re: '^nslookup\\s+sahab-store-offers\\.example\\s*$', cls: 'bad', out:
            'Server:\t\t192.168.1.1\nAddress:\t192.168.1.1#53\n\nNon-authoritative answer:\nName:\tsahab-store-offers.example\nAddress: 203.0.113.45' },
          { re: '^curl\\s+(-[A-Za-z]+\\s+)*http://sahab-store\\.example/?\\s*$', cls: 'ok', out:
            'HTTP/1.1 301 Moved Permanently\nServer: nginx\nLocation: https://sahab-store.example/\nContent-Length: 0' },
          { re: '^curl\\s+(-[A-Za-z]+\\s+)*(https?://)?sahab-store\\.example/?\\s*$', cls: 'ok', out:
            'HTTP/2 200\nserver: nginx\ncontent-type: text/html; charset=utf-8\nstrict-transport-security: max-age=31536000; includeSubDomains\nx-content-type-options: nosniff\nset-cookie: sid=a91f3c; Secure; HttpOnly; SameSite=Lax' },
          { re: '^curl\\s+(-[A-Za-z]+\\s+)*(https?://)?sahab-store-offers\\.example/?\\s*$', cls: 'bad', out:
            'HTTP/1.1 302 Found\nServer: Apache\nLocation: http://pay-secure-sahab.example/checkout?item=1\nContent-Length: 0\n(لا يوجد strict-transport-security، ويحوّلك إلى نطاق آخر عبر http بلا تشفير!)' },
          { re: '^(whois|nslookup|curl)\\b', cls: 'dim', out:
            'لا توجد بيانات لهذا الهدف في مختبرنا. جرّب النطاقين: sahab-store.example و sahab-store-offers.example (أو curl -I https://...).' }
        ]
      })),
    TK.s('🏁 تحدي: حقّق في المتجر المزيّف', 'Challenges — analyse the inspector results',
      '<p class="lead">استخدم مخرجات الطرفية في الشريحة السابقة. هكذا يبني المحلل قراره بالأدلة لا بالإحساس.</p>' +
      TK.challenge({ t: 'عمر النطاق', q: 'كم <b>يوماً</b> مرّ على إنشاء (Creation Date) النطاق <span class="code">sahab-store-offers.example</span> حتى اليوم 2026-10-15؟', re: '^\\s*6(\\s*(أيام|ايام|يوم|days?))?\\s*$', answer: ['6'], hint: 'من whois: Creation Date 2026-10-09.', explain: 'نطاق عمره 6 أيام مع عرض خرافي = علامة خطر قوية، بينما المتجر الحقيقي موجود منذ 2015.', ph: 'عدد الأيام' }) +
      TK.challenge({ t: 'إلى أين يحوّلك؟', q: 'إلى أي <b>نطاق</b> يحوّلك المتجر المزيّف في ترويسة Location؟', re: 'pay-secure-sahab\\.example', answer: ['pay-secure-sahab.example'], hint: 'curl -I وانظر إلى Location.', explain: 'التحويل إلى نطاق دفع غريب عبر http بلا تشفير هو أسلوب شائع لسرقة بيانات البطاقات.', ph: 'domain.tld' }) +
      TK.challenge({ t: 'عنوان IP', q: 'ما عنوان IP الذي يشير إليه المتجر المزيّف في nslookup؟', answer: ['203.0.113.45'], hint: 'nslookup sahab-store-offers.example', explain: 'عنوان مختلف تماماً عن عنوان المتجر الحقيقي 198.51.100.20: خادم آخر ومالك آخر.', ph: 'x.x.x.x' })),
    TK.concept({
      t: 'الكوكيز: بطاقة دخولك المؤقتة', en: 'Cookies and sessions', min: '5 د',
      body: '<p>الكوكي (Cookie) ملف نصي صغير جداً يحفظه متصفحك بناءً على طلب الموقع، ويستخدمه الموقع لتذكّر معلومات عنك بين الزيارات، مثل لغتك المفضّلة أو هل سجّلت الدخول من قبل. بعد أن تسجّل الدخول بكلمة المرور (ورمز التحقق) لا يطلب الموقع كلمة المرور في كل صفحة. يعطيك <b>كوكي جلسة (Session Cookie)</b>، وهو رمز سري في متصفحك يقول للموقع: «هذا هو المستخدم الذي دخل قبل قليل»، تماماً كتذكرة دخول مؤقتة تريها عند كل طلب بدل إثبات هويتك من جديد في كل مرة.</p>' +
        '<p>من يسرق هذا الكوكي يستطيع الدخول <b>دون كلمة مرور ودون رمز التحقق</b>. لذلك تضع المواقع الجيدة علامات حماية على الكوكي:</p>' +
        '<ul class="clean"><li><b>Secure</b>: لا يُرسَل إلا عبر HTTPS (الاتصال المشفّر).</li><li><b>HttpOnly</b>: لا تستطيع سكربتات الصفحة (JavaScript — كود يعمل داخل الصفحة) قراءته.</li><li><b>SameSite</b>: لا يُرسَل مع طلبات قادمة من مواقع أخرى.</li></ul>' +
        TK.check({ s: 'كوكي الجلسة لا قيمة أمنية له لأنه لا يحتوي كلمة المرور نفسها.', t: false, why: 'من يسرق كوكي الجلسة يستطيع الدخول دون كلمة مرور ودون رمز تحقق، فهو يساوي كلمة المرور في لحظة الاستخدام.' }),
      key: 'كوكي الجلسة أغلى من كلمة المرور في لحظة الاستخدام: حافظ عليه بتحديث متصفحك وتجنّب البرامج والإضافات المجهولة.'
    }),
    TK.s('🎬 كيف تُسرَق الجلسة دون كلمة مرور؟', 'Animated: session hijacking with a stolen cookie',
      TK.steps({
        a: { e: '👩‍💻', l: 'أنت' }, b: { e: '🖥️', l: 'الموقع' },
        steps: [
          { icon: '', at: 'mid', cap: 'تريد الدخول إلى حسابك على موقع لعبة أو تواصل.' },
          { icon: '🔐', at: 'b', cap: '١) ترسل كلمة المرور ورمز التحقق (2FA).', ba: 'تسجل الدخول' },
          { icon: '🍪', at: 'a', cap: '٢) الموقع يتحقق منك ويعطي متصفحك كوكي جلسة <code>sid</code> مدة محددة.', ba: 'يحمل كوكي sid', bb: 'أصدر الكوكي' },
          { icon: '🦹', at: 'mid', cap: '٣) أنت تثبّت برنامجاً أو إضافة مجهولة، فتنسخ ملفات الكوكيز من متصفحك وترسلها للمهاجم (برمجية سرقة المعلومات Infostealer).', flash: 'bad' },
          { icon: '🍪', at: 'b', cap: '٤) المهاجم يعرض الكوكي نفسه للموقع: «أنا المستخدم نفسه».', bb: 'يستقبل الكوكي' },
          { icon: '🚨', at: 'a', cap: '٥) الموقع يظنه أنت: دخول إلى حسابك <b>بلا كلمة مرور ولا رمز تحقق</b> (Session Hijacking).', flash: 'bad', ba: 'حسابك بيد غيرك' },
          { icon: '🛡️', at: 'mid', cap: '٦) الدفاع: لا تثبّت برامج وإضافات مجهولة، حدّث المتصفح، سجّل الخروج من الأجهزة الأخرى بعد الشك، وغيّر كلمة المرور فتنتهي الجلسات في كثير من المواقع.', flash: 'ok' }
        ]
      })),
    TK.s('🧪 مختبر ٣: أدوات المطوّر (F12) على موقع حقيقي', 'Lab 3 — DevTools: Network, Application (cookies), Elements',
      '<p class="lead">أدوات المطوّر (DevTools) لوحة مدمجة في كل متصفح، صُمّمت أصلاً لمبرمجي المواقع، لكنها متاحة لأي شخص بضغطة زر واحدة. هي مثل غرفة تحكم مفتوحة للجميع: ترى فيها ما يرسله متصفحك للموقع وما يرسله الموقع لك، وما يحفظه الموقع على جهازك، وكود الصفحة نفسه. هنا ترى ما يرسله الموقع وما يحفظه، وتفهم أن Inspect لا يخترق شيئاً.</p>' +
      TK.lab({
        t: 'Network + Application + Elements', time: '14 د', req: 'Chrome أو Edge (في Firefox اسم تبويب Application هو Storage).',
        steps: [
          'افتح <code>https://www.wikipedia.org</code> ثم اضغط <b>F12</b> (أو Ctrl+Shift+I) لفتح أدوات المطوّر.',
          'اختر تبويب <b>Network</b>، ثم حدّث الصفحة (F5). ستظهر قائمة الطلبات: انقر على أول طلب (النوع document) وانظر إلى Headers: <b>Request URL</b> و<b>Status Code</b>.',
          'في عمود Domain أو Scheme تحقق: هل كل الطلبات <code>https</code>؟ (طلب <code>http</code> يعني نصاً مكشوفاً أثناء الطريق).',
          'اختر تبويب <b>Application</b> ← <b>Cookies</b> ← اسم الموقع. دوّن اسم أول كوكي، وانظر إلى الأعمدة <b>HttpOnly</b> و<b>Secure</b> و<b>SameSite</b> و<b>Expires</b>.',
          'افتح <code>https://example.com</code> (صفحة عامة اتفق عليها العالم للتجارب) ثم انقر يميناً على العنوان ← <b>Inspect</b> (تفحّص): يفتح هذا كود الصفحة (HTML) في لوحة أدوات المطوّر، ويسمح لك بتعديله مؤقتاً على جهازك فقط دون أن يمسّ الخادم.',
          'في تبويب <b>Elements</b> انقر مرتين على النص «Example Domain» وغيّره إلى اسمك، ولاحظ أن الصفحة تغيّرت أمامك فقط. اضغط F5 لترى التعديل يختفي.',
          'اكتب ملاحظة بجملة: لماذا لا يستطيع Inspect تغيير ما يراه الآخرون؟'
        ],
        tools: [{ n: 'دليل Chrome DevTools', u: 'https://developer.chrome.com/docs/devtools' }],
        tip: 'تبويب Console قد يحذّرك من لصق أكواد يطلبها منك غريب: هذه خدعة «Self-XSS» (أنت من ينفّذ الكود الخبيث بيدك، لا أحد يخترق المتصفح)، وغالباً يَعِدك بمتابعين مجانيين أو رصيد لعبة ثم يسرق حسابك فعلياً.',
        warn: 'لا تشارك لقطة شاشة فيها قيم كوكيز حسابك الحقيقية مع أحد، فهي كمفتاح البيت. التعديل بـ Inspect للتعلم على صفحة بريئة فقط.'
      })),
    TK.s('🎬 Inspect Element يغيّر شاشتك أنت فقط', 'Animated: local edits are not real',
      '<p class="lead">المحتالون يرسلون لقطة شاشة «لرصيد» أو «إيصال تحويل» معدَّلة بهذه الطريقة. لذلك لقطات الشاشة ليست دليلاً على شيء.</p>' +
      TK.transform({ input: 'Balance: 50', inLabel: 'ما يحفظه الخادم', label: 'Inspect → Edit as HTML (على جهازك فقط)', gear: '🖊️', output: 'Balance: 5000000 (على شاشتك فقط)', outLabel: 'ما تراه بعد التعديل', editable: false, btn: 'عدّل الرقم من Inspect', after: 'الخادم ما زال يحتفظ بالرقم 50. أعد تحميل الصفحة فيعود الرقم الحقيقي. لا تقبل لقطة شاشة كإثبات دفع: تحقق من حسابك مباشرة.' }) +
      TK.scenario({ steps: [
        { s: 'شخص يبيع لك حساب لعبة، وأرسل «لقطة شاشة» تثبت أنه حوّل لك المبلغ خطأً وتطلب منك إرجاعه. ماذا تفعل؟', o: [
          { t: 'أرجع المبلغ فوراً لأن اللقطة واضحة', ok: false, fb: 'اللقطة يمكن تزويرها بـ Inspect في ثوانٍ. هذه خدعة التحويل الخاطئ.' },
          { t: 'أفتح تطبيق بنكي أو حسابي بنفسي وأتحقق هل وصل المبلغ فعلاً', ok: true, fb: 'التحقق من المصدر الرسمي هو الدليل الوحيد المقبول.' },
          { t: 'أرسل له بياناتي ليتحقق هو', ok: false, fb: 'لا تعطِ أحداً بيانات الدخول أبداً.' }] }
      ] })),
    TK.s('🧪 مختبر ٤: دقّق في إضافات متصفحك', 'Lab 4 — audit your browser extensions',
      '<p class="lead">الإضافة (Extension) برنامج صغير تضيفه إلى متصفحك لتوسيع وظائفه (مثل مانع الإعلانات أو قاموس فوري)، ويعمل داخل كل صفحة تفتحها. وقد يطلب صلاحية «قراءة وتغيير كل بياناتك على كل المواقع»، أي يرى كل ما تكتبه وتراه بما فيه كلمات المرور والكوكيز. إضافة خبيثة أو بيعت لمالك جديد قد تسرق كلماتك وكوكيزك. افحص إضافاتك الآن.</p>' +
      TK.lab({
        t: 'مراجعة صلاحيات الإضافات', time: '6 د', req: 'متصفحك الشخصي مع إضافة واحدة على الأقل (أو افتح الصفحة فقط إن لم تكن لديك).',
        steps: [
          'افتح الإضافات: اكتب <code>chrome://extensions</code> في Chrome أو <code>edge://extensions</code> في Edge أو <code>about:addons</code> في Firefox.',
          'اكتب في ورقة جدولاً من ثلاثة أعمدة: اسم الإضافة، هل أستخدمها؟، ما صلاحياتها.',
          'اضغط <b>Details</b> لكل إضافة وانظر إلى <b>Permissions</b> و<b>Site access</b> (الوصول إلى المواقع).',
          'إن لم تستخدم إضافة منذ شهر فاضغط <b>Remove</b>. أقل الإضافات = أقل مخاطر.',
          'للإضافات التي تحتاجها: غيّر Site access من «On all sites» إلى <b>On click</b> أو مواقع محددة إن أمكن.',
          'قبل أن تثبّت أي إضافة جديدة: افتح صفحتها الرسمية وانظر الناشر، وعدد المستخدمين، وسياسة الخصوصية. اسأل: هل أداة بسيطة (حاسبة، تغيير الألوان) تحتاج فعلاً قراءة كل بياناتي؟'
        ],
        tip: 'القاعدة: كلما كانت الوظيفة أبسط والصلاحية أكبر فاشك أكثر.',
        warn: 'لا تثبّت إضافات من رابط أرسله لك غريب أو من داخل لعبة ولا من موقع غير المتجر الرسمي للمتصفح.'
      })),
    TK.s('🏁 تحدي: اقرأ ما تراه DevTools', 'Challenge — a DevTools dump from a fake checkout page',
      '<p class="lead">طالب فتح F12 على صفحة دفع المتجر المزيّف وسجّل هذه المعلومات. أجب مما تراه.</p>' +
      TK.code(
        '# Network tab -> request details\n' +
        'Request URL:     http://pay-secure-sahab.example/checkout/submit\n' +
        'Request Method:  POST\n' +
        'Status Code:     302 Found\n' +
        'Form Data:       name=Test+User&email=test%40example.com&card=4111+0000+0000+0000\n\n' +
        '# Application tab -> Cookies -> www.sahab-store.example\n' +
        'Name         Path  Expires     HttpOnly  Secure  SameSite\n' +
        'sid          /     Session     yes       yes     Lax\n' +
        'remember_me  /     2026-11-15  no        no      None\n' +
        'lang         /     2027-10-15  no        no      Lax\n' +
        '_stats       /     2026-10-22  no        yes     Lax') +
      TK.challenge({ t: 'البروتوكول', q: 'ما بروتوكول (http أو https) الذي أُرسِل به نموذج الدفع في الطلب أعلاه؟', answer: ['http'], hint: 'ابدأ من Request URL.', explain: 'http بلا تشفير: بيانات البطاقة تسير مكشوفة وتصل لجهة مجهولة.', ph: 'http / https' }) +
      TK.challenge({ t: 'كوكي خطر', q: 'أي كوكي <b>يبدو أنه رمز دخول</b> وينقصه HttpOnly وSecure معاً؟', answer: ['remember_me'], hint: 'اسم يدل على تذكّر الدخول.', explain: 'remember_me بلا Secure وبلا HttpOnly يمكن قراءته أو إرساله عبر اتصال غير مشفّر فيسهل سرقته. (lang كوكي لغة غير حساس.)', ph: 'اسم الكوكي' }) +
      TK.challenge({ t: 'كم Secure؟', q: 'كم كوكياً في الجدول عليه علامة <b>Secure = yes</b>؟', answer: ['2'], hint: 'sid و...', explain: 'sid و_stats فقط.', ph: 'رقم' })),
    TK.s('🧪 مختبر ٥: فعّل الحماية وحوّل مدير كلمات المرور إلى حارس', 'Lab 5 — safe browsing settings + password manager as a phishing shield',
      TK.lab({
        t: 'إعدادات التصفح الآمن', time: '5 د', req: 'متصفحك الشخصي.',
        steps: [
          '<b>Chrome:</b> Settings ← Privacy and security ← Security ← اختر <b>Enhanced protection</b> (أو Standard على الأقل). <b>Edge:</b> Settings ← Privacy ← فعّل <b>Microsoft Defender SmartScreen</b>. <b>Firefox:</b> Settings ← Privacy &amp; Security ← فعّل <b>Block dangerous and deceptive content</b>.',
          'فعّل <b>Always use secure connections</b> في Chrome أو <b>HTTPS-Only Mode</b> في Firefox: يرفض الاتصال غير المشفّر.',
          'حدّث المتصفح: Settings ← About. التحديث يسدّ الثغرات التي تستغلها المواقع الخبيثة.',
          'من الإعدادات امنع المواقع من إظهار إشعارات (Notifications) إلا للمواقع التي تحتاجها فعلاً.'
        ],
        tip: 'هذه الإعدادات مجانية وتحميك حتى عندما لا تلاحظ الخطر بنفسك.'
      }) +
      TK.lab({
        t: 'مدير كلمات المرور: إن لم يملأ بياناتك فتوقّف', time: '7 د', req: 'مدير كلمات المرور في المتصفح، أو Bitwarden المجاني.',
        steps: [
          'فعّل مدير كلمات المرور واختر لحسابه حماية قوية (رمز قفل الجهاز أو كلمة مرور رئيسية قوية وتحقق بخطوتين).',
          'افتح قائمة كلمات المرور المحفوظة وانظر إلى عمود <b>Website</b>: كل حساب مرتبط بنطاق محدد بالضبط.',
          'ادخل إلى موقع تملك فيه حساباً حقيقياً من صفحته الرسمية: لاحظ أن المدير يقترح حسابك تلقائياً.',
          'فعّل <b>Password Checkup</b> أو فحص التسريبات، وتحقق من بريدك في <code>haveibeenpwned.com</code> لتعرف إن ظهر في تسريب.',
          'اكتب القاعدة بكلماتك: «إن لم يقترح مديري حسابي على صفحة تشبه موقعي فقد يكون النطاق غير النطاق المحفوظ، فأتحقق من الرابط قبل أن أكتب شيئاً».'
        ],
        tools: [{ n: 'Have I Been Pwned', u: 'https://haveibeenpwned.com' }],
        warn: 'لا تكتب كلمة مرورك الحقيقية في أي مختبر أو نموذج تجريبي.'
      }) +
      TK.compare({
        a: { t: '✅ موقعك الحقيقي', html: '<p>النطاق <span class="code" dir="ltr">sahab-store.example</span> مطابق للمحفوظ: يقترح المدير حسابك بنقرة واحدة.</p>' },
        b: { t: '🚨 موقع مزيّف', bad: true, html: '<p>النطاق <span class="code" dir="ltr">sahab-store-offers.example</span> مختلف: المدير <b>لا يملأ شيئاً</b>. غياب الاقتراح إنذار مبكر قبل أن تكتب كلمة المرور بيدك.</p>' }
      })),
    TK.s('🧰 أدوات مجانية عبر الإنترنت لفحص رابط أو نطاق', 'Real tools — VirusTotal, crt.sh, ICANN lookup',
      '<p class="lead">عندما يصلك رابط مشبوه لا تفتحه: افحصه من هذه المواقع بالنسخ واللصق.</p>' +
      TK.tool({ e: '🛡️', n: 'VirusTotal', what: 'موقع مجاني يفحص رابطاً أو ملفاً بعشرات المحركات الأمنية (برامج فحص من شركات أمن مختلفة) دفعة واحدة، بدل أن تثبّت عشرات البرامج بنفسك.', why: 'تعرف إن كان الرابط معروفاً بأنه تصيّد أو برمجية خبيثة قبل أن تفتحه.', how: 'اختر تبويب URL والصق الرابط ثم اقرأ عدد المحركات التي أبلغت عنه.', url: 'https://www.virustotal.com' }) +
      TK.tool({ e: '📜', n: 'crt.sh', what: 'محرك بحث مجاني لسجلات الشهادات (Certificate Transparency — سجل عام يحفظ كل شهادة HTTPS صدرت لأي نطاق في العالم، فلا يمكن لأحد إصدار شهادة مزيّفة دون أن يظهر هذا في السجل).', why: 'تعرف متى صدرت أول شهادة لنطاق: نطاق شهادته الأولى قبل أيام ويدّعي أنه عريق = مريب.', how: 'اكتب النطاق في خانة البحث واقرأ عمود Logged At.', url: 'https://crt.sh' }) +
      TK.tool({ e: '📖', n: 'ICANN Lookup', what: 'خدمة رسمية ومجانية عبر الويب لعرض بيانات تسجيل أي نطاق، تشبه ما يعرضه أمر whois لكن من المتصفح مباشرة بلا طرفية — مفيدة جداً على 🪟 Windows الذي لا يملك أمر whois مدمجاً.', why: 'تعرف تاريخ الإنشاء والمسجِّل بدون تثبيت أي أداة.', how: 'اكتب اسم النطاق ثم ابحث عن Registration Date.', url: 'https://lookup.icann.org' }) +
      TK.lab({ t: 'افحص ثلاثة نطاقات', time: '5 د (للمنزل)', req: 'متصفح وإنترنت.',
        steps: ['ابحث في ICANN Lookup عن <code>wikipedia.org</code> ودوّن تاريخ التسجيل (Registration Date).', 'ابحث عنه في crt.sh وانظر إلى عمود Logged At لأقدم شهادة.', 'انسخ (دون فتح) رابطاً من رسالة مزعجة في بريدك أو جوالك والصقه في تبويب URL في VirusTotal.', 'اكتب هل تتفق النتائج الثلاث، وما قرارك؟'],
        tools: [{ n: 'VirusTotal', u: 'https://www.virustotal.com' }, { n: 'crt.sh', u: 'https://crt.sh' }, { n: 'ICANN Lookup', u: 'https://lookup.icann.org' }],
        warn: 'افحص الروابط بالنسخ فقط ولا تنقر عليها. ولا تصل إلى مواقع مجهولة من جهازك الأساسي.' })),
    TK.s('🚩 صنّف: علامات المتجر المزيّف', 'Classify — fake store red flags',
      '<p class="lead">ضع كل علامة في مكانها. مع الوقت سترى أن المتجر المزيّف يجمع أكثر من علامة معاً.</p>' +
      TK.classify({
        buckets: [{ t: 'علامة خطر', e: '🚩' }, { t: 'علامة مطمئنة', e: '✅' }],
        items: [
          { t: 'خصم 90% على أحدث هاتف والعرض ينتهي بعد ساعة', b: 0, why: 'سعر خيالي + ضغط وقت = أسلوب احتيال كلاسيكي.' },
          { t: 'الدفع فقط ببطاقات هدايا أو تحويل مصرفي لشخص', b: 0, why: 'طرق لا يمكن استردادها.' },
          { t: 'عمر النطاق 6 أيام حسب whois', b: 0, why: 'متجر جديد جداً بلا تاريخ.' },
          { t: 'الدفع يحوّلك إلى نطاق مختلف عن المتجر عبر http', b: 0, why: 'صفحة دفع على نطاق غريب بلا تشفير.' },
          { t: 'أخطاء إملائية كثيرة ولغة مترجمة آلياً', b: 0, why: 'المتاجر الحقيقية تراجع نصوصها.' },
          { t: 'نطاق عمره سنوات ومعلومات تسجيل واضحة', b: 1, why: 'العمر الطويل يصعّب إنشاء متجر مزيّف عابر.' },
          { t: 'سياسة إرجاع واضحة وعنوان وهاتف يمكن التحقق منهما', b: 1, why: 'معلومات قابلة للتحقق تقلل المخاطر.' },
          { t: 'الدفع عبر بوابة معروفة يعيد المال عند الاعتراض (Chargeback) أو الدفع عند الاستلام', b: 1, why: 'وسيلة تمنحك فرصة استرجاع المال.' },
          { t: 'تقييمات من مصادر خارجية مستقلة تتفق مع ما في الموقع', b: 1, why: 'التقييمات داخل الموقع نفسه سهلة التزييف، أما المستقلة فأكثر قيمة.' }
        ]
      })),
    TK.s('🎭 سيناريو: إعلان مغرٍ يقودك إلى متجر مزيّف', 'Scenario — tempting ad leads to a fake shop',
      '<div class="card"><b>الإعلان:</b> «سماعات لاسلكية بسعر 10% فقط! العرض ينتهي خلال ساعة! الرابط: sahab-store-offers.example».</div>' +
      TK.scenario({ steps: [
        { s: 'ظهر لك الإعلان أثناء تصفح تطبيق تواصل وأنت تحتاج السماعات. ما أول تصرف؟', o: [
          { t: 'أضغط وأشتري بسرعة قبل انتهاء العرض', ok: false, fb: 'الاستعجال هو سلاحهم. العروض الحقيقية لا تمنعك من التحقق.' },
          { t: 'أتوقف، ولا أدخل بياناتي، وأفحص النطاق بـ ICANN Lookup أو whois', ok: true, fb: 'ممتاز: الفحص يكشف عمر النطاق ومن سجّله قبل أي دفع.' },
          { t: 'أرسل الرابط لأصدقائي لنشتري معاً', ok: false, fb: 'ستعرّضهم للخطر بدل حمايتهم.' }] },
        { s: 'ظهر أن النطاق عمره 6 أيام، والمتجر يطلب الدفع ببطاقات هدايا فقط. ماذا تفعل؟', o: [
          { t: 'أدفع مبلغاً صغيراً كتجربة', ok: false, fb: 'أي دفعة تذهب للمحتال، وقد تُستخدم بياناتك لاحقاً.' },
          { t: 'أغلق الصفحة، وأبلغ عن الإعلان للمنصة، وأخبر وليّ أمري', ok: true, fb: 'الإبلاغ يحمي الآخرين، وإخبار الكبار يسهّل المتابعة.' },
          { t: 'أحاول إدخال بيانات وهمية ثم الحقيقية إن لم تنجح', ok: false, fb: 'لا ترسل أي بيانات حقيقية لموقع مشبوه مهما كان السبب.' }] },
        { s: 'قبل أن تنتبه كتبتَ بيانات بطاقة والدك في الصفحة ثم أرسلتها. ما الخطوة الأولى؟', o: [
          { t: 'أنتظر لأرى هل ستُخصم مبالغ', ok: false, fb: 'كل دقيقة تأخير تعطي المحتال فرصة. تصرّف فوراً.' },
          { t: 'أخبر والدي فوراً ليتصل بالبنك ويوقف البطاقة ويبدّل كلمات المرور المتكررة', ok: true, fb: 'السرعة في إيقاف البطاقة وإبلاغ البنك تقلل الضرر.' },
          { t: 'أحذف سجل المتصفح لإخفاء ما حدث', ok: false, fb: 'حذف السجل يخفي الدليل ولا يوقف السرقة. الصراحة مع الكبار أول خطوة.' }] }
      ] })),
    TK.s('📋 ورقة الغش: افحص موقعاً في دقيقة', 'Cheat sheet — check a site in one minute',
      TK.table(['الفحص', 'كيف؟', 'ماذا تنتبه؟'], [
        ['النطاق الحقيقي', 'اقرأ الرابط حتى أول /', 'حروف مقلدة، @، كلمات إضافية'],
        ['الشهادة', 'أيقونة الموقع ← Certificate', 'Issued to مطابق، SAN، تاريخ الانتهاء'],
        ['عمر النطاق', '<code>whois domain</code> (🍎 macOS/Linux) أو ICANN Lookup · 🪟 Windows: لا يوجد whois مدمج، استخدم أداة ويب مثل ICANN Lookup', 'Creation Date قريب جداً = خطر'],
        ['عنوان IP للنطاق', '<code>nslookup domain</code> (🍎 macOS/Linux و🪟 Windows المدمج) أو <code>Resolve-DnsName domain</code> في PowerShell', 'عنوان مختلف تماماً عن المعروف = مريب'],
        ['إلى أين يحوّلني؟', '<code>curl -I url</code> (🍎 macOS/Linux) أو تبويب Network · 🪟 Windows (PowerShell): <code>Invoke-WebRequest -Method Head url</code>', 'Location إلى نطاق غريب أو http'],
        ['الكوكيز', 'F12 ← Application ← Cookies', 'Secure وHttpOnly على كوكي الجلسة'],
        ['مدير كلمات المرور', 'هل اقترح حسابي؟', 'غياب الاقتراح = تحقق من النطاق']
      ]) + TK.terms([['SAN', 'قائمة النطاقات التي تغطيها الشهادة.'], ['DNS', 'نظام يحوّل أسماء المواقع إلى عناوين IP.'], ['Pharming', 'تحويلك إلى موقع مزيّف رغم كتابة الرابط الصحيح، عادة بسبب تزوير DNS.'], ['Session Cookie', 'رمز يثبت أنك سجّلت الدخول، وسرقته تعني اختطاف الجلسة.']]))
  ],
  quiz: [
    { q: 'ماذا يعني القفل الأخضر 🔒 بجانب رابط الموقع؟', ok: 'أن الاتصال بين متصفحك والموقع مشفّر فقط', no: ['أن صاحب الموقع شخص موثوق تماماً', 'أن الموقع خالٍ من أي برمجية خبيثة بالكامل', 'أن البضاعة المعروضة في الموقع أصلية ومضمونة'], why: 'القفل يضمن فقط أن أحداً في الطريق لا يقرأ ما ترسله؛ لا يضمن أمانة صاحب الموقع أو جودة ما يبيعه.' },
    { q: 'ما وظيفة خانة Subject Alternative Name (SAN) في شهادة الموقع؟', ok: 'تحدد قائمة النطاقات التي يحق لهذه الشهادة تغطيتها', no: ['تحدد تاريخ انتهاء صلاحية الشهادة فقط', 'تحدد اسم الجهة المصدِّقة التي وقّعت الشهادة', 'تحدد عنوان IP الخاص بخادم الموقع'], why: 'SAN تسرد كل أسماء النطاقات المسموح استخدام الشهادة معها، والمتصفح يحذّرك إن لم يجد اسم الموقع فيها.' },
    { q: 'موقع أُنشئ نطاقه قبل 6 أيام فقط ويعرض خصماً بنسبة 90%. ما التصرف الأصح؟', ok: 'التوقف والتحقق من النطاق والعمر قبل أي شراء', no: ['الشراء فوراً لأن العرض مربح جداً ولن يتكرر', 'تجاهل عمر النطاق لأنه غير مهم في التقييم', 'طلب من صديق الشراء أولاً ليجرّب الموقع بدلاً عني'], why: 'عمر نطاق قصير جداً مع عرض مبالغ فيه علامة خطر كلاسيكية، والتحقق أولى من الشراء.' },
    { q: 'في الرابط <code>https://paypal.com.login-check.example/home</code>، ما النطاق الحقيقي الذي يملكه صاحب الموقع؟', ok: 'login-check.example', no: ['paypal.com', 'home.example', 'paypal.com.login-check.example بالكامل كنطاق واحد'], why: 'نقرأ النطاق من اليمين حتى أول /، فـ paypal.com هنا مجرد اسم فرعي داخل نطاق المحتال.' },
    { q: 'ما الفرق الأساسي بين هجوم Pharming وهجوم Typosquatting؟', ok: 'في Pharming يكون الرابط المكتوب صحيحاً تماماً بينما DNS يحوّله لخادم مزيّف، أما Typosquatting يعتمد على خطأ إملائي في الرابط نفسه', no: ['كلاهما يعتمدان على نفس الخطأ الإملائي في الرابط بالضبط', 'Pharming يحدث فقط على الهاتف وTyposquatting فقط على الحاسوب', 'لا فرق بينهما، وهما اسمان لنفس الهجوم تماماً'], why: 'في Pharming الرابط صحيح 100% لكن DNS يحوّل الاسم الصحيح إلى خادم المحتال، بخلاف Typosquatting الذي يعتمد على رابط مكتوب بخطأ مقصود.' },
    { q: 'ما وظيفة علامة HttpOnly على كوكي الجلسة؟', ok: 'تمنع سكربتات الصفحة (JavaScript) من قراءة الكوكي', no: ['تمنع إرسال الكوكي عبر اتصال HTTPS المشفّر', 'تجعل الكوكي يُحذف تلقائياً بعد كل دقيقة', 'تسمح لأي موقع آخر بقراءة الكوكي بسهولة'], why: 'HttpOnly تصعّب على كود خبيث مزروع في الصفحة سرقة كوكي الجلسة عبر JavaScript.' },
    { q: 'عدّلت نصاً في تبويب Elements بأداة Inspect في متصفحك. ماذا يحدث لهذا التعديل؟', ok: 'يبقى ظاهراً على جهازك فقط، ويختفي فور تحديث الصفحة لأن الخادم لم يتغيّر', no: ['يظهر لكل زوار الموقع الآخرين فوراً', 'يُحفظ بشكل دائم على خادم الموقع', 'يغيّر قاعدة بيانات الموقع الحقيقية بعد إعادة التحميل'], why: 'التعديل بـ Inspect محلي تماماً على جهازك؛ الخادم لا يعرف عنه شيئاً، فيعود كل شيء لحالته الأصلية بعد F5.' },
    { q: 'فتحت موقعاً تملك فيه حساباً حقيقياً، لكن مدير كلمات المرور لم يقترح تعبئة بياناتك تلقائياً. ما أفضل تفسير وتصرف؟', ok: 'قد يكون النطاق مختلفاً عن المحفوظ، فيجب التوقف والتحقق من الرابط قبل كتابة أي شيء', no: ['خلل تقني بسيط في المتصفح، فأكتب بياناتي يدوياً مباشرة', 'يجب حذف مدير كلمات المرور لأنه لا يعمل بشكل صحيح', 'هذا يعني أن الموقع حذف حسابي بالكامل'], why: 'مدير كلمات المرور يربط كل حساب بنطاق محدد بالضبط، فغياب الاقتراح قد يعني أنك على نطاق مختلف يشبه الأصلي.' },
    { q: 'إضافة متصفح بسيطة لتغيير الألوان تطلب صلاحية «قراءة وتغيير كل بياناتك في كل المواقع». كيف تقيّم هذا الطلب؟', ok: 'علامة تحذير قوية: وظيفة بسيطة لا تحتاج صلاحية ضخمة كهذه', no: ['أمر طبيعي تماماً لأن كل الإضافات تحتاج هذه الصلاحية', 'يجب قبوله لأن رفضه يعطّل المتصفح بالكامل', 'لا علاقة للصلاحيات بأمان الإضافة إطلاقاً'], why: 'القاعدة: كلما كانت الوظيفة أبسط والصلاحية المطلوبة أكبر، زاد الشك في نية الإضافة.' },
    { q: 'في تبويب Network ظهر نموذج تسجيل الدخول يُرسَل إلى رابط يبدأ بـ <code>http://</code> لا <code>https://</code>. ماذا يعني ذلك؟', ok: 'أن كلمة المرور وبيانات النموذج تسير عبر الشبكة بلا تشفير ويمكن قراءتها في الطريق', no: ['أن البيانات مشفّرة بطريقة مختلفة عن HTTPS لكنها آمنة بنفس القدر', 'أن المتصفح سيرفض إرسال النموذج تلقائياً في هذه الحالة', 'أن الموقع يستخدم بروتوكولاً أحدث وأكثر أماناً من HTTPS'], why: 'http بلا تشفير يعني أن أي بيانات حساسة تُرسل عبره، كاسم المستخدم وكلمة المرور، تصبح مقروءة لمن يتنصّت في الطريق.' }
  ],
  audit: [
    'فحصت شهادة موقع حقيقي ودوّنت Issued by وتاريخ الانتهاء وSAN',
    'قرأت النطاق الحقيقي في رابط مخادع وحللت رابطاً فيه علامة @',
    'قارنت متجراً حقيقياً بمتجر مزيّف بـ whois وnslookup وcurl -I',
    'فتحت DevTools (F12) ورأيت تبويب Network وكوكيز الموقع في Application',
    'عدّلت صفحة بريئة بـ Inspect وفهمت أن التعديل محلي فقط',
    'راجعت إضافات متصفحي وأزلت ما لا أحتاجه',
    'فعّلت إعدادات الحماية ومدير كلمات المرور في متصفحي',
    'فحصت رابطاً أو نطاقاً بـ VirusTotal أو crt.sh أو ICANN Lookup'
  ],
  recap: [
    'القفل يعني اتصالاً مشفّراً فقط، أما الحكم على الموقع فيحتاج فحص النطاق والعمر والشهادة',
    'اقرأ الرابط حتى أول / وخذ النطاق الأخير: أي شيء قبله زينة',
    'whois وnslookup وcurl -I وDevTools تكشف عمر الموقع ووجهته وكوكياته',
    'مدير كلمات المرور وتحذير الشهادة خط دفاع ضد التزييف حتى لو كان الرابط يبدو صحيحاً',
    'كوكي الجلسة يساوي مفتاح حسابك: لا تشاركه ولا تثبّت برامج وإضافات مجهولة'
  ],
  homework: 'اختر أي خمسة مواقع تزورها، وأنشئ جدولاً: النطاق، الجهة المصدِّقة للشهادة، تاريخ إنشاء النطاق، وهل كوكي الجلسة عليه Secure وHttpOnly. ثم اكتب فقرة قصيرة تشرح كيف تتأكد أن متجراً جديداً آمن قبل الشراء.',
  resources: [
    { t: 'Chrome DevTools — دليل المطوّر', u: 'https://developer.chrome.com/docs/devtools' },
    { t: 'VirusTotal — فحص الروابط والملفات', u: 'https://www.virustotal.com' },
    { t: 'crt.sh — سجلات الشهادات', u: 'https://crt.sh' },
    { t: 'ICANN Lookup — بيانات تسجيل النطاق', u: 'https://lookup.icann.org' },
    { t: 'OWASP — مشروع Top Ten', u: 'https://owasp.org/www-project-top-ten' },
    { t: 'NCSC — إرشادات التصفح الآمن', u: 'https://www.ncsc.gov.uk' }
  ],
  next: 'في الوحدة القادمة: أمن الجوال والتطبيقات والألعاب — ستفحص صلاحيات التطبيقات وتحمي حسابات الألعاب من الاحتيال.'
});
