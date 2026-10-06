function e(s){return MLP.esc(s);}

document.addEventListener('DOMContentLoaded', async()=>{
  const year=Number(document.body.dataset.cycleYear);
  if(!year) return;

  const [cycles,rec]=await Promise.all([
    MLP.get('/data/cycles.json'),
    MLP.get('/data/recognitions.json')
  ]);
  const c=cycles.find(x=>x.year===year);
  if(!c) return;

  const compact=(iso)=>MLP.fmtDate(iso,{day:'numeric',month:'short'});
  const full=(iso)=>MLP.fmtDate(iso,{day:'numeric',month:'long',year:'numeric'});

  document.querySelectorAll('[data-year-title]').forEach(x=>x.textContent=`${c.year} ${c.name}`);
  document.querySelectorAll('[data-year-intro]').forEach(x=>x.textContent=c.intro || `The ${c.year} MIELOGOS Literary Prize cycle — from open entry to permanent public recognition.`);
  document.querySelectorAll('[data-year-record-label]').forEach(x=>x.textContent=`${c.year} public record`);

  const facts=document.getElementById('cycle-facts');
  if(facts) facts.innerHTML=`
    <div class="fact"><span class="fact-label">Submissions</span><span class="fact-value">${compact(c.submission_open)} — ${full(c.submission_close)}</span></div>
    <div class="fact"><span class="fact-label">Eligible release</span><span class="fact-value">${e(c.release_window)}</span></div>
    <div class="fact"><span class="fact-label">Entry fee</span><span class="fact-value">${e(c.entry_fee)}</span></div>
    <div class="fact"><span class="fact-label">Entries</span><span class="fact-value">Up to ${e(c.max_entries)}</span></div>
    <div class="fact"><span class="fact-label">Categories</span><span class="fact-value">${e(c.categories.length)}</span></div>`;

  const desc={
    fiction:'Novels, novellas, short stories, story collections and other forms of fiction prose.',
    poetry:'Publicly released individual poems, sequences, chapbooks and collections.',
    'literary-nonfiction':'Memoir, literary and personal essay, narrative nonfiction and related literary forms.',
    'graphic-hybrid-experimental':'Graphic narrative, hybrid and experimental literature whose form may cross conventional category boundaries.'
  };
  const cats=document.getElementById('cycle-categories');
  if(cats) cats.innerHTML=c.categories.map((x,i)=>`
    <div class="card">
      <div class="card-number">${String(i+1).padStart(2,'0')}</div>
      <h3>${e(x.name)}</h3>
      <p>${e(desc[x.id] || '')}</p>
    </div>`).join('');

  const timeline=document.getElementById('cycle-timeline');
  if(timeline) timeline.innerHTML=[
    ['Submissions',`${compact(c.submission_open)} — ${full(c.submission_close)}`],
    ['Eligibility',`Target ${full(c.eligibility_target)}`],
    ['Reading',c.reading],
    ['Longlist',full(c.longlist_date)],
    ['Shortlist',full(c.shortlist_date)],
    ['Winner',full(c.winners_date)]
  ].map(x=>`<div class="timeline-step"><b>${e(x[0])}</b><span>${e(x[1])}</span></div>`).join('');

  for(const [id,level,date] of [
    ['year-longlist','Longlist',c.longlist_date],
    ['year-shortlist','Shortlist',c.shortlist_date],
    ['year-winners','Winner',c.winners_date]
  ]){
    const el=document.getElementById(id);
    if(!el) continue;
    const rows=rec.filter(r=>r.year===year && MLP.hasRecognitionLevel(r,level));
    if(rows.length){
      el.innerHTML=rows.map(r=>`
        <article class="year-card">
          <div>
            <div class="year-status">${e(r.category)}</div>
            <h3>${e(r.work_title)}</h3>
            <p>${e(r.author_display)}</p>
          </div>
          <div></div>
          <a href="/verify/?id=${encodeURIComponent(r.public_id)}">Verify →</a>
        </article>`).join('');
    }else{
      el.innerHTML=`<div class="empty-state">${level==='Winner'?'Winner':`The ${level.toLowerCase()}`} records will be published here on ${full(date)}.</div>`;
    }
  }
});
