document.addEventListener('DOMContentLoaded',async()=>{
  const x=await MLP.get('/data/works.json');
  const t=document.getElementById('records');
  if(!t) return;
  if(!x.length){
    t.innerHTML='<div class="empty-state">The Works library begins when the 2027 Longlist is announced.</div>';
    return;
  }
  t.innerHTML=x.map(w=>`
    <article class="year-card">
      <div class="year-number">${MLP.esc(w.year||'')}</div>
      <div>
        <div class="year-status">${MLP.esc(w.category||'')}</div>
        <h3>${MLP.esc(w.title)}</h3>
        <p>${MLP.esc(w.author_display||'')}</p>
      </div>
      <div class="year-arrow">→</div>
    </article>`).join('');
});
