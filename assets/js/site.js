const MLP = (() => {
  const cache = {};
  let initPromise = null;

  function loadAuditCss(){
    if(document.querySelector('link[data-mielogos-audit-v07]')) return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='/assets/css/audit-v07.css';
    link.dataset.mielogosAuditV07='true';
    document.head.appendChild(link);
  }

  async function get(path){
    if(cache[path]) return cache[path];
    cache[path]=fetch(path,{cache:'no-store'}).then(async r=>{
      if(!r.ok) throw new Error(`Cannot load ${path}`);
      return r.json();
    }).catch(err=>{ delete cache[path]; throw err; });
    return cache[path];
  }

  function currentCycle(cycles){
    return cycles.find(c=>c.current) || cycles.slice().sort((a,b)=>b.year-a.year)[0];
  }

  function state(c, now=new Date()){
    const open=new Date(c.submission_open);
    const close=new Date(c.submission_close);
    const longlist=new Date(c.longlist_date+'T00:00:00Z');
    const shortlist=new Date(c.shortlist_date+'T00:00:00Z');
    const winners=new Date(c.winners_date+'T00:00:00Z');
    if(now < open) return 'preopen';
    if(now <= close) return 'open';
    if(now < longlist) return 'reading';
    if(now < shortlist) return 'longlist';
    if(now < winners) return 'shortlist';
    return 'complete';
  }

  function stateLabel(s,c){
    return ({
      preopen:`Submissions open ${fmtDate(c.submission_open)}`,
      open:'Submissions open',
      reading:'Submissions closed · Reading in progress',
      longlist:'Longlist announced',
      shortlist:'Shortlist announced',
      complete:'Cycle complete'
    })[s] || s;
  }

  function fmtDate(iso, opts={day:'numeric',month:'long',year:'numeric'}){
    const d=new Date(iso.length===10?iso+'T12:00:00Z':iso);
    return new Intl.DateTimeFormat('en-GB',{...opts,timeZone:'UTC'}).format(d);
  }

  function esc(v){
    return String(v??'').replace(/[&<>"']/g,ch=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[ch]));
  }

  function recognitionLevels(record){
    const levels=[];
    if(Array.isArray(record?.recognition_history)){
      record.recognition_history.forEach(x=>{
        const level=typeof x==='string'?x:x?.level;
        if(level && !levels.includes(level)) levels.push(level);
      });
    }
    if(Array.isArray(record?.levels)){
      record.levels.forEach(level=>{ if(level && !levels.includes(level)) levels.push(level); });
    }
    if(record?.level && !levels.includes(record.level)) levels.push(record.level);
    const rank={Longlist:1,Shortlist:2,Winner:3};
    return levels.sort((a,b)=>(rank[a]||99)-(rank[b]||99));
  }

  function hasRecognitionLevel(record, level){
    return recognitionLevels(record).includes(level);
  }

  function highestRecognitionLevel(record){
    const levels=recognitionLevels(record);
    return levels[levels.length-1] || '';
  }

  function safeExternalUrl(value){
    try{
      const u=new URL(String(value||''),location.origin);
      return (u.protocol==='https:' || u.protocol==='http:') ? u.href : '';
    }catch(_){ return ''; }
  }

  function ensureMeta(){
    const title=document.title || 'MIELOGOS Literary Prize';
    const descEl=document.querySelector('meta[name="description"]');
    const description=descEl?.content || 'The MIELOGOS Literary Prize recognizes outstanding literature created through Symbiotic Authorship.';
    const is404=/page not found/i.test(title);
    const canonical=`https://prize.mielogos.org${location.pathname}`;
    const imageUrl='https://prize.mielogos.org/assets/img/mielogos-prize-seal-primary.png';

    if(is404){
      let robots=document.querySelector('meta[name="robots"]');
      if(!robots){ robots=document.createElement('meta'); robots.name='robots'; document.head.appendChild(robots); }
      robots.content='noindex,follow';
      return;
    }

    let canonicalEl=document.querySelector('link[rel="canonical"]');
    if(!canonicalEl){ canonicalEl=document.createElement('link'); canonicalEl.rel='canonical'; document.head.appendChild(canonicalEl); }
    canonicalEl.href=canonical;

    const entries=[
      ['property','og:type','website'],
      ['property','og:site_name','MIELOGOS Literary Prize'],
      ['property','og:title',title],
      ['property','og:description',description],
      ['property','og:url',canonical],
      ['property','og:image',imageUrl],
      ['property','og:image:alt','MIELOGOS Literary Prize primary seal'],
      ['name','twitter:card','summary'],
      ['name','twitter:title',title],
      ['name','twitter:description',description],
      ['name','twitter:image',imageUrl]
    ];
    entries.forEach(([attr,key,value])=>{
      let el=document.head.querySelector(`meta[${attr}="${key}"]`);
      if(!el){ el=document.createElement('meta'); el.setAttribute(attr,key); document.head.appendChild(el); }
      el.content=value;
    });
  }

  function normalizePath(path){
    let p=path || '/';
    if(!p.startsWith('/')) p='/'+p;
    p=p.replace(/index\.html$/,'');
    if(p!=='/' && !p.endsWith('/')) p+='/';
    return p;
  }

  function fixCurrentNavigation(){
    const here=normalizePath(location.pathname);
    document.querySelectorAll('.primary-nav a[aria-current]').forEach(a=>a.removeAttribute('aria-current'));
    document.querySelectorAll('.primary-nav a[href]').forEach(a=>{
      try{
        const target=normalizePath(new URL(a.getAttribute('href'),location.origin).pathname);
        if(target===here) a.setAttribute('aria-current','page');
      }catch(_){}
    });
  }

  function installMobileNavigation(){
    const nav=document.querySelector('.primary-nav');
    const toggle=document.querySelector('.nav-toggle');
    if(!nav || !toggle || toggle.dataset.bound==='true') return;
    toggle.dataset.bound='true';
    if(!nav.id) nav.id='primary-navigation';
    toggle.setAttribute('aria-controls',nav.id);

    const setOpen=(open, returnFocus=false)=>{
      nav.classList.toggle('open',open);
      toggle.setAttribute('aria-expanded',String(open));
      if(returnFocus) toggle.focus();
    };

    toggle.addEventListener('click',()=>setOpen(!nav.classList.contains('open')));
    nav.addEventListener('click',ev=>{
      if(ev.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown',ev=>{
      if(ev.key==='Escape' && nav.classList.contains('open')) setOpen(false,true);
    });
    window.addEventListener('resize',()=>{
      if(window.innerWidth>980 && nav.classList.contains('open')) setOpen(false);
    });
  }

  function addPositioningLink(){
    document.querySelectorAll('.footer-col').forEach(col=>{
      const h=col.querySelector('h4');
      if(h?.textContent.trim()==='The Prize' && !col.querySelector('a[href="/positioning/"]')){
        const a=document.createElement('a');
        a.href='/positioning/';
        a.textContent='Research & Positioning';
        col.appendChild(a);
      }
    });
  }

  function insertHomePositioning(){
    if(normalizePath(location.pathname)!=='/' || document.getElementById('positioning')) return;
    const partners=document.getElementById('partners');
    if(!partners) return;
    const section=document.createElement('section');
    section.className='section positioning-band';
    section.id='positioning';
    section.innerHTML=`
      <div class="container">
        <div class="section-intro">
          <div>
            <p class="eyebrow">Research &amp; positioning</p>
            <h2>AI use is not enough.</h2>
          </div>
          <div>
            <p class="lede">MIELOGOS recognizes a relation, not a percentage.</p>
            <p>Its eligibility boundary is not the mere presence, quantity or technical use of AI, but a formally defined creative relation in which human and artificial activity materially condition the developing work.</p>
          </div>
        </div>
        <div class="positioning-grid">
          <article class="positioning-card">
            <span class="positioning-kicker">01</span>
            <h3>AI presence is not the criterion.</h3>
            <p>AI-assisted, AI-generated, collaborative and symbiotic authorship may overlap, but they are not interchangeable categories.</p>
          </article>
          <article class="positioning-card">
            <span class="positioning-kicker">02</span>
            <h3>Relation before percentage.</h3>
            <p>A high quantity of AI-generated prose does not itself establish symbiotic authorship. A smaller surviving textual contribution may still be material if the relation changed the work.</p>
          </article>
          <article class="positioning-card priority-card">
            <span class="positioning-kicker">03 · Qualified claim</span>
            <h3>To our knowledge…</h3>
            <p>MIELOGOS is the first literary prize dedicated specifically to works qualifying under a formal definition of symbiotic authorship.</p>
            <p class="positioning-note">Research cut-off: 7 October 2026 · open to revision if earlier equivalent institutional prior art is confirmed.</p>
          </article>
        </div>
        <div class="positioning-close">
          <blockquote>The purpose of the distinction is not to be first.<br>The purpose is to be precise.</blockquote>
          <p><a href="/positioning/">Read the research &amp; positioning summary →</a></p>
        </div>
      </div>`;
    partners.before(section);
  }

  function cleanEnterImplementationCopy(){
    if(normalizePath(location.pathname)!=='/enter/') return;
    document.querySelectorAll('.submit-panel p').forEach(p=>{
      if(p.textContent.includes('data/cycles.json') || p.textContent.includes('tested official submission URL')){
        p.textContent='The official submission portal will become available here when submissions open.';
        p.removeAttribute('style');
        p.classList.add('submission-public-note');
      }
    });
  }

  async function initCommon(){
    if(initPromise) return initPromise;
    initPromise=(async()=>{
      loadAuditCss();
      ensureMeta();

      const [site,cycles]=await Promise.all([get('/data/site.json'),get('/data/cycles.json')]);
      const c=currentCycle(cycles), s=state(c);

      document.querySelectorAll('[data-current-year]').forEach(el=>el.textContent=c.year);
      document.querySelectorAll('[data-cycle-name]').forEach(el=>el.textContent=c.name);
      document.querySelectorAll('[data-cycle-state]').forEach(el=>el.textContent=stateLabel(s,c));
      document.querySelectorAll('[data-submission-window]').forEach(el=>el.textContent=`${fmtDate(c.submission_open)} — ${fmtDate(c.submission_close)}`);
      document.querySelectorAll('[data-release-window]').forEach(el=>el.textContent=c.release_window);
      document.querySelectorAll('[data-current-cycle-link]').forEach(el=>el.href=c.path);
      document.querySelectorAll('[data-current-cycle-cta]').forEach(el=>{
        el.textContent=`Enter the ${c.year} Prize`;
        el.href='/enter/';
      });

      const tl=document.getElementById('home-timeline');
      if(tl){
        const yr=c.year;
        tl.innerHTML=[
          ['Submit',`${fmtDate(c.submission_open,{day:'numeric',month:'short'})} — ${fmtDate(c.submission_close,{day:'numeric',month:'short'})}`],
          ['Eligibility',`Target ${fmtDate(c.eligibility_target,{day:'numeric',month:'short'})}`],
          ['Reading',String(c.reading||'').replace(String(yr),'').trim()],
          ['Longlist',fmtDate(c.longlist_date,{day:'numeric',month:'long'})],
          ['Shortlist',fmtDate(c.shortlist_date,{day:'numeric',month:'long'})],
          ['Winner',fmtDate(c.winners_date,{day:'numeric',month:'long'})]
        ].map((x,i)=>`<div class="timeline-step"><b>${esc(x[0])}</b><span>${esc(x[1])}${i===0?'':` ${yr}`}</span></div>`).join('');
      }

      const recent=document.querySelector('[data-recent-years]');
      if(recent){
        recent.innerHTML=cycles.slice().sort((a,b)=>b.year-a.year).slice(0,3).map(y=>`
          <a class="year-card" href="${esc(y.path)}">
            <div class="year-number">${esc(y.year)}</div>
            <div>
              <div class="year-status">${esc(y.name)}</div>
              <h3>${esc(y.year)} ${esc(y.name)}</h3>
              <p>${fmtDate(y.submission_open,{day:'numeric',month:'long'})} — ${fmtDate(y.submission_close,{day:'numeric',month:'long',year:'numeric'})}</p>
            </div>
            <div class="year-arrow">→</div>
          </a>`).join('');
      }

      document.querySelectorAll('[data-prize-descriptor]').forEach(el=>el.textContent=site.descriptor || 'A literary prize for Symbiotic Authorship.');
      document.querySelectorAll('[data-contact]').forEach(el=>{
        el.textContent=site.contact;
        if(el.tagName==='A') el.href=`mailto:${site.contact}`;
      });

      const partnerRoots=[...document.querySelectorAll('[data-partners]')];
      if(partnerRoots.length){
        try{
          const pdata=await get('/data/partners.json');
          const partners=Array.isArray(pdata.partners)?pdata.partners:[];
          const types=pdata.types||{};
          partnerRoots.forEach(root=>{
            if(!partners.length){ root.hidden=true; root.innerHTML=''; return; }
            const order=Object.keys(types), grouped=new Map();
            partners.forEach(p=>{
              const key=p.type||'supporting';
              if(!grouped.has(key)) grouped.set(key,[]);
              grouped.get(key).push(p);
            });
            const keys=[
              ...order.filter(k=>grouped.has(k)),
              ...([...grouped.keys()].filter(k=>!order.includes(k)))
            ];
            root.hidden=false;
            root.innerHTML=keys.map(key=>`
              <section class="partner-group">
                <h3 class="partner-group-title">${esc(types[key]||key)}</h3>
                <div class="partner-logos">
                  ${grouped.get(key).map(p=>{
                    const body=p.logo
                      ? `<img src="${esc(p.logo)}" alt="${esc(p.name)}" loading="lazy">`
                      : `<span class="partner-name">${esc(p.name)}</span>`;
                    const safeUrl=safeExternalUrl(p.url);
                    return safeUrl
                      ? `<a class="partner-card" href="${esc(safeUrl)}" target="_blank" rel="noopener">${body}</a>`
                      : `<div class="partner-card">${body}</div>`;
                  }).join('')}
                </div>
              </section>`).join('');
          });
        }catch(err){
          console.error('Cannot load partners',err);
          partnerRoots.forEach(root=>root.hidden=true);
        }
      }

      addPositioningLink();
      insertHomePositioning();
      cleanEnterImplementationCopy();
      fixCurrentNavigation();
      installMobileNavigation();

      return {site,cycles,c,s};
    })();
    return initPromise;
  }

  loadAuditCss();

  return {
    get,currentCycle,state,stateLabel,fmtDate,esc,
    recognitionLevels,hasRecognitionLevel,highestRecognitionLevel,
    initCommon
  };
})();

document.addEventListener('DOMContentLoaded',()=>MLP.initCommon().catch(console.error));
