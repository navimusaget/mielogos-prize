
const MLP = (() => {
  const cache = {};
  async function get(path){ if(cache[path]) return cache[path]; const r=await fetch(path,{cache:'no-store'}); if(!r.ok) throw new Error(`Cannot load ${path}`); cache[path]=await r.json(); return cache[path]; }
  function currentCycle(cycles){ return cycles.find(c=>c.current) || cycles.slice().sort((a,b)=>b.year-a.year)[0]; }
  function state(c, now=new Date()){
    const open=new Date(c.submission_open), close=new Date(c.submission_close), longlist=new Date(c.longlist_date+'T00:00:00Z'), shortlist=new Date(c.shortlist_date+'T00:00:00Z'), winners=new Date(c.winners_date+'T00:00:00Z');
    if(now < open) return 'preopen';
    if(now <= close) return 'open';
    if(now < longlist) return 'reading';
    if(now < shortlist) return 'longlist';
    if(now < winners) return 'shortlist';
    return 'complete';
  }
  function stateLabel(s,c){ return ({preopen:`Submissions open ${fmtDate(c.submission_open)}`,open:'Submissions open',reading:'Submissions closed · Reading in progress',longlist:'Longlist announced',shortlist:'Shortlist announced',complete:'Cycle complete'})[s] || s; }
  function fmtDate(iso, opts={day:'numeric',month:'long',year:'numeric'}){ const d=new Date(iso.length===10?iso+'T12:00:00Z':iso); return new Intl.DateTimeFormat('en-GB',{...opts,timeZone:'UTC'}).format(d); }
  async function initCommon(){
    const [site,cycles]=await Promise.all([get('/data/site.json'),get('/data/cycles.json')]); const c=currentCycle(cycles), s=state(c);
    document.querySelectorAll('[data-current-year]').forEach(el=>el.textContent=c.year);
    document.querySelectorAll('[data-cycle-name]').forEach(el=>el.textContent=c.name);
    document.querySelectorAll('[data-cycle-state]').forEach(el=>el.textContent=stateLabel(s,c));
    document.querySelectorAll('[data-submission-window]').forEach(el=>el.textContent=`${fmtDate(c.submission_open)} — ${fmtDate(c.submission_close)}`);
    document.querySelectorAll('[data-release-window]').forEach(el=>el.textContent=c.release_window);
    document.querySelectorAll('[data-current-cycle-link]').forEach(el=>el.href=c.path);
    document.querySelectorAll('[data-current-cycle-cta]').forEach(el=>{el.textContent=`Enter the ${c.year} Prize`; el.href='/enter/';});
    const tl=document.getElementById('home-timeline'); if(tl){ const yr=c.year; tl.innerHTML=[['Submit',`${fmtDate(c.submission_open,{day:'numeric',month:'short'})} — ${fmtDate(c.submission_close,{day:'numeric',month:'short'})}`],['Eligibility',`Target ${fmtDate(c.eligibility_target,{day:'numeric',month:'short'})}`],['Reading',c.reading.replace(String(yr),'').trim()],['Longlist',fmtDate(c.longlist_date,{day:'numeric',month:'long'})],['Shortlist',fmtDate(c.shortlist_date,{day:'numeric',month:'long'})],['Winner',fmtDate(c.winners_date,{day:'numeric',month:'long'})]].map((x,i)=>`<div class=\"timeline-step\"><b>${x[0]}</b><span>${x[1]}${i===0?'':` ${yr}`}</span></div>`).join(''); }
    const recent=document.querySelector('[data-recent-years]'); if(recent){recent.innerHTML=cycles.slice().sort((a,b)=>b.year-a.year).slice(0,3).map(y=>`<a class=\"year-card\" href=\"${y.path}\"><div class=\"year-number\">${y.year}</div><div><div class=\"year-status\">${y.name}</div><h3>${y.year} ${y.name}</h3><p>${fmtDate(y.submission_open,{day:'numeric',month:'long'})} — ${fmtDate(y.submission_close,{day:'numeric',month:'long',year:'numeric'})}</p></div><div class=\"year-arrow\">→</div></a>`).join('');}
    document.querySelectorAll('[data-prize-descriptor]').forEach(el=>el.textContent=site.descriptor || 'A literary prize for Symbiotic Authorship.');
    document.querySelectorAll('[data-contact]').forEach(el=>{el.textContent=site.contact; if(el.tagName==='A')el.href=`mailto:${site.contact}`});
    const partnerRoots=[...document.querySelectorAll('[data-partners]')];
    if(partnerRoots.length){
      try{
        const pdata=await get('/data/partners.json'), partners=Array.isArray(pdata.partners)?pdata.partners:[], types=pdata.types||{};
        const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
        partnerRoots.forEach(root=>{
          if(!partners.length){ root.hidden=true; root.innerHTML=''; return; }
          const order=Object.keys(types), grouped=new Map();
          partners.forEach(p=>{const key=p.type||'supporting'; if(!grouped.has(key)) grouped.set(key,[]); grouped.get(key).push(p);});
          const keys=[...order.filter(k=>grouped.has(k)),...([...grouped.keys()].filter(k=>!order.includes(k)))];
          root.hidden=false;
          root.innerHTML=keys.map(key=>`<section class="partner-group"><h3 class="partner-group-title">${esc(types[key]||key)}</h3><div class="partner-logos">${grouped.get(key).map(p=>{const body=p.logo?`<img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy">`:`<span class="partner-name">${esc(p.name)}</span>`; return p.url?`<a class="partner-card" href="${esc(p.url)}" target="_blank" rel="noopener">${body}</a>`:`<div class="partner-card">${body}</div>`}).join('')}</div></section>`).join('');
        });
      }catch(err){console.error('Cannot load partners',err); partnerRoots.forEach(root=>root.hidden=true);}
    }
    const nav=document.querySelector('.primary-nav'), toggle=document.querySelector('.nav-toggle'); if(nav&&toggle){toggle.addEventListener('click',()=>{nav.classList.toggle('open');toggle.setAttribute('aria-expanded',nav.classList.contains('open'));});}
    return {site,cycles,c,s};
  }
  return {get,currentCycle,state,stateLabel,fmtDate,initCommon};
})();
document.addEventListener('DOMContentLoaded',()=>MLP.initCommon().catch(console.error));
