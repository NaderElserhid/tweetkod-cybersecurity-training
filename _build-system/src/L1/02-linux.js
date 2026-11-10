/* المستوى الأول — الوحدة 2: Linux من الصفر (وحدة نموذجية تُستخدم كمرجع لبقية الوحدات) */
TK.module({
  id: 'L1-02', level: 1, num: 2, slug: 'Linux-من-الصفر',
  title: 'Linux من الصفر: الطرفية أداتك الأولى', en: 'Linux from Zero — the Terminal is Your First Tool', emoji: '🐧',
  lead: 'في هذه الوحدة ستفهم أولاً كيف يُبنى نظام Linux ومن أين أتى، ثم ستتحكم به بالكتابة فقط: تتنقل بين المجلدات، تقرأ الملفات، تبحث عن أدلة داخل سجلات حقيقية، وتحل تحديات بنقاط. النظرية موجزة ومصوّرة، والباقي تطبيق بيدك.',
  tags: ['🛠️ طرفية تفاعلية داخل الصفحة', '📦 إدارة الحزم APT', '⌨️ +15 أمراً عملياً'],
  agenda: [
    { t: '💡 لماذا Linux؟ + بنية النظام والتاريخ والتوزيعات', time: '16 د' },
    { t: '🧪 مختبر ١: التنقل وقراءة الملفات (ls, cd, cat)', time: '18 د' },
    { t: '🏁 تحدي: اعثر على العلم المخفي', time: '6 د' },
    { t: '☕ استراحة', time: '10 د' },
    { t: '🧪 مختبر ٢: الصلاحيات والبحث (grep, find, |)', time: '20 د' },
    { t: '📦 إدارة الحزم بـ APT', time: '7 د' },
    { t: '🧪 مختبر ٣: أوامر يومية أكثر (mkdir, cp, mv, rm, sort...)', time: '20 د' },
    { t: '🏁 تحقيق: من يهاجم الخادم؟', time: '9 د' }
  ],
  slides: [
    TK.concept({
      t: 'لماذا يستخدم محترفو الأمن Linux؟', en: 'Why security people live in Linux', min: '5 د',
      body: '<p>أنظمة التشغيل التي تعرفها (الجوال، Windows) تُدار غالباً بواجهة رسومية: أيقونات تضغط عليها بإصبعك أو فأرتك. لكن هناك طريقة أخرى: <b>الطرفية (Terminal)</b>، وهي نافذة نصية بسيطة تكتب فيها «أوامر» — جمل قصيرة بالإنجليزية يفهمها النظام وينفّذها فوراً، بدل البحث عن أيقونة بالفأرة. معظم الخوادم في العالم تعمل بـ Linux، ومعظم أدوات الأمن (Nmap, Wireshark, Kali) صُمّمت للعمل من الطرفية. فالطرفية تتيح لك التحكم بالنظام بالكتابة مباشرة: أسرع من الفأرة، وأدق، ويمكن تكرار نفس الأوامر تلقائياً (أتمتة) لاحقاً بسكربت.</p>' +
        '<div class="grid g3 mt"><div class="tag">🖥️ الخوادم والمواقع</div><div class="tag">🛠️ أدوات الاختراق الأخلاقي</div><div class="tag">🔎 تحليل السجلات والأدلة</div></div>' +
        TK.check({ s: 'معظم أدوات الأمن السيبراني المعروفة مثل Nmap وWireshark صُمّمت للعمل من الطرفية لا من واجهة رسومية فقط.', t: true, why: 'صحيح: محترفو الأمن يستخدمون الطرفية لأنها أسرع وأدق وتتيح الأتمتة بالسكربتات.' }),
      key: 'من يتقن الطرفية يتقن نصف أدوات الأمن السيبراني.'
    }),

    /* جديد — بنية Linux الأربع طبقات (رسم بياني) */
    TK.s('🏗️ من ضغطة المفتاح إلى المعالج: بنية Linux', 'Diagram — the four layers of Linux',
      '<p class="lead">قبل أن تكتب أمرك الأول، من المفيد أن ترى الصورة الكاملة: أي نظام Linux مبني من أربع طبقات، كل طبقة تتحدث فقط مع الطبقة التي فوقها وتحتها مباشرة. هذا التقسيم هو سبب استقرار Linux وأمانه: برنامج في الأعلى لا يستطيع لمس العتاد مباشرة إلا عبر هذه السلسلة.</p>' +
      '<div class="card" style="padding:18px">' +
      '<svg viewBox="0 0 640 410" style="width:100%;height:auto;display:block" role="img" aria-label="رسم بنية Linux بأربع طبقات">' +
      '<rect x="40" y="4" width="560" height="64" rx="14" style="fill:rgba(247,178,40,.16);stroke:var(--yellow);stroke-width:2"/>' +
      '<text x="320" y="30" text-anchor="middle" style="fill:var(--text);font-weight:900;font-size:17px">تطبيقات المستخدم (User Space)</text>' +
      '<text x="320" y="52" text-anchor="middle" style="fill:var(--muted);font-size:12px">المتصفح، nmap، أي برنامج تشغّله</text>' +
      '<rect x="220" y="76" width="200" height="30" rx="15" style="fill:var(--surface2);stroke:var(--line);stroke-width:1.5"/>' +
      '<text x="320" y="96" text-anchor="middle" style="fill:var(--blue);font-weight:800;font-size:13px">⇅ أوامر وتُطبَع النتائج</text>' +
      '<rect x="40" y="118" width="560" height="64" rx="14" style="fill:rgba(0,158,226,.14);stroke:var(--blue);stroke-width:2"/>' +
      '<text x="320" y="144" text-anchor="middle" style="fill:var(--text);font-weight:900;font-size:17px">الصدفة Shell (مثل bash)</text>' +
      '<text x="320" y="166" text-anchor="middle" style="fill:var(--muted);font-size:12px">تقرأ ما تكتبه وتترجمه لطلب يفهمه النظام</text>' +
      '<rect x="220" y="190" width="200" height="30" rx="15" style="fill:var(--surface2);stroke:var(--line);stroke-width:1.5"/>' +
      '<text x="320" y="210" text-anchor="middle" style="fill:var(--blue);font-weight:800;font-size:13px">⇅ طلبات نظام Syscalls</text>' +
      '<rect x="40" y="232" width="560" height="64" rx="14" style="fill:rgba(0,158,226,.28);stroke:var(--blue);stroke-width:2"/>' +
      '<text x="320" y="258" text-anchor="middle" style="fill:var(--text);font-weight:900;font-size:17px">النواة Kernel</text>' +
      '<text x="320" y="280" text-anchor="middle" style="fill:var(--muted);font-size:12px">تتحكم مباشرة بالمعالج والذاكرة والملفات والشبكة</text>' +
      '<rect x="220" y="304" width="200" height="30" rx="15" style="fill:var(--surface2);stroke:var(--line);stroke-width:1.5"/>' +
      '<text x="320" y="324" text-anchor="middle" style="fill:var(--blue);font-weight:800;font-size:13px">⇅ تعليمات للعتاد</text>' +
      '<rect x="40" y="346" width="560" height="64" rx="14" style="fill:var(--chip);stroke:var(--line);stroke-width:2"/>' +
      '<text x="320" y="372" text-anchor="middle" style="fill:var(--text);font-weight:900;font-size:17px">العتاد Hardware</text>' +
      '<text x="320" y="394" text-anchor="middle" style="fill:var(--muted);font-size:12px">المعالج (CPU)، الذاكرة (RAM)، القرص، كرت الشبكة</text>' +
      '</svg></div>' +
      '<p class="tc" style="font-size:.85rem;color:var(--muted);margin-top:8px">حين تكتب <code>ls</code> في الصدفة، هي لا تقرأ الملفات بنفسها؛ تطلب من النواة ذلك، والنواة وحدها تتحدث مع القرص مباشرة.</p>' +
      TK.check({ s: 'برنامج في طبقة تطبيقات المستخدم (User Space) يستطيع التحكم بالعتاد مباشرة دون المرور بالنواة.', t: false, why: 'لا يمر أي طلب إلى العتاد إلا عبر النواة (Kernel)؛ هذا الفصل هو ما يمنع برنامجاً واحداً من إفساد النظام كله.' })),

    /* جديد — تاريخ موجز + عائلة التوزيعات */
    TK.s('🕰️ قصة Linux في دقيقة + عائلة التوزيعات', 'A one-minute history + the distro family',
      '<p class="lead">Linux ليس نظاماً واحداً، بل نواة (Kernel) حرة ومفتوحة المصدر يبني فوقها آلاف الأشخاص والشركات نسخاً مختلفة تسمى <b>توزيعات (Distributions)</b>، كل واحدة بشخصية وغرض مختلف.</p>' +
      '<svg viewBox="0 0 680 170" style="width:100%;height:auto;display:block" role="img" aria-label="خط زمني مختصر لتاريخ Linux">' +
      '<line x1="50" y1="85" x2="630" y2="85" style="stroke:var(--line);stroke-width:3"/>' +
      '<circle cx="110" cy="85" r="9" style="fill:var(--blue)"/><line x1="110" y1="76" x2="110" y2="50" style="stroke:var(--blue);stroke-width:2"/>' +
      '<text x="110" text-anchor="middle"><tspan x="110" y="34" style="fill:var(--text);font-weight:900;font-size:13px">1969</tspan><tspan x="110" y="50" style="fill:var(--muted);font-size:11px">ولادة Unix</tspan></text>' +
      '<circle cx="270" cy="85" r="9" style="fill:var(--blue)"/><line x1="270" y1="94" x2="270" y2="120" style="stroke:var(--blue);stroke-width:2"/>' +
      '<text x="270" text-anchor="middle"><tspan x="270" y="136" style="fill:var(--text);font-weight:900;font-size:13px">1991</tspan><tspan x="270" y="152" style="fill:var(--muted);font-size:11px">تورفالدز ينشر نواة Linux</tspan></text>' +
      '<circle cx="430" cy="85" r="9" style="fill:var(--blue)"/><line x1="430" y1="76" x2="430" y2="50" style="stroke:var(--blue);stroke-width:2"/>' +
      '<text x="430" text-anchor="middle"><tspan x="430" y="34" style="fill:var(--text);font-weight:900;font-size:13px">1993</tspan><tspan x="430" y="50" style="fill:var(--muted);font-size:11px">أولى التوزيعات</tspan></text>' +
      '<circle cx="590" cy="85" r="9" style="fill:var(--yellow)"/><line x1="590" y1="94" x2="590" y2="120" style="stroke:var(--yellow);stroke-width:2"/>' +
      '<text x="590" text-anchor="middle"><tspan x="590" y="136" style="fill:var(--text);font-weight:900;font-size:13px">اليوم</tspan><tspan x="590" y="152" style="fill:var(--muted);font-size:11px">مئات التوزيعات</tspan></text>' +
      '</svg>' +
      TK.cards({ cols: 4, items: [
        { e: '🟠', t: 'Ubuntu', b: 'الأسهل للمبتدئين: واجهة رسومية ودودة ومجتمع ضخم. خيار جيد لأول جهاز Linux لك.' },
        { e: '🔴', t: 'Debian', b: 'مستقرة جداً وتُعدّ أساس توزيعات كثيرة أخرى (ومنها Ubuntu نفسها). تُفضَّل على الخوادم.' },
        { e: '🐉', t: 'Kali Linux', b: 'مبنية على Debian وجاهزة بمئات أدوات اختبار الاختراق مثبّتة مسبقاً. هذه توزيعتنا في هذه الدورة.' },
        { e: '🔷', t: 'Arch Linux', b: 'للمحترفين: تبني نظامك حزمة حزمة بنفسك لتتعلم كل تفصيلة، وليست خياراً للمبتدئين.' }
      ] }) +
      TK.check({ s: 'كل توزيعات Linux (Ubuntu وKali وArch وغيرها) تستخدم في جوهرها نفس نواة Linux، لكنها تختلف فيما يحيط بها.', t: true, why: 'التوزيعات تشترك في النواة، وتختلف في البرامج المثبّتة مسبقاً وأدوات إدارة الحزم وسهولة الاستخدام والغرض منها.' })),

    /* جديد — Linux أم Windows؟ */
    TK.s('⚖️ لماذا نتدرّب على Linux لا Windows هنا؟', 'Linux vs. Windows for security work',
      '<p class="lead">Windows ليس أسوأ من Linux، لكن لكل منهما ساحته. اضغط الزرين لترى الفرق من زاوية الأمن السيبراني تحديداً.</p>' +
      TK.compare({
        a: { t: '🐧 Linux', html: '<ul class="clean"><li>مفتوح المصدر ومجاني بالكامل: يمكنك رؤية كوده وتعديله.</li><li>الطرفية جزء أساسي من كل استخدام، لا إضافة اختيارية.</li><li>أغلب أدوات الأمن (Nmap, Wireshark, Metasploit...) صُمّمت له أولاً.</li><li>يدير أغلب خوادم الإنترنت والسحابة وأجهزة الشبكات.</li></ul>' },
        b: { t: '🪟 Windows', html: '<ul class="clean"><li>الأكثر انتشاراً على أجهزة المستخدمين والألعاب والشركات.</li><li>واجهة رسومية أولاً؛ PowerShell موجود لكنه أقل استخداماً يومياً من معظم المستخدمين.</li><li>بعض أدوات الأمن لها نسخة Windows، لكن أقل مرونة من أصلها على Linux.</li><li>هدف شائع للهجمات لأنه الأكثر انتشاراً على أجهزة الأفراد، فمعرفته أيضاً مهمة لاحقاً.</li></ul>', bad: false }
      }) +
      TK.check({ s: 'تعلّم Linux يعني أنك لن تحتاج أبداً للتعامل مع Windows في مجال الأمن السيبراني.', t: false, why: 'العكس: محلل الأمن الجيد يفهم النظامين، لأن أجهزة الضحايا والشركات غالباً تعمل بـ Windows حتى لو كانت أدوات الهجوم والدفاع الأساسية مبنية على Linux.' })),

    TK.s('🎬 رحلة الأمر: ماذا يحدث عندما تضغط Enter؟', 'Animated: the life of a command',
      '<p class="lead">الطرفية هي النافذة التي تكتب فيها، لكن من يقرأ كتابتك فعلياً هو برنامج صغير داخلها اسمه <b>الصدفة (Shell)</b> — فكّر فيه كمترجم بينك وبين النظام: يستقبل النص الذي كتبته، يفهم ما تقصده، ثم يطلب من النظام تنفيذه. اضغط «الخطوة التالية» لترى كيف يمرّ الأمر <span class="code">ls</span> بين أنت والنظام.</p>' +
      TK.steps({
        a: { e: '👩‍💻', l: 'أنت (الطرفية)' }, b: { e: '🐧', l: 'نواة Linux' },
        steps: [
          { icon: '', at: 'mid', cap: 'أنت جاهز: الطرفية تنتظر أمراً بعد علامة $' },
          { icon: '⌨️', at: 'a', cap: '١) تكتب الأمر ls ثم Enter — الصدفة (shell) تقرأ النص وتفهمه', ba: 'كتب: ls' },
          { icon: '📨', at: 'b', cap: '٢) الصدفة تطلب من النواة قراءة محتويات المجلد الحالي', bb: 'تستقبل الطلب' },
          { icon: '📂', at: 'mid', cap: '٣) النواة تجمع أسماء الملفات من القرص' },
          { icon: '📄', at: 'a', cap: '٤) تعود القائمة إلى شاشتك — انتهى الأمر في أجزاء من الثانية ✅', flash: 'ok', ba: 'رأى النتيجة' }
        ]
      })),
    TK.s('🧪 مختبر ١: تنقّل داخل نظام Linux تدريبي', 'Lab 1 — navigate a training Linux system',
      '<p class="lead">هذه طرفية حقيقية التفاعل بنظام ملفات تدريبي آمن. اكتب الأوامر بنفسك — وتُحدَّد المهام تلقائياً عند تنفيذها. ستتعرف هنا على أربعة أوامر أساسية تتكرر في كل عمل أمني: <code>ls</code> يعرض محتويات المجلد الذي تقف فيه حالياً، <code>cd</code> (اختصار change directory) ينقلك إلى مجلد آخر، <code>pwd</code> (print working directory) يطبع مسارك الحالي الكامل، و<code>cat</code> يطبع محتوى ملف نصي كامل على الشاشة. ستلاحظ أيضاً أن بعض الأوامر تُكتب بعدها شرطة وحرف، مثل <code>-a</code>؛ يسمى هذا <b>خياراً (Option)</b>، وهو يغيّر سلوك الأمر الافتراضي — فمثلاً <code>ls</code> وحدها تعرض الملفات العادية فقط، بينما <code>ls -a</code> تضيف الخيار <code>-a</code> (all) لتعرض حتى الملفات المخفية.</p>' +
      TK.shell({
        title: 'student@lab: ~ (طرفية تدريبية)',
        fs: {
          home: { student: {
            'notes.txt': 'مرحباً بك في مختبر Linux!\nهذا أول ملف تقرؤه بأمر cat.',
            '.secret_note': 'الملفات التي تبدأ بنقطة مخفية — تظهر فقط بالخيار -a',
            docs: { 'readme.txt': 'مجلد الوثائق.\nجرّب الأمر ls -l لترى الصلاحيات.', 'todo.txt': '1. تعلّم ls\n2. تعلّم cd\n3. تعلّم cat\n4. اعثر على العلم!' },
            projects: { lab1: { 'hint.txt': 'العلم في مكان قريب... جرّب ls -a داخل هذا المجلد', '.flag.txt': 'FLAG{linux_navigator}' } }
          } },
          etc: { hostname: 'lab', 'os-release': 'NAME="Ubuntu"\nVERSION="22.04 LTS"' },
          var: { log: { 'syslog': 'Oct 15 09:00:01 lab systemd: Started Daily apt download.' } }
        },
        tasks: [
          { d: 'اعرض محتويات المجلد الحالي: <code>ls</code>', re: '^ls\\s*$' },
          { d: 'اعرض الملفات المخفية أيضاً: <code>ls -a</code>', re: '^ls\\s+-\\w*a' },
          { d: 'اعرض الملفات بصلاحياتها وحجمها (ستفهم كل عمود في شريحة لاحقة): <code>ls -l</code>', re: '^ls\\s+-\\w*l\\w*\\s*$' },
          { d: 'ادخل مجلد docs: <code>cd docs</code>', re: '^cd\\s+(~/)?docs' },
          { d: 'اقرأ ملف todo.txt: <code>cat todo.txt</code>', re: '^cat\\s+.*todo\\.txt' },
          { d: 'اعرف مكانك الحالي: <code>pwd</code>', re: '^pwd' },
          { d: 'ارجع للمجلد الرئيسي: <code>cd ~</code>', re: '^cd(\\s+~|\\s*)$' }
        ]
      })),
    TK.s('🗺️ خريطة نظام الملفات: أين أبحث؟', 'The Linux directory map',
      '<p class="lead">في Linux كل الملفات والمجلدات مرتّبة في شجرة واحدة تبدأ من نقطة اسمها الجذر <span class="code">/</span>، وكل شيء آخر فرع منها. عنوان أي ملف أو مجلد داخل هذه الشجرة يسمى <b>المسار (Path)</b>، مثل <span class="code">/home/student/notes.txt</span>، وهو يشبه العنوان البريدي: يخبرك بالضبط أين تجد الملف. اضغط كل بطاقة لتعرف ماذا تجد في هذا المجلد — وأين يبحث المحقق الأمني أولاً.</p>' +
      TK.cards({ cols: 3, items: [
        { e: '🏠', t: '/home', b: 'ملفات المستخدمين الشخصية. هنا تبدأ طرفيتك (المجلد ~). كثيراً ما تجد فيه ملاحظات وكلمات مرور منسية.' },
        { e: '⚙️', t: '/etc', b: 'ملفات الإعدادات. فيه <code>passwd</code> (قائمة المستخدمين) وإعدادات الشبكة والخدمات.' },
        { e: '📜', t: '/var/log', b: 'السجلات: من دخل ومتى وماذا فشل. أول مكان يفحصه محلل الحوادث.' },
        { e: '🧰', t: '/bin و /usr/bin', b: 'برامج النظام والأدوات (ls, cat, nmap...). كل أمر تكتبه هو ملف تنفيذي هنا.' },
        { e: '🗑️', t: '/tmp', b: 'ملفات مؤقتة يكتب فيها الجميع — يحبّه المهاجمون لإخفاء أدواتهم، فافحصه دائماً.' },
        { e: '👑', t: '/root', b: 'مجلد المستخدم الأعلى صلاحية (root). لا يدخله إلا المسؤول.' }
      ] }) +
      '<div class="card" style="padding:18px;margin-top:14px">' +
      '<svg viewBox="0 0 700 280" style="width:100%;height:auto;display:block;direction:ltr" role="img" aria-label="شجرة مجلدات Linux ابتداءً من الجذر">' +
      '<rect x="295" y="14" width="110" height="54" rx="12" style="fill:rgba(0,158,226,.28);stroke:var(--blue);stroke-width:2"/>' +
      '<text x="350" y="40" text-anchor="middle" style="fill:var(--text);font-weight:900;font-size:19px">/</text>' +
      '<text x="350" y="58" text-anchor="middle" style="fill:var(--muted);font-size:10px">الجذر (Root)</text>' +
      '<line x1="350" y1="68" x2="90" y2="128" style="stroke:var(--line);stroke-width:2"/>' +
      '<line x1="350" y1="68" x2="194" y2="128" style="stroke:var(--line);stroke-width:2"/>' +
      '<line x1="350" y1="68" x2="298" y2="128" style="stroke:var(--line);stroke-width:2"/>' +
      '<line x1="350" y1="68" x2="402" y2="128" style="stroke:var(--line);stroke-width:2"/>' +
      '<line x1="350" y1="68" x2="506" y2="128" style="stroke:var(--line);stroke-width:2"/>' +
      '<line x1="350" y1="68" x2="610" y2="128" style="stroke:var(--line);stroke-width:2"/>' +
      '<g>' +
      '<rect x="42" y="128" width="96" height="46" rx="10" style="fill:var(--chip);stroke:var(--line);stroke-width:1.5"/><text x="90" y="156" text-anchor="middle" style="fill:var(--text);font-weight:800;font-size:13px">/home</text>' +
      '<rect x="146" y="128" width="96" height="46" rx="10" style="fill:var(--chip);stroke:var(--line);stroke-width:1.5"/><text x="194" y="156" text-anchor="middle" style="fill:var(--text);font-weight:800;font-size:13px">/etc</text>' +
      '<rect x="250" y="128" width="96" height="46" rx="10" style="fill:var(--chip);stroke:var(--line);stroke-width:1.5"/><text x="298" y="156" text-anchor="middle" style="fill:var(--text);font-weight:800;font-size:13px">/var</text>' +
      '<rect x="354" y="128" width="96" height="46" rx="10" style="fill:var(--chip);stroke:var(--line);stroke-width:1.5"/><text x="402" y="156" text-anchor="middle" style="fill:var(--text);font-weight:800;font-size:13px">/bin</text>' +
      '<rect x="458" y="128" width="96" height="46" rx="10" style="fill:var(--chip);stroke:var(--line);stroke-width:1.5"/><text x="506" y="156" text-anchor="middle" style="fill:var(--text);font-weight:800;font-size:13px">/tmp</text>' +
      '<rect x="562" y="128" width="96" height="46" rx="10" style="fill:var(--chip);stroke:var(--line);stroke-width:1.5"/><text x="610" y="156" text-anchor="middle" style="fill:var(--text);font-weight:800;font-size:13px">/root</text>' +
      '</g>' +
      '<line x1="90" y1="174" x2="90" y2="214" style="stroke:rgba(0,158,226,.6);stroke-width:2"/>' +
      '<rect x="30" y="214" width="120" height="44" rx="10" style="fill:rgba(0,158,226,.14);stroke:var(--blue);stroke-width:1.5"/>' +
      '<text x="90" y="241" text-anchor="middle" style="fill:var(--text);font-weight:800;font-size:11.5px">/home/student</text>' +
      '<line x1="298" y1="174" x2="298" y2="214" style="stroke:rgba(247,178,40,.8);stroke-width:2"/>' +
      '<rect x="238" y="214" width="120" height="44" rx="10" style="fill:rgba(247,178,40,.16);stroke:var(--yellow);stroke-width:1.5"/>' +
      '<text x="298" y="241" text-anchor="middle" style="fill:var(--text);font-weight:800;font-size:11.5px">/var/log</text>' +
      '</svg></div>' +
      '<p class="tc" style="font-size:.85rem;color:var(--muted);margin-top:8px">كل مسار (Path) هو ببساطة سلسلة أسماء من الجذر إلى الملف، مفصولة بشرطات مائلة: /var/log/auth.log يعني «من الجذر، ادخل var، ثم log، ثم الملف auth.log».</p>' +
      TK.check({ s: 'سجلات دخول الخادم (Logs) توجد عادة داخل مجلد <code>/bin</code>.', t: false, why: 'السجلات توجد في /var/log، أما /bin فيحوي البرامج التنفيذية الأساسية للنظام فقط.' })),
    TK.s('🏁 تحدي: اعثر على العلم المخفي', 'Challenge — find the hidden flag',
      '<div class="card"><p>داخل مجلد <span class="code">~/projects/lab1</span> ملف مخفي يحوي «علماً» بصيغة <span class="code">FLAG{...}</span>. استخدم طرفية المختبر أعلاه (ارجع للشريحة السابقة) للعثور عليه.</p></div>' +
      TK.challenge({ t: 'الملف المخفي', q: 'ما قيمة العلم (Flag) الموجود في المجلد projects/lab1؟', answer: ['FLAG{linux_navigator}'], hint: 'الملفات المخفية تبدأ بنقطة. استخدم ls -a ثم cat.', explain: 'ls -a يكشف الملفات المخفية، و cat يقرأ محتواها — مهارتان تتكرران في كل تحقيق رقمي.', ph: 'FLAG{...}' })),
    TK.breakSlide('الجزء القادم: صلاحيات الملفات، ثم البحث داخل سجلات خادم تعرّض لهجوم تخمين.'),
    TK.s('🔐 الصلاحيات: من يستطيع قراءة الملف أو تشغيله؟', 'File permissions (rwx)',
      '<p class="lead">كل ملف في Linux له <b>صلاحيات (Permissions)</b> تحدد من يستطيع التعامل معه، مقسّمة على ثلاث فئات: المالك (صاحب الملف)، المجموعة، ثم باقي المستخدمين. تظهر هذه الصلاحيات كرمز من تسعة أحرف مثل <span class="code">rwxr-xr-x</span> عند استخدام الخيار <span class="code">-l</span> مع الأمر <span class="code">ls</span> (أي <span class="code">ls -l</span>: اعرض قائمة مفصّلة). اضغط على كل حرف لتفهمه.</p>' +
      TK.cards({ cols: 3, items: [
        { e: '👁️', t: 'r = قراءة (4)', b: 'يستطيع عرض محتوى الملف بـ cat.' },
        { e: '✏️', t: 'w = كتابة (2)', b: 'يستطيع تعديل الملف أو حذفه.' },
        { e: '🚀', t: 'x = تنفيذ (1)', b: 'يستطيع تشغيل الملف كبرنامج. ملف نصي ضار بصلاحية x قد يُشغَّل!' }
      ] }) +
      '<div class="card" style="padding:18px;margin-top:14px">' +
      '<svg viewBox="0 0 640 200" style="width:100%;height:auto;display:block;direction:ltr" role="img" aria-label="تحليل رمز الصلاحيات rwxr-xr-x">' +
      '<rect x="106" y="20" width="158" height="70" rx="12" style="fill:rgba(0,158,226,.14);stroke:var(--blue);stroke-width:1.5"/>' +
      '<rect x="268" y="20" width="158" height="70" rx="12" style="fill:rgba(247,178,40,.16);stroke:var(--yellow);stroke-width:1.5"/>' +
      '<rect x="430" y="20" width="158" height="70" rx="12" style="fill:rgba(37,211,102,.14);stroke:var(--green);stroke-width:1.5"/>' +
      '<g style="font-family:Cascadia Code,monospace;font-size:21px;font-weight:900">' +
      '<rect x="52" y="40" width="50" height="50" rx="8" style="fill:var(--chip);stroke:var(--line)"/><text x="77" y="72" text-anchor="middle" style="fill:var(--text)">-</text>' +
      '<rect x="106" y="40" width="50" height="50" rx="8" style="fill:var(--surface2);stroke:var(--blue)"/><text x="131" y="72" text-anchor="middle" style="fill:var(--blue)">r</text>' +
      '<rect x="160" y="40" width="50" height="50" rx="8" style="fill:var(--surface2);stroke:var(--blue)"/><text x="185" y="72" text-anchor="middle" style="fill:var(--blue)">w</text>' +
      '<rect x="214" y="40" width="50" height="50" rx="8" style="fill:var(--surface2);stroke:var(--blue)"/><text x="239" y="72" text-anchor="middle" style="fill:var(--blue)">x</text>' +
      '<rect x="268" y="40" width="50" height="50" rx="8" style="fill:var(--surface2);stroke:var(--yellow)"/><text x="293" y="72" text-anchor="middle" style="fill:#b8790a">r</text>' +
      '<rect x="322" y="40" width="50" height="50" rx="8" style="fill:var(--surface2);stroke:var(--yellow)"/><text x="347" y="72" text-anchor="middle" style="fill:#b8790a">-</text>' +
      '<rect x="376" y="40" width="50" height="50" rx="8" style="fill:var(--surface2);stroke:var(--yellow)"/><text x="401" y="72" text-anchor="middle" style="fill:#b8790a">x</text>' +
      '<rect x="430" y="40" width="50" height="50" rx="8" style="fill:var(--surface2);stroke:var(--green)"/><text x="455" y="72" text-anchor="middle" style="fill:#1a9c4a">r</text>' +
      '<rect x="484" y="40" width="50" height="50" rx="8" style="fill:var(--surface2);stroke:var(--green)"/><text x="509" y="72" text-anchor="middle" style="fill:#1a9c4a">-</text>' +
      '<rect x="538" y="40" width="50" height="50" rx="8" style="fill:var(--surface2);stroke:var(--green)"/><text x="563" y="72" text-anchor="middle" style="fill:#1a9c4a">x</text>' +
      '</g>' +
      '<text x="77" y="118" text-anchor="middle" style="fill:var(--muted);font-size:11px;font-weight:800">النوع</text>' +
      '<text x="77" y="132" text-anchor="middle" style="fill:var(--muted);font-size:9.5px">- = ملف عادي</text>' +
      '<text x="185" y="118" text-anchor="middle" style="fill:var(--blue);font-size:12px;font-weight:900">المالك (Owner)</text>' +
      '<text x="185" y="134" text-anchor="middle" style="fill:var(--muted);font-size:10px">rwx = قراءة+كتابة+تنفيذ</text>' +
      '<text x="347" y="118" text-anchor="middle" style="fill:#b8790a;font-size:12px;font-weight:900">المجموعة (Group)</text>' +
      '<text x="347" y="134" text-anchor="middle" style="fill:var(--muted);font-size:10px">r-x = قراءة وتنفيذ فقط</text>' +
      '<text x="509" y="118" text-anchor="middle" style="fill:#1a9c4a;font-size:12px;font-weight:900">الآخرون (Others)</text>' +
      '<text x="509" y="134" text-anchor="middle" style="fill:var(--muted);font-size:10px">r-x = قراءة وتنفيذ فقط</text>' +
      '<text x="320" y="170" text-anchor="middle" style="fill:var(--muted);font-size:11px">مثال: <tspan style="font-family:Cascadia Code,monospace;fill:var(--text);font-weight:800">-rwxr-xr-x</tspan> — المالك يملك كل شيء، والباقون يقرؤون وينفّذون فقط دون تعديل</text>' +
      '</svg></div>' +
      TK.terminal({ title: 'student@lab:~$', lines: [
        ['cmd', '$ ls -l script.sh'], ['out', '-rw-r--r-- 1 student student 52 script.sh', 600],
        ['dim', '# المالك: قراءة وكتابة · الباقي: قراءة فقط · لا أحد يستطيع تشغيله'],
        ['cmd', '$ chmod +x script.sh', 700], ['cmd', '$ ls -l script.sh'], ['ok', '-rwxr-xr-x 1 student student 52 script.sh', 600],
        ['hl', '# ظهر الحرف x: صار الملف قابلاً للتشغيل ✅']
      ], btn: 'شاهد chmod يغيّر الصلاحيات' }) +
      TK.check({ s: 'الأمر <code>chmod +x</code> يمنح الملف صلاحية التنفيذ (x)، مما قد يسمح بتشغيله كبرنامج.', t: true, why: 'بالضبط، وهذا يجعل فحص أي ملف نصي يحمل صلاحية x أمراً مهماً قبل الوثوق به.' })),
    TK.s('🃏 صنّف: أي أمر لأي مهمة؟', 'Classify — pick the right command',
      TK.classify({
        buckets: [{ t: 'عرض وقراءة', e: '👁️' }, { t: 'بحث', e: '🔎' }, { t: 'تغيير', e: '✏️' }],
        items: [
          { t: 'ls -la', b: 0, why: 'يعرض الملفات بصلاحياتها.' }, { t: 'cat notes.txt', b: 0, why: 'يطبع محتوى الملف.' },
          { t: 'grep Failed auth.log', b: 1, why: 'يبحث عن كلمة داخل الملف.' }, { t: 'find / -name "*.conf"', b: 1, why: 'يبحث عن ملفات بالاسم.' },
          { t: 'chmod +x tool.sh', b: 2, why: 'يغيّر صلاحيات الملف.' }, { t: 'mkdir reports', b: 2, why: 'ينشئ مجلداً جديداً.' }
        ]
      })),
    TK.s('🧪 مختبر ٢: حقّق في سجلات خادم مخترَق', 'Lab 2 — investigate a server log',
      '<div class="card"><b>السيناريو:</b> مسؤول النظام لاحظ بطئاً في الخادم. <b>السجل (Log)</b> هو ملف نصي يسجّل النظام فيه تلقائياً كل حدث يحصل (من دخل، ومتى، وهل نجح أم فشل)، وسجل الدخول <span class="code">/var/log/auth.log</span> فيه الدليل. ستستخدم هنا ثلاث أدوات جديدة: <code>grep</code> يبحث عن كلمة أو نمط نصي محدد داخل ملف ويعرض فقط الأسطر التي تحتويه (كالبحث السريع داخل مستند طويل)، و<code>find</code> يبحث عن الملفات نفسها بالاسم في أي مكان بالنظام، و<span class="code">|</span> (الأنبوب/Pipe) يأخذ ناتج أمر ويمرّره مباشرة كمُدخل لأمر آخر، فتستطيع مثلاً عدّ نتائج grep بإرسالها إلى الأمر wc -l. اجمع بين هذه الأدوات الثلاث لكشف ما حدث.</div>' +
      TK.shell({
        title: 'analyst@server: ~ (سجلات تدريبية)', user: 'analyst', host: 'server', cwd: '/home/analyst',
        fs: {
          home: { analyst: { 'case-notes.txt': 'سجلات الدخول في /var/log/auth.log\nابحث عن كلمة Failed.' } },
          etc: { 'ssh.conf': 'Port 22\nPermitRootLogin yes', 'app.conf': 'debug=true' },
          var: { log: {
            'auth.log': 'Oct 15 10:01:11 server sshd[311]: Accepted password for analyst from 192.168.56.1\nOct 15 10:03:22 server sshd[320]: Failed password for root from 203.0.113.7\nOct 15 10:03:25 server sshd[320]: Failed password for root from 203.0.113.7\nOct 15 10:03:29 server sshd[320]: Failed password for admin from 203.0.113.7\nOct 15 10:09:40 server sshd[331]: Accepted password for analyst from 192.168.56.1\nOct 15 10:12:02 server sshd[340]: Failed password for test from 198.51.100.9\nOct 15 10:12:09 server sshd[341]: Failed password for root from 203.0.113.7\nOct 15 10:15:00 server sshd[350]: session opened for user analyst',
            'syslog': 'Oct 15 10:00:00 server kernel: boot ok'
          } }
        },
        tasks: [
          { d: 'اقرأ السجل كاملاً: <code>cat /var/log/auth.log</code>', re: 'cat\\s+/var/log/auth\\.log' },
          { d: 'ابحث عن المحاولات الفاشلة: <code>grep Failed /var/log/auth.log</code>', re: 'grep\\s+.*Failed' },
          { d: 'عُدّ المحاولات الفاشلة بالأنبوب: <code>grep Failed /var/log/auth.log | wc -l</code>', re: 'grep\\s+.*Failed.*\\|\\s*wc' },
          { d: 'ابحث عن كل ملفات الإعدادات: <code>find / -name "*.conf"</code>', re: 'find\\s+/\\s+-name\\s+.*conf' }
        ]
      }) +
      TK.check({ s: 'الأمر <code>find / -name "*.conf"</code> يبحث عن محتوى يحوي كلمة conf داخل الملفات.', t: false, why: 'find يبحث عن الملفات نفسها بالاسم في أي مكان بالنظام، أما البحث داخل محتوى الملفات فهو عمل grep.' })),
    TK.s('🏁 تحقيق: من يهاجم الخادم؟', 'Challenge — who is attacking?',
      '<p class="lead">استخدم طرفية المختبر ٢ لحل التحديين. هذا بالضبط ما يفعله محلل الأمن يومياً.</p>' +
      TK.challenge({ t: 'العدّ', q: 'كم عدد محاولات الدخول <b>الفاشلة</b> (Failed password) في السجل؟', answer: ['5'], hint: 'grep Failed ... | wc -l', explain: 'خمس محاولات فاشلة خلال دقائق = هجوم تخمين كلمات مرور (Brute Force).', ph: 'رقم' }) +
      TK.challenge({ t: 'المهاجم', q: 'ما عنوان IP الذي نفّذ أكثر المحاولات الفاشلة على حساب root؟', answer: ['203.0.113.7'], hint: 'grep "Failed password for root" وانظر إلى العنوان الأكثر تكراراً.', explain: 'العنوان 203.0.113.7 ظهر في 4 محاولات — يُحظر في الجدار الناري ويُبلَّغ عنه.', ph: 'x.x.x.x' })),
    /* جديد — إدارة الحزم بـ APT */
    TK.s('📦 كيف تثبّت أداة جديدة؟ إدارة الحزم بـ APT', 'Package management — how APT works',
      '<p class="lead">البرامج في Linux لا تُحمَّل عادة من مواقع عشوائية على الإنترنت، بل من <b>مستودعات (Repositories)</b> رسمية وموثوقة يديرها فريق التوزيعة نفسها. أداة <code>apt</code> (في Debian وUbuntu وKali) هي التي تتحدث مع هذه المستودعات نيابة عنك: تبحث، تحمّل، تثبّت، وتحدّث البرامج بأمر واحد بدل البحث يدوياً وتحميل ملفات exe من مواقع قد تكون غير موثوقة.</p>' +
      '<div class="card" style="padding:18px">' +
      '<svg viewBox="0 0 760 170" style="width:100%;height:auto;display:block;direction:ltr" role="img" aria-label="مخطط سير عمل APT من المستودعات إلى التثبيت">' +
      '<rect x="605" y="35" width="150" height="100" rx="14" style="fill:var(--chip);stroke:var(--line);stroke-width:2"/>' +
      '<text x="680" y="65" text-anchor="middle" style="fill:var(--text);font-weight:900;font-size:13px">🗄️ مستودعات</text>' +
      '<text x="680" y="85" text-anchor="middle" style="fill:var(--muted);font-size:10.5px">خوادم تخزّن آلاف</text>' +
      '<text x="680" y="103" text-anchor="middle" style="fill:var(--muted);font-size:10.5px">البرامج الجاهزة</text>' +
      '<text x="585" y="92" text-anchor="middle" style="fill:var(--blue);font-size:24px">⟵</text>' +
      '<rect x="415" y="35" width="150" height="100" rx="14" style="fill:rgba(0,158,226,.14);stroke:var(--blue);stroke-width:2"/>' +
      '<text x="490" y="65" text-anchor="middle" style="fill:var(--text);font-weight:900;font-size:13px">① apt update</text>' +
      '<text x="490" y="85" text-anchor="middle" style="fill:var(--muted);font-size:10.5px">يحدّث قائمة</text>' +
      '<text x="490" y="103" text-anchor="middle" style="fill:var(--muted);font-size:10.5px">البرامج المتاحة فقط</text>' +
      '<text x="395" y="92" text-anchor="middle" style="fill:var(--blue);font-size:24px">⟵</text>' +
      '<rect x="225" y="35" width="150" height="100" rx="14" style="fill:rgba(0,158,226,.14);stroke:var(--blue);stroke-width:2"/>' +
      '<text x="300" y="65" text-anchor="middle" style="fill:var(--text);font-weight:900;font-size:13px">② apt upgrade</text>' +
      '<text x="300" y="85" text-anchor="middle" style="fill:var(--muted);font-size:10.5px">يثبّت أحدث نسخة</text>' +
      '<text x="300" y="103" text-anchor="middle" style="fill:var(--muted);font-size:10.5px">لما هو مثبّت فعلاً</text>' +
      '<text x="205" y="92" text-anchor="middle" style="fill:var(--blue);font-size:24px">⟵</text>' +
      '<rect x="35" y="35" width="150" height="100" rx="14" style="fill:rgba(0,158,226,.14);stroke:var(--blue);stroke-width:2"/>' +
      '<text x="110" y="65" text-anchor="middle" style="fill:var(--text);font-weight:900;font-size:13px">③ apt install</text>' +
      '<text x="110" y="85" text-anchor="middle" style="fill:var(--muted);font-size:10.5px">يثبّت برنامجاً</text>' +
      '<text x="110" y="103" text-anchor="middle" style="fill:var(--muted);font-size:10.5px">جديداً لم يكن موجوداً</text>' +
      '</svg></div>' +
      '<p class="tc" style="font-size:.85rem;color:var(--muted);margin-top:8px">القاعدة البسيطة: شغّل apt update أولاً دائماً لتحديث القائمة، ثم استخدم upgrade لتحديث ما لديك أو install لإضافة أداة جديدة.</p>' +
      TK.terminal({ title: 'student@lab:~$', btn: 'شاهد apt يحدّث ثم يثبّت أداة', lines: [
        ['cmd', '$ sudo apt update'],
        ['out', 'Hit:1 http://archive.kali.org/kali kali-rolling InRelease', 450],
        ['out', 'Reading package lists... Done', 400],
        ['hl', '# القائمة تحدّثت فقط؛ لم يتغيّر أي برنامج مثبّت بعد'],
        ['cmd', '$ sudo apt install nmap', 700],
        ['out', 'Reading package lists... Done', 350],
        ['out', 'The following NEW packages will be installed: nmap', 400],
        ['ok', 'nmap is now installed.', 500]
      ] }) +
      '<div class="note">كلمة <code>sudo</code> (super user do) قبل الأمر تعني «نفّذ هذا بصلاحية المسؤول (root)» — التثبيت والتحديث يغيّران ملفات النظام فيحتاجان هذه الصلاحية، على عكس أوامر القراءة العادية مثل <code>ls</code> أو <code>cat</code>.</div>' +
      TK.check({ s: 'الأمر <code>apt update</code> يقوم بتثبيت وتحديث كل البرامج الموجودة على جهازك مباشرة.', t: false, why: 'apt update يحدّث فقط قائمة البرامج المتاحة من المستودعات، ولا يغيّر أي برنامج مثبّت. التحديث الفعلي يتم بـ apt upgrade.' })),

    /* جديد — مختبر ٣: أوامر يومية أكثر */
    TK.s('🧪 مختبر ٣: أوامر يومية أكثر — نظّم وعالِج الملفات', 'Lab 3 — more daily commands: organize & process files',
      '<p class="lead">كل يوم يحتاج محلل الأمن أوامر أكثر من مجرد التنقّل والقراءة: إنشاء وتنظيم ملفات، نسخها ونقلها وحذفها بأمان، ومعالجة نص طويل بسرعة بدل قراءته سطراً سطراً. جرّب كل أمر بنفسك وتعرّف بالضبط ماذا يفعل ومتى تستخدمه يومياً.</p>' +
      TK.table(['الأمر', 'ماذا يفعل بالضبط؟', 'متى تستخدمه يومياً؟'], [
        ['<code>id</code>', 'يعرض هويتك الكاملة: رقم المستخدم (uid) ورقم المجموعة (gid) وكل المجموعات التي تنتمي إليها', 'للتأكد من صلاحياتك الفعلية، أدق من whoami'],
        ['<code>mkdir</code>', 'ينشئ مجلداً جديداً فارغاً', 'لتنظيم أدلة تحقيق أو مشروع جديد'],
        ['<code>touch</code>', 'ينشئ ملفاً فارغاً جديداً (أو يحدّث وقت تعديل ملف موجود)', 'لبدء ملف ملاحظات أو تقرير بسرعة'],
        ['<code>cp</code>', 'ينسخ ملفاً من مصدر إلى هدف (الأصل يبقى كما هو)', 'لأخذ نسخة احتياطية قبل تعديل ملف دليل'],
        ['<code>mv</code>', 'ينقل الملف أو يعيد تسميته (الأصل يختفي من مكانه)', 'لترتيب الملفات أو تصحيح اسم ملف'],
        ['<code>rm</code>', 'يحذف ملفاً نهائياً — لا سلة مهملات بالأمر العادي!', 'بحذر شديد، وبعد التأكد أنك لا تحتاج الملف'],
        ['<code>head</code>', 'يعرض أول N سطر فقط من ملف طويل (مع الخيار -n N)', 'لإلقاء نظرة سريعة على بداية سجل ضخم'],
        ['<code>tail</code>', 'يعرض آخر N سطر فقط من ملف طويل (مع الخيار -n N)', 'لرؤية آخر الأحداث في سجل حيّ'],
        ['<code>sort</code>', 'يرتّب أسطر الملف أبجدياً أو رقمياً', 'لترتيب عناوين IP أو أسماء قبل تحليلها'],
        ['<code>uniq</code>', 'يحذف الأسطر المكرّرة المتتالية (يعمل غالباً بعد sort)', 'لمعرفة القيم الفريدة وسط تكرار كثير'],
        ['<code>wc -l</code>', 'يعدّ عدد الأسطر في ملف', 'لمعرفة حجم سجل أو عدد نتائج بحث بسرعة']
      ]) +
      TK.shell({
        title: 'analyst@lab: ~ (مختبر الأوامر اليومية)', user: 'analyst', host: 'lab', cwd: '/home/analyst',
        fs: {
          home: { analyst: {
            'raw_data.txt': '203.0.113.7 login failed\n198.51.100.9 login failed\n203.0.113.7 login failed\n192.168.1.5 login success\n203.0.113.7 login failed\n198.51.100.9 login failed\n192.168.1.5 login success\n10.0.0.4 login failed\n203.0.113.7 login failed\n192.168.1.5 login success',
            'draft_report.txt': 'ملاحظات أولية: العنوان 203.0.113.7 يتكرر كثيراً في محاولات الدخول الفاشلة. يحتاج حظراً في الجدار الناري.'
          } }
        },
        tasks: [
          { d: 'اعرض هويتك الكاملة بالتفصيل: <code>id</code>', re: '^id\\s*$' },
          { d: 'أنشئ مجلداً لتنظيم الأدلة: <code>mkdir evidence</code>', re: '^mkdir\\s+evidence' },
          { d: 'انسخ ملف البيانات الخام إلى المجلد الجديد: <code>cp raw_data.txt evidence/</code>', re: '^cp\\s+raw_data\\.txt\\s+evidence/?\\s*$' },
          { d: 'أنشئ ملف ملاحظات فارغاً داخل المجلد الجديد: <code>touch evidence/notes.txt</code>', re: '^touch\\s+evidence/notes\\.txt' },
          { d: 'اعرض أول 5 أسطر فقط من البيانات: <code>head -n 5 raw_data.txt</code>', re: '^head\\s+-n\\s*5\\s+raw_data\\.txt' },
          { d: 'اعرض آخر 5 أسطر فقط: <code>tail -n 5 raw_data.txt</code>', re: '^tail\\s+-n\\s*5\\s+raw_data\\.txt' },
          { d: 'رتّب الأسطر أبجدياً: <code>sort raw_data.txt</code>', re: '^sort\\s+raw_data\\.txt\\s*$' },
          { d: 'اعرض العناوين الفريدة فقط بعد الترتيب (بالأنبوب): <code>sort raw_data.txt | uniq</code>', re: '^sort\\s+raw_data\\.txt\\s*\\|\\s*uniq' },
          { d: 'عُدّ عدد الأسطر الكلي في الملف: <code>wc -l raw_data.txt</code>', re: '^wc\\s+-l\\s+raw_data\\.txt' },
          { d: 'انقل مسودة التقرير إلى مجلد الأدلة باسم أوضح: <code>mv draft_report.txt evidence/final_report.txt</code>', re: '^mv\\s+draft_report\\.txt\\s+evidence/final_report\\.txt' },
          { d: 'بعد نسخه بأمان، احذف ملف البيانات الخام من المجلد الرئيسي: <code>rm raw_data.txt</code>', re: '^rm\\s+raw_data\\.txt\\s*$' }
        ]
      }) +
      '<div class="tip">لاحظ الفرق المهم: <code>cp</code> يترك نسخة في المكان الأصلي، بينما <code>mv</code> و<code>rm</code> يزيلان الملف من مكانه الأول. لهذا يُنصَح دائماً بعمل <code>cp</code> لنسخة احتياطية قبل أي <code>rm</code> على دليل مهم.</div>' +
      TK.check({ s: 'الأمر <code>cp</code> ينقل الملف من مكانه الأصلي فلا تبقى نسخة فيه بعد التنفيذ.', t: false, why: 'cp ينسخ فقط ويُبقي الأصل كما هو؛ الأمر الذي يزيل الملف من مكانه الأصلي بعد النقل هو mv.' })),
    TK.s('🎭 سيناريو: ماذا تفعل عندما تجد ملفاً مريباً؟', 'Scenario — suspicious file',
      TK.scenario({ steps: [
        { s: 'وجدت داخل /tmp ملفاً اسمه <span class="code">update.sh</span> بصلاحية x لم تنشئه أنت. ماذا تفعل أولاً؟', o: [
          { t: 'أشغّله لأرى ماذا يفعل', ok: false, fb: 'خطر! تشغيل ملف مجهول قد ينفّذ كوداً ضاراً. اقرأه أولاً.' },
          { t: 'أقرأه بـ cat وأفحص محتواه دون تشغيله', ok: true, fb: 'صحيح — القراءة آمنة، وتكشف نيّة الملف.' },
          { t: 'أتجاهله', ok: false, fb: 'ملف مجهول بصلاحية تنفيذ في /tmp مؤشر اختراق محتمل ويجب فحصه.' }] },
        { s: 'قرأته فوجدت سطراً يحاول الاتصال بعنوان خارجي. الخطوة التالية؟', o: [
          { t: 'أحذفه فوراً دون إخبار أحد', ok: false, fb: 'الحذف يضيّع الدليل. وثّق أولاً ثم أبلغ المسؤول.' },
          { t: 'أوثّق (اسم الملف، المسار، الوقت) وأبلغ مسؤول الأمن', ok: true, fb: 'ممتاز — التوثيق والإبلاغ هما أساس الاستجابة للحوادث.' },
          { t: 'أنسخه لجهازي الشخصي لأجرّبه', ok: false, fb: 'نقل ملف مشبوه لجهاز غير معزول يعرّض جهازك للخطر.' }] }
      ] })),
    TK.s('📋 ورقة الغش: أوامر اليوم', 'Cheat sheet',
      TK.table(['الأمر', 'وظيفته', 'مثال'], [
        ['<code>pwd</code>', 'أين أنا؟', 'pwd'], ['<code>ls -la</code>', 'اعرض كل الملفات بصلاحياتها', 'ls -la /etc'], ['<code>cd</code>', 'انتقل بين المجلدات', 'cd ~/docs'],
        ['<code>cat</code>', 'اقرأ ملفاً', 'cat notes.txt'], ['<code>grep</code>', 'ابحث داخل النص', 'grep Failed auth.log'], ['<code>find</code>', 'ابحث عن ملفات', 'find / -name "*.conf"'],
        ['<code>chmod</code>', 'غيّر الصلاحيات', 'chmod +x tool.sh'], ['<code>|</code>', 'مرّر ناتج أمر لآخر', 'cat log | grep root | wc -l'],
        ['<code>sudo apt update</code>', 'حدّث قائمة البرامج المتاحة', 'sudo apt update'],
        ['<code>sudo apt install</code>', 'ثبّت برنامجاً جديداً', 'sudo apt install nmap'],
        ['<code>id</code>', 'هويتك وصلاحياتك بالتفصيل', 'id'], ['<code>mkdir</code>', 'أنشئ مجلداً جديداً', 'mkdir evidence'],
        ['<code>touch</code>', 'أنشئ ملفاً فارغاً', 'touch notes.txt'], ['<code>cp</code>', 'انسخ ملفاً (الأصل يبقى)', 'cp a.txt b.txt'],
        ['<code>mv</code>', 'انقل أو أعد تسمية ملف', 'mv old.txt new.txt'], ['<code>rm</code>', 'احذف ملفاً نهائياً', 'rm temp.txt'],
        ['<code>head -n N</code>', 'أول N سطر من ملف', 'head -n 5 log.txt'], ['<code>tail -n N</code>', 'آخر N سطر من ملف', 'tail -n 5 log.txt'],
        ['<code>sort</code>', 'رتّب أسطر الملف', 'sort data.txt'], ['<code>uniq</code>', 'احذف التكرار المتتالي', 'sort data.txt | uniq']
      ]) + TK.terms([['Shell (الصدفة)', 'البرنامج الذي يقرأ أوامرك ويرسلها للنظام (bash مثلاً).'], ['Kernel (النواة)', 'الطبقة الوحيدة التي تتحدث مباشرة مع العتاد (المعالج والذاكرة والقرص).'], ['Root', 'المستخدم الأعلى صلاحية في Linux.'], ['Pipe (الأنبوب |)', 'يمرّر مخرجات أمر ليكون مدخلاً لأمر آخر.'], ['Repository (مستودع)', 'خادم رسمي موثوق تُحمَّل منه البرامج عبر apt.']]))
  ],
  quiz: [
    { q: 'ماذا يفعل الأمر <code>pwd</code>؟', ok: 'يعرض المسار الكامل للمجلد الذي تقف فيه حالياً', no: ['يعرض محتويات المجلد الحالي', 'ينقلك إلى المجلد الرئيسي', 'يعرض صلاحيات الملفات'], why: 'pwd تعني print working directory — اطبع مجلد العمل الحالي.' },
    { q: 'أي أمر يعرض الملفات المخفية (التي تبدأ أسماؤها بنقطة) داخل مجلد؟', ok: 'ls -a', no: ['ls -h', 'cat -a', 'pwd -a'], why: 'الخيار -a يعني all (أظهر الكل)، فيكشف الملفات المخفية أيضاً. -h يُستخدم لعرض الأحجام بصيغة مقروءة فقط.' },
    { q: 'ما وظيفة الأمر <code>cat</code>؟', ok: 'قراءة محتوى ملف نصي وطباعته على الشاشة', no: ['إنشاء مجلد جديد', 'تغيير صلاحيات ملف', 'البحث داخل محتوى ملف'], why: 'cat تختصر concatenate، وأشهر استخداماتها طباعة محتوى الملف مباشرة.' },
    { q: 'أين توجد سجلات دخول الخادم (Logs) عادة في Linux؟', ok: '/var/log', no: ['/bin', '/root', '/home'], why: 'السجلات توجد عادة في /var/log، أما /bin فيحوي البرامج التنفيذية الأساسية للنظام ولا علاقة له بالسجلات.' },
    { q: 'ماذا يُظهر الأمر <code>grep Failed auth.log</code>؟', ok: 'فقط الأسطر التي تحتوي كلمة Failed داخل الملف', no: ['الملف كاملاً مع تمييز كلمة Failed', 'عدد مرات ظهور Failed فقط كرقم', 'يحذف كل الأسطر التي فيها Failed'], why: 'grep يبحث عن نمط نصي محدد ويطبع الأسطر المطابقة فقط، دون أن يغيّر الملف الأصلي.' },
    { q: 'ما وظيفة الرمز <code>|</code> (الأنبوب) بين أمرين؟', ok: 'يمرّر ناتج الأمر الأول ليكون مدخلاً للأمر الثاني', no: ['يحذف ناتج الأمر الأول قبل تنفيذ الثاني', 'يشغّل الأمرين في الوقت نفسه دون علاقة بينهما', 'يحفظ ناتج الأمر الأول في ملف تلقائياً'], why: 'الأنبوب يصل الأوامر ببعضها، مثل grep Failed log | wc -l الذي يمرّر نتائج grep إلى wc -l لتُعدّ.' },
    { q: 'في صلاحيات <code>-rwxr-xr-x</code>، ماذا يملك صاحب الملف (المالك)؟', ok: 'القراءة والكتابة والتنفيذ', no: ['القراءة والتنفيذ فقط دون كتابة', 'الكتابة فقط', 'لا صلاحيات له على ملفه'], why: 'المجموعة الثلاثية الأولى (rwx) تخص المالك دائماً، وهنا تملك الحروف الثلاثة كاملة: قراءة وكتابة وتنفيذ.' },
    { q: 'لماذا يفحص محلل الأمن مجلد <code>/tmp</code> غالباً أثناء التحقيق؟', ok: 'لأنه مفتوح للكتابة من كل المستخدمين فيحبّه المهاجمون لإخفاء أدواتهم', no: ['لأنه محمي بالكامل ولا يصل إليه أحد', 'لأنه يحتوي سجلات النظام فقط', 'لأنه المجلد الوحيد القابل للتنفيذ'], why: '/tmp مفتوح للكتابة من كل المستخدمين عادة، ولهذا يستخدمه المهاجمون أحياناً لإخفاء أدوات أو ملفات مؤقتة.' },
    { q: 'وجدت ملفاً تنفيذياً مجهول المصدر بصلاحية x في النظام. ما التصرف الآمن؟', ok: 'أقرأه بـ cat دون تشغيله، ثم أوثّقه وأبلغ المسؤول', no: ['أشغّله فوراً لأرى ماذا يفعل', 'أتجاهله لأنه غالباً غير مهم', 'أحذفه مباشرة دون توثيق'], why: 'تشغيل ملف مجهول قد ينفّذ كوداً ضاراً فوراً، والحذف يضيّع الدليل، فالقراءة والتوثيق والإبلاغ هي الخطوات الصحيحة.' },
    { q: 'ما الفرق الجوهري بين الأمرين <code>cp</code> و<code>mv</code>؟', ok: 'cp ينسخ ويُبقي الملف الأصلي، بينما mv ينقل الملف فيختفي من مكانه الأول', no: ['لا فرق؛ الأمران متطابقان تماماً', 'cp يحذف الملف الأصلي بعد النسخ', 'mv يعمل فقط مع المجلدات لا الملفات'], why: 'cp نسخ حقيقي يترك الأصل كما هو، أما mv فينقل الملف (أو يعيد تسميته) ويزيله من موضعه القديم.' }
  ],
  audit: ['نفّذت ls و cd و pwd و cat في الطرفية التدريبية', 'عثرت على العلم المخفي باستخدام ls -a', 'استخدمت grep لتصفية سجل الدخول', 'استخدمت الأنبوب | مع wc -l', 'كشفت عنوان IP المهاجم من السجل', 'نظّمت ملفات بـ mkdir وcp وmv ورتّبت بياناتٍ بـ sort وuniq'],
  recap: ['الطرفية أسرع وأدق من الواجهة الرسومية في الأمن', 'ls -a و cat و grep و find أدواتك الأربع الأولى للتحقيق', 'cp تنسخ وتُبقي الأصل، mv تنقل وتزيل الأصل، rm تحذف نهائياً', 'اقرأ الملف المجهول ولا تشغّله، ثم وثّق وأبلغ'],
  homework: 'افتح طرفية المختبر ٣ من جديد ونفّذ تسلسلاً كاملاً بنفسك: أنشئ مجلداً، انسخ ملفاً إليه، رتّب بياناته، واحذف نسخة لم تعد تحتاجها. دوّن كل أمر استخدمته في ملف ملاحظات.',
  resources: [{ t: 'Ubuntu — تعلّم الطرفية', u: 'https://ubuntu.com/tutorials/command-line-for-beginners' }, { t: 'picoCTF — General Skills', u: 'https://picoctf.org/' }, { t: 'Kali Linux — التوثيق الرسمي', u: 'https://www.kali.org/docs/' }],
  next: 'في الوحدة القادمة: كلمات المرور والمصادقة — ستكسر Hash ضعيفاً داخل المختبر وتبني دفاعك.'
});
