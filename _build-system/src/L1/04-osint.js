/* المستوى الأول — الوحدة 4: OSINT — استخبارات المصادر المفتوحة */

/* مساعد لتنسيق مخرجات exiftool (اسم الحقل مُحاذى إلى 32 خانة ثم : ثم القيمة) */
const exRows = rows => rows.map(r => r[0].padEnd(32) + ': ' + r[1]).join('\n');

const EXIF_FULL = exRows([
  ['ExifTool Version Number', '12.40'],
  ['File Name', 'photo.jpg'],
  ['Directory', '.'],
  ['File Size', '3.1 MB'],
  ['File Modification Date/Time', '2024:06:20 11:05:31+00:00'],
  ['File Type', 'JPEG'],
  ['MIME Type', 'image/jpeg'],
  ['Make', 'samsung'],
  ['Camera Model Name', 'SM-S918B'],
  ['Orientation', 'Horizontal (normal)'],
  ['Artist', 'Layla Nasser'],
  ['Copyright', '(c) Layla Nasser 2022'],
  ['Exposure Time', '1/500'],
  ['F Number', '2.4'],
  ['ISO', '50'],
  ['Date/Time Original', '2022:09:03 17:42:09'],
  ['Create Date', '2022:09:03 17:42:09'],
  ['Offset Time Original', '+02:00'],
  ['Image Width', '4000'],
  ['Image Height', '3000'],
  ['GPS Latitude Ref', 'North'],
  ['GPS Longitude Ref', 'East'],
  ['GPS Altitude', '23.4 m Above Sea Level'],
  ['GPS Latitude', '30 deg 2′ 39.84″ N'],
  ['GPS Longitude', '31 deg 14′ 8.52″ E'],
  ['GPS Position', '30 deg 2′ 39.84″ N, 31 deg 14′ 8.52″ E']
]);

const EXIF_GPS = exRows([
  ['GPS Latitude Ref', 'North'],
  ['GPS Longitude Ref', 'East'],
  ['GPS Altitude', '23.4 m Above Sea Level'],
  ['GPS Latitude', '30 deg 2′ 39.84″ N'],
  ['GPS Longitude', '31 deg 14′ 8.52″ E'],
  ['GPS Position', '30 deg 2′ 39.84″ N, 31 deg 14′ 8.52″ E']
]);

const EXIF_CLEAN = exRows([
  ['ExifTool Version Number', '12.40'],
  ['File Name', 'photo_clean.jpg'],
  ['Directory', '.'],
  ['File Size', '3.0 MB'],
  ['File Type', 'JPEG'],
  ['MIME Type', 'image/jpeg'],
  ['Image Width', '4000'],
  ['Image Height', '3000']
]);

const WHOIS_CLUB = [
  'Domain Name: SKY-KITES.EXAMPLE',
  'Registry Domain ID: D4821907-EX',
  'Registrar WHOIS Server: whois.example-registrar.example',
  'Registrar: Example Registrar, Inc.',
  'Updated Date: 2025-01-10T08:21:00Z',
  'Creation Date: 2023-03-18T12:00:00Z',
  'Registry Expiry Date: 2027-03-18T12:00:00Z',
  'Registrant Name: REDACTED FOR PRIVACY',
  'Registrant Organization: Sky Kites Club',
  'Registrant Country: EG',
  'Registrant Email: Please query the RDDS service of the Registrar of Record',
  'Name Server: NS1.CLOUDHOST.EXAMPLE',
  'Name Server: NS2.CLOUDHOST.EXAMPLE',
  'DNSSEC: unsigned',
  'Registrar Abuse Contact Email: abuse@example-registrar.example'
].join('\n');

const WHOIS_SCAM = [
  'Domain Name: FREE-GIFT-PRIZE.EXAMPLE',
  'Registry Domain ID: D5530012-EX',
  'Registrar WHOIS Server: whois.cheapnames.example',
  'Registrar: Cheap Names Ltd.',
  'Updated Date: 2025-05-19T21:14:07Z',
  'Creation Date: 2025-05-19T21:14:07Z',
  'Registry Expiry Date: 2026-05-19T21:14:07Z',
  'Registrant Name: REDACTED FOR PRIVACY',
  'Registrant Organization: Privacy Proxy Service',
  'Registrant Country: REDACTED',
  'Name Server: NS1.FASTHOST-ANON.EXAMPLE',
  'Name Server: NS2.FASTHOST-ANON.EXAMPLE',
  'DNSSEC: unsigned',
  'Registrar Abuse Contact Email: abuse@cheapnames.example'
].join('\n');

