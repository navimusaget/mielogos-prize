
function e(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
document.addEventListener('DOMContentLoaded', async()=>{
 const year=Number(document.body.dataset.cycleYear); if(!year)return;
 const [cycles,rec]=await Promise.all([MLP.get('/data/cycles.json'),MLP.get('/data/recognitions.json')]); const c=cycles.find(x=>x.year===year); if(!c)return;
 document.querySelectorAll('[data-year-title]').forEach(x=>x.textContent=`${c.year} ${c.name}`);
 const facts=document.getElementById('cycle-facts'); if(facts) facts.innerHTML=`<div class="fact"><span class="fact-label">Submissions</span><span class="fact-value">1 Feb — 31 May ${c.year}</span></div><div class="fact"><span class="fact-label">Eligible release</span><span class="fact-value">${e(c.release_window)}</span></div><div class="fact"><span class="fact-label">Entry fee</span><span class="fact-value">${e(c.entry_fee)}</span></div><div class="fact"><span class="fact-label">Entries</span><span class="fact-value">Up to ${c.max_entries}</span></div><div class="fact"><span class="fact-label">Categories</span><span class="fact-value">${c.categories.length}</span></div>`;
 const cats=document.getElementById('cycle-categories'); if(cats) cats.innerHTML=c.categories.map((x,i)=>`<div class="card"><div class="card-number">0${i+1}</div><h3>${e(x.name)}</h3><p>${({fiction:'Novels, novellas, short stories, story collections and other forms of fiction prose.',poetry:'Publicly released individual poems, sequences, chapbooks and collections.', 'literary-nonfiction':'Memoir, literary and personal essay, narrative nonfiction and related literary forms.', 'graphic-hybrid-experimental':'Graphic narrative, hybrid and experimental literature whose form may cross conventional category boundaries.'})[x.id]}</p></div>`).join('');
 const timeline=document.getElementById('cycle-timeline'); if(timeline) timeline.innerHTML=[['Submissions','1 Feb — 31 May'],['Eligibility','Target 30 Jun'],['Reading','Through August'],['Longlist','1 September'],['Shortlist','15 October'],['Winner','1 December']].map(x=>`<div class="timeline-step"><b>${x[0]}</b><span>${x[1]} ${year}</span></div>`).join('');
 for(const [id,level,date] of [['year-longlist','Longlist',c.longlist_date],['year-shortlist','Shortlist',c.shortlist_date],['year-winners','Winner',c.winners_date]]){
  const el=document.getElementById(id); if(!el)continue; const rows=rec.filter(r=>r.year===year&&r.level===level);
  if(rows.length) el.innerHTML=rows.map(r=>`<article class="year-card"><div><div class="year-status">${e(r.category)}</div><h3>${e(r.work_title)}</h3><p>${e(r.author_display)}</p></div><div></div><a href="/verify/?id=${encodeURIComponent(r.public_id)}">Verify →</a></article>`).join('');
  else el.innerHTML=`<div class="empty-state">${level==='Winner'?'Winner':'The '+level.toLowerCase()} records will be published here on ${MLP.fmtDate(date)}.</div>`;
 }
});
