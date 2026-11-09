const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const dist=path.resolve(__dirname,'../docs');
const source=fs.readFileSync(path.join(dist,'core.js'),'utf8');
const sandbox={URL};vm.createContext(sandbox);vm.runInContext(source,sandbox);
const C=sandbox.FSD_CORE;
test('18 unique complete scenarios covering the four FSD tracks',()=>{
 assert.equal(C.bank.length,18);assert.equal(new Set(C.bank.map(s=>s.id)).size,18);
 for(const [key] of Object.entries(C.tracks))assert.ok(C.bank.filter(s=>s.track===key).length>=4);
 for(const s of C.bank){assert.ok(s.title&&s.brief&&s.context&&s.why&&s.takeaway);assert.equal(s.options.length,3);assert.equal(new Set(s.options).size,3);assert.ok(Number.isInteger(s.answer)&&s.answer>=0&&s.answer<3);}
});
test('Every answer for every scenario gives correct scoring and rejects double taps',()=>{
 for(const scenario of C.bank)for(let choice=0;choice<3;choice++){
   const s=C.createSession('pitch');s.current=scenario;s.stage='question';
   assert.equal(C.answer(s,choice),true);assert.equal(s.score,choice===scenario.answer?1:0);
   assert.equal(s.history.length,1);assert.equal(s.stage,'feedback');assert.equal(C.answer(s,choice),false);
   assert.equal(s.history.length,1);assert.equal(C.choose(s,'fundraising'),false);
 }
});
test('Deal: three different cases, exactly three rounds, no skipping, result and reset',()=>{
 const s=C.createSession('deal',()=>.4);assert.equal(C.advance(s),false);assert.equal(C.choose(s,-1),false);assert.equal(C.choose(s,3),false);
 assert.equal(new Set(s.deck.map(x=>x.id)).size,3);
 for(let i=0;i<3;i++){assert.equal(C.choose(s,i),true);assert.equal(C.choose(s,i),false);assert.equal(C.advance(s),false);assert.equal(new Set(s.order).size,3);C.answer(s,s.current.answer);assert.equal(C.advance(s),true);assert.equal(C.advance(s),false);if(i<2)assert.equal(C.choose(s,i),false);}
 assert.equal(s.stage,'result');assert.equal(s.score,3);assert.equal(C.choose(s,0),false);
 const fresh=C.createSession('deal');assert.equal(fresh.score,0);assert.equal(fresh.history.length,0);assert.equal(fresh.used.length,0);
});
test('Pitch: all four categories playable and three distinct cups end the round',()=>{
 for(const track of Object.keys(C.tracks)){const s=C.createSession('pitch');assert.equal(C.choose(s,track),true);assert.equal(s.current.track,track);}
 const s=C.createSession('pitch');assert.equal(C.choose(s,'invalid'),false);
 for(const track of ['sponsorship','merchandise','partnerships']){C.choose(s,track);C.answer(s,(s.current.answer+1)%3);C.advance(s);assert.equal(C.choose(s,track),false);}
 assert.equal(s.stage,'result');assert.equal(s.score,0);assert.equal(s.history.length,3);assert.equal(C.choose(s,'fundraising'),false);
});
test('Official application URL: missing and unsafe input never becomes a link',()=>{
 for(const u of ['',null,undefined,'javascript:alert(1)','http://example.org','/apply','https://user:pass@example.org','data:text/html,test'])assert.equal(C.safeApplicationUrl(u),null);
 assert.equal(C.safeApplicationUrl('https://example.org/apply'),'https://example.org/apply');
});
test('Rendered home, both modes, all feedback, results, and missing/configured CTA',()=>{
 const main={innerHTML:'',focus(){},addEventListener(type,fn){this.handler=fn;}};
 const note={hidden:true,focus(){},scrollIntoView(){}};
 const privacy={addEventListener(){}};
 const document={querySelector(s){return s==='main'?main:s==='#privacy-toggle'?privacy:note;}};
 const ui={URL,document,window:{FSD_CONFIG:{applicationUrl:''},scrollTo(){}}};vm.createContext(ui);vm.runInContext(source,ui);vm.runInContext(fs.readFileSync(path.join(dist,'app.js'),'utf8'),ui);
 const click=dataset=>main.handler({target:{closest(){return {dataset,setAttribute(){}};}}});
 assert.ok(main.innerHTML.includes('اختار لعبتك'));assert.ok(main.innerHTML.includes('الرابط الرسمي هيتضاف قريب'));assert.ok(!main.innerHTML.includes('href="https:'));
 for(const mode of ['deal','pitch']){
  click({action:'start',mode});
  const keys=mode==='deal'?['0','1','2']:['sponsorship','fundraising','merchandise'];
  for(let i=0;i<3;i++){
    click({action:'choose',key:keys[i]});assert.ok(main.innerHTML.includes('question-title'));
    click({action:'answer',choice:'0'});assert.ok(main.innerHTML.includes('role="status"'));assert.ok(main.innerHTML.includes(`القرار ${i+1} من ٣`));
    const before=main.innerHTML;click({action:'answer',choice:'1'});assert.equal(main.innerHTML,before);
    click({action:'next'});
  }
  assert.ok(main.innerHTML.includes('الجولة خلصت'));assert.ok(main.innerHTML.includes('ملهاش علاقة بقبولك'));
  click({action:'home'});assert.ok(main.innerHTML.includes('اختار لعبتك'));
 }
 click({action:'apply'});assert.equal(note.hidden,false);
 ui.window.FSD_CONFIG.applicationUrl='https://example.org/apply';click({action:'home'});assert.ok(main.innerHTML.includes('href="https://example.org/apply"'));assert.ok(main.innerHTML.includes('rel="noopener noreferrer"'));
});
test('Static package contains no tracking, storage, submission, or runtime third-party calls',()=>{
 for(const f of ['index.html','config.js','core.js','app.js','style.css']){
   const text=fs.readFileSync(path.join(dist,f),'utf8');
   assert.ok(!/localStorage|sessionStorage|document\.cookie|sendBeacon|XMLHttpRequest|\bfetch\s*\(|<form|<input|https?:\/\//i.test(text),f);
 }
 const html=fs.readFileSync(path.join(dist,'index.html'),'utf8');assert.ok(html.includes('lang="ar" dir="rtl"'));assert.ok(html.includes("connect-src 'none'"));
 const css=fs.readFileSync(path.join(dist,'style.css'),'utf8');assert.ok(css.includes('prefers-reduced-motion'));assert.ok(css.includes(':focus-visible'));
 console.log('Runtime asset total:',fs.readdirSync(dist).reduce((n,f)=>n+fs.statSync(path.join(dist,f)).size,0),'bytes');
});
