/* المستوى الأول — الوحدة 5: الشبكات من الداخل */
TK.module({
  id: 'L1-05', level: 1, num: 5, slug: 'الشبكات-من-الداخل',
  title: 'الشبكات من الداخل: كيف تنتقل بياناتك وكيف نراها؟', en: 'Networks from the Inside', emoji: '🌐',
  lead: 'في هذه الوحدة ستتتبّع رحلة حزمة بيانات من جهازك إلى الخادم، وتستخدم ping وnslookup وtraceroute وnetstat في طرفية تدريبية، وتفحص المنافذ، ثم تلتقط حركة الشبكة بأداة Wireshark وتقرأ بنفسك كلمة مرور مسرّبة من موقع غير مشفّر. النظرية 10 دقائق فقط.',
  tags: ['🛠️ Wireshark', '🛠️ ping / nslookup / traceroute / netstat', '🧪 طرفية شبكة تفاعلية'],
  agenda: [
    { t: '💡 مفهوم سريع: IP والمنفذ وDNS', time: '6 د' },
    { t: '🎬 رحلة الحزمة وبحث DNS (حركة)', time: '6 د' },
    { t: '🧪 مختبر ١: أدوات الشبكة في الطرفية', time: '20 د' },
    { t: '🏁 تحديات الطرفية (DNS، القفزات، اتصال مشبوه)', time: '6 د' },
    { t: '☕ استراحة', time: '10 د' },
    { t: '🚪 المنافذ: فحص، تصنيف، تحدٍّ', time: '12 د' },
    { t: '🔐 HTTP مقابل HTTPS', time: '5 د' },
    { t: '🧪 مختبر ٢: التقاط الحزم بـ Wireshark', time: '15 د' },
    { t: '🏁 حلّل التقاطاً مسرّباً', time: '10 د' }
  ],
  slides: [
    TK.concept({
      t: 'عنوان، باب، ودليل أسماء', en: 'IP, Port, DNS', min: '6 د',
      body: '<p>كل ما تفعله على الإنترنت هو مراسلة بين جهازين. تخيّل مدينة:</p>' +
        '<div class="grid g3 mt">' +
        '<div class="card"><b>🏠 عنوان IP</b><p>عنوان المبنى. كل جهاز له رقم مثل <span class="code">192.168.56.10</span>. الأرقام التي تبدأ بـ <span class="code">192.168</span> خاصة بشبكتك الداخلية فقط.</p></div>' +
        '<div class="card"><b>🚪 المنفذ (Port)</b><p>رقم الباب داخل المبنى. كل خدمة تنتظر على باب: المواقع على 80 و443، و SSH على 22. المجموع 65535 باباً.</p></div>' +
        '<div class="card"><b>📖 DNS</b><p>دليل الهاتف. الناس يحفظون الأسماء مثل <span class="code">tweetkod.example</span>، والشبكة تفهم الأرقام فقط، فيترجم DNS الاسم إلى IP.</p></div>' +
        '</div>' +
        '<p class="mt">قبل أن نكمل: كل تواصل بين جهازين يحتاج <b>بروتوكولاً (Protocol)</b>، وهو مجموعة قواعد متفق عليها مسبقاً تشبه قواعد المراسلة البريدية (أين يُكتب العنوان، وبأي ترتيب تُقرأ الرسالة). HTTP وDNS كل منهما بروتوكول له قواعده الخاصة.</p>' +
        '<p class="mt">والبيانات لا تسافر دفعة واحدة، بل تُقطَّع إلى <b>حزم (Packets)</b> صغيرة على كل منها عنوان المرسل والمستقبل، وتمرّ عبر عدة راوترات (Router) حتى تصل. الراوتر جهاز صغير مهمته الوحيدة قراءة عنوان كل حزمة وتقرير إلى أين يرسلها تالياً، تماماً كموظف بريد يقرأ العنوان على الظرف ويضعه في الصندوق الصحيح.</p>' +
        '<p class="mt">ولتسليم الحزم تتعاون بروتوكولات نقل: <b>TCP</b> يتأكد أن كل حزمة وصلت وبالترتيب الصحيح، فيناسب فتح موقع أو تنزيل ملف لا يحتمل الخطأ. أما <b>UDP</b> فأسرع لأنه لا ينتظر تأكيد الاستلام، فيناسب مكالمات الفيديو والألعاب حيث فقدان حزمة واحدة أهون من التأخير.</p>' +
        '<div class="note">في هذه الوحدة نستخدم عناوين وهمية مخصّصة للتدريب: الشبكة <span class="code">192.168.56.0/24</span> (مختبرك) والنطاق <span class="code">203.0.113.x</span> (مخصّص للأمثلة ولا يعود لجهة حقيقية).</div>' +
        TK.check({ s: 'بروتوكول TCP يتأكد من وصول كل حزمة بالترتيب الصحيح، بينما UDP أسرع لأنه لا ينتظر تأكيد الاستلام.', t: true, why: 'صحيح: TCP يناسب المواقع والملفات التي لا تحتمل الخطأ، وUDP يناسب الفيديو والألعاب حيث السرعة أهم من إعادة الإرسال.' }),
      key: 'IP يحدّد الجهاز، والمنفذ يحدّد الخدمة، وDNS يحوّل الاسم إلى IP.'
    }),
    TK.s('🎬 رحلة الحزمة: من جهازك إلى الخادم', 'Animated: the journey of a packet',
      '<p class="lead">اضغط «الخطوة التالية» وتابع الحزمة وهي تمرّ بالراوتر ومزوّد الإنترنت حتى الخادم، ثم تعود.</p>' +
      TK.steps({
        a: { e: '💻', l: 'جهازك 192.168.56.10' }, b: { e: '🖥️', l: 'الخادم 203.0.113.25' },
        steps: [
          { icon: '', at: 'a', cap: 'تكتب عنوان موقع في المتصفح. جهازك يريد طلب الصفحة من الخادم.' },
          { icon: '📦', at: 'a', cap: '١) جهازك يقسّم الطلب إلى حزم، ويكتب على كل حزمة عنوان المرسل والمستقبل.', ba: 'يجهّز الحزم' },
          { icon: '📦', at: 38, cap: '٢) الحزمة تصل إلى الراوتر (البوابة 192.168.56.1). يقرأ العنوان ويقرّر أنه خارج شبكتك فيمرّرها للخارج.' },
          { icon: '📦', at: 62, cap: '٣) مزوّد الإنترنت (ISP) — وهو الشركة التي تدفع لها لتوصيلك بالإنترنت في المنزل أو عبر باقة الجوال — يمرّرها عبر عدة راوترات. كل راوتر يُسمّى «قفزة» (Hop)، وهي ما يعدّه الأمر traceroute.' },
          { icon: '📦', at: 'b', cap: '٤) الخادم يستلم الحزم ويعيد ترتيبها ثم يفهم الطلب.', bb: 'استلم الطلب' },
          { icon: '📄', at: 62, cap: '٥) الخادم يرسل الصفحة على شكل حزم جديدة تعود عبر الطريق نفسه تقريباً.' },
          { icon: '✅', at: 'a', cap: '٦) جهازك يجمع الحزم ويعرض الصفحة. كل هذا يحدث في أجزاء من الثانية.', flash: 'ok', ba: 'عرض الصفحة' }
        ]
      })),
    TK.s('🎬 بحث DNS: كيف يتحوّل الاسم إلى رقم؟', 'Animated: a DNS lookup',
      '<p class="lead">قبل أن تبدأ رحلة الحزمة، يجب أن يعرف جهازك عنوان IP. تابع كيف يحصل عليه.</p>' +
      TK.steps({
        a: { e: '📱', l: 'جهازك' }, b: { e: '📖', l: 'خادم DNS' },
        steps: [
          { icon: '', at: 'mid', cap: 'كتبتَ tweetkod.example في المتصفح، لكن الشبكة تفهم الأرقام فقط.' },
          { icon: '❓', at: 'a', cap: '١) المتصفح يبحث في ذاكرته المؤقتة (Cache) عن الاسم، فلا يجده.', ba: 'لا يعرف العنوان' },
          { icon: '❓', at: 'b', cap: '٢) جهازك يسأل خادم DNS المضبوط عندك (تجده في الملف /etc/resolv.conf): ما عنوان tweetkod.example؟ السؤال يخرج عادةً عبر المنفذ 53.', bb: 'يستقبل السؤال' },
          { icon: '🔎', at: 'b', cap: '٣) إن لم يكن الخادم يعرف الجواب سأل خوادم أخرى بالتسلسل حتى يصل إلى الخادم المسؤول عن النطاق.', bb: 'يبحث' },
          { icon: '🔢', at: 'a', cap: '٤) يعود الجواب: 203.0.113.25 ويُحفظ مؤقتاً لتسريع الطلبات القادمة.', flash: 'ok', ba: 'عرف العنوان' },
          { icon: '🚀', at: 'mid', cap: '٥) الآن فقط يبدأ الاتصال بالرقم 203.0.113.25 على المنفذ 443 (HTTPS).' },
          { icon: '☠️', at: 'b', cap: 'تحذير: لو زوّر مهاجم جواب DNS لأعطاك عنواناً مزيّفاً وذهبتَ إلى موقع مقلّد. لذلك ننتبه للقفل وعنوان الموقع.', flash: 'bad', bb: 'جواب مزوّر' }
        ]
      })),
    TK.s('🧪 مختبر ١: أدوات الشبكة في طرفية Linux', 'Lab 1 — ping, nslookup, traceroute, netstat',
      '<div class="card"><b>السيناريو:</b> أنت على جهاز مختبر <span class="code">192.168.56.10</span> داخل شبكة <span class="code">192.168.56.0/24</span>. الخادم التدريبي هو <span class="code">192.168.56.101</span>. اقرأ الملف <span class="code">mission.txt</span> ثم نفّذ المهام. ما تراه هنا هو محاكاة بنفس شكل مخرجات الأدوات الحقيقية.</div>' +
      '<div class="tip mt"><b>لماذا هذه الأوامر؟</b> <code>ip addr</code> تعرف بها من أنت، و<code>ping</code> تسأل: هل الجهاز حيّ؟ (ترسل رسالة قصيرة تسمى ICMP وتنتظر رداً، وتقيس زمن الرحلة ذهاباً وإياباً)، و<code>nslookup</code> تسأل DNS، و<code>traceroute</code> تكشف الطريق، و<code>netstat</code> تكشف من يتصل بجهازك الآن. <br>🪟 <b>ملاحظة Windows (PowerShell):</b> نفس الفكرة بأسماء مختلفة قليلاً: <code>ipconfig /all</code> بدل <code>ip addr</code>، و<code>ping</code> تعمل كما هي، و<code>tracert</code> بدل <code>traceroute</code>، و<code>netstat -an</code> نفسها تعمل، ويمكنك أيضاً تجربة <code>Resolve-DnsName</code> و<code>Get-NetTCPConnection</code> كأدوات PowerShell حديثة. الجدول الكامل في ورقة الغش آخر الوحدة.</div>' +
      TK.shell({
        title: 'student@lab-pc: ~ (شبكة المختبر)', user: 'student', host: 'lab-pc', cwd: '/home/student',
        fs: {
          home: { student: {
            'mission.txt': 'مهمتك: افهم شبكتك.\n1) ما عنوان IP لجهازك؟  (ip addr)\n2) هل الخادم 192.168.56.101 حيّ؟  (ping -c 4 192.168.56.101)\n3) ما عنوان tweetkod.example؟  (nslookup tweetkod.example)\n4) كم قفزة بينك وبين الخادم؟  (traceroute tweetkod.example)\n5) من يتصل بجهازك الآن؟  (netstat -an)',
            'tips.txt': 'ping -c 4 هدف     : أرسل 4 رسائل فحص فقط\nnslookup اسم       : اسأل DNS عن الاسم\ntraceroute اسم     : اعرض القفزات\nnetstat -an        : اعرض كل الاتصالات والمنافذ'
          } },
          etc: {
            'resolv.conf': '# يُنشأ تلقائياً\nnameserver 192.168.56.1\nsearch lab.local',
            hosts: '127.0.0.1 localhost\n127.0.1.1 lab-pc',
            hostname: 'lab-pc'
          }
        },
        tasks: [
          { d: 'اعرف عنوان IP لجهازك: <code>ip addr</code><br><span class="tag">🪟 Windows (PowerShell): ipconfig /all</span> <span class="tag">🍎 macOS: ifconfig</span>', re: '^(ip\\s+(a|addr)|ifconfig)' },
          { d: 'اعرف عنوان البوابة (الراوتر): <code>ip route</code>', re: '^ip\\s+(r|route)' },
          { d: 'افحص الخادم التدريبي: <code>ping -c 4 192.168.56.101</code><br><span class="tag">🪟 Windows (PowerShell): نفس الأمر ping، فقط بعلم -n بدل -c → ping -n 4 192.168.56.101</span>', re: '^ping\\s+.*192\\.168\\.56\\.101\\s*$' },
          { d: 'افحص عنواناً غير موجود: <code>ping -c 4 192.168.56.77</code><br><span class="tag">🪟 Windows: ping -n 4 192.168.56.77</span>', re: '^ping\\s+.*192\\.168\\.56\\.77\\s*$' },
          { d: 'اسأل DNS: <code>nslookup tweetkod.example</code><br><span class="tag">🪟 Windows (PowerShell): نفس الأمر nslookup متوفر أصلاً، أو جرّب Resolve-DnsName tweetkod.example</span>', re: '^nslookup\\s+tweetkod\\.example' },
          { d: 'اسأل عن خادم البريد: <code>nslookup mail.tweetkod.example</code><br><span class="tag">🪟 Windows: نفس الأمر، أو Resolve-DnsName mail.tweetkod.example</span>', re: '^nslookup\\s+mail\\.tweetkod\\.example' },
          { d: 'تتبّع الطريق: <code>traceroute tweetkod.example</code><br><span class="tag">🪟 Windows (PowerShell): tracert tweetkod.example</span>', re: '^traceroute\\s+.*tweetkod\\.example' },
          { d: 'اعرض الاتصالات والمنافذ: <code>netstat -an</code><br><span class="tag">🪟 Windows (PowerShell): نفس الأمر netstat -an يعمل تماماً، أو جرّب البديل الحديث Get-NetTCPConnection</span>', re: '^netstat\\s+.*-\\w*a' },
          { d: 'اعرف خادم DNS الذي تستخدمه: <code>cat /etc/resolv.conf</code>', re: '^cat\\s+/etc/resolv\\.conf' }
        ],
        cmds: [
          { re: '^help\\s*$', out: 'أوامر الشبكة: ip addr | ip route | ifconfig | ping -c 4 هدف | nslookup اسم | traceroute اسم | netstat -an\nأوامر الملفات: ls cd pwd cat head tail grep find wc echo\n\nملاحظة: هذه طرفية تدريبية بأوامر Linux. على جهازك الحقيقي في Windows (PowerShell) استخدم بدلاً منها: ipconfig /all | ping -n 4 هدف | nslookup اسم (أو Resolve-DnsName) | tracert هدف | netstat -an (أو Get-NetTCPConnection).' },
          { re: '^(ip\\s+(a|addr)|ifconfig)', out: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000\n    link/ether 08:00:27:4e:66:a1 brd ff:ff:ff:ff:ff:ff\n    inet 192.168.56.10/24 brd 192.168.56.255 scope global eth0' },
          { re: '^ip\\s+(r|route)', out: 'default via 192.168.56.1 dev eth0\n192.168.56.0/24 dev eth0 proto kernel scope link src 192.168.56.10' },
          { re: '^ping\\s+.*192\\.168\\.56\\.101\\s*$', cls: 'ok', out: 'PING 192.168.56.101 (192.168.56.101) 56(84) bytes of data.\n64 bytes from 192.168.56.101: icmp_seq=1 ttl=64 time=0.512 ms\n64 bytes from 192.168.56.101: icmp_seq=2 ttl=64 time=0.431 ms\n64 bytes from 192.168.56.101: icmp_seq=3 ttl=64 time=0.447 ms\n64 bytes from 192.168.56.101: icmp_seq=4 ttl=64 time=0.468 ms\n\n--- 192.168.56.101 ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss, time 3052ms\nrtt min/avg/max/mdev = 0.431/0.465/0.512/0.030 ms' },
          { re: '^ping\\s+.*192\\.168\\.56\\.77\\s*$', cls: 'bad', out: 'PING 192.168.56.77 (192.168.56.77) 56(84) bytes of data.\nFrom 192.168.56.10 icmp_seq=1 Destination Host Unreachable\nFrom 192.168.56.10 icmp_seq=2 Destination Host Unreachable\nFrom 192.168.56.10 icmp_seq=3 Destination Host Unreachable\nFrom 192.168.56.10 icmp_seq=4 Destination Host Unreachable\n\n--- 192.168.56.77 ping statistics ---\n4 packets transmitted, 0 received, +4 errors, 100% packet loss, time 3070ms' },
          { re: '^ping\\s+.*192\\.168\\.56\\.1\\s*$', cls: 'ok', out: 'PING 192.168.56.1 (192.168.56.1) 56(84) bytes of data.\n64 bytes from 192.168.56.1: icmp_seq=1 ttl=64 time=0.388 ms\n64 bytes from 192.168.56.1: icmp_seq=2 ttl=64 time=0.352 ms\n64 bytes from 192.168.56.1: icmp_seq=3 ttl=64 time=0.360 ms\n64 bytes from 192.168.56.1: icmp_seq=4 ttl=64 time=0.371 ms\n\n--- 192.168.56.1 ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss, time 3049ms\nrtt min/avg/max/mdev = 0.352/0.368/0.388/0.014 ms' },
          { re: '^ping\\s+(.*\\s)?(www\\.|shop\\.)?(tweetkod\\.example|203\\.0\\.113\\.25)\\s*$', cls: 'ok', out: 'PING tweetkod.example (203.0.113.25) 56(84) bytes of data.\n64 bytes from 203.0.113.25: icmp_seq=1 ttl=57 time=18.4 ms\n64 bytes from 203.0.113.25: icmp_seq=2 ttl=57 time=17.9 ms\n64 bytes from 203.0.113.25: icmp_seq=3 ttl=57 time=18.7 ms\n64 bytes from 203.0.113.25: icmp_seq=4 ttl=57 time=18.1 ms\n\n--- tweetkod.example ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss, time 3005ms\nrtt min/avg/max/mdev = 17.900/18.275/18.700/0.303 ms' },
          { re: '^ping', cls: 'bad', out: 'ping: الاسم أو العنوان غير معروف. استخدم أحد الأهداف المذكورة في المهام: 192.168.56.101 أو 192.168.56.77 أو tweetkod.example' },
          { re: '^nslookup\\s+(www\\.|shop\\.)?tweetkod\\.example\\s*$', out: 'Server:\t\t192.168.56.1\nAddress:\t192.168.56.1#53\n\nNon-authoritative answer:\nName:\ttweetkod.example\nAddress: 203.0.113.25' },
          { re: '^nslookup\\s+mail\\.tweetkod\\.example\\s*$', out: 'Server:\t\t192.168.56.1\nAddress:\t192.168.56.1#53\n\nNon-authoritative answer:\nName:\tmail.tweetkod.example\nAddress: 203.0.113.30' },
          { re: '^nslookup', cls: 'bad', out: `Server:\t\t192.168.56.1\nAddress:\t192.168.56.1#53\n\n** server can't find that name: NXDOMAIN` },
          { re: '^(traceroute|tracepath)\\s+.*(tweetkod\\.example|203\\.0\\.113\\.25)', out: 'traceroute to tweetkod.example (203.0.113.25), 30 hops max, 60 byte packets\n 1  _gateway (192.168.56.1)  0.412 ms  0.388 ms  0.371 ms\n 2  100.64.0.1 (100.64.0.1)  8.114 ms  7.902 ms  8.350 ms\n 3  198.51.100.1 (198.51.100.1)  12.457 ms  12.301 ms  12.620 ms\n 4  198.51.100.17 (198.51.100.17)  15.980 ms  16.114 ms  15.873 ms\n 5  203.0.113.25 (203.0.113.25)  18.204 ms  18.011 ms  18.395 ms' },
          { re: '^(traceroute|tracepath)', cls: 'bad', out: 'جرّب: traceroute tweetkod.example' },
          { re: '^tracert', cls: 'bad', out: 'هذه طرفية Linux؛ الأمر في Linux هو traceroute (أما tracert فهو اسمه في Windows).' },
          { re: '^netstat\\s+.*-\\w*a', out: 'Active Internet connections (servers and established)\nProto Recv-Q Send-Q Local Address           Foreign Address         State\ntcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN\ntcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN\ntcp        0      0 192.168.56.10:44012     192.168.56.101:22       ESTABLISHED\ntcp        0      0 192.168.56.10:51324     203.0.113.25:443        ESTABLISHED\ntcp        0      0 192.168.56.10:49822     203.0.113.66:4444       ESTABLISHED\ntcp        0      0 192.168.56.10:51330     203.0.113.25:443        TIME_WAIT\nudp        0      0 0.0.0.0:68              0.0.0.0:*' },
          { re: '^netstat', out: 'استخدم: netstat -an' }
        ]
      })),
    TK.s('🏁 تحديات الطرفية: اقرأ المخرجات كمحلل', 'Challenges — read the tool output',
      '<p class="lead">ارجع إلى طرفية المختبر ١ ونفّذ الأوامر لتجد الإجابات. كل جواب يظهر في المخرجات نفسها.</p>' +
      TK.challenge({ t: 'جواب DNS', q: 'ما عنوان IP الذي يعيده DNS للاسم <span class="code">mail.tweetkod.example</span>؟', answer: ['203.0.113.30'], hint: 'نفّذ nslookup mail.tweetkod.example وانظر إلى سطر Address الأخير (وليس الخاص بالخادم).', explain: 'خادم البريد له عنوان مختلف عن الموقع. السطر Address بعد Name هو الجواب، أما الأول فهو خادم DNS نفسه.', ph: 'x.x.x.x' }) +
      TK.challenge({ t: 'عدّ القفزات', q: 'كم سطراً (قفزة) تظهر في traceroute حتى يصل إلى <span class="code">tweetkod.example</span>؟ اكتب رقماً.', answer: ['5'], hint: 'عُدّ الأسطر المرقّمة، وآخرها هو عنوان الخادم نفسه.', explain: 'القفزة الأولى هي البوابة 192.168.56.1، ثم راوترات المزوّد، وآخر سطر هو الهدف. زمن الاستجابة يزداد كلما ابتعدنا.', ph: 'رقم' }) +
      TK.challenge({ t: 'اتصال مشبوه', q: 'في خرج <code>netstat -an</code> الاتصالات الطبيعية هي HTTPS (443) وSSH (22). أي <b>عنوان IP</b> بعيد متصل بمنفذ غير مألوف؟', answer: ['203.0.113.66'], hint: 'ابحث عن اتصال ESTABLISHED بمنفذ بعيد غير 22 و443.', explain: 'المنفذ 4444 هو المنفذ الافتراضي الذي تستخدمه أدوات الاختبار مثل Metasploit للاستماع، فالاتصال به من جهاز عادي يستدعي التحقق فوراً من العملية المسؤولة.', ph: 'x.x.x.x' })),
    TK.breakSlide('الجزء القادم: فحص المنافذ ومعنى كل خدمة، ثم أول مرة ترى فيها حزم الشبكة بعينيك في Wireshark.'),
    TK.s('🚪 فحص المنافذ: أي أبواب مفتوحة؟', 'Animated: a port scan',
      '<p class="lead">أداة مثل <span class="code">nmap</span> تطرق الأبواب واحداً واحداً. مرّر المؤشر فوق أي منفذ بعد الفحص لتقرأ ما هي خدمته. الهدف هو الخادم التدريبي 192.168.56.101.</p>' +
      TK.scan({
        cols: 4, btn: 'افحص الخادم التدريبي', labels: { open: 'مفتوح', closed: 'مغلق', filtered: 'مُرشَّح' },
        cells: [
          { t: '21 · FTP', s: 'closed', tip: 'FTP: نقل الملفات، كلمات المرور تسافر نصاً. هنا مغلق: جيد.' },
          { t: '22 · SSH', s: 'open', tip: 'SSH: إدارة الخادم عن بُعد بشكل مشفّر. مفتوح لأن المسؤول يحتاجه.' },
          { t: '23 · Telnet', s: 'open', tip: 'Telnet: إدارة عن بُعد بلا تشفير. مفتوح هنا وهذا خطر: يجب إغلاقه واستبداله بـ SSH.' },
          { t: '25 · SMTP', s: 'closed', tip: 'SMTP: إرسال البريد بين الخوادم.' },
          { t: '53 · DNS', s: 'closed', tip: 'DNS: ترجمة الأسماء إلى عناوين.' },
          { t: '80 · HTTP', s: 'open', tip: 'HTTP: مواقع الويب بلا تشفير.' },
          { t: '110 · POP3', s: 'closed', tip: 'POP3: تحميل البريد من الخادم.' },
          { t: '143 · IMAP', s: 'closed', tip: 'IMAP: قراءة البريد مع بقائه على الخادم.' },
          { t: '443 · HTTPS', s: 'open', tip: 'HTTPS: مواقع الويب المشفّرة.' },
          { t: '3306 · MySQL', s: 'open', tip: 'MySQL: قاعدة بيانات. يجب ألا تكون مفتوحة للجميع؛ مفتوحة هنا وهذا خطر.' },
          { t: '3389 · RDP', s: 'filtered', tip: 'RDP: سطح مكتب Windows عن بُعد. مُرشَّح: جدار حماية يمنع الرد.' },
          { t: '8080 · HTTP-alt', s: 'open', tip: 'منفذ بديل للويب، يستخدمه المطوّرون ولوحات الإدارة.' }
        ]
      }) +
      '<div class="note mt"><b>كيف نقرأ النتيجة؟</b> <b>مفتوح</b> = خدمة تنتظر وتردّ. <b>مغلق</b> = الجهاز يردّ بأن لا خدمة هنا. <b>مُرشَّح (Filtered)</b> = لا رد أبداً، غالباً جدار حماية يحجب، فلا نعرف الحقيقة. كل باب مفتوح هو سطح هجوم محتمل، لذلك القاعدة: افتح ما تحتاجه فقط.</div>' +
      TK.check({ s: 'منفذ بحالة "مغلق" (Closed) يعني أن جداراً نارياً يحجب كل رد من الجهاز.', t: false, why: 'مغلق يعني أن الجهاز ردّ بوضوح أنه لا خدمة هناك. الحالة التي يسببها غياب الرد بسبب جدار حماية تُسمّى "مُرشَّح" لا "مغلق".' })),
    TK.s('📋 جدول المنافذ التي تقابلها دائماً', 'Common ports reference',
      TK.table(['المنفذ', 'الخدمة', 'ماذا تفعل؟', 'ملاحظة أمنية'], [
        ['<code>21</code>', 'FTP', 'نقل الملفات', 'بلا تشفير؛ فضّل SFTP'],
        ['<code>22</code>', 'SSH', 'إدارة عن بُعد مشفّرة', 'أكثر منفذ يتعرّض لتخمين كلمات المرور'],
        ['<code>23</code>', 'Telnet', 'إدارة عن بُعد قديمة', 'نصٌّ واضح؛ يجب إغلاقه'],
        ['<code>25</code>', 'SMTP', 'إرسال البريد', 'يُستغل لإرسال رسائل مزعجة إن أُسيء ضبطه'],
        ['<code>53</code>', 'DNS', 'ترجمة الأسماء', 'هدف لتزوير الأجوبة'],
        ['<code>80</code>', 'HTTP', 'الويب العادي', 'المحتوى مكشوف لمن يتنصّت'],
        ['<code>110</code> / <code>143</code>', 'POP3 / IMAP', 'قراءة البريد', 'استخدم نسخهما المشفّرة'],
        ['<code>443</code>', 'HTTPS', 'الويب المشفّر', 'الأصل في المواقع الحديثة'],
        ['<code>3306</code>', 'MySQL', 'قاعدة بيانات', 'لا تعرضها للإنترنت أبداً'],
        ['<code>3389</code>', 'RDP', 'سطح مكتب Windows عن بُعد', 'هدف متكرر للهجمات إذا كان مكشوفاً'],
        ['<code>8080</code>', 'HTTP-alt', 'ويب بديل / لوحات إدارة', 'كثيراً ما يحمل خدمات تجريبية منسية']
      ])),
    TK.s('🃏 صنّف: أي خدمة لأي عائلة؟', 'Classify — port to service family',
      TK.classify({
        buckets: [{ t: 'الويب', e: '🌐' }, { t: 'البريد', e: '✉️' }, { t: 'تحكّم عن بُعد', e: '🖥️' }, { t: 'أسماء وملفات وبيانات', e: '🗂️' }],
        items: [
          { t: '80', b: 0, why: 'HTTP: الويب غير المشفّر.' }, { t: '443', b: 0, why: 'HTTPS: الويب المشفّر.' }, { t: '8080', b: 0, why: 'منفذ ويب بديل.' },
          { t: '25', b: 1, why: 'SMTP لإرسال البريد.' }, { t: '110', b: 1, why: 'POP3 لتحميل البريد.' }, { t: '143', b: 1, why: 'IMAP لقراءة البريد.' },
          { t: '22', b: 2, why: 'SSH: تحكّم عن بُعد مشفّر.' }, { t: '23', b: 2, why: 'Telnet: تحكّم عن بُعد غير مشفّر.' }, { t: '3389', b: 2, why: 'RDP: سطح مكتب Windows عن بُعد.' },
          { t: '53', b: 3, why: 'DNS: ترجمة الأسماء.' }, { t: '21', b: 3, why: 'FTP: نقل الملفات.' }, { t: '3306', b: 3, why: 'MySQL: قاعدة بيانات.' }
        ]
      })),
    TK.s('🏁 تحدّي المنافذ', 'Challenge — ports',
      '<p class="lead">استخدم نتيجة الفحص والجدول أعلاه.</p>' +
      TK.challenge({ t: 'قاعدة البيانات المكشوفة', q: 'ظهر المنفذ <span class="code">3306</span> مفتوحاً على الخادم. ما اسم الخدمة؟ (كلمة إنجليزية واحدة)', answer: ['mysql'], hint: 'راجع جدول المنافذ.', explain: 'قاعدة بيانات MySQL يجب أن تقبل الاتصال من خادم التطبيق فقط وليس من أي جهاز على الشبكة.', ph: 'service' }) +
      TK.challenge({ t: 'الباب الذي يجب إغلاقه', q: 'في نتيجة الفحص منفذان خطيران: 3306 ومنفذ آخر يعمل لإدارة الخادم عن بُعد <b>بلا تشفير</b>. ما رقمه؟', answer: ['23'], hint: 'إدارة عن بُعد بلا تشفير = Telnet.', explain: 'Telnet يرسل اسم المستخدم وكلمة المرور نصاً واضحاً. نستبدل به SSH على المنفذ 22.', ph: 'رقم المنفذ' })),
    TK.concept({
      t: 'HTTP مقابل HTTPS: من يستطيع القراءة؟', en: 'HTTP vs HTTPS', min: '4 د',
      body: '<p><b>HTTP</b> يرسل كل شيء كنص عادي، فأي جهاز يقع على الطريق (شبكة المقهى، الراوتر المخترَق) يقرأ الصفحة وكلمة المرور. أما <b>HTTPS</b> فهو HTTP داخل نفق مشفّر (TLS)، فيرى المتنصّت رموزاً لا معنى لها.</p>' +
        '<p class="mt">تخيّل النفق المشفّر كظرف مغلق بقفل خاص بينك وبين الخادم فقط: حتى لو اعترض أحد الظرف في المنتصف، لن يستطيع فتحه أو قراءة ما بداخله دون المفتاح الصحيح الذي يملكه الطرفان فقط.</p>' +
        '<div class="warn">القفل في المتصفح يعني أن الاتصال مشفّر، ولا يعني أن الموقع صادق. المواقع الاحتيالية قد تملك قفلاً أيضاً.</div>' +
        TK.check({ s: 'وجود القفل الأخضر في المتصفح (HTTPS) يعني أن الاتصال مشفّر، لكنه لا يضمن أن صاحب الموقع شخص أمين.', t: true, why: 'التشفير يحمي البيانات أثناء النقل فقط، ولا يفحص نية صاحب الموقع؛ مواقع احتيالية قد تملك قفلاً أيضاً.' }),
      key: 'HTTPS يخفي المحتوى، لكنه لا يضمن أن الموقع أمين.'
    }),
    TK.s('🔬 ماذا يرى المتنصّت؟', 'HTTP vs HTTPS side by side',
      '<p class="lead">بدّل بين الزرين لتقارن ما يظهر في Wireshark لنفس عملية الدخول.</p>' +
      TK.compare({
        a: { t: '🔓 HTTP (نص واضح)', bad: true, html:
          TK.code('POST /login.php HTTP/1.1\nHost: shop.tweetkod.example\nContent-Type: application/x-www-form-urlencoded\n\nusername=layla_k&password=Blue-Falcon-77') +
          '<p class="mt">كل شيء مقروء: اسم المستخدم وكلمة المرور. من يلتقط الحزم يستطيع استعمالها فوراً.</p>' },
        b: { t: '🔒 HTTPS (مشفّر)', html:
          TK.code('Transport Layer Security\n  TLSv1.3 Record Layer: Application Data\n  Encrypted Application Data:\n  a5 4d ca 18 25 30 bb 1d 6d 13 2c de d6 23 7b 2e\n  d9 1e 3f 72 1f cb 19 71 17 44 94 d6 49 3c 9d 5c') +
          '<p class="mt">المتنصّت يرى فقط أنك تتصل بـ 203.0.113.25 على المنفذ 443 وحجم الحزم، لكنه لا يقرأ المحتوى. (قد يرى أيضاً اسم الموقع عند بدء الاتصال.)</p>' }
      })),
    TK.s('🛠️ Wireshark: عدسة الشبكة', 'Tool — Wireshark',
      TK.tool({ e: '🦈', n: 'Wireshark', what: 'برنامج مجاني يلتقط الحزم التي تمرّ في بطاقة الشبكة ويعرضها سطراً بسطر بعد فكّها إلى طبقاتها (Ethernet, IP, TCP, HTTP...).',
        why: 'يستخدمه محللو الأمن لمعرفة ما يحدث فعلاً على الشبكة: اكتشاف اتصال مشبوه، فهم لماذا يفشل موقع، وإثبات أن بروتوكولاً ما يسرّب البيانات.',
        how: 'تختار بطاقة الشبكة، تضغط على الزعنفة الزرقاء لبدء الالتقاط، ثم تكتب «فلتر عرض» (Display Filter) لتصفية الآلاف من الحزم إلى ما يهمّك.', url: 'https://www.wireshark.org/' }) +
      TK.table(['فلتر العرض', 'يعرض'], [
        ['<code>dns</code>', 'أسئلة DNS وأجوبتها فقط'],
        ['<code>http</code>', 'طلبات HTTP وردودها (غير المشفّرة)'],
        ['<code>http.request.method == "POST"</code>', 'الطلبات التي ترسل بيانات (مثل نماذج الدخول)'],
        ['<code>ip.addr == 192.168.56.101</code>', 'كل ما يخصّ هذا العنوان'],
        ['<code>tcp.port == 443</code>', 'حركة HTTPS'],
        ['<code>tls</code>', 'اتصالات TLS المشفّرة']
      ]) +
      TK.check({ s: 'فلتر العرض في Wireshark مثل http يحذف الحزم غير المطابقة نهائياً من الالتقاط المحفوظ.', t: false, why: 'فلتر العرض يُخفي الحزم عن الشاشة فقط؛ الالتقاط الأصلي يبقى كاملاً ويمكن إزالة الفلتر لرؤية كل الحزم مرة أخرى.' })),
    TK.s('🧪 مختبر ٢: التقط حزم جهازك بنفسك', 'Lab 2 — capture with Wireshark',
      TK.lab({
        t: 'التقاط DNS وHTTP وتتبّع جلسة TCP', time: '15 د',
        req: 'حاسوب Windows أو macOS أو Linux، وصلاحية تثبيت برنامج، واتصال بالإنترنت. التقط فقط حركة جهازك أنت.',
        steps: [
          'نزّل Wireshark من الموقع الرسمي <code>wireshark.org</code> وثبّته. على Windows اترك خيار تثبيت <b>Npcap</b> مفعّلاً لأنه يلتقط الحزم.',
          'افتح Wireshark. في الشاشة الرئيسية اختر بطاقة الشبكة التي يتحرّك رسمها البياني (Wi-Fi أو Ethernet)، ثم اضغط الزعنفة الزرقاء لبدء الالتقاط.',
          'في المتصفح افتح <code>http://example.com</code> (إن حوّله المتصفح إلى https جرّب <code>http://neverssl.com</code>)، ثم ارجع إلى Wireshark وأوقف الالتقاط بالمربع الأحمر.',
          'اكتب في شريط الفلتر <code>dns</code> واضغط Enter. ابحث عن السؤال الذي يحوي اسم الموقع وعن الرد الذي يحمل عنوان IP، وسجّل العنوان.',
          'غيّر الفلتر إلى <code>http</code>. اختر الطلب <code>GET /</code> وافتح قسم Hypertext Transfer Protocol في الأسفل: ما قيمة Host وUser-Agent؟',
          'اضغط يميناً على حزمة HTTP ثم <b>Follow → TCP Stream</b> (أو Ctrl+Alt+Shift+T). سترى الطلب والرد كاملين بنص مقروء.',
          'ابدأ التقاطاً جديداً وافتح <code>https://example.com</code>، ثم طبّق الفلتر <code>tls</code>. حاول Follow TCP Stream مرة أخرى: ماذا ترى الآن؟ قارن مع الخطوة السابقة.',
          'اختياري في مختبرك المعزول: شغّل DVWA على جهاز افتراضي (Host-Only)، التقط حركة الشبكة الافتراضية، سجّل الدخول، ثم طبّق <code>http.request.method == "POST"</code> وابحث عن اسم المستخدم وكلمة المرور داخل الحزمة.'
        ],
        tools: [{ n: 'تحميل Wireshark', u: 'https://www.wireshark.org/download.html' }, { n: 'DVWA — تطبيق تدريبي', u: 'https://github.com/digininja/DVWA' }],
        tip: 'إن ظهرت آلاف الحزم لا تقلق: الفلتر هو أهم مهارة، فاكتب dns أو http أولاً.',
        warn: 'لا تلتقط حزم شبكة المدرسة أو المقهى أو أي شبكة لا تملكها دون إذن مكتوب. التنصّت على حركة الآخرين جريمة. التدريب فقط على جهازك أو على مختبرك المعزول.'
      })),
    TK.s('📦 التقاط جاهز: ماذا سرّب هذا الموقع؟', 'Packet capture excerpt',
      '<p class="lead">هذا مقطع من التقاط لمستخدم وهمي (layla_k) يدخل إلى موقع يعمل بـ HTTP. أولاً قائمة الحزم كما تظهر في Wireshark:</p>' +
      TK.code('No.  Time      Source          Destination     Proto  Info\n 12  2.104501  192.168.56.10   192.168.56.1    DNS    Standard query 0x4a2b A shop.tweetkod.example\n 13  2.106220  192.168.56.1    192.168.56.10   DNS    Standard query response 0x4a2b A 203.0.113.25\n 14  2.107013  192.168.56.10   203.0.113.25    TCP    51324 -> 80 [SYN] Seq=0 Win=64240 Len=0\n 15  2.125870  203.0.113.25    192.168.56.10   TCP    80 -> 51324 [SYN, ACK] Seq=0 Ack=1 Win=65160 Len=0\n 16  2.125931  192.168.56.10   203.0.113.25    TCP    51324 -> 80 [ACK] Seq=1 Ack=1 Win=64240 Len=0\n 17  2.126404  192.168.56.10   203.0.113.25    HTTP   POST /login.php HTTP/1.1 (application/x-www-form-urlencoded)\n 18  2.151772  203.0.113.25    192.168.56.10   HTTP   HTTP/1.1 200 OK (text/html)\n 19  2.200311  192.168.56.10   203.0.113.25    HTTP   GET /admin/ HTTP/1.1\n 20  2.224018  203.0.113.25    192.168.56.10   HTTP   HTTP/1.1 200 OK (text/html)') +
      '<p class="mt">وهذا ناتج <b>Follow TCP Stream</b> على الحزمة 17:</p>' +
      TK.code('POST /login.php HTTP/1.1\nHost: shop.tweetkod.example\nContent-Type: application/x-www-form-urlencoded\nContent-Length: 51\n\nusername=layla_k&password=Blue-Falcon-77&remember=1\n\nHTTP/1.1 200 OK\nServer: nginx\nContent-Type: text/html\nX-Debug-Token: FLAG{plain_text_tells_all}\nContent-Length: 30\n\n<h1>Welcome back, layla_k</h1>\n\nGET /admin/ HTTP/1.1\nHost: shop.tweetkod.example\nAuthorization: Basic YWRtaW46TGFiLVBhc3MtNDI=\n\nHTTP/1.1 200 OK\nContent-Type: text/html') +
      '<div class="note mt">الحزم 14 و15 و16 هي «المصافحة الثلاثية» (Three-way handshake) التي يبدأ بها كل اتصال TCP: SYN ثم SYN-ACK ثم ACK. معنى SYN باختصار «أريد بدء اتصال»، ومعنى ACK «استلمت، تم». هذه المصافحة تحدث قبل أي بيانات حقيقية، لذلك تراها في بداية كل اتصال TCP تقريباً.</div>'),
    TK.s('🏁 حلّل التقاط الحزم', 'Challenges — analyse the capture',
      '<p class="lead">محلل الأمن يقرأ مثل هذه الأسطر ليثبت أن موقعاً يسرّب بيانات. ارجع إلى الشريحة السابقة.</p>' +
      TK.challenge({ t: 'كلمة المرور المسرّبة', q: 'ما كلمة مرور المستخدم <span class="code">layla_k</span> كما ظهرت في طلب POST؟', answer: ['Blue-Falcon-77'], hint: 'ابحث عن الجزء الذي يبدأ بـ password= في جسم الطلب.', explain: 'لأن الموقع يستخدم HTTP، فكلمة المرور انتقلت نصاً واضحاً. الحل: HTTPS دائماً، وكلمة مرور فريدة لكل موقع.', ph: 'كلمة المرور' }) +
      TK.challenge({ t: 'العلم في رد الخادم', q: 'ما قيمة العلم (Flag) الموجود في ترويسة <span class="code">X-Debug-Token</span> في رد الخادم؟', answer: ['FLAG{plain_text_tells_all}'], hint: 'ابحث في سطور الرد HTTP/1.1 200 OK.', explain: 'ترويسات الرد أيضاً تُرسل نصاً: معلومات التصحيح التي ينساها المطوّرون تكشفها لأي متنصّت.', ph: 'FLAG{...}' }) +
      '<div class="card mt"><b>تحدّي فك الترميز:</b> الطلب الأخير يحوي <span class="code">Authorization: Basic ...</span>. هذا ليس تشفيراً بل ترميز Base64 للصيغة <span class="code">user:password</span>. Base64 طريقة لتحويل أي نص إلى حروف وأرقام متوافقة مع كل الأنظمة، وليست سرية: أي شخص يملك أداة تحويل (مثل التي أدناه) يعيد النص الأصلي في ثانية واحدة. الصق القيمة في أداة التحويل أدناه (اختر Base64 ثم فكّ الترميز) وابحث عن كلمة المرور.</div>' +
      TK.live('convert') +
      TK.challenge({ t: 'ترميز لا تشفير', q: 'ما كلمة المرور داخل قيمة <span class="code">YWRtaW46TGFiLVBhc3MtNDI=</span> بعد فكّ Base64؟ (الجزء بعد النقطتين)', answer: ['Lab-Pass-42'], hint: 'الناتج على الشكل admin:...، خذ ما بعد النقطتين.', explain: 'Base64 يُحوّل فقط شكل النص ولا يحميه. لذلك Basic Auth عبر HTTP يكشف كلمة المرور لأي متنصّت.', ph: 'كلمة المرور' })),
    TK.s('🧪 مختبر ٣ (للمنزل): جرّب الأوامر على جهازك الحقيقي', 'Lab 3 — on your own machine',
      TK.lab({
        t: 'أدوات الشبكة على جهازك', time: '10 د',
        req: 'جهازك الشخصي فقط. على Windows افتح CMD، وعلى Linux/macOS افتح الطرفية.',
        steps: [
          'اعرف عنوانك: 🪟 <code>ipconfig /all</code> على Windows (PowerShell أو CMD)، أو 🍎 <code>ip addr</code> على Linux (أو <code>ifconfig</code> على macOS). دوّن عنوان IP والبوابة (Default Gateway).',
          'افحص الراوتر الذي تملكه: 🪟 <code>ping -n 4 عنوان_البوابة</code> على Windows، أو 🍎 <code>ping -c 4 عنوان_البوابة</code> على Linux/macOS (نفس أمر ping، فقط العلم -n بدل -c). كم الزمن بالميلي ثانية؟',
          'اسأل DNS: <code>nslookup example.com</code> — نفس الأمر يعمل أصلاً على Windows وmacOS وLinux. ما خادم DNS الذي أجاب؟ وما العنوان الذي حصلت عليه؟ 🪟 على Windows جرّب أيضاً البديل الحديث <code>Resolve-DnsName example.com</code> في PowerShell.',
          'تتبّع الطريق: 🪟 <code>tracert example.com</code> على Windows، أو 🍎 <code>traceroute example.com</code> على Linux/macOS (نفس الفكرة، الاسم فقط مختلف). كم قفزة ظهرت؟ هل لاحظت أن بعضها يظهر بـ * (لا يردّ)؟',
          'اعرض اتصالاتك: <code>netstat -an</code> — نفس الأمر بنفس العلامات يعمل على Windows وmacOS وLinux. ابحث عن حالات LISTEN وESTABLISHED، وحدّد منفذاً واحداً تعرف خدمته. 🪟 على Windows جرّب أيضاً <code>Get-NetTCPConnection</code> في PowerShell لجدول أوضح.',
          'دوّن النتائج في ملف نصي وأضف ملاحظة: أي اتصال لم تفهمه؟'
        ],
        tip: 'أحياناً تحجب الشبكة ping لأسباب أمنية، فعدم الرد لا يعني أن الجهاز مطفأ.',
        warn: 'لا تستخدم ping أو أي فحص على أجهزة أو شبكات لا تملكها، ولا ترسل عدداً كبيراً من الحزم دون داعٍ.'
      })),
    TK.s('🎭 سيناريو: شبكة المقهى المفتوحة', 'Scenario — public Wi-Fi',
      TK.scenario({ steps: [
        { s: 'أنت في مقهى وتريد الدخول إلى حسابك على موقع المدرسة. الموقع يبدأ بـ <span class="code">http://</span> وبجانبه تنبيه «غير آمن». ماذا تفعل؟', o: [
          { t: 'أدخل بياناتي، فالجميع يفعل ذلك', ok: false, fb: 'في شبكة مفتوحة قد يلتقط أي شخص حزمك ويقرأ كلمة المرور بسهولة كما رأيت في Wireshark.' },
          { t: 'أنتظر حتى أعود إلى شبكة موثوقة أو أستخدم بيانات الجوال، وأخبر إدارة الموقع أنه لا يدعم HTTPS', ok: true, fb: 'قرار صحيح: لا ترسل كلمة مرور عبر اتصال غير مشفّر، وبلّغ الموقع ليصلح المشكلة.' },
          { t: 'أستخدم كلمة مرور بسيطة مؤقتة', ok: false, fb: 'المشكلة ليست قوة كلمة المرور بل أنها تُرسل مقروءة.' }] },
        { s: 'تصفحت موقعاً آمناً (https) لكن المتصفح يعرض فجأة صفحة حمراء: «شهادة غير صالحة». الخيار «متابعة على أي حال» ظاهر. ماذا تفعل؟', o: [
          { t: 'أضغط متابعة؛ أريد إنهاء الأمر بسرعة', ok: false, fb: 'قد يكون هناك من يعترض الاتصال ويقدّم شهادة مزيّفة.' },
          { t: 'أتوقف، وأجرّب من شبكة أخرى، ولا أدخل أي بيانات', ok: true, fb: 'تحذير الشهادة أحد الأسباب التي قد تدل على اعتراض الاتصال. التوقف هو التصرف الصحيح.' },
          { t: 'أعطّل المتصفح الحامي وأحاول ثانية', ok: false, fb: 'تعطيل الحماية يضعف أمانك أكثر.' }] }
      ] })),
    TK.s('📋 ورقة الغش: أوامر ومصطلحات اليوم', 'Cheat sheet',
      TK.table(['المهمة', 'Linux / macOS', 'Windows'], [
        ['عنواني', '<code>ip addr</code> / <code>ifconfig</code>', '<code>ipconfig</code>'],
        ['هل الجهاز حيّ؟', '<code>ping -c 4 هدف</code>', '<code>ping -n 4 هدف</code>'],
        ['ترجمة اسم', '<code>nslookup اسم</code>', '<code>nslookup اسم</code>'],
        ['الطريق', '<code>traceroute هدف</code>', '<code>tracert هدف</code>'],
        ['الاتصالات والمنافذ', '<code>netstat -an</code>', '<code>netstat -an</code>']
      ]) +
      '<div class="note mt">🪟 بدائل PowerShell حديثة على Windows: <code>Resolve-DnsName اسم</code> بديل لـ nslookup، و<code>Get-NetTCPConnection</code> بديل أوضح لـ netstat -an. وجميع أوامر الجدول أعلاه تعمل كما هي على Windows أيضاً (ping، nslookup، netstat).</div>' +
      TK.terms([
        ['Packet (حزمة)', 'قطعة صغيرة من البيانات عليها عنوان المرسل والمستقبل.'],
        ['Router (الراوتر)', 'جهاز يمرّر الحزم بين الشبكات.'],
        ['Hop (قفزة)', 'كل راوتر تمرّ عبره الحزمة في الطريق.'],
        ['TLS', 'البروتوكول الذي يشفّر الاتصال في HTTPS.'],
        ['Sniffing (التنصّت)', 'التقاط حزم الشبكة وقراءتها.']
      ]))
  ],
  quiz: [
    { q: 'ما الفرق الأساسي بين عنوان IP والمنفذ (Port)؟', ok: 'IP يحدد الجهاز على الشبكة، والمنفذ يحدد الخدمة داخل ذلك الجهاز', no: ['IP يحدد الخدمة، والمنفذ يحدد الجهاز', 'كلاهما يؤديان نفس الوظيفة بالضبط', 'المنفذ هو من يترجم اسم الموقع إلى IP'], why: 'IP كعنوان المبنى، والمنفذ كرقم الباب داخله، أما ترجمة الاسم إلى IP فهي وظيفة DNS.' },
    { q: 'ما الذي يفعله أمر <code>ping</code> تحديداً؟', ok: 'يرسل رسائل فحص قصيرة ليعرف هل الجهاز الهدف يستجيب، ويقيس زمن الرحلة', no: ['يعرض كل الاتصالات المفتوحة على جهازك حالياً', 'يترجم اسم الموقع إلى عنوان IP', 'يلتقط حزم الشبكة ويحلل محتواها'], why: 'ping يرسل رسائل ICMP وينتظر رداً، وهذه مهمة مختلفة عن netstat أو nslookup أو Wireshark.' },
    { q: 'في مخرجات <code>traceroute</code>، ماذا يمثّل كل سطر مرقّم قبل السطر الأخير؟', ok: 'راوتراً (قفزة) مرّت به الحزمة في طريقها إلى الهدف', no: ['خطأ في الاتصال يجب تجاهله', 'نسخة مكررة من نفس الحزمة الأولى', 'جهاز المستخدم نفسه مكرراً'], why: 'traceroute يسرد كل Hop بالترتيب حتى الوصول إلى الوجهة، وآخر سطر هو الهدف نفسه.' },
    { q: 'ما المنفذ الافتراضي لحركة HTTPS المشفّرة؟', ok: '443', no: ['80', '22', '23'], why: '80 لـ HTTP غير المشفّر، 22 لـ SSH، 23 لـ Telnet، أما 443 فهو الافتراضي لـ HTTPS.' },
    { q: 'منفذ ظهر في نتيجة الفحص بحالة «مُرشَّح» (Filtered). ما معنى ذلك؟', ok: 'لم يصل أي رد من المنفذ، غالباً بسبب جدار حماية يمنع الاستجابة', no: ['المنفذ مفتوح ويعمل بشكل طبيعي', 'المنفذ مغلق تماماً وهذا مؤكد بالكامل', 'المنفذ يستخدم بروتوكولاً مشفّراً فقط'], why: 'غياب أي رد هو سبب تصنيف المنفذ Filtered، بخلاف Open أو Closed اللذين يحصلان على رد واضح.' },
    { q: 'لماذا يُعدّ منفذ Telnet (23) المفتوح خطراً أمنياً؟', ok: 'لأنه يرسل اسم المستخدم وكلمة المرور نصاً واضحاً بلا تشفير', no: ['لأنه لا يسمح بأي اتصال عن بُعد أصلاً', 'لأنه مخصص فقط لنقل الملفات الكبيرة', 'لأنه يستهلك سرعة الشبكة بشكل كبير'], why: 'Telnet يرسل البيانات الحساسة نصاً واضحاً، لذلك يُستبدل بـ SSH الذي يشفّر الاتصال على المنفذ 22.' },
    { q: 'في <code>netstat -an</code> ظهر اتصال ESTABLISHED إلى عنوان غريب على منفذ 4444 بينما الجهاز يعمل بشكل طبيعي ظاهرياً. ما أفضل تصرف؟', ok: 'التحقق من العملية المسؤولة عن الاتصال وإبلاغ المسؤول فوراً', no: ['تجاهله لأن الجهاز يعمل بشكل طبيعي ظاهرياً', 'إعادة تشغيل الجهاز فقط دون أي فحص آخر', 'إيقاف تشغيل netstat لإخفاء التنبيه'], why: 'منفذ 4444 معروف باستخدامه كمنفذ استماع في أدوات اختبار مثل Metasploit، فاتصال كهذا يستدعي تحققاً فورياً من العملية المسؤولة.' },
    { q: 'كتابة <code>dns</code> في شريط فلتر العرض (Display Filter) في Wireshark، ماذا تفعل؟', ok: 'تعرض فقط حزم أسئلة DNS وأجوبتها من بين كل الحزم الملتقطة', no: ['تحذف كل الحزم غير الخاصة بـ DNS من الالتقاط نهائياً', 'تلتقط حزم DNS جديدة من الشبكة فوراً', 'تعرض فقط حزم HTTPS المشفّرة'], why: 'فلتر العرض لا يحذف أي شيء من الالتقاط الأصلي، بل يخفي عن العرض الحزم غير المطابقة فقط؛ يمكن إزالته لرؤية الكل مرة أخرى.' },
    { q: 'في التقاط حزم لموقع يعمل بـ HTTP (بدون تشفير)، ظهرت كلمة مرور المستخدم مقروءة بوضوح داخل طلب POST. ما السبب؟', ok: 'لأن HTTP يرسل محتوى الطلب كنص واضح بلا تشفير', no: ['لأن المستخدم اختار كلمة مرور قصيرة جداً', 'لأن Wireshark يفكّ أي تشفير تلقائياً بمجرد الالتقاط', 'لأن الخادم كان يستخدم بروتوكول FTP بدل HTTP'], why: 'HTTP بلا تشفير يجعل كل محتوى الطلب، بما فيه كلمات المرور، مقروءاً لأي من يلتقط الحزم؛ المشكلة في البروتوكول لا في قوة كلمة المرور.' },
    { q: 'أنت في مقهى يقدّم شبكة Wi-Fi مفتوحة لأي زائر. هل يجوز لك تشغيل Wireshark والتقاط حزم بقية المستخدمين على هذه الشبكة؟', ok: 'لا، لأن التنصّت على حركة شبكة لا تملكها دون إذن صريح من مالكها مخالف قانونياً وأخلاقياً', no: ['نعم، لأن الشبكة مفتوحة لأي شخص فهي ملك عام', 'نعم بشرط أن تحذف الحزم بعد عرضها مباشرة', 'نعم إذا كان الهدف هو التدريب والتعلم فقط'], why: 'كون الشبكة مفتوحة لا يعني الإذن بالتنصّت على حركة الآخرين؛ الالتقاط المشروع يكون فقط على جهازك أو شبكتك الخاصة أو مختبر معزول.' }
  ],
  audit: [
    'نفّذت ip addr وping وnslookup وtraceroute وnetstat في الطرفية التدريبية',
    'عرفت خادم DNS ومن أجاب عن اسم النطاق',
    'عدّدت قفزات traceroute وفهمت ما تعنيه',
    'حددت اتصالاً مشبوهاً في netstat من منفذه غير المألوف',
    'قرأت نتيجة فحص المنافذ وصنّفت الخدمات الخطيرة',
    'ثبّت Wireshark والتقطت حزم DNS وHTTP على جهازي',
    'استخدمت Follow TCP Stream وقارنت HTTP بـ HTTPS',
    'استخرجت كلمة المرور من التقاط HTTP وفككت قيمة Basic Auth'
  ],
  recap: [
    'IP يحدد الجهاز، والمنفذ يحدد الخدمة، وDNS يترجم الأسماء إلى أرقام',
    'ping وnslookup وtraceroute وnetstat أدوات تشخيص أولى لكل محلل',
    'كل منفذ مفتوح سطح هجوم محتمل: افتح ما تحتاجه فقط',
    'HTTP يكشف المحتوى لمن يلتقط الحزم، وHTTPS يخفيه لكنه لا يضمن صدق الموقع',
    'لا تلتقط حزم شبكة لا تملكها دون إذن'
  ],
  homework: 'أنجز مختبر ٣ على جهازك، ثم التقط في Wireshark زيارة لموقعين (واحد http وواحد https) وأرسل للمدرّب لقطتي شاشة للفرق بين Follow TCP Stream في الحالتين مع جملتين تشرحان ما لاحظته.',
  resources: [
    { t: 'Wireshark — الموقع الرسمي', u: 'https://www.wireshark.org/' },
    { t: 'Wireshark — التحميل', u: 'https://www.wireshark.org/download.html' },
    { t: 'Nmap — فحص المنافذ', u: 'https://nmap.org/' },
    { t: 'TryHackMe — غرف تعليمية للمبتدئين', u: 'https://tryhackme.com/' },
    { t: 'picoCTF — تحديات مجانية', u: 'https://picoctf.org/' }
  ],
  next: 'في الوحدات القادمة ستبني على ما تعلّمته هنا: كل أداة أمنية تقريباً تقرأ عناوين IP والمنافذ والبروتوكولات التي رأيتها اليوم.'
});
