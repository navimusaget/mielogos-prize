document.addEventListener('DOMContentLoaded',async()=>{
  const x=await MLP.get('/data/authors.json');
  const t=document.getElementById('records');
  if(!t) return;
  if(!x.length){
    t.innerHTML='<div class="empty-state">The Authors library begins with the first published 2027 recognition records.</div>';
    return;
  }
  t.innerHTML=x.map(a=>`
    <article class="year-card">
      <div class="year-number">${MLP.esc(a.initial||'')}</div>
      <div>
        <h3>${MLP.esc(a.display_name)}</h3>
        <p>${MLP.esc(a.recognition_summary||'')}</p>
      </div>
      <div class="year-arrow">→</div>
    </article>`).join('');
});