TK.module({
  id: 'L1-04', level: 1, num: 4, slug: 'استخبارات-المصادر-المفتوحة-OSINT',
  title: 'OSINT: ما الذي يكشفه الإنترنت عنك وعن غيرك؟', en: 'OSINT — Open-Source Intelligence', emoji: '🔎',
  lead: 'في هذه الوحدة ستتعلم كيف يجمع المحللون المعلومات من مصادر علنية فقط: تبني استعلامات Google Dorking، وتتحقق من صورة بالبحث العكسي، وتقرأ بيانات EXIF وWHOIS في تحقيق كامل، ثم تفحص نفسك أنت وتحصّن خصوصيتك.',
  tags: ['🛠️ exiftool (محاكاة)', '🌐 Google Lens / TinEye', '🌐 Have I Been Pwned', '🌐 ICANN Lookup'],
  agenda: [
    { t: '💡 ما هو OSINT وما حدوده الأخلاقية؟', time: '10 د' },
    { t: '🔎 Google Dorking + البحث العكسي بالصور', time: '22 د' },
    { t: '📸 تحقيق EXIF: من صاحب الصورة؟', time: '18 د' },
    { t: '☕ استراحة', time: '10 د' },
    { t: '🌍 WHOIS و Have I Been Pwned', time: '15 د' },
    { t: '🪞 افحص نفسك + تحدي الإغلاق', time: '15 د' }
  ],
  slides: [
    TK.concept({
      t: 'OSINT: المعلومة العلنية قد تكون سلاحاً', en: 'What is Open-Source Intelligence?', min: '6 د',
      body: '<p><b>استخبارات المصادر المفتوحة (OSINT)</b> هي جمع المعلومات وتحليلها من مصادر <b>علنية</b> يستطيع أي شخص الوصول إليها: محركات البحث، حسابات التواصل، الصور، سجلات النطاقات. يستخدمها محللو الأمن والصحفيون والباحثون للتحقق من الأخبار وللتحقيق في الاحتيال، ويستخدمها المحتالون أيضاً لجمع معلومات عن ضحاياهم قبل الهجوم.</p>' +
        '<p>بمعنى أبسط: أي معلومة يستطيع أي شخص في العالم الوصول إليها بلا كلمة مرور ولا اختراق ولا إذن خاص - منشور عام، صفحة موقع، صورة منشورة - تدخل ضمن OSINT. تخيّل نفسك محققاً يجمع أدلة متناثرة من أماكن متاحة للجميع ليكوّن صورة كاملة؛ لا تحتاج أدوات اختراق، فقط ملاحظة دقيقة وربطاً ذكياً بين القطع.</p>' +
        '<div class="grid g3 mt"><div class="card"><b>١) اسأل</b><p>ما الذي أريد معرفته؟ (هل الصورة حقيقية؟)</p></div><div class="card"><b>٢) اجمع</b><p>من مصادر علنية فقط، وسجّل الرابط والوقت.</p></div><div class="card"><b>٣) حلّل ووثّق</b><p>اربط الأدلة، وقل ما تعرفه وما لا تعرفه.</p></div></div>' +
        '<div class="warn mt">علنية المعلومة لا تعني أن كل استخدام لها مسموح. في هذه الوحدة نتدرّب على بيانات خيالية أو على بياناتنا نحن فقط.</div>' +
        TK.check({ s: 'أي معلومة علنية على الإنترنت يمكن استخدامها بأي طريقة دون قيود، لأنها متاحة للجميع أصلاً.', t: false, why: 'علنية المعلومة لا تعني أن كل استخدام لها مسموح؛ تتبّع شخص أو بناء ملف عنه يبقى انتهاكاً لخصوصيته حتى لو جُمعت المعلومات من مصادر علنية.' }),
      key: 'OSINT = جمع معلومات من مصادر علنية، والقانون والأخلاق يحددان ما تفعله بها.'
    }),
    TK.s('🎬 من معلومات متناثرة إلى ملف كامل', 'Animated: how scattered facts become a full profile',
      '<p class="lead">شخصية خيالية اسمها «نور» لم تنشر شيئاً خطيراً. شاهد كيف تتجمع التفاصيل الصغيرة.</p>' +
      TK.steps({
        a: { e: '🧩', l: 'معلومات متناثرة' }, b: { e: '🗂️', l: 'ملف كامل عن نور' },
        steps: [
          { icon: '', at: 'mid', cap: 'لا شيء مريب: بضع صور ومنشورات عامة هنا وهناك' },
          { icon: '👕', at: 'a', cap: '١) صورة شخصية يظهر فيها شعار المدرسة على القميص', ba: 'المدرسة' },
          { icon: '🎮', at: 'b', cap: '٢) اسم المستخدم nour_gamer_08 نفسه في لعبتها وحسابها على منصة أخرى', bb: 'حسابات مرتبطة' },
          { icon: '📍', at: 'b', cap: '٣) صورة أرسلتها كملف أصلي تحمل إحداثيات GPS لحيّها', bb: 'الحيّ + المدرسة' },
          { icon: '🎂', at: 'a', cap: '٤) تعليق تهنئة بعيد ميلادها يكشف التاريخ والعمر', ba: 'تاريخ الميلاد' },
          { icon: '⚠️', at: 'b', cap: '٥) النتيجة: ملف كامل (اسم، مدرسة، حيّ، روتين) يكفي لرسالة تصيّد مقنعة أو انتحال شخصية أو تنمّر', flash: 'bad', bb: 'ملف جاهز للاستغلال' }
        ]
      }) + '<div class="tip mt">القاعدة: كل معلومة وحدها بريئة، لكن الربط بينها هو الخطر. ستبني اليوم الملف عن <b>نفسك</b> لتعرف ما يراه الآخرون.</div>'),
    TK.s('🎭 ما الذي يحقّ لي بحثه؟ (الأخلاقيات أولاً)', 'Classify — what is OK to investigate?',
      '<p class="lead">اضغط العبارة ثم الصندوق المناسب. قاعدة الذهب: أتدرّب على <b>نفسي</b> وعلى <b>بيانات خيالية أو مؤسسية علنية</b>، ولا أتتبّع أشخاصاً.</p>' +
      TK.classify({
        buckets: [{ t: 'تدريب مسموح', e: '✅' }, { t: 'مرفوض', e: '⛔' }],
        items: [
          { t: 'البحث عن اسمي أنا في Google لأرى ما يظهر', b: 0, why: 'فحص الذات هو أفضل تدريب آمن على OSINT.' },
          { t: 'قراءة EXIF لصورة خيالية في مختبر الوحدة', b: 0, why: 'بيانات تدريبية لا تخص أحداً.' },
          { t: 'فحص WHOIS لنطاق رسالة احتيال وصلتني', b: 0, why: 'سجلات WHOIS علنية، والهدف حماية نفسك.' },
          { t: 'البحث عن موقع مدرستي العلني بالعوامل site: و filetype:', b: 0, why: 'مؤسسة علنية وبحث سلبي بلا دخول لأي نظام.' },
          { t: 'تتبّع مكان صديق من صورة أرسلها لي', b: 1, why: 'استخدام بياناته ضد خصوصيته دون إذنه، حتى لو كانت البيانات متاحة.' },
          { t: 'تجميع اسم زميل ومدرسته وحيّه في ملف', b: 1, why: 'هذا بناء ملف عن شخص حقيقي، وقد يؤذيه أو يعرّضه للملاحقة.' },
          { t: 'فتح ملف خاص ظهر بالصدفة في نتائج بحث ثم تحميله', b: 1, why: 'ظهور الملف في Google لا يعني أنك مأذون بفتحه. أبلغ صاحبه أو المسؤول.' },
          { t: 'تجربة كلمات مرور على حساب شخص بعد معرفة اسمه', b: 1, why: 'هذا دخول غير مصرّح به وجريمة، وليس OSINT.' }
        ]
      })),
    TK.s('🔎 Google Dorking: عوامل البحث التي يستخدمها المحللون', 'Search operators in one table',
      '<p class="lead"><b>Dorking</b> يعني استخدام عوامل بحث رسمية موثّقة لدى Google لتضييق النتائج. لا اختراق فيه: أنت تسأل المحرّك بدقة أكبر. الصيغة: <span class="code">عامل:قيمة</span> بلا مسافة بعد النقطتين.</p>' +
      '<p>عامل البحث (Search Operator) هو ببساطة كلمة خاصة تكتبها قبل النقطتين لتوجّه محرك البحث بدقة أكبر، تماماً كأنك تقول له: «ابحث هنا فقط» أو «أرني هذا النوع من الملفات فقط»، بدل ترك البحث عاماً جداً فتغرق في نتائج غير مفيدة.</p>' +
      TK.table(['العامل', 'ماذا يفعل؟', 'مثال تدريبي آمن'], [
        ['<code>site:</code>', 'يحصر النتائج في موقع واحد', '<code>site:owasp.org</code>'],
        ['<code>filetype:</code>', 'يطلب نوع ملف محدداً (pdf, docx, xlsx)', '<code>site:ncsc.gov.uk filetype:pdf</code>'],
        ['<code>intitle:</code>', 'الكلمة يجب أن تكون في عنوان الصفحة', '<code>site:owasp.org intitle:cheat</code>'],
        ['<code>inurl:</code>', 'الكلمة يجب أن تكون في الرابط', '<code>site:owasp.org inurl:project</code>'],
        ['<code>"عبارة"</code>', 'مطابقة العبارة كما هي بالضبط', '<code>"password policy" filetype:pdf</code>'],
        ['<code>-كلمة</code>', 'استبعاد كلمة من النتائج', '<code>site:owasp.org -juice</code>']
      ]) +
      '<div class="note mt"><b>لماذا يفيد؟</b> الموظف قد ينشر ملفاً داخلياً عن غير قصد (جدول أسماء، تقرير) فيفهرسه Google. المحلل يكتشف ذلك بنفسه ويبلّغ صاحب الموقع قبل أن يجده المحتال.</div>' +
      TK.check({ s: 'الاستعلام <code>site:owasp.org filetype:pdf</code> يعرض ملفات PDF من موقع owasp.org فقط، لا من بقية الإنترنت.', t: true, why: 'العامل site: يحصر البحث داخل الموقع المحدد، وfiletype: يحدد نوع الملف، فتعمل العوامل معاً لتضييق النتائج بدقة.' })),
    TK.s('🧪 مختبر ١: ابنِ استعلامات Dork بنفسك', 'Lab 1 — Google Dorking on safe targets',
      '<p class="lead">ستعمل على مواقع تعليمية علنية ثم على موقع مدرستك أو ناديك. القاعدة: <b>تنظر إلى عناوين النتائج فقط</b>، ولا تحاول الدخول إلى صفحات تسجيل الدخول أو ملفات تبدو خاصة.</p>' +
      TK.lab({ t: 'أنشئ وجرّب 5 استعلامات', time: '10 د', req: 'متصفح وحساب Google غير مطلوب.',
        steps: [
          'افتح <code>google.com</code> وجرّب: <code>site:ncsc.gov.uk filetype:pdf</code>. كم نوع من المستندات ظهر؟ ما عناوين أول ثلاثة؟',
          'ضيّق أكثر: <code>site:owasp.org intitle:cheat</code>. لاحظ كيف تغيّرت النتائج بإضافة intitle:.',
          'جرّب الاستبعاد: <code>site:owasp.org project -juice</code> وقارن بنفس البحث دون <code>-juice</code>.',
          'انتقل إلى موقع مدرستك أو ناديك (أو أي مؤسسة علنية تختارها): <code>site:موقع-مدرستك.com filetype:pdf</code>. هل تظهر ملفات توقعتها؟ هل تظهر أشياء لم تتوقعها مثل أسماء أو أرقام هواتف؟',
          'اكتب في ملاحظاتك: استعلامان أعطيا نتائج مفيدة، وماذا لو كان ما وجدته <b>لا يجب أن يكون علنياً</b>؟ الجواب الصحيح: أبلغ مسؤول الموقع ولا تحمّل الملف.'
        ],
        tools: [{ n: 'Google Search', u: 'https://www.google.com/' }, { n: 'مرجع عوامل البحث (OWASP)', u: 'https://owasp.org/' }],
        tip: 'إذا لم تظهر نتائج بالعربية، جرّب العبارة بالإنجليزية. العوامل نفسها تعمل بكل اللغات.',
        warn: 'لا تبحث عن كلمات مثل password أو index of على مواقع جهات حقيقية بنيّة فتح ما تجده. فتح ملف خاص لم يُعطَ لك الإذن به غير مسموح قانونياً.' })),
    TK.s('🏁 تحدي: اكتب الاستعلام الصحيح', 'Challenge — write the dork',
      '<p class="lead">اكتب الاستعلام كاملاً في الخانة: العوامل مفصولة بمسافة، والترتيب غير مهم.</p>' +
      TK.challenge({ t: 'ملفات PDF من موقع محدد', q: 'اكتب استعلاماً يعرض <b>ملفات PDF فقط</b> داخل الموقع <span class="code">ncsc.gov.uk</span>.', answer: ['site:ncsc.gov.uk filetype:pdf'], re: '^(?=.*(^|\\s)site:ncsc\\.gov\\.uk(\\s|$))(?=.*(^|\\s)filetype:pdf(\\s|$))\\S+\\s+\\S+\\s*$', hint: 'تحتاج عاملين: واحد للموقع وواحد لنوع الملف.', explain: 'site: يحدد الموقع و filetype: يحدد النوع. جرّبه فعلاً في Google.', ph: 'site:... filetype:...' }) +
      TK.challenge({ t: 'العنوان والموقع', q: 'اكتب استعلاماً يبحث في <span class="code">example.com</span> عن الصفحات التي <b>عنوانها</b> يحتوي كلمة <span class="code">login</span>.', answer: ['site:example.com intitle:login'], re: '^(?=.*(^|\\s)site:example\\.com(\\s|$))(?=.*(^|\\s)intitle:login(\\s|$))\\S+\\s+\\S+\\s*$', hint: 'العامل الذي يفحص عنوان الصفحة هو intitle:', explain: 'intitle:login يحصر النتائج بالصفحات التي تحمل login في عنوانها. المحلل يستخدمه ليعرف ما الصفحات العلنية فقط، ولا يجرّب الدخول إليها.', ph: 'site:... intitle:...' }) +
      TK.challenge({ t: 'الاستبعاد', q: 'اكتب استعلاماً يعرض ملفات PDF في الموقع <span class="code">example.edu</span> مع <b>استبعاد</b> كلمة <span class="code">draft</span>.', answer: ['site:example.edu filetype:pdf -draft'], re: '^(?=.*(^|\\s)site:example\\.edu(\\s|$))(?=.*(^|\\s)filetype:pdf(\\s|$))(?=.*(^|\\s)-draft(\\s|$))\\S+\\s+\\S+\\s+\\S+\\s*$', hint: 'علامة الناقص قبل الكلمة مباشرة بلا مسافة.', explain: 'الاستبعاد -draft يزيل كل صفحة تحوي الكلمة، وهو يوفر وقتك في كثرة النتائج.', ph: 'site:... filetype:... -...' })),
    TK.s('🧪 مختبر ٢: البحث العكسي بالصور', 'Lab 2 — reverse image search',
      '<p class="lead">هل الصورة المنتشرة حقيقية، ومتى ظهرت أول مرة؟ هذا سؤال يطرحه الصحفيون والمحققون كل يوم. الطريقة: ترفع الصورة، فيبحث المحرّك عن نسخها في الإنترنت.</p>' +
      TK.lab({ t: 'تتبّع أصل صورة', time: '8 د', req: 'صورة تختارها: صورة خبر منتشرة، أو صورة مشهورة، أو صورة من تصويرك. لا تستخدم صورة شخص آخر لم يسمح.',
        steps: [
          'احفظ الصورة على جهازك. افتح <code>lens.google.com</code> أو اضغط أيقونة الكاميرا في <code>images.google.com</code> وارفع الصورة.',
          'افتح قسم «مطابقات تامة» (Exact matches) أو الصفحات التي تحوي الصورة، وسجّل ثلاثة مواقع ظهرت فيها.',
          'كرّر الأمر في <code>tineye.com</code>، ثم رتّب النتائج بالأقدم (Oldest). في TinEye الأقدم مؤشر مفيد على أول ظهور معروف.',
          'قارن: هل يطابق تاريخ أقدم ظهور ما قيل في المنشور المتداول؟ وهل تغيّر قصّ الصورة أو التعليق عنها؟',
          'اكتب استنتاجاً في سطرين: «الصورة قديمة/جديدة، أول ظهور كان في …، الدليل …». لا تجزم إذا لم تجد دليلاً.'
        ],
        tools: [{ n: 'Google Lens', u: 'https://lens.google.com/' }, { n: 'TinEye', u: 'https://tineye.com/' }],
        tip: 'جرّب صورتك أنت: إن ظهرت في مكان لم تنشرها فيه، فقد تم نسخها. هذا اكتشاف مهم لخصوصيتك.',
        warn: 'لا ترفع صوراً حساسة (وثائق، صور شخصية خاصة) إلى أي موقع بحث.' })),
    TK.s('🎬 صورتك تحمل أكثر مما ترى: EXIF', 'Animated: what is hidden inside a photo',
      '<p class="lead"><b>EXIF</b> هي بيانات وصفية (Metadata) يكتبها الجوال أو الكاميرا داخل ملف الصورة: الجهاز، الوقت، وغالباً الموقع. لا تظهر عند النظر إلى الصورة، لكن أي أداة تقرؤها.</p>' +
      '<p>البيانات الوصفية (Metadata) ببساطة هي «معلومات عن المعلومات»: ليست الصورة نفسها، بل تفاصيل خفية مرفقة بها تصف متى وأين وبأي جهاز التُقطت. ونظام تحديد المواقع (GPS) هو نفس التقنية التي تستخدمها تطبيقات الخرائط في جوالك لمعرفة مكانك بدقة، وقد تُسجَّل إحداثياته داخل ملف الصورة نفسه دون أن تلاحظ ذلك.</p>' +
      TK.steps({
        a: { e: '📱', l: 'جوالك' }, b: { e: '🕵️', l: 'شخص غريب' },
        steps: [
          { icon: '', at: 'mid', cap: 'تلتقط صورة لطائرتك الورقية في الحديقة' },
          { icon: '🗃️', at: 'a', cap: '١) الجوال يكتب داخل الملف: الطراز، الوقت، وإحداثيات GPS إن كان الموقع مفعّلاً', ba: 'GPS + وقت + طراز' },
          { icon: '📤', at: 'b', cap: '٢) ترسل الصورة كملف أصلي (بريد أو «مستند»). بعض المنصات تحذف EXIF عند الرفع، لكن لا تعتمد على ذلك', bb: 'استلم الملف' },
          { icon: '🔧', at: 'b', cap: '٣) يشغّل exiftool على الملف فتظهر الإحداثيات والتاريخ والطراز', flash: 'bad', bb: 'عرف مكانك' },
          { icon: '🛡️', at: 'a', cap: '٤) الحل: أوقف وسم الموقع في تطبيق الكاميرا، أو احذف البيانات قبل الإرسال بـ exiftool -all=', flash: 'ok', ba: 'خصوصية محمية' }
        ]
      }) +
      TK.transform({ input: 'photo.jpg', label: 'exiftool', gear: '🔧', output: '📍 30.0444, 31.2357 · 📱 SM-S918B · 🕔 2022-09-03 17:42', editable: false, btn: 'اقرأ البيانات المخفية', after: 'ملف صورة واحد كشف المكان والجهاز والوقت.' }) +
      TK.check({ s: 'بعض منصات التواصل تحذف بيانات EXIF عند رفع الصورة، لكن لا يجب الاعتماد على ذلك دائماً.', t: true, why: 'صحيح: بعض المنصات تحذفها تلقائياً وبعضها لا، فالأضمن إزالة EXIF بنفسك بأداة مثل exiftool -all= قبل إرسال صورة حساسة.' })),
    TK.s('🧪 مختبر ٣: افتح ملف القضية (exiftool)', 'Lab 3 — read EXIF in a simulated case',
      '<div class="card"><b>القضية (خيالية بالكامل):</b> موقع نادي الطائرات الورقية <span class="code">sky-kites.example</span> نشر الصورة <span class="code">photo.jpg</span> وكتب تحتها: «من مهرجان النادي عام 2024 في مدينة الإسكندرية». مهمتك التحقق من الادعاء. اقرأ <span class="code">case-notes.txt</span> أولاً.</div>' +
      '<div class="note mt">الطرفية أدناه محاكاة تعمل من المتصفح على أي جهاز (Windows أو macOS أو Linux) دون تثبيت أي شيء. لاحقاً عندما تستخدم أداة exiftool الحقيقية على جهازك (في مختبر تحصين الخصوصية)، ستجد ملاحظة Windows خاصة بالتثبيت الفعلي.</div>' +
      TK.shell({
        title: 'analyst@osint-lab: ~/evidence', user: 'analyst', host: 'osint-lab', cwd: '/home/analyst/evidence',
        fs: { home: { analyst: { evidence: {
          'case-notes.txt': 'القضية 0417 (خيالية - لا أشخاص حقيقيون)\nالموقع: sky-kites.example\nالادعاء: الصورة photo.jpg من مهرجان النادي عام 2024 في الإسكندرية.\nالمطلوب: تحقق من الجهاز والتاريخ والمكان.\nللتحويل من إحداثيات إلى مدينة استخدم known-places.txt',
          'photo.jpg': '[بيانات JPEG ثنائية. لا يمكن قراءتها بـ cat. استخدم exiftool photo.jpg]',
          'known-places.txt': 'جدول مدن تدريبي (إحداثيات مقرّبة لمنزلتين)\n24.71, 46.68  = Riyadh\n21.54, 39.17  = Jeddah\n31.95, 35.93  = Amman\n31.20, 29.92  = Alexandria\n30.04, 31.24  = Cairo'
        } } } },
        tasks: [
          { d: 'اقرأ ملف القضية: <code>cat case-notes.txt</code>', re: '^cat\\s+case-notes\\.txt' },
          { d: 'استخرج بيانات الصورة: <code>exiftool photo.jpg</code>', re: '^exiftool\\s+photo\\.jpg\\s*$' },
          { d: 'اعرض حقول GPS فقط: <code>exiftool photo.jpg | grep -i gps</code>', re: '^exiftool\\s+photo\\.jpg\\s*\\|\\s*grep\\s+-i\\s+gps' },
          { d: 'اطلب القيم العشرية: <code>exiftool -n -GPSLatitude -GPSLongitude photo.jpg</code>', re: '^exiftool\\s+-n\\s+.*photo\\.jpg' },
          { d: 'طابق الإحداثيات مع الجدول: <code>cat known-places.txt</code>', re: '^cat\\s+known-places\\.txt' },
          { d: 'ولّد نسخة بلا بيانات: <code>exiftool -all= -o photo_clean.jpg photo.jpg</code> ثم افحصها: <code>exiftool photo_clean.jpg</code>', re: '^exiftool\\s+photo_clean\\.jpg' }
        ],
        cmds: [
          { re: '^exiftool\\s+-all=\\s+-o\\s+photo_clean\\.jpg\\s+photo\\.jpg', out: '    1 image files created', cls: 'ok' },
          { re: '^exiftool\\s+photo_clean\\.jpg', out: EXIF_CLEAN + '\n\n# لاحظ: اختفت حقول الجهاز والتاريخ والموقع والمصوّر.', cls: 'ok' },
          { re: '^exiftool\\s+-n\\s+-GPSLatitude\\s+-GPSLongitude\\s+photo\\.jpg', out: 'GPS Latitude                    : 30.0444\nGPS Longitude                   : 31.2357' },
          { re: '^exiftool\\s+-n\\s+.*photo\\.jpg', out: 'GPS Latitude                    : 30.0444\nGPS Longitude                   : 31.2357\n# (جرّب الصيغة: exiftool -n -GPSLatitude -GPSLongitude photo.jpg)' },
          { re: '^exiftool\\s+photo\\.jpg\\s*\\|\\s*grep\\s+-i\\s+gps', out: EXIF_GPS },
          { re: '^exiftool\\s+photo\\.jpg\\s*\\|', out: EXIF_FULL + '\n# (المحاكاة تعرض كل الحقول مع الأنابيب. جرّب grep -i gps)' },
          { re: '^exiftool\\s+photo\\.jpg\\s*$', out: EXIF_FULL, cls: 'ok' },
          { re: '^exiftool\\s*$', out: 'Syntax: exiftool [OPTIONS] FILE\nمثال: exiftool photo.jpg' },
          { re: '^exiftool\\s+\\S+', out: 'Error: File not found - ' + 'الملف المطلوب. الملفات المتاحة: photo.jpg' }
        ]
      })),
    TK.s('🏁 تحدي: ماذا تقول الصورة فعلاً؟', 'Challenge — facts from the metadata',
      '<p class="lead">أجب من مخرجات <span class="code">exiftool photo.jpg</span> في المختبر السابق.</p>' +
      TK.challenge({ t: 'الجهاز', q: 'ما قيمة الحقل <span class="code">Camera Model Name</span>؟', answer: ['SM-S918B'], hint: 'ابحث عن السطر الذي يبدأ بـ Camera Model Name.', explain: 'طراز الجهاز يساعد على ربط صورتين بجهاز واحد.', ph: 'الطراز' }) +
      TK.challenge({ t: 'سنة التقاط الصورة', q: 'في أي سنة التُقطت الصورة حسب الحقل <span class="code">Date/Time Original</span>؟ (انتبه: ليس تاريخ تعديل الملف)', answer: ['2022'], hint: 'File Modification Date هو متى حُفظ الملف، وليس متى صُوّرت الصورة.', explain: 'الصورة التُقطت عام 2022، فادعاء «مهرجان 2024» موضع شك.', ph: 'السنة' }) +
      TK.challenge({ t: 'خط العرض', q: 'ما قيمة <span class="code">GPS Latitude</span> بالدرجات العشرية <b>مقرّبة لمنزلتين</b>؟', answer: ['30.04'], hint: 'استخدم exiftool -n -GPSLatitude -GPSLongitude photo.jpg ثم قرّب.', explain: '30 + 2/60 + 39.84/3600 = 30.0444 فتصبح 30.04.', ph: 'xx.xx' })),
    TK.breakSlide('الجزء القادم: WHOIS (من يملك هذا النطاق؟)، ثم Have I Been Pwned، ثم تفحص نفسك وتغلق القضية.'),
    TK.s('🎬 WHOIS: سجلّ الهوية الرقمية للنطاق', 'Animated: reading a WHOIS record',
      '<p class="lead"><b>WHOIS</b> سجلّ علني لنطاقات الإنترنت: من سجّل النطاق، ومتى، ولدى أي شركة. اليوم كثير من المالكين يخفون أسماءهم، لكن <b>تواريخ التسجيل</b> و<b>المسجِّل</b> و<b>خوادم الأسماء</b> تبقى أدلة مفيدة. (النطاقات في المختبر خيالية بامتداد .example)</p>' +
      '<p>النطاق (Domain) هو العنوان الذي تكتبه في المتصفح للوصول إلى موقع، مثل google.com، ولا بد أن يسجّله شخص أو جهة لدى شركة مختصة قبل أن يعمل - تماماً كتسجيل سيارة باسم مالكها عند جهة رسمية. اسم الأداة WHOIS مأخوذ من عبارة «Who is» الإنجليزية (من هو؟)، لأنها تجيب بالضبط عن هذا السؤال: من هو صاحب هذا النطاق؟</p>' +
      TK.terminal({ title: 'analyst@osint-lab:~$', btn: 'شاهد whois يعمل', lines: [
        ['cmd', '$ whois sky-kites.example'],
        ['out', 'Domain Name: SKY-KITES.EXAMPLE', 500],
        ['out', 'Registrar: Example Registrar, Inc.'],
        ['hl', '# المسجِّل: الشركة التي باع النطاق. تُرسَل إليها بلاغات الإساءة (Abuse)'],
        ['out', 'Creation Date: 2023-03-18T12:00:00Z', 600],
        ['hl', '# تاريخ الإنشاء: أهم حقل. نطاق عمره يوم واحد ويدّعي أنه بنك = إنذار'],
        ['out', 'Registrant Name: REDACTED FOR PRIVACY', 600],
        ['hl', '# الاسم مخفي بخدمة الخصوصية. هذا شائع وقانوني، وليس دليل إجرام وحده'],
        ['out', 'Registrant Organization: Sky Kites Club'],
        ['out', 'Name Server: NS1.CLOUDHOST.EXAMPLE', 500],
        ['hl', '# خادم الأسماء يخبرك أين يُستضاف الموقع غالباً'],
        ['ok', '# الخلاصة: جهة معلنة، نطاق عمره سنوات، لا مؤشر احتيال']
      ] }) +
      TK.check({ s: 'ظهور Registrant Name: REDACTED FOR PRIVACY في سجل WHOIS يعني بالضرورة أن النطاق احتيالي.', t: false, why: 'إخفاء الاسم بخدمة الخصوصية شائع وقانوني لمواقع حقيقية كثيرة؛ المؤشر الأقوى على الاحتيال هو عمر النطاق القصير، لا إخفاء الاسم وحده.' })),
    TK.s('🧪 مختبر ٤: حقّق في نطاقين بأمر whois', 'Lab 4 — WHOIS on two fictional domains',
      '<div class="card">وصلتك رسالة SMS (مكتوبة في <span class="code">suspicious-sms.txt</span>) تدّعي أنك ربحت جائزة. قارن نطاقها مع نطاق نادي الطائرات.</div>' +
      '<div class="note mt">الطرفية أدناه محاكاة تعمل على أي جهاز دون تثبيت. الأمر <code>whois</code> الحقيقي على جهازك يختلف حسب نظام التشغيل - التفاصيل والبديل على Windows في المختبر القادم.</div>' +
      TK.shell({
        title: 'analyst@osint-lab: ~', user: 'analyst', host: 'osint-lab', cwd: '/home/analyst',
        fs: { home: { analyst: {
          'suspicious-sms.txt': 'تاريخ الاستلام: 2025-05-20\nالنص: مبروك! ربحت جهازاً جديداً. استلمه الآن: http://free-gift-prize.example',
          'checklist.txt': '1) اقرأ الرسالة. 2) whois للنطاق. 3) انظر Creation Date. 4) قارنه بتاريخ الرسالة. 5) لا تضغط الرابط.'
        } } },
        tasks: [
          { d: 'اقرأ الرسالة: <code>cat suspicious-sms.txt</code>', re: '^cat\\s+suspicious-sms\\.txt' },
          { d: 'افحص نطاق الرسالة: <code>whois free-gift-prize.example</code>', re: '^whois\\s+free-gift-prize\\.example' },
          { d: 'افحص نطاق النادي: <code>whois sky-kites.example</code>', re: '^whois\\s+sky-kites\\.example' }
        ],
        cmds: [
          { re: '^whois\\s+sky-kites\\.example\\s*$', out: WHOIS_CLUB, cls: 'ok' },
          { re: '^whois\\s+free-gift-prize\\.example\\s*$', out: WHOIS_SCAM, cls: 'ok' },
          { re: '^whois\\s*$', out: 'Usage: whois [OPTIONS] DOMAIN' },
          { re: '^whois\\s+\\S+', out: 'No match for domain (النطاقات المتاحة في المختبر: sky-kites.example و free-gift-prize.example)' }
        ]
      })),
    TK.s('🧪 مختبر ٥: WHOIS حقيقي على الإنترنت', 'Lab 5 — real WHOIS lookup',
      '<p class="lead">الآن بدل المحاكاة: أدوات حقيقية مجانية. جرّبها على نطاقات علنية مثل نطاق مدرستك أو نطاقات تعليمية.</p>' +
      TK.tool({ e: '🌐', n: 'DNSDumpster', what: 'أداة ويب مجانية تستعلم عن نطاق وتعرض سجلات DNS والنطاقات الفرعية ومعلومات الاستضافة في خريطة بصرية.', why: 'تكمّل WHOIS: بينما WHOIS يخبرك من سجّل النطاق، تخبرك DNSDumpster كيف يُستضاف تقنياً وما نطاقاته الفرعية.', how: 'افتح dnsdumpster.com، اكتب اسم النطاق، واضغط Search لرؤية السجلات والخريطة.', url: 'https://dnsdumpster.com/' }) +
      TK.lab({ t: 'فحص نطاق حقيقي بعدة أدوات', time: '8 د', req: 'متصفح فقط يكفي لإنجاز هذا المختبر. أمر whois في الطرفية اختياري ويعمل مباشرة على Linux وmacOS، لكن Windows لا يملك أمر whois مدمجاً في موجّه الأوامر (Command Prompt) أو PowerShell، فاستخدم أداة الويب ICANN Lookup بدلاً منه - النتيجة نفسها تقريباً وبلا تثبيت.',
        steps: [
          'افتح <code>lookup.icann.org</code> وابحث عن <code>example.com</code> (نطاق محجوز للأمثلة والتوثيق). اقرأ: المسجِّل، تاريخ الإنشاء، خوادم الأسماء.',
          'كرّر البحث مع نطاق مدرستك أو ناديك. هل اسم المالك ظاهر أم مخفي؟ ما المسجِّل؟ منذ كم سنة سُجّل النطاق؟',
          'اختياري لمستخدمي Linux أو macOS: افتح الطرفية وشغّل <code>whois example.com</code> وقارن الحقول بنتيجة ICANN. ملاحظة Windows: لا حاجة لهذه الخطوة؛ خطوة ICANN Lookup أعلاه تعطيك نفس المعلومات من المتصفح مباشرة بلا أمر طرفية.',
          'افتح <code>dnsdumpster.com</code> وابحث عن النطاق نفسه. لاحظ الفرق: DNSDumpster يُظهر سجلات DNS والنطاقات الفرعية وأين يُستضاف الموقع تقنياً، لا من يملكه.',
          'افتح <code>web.archive.org</code> (أرشيف الإنترنت Wayback Machine) واكتب عنوان النطاق نفسه. هل له نسخ محفوظة من سنوات سابقة؟ قارن أقدم نسخة بالموقع الحالي: هل تغيّر المحتوى أو التصميم؟',
          'اكتب ثلاثة أسئلة يجيب عنها WHOIS، وسؤالاً واحداً لا يجيب عنه (مثلاً: من هو الشخص الذي يدير الموقع فعلاً؟).'
        ],
        tools: [{ n: 'ICANN Lookup', u: 'https://lookup.icann.org/' }, { n: 'DNSDumpster', u: 'https://dnsdumpster.com/' }, { n: 'Wayback Machine', u: 'https://web.archive.org/' }],
        warn: 'افحص النطاقات فقط. لا تبحث عن بيانات شخص بعينه لتصل إليه، ولا تتواصل مع صاحب نطاق لا تعرفه.' })),
    TK.s('🏁 تحدي: اقرأ سجلات WHOIS', 'Challenge — interpret the records',
      TK.challenge({ t: 'عمر نطاق الاحتيال', q: 'كم يوماً بين إنشاء النطاق <span class="code">free-gift-prize.example</span> (Creation Date) وتاريخ استلام الرسالة؟', answer: ['1'], hint: 'قارن تاريخ الإنشاء في whois مع تاريخ الاستلام في suspicious-sms.txt.', explain: 'نطاق أُنشئ قبل الرسالة بيوم واحد مؤشر قوي على حملة احتيال: لا تضغط الرابط وأبلغ.', ph: 'عدد الأيام' }) +
      TK.challenge({ t: 'سنة تسجيل نطاق النادي', q: 'في أي سنة أُنشئ النطاق <span class="code">sky-kites.example</span>؟', answer: ['2023'], hint: 'whois sky-kites.example ثم Creation Date.', explain: 'سُجّل النطاق عام 2023، أي بعد التقاط الصورة بسنة. معلومة مهمة لقضية الصورة.', ph: 'السنة' })),
    TK.s('🧪 مختبر ٦: Have I Been Pwned (هل تسرّب حسابي؟)', 'Lab 6 — breach checking',
      '<p class="lead">كثير من التسريبات ينتهي بنشر بريد وكلمة مرور في أماكن علنية. موقع <b>Have I Been Pwned</b> يجمع قوائم التسريبات ويخبرك هل ظهر بريدك فيها. هذا OSINT دفاعي بامتياز.</p>' +
      TK.lab({ t: 'افحص بريدك أنت فقط', time: '7 د', req: 'بريدك الخاص (أو بريد عائلتك بإذنهم). لا تفحص بريد صديق.',
        steps: [
          'افتح <code>haveibeenpwned.com</code> وأدخل بريدك. هل ظهر في تسريب؟ لا تقلق: هذا شائع جداً ولا يعني أنك أخطأت.',
          'إن ظهر: اقرأ اسم الخدمة المتأثرة ونوع البيانات المسرّبة (كلمات مرور؟ أرقام هواتف؟). غيّر كلمة المرور في تلك الخدمة وفي <b>أي حساب أعدت استخدامها فيه</b>.',
          'فعّل المصادقة الثنائية للحسابات المهمة، ثم اشترك في خدمة التنبيه (Notify me) لتصلك رسالة عند أي تسريب جديد.',
          'افتح صفحة <code>haveibeenpwned.com/Passwords</code> واختبر كلمة <b>مثالية ضعيفة</b> مثل password (لا تكتب كلمة مرورك الحقيقية أبداً). كم مرة ظهرت؟',
          'اقرأ كيف تعمل الخدمة بأمان: يحسب متصفحك بصمة SHA-1 للكلمة ويرسل أول 5 خانات فقط، ويقارن الخادم القائمة مع بقية البصمة محلياً (تقنية k-anonymity: طريقة تتيح التحقق دون كشف كلمة المرور الكاملة للخادم، أشبه بأن تسأل صديقاً «هل يوجد في قائمتك رقم يبدأ بـ 5BAA6؟» دون أن تخبره الرقم كاملاً).'
        ],
        tools: [{ n: 'Have I Been Pwned', u: 'https://haveibeenpwned.com/' }, { n: 'CyberChef (لحساب البصمة)', u: 'https://gchq.github.io/CyberChef/' }] }) +
      TK.challenge({ t: 'بصمة كلمة password', q: 'ما أول <b>5 خانات</b> (بأحرف كبيرة) من بصمة SHA-1 للكلمة <span class="code">password</span>؟ (تلميح: CyberChef ← عملية SHA1)', answer: ['5BAA6'], hint: 'ضع النص password في CyberChef وأضف العملية SHA1. خذ أول خمس خانات.', explain: 'البصمة تبدأ بـ 5BAA61E4… وهذه الخمس خانات هي ما يُرسل فقط إلى خدمة HIBP، فلا تعرف الخدمة كلمتك.', ph: 'xxxxx' })),
    TK.s('🪞 مختبر ٧: افحص نفسك (OSINT على ذاتك فقط)', 'Lab 7 — build your own OSINT profile',
      '<div class="warn">هذا المختبر عن <b>نفسك أنت فقط</b>. لا تبحث عن زميل أو معلّم أو أي شخص آخر، حتى لو بدافع الفضول.</div>' +
      TK.lab({ t: 'ملفي الرقمي كما يراه الغريب', time: '9 د', req: 'ورقة أو ملف ملاحظات. استخدم نافذة تصفح خاصة (Incognito) حتى لا تتأثر النتائج بحسابك.',
        steps: [
          'ابحث عن اسمك الكامل بين علامتي اقتباس: <code>"اسمك الكامل"</code> ثم اسم المستخدم الذي تستخدمه في الألعاب والتواصل. سجّل كل ما يظهر.',
          'ابحث عن اسم المستخدم بدون @ في <code>google.com</code>. هل يربط حساباتك ببعضها؟',
          'ارفع صورة ملف حسابك الشخصي إلى Google Lens أو TinEye. هل تظهر في مواقع لا تعرفها؟',
          'افتح <code>web.archive.org</code> واكتب رابط حسابك العلني أو مدونتك القديمة إن وُجدت. هل توجد نسخ محفوظة من منشورات أو معلومات حذفتها سابقاً؟',
          'افتح حساباتك الأهم بعين الغريب (من نافذة خاصة): ما الذي يراه من يزور ملفك دون أن يصادقك؟ (الاسم الحقيقي؟ المدرسة؟ الحي؟ تاريخ الميلاد؟)',
          'املأ الجدول في ورقتك: <b>ما وجدته | أين | درجة الخطورة (منخفضة/متوسطة/عالية) | ما سأفعله</b>. مثال: «اسم مدرستي في السيرة التعريفية | عالية | سأحذفه».'
        ],
        tools: [{ n: 'Google Lens', u: 'https://lens.google.com/' }, { n: 'TinEye', u: 'https://tineye.com/' }, { n: 'Wayback Machine', u: 'https://web.archive.org/' }],
        tip: 'إن وجدت شيئاً مقلقاً (صورة لك لم تنشرها، حساب يتحدث باسمك) فأخبر وليّ أمرك أو معلّمك فوراً، ولا ترد على المتصل.' }) +
      TK.tool({ e: '🔍', n: 'WhatsMyName', what: 'أداة ويب مجانية تتحقق من اسم مستخدم واحد مقابل مئات المواقع والمنصات دفعة واحدة.', why: 'تكشف إعادة استخدام اسم المستخدم نفسه عبر منصات متعددة، وهذا مؤشر مهم على الأثر الرقمي (Digital Footprint) وسهولة ربط حساباتك ببعضها. الأثر الرقمي يعني كل ما تتركه خلفك على الإنترنت من آثار - مثل بصمة قدم في الرمل - يمكن لأي شخص تتبّعها لاحقاً ليكتشف أين كنت وماذا فعلت.', how: 'افتح whatsmyname.app، اكتب اسم المستخدم في الحقل، واضغط Search. كل نتيجة «موجود» تعني وجود حساب بهذا الاسم في تلك المنصة.', url: 'https://whatsmyname.app/' }) +
      TK.lab({ t: 'افحص اسم مستخدمك عبر WhatsMyName', time: '6 د', req: 'اسم مستخدم تستخدمه أنت في الألعاب أو التواصل (ليس اسم أي شخص آخر)، واتصال إنترنت.',
        steps: [
          'افتح <code>whatsmyname.app</code> واكتب اسم المستخدم الذي تستخدمه أنت (مثلاً <code>nour_gamer_08</code>)، ثم اضغط Search.',
          'انتظر حتى تنتهي عملية الفحص عبر مئات المواقع، وسجّل أسماء 3 إلى 5 منصات ظهر فيها اسم المستخدم كموجود.',
          'لكل نتيجة: هل تتذكّر أنك سجّلت في تلك المنصة فعلاً؟ هل ما زلت تستخدم الحساب أم نسيته؟',
          'إن وجدت حساباً قديماً لا تستخدمه، اكتب في ملاحظاتك أنك ستحذفه أو تغيّر كلمة مروره، فالحساب المنسيّ هدف سهل للاختراق.',
          'اكتب استنتاجاً من سطرين: هل اسم المستخدم هذا يربط حساباتك ببعضها بسهولة؟ هل تحتاج أسماء مختلفة للمنصات المهمة لديك؟'
        ],
        tools: [{ n: 'WhatsMyName', u: 'https://whatsmyname.app/' }],
        warn: 'افحص اسم مستخدمك أنت فقط. لا تكتب اسم مستخدم شخص آخر حتى لو كان صديقاً أو أخاً، فهذا تتبّع لحساباته دون إذنه.' }) +
      TK.table(['ما وجدته', 'مثال', 'الخطورة', 'الإجراء'], [
        ['اسم حقيقي + مدرسة', 'اسمك في السيرة التعريفية', 'عالية', 'احذف المدرسة، واجعل الحساب خاصاً'],
        ['اسم مستخدم موحّد', 'نفسه في 4 منصات', 'متوسطة', 'استخدم أسماء مختلفة للمنصات المهمة'],
        ['صورة بموقع GPS', 'صورة حيّك مرسلة كملف', 'عالية', 'أوقف وسم الموقع واحذف EXIF قبل الإرسال']
      ])),
    TK.s('🛡️ مختبر ٨: قائمة تحصين الخصوصية', 'Lab 8 — privacy hardening checklist',
      '<p class="lead">بعد ما اكتشفته عن نفسك، سدّ الثغرات. هذه القائمة تطبّقها الآن على جوالك وحساباتك.</p>' +
      TK.lab({ t: 'حصّن خصوصيتك', time: '5 د', req: 'جوالك وأهم حسابين لديك.',
        steps: [
          '<b>الكاميرا:</b> أوقف «وسم الموقع» (Location tags / Save location) في إعدادات الكاميرا.',
          '<b>قبل إرسال صورة مهمة كملف:</b> احذف بياناتها بـ <code>exiftool -all= -o نسخة.jpg الأصل.jpg</code> أو أرسلها كصورة عادية عبر تطبيق يضغطها. (ملاحظة Windows: لا يأتي exiftool مثبّتاً مسبقاً على أي نظام تشغيل. نزّل النسخة التنفيذية المجانية لنفس الأداة من <span class="code">exiftool.org</span> - هي الأداة نفسها بالضبط، فقط خطوة تنزيل وتثبيت مختلفة عن Linux/macOS - ثم شغّل الأمر نفسه من موجّه الأوامر أو PowerShell.)',
          '<b>الحساب:</b> اجعله خاصاً، وأزل المدرسة والحيّ وتاريخ الميلاد من السيرة التعريفية، ولا تظهر بالزي المدرسي.',
          '<b>الأسماء:</b> اجعل اسم المستخدم للمنصات المهمة مختلفاً عن اسمك الحقيقي وعن ألعابك.',
          '<b>الحماية:</b> كلمة مرور مختلفة لكل حساب، مصادقة ثنائية، واشتراك في تنبيهات Have I Been Pwned.',
          '<b>الأصدقاء:</b> راجع قائمة المتابعين واحذف من لا تعرفه في الواقع.'
        ], tip: 'التزم بخطوتين اليوم وخطوتين غداً، فالتغيير الصغير المستمر أفضل من خطة كبيرة تُنسى.' })),
    TK.s('🃏 صنّف: أي معلومة تكشف ماذا؟', 'Classify — what each clue reveals',
      TK.classify({
        buckets: [{ t: 'أين؟', e: '📍' }, { t: 'من؟', e: '👤' }, { t: 'متى؟', e: '🕔' }],
        items: [
          { t: 'GPS Position: 30 deg 2′ 39.84″ N', b: 0, why: 'الإحداثيات تحدد المكان.' },
          { t: 'Offset Time Original: +02:00', b: 0, why: 'فرق التوقيت يلمّح إلى المنطقة الزمنية.' },
          { t: 'Artist: Layla Nasser', b: 1, why: 'حقل المصوّر يكشف اسماً.' },
          { t: 'اسم المستخدم nour_gamer_08 في عدة منصات', b: 1, why: 'تكرار الاسم يربط الحسابات بصاحب واحد.' },
          { t: 'Date/Time Original: 2022:09:03', b: 2, why: 'وقت التقاط الصورة.' },
          { t: 'Creation Date في WHOIS', b: 2, why: 'متى أُنشئ النطاق، وهو مؤشر على عمره وصدقيته.' },
          { t: 'Registrant Organization: Sky Kites Club', b: 1, why: 'الجهة التي سجّلت النطاق.' }
        ]
      })),
    TK.s('🎭 سيناريو: ماذا تفعل لو وجدت معلومة عن شخص؟', 'Scenario — ethics in practice',
      TK.scenario({ steps: [
        { s: 'أثناء بحثك عن صورتك وجدت أن زميلاً نشر في موقع علني ورقة فيها اسم مدرستك وأرقام هواتف لعدد من الطلاب. ماذا تفعل؟', o: [
          { t: 'أنشر الرابط في مجموعة الصف ليعرف الجميع', ok: false, fb: 'نشر الرابط يزيد انتشار البيانات الشخصية ويؤذي أصحابها.' },
          { t: 'لا أنسخ البيانات، وأبلغ المعلّم أو الجهة المسؤولة بالرابط ليطلبوا حذفها', ok: true, fb: 'صحيح: الإبلاغ الهادئ يحمي الجميع ولا ينشر المعلومة.' },
          { t: 'أتصل بالأرقام لأعرف إن كانت حقيقية', ok: false, fb: 'الاتصال تجاوز لحدودك وقد يزعج أو يخيف أصحابها.' }] },
        { s: 'يطلب منك صديق أن تخبره من أين التُقطت صورة أرسلتها له فتاة ليتعرف عليها. ماذا تجيب؟', o: [
          { t: 'أقرأ لها EXIF وأعطيه الموقع', ok: false, fb: 'هذا تتبّع لشخص بدون إذنها وقد يعرّضها للخطر.' },
          { t: 'أرفض وأشرح له أن تتبّع الناس مرفوض، وأنصحه بالتواصل المباشر المحترم إن كان يعرفها', ok: true, fb: 'قرار صحيح: OSINT لحماية الناس لا لملاحقتهم.' },
          { t: 'أعطيه تلميحاً فقط عن المدينة', ok: false, fb: 'التلميح يكشف جزءاً من الخصوصية أيضاً.' }] }
      ] })),
    TK.s('🏁 تحدي الإغلاق: من صاحب الصورة؟', 'Final challenge — close the case',
      '<p class="lead">ارجع إلى مختبر exiftool ومختبر whois، ثم أغلق القضية 0417. الإجابات من الأدلة فقط، وكلها خيالية.</p>' +
      TK.challenge({ t: 'المدينة', q: 'طابق إحداثيات الصورة مع <span class="code">known-places.txt</span>. ما <b>المدينة</b> الفعلية للصورة؟ (بالإنجليزية)', answer: ['Cairo'], hint: 'إحداثياتها 30.04, 31.24. ابحث عن هذين الرقمين في الجدول.', explain: 'الصورة التُقطت في القاهرة، وليس في الإسكندرية كما ادّعى الموقع.', ph: 'City' }) +
      TK.challenge({ t: 'المصوّرة', q: 'ما <b>الاسم الأول</b> للمصوّرة المسجّلة في حقل <span class="code">Artist</span>؟', answer: ['Layla'], hint: 'ابحث عن Artist في مخرجات exiftool.', explain: 'حقل Artist وCopyright يشيران إلى Layla Nasser، لا إلى النادي. لكن تذكّر أن EXIF قابلة للتعديل، فهي دليل وليست إثباتاً قاطعاً.', ph: 'الاسم الأول' }) +
      TK.challenge({ t: 'الفارق الزمني', q: 'كم <b>سنة</b> تفصل بين التقاط الصورة (Date/Time Original) وإنشاء نطاق النادي (Creation Date)؟', answer: ['1'], hint: 'سنة التقاط الصورة 2022، وسنة إنشاء النطاق ابحث عنها في WHOIS.', explain: 'الصورة أقدم من النطاق بسنة، وأقدم بسنتين من عام 2024 الذي يدّعيه الموقع. الخلاصة: الادعاء مشكوك فيه وصاحب الحق المعلن في الصورة شخص آخر.', ph: 'عدد السنوات' }) +
      TK.challenge({ t: 'الخلاصة', q: 'ما أفضل وصف للادعاء «من مهرجان 2024 في الإسكندرية» بحسب الأدلة؟ اكتب كلمة واحدة: <span class="code">supported</span> أو <span class="code">doubtful</span>', answer: ['doubtful'], hint: 'التاريخ والمدينة كلاهما يخالفان الادعاء.', explain: 'الأدلة تخالف الادعاء في التاريخ والمكان، فهو مشكوك فيه (doubtful). المحلل الجيد يقول «الأدلة تشير إلى…» ولا يتهم أحداً.', ph: 'supported / doubtful' })),
    TK.s('📋 ورقة الغش: أدوات OSINT اليوم', 'Cheat sheet',
      TK.table(['المهمة', 'الأداة / الأمر', 'ماذا تستخرج؟'], [
        ['بحث دقيق', '<code>site: filetype: intitle: inurl: -</code>', 'مستندات وصفحات علنية'],
        ['أصل صورة', 'Google Lens, TinEye', 'أقدم ظهور ومصادر أخرى'],
        ['بيانات صورة', '<code>exiftool photo.jpg</code>', 'جهاز، وقت، GPS، مصوّر'],
        ['تنظيف صورة', '<code>exiftool -all= -o out.jpg in.jpg</code> (Windows: نزّل exiftool من exiftool.org أولاً)', 'نسخة بلا بيانات وصفية'],
        ['هوية نطاق', '<code>whois domain</code> (Linux/macOS) أو ICANN Lookup (يعمل على أي جهاز بما فيه Windows)', 'المسجِّل وتاريخ الإنشاء وخوادم الأسماء'],
        ['تسريبات', 'haveibeenpwned.com', 'هل ظهر بريدك في تسريب']
      ]) + TK.terms([['Metadata (البيانات الوصفية)', 'بيانات عن الملف نفسه مثل التاريخ والجهاز والموقع.'], ['Dork', 'استعلام بحث يستخدم عوامل خاصة لتضييق النتائج.'], ['Registrar (المسجِّل)', 'الشركة التي سجّلت النطاق لصاحبه.']]))
  ],
  quiz: [
    { q: 'لماذا يُعدّ استخدام عوامل مثل <code>site:</code> و<code>filetype:</code> في Google «Dorking» ولا يُعدّ اختراقاً؟', ok: 'لأنه يعتمد على عوامل بحث رسمية موثّقة دون دخول إلى أي نظام', no: ['لأنه يتيح الدخول لحسابات محمية بلا كلمة مرور', 'لأنه أسلوب سري غير معروف لمحركات البحث', 'لأنه يتجاوز إعدادات خصوصية المواقع'], why: 'Dorking مجرد صياغة دقيقة لاستعلام بحث عادي، بلا دخول إلى أي نظام أو تجاوز لأي حماية.' },
    { q: 'ماذا يفعل الاستعلام <code>site:school.edu filetype:pdf</code>؟', ok: 'يعرض ملفات PDF فقط داخل موقع school.edu', no: ['يعرض كل صفحات الإنترنت التي تذكر school.edu', 'يعرض كل الملفات من أي نوع داخل school.edu', 'يستبعد موقع school.edu من النتائج'], why: 'العامل site: يحصر النتائج داخل ذلك الموقع فقط، وfiletype:pdf يحصرها في ملفات PDF.' },
    { q: 'ما الفرق بين حقل <code>Date/Time Original</code> وحقل <code>File Modification Date</code> في مخرجات exiftool؟', ok: 'الأول وقت التصوير الحقيقي، والثاني وقت حفظ الملف على الجهاز', no: ['لا فرق، كلاهما يعني نفس الشيء', 'الأول يخص الجهاز والثاني يخص المصوّر', 'الأول وقت الحفظ والثاني وقت التصوير'], why: 'File Modification Date يخص حفظ الملف، أما Date/Time Original فهو وقت التصوير الحقيقي للصورة.' },
    { q: 'إذا أظهر WHOIS أن اسم صاحب النطاق <code>REDACTED FOR PRIVACY</code>، ماذا يعني هذا؟', ok: 'استخدام خدمة خصوصية شائعة وقانونية، وليس دليلاً مؤكداً على الاحتيال', no: ['دليل مؤكد على أن النطاق احتيالي', 'النطاق غير مسجَّل رسمياً', 'لا يمكن لأي أداة الوصول لمعلومات هذا النطاق'], why: 'إخفاء الاسم بخدمة الخصوصية شائع وقانوني؛ المؤشر الأقوى على الاحتيال هو عمر النطاق وتاريخ إنشائه، لا إخفاء الاسم وحده.' },
    { q: 'وصلتك رسالة SMS تدّعي ربح جائزة، ونطاق الرابط فيها أُنشئ قبل يوم واحد فقط من وصول الرسالة. ماذا يدل هذا؟', ok: 'مؤشر قوي على حملة احتيال', no: ['دليل على أن الموقع جديد وموثوق', 'لا علاقة بين تاريخ النطاق ومصداقية الرسالة', 'يعني أن الرسالة من جهة رسمية حديثة'], why: 'المحتالون غالباً ينشئون نطاقات جديدة لحملاتهم ثم يتخلّون عنها بسرعة، فنطاق عمره يوم واحد مؤشر إنذار.' },
    { q: 'ظهر بريدك الإلكتروني في تسريب على Have I Been Pwned. ما الحل الصحيح؟', ok: 'تغيير كلمة المرور في كل حساب استُخدمت فيه، وتفعيل المصادقة الثنائية', no: ['حذف البريد الإلكتروني نفسه فوراً', 'الانتظار دون أي إجراء لأنه أمر شائع', 'إرسال كلمة المرور للموقع لتأكيد الهوية'], why: 'الحل الصحيح هو تغيير كلمة المرور في كل حساب استُخدمت فيه نفس الكلمة وتفعيل المصادقة الثنائية، لا حذف البريد.' },
    { q: 'في تدريب OSINT بهذه الوحدة، عن من يحقّ لك البحث؟', ok: 'عن نفسك فقط، أو بيانات خيالية ومؤسسية علنية', no: ['عن زملائي ومعلّمي دون الحاجة لإذنهم', 'عن أي شخص بشرط عدم إخباره بالنتيجة', 'عن أي حساب تواصل اجتماعي عام أعثر عليه'], why: 'فحص الذات والبيانات الخيالية أو المؤسسية العلنية آمن قانونياً وأخلاقياً، أما تتبّع الأشخاص فانتهاك لخصوصيتهم.' },
    { q: 'ما وظيفة أداة WhatsMyName؟', ok: 'التحقق إن وُجد حساب بنفس اسم المستخدم في مئات المنصات دفعة واحدة', no: ['اختراق كلمات مرور الحسابات للتحقق من ملكيتها', 'حذف الحسابات القديمة غير المستخدمة تلقائياً', 'كشف كلمة مرور صاحب اسم المستخدم'], why: 'WhatsMyName لا تخترق شيئاً، فقط تتحقق عبر طلبات علنية هل يوجد حساب بنفس الاسم في مواقع متعددة، بلا كلمات مرور.' },
    { q: 'ما وظيفة أرشيف الإنترنت Wayback Machine (web.archive.org)؟', ok: 'الاحتفاظ بنسخ تاريخية من صفحات الويب، حتى لو حُذف المحتوى الأصلي', no: ['حذف الصفحات القديمة من الإنترنت نهائياً', 'فحص كلمات المرور المسرّبة لبريد معيّن', 'تسجيل نطاقات جديدة للمواقع'], why: 'هذه وظيفته الأساسية: تخزين لقطات (Snapshots) من صفحات الويب عبر الزمن، فيبقى المحذوف محفوظاً فيه غالباً.' },
    { q: 'ما الفرق بين WHOIS وأداة DNSDumpster؟', ok: 'WHOIS يكشف من سجّل النطاق، وDNSDumpster يكشف كيف يُستضاف تقنياً ونطاقاته الفرعية', no: ['DNSDumpster يكشف اسم المالك الحقيقي بدل WHOIS', 'كلاهما يفعل نفس الشيء بالضبط', 'WHOIS يحتاج اختراقاً وDNSDumpster لا يحتاج'], why: 'DNSDumpster يعرض سجلات DNS والنطاقات الفرعية ومعلومات الاستضافة، وليس اسم المالك؛ معرفة المالك مهمة WHOIS.' }
  ],
  audit: [
    'نفّذت 5 استعلامات Dork باستخدام site: و filetype: و intitle: و inurl:',
    'صنّفت حالات الأخلاقيات: ما يحقّ لي بحثه وما لا يحقّ',
    'جرّبت البحث العكسي بصورة في Google Lens و TinEye',
    'قرأت مخرجات exiftool واستخرجت الجهاز والتاريخ والإحداثيات',
    'فحصت نطاقين بـ whois وحدّدت النطاق المشبوه',
    'فحصت بريدي في Have I Been Pwned وعرفت ماذا أفعل عند وجود تسريب',
    'أنجزت ملفي الرقمي عن نفسي فقط وطبّقت خطوتين على الأقل من قائمة التحصين',
    'فحصت اسم مستخدمي عبر WhatsMyName وسجّلت المنصات التي ظهر فيها',
    'أغلقت قضية «من صاحب الصورة؟» بالأدلة'
  ],
  recap: [
    'OSINT = جمع المعلومات من مصادر علنية فقط، ثم الربط والتوثيق بحدود أخلاقية وقانونية',
    'الصور والنطاقات تحمل أدلة: EXIF يكشف الجهاز والوقت والموقع، وWHOIS يكشف عمر النطاق وجهة التسجيل',
    'أفضل تدريب هو فحص نفسك ثم تحصين خصوصيتك: موقع الكاميرا، حسابات خاصة، كلمات مرور مختلفة'
  ],
  homework: 'اكتب تقريراً من صفحة واحدة عن «ملفي الرقمي»: ماذا وجدت عن نفسك، ما درجة خطورته، وما الثلاث خطوات التي طبّقتها. لا تذكر أي بيانات حساسة حقيقية في التقرير الذي ترسله للمدرّب.',
  resources: [
    { t: 'ExifTool (الموقع الرسمي)', u: 'https://exiftool.org/' },
    { t: 'Have I Been Pwned', u: 'https://haveibeenpwned.com/' },
    { t: 'ICANN Lookup', u: 'https://lookup.icann.org/' },
    { t: 'TinEye — البحث العكسي بالصور', u: 'https://tineye.com/' },
    { t: 'CyberChef', u: 'https://gchq.github.io/CyberChef/' },
    { t: 'WhatsMyName — فحص اسم المستخدم عبر المنصات', u: 'https://whatsmyname.app/' },
    { t: 'Wayback Machine — أرشيف الإنترنت', u: 'https://web.archive.org/' },
    { t: 'DNSDumpster — استطلاع DNS للنطاقات', u: 'https://dnsdumpster.com/' }
  ],
  next: 'في الوحدة القادمة: ستنتقل من جمع المعلومات العلنية إلى فهم كيف تتواصل الأجهزة عبر الشبكات.'
});
