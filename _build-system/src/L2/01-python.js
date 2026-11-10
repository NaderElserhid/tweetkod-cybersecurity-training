/* المستوى الثاني — الوحدة 1: Python للأمن السيبراني */
TK.module({
  id: 'L2-01', level: 2, num: 1, slug: 'Python-للأمن-السيبراني',
  title: 'Python للأمن السيبراني: أتمتة عملك بسكربت واحد', en: 'Python for Cybersecurity — Automate Your Work', emoji: '🐍',
  lead: 'في هذه الوحدة ستكتب سكربتات بايثون حقيقية: فاحص منافذ، محلل سجلات، فاحص قوة كلمات مرور وحاسبة بصمات، وأداة تشفير كلاسيكي. كل اختبار على جهازك فقط (127.0.0.1)، والنظرية 10 دقائق فقط.',
  tags: ['🛠️ Python 3', '🔌 socket', '🔐 hashlib'],
  agenda: [
    { t: '💡 المتغيرات والحلقات والدوال (مفهوم سريع)', time: '10 د' },
    { t: '🧪 تثبيت Python وتشغيل أول سكربت', time: '10 د' },
    { t: '🧪 مختبر: فاحص المنافذ على 127.0.0.1', time: '15 د' },
    { t: '☕ استراحة', time: '10 د' },
    { t: '🧪 مختبرات: محلل السجلات، قوة كلمات المرور وSHA-256', time: '20 د' },
    { t: '🧪 مختبرات: Caesar/XOR/Base64 وفحص ترويسات الأمان', time: '15 د' },
    { t: '🏁 تحديات ومشروع مراقب السجلات', time: '10 د' }
  ],
  slides: [
    TK.concept({
      t: 'ثلاث لبنات تبني بها أي أداة: متغيرات، حلقات، دوال', en: 'Variables, loops, functions', min: '6 د',
      body: '<p>Python لغة بسيطة ومقروءة، ولهذا هي أداة أتمتة الأمن السيبراني الأولى: فحص، تحليل سجلات، تشفير. ثلاث أفكار تكفيك للبدء:</p>' +
        '<p>كل ما ستكتبه اليوم يُسمّى <b>سكربت (Script)</b>: ملف نصي بسيط يحوي تعليمات مرتّبة، يقرأه بايثون سطراً بعد سطر من الأعلى إلى الأسفل وينفّذها تلقائياً — تماماً كقائمة خطوات مكتوبة تتبعها بالترتيب دون أن تفعلها يدوياً. لفهم أي سكربت أمني تكتبه اليوم، يكفيك فهم ثلاث أفكار بسيطة:</p>' +
        '<ul class="clean"><li><b>المتغيّر (Variable):</b> صندوق له اسم يخزّن قيمة (نصاً أو رقماً) يمكنك استخدامها أو تغييرها لاحقاً — مثل خانة في جدول تضع فيها اسم شخص وتستبدله متى شئت.</li><li><b>الحلقة (Loop):</b> أمر يكرّر مجموعة تعليمات عدة مرات تلقائياً بدل كتابتها يدوياً في كل مرة، مثل فحص كل رقم في قائمة طويلة واحداً تلو الآخر.</li><li><b>الدالة (Function):</b> قطعة كود لها اسم تُنفّذ مهمة محدّدة؛ تستدعيها بهذا الاسم كل مرة تحتاج تلك المهمة دون إعادة كتابة الكود من جديد.</li></ul>' +
        TK.code('name = "Sara"              # متغيّر (Variable): يخزّن قيمة\nfor i in range(3):          # حلقة (Loop): تكرّر العملية عدة مرات\n    print(f"Hi {name}, round {i}")\n\ndef is_even(n):              # دالة (Function): كود قابل لإعادة الاستخدام\n    return n % 2 == 0\n\nprint(is_even(4))') +
        '<div class="grid g3 mt"><div class="tag">📦 متغيّر Variable</div><div class="tag">🔁 حلقة Loop</div><div class="tag">🧩 دالة Function</div></div>' +
        TK.check({ s: 'الدالة (Function) في بايثون تسمح لك بتنفيذ نفس المهمة عدة مرات دون إعادة كتابة الكود كل مرة.', t: true, why: 'تستدعي الدالة باسمها فتُنفّذ المهمة المحدّدة داخلها، وهذا جوهر فكرة الدالة.' }),
      key: 'بهذه اللبنات الثلاث فقط ستكتب اليوم خمسة سكربتات أمنية حقيقية.'
    }),
    TK.s('🧪 ثبّت Python وشغّل أول سكربت', 'Lab — install Python and run your first script',
      '<p class="lead">قبل أي سكربت أمني، تحتاج بيئة تعمل على جهازك. بايثون نفسه يعمل بالضبط بنفس الطريقة على Windows وmacOS وLinux، لكن أمر تثبيته وتشغيله من الطرفية يختلف بشكل صغير بين ويندوز والأنظمة الأخرى — سنوضّح الفرق في كل خطوة.</p>' +
      TK.lab({
        t: 'تثبيت Python + بيئة كتابة الكود', time: '10 د', req: 'جهاز بإنترنت (Windows/macOS/Linux)',
        steps: [
          'حمّل Python من python.org وثبّته. <b>مهم لمستخدمي ويندوز:</b> في أول شاشة من المثبّت، فعّل خيار <span class="code">Add python.exe to PATH</span> (أو <span class="code">Add Python to PATH</span>) قبل الضغط على Install — هذه الخطوة يتعثّر بها كثير من المبتدئين؛ فإن نسيتها لن يتعرّف جهازك على أمر <span class="code">python</span> من الطرفية بعد التثبيت.',
          'ثبّت محرر كود: VS Code (محرر كامل ومشهور) أو Thonny (أبسط للمبتدئين، من thonny.org) — المحرر هو برنامج تكتب فيه الكود وتحفظه في ملف قبل تشغيله.',
          'افتح الطرفية (أو Thonny) واكتب أمر التحقق من التثبيت:<br>🪟 Windows (PowerShell أو CMD): <code>python --version</code><br>🍎 macOS / 🐧 Linux: <code>python3 --version</code><br>الفرق بسيط: مثبّت ويندوز يسجّل أمر بايثون باسم <span class="code">python</span> فقط، أما ماك ولينكس فيحتفظان باسم <span class="code">python3</span> لتمييزه عن نسخة Python 2 القديمة الموجودة أحياناً في النظام.',
          'أنشئ ملفاً باسم <code>hello.py</code> يحوي سطراً واحداً: <code>print("Hello, Cybersecurity!")</code>',
          'شغّله بالأمر المناسب لنظامك، وتأكد أنك رأيت الجملة على الشاشة:<br>🪟 Windows: <code>python hello.py</code><br>🍎 macOS / 🐧 Linux: <code>python3 hello.py</code>',
          'بعض سكربتات اليوم (فحص ترويسات الأمان) تحتاج مكتبة خارجية اسمها requests، وهي غير مدمجة في بايثون. <b>المكتبة (Library)</b> أو <b>الوحدة (Module)</b> هي ملف جاهز فيه كود كتبه آخرون لمهمة معيّنة (مثل التحدّث مع الإنترنت)، تستوردها بسطر <code>import</code> بدل كتابة كل ذلك الكود بنفسك. أغلب المكتبات التي ستستخدمها اليوم (socket, hashlib, base64, re) مدمجة مسبقاً مع بايثون، لكن requests خارجية وتحتاج تثبيتاً مرة واحدة بأداة pip (مثبّت حزم بايثون):<br>🪟 Windows: <code>pip install requests</code><br>🍎 macOS / 🐧 Linux: <code>pip3 install requests</code>'
        ],
        tools: [{ n: 'Python', u: 'https://www.python.org/' }, { n: 'Thonny IDE', u: 'https://thonny.org/' }],
        tip: 'VS Code محرر احترافي مشهور، وThonny أبسط للبداية — اختر ما يناسبك، كلاهما مجاني. ولا تنسَ: ويندوز = python/pip بلا رقم، ماك ولينكس = python3/pip3 بالرقم.'
      })),
    TK.s('🎬 رحلة الفحص: من السكربت إلى المنفذ والعودة', 'Animated: script to socket to response',
      '<p class="lead">اضغط «الخطوة التالية» لترى كيف يكتشف سكربت بايثون أن منفذاً مفتوح على جهازك.</p>' +
      '<p>مصطلح <b>socket</b> (مقبس الشبكة) يعني هنا: نقطة اتصال برمجية يفتحها بايثون للتحدّث مع برنامج آخر عبر الشبكة، باستخدام عنوان جهاز (IP) ورقم منفذ (Port) معيّنين معاً — تخيّله كمقبس كهرباء يصل سكربتك بالخدمة التي تريد التحدث معها. أما <b>المنفذ (Port)</b> فهو رقم صغير يحدّد أي خدمة بالضبط تستمع على الجهاز (مثل 80 للويب و22 لـSSH).</p>' +
      TK.steps({
        a: { e: '🐍', l: 'سكربت Python' }, b: { e: '🔌', l: 'المنفذ 127.0.0.1' },
        steps: [
          { icon: '', at: 'mid', cap: 'السكربت يريد معرفة: هل يوجد برنامج يستمع على هذا المنفذ؟' },
          { icon: '📨', at: 'b', cap: '١) السكربت ينشئ socket ويحاول الاتصال: connect_ex(("127.0.0.1", 8000))', ba: 'طلب اتصال' },
          { icon: '🧠', at: 'mid', cap: '٢) نظام التشغيل يتحقق: هل برنامج ما يستمع فعلاً على هذا المنفذ؟' },
          { icon: '✅', at: 'a', cap: '٣) النتيجة 0 = اتصال ناجح → المنفذ OPEN. أي رقم آخر = closed', flash: 'ok', ba: 'استقبل 0 = OPEN' }
        ]
      }) +
      TK.check({ s: 'النتيجة 0 من connect_ex تعني أن المنفذ مغلق ولا يوجد برنامج يستمع عليه.', t: false, why: '0 تعني نجاح الاتصال، أي أن المنفذ مفتوح (OPEN) وهناك خدمة تستمع عليه.' })),
    TK.s('🧪 مختبر: فاحص المنافذ (Port Scanner) على 127.0.0.1', 'Lab — port checker on 127.0.0.1 only',
      '<div class="card"><b>قاعدة أمان:</b> هذا السكربت يفحص <span class="code">127.0.0.1</span> فقط — جهازك أنت. لا تُغيّر العنوان لاستهداف أي جهاز آخر لا تملكه.</div>' +
      '<p>السطر الأول <span class="code">import socket</span> يستدعي مكتبة socket المدمجة في بايثون (كما شرحنا في الرسم المتحرك السابق) لنفتح نقطة اتصال شبكية. الحلقة <span class="code">for port in PORTS</span> تكرّر نفس عملية الفحص على كل رقم منفذ في القائمة بدل كتابة سطر فحص مستقل لكل منفذ.</p>' +
      TK.code('import socket\n\nTARGET = "127.0.0.1"  # جهازنا فقط - لا تغيّره أبداً\nPORTS = [21, 22, 80, 443, 3306, 8000]\n\nprint(f"Scanning {TARGET} ...")\nfor port in PORTS:\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    s.settimeout(0.5)\n    result = s.connect_ex((TARGET, port))\n    status = "OPEN" if result == 0 else "closed"\n    print(f"Port {port}: {status}")\n    s.close()') +
      '<p class="lead mt">نفّذ الأوامر بنفسك في الطرفية أدناه: اقرأ الكود، شغّل خادماً بسيطاً على المنفذ 8000، ثم افحص. (هذه طرفية Linux محاكاة داخل المتصفح، فالأمر فيها يبقى <span class="code">python3</span> دائماً بصرف النظر عن نظام جهازك الحقيقي).</p>' +
      TK.shell({
        title: 'student@lab: ~ (فاحص المنافذ)', user: 'student', host: 'lab', cwd: '/home/student',
        fs: { home: { student: {
          'port_checker.py': 'import socket\n\nTARGET = "127.0.0.1"  # جهازنا فقط - لا تغيّره أبداً\nPORTS = [21, 22, 80, 443, 3306, 8000]\n\nprint(f"Scanning {TARGET} ...")\nfor port in PORTS:\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    s.settimeout(0.5)\n    result = s.connect_ex((TARGET, port))\n    status = "OPEN" if result == 0 else "closed"\n    print(f"Port {port}: {status}")\n    s.close()',
          'notes.txt': 'جرّب بهذا الترتيب:\n1) cat port_checker.py\n2) python3 -m http.server 8000\n3) python3 port_checker.py'
        } } },
        cmds: [
          { re: '^python3\\s+-m\\s+http\\.server\\s+8000', out: 'Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...', cls: 'ok' },
          { re: '^python3\\s+(\\./)?port_checker\\.py', out: 'Scanning 127.0.0.1 ...\nPort 21: closed\nPort 22: closed\nPort 80: closed\nPort 443: closed\nPort 3306: closed\nPort 8000: OPEN', cls: 'dim' }
        ],
        tasks: [
          { d: 'اقرأ الكود: <code>cat port_checker.py</code>', re: '^cat\\s+.*port_checker\\.py' },
          { d: 'شغّل خادماً بسيطاً على المنفذ 8000: <code>python3 -m http.server 8000</code>', re: '^python3\\s+-m\\s+http\\.server\\s+8000' },
          { d: 'نفّذ الفحص: <code>python3 port_checker.py</code>', re: '^python3\\s+(\\./)?port_checker\\.py' }
        ]
      })),
    TK.s('🏁 تحدي: ماذا يقول الفحص؟', 'Challenge — read the scan result',
      '<p class="lead">استخدم طرفية المختبر أعلاه بعد تشغيل الخادم على المنفذ 8000.</p>' +
      TK.challenge({ t: 'المنفذ المفتوح', q: 'بعد تشغيل <span class="code">python3 -m http.server 8000</span> ثم فاحص المنافذ، أي منفذ ظهر <b>OPEN</b>؟', answer: ['8000'], hint: 'شغّل الخادم أولاً، ثم نفّذ port_checker.py مرة أخرى.', explain: 'المنفذ 8000 أصبح OPEN لأن خادم HTTP بدأ الاستماع عليه فعلياً؛ باقي المنافذ لا تحوي أي خدمة فتبقى closed.', ph: 'رقم المنفذ' })),
    TK.breakSlide('الجزء القادم: تحليل سجلات دخول حقيقية، وفحص قوة كلمات المرور وبصماتها.'),
    TK.s('🧪 مختبر: محلل سجلات الدخول (Log Parser)', 'Lab — parse auth.log and count failures per IP',
      '<div class="card"><b>السيناريو:</b> لديك سجل دخول SSH يحوي محاولات ناجحة وفاشلة. اكتب سكربتاً يعدّ المحاولات الفاشلة لكل عنوان IP ويكشف الأكثر نشاطاً.</div>' +
      '<p>هذا السكربت يستخدم مكتبتين مدمجتين إضافيتين: <span class="code">re</span> (التعبيرات النمطية، Regular Expressions) للبحث عن نمط نصي متكرر الشكل — هنا شكل عنوان IP مثل 198.51.100.23 — داخل سطر طويل من السجل؛ و<span class="code">Counter</span> من مكتبة <span class="code">collections</span>، وهي أداة جاهزة تعدّ عدد مرات تكرار كل عنصر في قائمة تلقائياً بدل أن تكتب حلقة عدّ يدوية بنفسك.</p>' +
      TK.code('import re\nfrom collections import Counter\n\nwith open("auth.log") as f:\n    lines = f.readlines()\n\ncounter = Counter()\nfor line in lines:\n    if "Failed password" in line:\n        m = re.search(r"from (\\d+\\.\\d+\\.\\d+\\.\\d+)", line)\n        if m:\n            counter[m.group(1)] += 1\n\nprint("Failed login attempts per IP:")\nfor ip, count in counter.most_common():\n    print(f"{ip}: {count}")\n\ntop_ip, top_count = counter.most_common(1)[0]\nprint(f"\\nTop attacker: {top_ip} with {top_count} attempts")\nprint(f"Total failed attempts: {sum(counter.values())}")') +
      TK.shell({
        title: 'student@lab: ~ (محلل السجلات)', user: 'student', host: 'lab', cwd: '/home/student',
        fs: { home: { student: {
          'auth.log': 'Oct 18 02:14:01 srv sshd[1001]: Failed password for root from 198.51.100.23 port 51515 ssh2\nOct 18 02:14:05 srv sshd[1001]: Failed password for root from 198.51.100.23 port 51516 ssh2\nOct 18 02:14:09 srv sshd[1002]: Failed password for admin from 198.51.100.23 port 51517 ssh2\nOct 18 02:15:00 srv sshd[1003]: Accepted password for maya from 10.0.0.5 port 52000 ssh2\nOct 18 02:16:12 srv sshd[1004]: Failed password for root from 203.0.113.50 port 40011 ssh2\nOct 18 02:16:20 srv sshd[1001]: Failed password for root from 198.51.100.23 port 51518 ssh2\nOct 18 02:17:02 srv sshd[1005]: Failed password for test from 198.51.100.23 port 51519 ssh2\nOct 18 02:18:45 srv sshd[1006]: Failed password for guest from 203.0.113.50 port 40012 ssh2\nOct 18 02:19:00 srv sshd[1007]: Failed password for root from 198.51.100.23 port 51520 ssh2\nOct 18 02:20:30 srv sshd[1008]: Accepted password for maya from 10.0.0.5 port 52050 ssh2\nOct 18 02:21:11 srv sshd[1009]: Failed password for root from 203.0.113.50 port 40013 ssh2\nOct 18 02:22:02 srv sshd[1010]: Failed password for oracle from 198.51.100.23 port 51521 ssh2',
          'log_parser.py': 'import re\nfrom collections import Counter\n\nwith open("auth.log") as f:\n    lines = f.readlines()\n\ncounter = Counter()\nfor line in lines:\n    if "Failed password" in line:\n        m = re.search(r"from (\\d+\\.\\d+\\.\\d+\\.\\d+)", line)\n        if m:\n            counter[m.group(1)] += 1\n\nprint("Failed login attempts per IP:")\nfor ip, count in counter.most_common():\n    print(f"{ip}: {count}")\n\ntop_ip, top_count = counter.most_common(1)[0]\nprint(f"\\nTop attacker: {top_ip} with {top_count} attempts")\nprint(f"Total failed attempts: {sum(counter.values())}")'
        } } },
        cmds: [
          { re: '^python3\\s+log_parser\\.py', out: 'Failed login attempts per IP:\n198.51.100.23: 7\n203.0.113.50: 3\n\nTop attacker: 198.51.100.23 with 7 attempts\nTotal failed attempts: 10', cls: 'dim' }
        ],
        tasks: [
          { d: 'اقرأ السجل: <code>cat auth.log</code>', re: '^cat\\s+.*auth\\.log' },
          { d: 'عُدّ المحاولات الفاشلة بأدوات Linux: <code>grep Failed auth.log | wc -l</code>', re: 'grep\\s+.*Failed.*\\|\\s*wc' },
          { d: 'شغّل السكربت: <code>python3 log_parser.py</code>', re: '^python3\\s+log_parser\\.py' }
        ]
      }) +
      TK.check({ s: 'تكرار رسائل Failed password من نفس عنوان IP خلال دقائق قليلة في سجل SSH علامة شائعة على هجوم تخمين كلمات مرور (Brute Force).', t: true, why: 'المهاجم الذي يجرّب كلمات مرور كثيرة بسرعة من نفس المصدر يترك هذا النمط المتكرر في السجل.' })),
    TK.s('🏁 تحدي: من يهاجم الخادم؟', 'Challenge — who is attacking?',
      '<p class="lead">استخدم طرفية المختبر أعلاه لحل التحديين.</p>' +
      TK.challenge({ t: 'المهاجم الأكثر نشاطاً', q: 'ما عنوان IP الذي نفّذ أكثر عدد من محاولات الدخول الفاشلة؟', answer: ['198.51.100.23'], hint: 'شغّل log_parser.py وانظر إلى أول سطر في الترتيب.', explain: 'counter.most_common() يرتّب تنازلياً، فأول عنصر هو الأكثر تكراراً: 198.51.100.23.', ph: 'x.x.x.x' }) +
      TK.challenge({ t: 'عدد محاولاته', q: 'كم عدد المحاولات الفاشلة لهذا العنوان تحديداً؟', answer: ['7'], hint: 'نفس سطر الناتج يحوي الرقم بجانب العنوان.', explain: 'العنوان 198.51.100.23 ظهر في 7 محاولات فاشلة من أصل 10 في السجل كله.', ph: 'رقم' })),
    TK.s('🧪 مختبر: قوة كلمة المرور وبصمة SHA-256', 'Lab — password strength and SHA-256',
      '<p class="lead">سكربت واحد يحسب نقاط قوة كلمة المرور، ثم يحسب بصمتها (Hash) بخوارزمية SHA-256 عبر مكتبة <span class="code">hashlib</span> — مكتبة بايثون المدمجة التي شرحناها في خطوة التثبيت، فلا تحتاج أي تثبيت إضافي لها.</p>' +
      '<p>البصمة (Hash) هنا ناتج ثابت الطول (64 رمزاً دائماً) يُحسب من النص، ولا يمكن عكسه إلى النص الأصلي مهما حاولت؛ يُستخدم للتحقق من كلمات المرور دون تخزينها كنص صريح.</p>' +
      TK.code('import hashlib\n\ndef check_strength(password):\n    score = 0\n    if len(password) >= 8:\n        score += 1\n    if len(password) >= 12:\n        score += 1\n    if any(c.isupper() for c in password) and any(c.islower() for c in password):\n        score += 1\n    if any(c.isdigit() for c in password):\n        score += 1\n    if any(c in "!@#$%^&*()_+-=" for c in password):\n        score += 1\n    if score <= 2:\n        return "Weak"\n    elif score <= 4:\n        return "Medium"\n    else:\n        return "Strong"\n\npasswords = ["123456", "password", "P@ssw0rd!2025", "iloveyou"]\n\nfor p in passwords:\n    h = hashlib.sha256(p.encode()).hexdigest()\n    print(f"{p} -> strength: {check_strength(p)}")\n    print(f"  SHA-256: {h}")') +
      '<p class="lead mt">جرّب حساب SHA-256 حيّاً في متصفحك (نفس الخوارزمية بالضبط):</p>' +
      TK.transform({ input: '123456', label: 'SHA-256', gear: '🔐', fn: 'sha256', btn: 'احسب البصمة', after: 'لاحظ أن الناتج 64 رمزاً سداسي عشرياً دائماً، مهما كان طول النص المُدخَل.' }) +
      TK.shell({
        title: 'student@lab: ~ (قوة كلمة المرور)', user: 'student', host: 'lab', cwd: '/home/student',
        fs: { home: { student: {
          'password_check.py': 'import hashlib\n\ndef check_strength(password):\n    score = 0\n    if len(password) >= 8:\n        score += 1\n    if len(password) >= 12:\n        score += 1\n    if any(c.isupper() for c in password) and any(c.islower() for c in password):\n        score += 1\n    if any(c.isdigit() for c in password):\n        score += 1\n    if any(c in "!@#$%^&*()_+-=" for c in password):\n        score += 1\n    if score <= 2:\n        return "Weak"\n    elif score <= 4:\n        return "Medium"\n    else:\n        return "Strong"\n\npasswords = ["123456", "password", "P@ssw0rd!2025", "iloveyou"]\n\nfor p in passwords:\n    h = hashlib.sha256(p.encode()).hexdigest()\n    print(f"{p} -> strength: {check_strength(p)}")\n    print(f"  SHA-256: {h}")'
        } } },
        cmds: [
          { re: '^python3\\s+password_check\\.py', out: '123456 -> strength: Weak\n  SHA-256: 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92\npassword -> strength: Weak\n  SHA-256: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8\nP@ssw0rd!2025 -> strength: Strong\n  SHA-256: cebc35dde4d786bf16d4f581c5ba7e4f902be9be59c5b310dcc4a6dc94602eaf\niloveyou -> strength: Weak\n  SHA-256: e4ad93ca07acb8d908a3aa41e920ea4f4ef4f26e7f86cf8291c5db289780a5ae', cls: 'dim' }
        ],
        tasks: [
          { d: 'اقرأ الكود: <code>cat password_check.py</code>', re: '^cat\\s+.*password_check\\.py' },
          { d: 'شغّل السكربت: <code>python3 password_check.py</code>', re: '^python3\\s+password_check\\.py' }
        ]
      }) +
      TK.check({ s: 'يمكن عكس بصمة SHA-256 رياضياً لاستخراج كلمة المرور الأصلية إذا عرفت الخوارزمية المستخدمة.', t: false, why: 'SHA-256 دالة هاش أحادية الاتجاه: تحسب بصمة ثابتة لكنها لا تُعاد أبداً إلى النص الأصلي.' })),
    TK.s('🏁 تحدي: اقرأ نتيجة السكربت', 'Challenge — read the script output',
      '<p class="lead">استخدم مخرجات مختبر كلمة المرور أعلاه.</p>' +
      TK.challenge({ t: 'التصنيف', q: 'ما تصنيف قوة كلمة المرور <span class="code">P@ssw0rd!2025</span> حسب السكربت؟', answer: ['Strong', 'strong'], hint: 'انظر السطر الذي يبدأ بـ P@ssw0rd!2025 في مخرجات password_check.py.', explain: 'طولها وتنوّع أحرفها (كبيرة وصغيرة وأرقام ورمز) رفع نقاطها فوق 4 فصُنّفت Strong.', ph: 'Weak/Medium/Strong' }) +
      TK.challenge({ t: 'البصمة', q: 'بم تبدأ بصمة SHA-256 لكلمة <span class="code">password</span> (أول 6 خانات)؟', answer: ['5e8848'], hint: 'انظر سطر SHA-256 أسفل password في المخرجات.', explain: 'بصمة password الكاملة تبدأ بـ 5e8848... وأي تغيير بحرف واحد يغيّر الناتج بالكامل.', ph: 'أول 6 خانات' })),
    TK.s('🧪 مختبر: التشفير الكلاسيكي — Caesar وXOR وBase64', 'Lab — Caesar, XOR and Base64',
      '<p class="lead">ثلاث طرق تحويل نص مختلفة تماماً: قيصر (إزاحة حروف)، XOR (عملية ثنائية مع مفتاح)، وBase64 (ترميز لا تشفير حقيقي).</p>' +
      '<p>بالعربي البسيط: <b>التشفير</b> (Caesar وXOR هنا) يحتاج مفتاحاً أو سرّاً (رقم الإزاحة أو كلمة المفتاح) لفكّه، فبدونه النص يبقى غير مفهوم. أما <b>الترميز</b> (Base64) فلا يحتاج أي سرّ على الإطلاق — أي شخص يعرف طريقة Base64 يستطيع فكّه فوراً، فهو مجرد تحويل شكل البيانات لتسهيل نقلها، لا إخفاء حقيقي لمحتواها.</p>' +
      TK.code('import base64\n\n\ndef caesar(text, shift):\n    result = ""\n    for ch in text:\n        if ch.isalpha():\n            base = ord("A") if ch.isupper() else ord("a")\n            result += chr((ord(ch) - base + shift) % 26 + base)\n        else:\n            result += ch\n    return result\n\n\ndef xor_crypt(data, key):\n    return bytes([b ^ ord(key[i % len(key)]) for i, b in enumerate(data)])\n\n\nplain = "ATTACK AT DAWN"\nshift = 3\nencoded = caesar(plain, shift)\nprint(f"Caesar encode (shift {shift}): {encoded}")\nprint(f"Caesar decode: {caesar(encoded, -shift)}")\n\nmsg = b"HELLO"\nkey = "K"\nxored = xor_crypt(msg, key)\nprint(f"XOR result (hex): {xored.hex()}")\nprint(f"XOR decoded back: {xor_crypt(xored, key).decode()}")\n\ntext = "Cyber2025"\nb64 = base64.b64encode(text.encode()).decode()\nprint(f"Base64 encode: {b64}")\nprint(f"Base64 decode: {base64.b64decode(b64).decode()}")') +
      '<p class="lead mt">جرّب عجلة Caesar حيّة قبل أن تشغّل السكربت:</p>' + TK.live('caesar') +
      TK.shell({
        title: 'student@lab: ~ (أداة التشفير)', user: 'student', host: 'lab', cwd: '/home/student',
        fs: { home: { student: {
          'cipher_tool.py': 'import base64\n\n\ndef caesar(text, shift):\n    result = ""\n    for ch in text:\n        if ch.isalpha():\n            base = ord("A") if ch.isupper() else ord("a")\n            result += chr((ord(ch) - base + shift) % 26 + base)\n        else:\n            result += ch\n    return result\n\n\ndef xor_crypt(data, key):\n    return bytes([b ^ ord(key[i % len(key)]) for i, b in enumerate(data)])\n\n\nplain = "ATTACK AT DAWN"\nshift = 3\nencoded = caesar(plain, shift)\nprint(f"Caesar encode (shift {shift}): {encoded}")\nprint(f"Caesar decode: {caesar(encoded, -shift)}")\n\nmsg = b"HELLO"\nkey = "K"\nxored = xor_crypt(msg, key)\nprint(f"XOR result (hex): {xored.hex()}")\nprint(f"XOR decoded back: {xor_crypt(xored, key).decode()}")\n\ntext = "Cyber2025"\nb64 = base64.b64encode(text.encode()).decode()\nprint(f"Base64 encode: {b64}")\nprint(f"Base64 decode: {base64.b64decode(b64).decode()}")'
        } } },
        cmds: [
          { re: '^python3\\s+cipher_tool\\.py', out: 'Caesar encode (shift 3): DWWDFN DW GDZQ\nCaesar decode: ATTACK AT DAWN\nXOR result (hex): 030e070704\nXOR decoded back: HELLO\nBase64 encode: Q3liZXIyMDI1\nBase64 decode: Cyber2025', cls: 'dim' }
        ],
        tasks: [
          { d: 'اقرأ الكود: <code>cat cipher_tool.py</code>', re: '^cat\\s+.*cipher_tool\\.py' },
          { d: 'شغّل السكربت: <code>python3 cipher_tool.py</code>', re: '^python3\\s+cipher_tool\\.py' }
        ]
      }) +
      TK.check({ s: 'ترميز Base64 يحتاج مفتاحاً سرياً لفكّه تماماً مثل التشفير بـ Caesar أو XOR.', t: false, why: 'Base64 لا يحتاج أي سرّ؛ أي شخص يعرف طريقته يفكّه فوراً، بعكس التشفير الذي يحتاج مفتاحاً.' })),
    TK.s('🏁 تحدي: فُك الشيفرة', 'Challenge — decode it',
      '<p class="lead">استخدم مخرجات مختبر التشفير أعلاه، أو جرّب عجلة Caesar مباشرة.</p>' +
      TK.challenge({ t: 'فك Base64', q: 'ماذا ينتج عن فك ترميز Base64 للنص <span class="code">Q3liZXIyMDI1</span>؟', answer: ['Cyber2025'], hint: 'شغّل cipher_tool.py وانظر سطر Base64 decode.', explain: 'base64.b64decode يعيد النص الأصلي Cyber2025 كما كان قبل الترميز.', ph: 'النص الأصلي' })),
    TK.s('🛠️ مختبر: فحص ترويسات الأمان على صفحتك المحلية', 'Lab — security headers checker with requests',
      TK.tool({ e: '📡', n: 'مكتبة requests', what: 'مكتبة بايثون لإرسال طلبات HTTP وقراءة الردود (الحالة والترويسات والمحتوى).', why: 'ترويسات الأمان (Security Headers) تخبرك إن كان الخادم يحمي نفسه من هجمات شائعة مثل XSS وClickjacking.', how: 'تُرسل طلب GET لصفحتك المحلية على 127.0.0.1 وتفحص وجود أربع ترويسات أساسية في الرد.' }) +
      '<div class="note">requests مكتبة خارجية غير مدمجة في بايثون، فتحتاج تثبيتاً مرة واحدة على جهازك الحقيقي (كما شرحنا في مختبر التثبيت):<br>🪟 Windows: <code>pip install requests</code><br>🍎 macOS / 🐧 Linux: <code>pip3 install requests</code></div>' +
      TK.code('import requests\n\nurl = "http://127.0.0.1:8000/"\nr = requests.get(url, timeout=3)\n\nimportant = [\n    "X-Content-Type-Options",\n    "X-Frame-Options",\n    "Content-Security-Policy",\n    "Strict-Transport-Security",\n]\n\nprint(f"Status: {r.status_code}")\nfor header in important:\n    if header in r.headers:\n        print(f"[OK]      {header}: {r.headers[header]}")\n    else:\n        print(f"[MISSING] {header}")') +
      '<p class="lead mt">أنشئ صفحة اختبار بسيطة على جهازك وافحصها — لا تفحص أي موقع آخر لا تملكه.</p>' +
      TK.shell({
        title: 'student@lab: ~ (فحص الترويسات)', user: 'student', host: 'lab', cwd: '/home/student',
        fs: { home: { student: {
          'headers_check.py': 'import requests\n\nurl = "http://127.0.0.1:8000/"\nr = requests.get(url, timeout=3)\n\nimportant = [\n    "X-Content-Type-Options",\n    "X-Frame-Options",\n    "Content-Security-Policy",\n    "Strict-Transport-Security",\n]\n\nprint(f"Status: {r.status_code}")\nfor header in important:\n    if header in r.headers:\n        print(f"[OK]      {header}: {r.headers[header]}")\n    else:\n        print(f"[MISSING] {header}")',
          site: { 'index.html': '<html><body><h1>Test Page</h1></body></html>' }
        } } },
        cmds: [
          { re: '^python3\\s+-m\\s+http\\.server\\s+8000', out: 'Serving HTTP on 127.0.0.1 port 8000 (http://127.0.0.1:8000/) ...', cls: 'ok' },
          { re: '^python3\\s+headers_check\\.py', out: 'Status: 200\n[MISSING] X-Content-Type-Options\n[MISSING] X-Frame-Options\n[MISSING] Content-Security-Policy\n[MISSING] Strict-Transport-Security', cls: 'bad' }
        ],
        tasks: [
          { d: 'ابدأ خادم اختبار بسيطاً على جهازك: <code>python3 -m http.server 8000</code>', re: '^python3\\s+-m\\s+http\\.server\\s+8000' },
          { d: 'نفّذ فاحص الترويسات: <code>python3 headers_check.py</code>', re: '^python3\\s+headers_check\\.py' }
        ]
      }) +
      TK.check({ s: 'ظهور [MISSING] أمام ترويسة أمان في مخرجات السكربت يعني أن الخادم لا يرسل تلك الحماية في رده.', t: true, why: 'السكربت يطبع MISSING فقط عندما لا يجد الترويسة في رؤوس الرد القادمة من الخادم.' })),
    TK.s('🏁 تحدي: كم ترويسة ناقصة؟', 'Challenge — count missing headers',
      '<p class="lead">استخدم مخرجات مختبر فحص الترويسات أعلاه.</p>' +
      TK.challenge({ t: 'العدّ', q: 'من بين الترويسات الأربع المفحوصة، كم ترويسة أمان ظهرت ناقصة (MISSING) في صفحة الاختبار؟', answer: ['4'], hint: 'عُدّ أسطر [MISSING] في المخرجات.', explain: 'صفحة http.server الافتراضية لا تضيف أياً من الترويسات الأربع، لذا كلها MISSING — مؤشر على إعدادات افتراضية غير محصّنة.', ph: 'رقم' })),
    TK.s('🎯 مشروع مصغّر: مراقب السجلات (Log Watcher)', 'Mini-project — build a log watcher',
      '<div class="card"><b>المهمة:</b> طوّر log_parser.py ليصبح مراقباً تلقائياً: بدل طباعة كل الأعداد فقط، اجعله يُصدر تنبيه ALERT لأي IP تجاوز عتبة معينة من المحاولات الفاشلة.</div>' +
      TK.lab({
        t: 'ابنِ log_watch.py خطوة بخطوة', time: '15 د', req: 'ملفا auth.log وlog_parser.py من المختبر السابق',
        steps: [
          'انسخ محتوى log_parser.py إلى ملف جديد باسم log_watch.py',
          'أضف في أعلى الملف متغيّراً: <code>THRESHOLD = 3</code> (عتبة: رقم حدّي نقارن به كل عدّاد)',
          'بدل حلقة الطباعة البسيطة، استخدم شرطاً: إن كان count >= THRESHOLD اطبع ALERT، وإلا اطبع ok',
          'شغّل السكربت وتأكد أن كل IP ظهر بسطر ALERT أو ok واضح',
          '(تحدٍّ إضافي) اجعل THRESHOLD يُقرأ من سطر الأوامر عبر <code>sys.argv</code> بدل كتابته داخل الكود. sys.argv هي قائمة جاهزة في بايثون تحوي الكلمات التي كتبتها بعد اسم السكربت عند تشغيله، فتستطيع تغيير العتبة بدون تعديل الكود كل مرة.'
        ],
        tip: 'هذا بالضبط مبدأ عمل أدوات SIEM الحقيقية في الشركات: قواعد بسيطة + عتبات + تنبيهات.'
      }) +
      TK.terminal({ title: 'student@lab:~$', btn: 'شاهد مراقب السجلات يعمل', lines: [
        ['cmd', '$ python3 log_watch.py'], ['bad', 'ALERT: 198.51.100.23 has 7 failed attempts (threshold 3)', 500],
        ['bad', 'ALERT: 203.0.113.50 has 3 failed attempts (threshold 3)', 500],
        ['dim', '# كلا العنوانين تجاوز العتبة 3 في هذا السجل التدريبي']
      ] })),
    TK.s('📋 ورقة الغش: مكتبات بايثون في هذه الوحدة', 'Cheat sheet — libraries used today',
      '<p class="lead">تذكير أخير: المكتبة (Library/Module) هي كود جاهز تستورده بسطر <code>import</code> بدل إعادة كتابته. كل هذه مكتبات مدمجة في بايثون ولا تحتاج تثبيتاً، إلا requests التي تحتاج <code>pip</code> / <code>pip3</code> كما شرحنا.</p>' +
      TK.table(['المكتبة', 'الاستخدام', 'مثال من اليوم'], [
        ['<code>socket</code>', 'فتح اتصال شبكي والتحقق من منفذ', 'connect_ex(("127.0.0.1", 8000))'],
        ['<code>re</code>', 'البحث عن نمط نصي (تعبير نمطي)', 're.search(r"from (\\d+\\.\\d+\\.\\d+\\.\\d+)", line)'],
        ['<code>collections.Counter</code>', 'عدّ تكرار العناصر وترتيبها', 'counter.most_common()'],
        ['<code>hashlib</code>', 'حساب بصمة (Hash) ثابتة لنص', 'hashlib.sha256(p.encode()).hexdigest()'],
        ['<code>base64</code>', 'ترميز/فك ترميز نص لنص آمن للنقل', 'base64.b64encode(text.encode())'],
        ['<code>requests</code>', 'إرسال طلب HTTP وقراءة الترويسات', 'requests.get(url).headers']
      ]) + TK.terms([
        ['Hash (بصمة)', 'ناتج ثابت الطول لا يمكن عكسه إلى النص الأصلي؛ يتغيّر كلياً بتغيّر حرف واحد.'],
        ['Encoding (ترميز)', 'تحويل شكل البيانات (مثل Base64) دون إخفاء حقيقي — يمكن عكسه دائماً دون مفتاح.'],
        ['Threshold (عتبة)', 'رقم حدّي يُستخدم لإطلاق تنبيه عند تجاوزه.']
      ]))
  ],
  quiz: [
    { q: 'ماذا تسمى في بايثون القطعة من الكود التي تُنفَّذ باسمها كل مرة تحتاج تلك المهمة دون إعادة كتابتها؟', ok: 'الدالة (Function)', no: ['المتغيّر (Variable)', 'الحلقة (Loop)', 'المكتبة (Library)'], why: 'الدالة كود له اسم يُستدعى لتنفيذ مهمة محددة دون إعادة كتابته كل مرة.' },
    { q: 'عند تثبيت Python على ويندوز، ما الخيار المهم الذي يجب تفعيله في أول شاشة من المثبّت؟', ok: 'Add python.exe to PATH', no: ['Install for all users فقط', 'Create desktop shortcut', 'Enable pip upgrade'], why: 'بدون هذا الخيار لن يتعرّف الجهاز على أمر python من الطرفية بعد التثبيت.' },
    { q: 'في فاحص المنافذ بمكتبة socket، ماذا تعني النتيجة 0 التي تعيدها connect_ex؟', ok: 'الاتصال نجح، أي أن المنفذ مفتوح (OPEN)', no: ['المنفذ مغلق تماماً', 'حدث خطأ في الشبكة', 'الجهاز غير متصل بالإنترنت'], why: 'connect_ex تُعيد 0 فقط عند نجاح الاتصال، وهذا يحدث عندما تستمع خدمة على ذلك المنفذ.' },
    { q: 'لماذا يجب أن يبقى TARGET في سكربت فحص المنافذ التعليمي يساوي 127.0.0.1؟', ok: 'لأن فحص جهاز آخر لا تملكه أو لا تملك إذناً صريحاً لفحصه غير قانوني وغير أخلاقي', no: ['لأن 127.0.0.1 هو العنوان الوحيد الذي تدعمه مكتبة socket', 'لأن تغييره يعطّل السكربت فوراً', 'لأن أي عنوان آخر يحتاج اتصالاً بالإنترنت فقط'], why: 'عمل السكربت بدون خطأ لا يعني أن الفحص قانوني؛ يجب فحص جهازك فقط أو أجهزة تملك إذناً صريحاً لفحصها.' },
    { q: 'ما وظيفة مكتبة re (التعبيرات النمطية) في سكربت محلل السجلات؟', ok: 'البحث عن نمط نصي متكرر الشكل مثل عنوان IP داخل سطر السجل', no: ['حساب بصمة الهاش للنص', 'فتح اتصال شبكي بمنفذ معيّن', 'ترتيب الأرقام تصاعدياً'], why: 're.search تبحث عن نمط مثل شكل عنوان IP وتستخرجه من السطر.' },
    { q: 'ماذا تفعل الدالة counter.most_common() في سكربت محلل السجلات؟', ok: 'ترتّب عناوين IP تنازلياً حسب عدد مرات تكرارها', no: ['ترتّب العناوين أبجدياً', 'تحذف العناوين المتكررة أقل من مرتين', 'تحوّل كل عنوان إلى بصمة هاش'], why: 'Counter يعدّ التكرار وmost_common() ترتّب تنازلياً حسب هذا العدد فقط.' },
    { q: 'لماذا لا يمكن استخدام hashlib.sha256() لاستعادة كلمة المرور الأصلية من بصمتها؟', ok: 'لأن SHA-256 دالة اتجاه واحد لا تُعكس رياضياً إلى النص الأصلي', no: ['لأن بايثون يحذف النص الأصلي من الذاكرة فوراً', 'لأن الدالة تحتاج مفتاحاً سرياً غير متوفر', 'لأن طول البصمة يتغيّر مع كل تشغيل للسكربت'], why: 'الهاش يحسب بصمة ثابتة لا يمكن عكسها، بعكس التشفير القابل للفك.' },
    { q: 'ما الفرق الجوهري بين التشفير مثل Caesar وXOR والترميز مثل Base64؟', ok: 'التشفير يحتاج مفتاحاً أو سرّاً لفكّه، بينما الترميز لا يحتاج أي سرّ ويمكن فكّه فوراً', no: ['التشفير أبطأ من الترميز فقط', 'الترميز يعمل على الأرقام فقط', 'لا فرق حقيقي بينهما'], why: 'Caesar وXOR يحتاجان إزاحة أو مفتاحاً، أما Base64 فمعروف للجميع ولا يحتاج سرّاً.' },
    { q: 'عند تطبيق xor_crypt مرتين على نفس البيانات بنفس المفتاح، ما النتيجة؟', ok: 'تعود البيانات إلى شكلها الأصلي كما كانت قبل التشفير', no: ['تُحذف البيانات نهائياً', 'يتضاعف طول البيانات', 'تتحوّل البيانات إلى نص Base64'], why: 'XOR عملية قابلة للعكس بالكامل، فتطبيقها مرتين بنفس المفتاح يعيد النص الأصلي.' },
    { q: 'غياب ترويسة Content-Security-Policy في رد خادم ويب، كما يكشفه سكربت requests، يعني:', ok: 'أن الصفحة لا تطبّق هذه الحماية وتصبح أكثر عرضة لثغرات مثل XSS', no: ['أن الخادم يعمل بإصدار بايثون قديم', 'أن الصفحة محمية بشكل كامل تلقائياً', 'أن الاتصال غير متاح عبر HTTPS فقط'], why: 'ترويسات الأمان المفقودة تعني غياب حماية معيّنة يجب تحسينها كأول خطوة في تحصين الخادم.' }
  ],
  audit: ['ثبّتّ Python وشغّلت أول سكربت hello.py', 'نفّذت فاحص منافذ socket على 127.0.0.1 وفسّرت نتيجته', 'استخدمت log_parser.py لإيجاد أكثر IP بمحاولات فاشلة', 'حسبت SHA-256 لعدة كلمات مرور وصنّفت قوتها', 'شفّرت وفككت نصاً بـ Caesar وXOR وBase64', 'فحصت ترويسات الأمان لصفحة محلية بمكتبة requests', 'بنيت نسخة مبدئية من مراقب السجلات log_watch.py'],
  recap: ['بايثون يمنحك أتمتة حقيقية: من فحص منفذ واحد إلى تحليل آلاف أسطر السجلات في ثوانٍ', 'socket وhashlib وbase64 وrequests مكتبات جاهزة تغنيك عن إعادة اختراع العجلة', 'اختبر دائماً على 127.0.0.1 (جهازك) أولاً، ولا تفحص أو تختبر أي جهاز لا تملكه'],
  homework: 'طوّر log_watch.py ليقرأ اسم ملف السجل والعتبة من سطر الأوامر عبر sys.argv، وجرّبه على عتبتين مختلفتين (3 و5)، ثم أرسل الكود والمخرجات للمدرّب.',
  resources: [{ t: 'Python — التحميل الرسمي', u: 'https://www.python.org/' }, { t: 'Thonny IDE للمبتدئين', u: 'https://thonny.org/' }, { t: 'dCode — أدوات تشفير وفك تشفير للتحقق', u: 'https://www.dcode.fr/' }, { t: 'Replit — كتابة وتشغيل بايثون من المتصفح', u: 'https://replit.com/' }],
  next: 'في الوحدة القادمة: الشبكات المتقدمة وWi-Fi وVPN'
});
