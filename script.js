/**
 * ZakatBridge — client-side logic (vanilla JavaScript, no dependencies).
 *
 * Sections of this file:
 *   1. Configuration & fictional demo data
 *   2. Translations (English / Arabic)
 *   3. Helpers
 *   4. Internationalisation (language + RTL)
 *   5. Case directory
 *   6. Simulated donation form
 *   7. Transparency dashboard
 *   8. Zakat calculator
 *   9. Navigation
 *  10. Initialisation
 *
 * SECURITY NOTE: user input is never inserted with innerHTML. All dynamic
 * content is built with createElement/textContent to prevent XSS. Nothing is
 * sent over the network — the page's Content Security Policy blocks it anyway.
 */
(function () {
  "use strict";

  /* ======================================================================
     1. CONFIGURATION & FICTIONAL DEMO DATA
     ====================================================================== */

  /** Fixed, illustrative exchange rate used only to total demo figures. */
  const USD_TO_CAD = 1.35;

  /** Upper limit for a simulated donation (keeps the demo sensible). */
  const MAX_AMOUNT = 100000;

  /** Nisab thresholds in grams (common scholarly values). */
  const NISAB_GRAMS = { gold: 85, silver: 595 };

  /** Zakat rate: 2.5% */
  const ZAKAT_RATE = 0.025;

  /**
   * FICTIONAL DEMONSTRATION CASES.
   * These do NOT describe real people or real needs. Beneficiaries are
   * identified only by anonymous codes — a practice any real version should
   * keep to protect dignity and privacy. Amounts are in CAD.
   */
  const DEMO_CASES = [
    {
      id: "DEMO-001", category: "zakat", goal: 3000, pledged: 1200,
      title: { en: "Medical treatment support", ar: "دعم تكاليف العلاج الطبي" },
      region: { en: "Example region: Upper Egypt", ar: "منطقة افتراضية: صعيد مصر" },
      text: {
        en: "A fictional household needing help covering the cost of ongoing medical treatment.",
        ar: "أسرة افتراضية تحتاج إلى مساعدة في تغطية تكاليف علاج طبي مستمر."
      }
    },
    {
      id: "DEMO-002", category: "zakat", goal: 900, pledged: 650,
      title: { en: "Monthly food baskets", ar: "سلال غذائية شهرية" },
      region: { en: "Example region: Greater Cairo", ar: "منطقة افتراضية: القاهرة الكبرى" },
      text: {
        en: "A fictional family of five that would receive basic food supplies for six months.",
        ar: "أسرة افتراضية من خمسة أفراد تحصل على مواد غذائية أساسية لمدة ستة أشهر."
      }
    },
    {
      id: "DEMO-003", category: "zakat", goal: 2500, pledged: 400,
      title: { en: "Relief from urgent debt (Al-Gharimin)", ar: "سداد ديون عاجلة (الغارمين)" },
      region: { en: "Example region: Nile Delta", ar: "منطقة افتراضية: دلتا النيل" },
      text: {
        en: "A fictional case of a breadwinner unable to repay debts taken on for basic needs.",
        ar: "حالة افتراضية لعائل أسرة عاجز عن سداد ديون اقترضها لتلبية الاحتياجات الأساسية."
      }
    },
    {
      id: "DEMO-004", category: "sadaqah", goal: 1500, pledged: 900,
      title: { en: "School supplies for children", ar: "أدوات مدرسية للأطفال" },
      region: { en: "Example region: Alexandria", ar: "منطقة افتراضية: الإسكندرية" },
      text: {
        en: "A fictional community project providing books, bags, and uniforms for a school year.",
        ar: "مشروع مجتمعي افتراضي لتوفير الكتب والحقائب والزي المدرسي لعام دراسي."
      }
    },
    {
      id: "DEMO-005", category: "sadaqah", goal: 4000, pledged: 1800,
      title: { en: "Clean water filters (Sadaqah Jariyah)", ar: "فلاتر مياه نظيفة (صدقة جارية)" },
      region: { en: "Example region: Upper Egypt", ar: "منطقة افتراضية: صعيد مصر" },
      text: {
        en: "A fictional village project installing household water filters with long-term benefit.",
        ar: "مشروع افتراضي لتركيب فلاتر مياه منزلية في قرية بنفع طويل الأمد."
      }
    },
    {
      id: "DEMO-006", category: "sadaqah", goal: 2000, pledged: 300,
      title: { en: "Safe roof repair", ar: "إصلاح سقف منزل" },
      region: { en: "Example region: Fayoum", ar: "منطقة افتراضية: الفيوم" },
      text: {
        en: "A fictional home whose damaged roof would be repaired before the winter season.",
        ar: "منزل افتراضي يحتاج إلى إصلاح سقفه المتضرر قبل فصل الشتاء."
      }
    }
  ];

  /* ======================================================================
     2. TRANSLATIONS
     Keys match the data-i18n attributes in index.html. To add a language,
     add a new object with the same keys and extend SUPPORTED_LANGS.
     ====================================================================== */

  const I18N = {
    en: {
      "meta.title": "ZakatBridge — Open Source Humanitarian Platform",
      "skip": "Skip to main content",
      "banner.title": "Prototype notice:",
      "banner.text": "ZakatBridge is an early-stage open-source prototype, not an operating charity. All cases and figures are fictional demonstration data. No real donations are collected.",
      "nav.menu": "Menu",
      "nav.categories": "Zakat & Sadaqah",
      "nav.cases": "Cases",
      "nav.donate": "Donate (Demo)",
      "nav.dashboard": "Transparency",
      "nav.calculator": "Calculator",
      "nav.about": "About",
      "nav.contribute": "Contribute",
      "hero.eyebrow": "Open Source · Nonprofit-Oriented · Transparent",
      "hero.title": "Building a bridge of trust between Egyptians abroad and families in need at home",
      "hero.lead": "ZakatBridge is a community-built prototype exploring how Egyptian communities in Canada and the United States could direct Zakat and Sadaqah to underprivileged families in Egypt — with transparency, accountability, and dignity at its core.",
      "hero.cta1": "Explore Example Cases",
      "hero.cta2": "Help Build ZakatBridge",
      "hero.v1": "Transparency",
      "hero.v2": "Accountability",
      "hero.v3": "Accessibility",
      "hero.v4": "Dignity",
      "label.zakat": "Zakat",
      "label.sadaqah": "Sadaqah",
      "label.demo": "Fictional",
      "cat.title": "Two Ways to Give",
      "cat.intro": "Zakat and Sadaqah are kept strictly separate so that every contribution reaches a purpose that matches its intention.",
      "cat.zakat.title": "Zakat — An Obligation",
      "cat.zakat.text": "An obligatory annual contribution (usually 2.5% of qualifying wealth held for one lunar year above the nisab). Zakat may only go to eligible recipients described in the Qur'an (9:60), such as the poor and the needy.",
      "cat.zakat.p1": "Separate tracking from all other funds",
      "cat.zakat.p2": "Only for verified eligible recipients",
      "cat.zakat.p3": "Built-in calculator to estimate what is due",
      "cat.zakat.btn": "View Zakat Cases",
      "cat.sadaqah.title": "Sadaqah — Voluntary Charity",
      "cat.sadaqah.text": "Voluntary giving of any amount, at any time, for a broad range of good causes — including education, clean water, and community projects that may not qualify for Zakat.",
      "cat.sadaqah.p1": "Any amount, any time",
      "cat.sadaqah.p2": "Wider range of community projects",
      "cat.sadaqah.p3": "Ongoing charity (Sadaqah Jariyah) projects",
      "cat.sadaqah.btn": "View Sadaqah Cases",
      "cases.title": "Example Humanitarian Cases",
      "cases.demo": "Fictional demonstration data — these cases do not describe real people.",
      "cases.intro": "In a future version, each case would be verified by a trusted partner on the ground. Beneficiaries would be identified only by anonymous codes to protect their privacy and dignity.",
      "cases.filterLabel": "Filter cases",
      "cases.all": "All",
      "cases.goal": "Demo goal",
      "cases.pledged": "pledged (demo)",
      "cases.support": "Simulate support",
      "cases.empty": "No cases match this filter.",
      "donate.title": "Simulated Donation",
      "donate.demo": "Simulation only — no money is collected, no payment details are requested, and nothing leaves your browser.",
      "donate.type": "Type of giving",
      "donate.case": "Example case",
      "donate.amount": "Amount",
      "donate.amountHint": "Between 1 and 100,000.",
      "donate.currency": "Currency",
      "donate.ack": "I understand this is a demonstration and no real donation will be made.",
      "donate.submit": "Simulate Donation",
      "donate.errAmount": "Please enter a whole amount between 1 and 100,000.",
      "donate.errAck": "Please confirm that you understand this is a demonstration.",
      "donate.okTitle": "Simulation complete — thank you!",
      "donate.okText": "You simulated a {category} of {amount} for case {caseId}. No money was transferred and no data was stored or sent anywhere.",
      "donate.okRef": "Demo reference:",
      "donate.okNote": "In a real system you would receive a receipt and could follow this contribution on the transparency dashboard.",
      "dash.title": "Transparency Dashboard",
      "dash.demo": "Demonstration statistics — calculated only from the fictional cases above plus simulated donations made in this browser tab. These are not real impact figures.",
      "dash.cases": "Example cases",
      "dash.goal": "Total demo goal (CAD)",
      "dash.raised": "Demo amount pledged (CAD)",
      "dash.sim": "Your simulated donations (this tab)",
      "dash.byCategory": "Pledged by category (demo)",
      "dash.ofGoal": "of goal",
      "dash.principles": "How transparency would work",
      "dash.p1": "Zakat and Sadaqah tracked in separate ledgers",
      "dash.p2": "Each case shows its goal, progress, and verifying partner",
      "dash.p3": "Public reports of funds received and delivered",
      "dash.p4": "Administrative costs disclosed openly",
      "dash.p5": "Open-source code that anyone can audit",
      "dash.rate": "Demo conversion for display: 1 USD ≈ 1.35 CAD (fixed illustrative rate, not live).",
      "calc.title": "Simple Zakat Calculator",
      "calc.intro": "Estimate your Zakat at 2.5% of net qualifying wealth held for one lunar year. Enter today's gold or silver price yourself — this tool does not fetch live prices.",
      "calc.currency": "Currency",
      "calc.basis": "Nisab basis",
      "calc.silver": "Silver (595 g)",
      "calc.gold": "Gold (85 g)",
      "calc.price": "Price per gram of the chosen metal",
      "calc.assets": "Assets",
      "calc.cash": "Cash & bank balances",
      "calc.goldsilver": "Value of gold & silver owned",
      "calc.investments": "Investments & shares",
      "calc.business": "Business inventory & money owed to you",
      "calc.liabilities": "Liabilities",
      "calc.debts": "Debts and bills due now",
      "calc.submit": "Calculate",
      "calc.errPrice": "Please enter a price per gram greater than zero.",
      "calc.errNeg": "Values cannot be negative.",
      "calc.net": "Net qualifying wealth:",
      "calc.nisab": "Nisab threshold:",
      "calc.due": "Estimated Zakat due",
      "calc.notDue": "Your net wealth is below the nisab, so Zakat is not due on these figures.",
      "calc.disclaimer": "This is a simplified educational estimate. Rules vary between scholars and personal circumstances — please consult a qualified scholar for your own situation.",
      "about.title": "About Us & Our Mission",
      "about.p1": "ZakatBridge began as an idea: many Egyptians living in Canada and the United States want to support families back home, but finding trustworthy, transparent channels is difficult.",
      "about.p2": "This project is an open-source prototype exploring what such a channel could look like. It is not a registered charity, does not hold funds, and has no partner organizations at this stage.",
      "about.p3": "Any future operational version would need to work through properly registered nonprofits in Canada, the United States, and Egypt, and comply with all applicable laws.",
      "about.v1t": "Transparency",
      "about.v1": "Open code, open processes, and clear reporting.",
      "about.v2t": "Accountability",
      "about.v2": "Every contribution traceable from giver to recipient.",
      "about.v3t": "Accessibility",
      "about.v3": "Bilingual, mobile-friendly, and usable by everyone.",
      "about.v4t": "Dignity",
      "about.v4": "Beneficiaries are never exposed, shamed, or exploited.",
      "contrib.title": "Volunteers & Open-Source Contributors Wanted",
      "contrib.intro": "ZakatBridge is at the very beginning. We are looking for people who want to help shape it — no contribution is too small.",
      "contrib.devT": "Developers & Designers",
      "contrib.dev": "Improve the code, accessibility, design, and testing. Good first issues are a great place to start.",
      "contrib.transT": "Translators & Writers",
      "contrib.trans": "Help improve Arabic and English content, documentation, and plain-language explanations.",
      "contrib.advT": "Advisors",
      "contrib.adv": "Islamic finance scholars, nonprofit, legal, and compliance experts who can guide responsible growth.",
      "contrib.how": "Read CONTRIBUTING.md in the project repository, open an issue, or submit a pull request.",
      "footer.tag": "Open Source Humanitarian Platform (prototype)",
      "footer.disclaimer": "Not a registered charity. No real donations are accepted. All data shown is fictional and for demonstration only.",
      "footer.license": "Released under the MIT License.",
      "lang.switch": "العربية",
      "lang.switchLabel": "التبديل إلى العربية"
    },

    ar: {
      "meta.title": "زكاة بريدج — منصة إنسانية مفتوحة المصدر",
      "skip": "انتقل إلى المحتوى الرئيسي",
      "banner.title": "تنبيه: نموذج أولي",
      "banner.text": "زكاة بريدج نموذج أولي مفتوح المصدر في مرحلة مبكرة، وليس جمعية خيرية عاملة. جميع الحالات والأرقام بيانات توضيحية خيالية. لا يتم جمع أي تبرعات حقيقية.",
      "nav.menu": "القائمة",
      "nav.categories": "الزكاة والصدقة",
      "nav.cases": "الحالات",
      "nav.donate": "تبرع (تجريبي)",
      "nav.dashboard": "الشفافية",
      "nav.calculator": "الحاسبة",
      "nav.about": "من نحن",
      "nav.contribute": "شارك معنا",
      "hero.eyebrow": "مفتوح المصدر · غير ربحي التوجه · شفاف",
      "hero.title": "نبني جسراً من الثقة بين المصريين في الخارج والأسر المحتاجة في الوطن",
      "hero.lead": "زكاة بريدج نموذج أولي يبنيه المجتمع، يستكشف كيف يمكن للجاليات المصرية في كندا والولايات المتحدة توجيه الزكاة والصدقات إلى الأسر الأكثر احتياجاً في مصر، مع وضع الشفافية والمساءلة والكرامة في صميمه.",
      "hero.cta1": "استعرض الحالات التوضيحية",
      "hero.cta2": "ساهم في بناء زكاة بريدج",
      "hero.v1": "الشفافية",
      "hero.v2": "المساءلة",
      "hero.v3": "سهولة الوصول",
      "hero.v4": "الكرامة",
      "label.zakat": "زكاة",
      "label.sadaqah": "صدقة",
      "label.demo": "خيالية",
      "cat.title": "طريقتان للعطاء",
      "cat.intro": "نفصل الزكاة عن الصدقة فصلاً تاماً حتى يصل كل عطاء إلى المصرف الذي يوافق نيته.",
      "cat.zakat.title": "الزكاة — فريضة",
      "cat.zakat.text": "فريضة سنوية (غالباً 2.5٪ من المال الذي بلغ النصاب وحال عليه الحول الهجري). ولا تُصرف الزكاة إلا لمستحقيها المذكورين في القرآن الكريم (التوبة: 60)، كالفقراء والمساكين.",
      "cat.zakat.p1": "متابعة منفصلة عن جميع الأموال الأخرى",
      "cat.zakat.p2": "تُصرف فقط للمستحقين بعد التحقق",
      "cat.zakat.p3": "حاسبة مدمجة لتقدير الزكاة المستحقة",
      "cat.zakat.btn": "عرض حالات الزكاة",
      "cat.sadaqah.title": "الصدقة — عطاء تطوعي",
      "cat.sadaqah.text": "عطاء تطوعي بأي مبلغ وفي أي وقت لمجموعة واسعة من أعمال الخير، مثل التعليم والمياه النظيفة والمشروعات المجتمعية التي قد لا تدخل في مصارف الزكاة.",
      "cat.sadaqah.p1": "بأي مبلغ وفي أي وقت",
      "cat.sadaqah.p2": "مجموعة أوسع من المشروعات المجتمعية",
      "cat.sadaqah.p3": "مشروعات الصدقة الجارية",
      "cat.sadaqah.btn": "عرض حالات الصدقة",
      "cases.title": "حالات إنسانية توضيحية",
      "cases.demo": "بيانات توضيحية خيالية — هذه الحالات لا تصف أشخاصاً حقيقيين.",
      "cases.intro": "في إصدار مستقبلي، سيتحقق شريك موثوق على أرض الواقع من كل حالة. ولن يُعرَّف المستفيدون إلا برموز مجهولة حفاظاً على خصوصيتهم وكرامتهم.",
      "cases.filterLabel": "تصفية الحالات",
      "cases.all": "الكل",
      "cases.goal": "الهدف التوضيحي",
      "cases.pledged": "تم التعهد به (تجريبي)",
      "cases.support": "محاكاة الدعم",
      "cases.empty": "لا توجد حالات مطابقة لهذا التصنيف.",
      "donate.title": "محاكاة التبرع",
      "donate.demo": "محاكاة فقط — لا يتم جمع أي أموال، ولا نطلب أي بيانات دفع، ولا تغادر أي بيانات متصفحك.",
      "donate.type": "نوع العطاء",
      "donate.case": "الحالة التوضيحية",
      "donate.amount": "المبلغ",
      "donate.amountHint": "من 1 إلى 100,000.",
      "donate.currency": "العملة",
      "donate.ack": "أدرك أن هذا عرض توضيحي ولن يتم أي تبرع حقيقي.",
      "donate.submit": "محاكاة التبرع",
      "donate.errAmount": "يرجى إدخال مبلغ صحيح بين 1 و100,000.",
      "donate.errAck": "يرجى التأكيد على أنك تدرك أن هذا عرض توضيحي.",
      "donate.okTitle": "اكتملت المحاكاة — جزاك الله خيراً!",
      "donate.okText": "قمت بمحاكاة {category} بمبلغ {amount} للحالة {caseId}. لم يتم تحويل أي أموال ولم تُخزَّن أو تُرسَل أي بيانات.",
      "donate.okRef": "الرقم المرجعي التجريبي:",
      "donate.okNote": "في نظام حقيقي، ستحصل على إيصال ويمكنك متابعة هذا العطاء عبر لوحة الشفافية.",
      "dash.title": "لوحة الشفافية",
      "dash.demo": "إحصاءات توضيحية — محسوبة فقط من الحالات الخيالية أعلاه ومن التبرعات التجريبية في علامة التبويب هذه. هذه ليست أرقام أثر حقيقية.",
      "dash.cases": "الحالات التوضيحية",
      "dash.goal": "إجمالي الأهداف التوضيحية (دولار كندي)",
      "dash.raised": "المبالغ التجريبية المتعهد بها (دولار كندي)",
      "dash.sim": "تبرعاتك التجريبية (في هذه الصفحة)",
      "dash.byCategory": "المتعهد به حسب النوع (تجريبي)",
      "dash.ofGoal": "من الهدف",
      "dash.principles": "كيف ستعمل الشفافية",
      "dash.p1": "سجلات منفصلة للزكاة والصدقة",
      "dash.p2": "كل حالة تعرض هدفها وتقدمها والشريك الذي تحقق منها",
      "dash.p3": "تقارير علنية بالأموال المستلمة والمُسلَّمة",
      "dash.p4": "إفصاح واضح عن التكاليف الإدارية",
      "dash.p5": "شيفرة مفتوحة المصدر يمكن لأي شخص مراجعتها",
      "dash.rate": "سعر تحويل توضيحي للعرض فقط: 1 دولار أمريكي ≈ 1.35 دولار كندي (سعر ثابت وليس مباشراً).",
      "calc.title": "حاسبة زكاة مبسطة",
      "calc.intro": "قدّر زكاتك بنسبة 2.5٪ من صافي المال الخاضع للزكاة الذي حال عليه الحول الهجري. أدخل سعر الذهب أو الفضة اليوم بنفسك — هذه الأداة لا تجلب الأسعار مباشرة.",
      "calc.currency": "العملة",
      "calc.basis": "أساس النصاب",
      "calc.silver": "الفضة (595 جرام)",
      "calc.gold": "الذهب (85 جرام)",
      "calc.price": "سعر الجرام من المعدن المختار",
      "calc.assets": "الأصول",
      "calc.cash": "النقد والأرصدة البنكية",
      "calc.goldsilver": "قيمة الذهب والفضة المملوكة",
      "calc.investments": "الاستثمارات والأسهم",
      "calc.business": "عروض التجارة والديون المستحقة لك",
      "calc.liabilities": "الالتزامات",
      "calc.debts": "الديون والفواتير المستحقة حالياً",
      "calc.submit": "احسب",
      "calc.errPrice": "يرجى إدخال سعر للجرام أكبر من صفر.",
      "calc.errNeg": "لا يمكن أن تكون القيم سالبة.",
      "calc.net": "صافي المال الخاضع للزكاة:",
      "calc.nisab": "حد النصاب:",
      "calc.due": "الزكاة المستحقة التقديرية",
      "calc.notDue": "صافي مالك أقل من النصاب، لذا لا تجب الزكاة وفق هذه الأرقام.",
      "calc.disclaimer": "هذا تقدير تعليمي مبسط. تختلف الأحكام باختلاف آراء العلماء والظروف الشخصية — يرجى استشارة عالم مؤهل في حالتك.",
      "about.title": "من نحن ورسالتنا",
      "about.p1": "بدأت زكاة بريدج كفكرة: كثير من المصريين المقيمين في كندا والولايات المتحدة يرغبون في دعم الأسر في الوطن، لكن إيجاد قنوات موثوقة وشفافة أمر صعب.",
      "about.p2": "هذا المشروع نموذج أولي مفتوح المصدر يستكشف كيف يمكن أن تبدو مثل هذه القناة. وهو ليس جمعية خيرية مسجلة، ولا يحتفظ بأي أموال، وليس لديه أي منظمات شريكة في هذه المرحلة.",
      "about.p3": "أي إصدار تشغيلي مستقبلي سيتطلب العمل من خلال منظمات غير ربحية مسجلة رسمياً في كندا والولايات المتحدة ومصر، والالتزام بجميع القوانين المعمول بها.",
      "about.v1t": "الشفافية",
      "about.v1": "شيفرة مفتوحة، وإجراءات واضحة، وتقارير صريحة.",
      "about.v2t": "المساءلة",
      "about.v2": "إمكانية تتبع كل عطاء من المتبرع إلى المستفيد.",
      "about.v3t": "سهولة الوصول",
      "about.v3": "ثنائي اللغة، ومناسب للهواتف، ومتاح للجميع.",
      "about.v4t": "الكرامة",
      "about.v4": "لا يتم أبداً كشف المستفيدين أو إحراجهم أو استغلالهم.",
      "contrib.title": "نرحب بالمتطوعين والمساهمين في المصادر المفتوحة",
      "contrib.intro": "زكاة بريدج في بدايتها تماماً. نبحث عن أشخاص يرغبون في المساعدة في تشكيلها — ولا توجد مساهمة صغيرة.",
      "contrib.devT": "المطورون والمصممون",
      "contrib.dev": "حسّن الشيفرة وسهولة الوصول والتصميم والاختبارات. المهام المناسبة للمبتدئين نقطة بداية رائعة.",
      "contrib.transT": "المترجمون والكتّاب",
      "contrib.trans": "ساعد في تحسين المحتوى العربي والإنجليزي والوثائق والشروحات المبسطة.",
      "contrib.advT": "المستشارون",
      "contrib.adv": "علماء المالية الإسلامية، وخبراء العمل غير الربحي والقانون والامتثال القادرون على توجيه النمو المسؤول.",
      "contrib.how": "اقرأ ملف CONTRIBUTING.md في مستودع المشروع، أو افتح مشكلة (Issue)، أو أرسل طلب دمج (Pull Request).",
      "footer.tag": "منصة إنسانية مفتوحة المصدر (نموذج أولي)",
      "footer.disclaimer": "ليست جمعية خيرية مسجلة. لا يتم قبول أي تبرعات حقيقية. جميع البيانات المعروضة خيالية ولأغراض العرض فقط.",
      "footer.license": "صدر بموجب رخصة MIT.",
      "lang.switch": "English",
      "lang.switchLabel": "Switch to English"
    }
  };

  const SUPPORTED_LANGS = ["en", "ar"];
  const RTL_LANGS = ["ar"];
  const STORAGE_KEY = "zakatbridge-lang";

  /* ======================================================================
     3. HELPERS
     ====================================================================== */

  /** Application state (kept in memory only; nothing is persisted except language). */
  const state = {
    lang: "en",
    filter: "all",
    simulatedCount: 0
  };

  /** Shorthand for document.getElementById. */
  const $ = (id) => document.getElementById(id);

  /** Translate a key into the current language, falling back to English. */
  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
  }

  /** Replace {placeholders} in a translated string. */
  function format(str, values) {
    return str.replace(/\{(\w+)\}/g, (match, name) =>
      Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match
    );
  }

  /** Locale used for number formatting. */
  function locale() {
    return state.lang === "ar" ? "ar-EG" : "en-CA";
  }

  function formatNumber(n) {
    return new Intl.NumberFormat(locale(), { maximumFractionDigits: 0 }).format(n);
  }

  function formatMoney(n, currency) {
    return new Intl.NumberFormat(locale(), {
      style: "currency", currency: currency, maximumFractionDigits: 2
    }).format(n);
  }

  /** Create an element with optional class and text content (safe — no HTML parsing). */
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /** Parse a numeric input; empty fields count as 0. Returns NaN for invalid input. */
  function readNumber(input) {
    const raw = input.value.trim();
    if (raw === "") return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : NaN;
  }

  /** Safe localStorage access (it may be blocked in private mode). */
  const storage = {
    get(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ } }
  };

  /** Show or hide an inline error message linked to an input. */
  function setError(errorEl, message, input) {
    if (message) {
      errorEl.textContent = message;
      errorEl.hidden = false;
      if (input) input.setAttribute("aria-invalid", "true");
    } else {
      errorEl.textContent = "";
      errorEl.hidden = true;
      if (input) input.removeAttribute("aria-invalid");
    }
  }

  /* ======================================================================
     4. INTERNATIONALISATION (language + RTL)
     ====================================================================== */

  function applyTranslations() {
    const html = document.documentElement;
    html.lang = state.lang;
    html.dir = RTL_LANGS.includes(state.lang) ? "rtl" : "ltr";
    document.title = t("meta.title");

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
      node.setAttribute("aria-label", t(node.getAttribute("data-i18n-aria")));
    });

    // The toggle button is labelled in the language it switches TO.
    const toggle = $("lang-toggle");
    const target = state.lang === "en" ? "ar" : "en";
    toggle.textContent = t("lang.switch");
    toggle.setAttribute("lang", target);
    toggle.setAttribute("aria-label", t("lang.switchLabel"));
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = "en";
    state.lang = lang;
    storage.set(STORAGE_KEY, lang);
    applyTranslations();
    // Re-render dynamic parts so their text and number formats update.
    renderCases();
    populateCaseSelect();
    renderDashboard();
    $("donation-result").hidden = true;
    $("calc-result").hidden = true;
  }

  function detectInitialLanguage() {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (SUPPORTED_LANGS.includes(fromUrl)) return fromUrl;
    const saved = storage.get(STORAGE_KEY);
    if (SUPPORTED_LANGS.includes(saved)) return saved;
    const browser = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.includes(browser) ? browser : "en";
  }

  /* ======================================================================
     5. CASE DIRECTORY
     ====================================================================== */

  function renderCases() {
    const list = $("case-list");
    list.replaceChildren();

    const visible = DEMO_CASES.filter((c) => state.filter === "all" || c.category === state.filter);

    if (visible.length === 0) {
      list.appendChild(el("p", "hint", t("cases.empty")));
      return;
    }

    visible.forEach((c) => {
      const card = el("article", "card case-card");

      const badges = el("div");
      badges.appendChild(el("span", "badge badge-" + c.category, t("label." + c.category)));
      badges.appendChild(el("span", "badge badge-demo", t("label.demo")));
      card.appendChild(badges);

      card.appendChild(el("h3", null, c.title[state.lang]));
      card.appendChild(el("p", "case-meta", c.id + " · " + c.region[state.lang]));
      card.appendChild(el("p", null, c.text[state.lang]));

      const pct = Math.min(100, Math.round((c.pledged / c.goal) * 100));
      const progress = el("div", "progress");
      progress.setAttribute("role", "progressbar");
      progress.setAttribute("aria-valuemin", "0");
      progress.setAttribute("aria-valuemax", "100");
      progress.setAttribute("aria-valuenow", String(pct));
      progress.setAttribute("aria-label", c.title[state.lang]);
      const fill = el("div", "progress-fill");
      fill.style.width = pct + "%";
      progress.appendChild(fill);
      card.appendChild(progress);

      card.appendChild(el("p", "progress-text",
        formatMoney(c.pledged, "CAD") + " " + t("cases.pledged") + " · " +
        t("cases.goal") + ": " + formatMoney(c.goal, "CAD") + " (" + formatNumber(pct) + "%)"
      ));

      const btn = el("button", "btn btn-primary", t("cases.support"));
      btn.type = "button";
      btn.addEventListener("click", () => preselectCase(c));
      card.appendChild(btn);

      list.appendChild(card);
    });
  }

  function setFilter(filter) {
    state.filter = filter;
    document.querySelectorAll(".filter-btn").forEach((b) => {
      const active = b.getAttribute("data-filter") === filter;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    renderCases();
  }

  /* ======================================================================
     6. SIMULATED DONATION FORM
     No personal or payment information is requested. Submitting only updates
     in-memory demo numbers in this browser tab.
     ====================================================================== */

  function selectedCategory() {
    const checked = document.querySelector('input[name="category"]:checked');
    return checked ? checked.value : "zakat";
  }

  /** Fill the case dropdown with cases matching the selected category. */
  function populateCaseSelect(preferredId) {
    const select = $("donation-case");
    const current = preferredId || select.value;
    const category = selectedCategory();
    select.replaceChildren();

    DEMO_CASES.filter((c) => c.category === category).forEach((c) => {
      const opt = el("option", null, c.id + " — " + c.title[state.lang]);
      opt.value = c.id;
      if (c.id === current) opt.selected = true;
      select.appendChild(opt);
    });
  }

  /** Called from a case card: choose its category & case, then scroll to the form. */
  function preselectCase(c) {
    const radio = document.querySelector('input[name="category"][value="' + c.category + '"]');
    if (radio) radio.checked = true;
    populateCaseSelect(c.id);
    $("donate").scrollIntoView();
    $("donation-amount").focus({ preventScroll: true });
  }

  /** Generate a non-sensitive demo reference such as SIM-4F7A2C. */
  function demoReference() {
    const bytes = new Uint8Array(3);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    return "SIM-" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  function handleDonationSubmit(event) {
    event.preventDefault();

    const amountInput = $("donation-amount");
    const ack = $("donation-ack");
    const amount = Number(amountInput.value);
    const currency = $("donation-currency").value === "USD" ? "USD" : "CAD"; // whitelist
    const caseItem = DEMO_CASES.find((c) => c.id === $("donation-case").value);
    const category = selectedCategory();

    let valid = true;

    if (!Number.isInteger(amount) || amount < 1 || amount > MAX_AMOUNT) {
      setError($("amount-error"), t("donate.errAmount"), amountInput);
      valid = false;
    } else {
      setError($("amount-error"), "", amountInput);
    }

    if (!ack.checked) {
      setError($("ack-error"), t("donate.errAck"), ack);
      valid = false;
    } else {
      setError($("ack-error"), "", ack);
    }

    if (!valid || !caseItem || caseItem.category !== category) {
      if (!valid) (amountInput.getAttribute("aria-invalid") ? amountInput : ack).focus();
      return;
    }

    // Update in-memory demo figures only.
    caseItem.pledged += currency === "USD" ? amount * USD_TO_CAD : amount;
    state.simulatedCount += 1;

    showDonationResult(caseItem, amount, currency);
    renderCases();
    renderDashboard();
    event.target.reset();
    populateCaseSelect();
  }

  function showDonationResult(caseItem, amount, currency) {
    const box = $("donation-result");
    box.replaceChildren(
      el("h3", null, t("donate.okTitle")),
      el("p", null, format(t("donate.okText"), {
        category: t("label." + caseItem.category),
        amount: formatMoney(amount, currency),
        caseId: caseItem.id
      })),
      el("p", null, t("donate.okRef") + " " + demoReference()),
      el("p", "hint", t("donate.okNote"))
    );
    box.hidden = false;
    box.setAttribute("tabindex", "-1"); // make the result focusable for screen readers
    box.focus();
  }

  /* ======================================================================
     7. TRANSPARENCY DASHBOARD (demo statistics only)
     ====================================================================== */

  function renderDashboard() {
    const totals = { zakat: { goal: 0, pledged: 0 }, sadaqah: { goal: 0, pledged: 0 } };
    DEMO_CASES.forEach((c) => {
      totals[c.category].goal += c.goal;
      totals[c.category].pledged += c.pledged;
    });

    const totalGoal = totals.zakat.goal + totals.sadaqah.goal;
    const totalPledged = totals.zakat.pledged + totals.sadaqah.pledged;

    $("stat-cases").textContent = formatNumber(DEMO_CASES.length);
    $("stat-goal").textContent = formatNumber(totalGoal);
    $("stat-raised").textContent = formatNumber(totalPledged);
    $("stat-sim").textContent = formatNumber(state.simulatedCount);

    const chart = $("chart-category");
    chart.replaceChildren();
    ["zakat", "sadaqah"].forEach((cat) => {
      const { goal, pledged } = totals[cat];
      const pct = goal ? Math.min(100, Math.round((pledged / goal) * 100)) : 0;

      const row = el("div", "bar-row");
      const head = el("div", "bar-row-head");
      head.appendChild(el("span", null, t("label." + cat)));
      head.appendChild(el("span", null,
        formatMoney(pledged, "CAD") + " / " + formatMoney(goal, "CAD") +
        " (" + formatNumber(pct) + "% " + t("dash.ofGoal") + ")"
      ));
      row.appendChild(head);

      const track = el("div", "bar-track");
      track.setAttribute("role", "img");
      track.setAttribute("aria-label", t("label." + cat) + ": " + formatNumber(pct) + "% " + t("dash.ofGoal"));
      const fill = el("div", "bar-fill " + cat);
      fill.style.width = pct + "%";
      track.appendChild(fill);
      row.appendChild(track);

      chart.appendChild(row);
    });
  }

  /* ======================================================================
     8. ZAKAT CALCULATOR
     net = assets − debts; if net ≥ nisab (grams × price/gram) then zakat = net × 2.5%
     ====================================================================== */

  function handleCalculatorSubmit(event) {
    event.preventDefault();
    const errorEl = $("calc-error");
    const resultEl = $("calc-result");
    const priceInput = $("calc-metal-price");
    const currency = $("calc-currency").value === "USD" ? "USD" : "CAD";
    const basis = $("calc-nisab-basis").value === "gold" ? "gold" : "silver";

    const price = readNumber(priceInput);
    if (!(price > 0)) {
      setError(errorEl, t("calc.errPrice"), priceInput);
      resultEl.hidden = true;
      priceInput.focus();
      return;
    }
    setError(errorEl, "", priceInput);

    const assetInputs = Array.from(document.querySelectorAll(".calc-asset"));
    const debtsInput = $("calc-debts");
    const values = assetInputs.concat(debtsInput).map(readNumber);

    if (values.some((v) => Number.isNaN(v) || v < 0)) {
      setError(errorEl, t("calc.errNeg"));
      resultEl.hidden = true;
      return;
    }

    const debts = values.pop();
    const assets = values.reduce((sum, v) => sum + v, 0);
    const net = Math.max(0, assets - debts);
    const nisab = NISAB_GRAMS[basis] * price;

    const children = [
      el("p", null, t("calc.net") + " " + formatMoney(net, currency)),
      el("p", null, t("calc.nisab") + " " + formatMoney(nisab, currency) +
        " (" + formatNumber(NISAB_GRAMS[basis]) + " g)")
    ];

    if (net >= nisab && net > 0) {
      children.unshift(
        el("h3", null, t("calc.due")),
        el("p", "big", formatMoney(net * ZAKAT_RATE, currency))
      );
    } else {
      children.unshift(el("h3", null, t("calc.notDue")));
    }

    resultEl.replaceChildren(...children);
    resultEl.hidden = false;
  }

  /* ======================================================================
     9. NAVIGATION (mobile menu)
     ====================================================================== */

  function setupNavigation() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = $("primary-nav");

    const close = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { close(); toggle.focus(); }
    });
  }

  /* ======================================================================
     10. INITIALISATION
     ====================================================================== */

  function init() {
    state.lang = detectInitialLanguage();
    applyTranslations();
    setupNavigation();

    $("lang-toggle").addEventListener("click", () => setLanguage(state.lang === "en" ? "ar" : "en"));

    document.querySelectorAll(".filter-btn").forEach((b) =>
      b.addEventListener("click", () => setFilter(b.getAttribute("data-filter")))
    );
    document.querySelectorAll("[data-filter-jump]").forEach((b) =>
      b.addEventListener("click", () => {
        setFilter(b.getAttribute("data-filter-jump"));
        $("cases").scrollIntoView();
      })
    );

    document.querySelectorAll('input[name="category"]').forEach((r) =>
      r.addEventListener("change", () => populateCaseSelect())
    );

    $("donation-form").addEventListener("submit", handleDonationSubmit);
    $("zakat-form").addEventListener("submit", handleCalculatorSubmit);

    renderCases();
    populateCaseSelect();
    renderDashboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
