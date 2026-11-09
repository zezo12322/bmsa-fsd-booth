/* سيناريوهات تعليمية افتراضية. مفيش تسجيل أو تخزين أو إرسال للإجابات. */
(function (root) {
  'use strict';
  const tracks = {
    sponsorship: { name: 'Sponsorship', short: 'اقفل Deal', symbol: 'S', tip: 'Sponsorship: دعم مقابل مزايا واضحة نقدر ننفذها.' },
    fundraising: { name: 'Fundraising', short: 'موّل الفكرة', symbol: 'F', tip: 'Fundraising: نجمع موارد بهدف واضح وحسابات شفافة.' },
    merchandise: { name: 'Merchandise', short: 'احسبها صح', symbol: 'M', tip: 'Merchandise: منتج الناس محتاجاه، بتكلفة وتسعير محسوبين.' },
    partnerships: { name: 'Partnerships', short: 'اكسبوا سوا', symbol: 'P', tip: 'Partnerships: تعاون بقيمة للطرفين وأدوار متفق عليها.' }
  };
  // answer is the best available decision for this specific brief, not a hiring assessment.
  const bank = [
    { id:'s1', track:'sponsorship', title:'فلوس مقابل أرقام الطلبة؟', brief:'Sponsor هيغطي طباعة الماتريال، بس عايز أرقام موبايلات الطلبة من الـ Booth.', context:'الخصوصية شرط أساسي. مفيش تصريح لجمع أو مشاركة بيانات.', options:['Deal: أوافق عشان نوفّر التكلفة.','نتفاوض: أبعته نص الأرقام بس.','No Deal: أرفض شرط البيانات وأعرض ظهور للبراند بدلها.'], answer:2, why:'صح، بيانات الطلبة مش ميزة بنبيعها. نرفض الشرط ونقترح قيمة آمنة، زي مساحة للّوجو بعد الموافقات.', takeaway:'الـ Sponsor بياخد Value، مش بيانات الطلبة.' },
    { id:'s2', track:'sponsorship', title:'وعد أكبر من قدرتنا', brief:'Sponsor هيوفّر ٢٠٠٠ جنيه، مقابل ضمان ٥٠٠ عميل يشتروا منه بعد الإيفنت.', context:'إنت تقدر تضمن ظهور البراند، لكن متقدرش تضمن مشتريات الطلبة.', options:['Deal: أوعده بالرقم ونشوف بعدين.','نتفاوض: نستبدل ضمان البيع بمزايا ظهور قابلة للقياس.','No Deal: نرفض أي تعاون معاه نهائيًا.'], answer:1, why:'التفاوض هنا أفضل: نحدّد Deliverables نقدر نلتزم بيها، زي عدد البوستات ومساحة اللوجو، من غير وعد بمبيعات مش في إيدنا.', takeaway:'وعدك لازم يكون تحت سيطرتك وقابل للتنفيذ.' },
    { id:'s3', track:'sponsorship', title:'عرض صغير… بس مناسب', brief:'مكتبة هتوفّر ١٠٠ مطبوعة محتاجينها، مقابل اللوجو على لوحة الرعاة وشكر في بوست.', context:'المكتبة مناسبة، والمزايا والتكلفة والموافقات كلها متأكد منها ومكتوبة.', options:['Deal: نقفل العرض بالمزايا المكتوبة.','نتفاوض: نطلب ضعف الدعم من غير قيمة إضافية.','No Deal: أي دعم عيني مالوش لازمة.'], answer:0, why:'الدعم العيني In-kind بيوفّر مصروف حقيقي. طالما الاحتياج موجود والمقابل واضح ومتوافق عليه، العرض مناسب.', takeaway:'الـ In-kind ممكن يساوي فلوس وفّرناها فعلًا.' },
    { id:'s4', track:'sponsorship', title:'اللوجو فين وإمتى؟', brief:'Sponsor قال: «هندعمكم، وإنتوا اعملولنا دعاية كويسة». المبلغ وميعاد التحويل لسه مش محددين.', context:'طباعة الماتريال هتبدأ بكرة. محتاج تعرف الدعم والمقابل قبل الالتزام.', options:['Deal: نطبع اللوجو ونفترض إن الفلوس جاية.','No Deal: نقطع الكلام فورًا.','نتفاوض: نثبت قيمة الدعم وميعاده ومزايا الظهور كتابيًا.'], answer:2, why:'الاتفاق الغامض بيعمل توقعات مختلفة. ثبّت الدعم وموعده والـ Deliverables وطريقة التأكيد قبل أي التزام.', takeaway:'اقفل التفاصيل قبل ما تقفل الـ Deal.' },
    { id:'s5', track:'sponsorship', title:'حصرية من غير حدود', brief:'Sponsor هيساهم في المطبوعات، وعايز حصرية تمنع أي براند تاني يتعاون مع BMSA طول السنة.', context:'الفريق مفوّض لاتفاق يخص الإيفنت ده بس، مش أنشطة السنة كلها.', options:['نتفاوض: نحصر الحصرية في فئة ومدة الإيفنت بعد موافقة الفريق.','Deal: نوافق على السنة كلها عشان نكسبه.','No Deal: الحصرية مستحيل تبقى مفيدة.'], answer:0, why:'الحصرية ليها تكلفة وفرصة بديلة. لازم تكون في حدود صلاحيتنا، لفئة ومدة محددتين، وبموافقة المسؤولين.', takeaway:'الحصرية Scope ومدة وقيمة، مش كلمة وخلاص.' },
    { id:'s6', track:'sponsorship', title:'عقد بيضر الطلبة', brief:'براند عايز يوزّع إعلان فيه ادعاءات طبية مضللة جوه الـ Booth مقابل دعم كبير.', context:'محتوى الإعلان مخالف لمعايير الفريق. الدعم مش مبرر لاعتماده.', options:['Deal: المبلغ يستاهل.','نتفاوض: نصغّر الإعلان ونسيبه زي ما هو.','No Deal: نرفض المحتوى والدعم المشروط بيه.'], answer:2, why:'مصداقية BMSA وسلامة الرسالة أهم من قيمة العرض. تصغير الإعلان مش بيصلّح الادعاء المضلل.', takeaway:'اختيار الـ Sponsor لازم يحافظ على الثقة.' },
    { id:'f1', track:'fundraising', title:'جمعنا كام… وصافي كام؟', brief:'بعتوا ٣٠ Bookmark، الواحد بـ ٢٠ جنيه. إجمالي تكلفة الإنتاج ٣٠٠ جنيه. كام صافي العائد؟', context:'مفيش مصاريف تانية في السيناريو ده.', options:['٦٠٠ جنيه.','٣٠٠ جنيه.','٩٠٠ جنيه.'], answer:1, why:'الإيراد ٣٠ × ٢٠ = ٦٠٠ جنيه. نشيل تكلفة الـ ٣٠٠ جنيه، يبقى صافي العائد ٣٠٠ جنيه.', takeaway:'صافي العائد = الإيراد − كل التكاليف.' },
    { id:'f2', track:'fundraising', title:'فكرة حلوة بميزانية صغيرة', brief:'معاك ٤٠٠ جنيه. قدامك منتج بسيط عليه طلب، أو هدايا مكلفة محدش سأل عليها.', context:'هدفك تموّل نشاط من غير ما تحبس الميزانية في مخزون.', options:['نشتري الهدايا المكلفة كلها.','نحدد الهدف، ونجرّب كمية صغيرة من المنتج المطلوب.','نصرف المبلغ على شكل الترابيزة بس.'], answer:1, why:'ابدأ بهدف واضح وتجربة صغيرة محسوبة. متابعة الطلب والتكلفة قبل التوسّع بتقلل المخاطرة.', takeaway:'اختبر الطلب قبل ما تصرف الميزانية.' },
    { id:'f3', track:'fundraising', title:'الهدف اتغطّى', brief:'الحملة وصلت للمبلغ المطلوب للنشاط، ولسه ناس عايزة تساهم.', context:'مفيش سياسة معلنة للتعامل مع أي فائض.', options:['نكمل جمع من غير ما نقول للناس.','نحوّل الفلوس لأي غرض من غير توضيح.','نعلن إن الهدف اتغطّى، ونوقف الجمع لحد توضيح سياسة الفائض والموافقة عليها.'], answer:2, why:'الشفافية جزء من Fundraising. أي استخدام مختلف لازم يتوضّح ويتوافق عليه قبل استمرار الجمع.', takeaway:'كل مساهمة ليها هدف واضح ومحاسبة.' },
    { id:'f4', track:'fundraising', title:'Pitch في جملة', brief:'طالب سألك: «ليه أشتري الـ Bookmark ده؟» اختار أوضح Pitch.', context:'المنتج بـ ٢٠ جنيه، وصافي العائد مخصص لماتريال النشاط المعلن.', options:['Bookmark بـ ٢٠ جنيه، هيفيدك في المذاكرة وصافي عائده بيساهم في ماتريال النشاط.','اشتري وخلاص عشان تساعدنا.','لازم تشتري عشان تدخل النشاط.'], answer:0, why:'الجملة بتوصل قيمة المنتج وسعره وهدف العائد من غير ضغط أو تضليل.', takeaway:'Pitch قصير = قيمة + سعر + أثر واضح.' },
    { id:'m1', track:'merchandise', title:'الطلب قبل المخزون', brief:'عايزين تطبعوا T-shirts، بس المقاسات والتصميم المطلوبين لسه مش معروفين.', context:'الميزانية محدودة، والمخزون الزيادة ممكن يفضل بعد الإيفنت.', options:['نطبع ٢٠٠ قطعة بمقاس واحد.','نختبر التصميم والمقاسات بعينة واهتمام مبدئي قبل الطلبية.','نختار أرخص خامة من غير ما نشوفها.'], answer:1, why:'اختبار التصميم والمقاسات والعينة بيقلل المخزون الراكد ومفاجآت الجودة. الاختبار هنا من غير جمع بيانات في اللعبة.', takeaway:'Merch ناجح يبدأ باحتياج حقيقي وعينة كويسة.' },
    { id:'m2', track:'merchandise', title:'التكلفة مش الطباعة بس', brief:'تكلفة الـ Tote bag: خامة ٥٠ + طباعة ٢٠ + تغليف ٥ جنيه. هنبيعه بـ ١٠٠ جنيه.', context:'افترض مفيش أي تكاليف تانية. كام هامش المساهمة للقطعة؟', options:['٥٠ جنيه.','٣٠ جنيه.','٢٥ جنيه.'], answer:2, why:'تكلفة القطعة ٥٠ + ٢٠ + ٥ = ٧٥ جنيه. السعر ١٠٠، يبقى هامش المساهمة ٢٥ جنيه قبل أي مصاريف أخرى.', takeaway:'احسب كل تكلفة قبل ما تسعّر الـ Merch.' },
    { id:'m3', track:'merchandise', title:'الجودة قبل التسليم', brief:'استلمتوا دفعة Stickers وفيها عيب طباعة واضح، والتوزيع بعد يومين.', context:'فيه وقت لمراجعة المورد ومحاولة استبدال المعيب.', options:['نراجع الدفعة ونطلب تصحيح أو استبدال قبل البيع.','نبيعها ونخبي العيب.','نضاعف السعر عشان نعوّض العيوب.'], answer:0, why:'مراجعة العينة والدفعة والتواصل مع المورد بتحمي ثقة الناس وبتساعد تضمن جودة اللي بتقدمه.', takeaway:'Quality check قبل ما الـ Merch يوصل للناس.' },
    { id:'m4', track:'merchandise', title:'نقطة التعادل', brief:'تجهيز تصميم وطباعة بـ ٢٠٠ جنيه ثابتة. كل قطعة بتتكلف ٣٠ وبتتباع بـ ٥٠ جنيه.', context:'مفيش مصاريف تانية، وكل القطع المنتجة هتتباع. كام قطعة تغطي التكلفة؟', options:['٤ قطع.','١٠ قطع.','٢٠ قطعة.'], answer:1, why:'كل قطعة بتساهم بـ ٥٠ − ٣٠ = ٢٠ جنيه. الـ ٢٠٠ جنيه الثابتة ÷ ٢٠ = ١٠ قطع لنقطة التعادل.', takeaway:'Break-even = التكاليف الثابتة ÷ مساهمة القطعة.' },
    { id:'p1', track:'partnerships', title:'Partner مناسب', brief:'نادي طلابي عنده مكان للورشة، وإنتوا عندكم محتوى ومدرّب. الاتنين عايزين نشاط مفيد.', context:'محتاجين تعاون بموارد بسيطة وفايدة واضحة لكل طرف.', options:['نطلب المكان ونسيب كل التفاصيل ليوم الورشة.','نتفق على المكان والمحتوى والأدوار والميعاد والترويج.','نوعده بفلوس مش موجودة.'], answer:1, why:'فيه تكامل واضح في الموارد. الاتفاق على الأدوار والموعد والمخرجات بيحوّل الفكرة لشراكة قابلة للتنفيذ.', takeaway:'Partnership كويسة = قيمة متبادلة وأدوار واضحة.' },
    { id:'p2', track:'partnerships', title:'مين هيعمل إيه؟', brief:'Partner وافق «يساعد في الإيفنت» من غير تحديد مسؤولية. باقي أسبوع واحد.', context:'محتاجين نتجنب إن كل طرف يفتكر إن التاني مسؤول.', options:['نكمل ونرتجل يومها.','نحط اسمه على كل حاجة فورًا.','نثبت مين مسؤول عن كل مهمة، والمواعيد ونقطة التواصل.'], answer:2, why:'تحديد المسؤوليات والمواعيد ونقطة التواصل بيمنع المهام من الوقوع بين الطرفين.', takeaway:'كل مهمة ليها Owner وDeadline.' },
    { id:'p3', track:'partnerships', title:'مش نفس الجمهور', brief:'جهة كبيرة عرضت تعاون في نشاط ملوش علاقة باحتياج الطلبة أو هدف الإيفنت.', context:'الموارد المتاحة تكفي شراكة واحدة، وفيه بديل أصغر مناسب للجمهور.', options:['نختار البديل المناسب للهدف والجمهور.','نختار الاسم الأكبر مهما كان النشاط.','نقبل الاتنين من غير فريق ينفّذ.'], answer:0, why:'الاسم الكبير لوحده مش مقياس نجاح. التوافق مع الهدف والجمهور والقدرة على التنفيذ أقوى.', takeaway:'اختار الـ Partner المناسب، مش الاسم الأكبر بس.' },
    { id:'p4', track:'partnerships', title:'نكمل الشراكة؟', brief:'الورشة خلصت. إيه أفضل خطوة قبل ما تطلبوا تعاون تاني؟', context:'عايزين علاقة مستمرة وتطوير للتجربة.', options:['نختفي لحد ما نحتاج حاجة.','نراجع اللي اتنفّذ ونشارك ملخص وFeedback ونشكر الفريق.','نعلن نجاح مبالغ فيه من غير مراجعة.'], answer:1, why:'المراجعة والشكر والتغذية الراجعة بتوضح القيمة اللي اتحققت، واللي نقدر نحسّنه المرة الجاية.', takeaway:'Follow-up كويس يحوّل نشاط واحد لعلاقة مستمرة.' }
  ];
  function shuffle(items, rng = Math.random) {
    const result = [...items];
    for (let i=result.length-1;i>0;i--) { const j=Math.floor(rng()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
    return result;
  }
  function safeApplicationUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try { const u=new URL(value); return u.protocol==='https:' && !u.username && !u.password ? u.href : null; } catch { return null; }
  }
  function createSession(mode, rng = Math.random) {
    if (!['deal','pitch'].includes(mode)) throw new Error('Unknown mode');
    return { mode, stage:'select', deck:shuffle(bank.filter(s=>s.track==='sponsorship'),rng).slice(0,3), used:[], history:[], current:null, order:[], selected:null, score:0 };
  }
  function choose(state, key, rng = Math.random) {
    if (state.stage !== 'select' || state.used.includes(key) || state.history.length>=3) return false;
    let scenario;
    if (state.mode==='deal') {
      if (!Number.isInteger(key) || key<0 || key>=state.deck.length) return false;
      scenario=state.deck[key];
    } else {
      if (!Object.hasOwn(tracks,key)) return false;
      scenario=shuffle(bank.filter(s=>s.track===key),rng)[0];
    }
    state.used.push(key); state.current=scenario; state.order=shuffle([0,1,2],rng); state.selected=null; state.stage='question'; return true;
  }
  function answer(state, choice) {
    if (state.stage!=='question' || !Number.isInteger(choice) || choice<0 || choice>2) return false;
    state.selected=choice; const good=choice===state.current.answer;
    if(good) state.score++;
    state.history.push({scenario:state.current, choice, good}); state.stage='feedback'; return true;
  }
  function advance(state) {
    if (state.stage!=='feedback') return false;
    state.stage=state.history.length===3?'result':'select'; return true;
  }
  root.FSD_CORE=Object.freeze({tracks,bank,shuffle,safeApplicationUrl,createSession,choose,answer,advance});
})(globalThis);
