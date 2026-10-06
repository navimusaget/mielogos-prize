function esc(s){return MLP.esc(s);}
document.addEventListener('DOMContentLoaded', async()=>{
  const mode=document.body.dataset.libraryMode;
  if(!mode) return;

  const cycles=await MLP.get('/data/cycles.json');
  const rec=await MLP.get('/data/recognitions.json');
  const target=document.getElementById('library-results');
  if(!target) return;

  if(mode==='years'){
    target.innerHTML=cycles.slice().sort((a,b)=>b.year-a.year).map(c=>`
      <a class="year-card" href="${esc(c.path)}">
        <div class="year-number">${esc(c.year)}</div>
        <div>
          <div class="year-status">${esc(c.name)}</div>
          <h3>${esc(c.year)} ${esc(c.name)}</h3>
          <p>${esc(c.release_window)} · ${esc(c.categories.length)} categories</p>
        </div>
        <div class="year-arrow">→</div>
      </a>`).join('');
    return;
  }

  const statusMap={winners:'Winner',shortlists:'Shortlist',longlists:'Longlist'};
  const wanted=statusMap[mode];
  const rows=rec.filter(r=>MLP.hasRecognitionLevel(r,wanted));

  if(!rows.length){
    target.innerHTML=`<div class="empty-state">The public ${esc(wanted.toLowerCase())} archive begins with the 2027 Founding Cycle. Records will appear here when announced.</div>`;
    return;
  }

  target.innerHTML=rows.map(r=>`
    <article class="year-card">
      <div class="year-number">${esc(r.year)}</div>
      <div>
        <div class="year-status">${esc(r.category)} · ${esc(wanted)}</div>
        <h3>${esc(r.work_title)}</h3>
        <p>${esc(r.author_display)}</p>
      </div>
      <a class="year-arrow" href="/verify/?id=${encodeURIComponent(r.public_id)}" aria-label="Verify ${esc(r.public_id)}">→</a>
    </article>`).join('');
});
