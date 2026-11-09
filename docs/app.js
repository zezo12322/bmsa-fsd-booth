(function () {
  'use strict';
  const core=globalThis.FSD_CORE;
  const main=document.querySelector('main');
  let session=null;
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ltr=s=>`<bdi dir="ltr">${escape(s)}</bdi>`;
  const label=mode=>mode==='deal'?'Deal or No Deal: Sponsor Edition':'Pitch Pong';
  function application() {
    const url=core.safeApplicationUrl(window.FSD_CONFIG?.applicationUrl);
    return `<div class="apply-wrap">${url?`<a class="primary" href="${escape(url)}" target="_blank" rel="noopener noreferrer">قدّم للـ FSD <span aria-hidden="true">↗</span></a><small>هيفتح رابط التقديم الرسمي في صفحة جديدة</small>`:'<button class="primary" data-action="apply" aria-controls="apply-note" aria-expanded="false">التقديم للـ FSD</button><small>الرابط الرسمي هيتضاف قريب</small>'}</div>`;
  }
  function applyNote(){return '<p class="apply-note" id="apply-note" hidden role="status">رابط التقديم الرسمي لسه ما اتضافش. اسأل فريق FSD في الـ Booth عن التقديم. اللعبة مش بتسجّل تقديم أو بيانات.</p>';}
  function render(moveFocus=true) {
    main.innerHTML=session ? game() : home();
    if(moveFocus){main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
  }
  function home(){return `<div class="fade-in"><section class="intro" aria-labelledby="home-title"><div><span class="eyebrow">خُد لفة جوه FSD</span><h1 id="home-title">الـ Deal الجاي<br>ممكن يكون بإيدك.</h1><p class="lead">بتعرف تقنع؟ تحسبها؟ تلاقي فرصة؟<br>جرّب شغل FSD في كام قرار سريع.</p><div class="quick-notes"><span class="pill">حوالي دقيقة للجولة</span><span class="pill">٣ قرارات</span><span class="pill">Feedback فوري</span></div></div><div class="hero-board" aria-hidden="true"><div class="board-top"><span>من فكرة… لحاجة بتحصل</span><span>BMSA / FSD</span></div><div class="board-title">كل فرصة محتاجة قرار.</div><div class="ball"></div><div class="hero-cups"><div class="cup-art">F</div><div class="cup-art">S</div><div class="cup-art">D</div></div><div class="board-foot"><span>إقناع + حسابات + علاقات</span><span>إنت هتبدأ بإيه؟</span></div></div></section><section aria-labelledby="games-title"><div class="section-intro"><h2 id="games-title">اختار لعبتك</h2><span>موبايلك هو كل الماتريال اللي محتاجها</span></div><div class="games"><button class="game-card" data-action="start" data-mode="deal"><span class="card-symbol">تفاوض وإقناع</span><h3>Deal or No Deal<small>Sponsor Edition</small></h3><p>افتح شنطة، شوف عرض الـ Sponsor، وقرّر: تقبل، تتفاوض، ولا ترفض؟</p><span class="card-bottom"><span class="duration">٣ عروض · حوالي دقيقة</span><span class="play-circle" aria-hidden="true">←</span></span></button><button class="game-card" data-action="start" data-mode="pitch"><span class="card-symbol coral">٤ مجالات، ٣ محاولات</span><h3>Pitch Pong</h3><p>اختار كوباية وخُد تحدّي سريع في Sponsorship، Fundraising، Merchandise أو Partnerships.</p><span class="card-bottom"><span class="duration">٣ تحديات · حوالي دقيقة</span><span class="play-circle" aria-hidden="true">←</span></span></button></div></section><section class="about-fsd"><div><h3>FSD بيحوّل الأفكار لموارد وفرص.</h3><p>رعاة، تمويل، Merch وشراكات تسند أنشطة BMSA. جرّب جزء من الشغل وشوف بتحب إيه.</p></div>${application()}</section>${applyNote()}<p class="tiny">كل العروض والأرقام افتراضية. دي تجربة للتعرّف على FSD، مش تقييم قبول أو وعد بمكافأة.</p></div>`;}
  function game(){
    if(session.stage==='result') return result();
    const n=session.history.length+(session.stage==='feedback'?0:1);
    const bars=[0,1,2].map(i=>`<span class="${i<session.history.length?'done':i===session.history.length&&session.stage!=='feedback'?'current':''}"></span>`).join('');
    return `<div class="game-shell fade-in"><div class="game-header"><button class="back" data-action="home">البداية ↩</button><span class="game-name">${escape(label(session.mode))}</span></div><div class="progress-row"><span>القرار ${Math.min(n,3)} من ٣</span><span>${session.score} قرارات موفقة</span></div><div class="progress" aria-label="خلصت ${session.history.length} من ٣ قرارات">${bars}</div>${session.stage==='select'?selection():question()}</div>`;
  }
  function selection(){
    if(session.mode==='deal')return `<h2>افتح شنطة. شوف الـ Offer.</h2><p class="game-subtitle">٣ عروض، وإنت صاحب القرار. اقرأ الشروط قبل ما تقول Deal.</p><div class="select-grid">${session.deck.map((s,i)=>`<button class="envelope" data-action="choose" data-key="${i}" ${session.used.includes(i)?'disabled':''} aria-label="${session.used.includes(i)?'خلصت':'افتح'} الشنطة ${i+1}"><span class="case" aria-hidden="true">${session.used.includes(i)?'✓':i+1}</span><span>${session.used.includes(i)?'اتاخد القرار':'عرض مقفول'}</span></button>`).join('')}</div><p class="instruction">العروض مخفية لحد ما تفتحها. مفيش فلوس أو جوائز حقيقية.</p>`;
    return `<h2>اختار كوباية… وخُد التحدّي.</h2><p class="game-subtitle">الـ Pong هنا بقرارك: اضغط على ٣ كوبايات مختلفة من الـ ٤. من غير رمي أو سحب.</p><div class="pitch-board"><div class="board-heading">كل كوباية بتفتح مجال من شغل FSD</div><div class="cups">${Object.entries(core.tracks).map(([key,t])=>`<button class="cup-button ${session.used.includes(key)?'used':''}" data-action="choose" data-key="${key}" ${session.used.includes(key)?'disabled':''} aria-label="${session.used.includes(key)?'خلصت تحدي':'العب تحدي'} ${t.name}"><span class="cup" aria-hidden="true">${session.used.includes(key)?'✓':t.symbol}</span><span>${ltr(t.name)}</span></button>`).join('')}</div></div><p class="instruction">اختار براحتك. مفيش مؤقّت يقفّل عليك السؤال.</p>`;
  }
  function question(){
    const s=session.current, answered=session.stage==='feedback';
    const options=session.order.map((original,position)=>`<button class="option ${answered&&original===s.answer?'correct':''} ${answered&&original===session.selected?'selected':''}" data-action="answer" data-choice="${original}" ${answered?'disabled':''}><span class="option-key" aria-hidden="true">${answered&&original===s.answer?'✓':['أ','ب','ج'][position]}</span><span>${escape(s.options[original])}${answered&&original===session.selected?' <strong>(اختيارك)</strong>':''}${answered&&original===s.answer?' <strong>(الأنسب)</strong>':''}</span></button>`).join('');
    const good=session.selected===s.answer;
    return `<section class="scenario" aria-labelledby="question-title"><span class="track-tag">${ltr(core.tracks[s.track].name)}</span><h2 id="question-title">${escape(s.title)}</h2><p>${escape(s.brief)}</p><div class="context">${escape(s.context)}</div><div class="options" aria-label="اختار أنسب قرار">${options}</div>${answered?`<div class="feedback ${good?'good':''}" id="feedback" role="status" tabindex="-1"><h3>${good?'قرار في مكانه!':'خلّينا نحسبها تاني.'}</h3><p>${escape(s.why)}</p><p class="learn">خُدها معاك: ${escape(s.takeaway)}</p></div><div class="next-row"><button class="primary" data-action="next">${session.history.length===3?'شوف حصيلتك':'التحدّي اللي بعده'} <span aria-hidden="true">←</span></button></div>`:'<p class="instruction">اختيار واحد، وبعده هتعرف السبب فورًا.</p>'}</section>`;
  }
  function result(){
    const headline=session.score===3?'٣ قرارات… وشغل مظبوط.':session.score===2?'عندك حسّ الـ FSD.':'كل قرار بيعلّمك حاجة.';
    return `<div class="game-shell fade-in"><section class="result-ticket"><span class="eyebrow">الجولة خلصت</span><h1>${headline}</h1><span class="score-number" aria-label="${session.score} من ٣">${session.score}<span aria-hidden="true"> / 3</span></span><p>قرارات موفقة في ${ltr(label(session.mode))}</p></section><section class="recap"><h2>إيه اللي تاخده من الجولة؟</h2>${session.history.map(h=>`<div class="recap-item"><span class="check" aria-hidden="true">${h.good?'✓':'↗'}</span><p>${ltr(core.tracks[h.scenario.track].name)}<br>${escape(h.scenario.takeaway)}</p></div>`).join('')}</section><div class="result-apply"><h3>حبيت طريقة التفكير؟</h3><p>تعالى اسأل فريق FSD في الـ Booth عن الشغل والفرص.</p>${application()}${applyNote()}</div><div class="result-actions"><button class="primary" data-action="start" data-mode="${session.mode==='deal'?'pitch':'deal'}">جرّب ${session.mode==='deal'?'Pitch Pong':'Deal or No Deal'}</button><button class="secondary" data-action="start" data-mode="${session.mode}">العب جولة جديدة</button><button class="text-button" data-action="home">البداية</button></div><p class="tiny">دي حصيلة اللعبة بس، ملهاش علاقة بقبولك في الريكروتمنت.<br>سلّم الموبايل لصاحبك؟ اضغط «البداية» عشان تبدأوا من جديد.</p></div>`;
  }
  main.addEventListener('click',e=>{
    const button=e.target.closest('[data-action]'); if(!button||button.disabled)return;
    const action=button.dataset.action;
    if(action==='start'){session=core.createSession(button.dataset.mode);render();}
    else if(action==='home'){session=null;render();}
    else if(action==='choose'){const key=session?.mode==='deal'?Number(button.dataset.key):button.dataset.key;if(session&&core.choose(session,key))render();}
    else if(action==='answer'){if(session&&core.answer(session,Number(button.dataset.choice))){render(false);const feedback=document.querySelector('#feedback');feedback.focus({preventScroll:true});feedback.scrollIntoView({block:'nearest',behavior:'instant'});}}
    else if(action==='next'){if(session&&core.advance(session))render();}
    else if(action==='apply'){const note=document.querySelector('#apply-note');note.hidden=false;button.setAttribute('aria-expanded','true');note.scrollIntoView({block:'nearest',behavior:'instant'});}
  });
  document.querySelector('#privacy-toggle').addEventListener('click',e=>{const note=document.querySelector('#privacy-note');note.hidden=!note.hidden;e.currentTarget.setAttribute('aria-expanded',String(!note.hidden));});
  render(false);
})();
